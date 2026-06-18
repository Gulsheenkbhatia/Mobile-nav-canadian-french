import { useEffect, useImperativeHandle, Ref, RefObject } from 'react'
import useAnalytics from 'toro/analytics/useAnalytics'
import { CertonaScheme, CertonaSchemeType } from 'store/certona-schemes.atoms'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import useRecentlyViewedData, { type RecentlyViewedProduct } from 'toro/hooks/useRecentlyViewedData'

export interface UseRVRecommendationsParams {
  location: string
  certonaScheme: CertonaSchemeType
  enableBadging: boolean
  limit?: number
  forwardedRef?: Ref<{ getHeight: () => number }>
  carouselRef: RefObject<HTMLElement>
}

export interface UseRVRecommendationsReturn {
  title: string
  products: RecentlyViewedProduct[]
  display: boolean
  experienceId?: string
  sendAnalyticsEvent: (eventAction: string) => void
  handleClick: () => void
  onLinkClick: (product: RecentlyViewedProduct, idx: number) => () => void
  onTileVisible: (product: RecentlyViewedProduct, idx: number) => () => void
  certonaData: CertonaScheme
  addImpression: (payload: any) => void
  selectRecommItem: (payload: any) => Promise<void>
  vendorScheme: string
}

const useRVRecommendations = ({
  location,
  certonaScheme,
  enableBadging,
  limit,
  forwardedRef,
  carouselRef,
}: UseRVRecommendationsParams): UseRVRecommendationsReturn => {
  const { title, products, display, vendorScheme, vendor, ...rest } = useRecentlyViewedData({
    certonaScheme,
    location,
    limit,
    enableBadging,
  })

  const analytics = useAnalytics()

  const sendAnalyticsEvent = (eventAction: string) => {
    analytics.send('containerInteraction', {
      eventAction: `returner recommendation ${eventAction}`,
      eventLabel: 'Recently Viewed',
      eventLocation: location,
    })
  }

  useImperativeHandle(
    forwardedRef,
    () => {
      return {
        getHeight() {
          const carousel = carouselRef.current
          if (carousel) {
            return carousel.offsetHeight ?? 0
          }
          return 0
        },
      }
    },
    [carouselRef]
  )

  const { addImpression, selectRecommItem } = useRecommAnalytics({
    forceViewport: 'mobile',
    products,
    certonaData: rest,
  })

  useEffect(() => {
    if (products.length) {
      sendAnalyticsEvent('impression')
    }
  }, [products, location])

  const handleClick = () => {
    sendAnalyticsEvent('click')
  }

  const onLinkClick = (product: RecentlyViewedProduct, idx: number) => () => {
    void selectRecommItem({
      listName: title,
      product,
      idx,
      eventLocation: vendorScheme,
      recAIType: vendor,
    })
  }

  const onTileVisible = (product: RecentlyViewedProduct, idx: number) => () => {
    addImpression({
      listName: title,
      product,
      idx,
      certonaScheme: vendorScheme,
      recAIType: vendor,
      sendOnceInViewport: true,
    })
  }

  return {
    title,
    products,
    display,
    experienceId: rest.experience_id,
    sendAnalyticsEvent,
    handleClick,
    onLinkClick,
    onTileVisible,
    certonaData: rest,
    addImpression,
    selectRecommItem,
    vendorScheme,
  }
}

export default useRVRecommendations
