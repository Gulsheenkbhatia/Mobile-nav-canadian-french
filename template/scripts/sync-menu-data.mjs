#!/usr/bin/env node
/**
 * Pull mobile nav from local coach-pwa (/api/get-menu-data) and write menuData.live.json.
 *
 * Prerequisite (preferred): coach-pwa running with SFCC credentials
 *   cd coach-pwa && npm run dev
 *
 * Fallback: reads coach-pwa/.env.local and calls SFCC Headless-GetCategoryInfo directly
 *   when PWA is unreachable (use --sfcc to force direct mode)
 *
 * Usage: npm run sync:menu [-- --sfcc]
 * Env:   COACH_PWA_URL (default http://localhost:3000)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(__dirname, '../src/data/menuData.live.json')
const COACH_PWA_ROOT =
  process.env.COACH_PWA_ROOT ??
  join(__dirname, '../../../../coach-pwa')
const ENV_LOCAL = join(COACH_PWA_ROOT, '.env.local')

const PWA_URL = process.env.COACH_PWA_URL ?? 'http://localhost:3000'
const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
const FORCE_SFCC = process.argv.includes('--sfcc')
const MENU_DEPTH = Number(process.env.MENU_DEPTH || '4')
const LOCALE = 'en_US'

function loadEnvLocal() {
  if (!existsSync(ENV_LOCAL)) return {}
  const env = {}
  for (const line of readFileSync(ENV_LOCAL, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    env[key] = val
  }
  return env
}

function getCategoriesByCgIds(menuData, cgIds = []) {
  return cgIds.reduce((sum, cgId) => {
    const category = menuData[cgId]
    return category ? [...sum, category] : sum
  }, [])
}

function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return undefined
  try {
    const urlObj = new URL(url, 'http://localhost:3000')
    return urlObj.pathname + urlObj.search
  } catch {
    return url.startsWith('/') ? url : undefined
  }
}

/** Strip SFCC pipe delimiters and invisible characters from synced nav labels. */
function sanitizeNavLabel(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/[\u200B-\u200D\uFEFF\u00AD\u2060]/g, '')
    .replace(/\s*\|\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function isEmpty(v) {
  if (v == null) return true
  if (Array.isArray(v)) return v.length === 0
  if (isPlainObject(v)) return Object.keys(v).length === 0
  return false
}

function isCategoryVisible(category) {
  const isOutlet = category?.customCategoryAttributes?.c_isOutlet === true
  const isRetailCategory = category?.isOutletSubCategory === false
  return isPlainObject(category) && !isEmpty(category) && (isRetailCategory || !isOutlet)
}

function getRelativeUrl(url) {
  return normalizeUrl(url)
}

function getCategory(category, parentTree = []) {
  const {
    subCategories,
    ID,
    cgid,
    name,
    displayName,
    url,
  } = category

  const categoryId = ID || cgid
  const categoryName = displayName || name || ''
  const parentCategoryTree = isEmpty(parentTree)
    ? [{ cgid: categoryId, name: categoryName }]
    : [...parentTree, { cgid: categoryId, name: categoryName }]

  let parsedSubCategories
  if (Array.isArray(subCategories)) {
    parsedSubCategories = subCategories.reduce((acc, subCategory) => {
      if (isPlainObject(subCategory) && !isEmpty(subCategory)) {
        const updatedParentTree = [...parentTree, { cgid: categoryId, name: categoryName }]
        acc.push(getCategory(subCategory, updatedParentTree))
      }
      return acc
    }, [])
  }

  const relativeUrl =
    getRelativeUrl(url) ||
    (parentCategoryTree.length > 1
      ? `/shop/${parentCategoryTree.map((p) => p.cgid).join('/')}`
      : `/shop/${categoryId}`)

  return {
    name: categoryName,
    cgid: categoryId,
    url: relativeUrl,
    isOutletSubCategory: category.isOutletSubCategory ?? false,
    subCategories: parsedSubCategories,
  }
}

function getCgId(category) {
  return category.cgid
}

function simplifySubCategoriesInCategory(category) {
  return {
    ...category,
    subCategories: (category.subCategories ?? []).map(getCgId),
  }
}

function flatAllCategoriesRecursively(category) {
  const data = Array.isArray(category) ? category : [category]
  return data.reduce((prev, curr) => {
    if (Array.isArray(curr)) {
      return prev.concat(flatAllCategoriesRecursively(curr))
    }
    if (curr?.subCategories?.length) {
      return prev.concat(curr).concat(flatAllCategoriesRecursively(curr.subCategories))
    }
    return prev.concat(curr)
  }, [])
}

function normalizeMenuData(rawCategories) {
  const flatCategoriesArray = flatAllCategoriesRecursively(rawCategories).map(
    simplifySubCategoriesInCategory,
  )

  const flatCategoriesObject = flatCategoriesArray.reduce(
    (sum, category) => ({
      ...sum,
      [category.cgid]: category,
    }),
    {},
  )

  return {
    topCategories: rawCategories.map(getCgId),
    ...flatCategoriesObject,
    length: flatCategoriesArray.length,
  }
}

async function fetchFromSfcc(pathSuffix, env) {
  const siteId = env.SITE_ID_US
  const domain = env.SFCC_BACKEND_DOMAIN_US || 'development.coach.com'
  const username = env.SFCC_AUTH_USERNAME
  const password = env.SFCC_AUTH_PASSWORD

  if (!siteId || !username || !password) {
    throw new Error(
      'Missing SFCC credentials in coach-pwa/.env.local (SITE_ID_US, SFCC_AUTH_USERNAME, SFCC_AUTH_PASSWORD)',
    )
  }

  const endpoint =
    env.NEW_CATEGORY_API === 'true'
      ? 'Headless-GetCategoryInfo'
      : 'Headless-GetSiteCategoryInformation'

  const url = `https://${domain}/on/demandware.store/Sites-${siteId}-Site/${LOCALE}/${endpoint}?${pathSuffix}`
  const auth = Buffer.from(`${username}:${password}`).toString('base64')

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
      'User-Agent': MOBILE_UA,
      host: domain,
      origin: `https://${domain}`,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`SFCC ${endpoint} → ${res.status}${body ? `: ${body.slice(0, 200)}` : ''}`)
  }

  return res.json()
}

