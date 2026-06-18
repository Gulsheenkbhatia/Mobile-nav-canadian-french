import { useCallback, useEffect } from 'react'
import { TemplateName } from 'toro/constants/templates'
import usePreference from 'toro/hooks/usePreference_new'
import useTemplate from 'toro/hooks/useTemplate'

type PayloadType = {
  isEnabled: boolean
  pageType: 'HP' | 'PLP' | 'PDP' | 'Search'
  products?: { productId: string }[]
  productId?: string
}

/**
 * Hook used to track Monetate interaction on page load.
 * @param {PayloadType} payload
 * @param payload.isEnabled Boolean payload property to toggle tracking.
 * @param payload.pageType Page type
 * @param [payload.addProducts] Products on listing page to track
 * @param [payload.productId] Product id to track
 */
const useMonetateTrack = (payload: PayloadType) => {
  const isPdpV7 = useTemplate([TemplateName.pdpv7])
  const {
    toggleSiteFeatures: { enableMonetate },
  } = usePreference({
    ToggleSiteFeatures: ['enableMonetate'],
  })
  const { isEnabled = true, pageType, products = [], productId = '' } = payload
  const productIdsString = products.map((p) => p.productId).join(',')
  const skipMonetateOnPdpV7 = pageType === 'PDP' && isPdpV7

  const trackMonetate = useCallback(() => {
    window.monetateQ = window.monetateQ || []
    window.monetateQ.push(['setPageType', pageType])
    if (payload.products) {
      window.monetateQ.push(['addProducts', products])
    }
    if (productId) {
      window.monetateQ.push([
        'addProductDetails',
        [
          {
            productId,
          },
        ],
      ])
    }
    window.monetateQ.push(['trackData'])
  }, [pageType, productIdsString, productId])

  useEffect(() => {
    if (isEnabled && enableMonetate && !skipMonetateOnPdpV7) {
      trackMonetate()
    }
  }, [enableMonetate, isEnabled, skipMonetateOnPdpV7, trackMonetate])
}

export default useMonetateTrack
