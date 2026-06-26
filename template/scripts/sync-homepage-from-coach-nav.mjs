#!/usr/bin/env node
/**
 * Extracts homepage content from coach-nav.vercel.app production bundle.
 * Run: npm run sync:homepage
 */
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_FILE = path.resolve(__dirname, '../src/data/homepageContent.live.json')
const BASE_URL = process.env.COACH_NAV_URL ?? 'https://coach-nav.vercel.app/'

function backticksToJson(str) {
  return str.replace(/`((?:\\.|[^`\\])*)`/g, (_, inner) => JSON.stringify(inner))
}

function stripEnPrefix(href) {
  if (!href || href === '#') return href
  return href.replace(/^\/en(?=\/)/, '') || href
}

function normalizeHref(obj) {
  if (Array.isArray(obj)) return obj.map(normalizeHref)
  if (obj && typeof obj === 'object') {
    const next = {}
    for (const [key, value] of Object.entries(obj)) {
      if (key.endsWith('Href') || key === 'href') {
        next[key] = stripEnPrefix(value)
      } else {
        next[key] = normalizeHref(value)
      }
    }
    return next
  }
  return obj
}

function expandMeCalls(str) {
  return str.replace(/me\(([^)]+)\)/g, (_, arg) => {
    const id = Function(`"use strict"; return (${arg})`)()
    return JSON.stringify(cmsImageUrl(id))
  })
}

function cmsImageUrl(id) {
  return `https://cms.coach.com/i/coach/${id}?&w=640&fmt=webp&$qlt_med$`
}

function parseUeBlock(js) {
  const start = js.indexOf('var ue={masthead:')
  if (start < 0) throw new Error('homepage data block (var ue=) not found — coach-nav bundle may have changed.')

  const end = js.indexOf('},T=ue.masthead', start)
  if (end < 0) throw new Error('homepage data block end marker not found.')

  const literal = js.slice(start + 'var ue='.length, end + 1)
  const ue = Function(`"use strict"; return (${backticksToJson(literal)})`)()

  const shoulderStart = js.indexOf('he={title:`Bags that meet you', end)
  const shoulderEnd = js.indexOf('},D=[{title:`Bags`', shoulderStart)
  if (shoulderStart < 0 || shoulderEnd < 0) {
    throw new Error('shoulder bags block not found.')
  }
  const shoulderLiteral = expandMeCalls(backticksToJson(js.slice(shoulderStart + 'he='.length, shoulderEnd + 1)))
  const shoulderBags = Function(`"use strict"; return (${shoulderLiteral})`)()

  const categoriesStart = js.indexOf('D=[{title:`Bags`', shoulderEnd)
  const categoriesEnd = js.indexOf('],ge=`Catch up on Coach.`', categoriesStart)
  const shopByCategory = Function(
    `"use strict"; return (${backticksToJson(js.slice(categoriesStart + 'D='.length, categoriesEnd + 1))})`,
  )()

  const subnavStart = js.indexOf('de=[{label:`Women`,href:`#`}', categoriesEnd)
  const subnavEnd = js.indexOf('],fe={id:T?.id', subnavStart)
  const primarySubnav = Function(
    `"use strict"; return (${backticksToJson(js.slice(subnavStart + 'de='.length, subnavEnd + 1))})`,
  )()

  return {
    masthead: ue.masthead,
    cards: ue.cards,
    primarySubnav,
    shoulderBags,
    shopByCategory,
    storiesSectionTitle: 'Catch up on Coach.',
    syncedAt: new Date().toISOString(),
    source: BASE_URL,
  }
}

async function main() {
  console.log(`Fetching ${BASE_URL} …`)
  const indexRes = await fetch(BASE_URL)
  if (!indexRes.ok) throw new Error(`HTTP ${indexRes.status} loading index`)

  const html = await indexRes.text()
  const scriptMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/)
  if (!scriptMatch) throw new Error('Could not find main JS bundle in index.html')

  const bundleUrl = new URL(scriptMatch[1], BASE_URL).href
  console.log(`Fetching bundle ${bundleUrl} …`)

  const bundleRes = await fetch(bundleUrl)
  if (!bundleRes.ok) throw new Error(`HTTP ${bundleRes.status} loading bundle`)

  const js = await bundleRes.text()
  const content = normalizeHref(parseUeBlock(js))

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(content, null, 2)}\n`)

  console.log(`Wrote homepage content to ${OUT_FILE}`)
  console.log(`  masthead: ${content.masthead.title}`)
  console.log(`  cards: ${content.cards.length}`)
  console.log(`  categories: ${content.shopByCategory.length}`)
}

main().catch((err) => {
  console.error('sync-homepage-from-coach-nav failed:', err.message)
  process.exit(1)
})