async function fetchMenuFromSfcc() {
  const env = loadEnvLocal()
  const menuData = await fetchFromSfcc(`cgid=root&level=${MENU_DEPTH}`, env)
  const rootCategories = menuData?.categories?.[0] ?? []

  if (!Array.isArray(rootCategories) || !rootCategories.length) {
    throw new Error('SFCC returned no root categories — is OneSite enabled for this site?')
  }

  const normalizedRootCategories = {}

  for (const rootCategory of rootCategories) {
    const rootId = rootCategory.ID || rootCategory.cgid
    const isCoachtopia = rootId === 'coachtopia'

    let categories = (rootCategory.subCategories ?? [])
      .filter((category) => isCategoryVisible(category))
      .map((category) => getCategory(category, []))

    const coachtopiaRootCategory = isCoachtopia
      ? getCategory({ ...rootCategory, subCategories: rootCategory.subCategories ?? [] }, [])
      : null

    const normalizedCategories = normalizeMenuData(categories)
    normalizedRootCategories[rootId] = normalizedCategories

    if (isCoachtopia && coachtopiaRootCategory) {
      normalizedRootCategories[rootId].coachtopia = {
        ...coachtopiaRootCategory,
        subCategories: (coachtopiaRootCategory.subCategories ?? []).map(getCgId),
      }
    }
  }

  return [normalizedRootCategories]
}

function toLink(category) {
  const href = normalizeUrl(category.url)
  const link = {
    id: category.cgid,
    label: sanitizeNavLabel(category.name ?? category.cgid),
  }
  if (href) link.href = href
  return link
}

const GENERIC_SECTION_EYEBROW = 'Shop by Category'

function computeShowEyebrow({ depth, screenTitle, sectionCount, eyebrow }) {
  if (depth === 'l3') return false
  if (sectionCount > 1) return Boolean(eyebrow?.trim())
  const text = eyebrow?.trim() ?? ''
  if (!text) return false
  if (text.toLowerCase() === screenTitle.trim().toLowerCase()) return false
  if (text === GENERIC_SECTION_EYEBROW) return false
  return true
}

