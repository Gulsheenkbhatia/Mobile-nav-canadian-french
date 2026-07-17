import type { BrandId } from '../components/nav/NavSearchExposed'
import {
  COACH_T1_CATEGORIES,
  OUTLET_T1_CATEGORIES,
} from './v3L1Categories'
import type { MenuCategory } from './mobileMenuData'
import {
  getV3L1ContentSpots,
  getV3L2ContentSpots,
  hasV3L1ContentSpots,
  type V3L1ContentSpotsConfig,
  type V3L2ContentSpotsConfig,
} from './v3ContentSpots'

const campaignImage = '/assets/figma/v3-campaign.png'
const newWomensArrivalsImage = '/assets/figma/v3-new-womens-arrivals.png'
const menMobileImage = '/assets/figma/v3-men-mobile.png'

export type T1PressureBrand = BrandId

/** Coach retail T1s with production L2 content spots. */
export const T1_WITH_PRODUCTION_L2_IMAGES = new Set([
  'coach-women',
  'coach-men',
  'bags',
  'new',
  'coachtopia',
])

/** Hypothetical L2 collage for Coach link-only T1s. */
const hypotheticalL2ContentSpots: Record<string, V3L2ContentSpotsConfig> = {
  gifts: {
    layout: 'l2-2',
    tileAspectRatio: '4:5',
    eyebrow: 'Shop by Category',
    tiles: [
      { label: 'Gifts for Her', image: newWomensArrivalsImage },
      { label: 'Gifts for Him', image: menMobileImage },
    ],
  },
  'coach-sale': {
    layout: 'l2-2',
    eyebrow: 'Shop by Category',
    tiles: [
      { label: "Women's Sale", image: campaignImage },
      { label: "Men's Sale", image: menMobileImage },
    ],
  },
}

function isOutletCategoryId(categoryId: string): boolean {
  return categoryId.startsWith('outlet')
}

export function getT1PressureCategories(brand: T1PressureBrand): MenuCategory[] {
  return brand === 'coach' ? COACH_T1_CATEGORIES : OUTLET_T1_CATEGORIES
}

export function getT1PressureL1ContentSpots(
  brand: T1PressureBrand,
  withImages: boolean,
): V3L1ContentSpotsConfig | null {
  if (!withImages || !hasV3L1ContentSpots(brand)) return null
  return getV3L1ContentSpots(brand)
}

/**
 * L2 content spots for pressure-test "with images" column.
 * Coach Outlet ships link-only — no L2 collages in either column.
 */
export function getT1PressureL2ContentSpots(
  categoryId: string,
  withImages: boolean,
): V3L2ContentSpotsConfig | undefined {
  if (!withImages || isOutletCategoryId(categoryId)) return undefined
  return getV3L2ContentSpots(categoryId) ?? hypotheticalL2ContentSpots[categoryId]
}

export function hasProductionL2Images(categoryId: string): boolean {
  return T1_WITH_PRODUCTION_L2_IMAGES.has(categoryId)
}

export function getT1PressureImageNote(
  brand: T1PressureBrand,
  categoryId: string,
): string | undefined {
  if (brand === 'outlet') {
    return 'Coach Outlet — link-only (no content images)'
  }
  if (hasProductionL2Images(categoryId)) {
    return 'Production L2 content spots'
  }
  if (hypotheticalL2ContentSpots[categoryId]) {
    return 'Hypothetical L2 collage — link-only in production today'
  }
  return undefined
}
