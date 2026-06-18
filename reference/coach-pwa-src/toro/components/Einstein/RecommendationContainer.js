import React, { useMemo, useState, useEffect } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import dynamic from 'next/dynamic'
import Lazy from 'toro/components/Lazy'
import useViewportType from 'toro/hooks/useViewportType'
import EinsteinSkeleton from 'toro/components/Einstein/EinsteinSkeleton/index'
import useEinsteinRecommendations from './useEinsteinRecommendations'
import isEmpty from 'lodash/isEmpty'
import usePreference from 'toro/hooks/usePreference_new'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

const MobileRecommendationCarousel = dynamic(() =>
  import('toro/components/Einstein/MobileRecommendationsCarousel')
)
const MobileRecommendationGrid = dynamic(() =>
  import('toro/components/Einstein/MobileRecommendationsGrid')
)
const DesktopRecommendationsCarousel = dynamic(() =>
  import('toro/components/Einstein/DesktopRecommendationsCarousel')
)

const DesktopRecommendationsGrid = dynamic(() =>
  import('toro/components/Einstein/DesktopRecommendationsGrid')
)

const getPageWiseEinsteinEnablePref = {
  PDP: 'isEinsteinRecomEnabledPDP',
  SEARCH: 'isEinsteinRecomEnabledSearch',
  SEARCH_SUGGESTION: 'isEinsteinRecomEnabledSearchSuggestion',
  PLP: 'isEinsteinRecomEnabledPLP',
}

function RecommendationsContainer({
  pageType = '',
  recommenderData,
  productId = '',
  siteId,
  triggerPageViewImpression = false,
  type = 'yaml',
  label,
  scheme,
  variant,
  isAEDrawerGrid = undefined,
  onItemClick = undefined,
}) {
  const styles = useMultiStyleConfig('PDPEinsteinRecommendations', { variant })

  const pageTypeEnablePref = getPageWiseEinsteinEnablePref[pageType]

  const {
    einsteinRecommendation: {
      einstineSlideConfig = {},
      isEinsteinRecomEnabled = false,
      [pageTypeEnablePref]: isEinsteinRecomEnabledOnPage = false,
    },
  } = usePreference({
    EinsteinRecommendation: ['einstineSlideConfig', 'isEinsteinRecomEnabled', pageTypeEnablePref],
  })

  const {
    sliderWithDesktop = 944,
    maxProductsQuantity = 16,
    largeScreenItemVisibleCount = 4,
    smallScreenItemVisibleCount = 2,
    sliderGap = 10,
  } = einstineSlideConfig
  const { viewport, isDesktop, isMobile } = useViewportType()
  const hidePrice = true
  const [recommendationProductItems, setRecommendationProductItems] = useState([])
  const [recoUUID, setRecoUUID] = useState('')
  const { recommender } = recommenderData || {}
  const [products, setProducts] = useState(null)
  const { addImpression, selectRecommItem, addToWishlistRecommItem } = useRecommAnalytics({
    products,
  })

  const [isVisible, setIsVisible] = useState(false)

  const handleViewChange = (isVisible) => {
    if (isVisible) {
      setIsVisible(true)
    }
  }

  const {
    recommendations,
    isLoadingRecommendations,
    sendRecommendationClick,
    sendRecommendationView,
  } = useEinsteinRecommendations({
    pageType,
    productId,
    recommender,
    isInView: isVisible,
    triggerPageViewImpression,
  })

  const recommendationWrapperStyles = useMemo(
    () => styles.recommendationWrapper(isDesktop),
    [isDesktop]
  )

  const recommendationSliderWrapper = useMemo(
    () => styles.recommendationSliderWrapper(sliderWithDesktop, recommendationProductItems?.length),
    [sliderWithDesktop, recommendationProductItems]
  )

  const mainRecoWrapperStyles = useMemo(
    () => styles.mainRecoWrapperStyles(recommendationProductItems),
    [recommendationProductItems]
  )

  const screenItemVisibleCount = useMemo(
    () => (isMobile ? smallScreenItemVisibleCount : largeScreenItemVisibleCount),
    [isMobile]
  )

  const handleClickReco = (id, index, product) => {
    onItemClick?.()
    sendRecommendationClick({
      id,
      recommenderName: recommender,
      recoUUID,
    })
    selectRecommItem({
      listName: label,
      product,
      idx: index,
      eventLocation: scheme,
      recAIType: 'einstein',
    })
  }

  const handleViewReco = (products) => {
    sendRecommendationView({
      products,
      recommenderName: recommender,
      recoUUID,
    })
  }
  useEffect(() => {
    if (!isEmpty(recommendations)) {
      setRecoUUID(recommendations?.recoUUID)
      setRecommendationProductItems(recommendations?.recs?.splice(0, maxProductsQuantity))
    }
  }, [recommendations])

  useEffect(() => {
    if (recommendationProductItems?.length) {
      const visibleItemsOnViewPort = isMobile
        ? smallScreenItemVisibleCount
        : largeScreenItemVisibleCount
      const products = recommendationProductItems
        .slice(0, visibleItemsOnViewPort)
        .map((product) => {
          return { id: product?.id }
        })
      setProducts(products)
      sendRecommendationView({
        products,
        recommenderName: recommender,
        recoUUID,
      })
    }
  }, [recommendationProductItems])

  const recommendationCarouselProps = {
    recommendationProductItems,
    viewport,
    siteId,
    handleClickReco,
    hidePrice,
    label,
    addImpression,
    addToWishlistRecommItem,
    handleViewReco,
    type,
    screenItemVisibleCount,
    scheme,
    productId,
    styles,
  }

  return isEinsteinRecomEnabled && isEinsteinRecomEnabledOnPage ? (
    <Lazy onVisible={handleViewChange}>
      <Box id="recommendations-section" sx={mainRecoWrapperStyles}>
        {!!recommendationProductItems?.length && (
          <Box>
            <Flex className="einstein_wrapper" sx={recommendationWrapperStyles}>
              {(type !== 'grid' || isAEDrawerGrid) && (
                <Box
                  as="h2"
                  className="einstein_title"
                  sx={styles.einsteinTitle}
                  data-qa="einstein_title"
                >
                  {label}
                </Box>
              )}
              {isMobile ? (
                type === 'grid' ? (
                  <MobileRecommendationGrid {...recommendationCarouselProps} variant={variant} />
                ) : (
                  <MobileRecommendationCarousel
                    {...recommendationCarouselProps}
                    variant={variant}
                  />
                )
              ) : type === 'grid' ? (
                <DesktopRecommendationsGrid {...recommendationCarouselProps} variant={variant} />
              ) : (
                <DesktopRecommendationsCarousel
                  {...recommendationCarouselProps}
                  recommendationSliderWrapper={recommendationSliderWrapper}
                  sliderGap={sliderGap}
                />
              )}
            </Flex>
          </Box>
        )}
        {isLoadingRecommendations && <EinsteinSkeleton variant={variant} />}
      </Box>
    </Lazy>
  ) : null
}

export default withErrorBoundaryWrapper(RecommendationsContainer)