function makeSection(id, eyebrow, links, { depth, screenTitle, sectionCount }) {
  const section = {
    id,
    links,
    showEyebrow: computeShowEyebrow({ depth, screenTitle, sectionCount, eyebrow }),
  }
  if (eyebrow) section.eyebrow = eyebrow
  return section
}

function buildSectionsFromChildren(children, eyebrow, ctx) {
  if (!children.length) return []
  const label = eyebrow ?? GENERIC_SECTION_EYEBROW
  return [
    makeSection('shop-by-category', label, children.map(toLink), {
      ...ctx,
      sectionCount: 1,
    }),
  ]
}

function buildSubCategory(t2, menuData) {
  const t3Children = getCategoriesByCgIds(menuData, t2.subCategories ?? [])
  const screenTitle = sanitizeNavLabel(t2.name ?? t2.cgid)
  const l3Ctx = { depth: 'l3', screenTitle, sectionCount: 1 }

  if (t3Children.length > 0) {
    return {
      id: t2.cgid,
      label: screenTitle,
      sections: buildSectionsFromChildren(
        t3Children,
        screenTitle,
        l3Ctx,
      ),
    }
  }

  const selfLink = toLink(t2)
  return {
    id: t2.cgid,
    label: screenTitle,
    sections: [
      makeSection('shop', screenTitle, [selfLink], l3Ctx),
    ],
  }
}

function buildCategoryDetail(t1, menuData) {
  const t2Children = getCategoriesByCgIds(menuData, t1.subCategories ?? [])
  const screenTitle = sanitizeNavLabel(t1.name ?? t1.cgid)
  const l2Ctx = { depth: 'l2', screenTitle, sectionCount: 1 }

  if (!t2Children.length) {
    const selfLink = toLink(t1)
    return {
      id: t1.cgid,
      label: screenTitle,
      sections: [
        makeSection(
          'shop',
          screenTitle,
          selfLink.href || selfLink.label ? [selfLink] : [],
          l2Ctx,
        ),
      ],
    }
  }

  const anyT2HasChildren = t2Children.some(
    (t2) => getCategoriesByCgIds(menuData, t2.subCategories ?? []).length > 0,
  )

  if (anyT2HasChildren) {
    return {
      id: t1.cgid,
      label: screenTitle,
      subCategories: t2Children.map((t2) => buildSubCategory(t2, menuData)),
    }
  }

  return {
    id: t1.cgid,
    label: screenTitle,
    sections: buildSectionsFromChildren(t2Children, GENERIC_SECTION_EYEBROW, {
      ...l2Ctx,
      sectionCount: 1,
    }),
  }
}

function buildBrandMenu(brandMenuData) {
  if (!brandMenuData?.topCategories?.length) {
    return { topCategories: [], categories: {} }
  }

  const topCategories = brandMenuData.topCategories.map((cgid) => {
    const cat = brandMenuData[cgid]
    return {
      id: cgid,
      label: sanitizeNavLabel(cat?.name ?? cgid),
    }
  })

  const categories = {}
  for (const cgid of brandMenuData.topCategories) {
    const t1 = brandMenuData[cgid]
    if (t1) {
      categories[cgid] = buildCategoryDetail(t1, brandMenuData)
    }
  }

  return { topCategories, categories }
}

function buildCoachtopiaDetail(coachtopiaBrandData) {
  const root =
    coachtopiaBrandData?.coachtopia ??
    coachtopiaBrandData?.[coachtopiaBrandData.topCategories?.[0]]
  if (!root) return null

  const t2Children = getCategoriesByCgIds(coachtopiaBrandData, root.subCategories ?? [])
  if (!t2Children.length) {
    return buildCategoryDetail(root, coachtopiaBrandData)
  }

  const anyT2HasChildren = t2Children.some(
    (t2) => getCategoriesByCgIds(coachtopiaBrandData, t2.subCategories ?? []).length > 0,
  )

  if (anyT2HasChildren) {
    return {
      id: 'coachtopia',
      label: root.name ?? 'Coachtopia',
      subCategories: t2Children.map((t2) => buildSubCategory(t2, coachtopiaBrandData)),
    }
  }

  return {
    id: 'coachtopia',
    label: root.name ?? 'Coachtopia',
    sections: buildSectionsFromChildren(t2Children),
  }
}

