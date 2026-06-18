import { NextApiRequest } from 'next'
import {
  TILE_PREFERENCES,
  PRODUCT_PREFERENCES,
  REVIEW_PREFERENCES,
  IMAGE_SEQUENCE_PREFERENCES,
  COMPARE_PRODUCTS_PREFERENCES,
  HEADLESS_PREFERENCES,
  PDP_V4_DYNAMIC_ASSET_PREFERENCES,
  APPLE_PAY_CONFIGS,
  SEARCH_VENDORS_PREFERENCES,
  ONE_SITE_PREFERENCES,
  ONE_SITE_SEARCH_PREFERENCES,
  PDP_CORE_PREFERENCES,
} from 'toro/constants/preferenceBundles'
import fetchPreferences from 'toro/helpers/fetchPreferences'
import pickPreference, { preferenceReducer } from 'toro/helpers/pickPreference'
import flatten from 'lodash/flatten'

type MappedPreferences<Type> =
  | {
      [P in keyof Type]?: boolean
    }
  | ReturnType<typeof pickPreference>

export const pickPreferenceBundle =
  <T>(ids: T) =>
  (preferences?: object, reduce: boolean = true): MappedPreferences<T> => {
    const pickedPreferences = pickPreference(<{ [key: string]: readonly string[] }>ids, preferences)

    if (!reduce) {
      return pickedPreferences
    }
    const normalizedPreferences = Object.values(pickedPreferences).reduce(
      (acc, value) => ({ ...acc, ...value }),
      {}
    )

    return normalizedPreferences
  }

export const fetchPreferenceBundle =
  <T>(ids: T) =>
  async (req: NextApiRequest, reduced: boolean = true): Promise<MappedPreferences<T>> => {
    const preferenceIds = flatten(Object.values(ids))
    const fetchedPreferences = await fetchPreferences({
      req,
      ids: preferenceIds,
      grouped: !reduced,
    })

    if (!reduced) {
      return fetchedPreferences
    }
    const normalizedPreferences = Object.values(fetchedPreferences).reduce(preferenceReducer, {})

    return normalizedPreferences
  }

export const pickTilePreferences = pickPreferenceBundle(TILE_PREFERENCES)
export const fetchTilePreferences = fetchPreferenceBundle(TILE_PREFERENCES)
export const fetchOneSitePreferences = fetchPreferenceBundle(ONE_SITE_PREFERENCES)
export const pickProductPreferences = pickPreferenceBundle(PRODUCT_PREFERENCES)
export const pickReviewPreferences = pickPreferenceBundle(REVIEW_PREFERENCES)
export const fetchReviewPreferences = fetchPreferenceBundle(REVIEW_PREFERENCES)
export const fetchProductPreferences = fetchPreferenceBundle(PRODUCT_PREFERENCES)
export const fetchApplePayConfigsPreferences = fetchPreferenceBundle(APPLE_PAY_CONFIGS)

export const fetchImageSequencePreference = fetchPreferenceBundle(IMAGE_SEQUENCE_PREFERENCES)
export const pickImageSequencePreference = pickPreferenceBundle(IMAGE_SEQUENCE_PREFERENCES)

export const fetchCompareProductsPreferences = fetchPreferenceBundle(COMPARE_PRODUCTS_PREFERENCES)
export const pickCompareProductsPreferences = pickPreferenceBundle(COMPARE_PRODUCTS_PREFERENCES)

export const fetchHeadlessPreferences = fetchPreferenceBundle(HEADLESS_PREFERENCES)

export const fetchPDPV4DynamicAssetPreferences = fetchPreferenceBundle(
  PDP_V4_DYNAMIC_ASSET_PREFERENCES
)
export const pickPDPV4DynamicAssetPreferences = pickPreferenceBundle(
  PDP_V4_DYNAMIC_ASSET_PREFERENCES
)

export const fetchVendorsPreferences = fetchPreferenceBundle(SEARCH_VENDORS_PREFERENCES)
export const pickVendorsPreferences = pickPreferenceBundle(SEARCH_VENDORS_PREFERENCES)

export const fetchUnifiedSearchPreferences = fetchPreferenceBundle({
  ...SEARCH_VENDORS_PREFERENCES,
  ...TILE_PREFERENCES,
  ...ONE_SITE_SEARCH_PREFERENCES,
})

export const SEARCH_UNIFIED_PREFERENCES = {
  ...SEARCH_VENDORS_PREFERENCES,
  ...TILE_PREFERENCES,
  ...ONE_SITE_SEARCH_PREFERENCES,
} as const

export const pickUnifiedSearchPreferences = pickPreferenceBundle(SEARCH_UNIFIED_PREFERENCES)

/**
 * PDP Core Preferences
 * Fetches core preferences needed by all PDP requests:
 * - PRODUCT_PREFERENCES
 * - REVIEW_PREFERENCES
 * - IMAGE_SEQUENCE_PREFERENCES
 */
export const fetchPDPCorePreferences = fetchPreferenceBundle(PDP_CORE_PREFERENCES)
export const pickPDPCorePreferences = pickPreferenceBundle(PDP_CORE_PREFERENCES)
