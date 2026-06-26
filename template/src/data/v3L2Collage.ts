/** V3 L2 image collage + eyebrow — aligned with coach-nav.vercel.app V3 fixtures. */

import type { BrandId } from '../components/nav/NavSearchExposed'

export type V3L2CollageConfig = {
  images: string[]
  /** Eyebrow above the flat category list (vercel: "Shop by Category"). */
  eyebrow: string
}

const womenShoesImage = '/assets/figma/v2-women-shoes.png'
const womenTabbyImage = '/assets/figma/v2-women-tabby.png'
const womenShoulderImage = '/assets/figma/v2-women-shoulder.png'

const bagsTanImage = '/assets/figma/v3-bags-tan.png'
const bagsBlackImage = '/assets/figma/v3-bags-black.png'

/** coach-nav.vercel.app Wp — 2×3 grid under Women headline. */
const womenCollageImages = [
  womenShoesImage,
  womenTabbyImage,
  womenShoulderImage,
  womenShoulderImage,
  womenShoulderImage,
  womenShoulderImage,
]

/** coach-nav.vercel.app Bp — 2×3 grid under Bags headline. */
const bagsCollageImages = [
  bagsTanImage,
  bagsBlackImage,
  bagsTanImage,
  bagsBlackImage,
  bagsTanImage,
  bagsBlackImage,
]

const collageByCategoryId: Record<string, V3L2CollageConfig> = {
  women: {
    images: womenCollageImages,
    eyebrow: 'Shop by Category',
  },
  'coach-women': {
    images: womenCollageImages,
    eyebrow: 'Shop by Category',
  },
  'outlet-women': {
    images: womenCollageImages,
    eyebrow: 'Shop by Category',
  },
  bags: {
    images: bagsCollageImages,
    eyebrow: 'Shop by Category',
  },
  'outlet-bags-bags': {
    images: bagsCollageImages,
    eyebrow: 'Shop by Category',
  },
}

/** L1 hero + duo tile overlay copy — per brand (vercel pseudo content). */
const l1CollageLabelsByBrand: Record<BrandId, [string, string, string]> = {
  coach: ['New Arrivals', 'Women', 'Bags'],
  outlet: ['Outlet New Arrivals', 'Clearance', 'Bags'],
}

export function getV3L1CollageLabels(brand: BrandId): [string, string, string] {
  return l1CollageLabelsByBrand[brand]
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

export function getV3L2Collage(categoryId: string): V3L2CollageConfig | undefined {
  return collageByCategoryId[categoryId]
}

/** L2/L3 nav row label — also used when capturing the tapped row for drill headlines. */
export function getV3L2LinkLabel(subCategoryId: string, fallback: string): string {
  return v3L2LinkLabelOverrides[subCategoryId] ?? fallback
}

/** @deprecated Prefer drill stack `title` captured from the tapped nav row. */
export function getV3DrillTitle(linkId: string, fallback: string): string {
  return getV3L2LinkLabel(linkId, fallback)
}
