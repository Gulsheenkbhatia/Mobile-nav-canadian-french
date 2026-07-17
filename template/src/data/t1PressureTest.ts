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

/** Coach retail T1s with production L2 content spots above links. */
export const T1_WITH_PRODUCTION_L2_IMAGES = new Set([
  'coach-women',
  'coach-men',
  'bags',
  'new',
  'coachtopia',
])

/** Hypothetical L2 collage for Coach link-only T1s (images above links). */
const hypotheticalCoachL2ContentSpots: Record<string, V3L2ContentSpotsConfig> = {
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
 * L2 content spots for pressure-test "with images" column (Coach drill-downs only).
 * Outlet L1 menu uses inline collage below the T1 list — not L2 spots.
 */
export function getT1PressureL2ContentSpots(
  categoryId: string,
  brand: T1PressureBrand,
  withImages: boolean,
): V3L2ContentSpotsConfig | undefined {
  if (!withImages || brand === 'outlet') return undefined
  return getV3L2ContentSpots(categoryId) ?? hypotheticalCoachL2ContentSpots[categoryId]
}

export function getT1PressureImageNote(
  brand: T1PressureBrand,
  categoryId: string,
): string | undefined {
  if (brand === 'outlet') {
    return 'Outlet — L1 collage below T1 list (after Gifts); link-only L2 drills'
  }

  if (T1_WITH_PRODUCTION_L2_IMAGES.has(categoryId)) {
    return 'Coach — L1 collage above T1 list; L2 images above links'
  }
  if (hypotheticalCoachL2ContentSpots[categoryId]) {
    return 'Coach — hypothetical L2 collage above links'
  }
  return undefined
}
