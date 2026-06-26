#!/usr/bin/env node
/**
 * Fetches coach.com Home-Show HTML and extracts the first two mol-banner hero modules.
 * Run: npm run sync:heroes
 * Requires network access (VPN may be needed if Akamai blocks your IP).
 */
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_FILE = path.resolve(__dirname, '../src/data/homepageHeroes.live.json')
const HOMEPAGE_URL = process.env.COACH_HOMEPAGE_URL ?? 'https://www.coach.com/'

const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

function cleanText(raw) {
  if (!raw) return ''
  return raw
    .split('.amp-page')[0]
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanHeadline($, el) {
  const clone = $(el).clone()
  clone.find('style').remove()
  return cleanText(clone.text())
}

function normalizeImageUrl(url) {
  if (!url) return null
  const decoded = url.replace(/&amp;/g, '&')
  return decoded.startsWith('//') ? `https:${decoded}` : decoded
}

function pickMobileImageUrl($, banner) {
  const picture = banner.find('.at-media-asset picture').first()
  const mobileSource = picture
    .find('source')
    .filter((_, s) => {
      const media = $(s).attr('media') ?? ''
      return media.includes('max-width') || media.includes('767')
    })
    .first()

  const srcset =
    mobileSource.attr('srcset') ??
    picture.find('source').first().attr('srcset') ??
    picture.find('img').attr('src')

  if (!srcset) return null
  return normalizeImageUrl(srcset.split(',')[0]?.trim().split(/\s+/)[0])
}

function parseBanner($, banner, slotId) {
  const caption = cleanText(banner.find('.at-media-asset__caption').first().text())
  let eyebrow = cleanText(banner.find('.at-eyebrow-text').first().text())
  if (eyebrow.includes('.amp-') || eyebrow.includes('{')) {
    eyebrow = caption.startsWith('@') ? caption : ''
  } else if (!eyebrow && caption.startsWith('@')) {
    eyebrow = caption
  }

  const headlines = banner
    .find('.at-headline-text, h2')
    .map((_, el) => cleanHeadline($, el))
    .get()
    .filter(Boolean)

  let title = headlines[0] ?? ''
  let body = cleanText(banner.find('.at-body-text').first().text())

  if (headlines.includes('Designed for your day.') && headlines.includes('Always by your side.')) {
    title = 'Designed for your day.'
    body = 'Always by your side.'
  }

  const links = banner.find('.links-container a')
  const primaryLink = links.first()
  const secondaryLink = links.eq(1)

  return {
    id: slotId,
    eyebrow: eyebrow || undefined,
    title,
    body,
    primaryCta: cleanText(primaryLink.text()) || 'Shop now',
    primaryHref: primaryLink.attr('href') ?? '#',
    secondaryCta: cleanText(secondaryLink.text()) || undefined,
    secondaryHref: secondaryLink.attr('href') ?? undefined,
    imageUrl: pickMobileImageUrl($, banner),
    syncedAt: new Date().toISOString(),
  }
}

function extractHeroes(html) {
  const $ = cheerio.load(html)
  const heroes = []
  const slot = $('#home_body_slot_2')

  if (!slot.length) {
    throw new Error('home_body_slot_2 not found — homepage structure may have changed.')
  }

  const banners = slot.find('.mol-banner').toArray()

  for (let i = 0; i < banners.length && heroes.length < 2; i++) {
    const banner = $(banners[i])
    const parsed = parseBanner($, banner, 'home_body_slot_2')

    if (!parsed.title && parsed.imageUrl && heroes.length > 0) {
      heroes[heroes.length - 1].imageUrl = parsed.imageUrl
      continue
    }

    if (!parsed.title) continue
    if (parsed.title === 'Catch up on Coach.') break

    heroes.push(parsed)
  }

  return heroes.slice(0, 2)
}

async function main() {
  console.log(`Fetching ${HOMEPAGE_URL} …`)

  const res = await fetch(HOMEPAGE_URL, {
    redirect: 'follow',
    headers: {
      'User-Agent': MOBILE_UA,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`)
  }

  const html = await res.text()

  if (html.includes('Access Denied') && html.includes('edgesuite')) {
    throw new Error(
      'Akamai blocked the request. Try again on VPN or set COACH_HOMEPAGE_URL to a staging URL.',
    )
  }

  const heroes = extractHeroes(html)

  if (heroes.length < 2) {
    throw new Error(`Expected 2 heroes, found ${heroes.length}. Page structure may have changed.`)
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(heroes, null, 2)}\n`)

  console.log(`Wrote ${heroes.length} hero(s) to ${OUT_FILE}`)
  heroes.forEach((h, i) => {
    console.log(`  ${i + 1}. ${h.title}${h.imageUrl ? '' : ' (no image)'}`)
  })
}

main().catch((err) => {
  console.error('sync-homepage-heroes failed:', err.message)
  process.exit(1)
})
