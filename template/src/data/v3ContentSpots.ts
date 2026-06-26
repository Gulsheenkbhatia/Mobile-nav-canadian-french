import type { BrandId } from '../components/nav/NavSearchExposed'

/** V3 content spots — L1/L2 configurable image layouts. */

/** L1 tile count layouts — up to 3 images. */
export type V3L1ContentSpotsLayout = 'l1-1' | 'l1-2' | 'l1-3'

/** L2 content-spots tile counts — future CMS-driven layout selection. */
export type V3L2ContentSpotsLayout = 'l2-1' | 'l2-2' | 'l2-3' | 'l2-4' | 'l2-6'

export const V3_L1_CONTENT_SPOTS_LAYOUTS: V3L1ContentSpotsLayout[] = [
  'l1-1',
  'l1-2',
  'l1-3',
]

export const V3_L2_CONTENT_SPOTS_LAYOUTS: V3L2ContentSpotsLayout[] = [
  'l2-1',
  'l2-2',
  'l2-3',
  'l2-4',
  'l2-6',
]

/**
 * L1 placement — where content spots render in the L1 scroll order.
 * - above-categories: after search, before the category list (Coach)
 * - after-category: inline in the category list after an anchor row (Coach Outlet)
 */
export type V3L1ContentSpotsPlacement =
  | { mode: 'above-categories' }
  | { mode: 'after-category'; categoryId: string }

export type V3L1ContentSpotTile = {
  label: string
  image?: string
}

export type V3L1ContentSpotsConfig = {
  placement: V3L1ContentSpotsPlacement
  /** Visual arrangement for 1–3 tiles. */
  layout: V3L1ContentSpotsLayout
  /** 1–3 image links shown at L1. */
  tiles: V3L1ContentSpotTile[]
  /** Tile aspect ratio — defaults to 16:9 when omitted. */
  tileAspectRatio?: V3L1ContentSpotAspectRatio
}

export type V3L2ContentSpotTile = {
  label: string
  image?: string
}

export type V3L2ContentSpotAspectRatio = '16:9' | '4:5'

export type V3L1ContentSpotAspectRatio = V3L2ContentSpotAspectRatio

export type V3L2ContentSpotsConfig = {
  layout: V3L2ContentSpotsLayout
  tiles: V3L2ContentSpotTile[]
  /** Tile aspect ratio — defaults to 16:9 when omitted. */
  tileAspectRatio?: V3L2ContentSpotAspectRatio
  /** Eyebrow above the flat category list (e.g. "Shop by Category"). */
  eyebrow: string
}

const womenShoesImage = '/assets/figma/v2-women-shoes.png'
const womenTabbyImage = '/assets/figma/v2-women-tabby.png'
const womenShoulderImage = '/assets/figma/v2-women-shoulder.png'

const bagsTanImage = '/assets/figma/v3-bags-tan.png'
const bagsBlackImage = '/assets/figma/v3-bags-black.png'
const menMobileImage = '/assets/figma/v3-men-mobile.png'
const newWomensArrivalsImage = '/assets/figma/v3-new-womens-arrivals.png'
const coachtopiaBrooklynImage = '/assets/figma/v3-coachtopia-brooklyn.png'

/** coach-nav.vercel.app Wp — l2-6 grid under Women headline. */
const womenContentSpotImages = [
  womenShoesImage,
  womenTabbyImage,
  womenShoulderImage,
  womenShoulderImage,
  womenShoulderImage,
  womenShoulderImage,
]

/** coach-nav.vercel.app Bp — l2-6 grid under Bags headline. */
const bagsContentSpotImages = [
  bagsTanImage,
  bagsBlackImage,
  bagsTanImage,
  bagsBlackImage,
  bagsTanImage,
  bagsBlackImage,
]

/** Men L2 — l2-4 grid (2×2) under Men headline. */
const menContentSpotTiles: V3L2ContentSpotTile[] = [
  { label: "Men's New Arrivals", image: menMobileImage },
  { label: 'Bags', image: menMobileImage },
  { label: 'Shoes', image: menMobileImage },
  { label: 'Wallets', image: menMobileImage },
]

/** New L2 — l2-2 duo, 4:5 tiles. */
const newContentSpotTiles: V3L2ContentSpotTile[] = [
  { label: "Women's New Arrivals", image: newWomensArrivalsImage },
  { label: "Men's New Arrivals", image: menMobileImage },
]

