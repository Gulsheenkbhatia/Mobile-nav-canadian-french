import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import get from 'lodash/get'

import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Skeleton from 'toro/components/Skeleton'
import RecommendationItemTile from 'toro/components/RecommendationItemTile'
import StylesProvider from 'toro/components/StylesProvider'
import MobileRecommendations from 'toro/components/RecommendationsContainer/MobileRecommendations'
import MetaRecommendationsSkeletonGrid from 'toro/components/list/ProductListingPage/Meta/MetaRecommendationsSkeletonGrid'

import useWithLoading from 'toro/hooks/useWithLoading'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePageTitle from 'toro/hooks/usePageTitle'
import useMetaLander from 'toro/hooks/useMetaLander'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalyticsEventsRec from 'toro/components/RecommendationsContainer/useAnalyticsEventsRec'

import PWAContext from 'components/common/PWAContext'
import { fetchProductDataFromClient } from 'toro/helpers/fetchProductDataFromClient'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import { xgenClientAtom } from 'store/xgen.atom'
import { metaProductsAtom } from 'store/pdp.atom'
import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'
import { XgenContainerID, XgenNormalisedResponse } from 'toro/lib/xgen/types'

const MAX_META_RECOMMENDATIONS = 11

const MetaProductListingPage = () => {
  const style = useMultiStyleConfig('MetaPLP')
  const gridStyles = useMultiStyleConfig('RecommendationsContainer', { variant: 'aeDrawerGrid' })

  const { formatMessage } = useIntl()
  const { appData } = useContext(PWAContext)
  const metaProductsData = useAtomValue(metaProductsAtom)
  const xgenClient = useAtomValue(xgenClientAtom)
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)

  const { isMobile } = useViewportType()
  const [xgenData, setXgenData] = useState<
    XgenNormalisedResponse[typeof XgenContainerID.sm_el_sitewide1] | null
  >(null)
  const [loading, setLoading] = useState(true)

  const [quickViewLoading] = useWithLoading(fetchProductDataFromClient)

  const brand = get(appData, 'brand', '')
  const modifiedBrand = /®$/.test(brand) ? brand.toUpperCase() : `${brand}®`.toUpperCase()
  const title = formatMessage({
    id: 'metaPLP.asSeenOnYourFeed',
    defaultMessage: 'As seen on your feed',
  })
  const pageTitle = usePageTitle(`${title} | ${modifiedBrand}`)

  useMetaLander()

  const analyticsEvents = useAnalyticsEventsRec({
    containerId: XgenContainerID.sm_el_sitewide1,
    vendor: RecommendationVendors.XGEN,
    label: title,
    strategyId: xgenData?.strategyId,
  })

  const fetchMetaXgenRecommendations = useCallback(async () => {
    if (!isMobile || !xgenClient || !metaProductsData.enabled || !metaProductsData.productIds) {
      setXgenData(null)
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      await xgenClient.recommendations.setContext({ prodList: metaProductsData.productIds })
      const normalized = await xgenClient.recommendations.get(XgenContainerID.sm_el_sitewide1)
      const bucket = normalized?.[XgenContainerID.sm_el_sitewide1]
      if (bucket) {
        setXgenData({ ...bucket, items: bucket.items?.slice(0, MAX_META_RECOMMENDATIONS) ?? [] })
      }
    } catch {
      setXgenData(null)
    } finally {
      await xgenClient.recommendations.setContext({ prodList: undefined })
      setLoading(false)
    }
  }, [isMobile, xgenClient, metaProductsData.enabled, metaProductsData.productIds])

  useEffect(() => {
    if (quickViewLoading) setFullscreenLoading(quickViewLoading)
  }, [quickViewLoading, setFullscreenLoading])

  useEffect(() => {
    fetchMetaXgenRecommendations()
  }, [fetchMetaXgenRecommendations])

  if (!metaProductsData.enabled || !isMobile || !xgenData?.items?.length) return null

  const productCountLabel = !loading
    ? formatMessage(
        { id: 'header.totalCount.products', defaultMessage: '{itemCount} Products' },
        { itemCount: xgenData.items.length }
      )
    : null

  return (
    <Box sx={style.wrapper}>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Box sx={style.header}>
        <Text sx={style.title}>{title}</Text>
        {productCountLabel ? (
          <Text sx={style.productCount}>{productCountLabel}</Text>
        ) : (
          <Skeleton sx={style.skeletonProductCount} />
        )}
      </Box>

      <Box id="recommendations-section" sx={style.recommendationsSection}>
        {loading ? (
          <MetaRecommendationsSkeletonGrid style={style} />
        ) : (
          <StylesProvider value={gridStyles}>
            <MobileRecommendations>
              {xgenData.items.map((product, idx) => (
                <RecommendationItemTile
                  key={product.id}
                  idx={idx}
                  containerId={XgenContainerID.sm_el_sitewide1}
                  strategyId={xgenData.strategyId}
                  styleVariant="metaPLP"
                  productItem={product}
                  analyticsEvents={analyticsEvents}
                  containerLabel={title}
                  vendor={RecommendationVendors.XGEN}
                  hideWishlist
                />
              ))}
            </MobileRecommendations>
          </StylesProvider>
        )}
      </Box>
    </Box>
  )
}

export default MetaProductListingPage
