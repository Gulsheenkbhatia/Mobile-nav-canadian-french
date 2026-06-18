import { atom } from 'jotai'
import { STORAGE_BECAUSE_YOU_VIEWED_PRODUCTS } from 'toro/constants/storageIds'
import { atomWithStorage } from 'jotai/utils'
import _get from 'lodash/get'
import { isTimestampWithinValidPeriod } from 'toro/helpers/isTimestampWithinValidPeriod'
import { preferencesAtom } from './preferences.atom'

type BecauseYouViewedProduct = {
  vgId: string
  dateUpdated: number // unix timestamp in seconds, e.g. new Date().getTime()/1000
  count: number // the view count, starting from 1
}

type AddBecauseYouViewedPayloadProps = {
  product: BecauseYouViewedProduct
}

const DEFAULT_VG_TRACKING_LIMIT_COUNT = 6
const DEFAULT_TRACKING_DURATION_IN_DAYS = 14

export const becauseYouViewedProductsAtom = atomWithStorage<BecauseYouViewedProduct[]>(
  STORAGE_BECAUSE_YOU_VIEWED_PRODUCTS,
  []
)

export const mostViewedProductAtom = atom((get) => {
  const becauseYouViewedProducts = get(becauseYouViewedProductsAtom)

  const mostViewedProduct = becauseYouViewedProducts.reduce<BecauseYouViewedProduct>(
    (mostViewedProduct, currentProduct) => {
      return currentProduct.count > mostViewedProduct.count ? currentProduct : mostViewedProduct
    },
    { count: 0, dateUpdated: 0, vgId: '' }
  )

  return mostViewedProduct
})

export const addBecauseYouViewedProductsAtom = atom(
  null,
  (get, set, payload: AddBecauseYouViewedPayloadProps) => {
    const storedProducts = get(becauseYouViewedProductsAtom)
    const preferences = get(preferencesAtom)
    const becauseYouViewedProducts = [...storedProducts]
    const product = _get(payload, 'product')
    if (!product) {
      return
    }

    const vgTrackingLimit = _get(
      preferences,
      'adaptiveExperience.becauseYouViewed.vgTrackingLimit',
      DEFAULT_VG_TRACKING_LIMIT_COUNT
    )
    const trackingDurationInDays = _get(
      preferences,
      'adaptiveExperience.becauseYouViewed.trackingDurationInDays',
      DEFAULT_TRACKING_DURATION_IN_DAYS
    )

    const alreadyViewedProductIndex = becauseYouViewedProducts.findIndex(({ vgId }) => {
      return vgId === product.vgId
    })

    if (alreadyViewedProductIndex >= 0) {
      becauseYouViewedProducts[alreadyViewedProductIndex].count += 1
      becauseYouViewedProducts[alreadyViewedProductIndex].dateUpdated = Date.now() / 1000
    }

    const validProducts = becauseYouViewedProducts.filter((product) =>
      isTimestampWithinValidPeriod(product?.dateUpdated, Number(trackingDurationInDays))
    )

    if (validProducts.length < Number(vgTrackingLimit) && alreadyViewedProductIndex === -1) {
      validProducts.push(product)
    }

    set(becauseYouViewedProductsAtom, validProducts)
  }
)