const newContentSpotsConfig: V3L2ContentSpotsConfig = {
  layout: 'l2-2',
  tiles: newContentSpotTiles,
  tileAspectRatio: '4:5',
  eyebrow: 'Shop by Category',
}

function tilesFromImages(
  images: string[],
  label = 'Copy Goes Here',
): V3L2ContentSpotTile[] {
  return images.map((image) => ({ label, image }))
}

const l2ContentSpotsByCategoryId: Record<string, V3L2ContentSpotsConfig> = {
  women: {
    layout: 'l2-6',
    tiles: tilesFromImages(womenContentSpotImages),
    eyebrow: 'Shop by Category',
  },
  'coach-women': {
    layout: 'l2-6',
    tiles: tilesFromImages(womenContentSpotImages),
    eyebrow: 'Shop by Category',
  },
  'outlet-women': {
    layout: 'l2-6',
    tiles: tilesFromImages(womenContentSpotImages),
    eyebrow: 'Shop by Category',
  },
  'coach-men': {
    layout: 'l2-4',
    tiles: menContentSpotTiles,
    eyebrow: 'Shop by Category',
  },
  'outlet-men-men': {
    layout: 'l2-4',
    tiles: menContentSpotTiles,
    eyebrow: 'Shop by Category',
  },
  new: newContentSpotsConfig,
  'outlet-whats-new': newContentSpotsConfig,
  bags: {
    layout: 'l2-6',
    tiles: tilesFromImages(bagsContentSpotImages),
    eyebrow: 'Shop by Category',
  },
  'outlet-bags-bags': {
    layout: 'l2-6',
    tiles: tilesFromImages(bagsContentSpotImages),
    eyebrow: 'Shop by Category',
  },
  coachtopia: {
    layout: 'l2-1',
    tiles: [{ label: 'The New Brooklyn', image: coachtopiaBrooklynImage }],
    eyebrow: '',
  },
}

const l1ContentSpotsByBrand: Record<BrandId, V3L1ContentSpotsConfig> = {
  coach: {
    placement: { mode: 'above-categories' },
    layout: 'l1-3',
    tiles: [
      { label: 'New Arrivals' },
      { label: 'Women' },
      { label: 'Bags' },
    ],
  },
  outlet: {
    placement: { mode: 'above-categories' },
    layout: 'l1-2',
    tileAspectRatio: '4:5',
    tiles: [
      { label: 'Outlet New Arrivals' },
      { label: 'Clearance' },
    ],
  },
}

export function resolveL1ContentSpotsLayout(
  tileCount: number,
): V3L1ContentSpotsLayout {
  if (tileCount <= 1) return 'l1-1'
  if (tileCount === 2) return 'l1-2'
  return 'l1-3'
}

export function getV3L1ContentSpots(brand: BrandId): V3L1ContentSpotsConfig {
  return l1ContentSpotsByBrand[brand]
}

/** Whether L1 content spots sit inline inside the category list (vs above it). */
export function isL1ContentSpotsInline(placement: V3L1ContentSpotsPlacement): boolean {
  return placement.mode === 'after-category'
}

/** Category id after which inline L1 content spots are inserted, if applicable. */
export function getL1ContentSpotsAnchorCategoryId(
  placement: V3L1ContentSpotsPlacement,
): string | null {
  return placement.mode === 'after-category' ? placement.categoryId : null
}

/** Display labels for L2 flat rows — vercel copy on live sub-category ids. */
export const v3L2LinkLabelOverrides: Record<string, string> = {
  'coach-women-handbags': 'Bags',
  'coach-women-wallets': 'Wallets',
  'coach-women-bag-straps-charms-label': 'Charms & Straps',
  'coach-women-clothes': 'Clothing',
  'outlet-women-bags': 'Bags',
  'outlet-women-wallets': 'Wallets',
  'outlet-accessories-bag-charms-and-accessories': 'Charms & Straps',
  'outlet-women-ready-to-wear': 'Clothing',
}

export function getV3L2ContentSpots(
  categoryId: string,
): V3L2ContentSpotsConfig | undefined {
  return l2ContentSpotsByCategoryId[categoryId]
}

/** L2/L3 nav row label — also used when capturing the tapped row for drill headlines. */
export function getV3L2LinkLabel(subCategoryId: string, fallback: string): string {
  return v3L2LinkLabelOverrides[subCategoryId] ?? fallback
}

/** @deprecated Prefer drill stack `title` captured from the tapped nav row. */
export function getV3DrillTitle(linkId: string, fallback: string): string {
  return getV3L2LinkLabel(linkId, fallback)
}