function mergeCoachWithCoachtopia(coachMenu, coachtopiaBrandData) {
  const coachtopiaDetail = buildCoachtopiaDetail(coachtopiaBrandData)
  if (!coachtopiaDetail) return coachMenu

  const hasCoachtopiaL1 = coachMenu.topCategories.some((c) => c.id === 'coachtopia')
  const topCategories = hasCoachtopiaL1
    ? coachMenu.topCategories
    : [
        ...coachMenu.topCategories,
        { id: 'coachtopia', label: coachtopiaDetail.label ?? 'Coachtopia' },
      ]

  return {
    topCategories,
    categories: {
      ...coachMenu.categories,
      coachtopia: coachtopiaDetail,
    },
  }
}

function transformOneSiteResponse(raw) {
  const roots = Array.isArray(raw) ? raw[0] : raw
  if (!roots || typeof roots !== 'object') {
    throw new Error('Unexpected menu response shape')
  }

  const coachRaw = roots.coach
  const outletRaw = roots.outlet
  const coachtopiaRaw = roots.coachtopia

  if (coachRaw && outletRaw) {
    let coach = buildBrandMenu(coachRaw)
    if (coachtopiaRaw) {
      coach = mergeCoachWithCoachtopia(coach, coachtopiaRaw)
    }
    return {
      source: 'oneSite',
      coach,
      outlet: buildBrandMenu(outletRaw),
    }
  }

  console.warn(
    'Warning: OneSite shape not detected (expected coach + outlet roots). Using single-tree fallback.',
  )
  const single = buildBrandMenu(roots)
  return {
    source: 'singleTree',
    coach: single,
    outlet: { topCategories: [], categories: {} },
  }
}

async function fetchMenuFromPwa() {
  const url = `${PWA_URL.replace(/\/$/, '')}/api/get-menu-data?locale=${LOCALE}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': MOBILE_UA,
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`GET ${url} → ${res.status}${body ? `: ${body.slice(0, 200)}` : ''}`)
  }

  return res.json()
}

async function fetchMenuData() {
  if (FORCE_SFCC) {
    console.log('Using SFCC direct fetch (--sfcc) …')
    return fetchMenuFromSfcc()
  }

  try {
    console.log(`Fetching menu from ${PWA_URL}/api/get-menu-data …`)
    return await fetchMenuFromPwa()
  } catch (err) {
    if (existsSync(ENV_LOCAL)) {
      console.warn(`PWA unavailable (${err.message}). Falling back to SFCC direct fetch …`)
      return fetchMenuFromSfcc()
    }
    console.error(`\nCould not reach coach-pwa at ${PWA_URL}`)
    console.error('Start coach-pwa first:  cd coach-pwa && npm run dev')
    console.error('Or ensure coach-pwa/.env.local exists for SFCC direct fallback.\n')
    throw err
  }
}

async function main() {
  const raw = await fetchMenuData()
  const transformed = transformOneSiteResponse(raw)

  const output = {
    syncedAt: new Date().toISOString(),
    source: transformed.source,
    coach: transformed.coach,
    outlet: transformed.outlet,
  }

  writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8')

  const coachL1 = output.coach.topCategories.map((c) => c.label).join(', ')
  const outletL1 = output.outlet.topCategories.map((c) => c.label).join(', ')
  console.log(`Wrote ${OUT_PATH}`)
  console.log(`  Coach L1 (${output.coach.topCategories.length}): ${coachL1}`)
  console.log(`  Outlet L1 (${output.outlet.topCategories.length}): ${outletL1}`)
  console.log(
    `  Coach categories: ${Object.keys(output.coach.categories).length}, Outlet: ${Object.keys(output.outlet.categories).length}`,
  )
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
