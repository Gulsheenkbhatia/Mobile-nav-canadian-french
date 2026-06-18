import dynamic from 'next/dynamic'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import get from 'lodash/get'
import { useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react'
import PWAContext from 'components/common/PWAContext'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import Lazy from 'toro/components/Lazy'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import usePreferenceGroup from 'toro/hooks/usePreferenceGroup'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import CertonaSkeleton from 'toro/components/Certona/CertonaSkeleton'
import RecommendationItem from 'toro/components/Certona/RecommendationItem'
import { useAtomValue } from 'jotai/utils'
import { maxCertonadataRecommendationAtom } from 'store/global.atom'
import ATBDrawerRecommendationsCTA from 'toro/components/ATBProductRecommendations/ATBDrawerRecommendationsCTA'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { SLIDE_WIDTH, SLIDER_WIDTH } from 'toro/constants/appConstants.js'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Grid from 'toro/components/Grid'
import Button from 'toro/components/Button'
import { useIntl } from 'react-intl'
import {
  RECOMMENDATIONS_HYBRID_TOTAL_PRODUCTS_COUNT,
  RECOMMENDATIONS_HYBRID_PRODUCTS_COUNT,
} from 'toro/constants/adaptiveExperience'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePageType from 'toro/hooks/usePageType'
import { certonaScriptLoadedAtom } from 'store/certona-schemes.atoms'
import isEmpty from 'lodash/isEmpty'

const PADDINGS_VALUE = 24 * 2
const MAX_PRODUCTS_QUANTITY = 16
const CERTONA_START_MARGIN = 50
const SPLIDE_MARGIN_RIGHT = 12

const SplideSlider = dynamic(() => import('toro/components/SplideSlider'), {
  ssr: false,
})

export const CertonaRecommendation = function ({
  certonaData,
  label,
  type,
  hidePrice,
  variant,
  sliderOptions = {},
  skeletonVisible = true,
  onItemClick,
  onClickATCDrawerRecommendationLink,
  recommendationViewMoreUrl,
  productId,
  impressionName = 'viewItemListCategory',
  hideLabel = false,
  isLoading = false,
  hideProductName = undefined,
  isPLPv3Desktop = false,
  selectedFilter = 0,
  hideWishlist = false,
  limit,
  isMatchingExperience,
  hideATBButton = false,
  showLoadMoreButton = true,
  showDivider = true,
}) {
  const { viewport, isDesktop, isMobile } = useViewportType()
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const { isPLP } = usePageType()
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')
  const maxCertonadataRecommendation = useAtomValue(maxCertonadataRecommendationAtom)
  const isCertonaScriptLoaded = useAtomValue(certonaScriptLoadedAtom)

  const recommendationRef = useRef()
  const sliderRef = useRef()
  const isPdpSimilarRecommendation =
    variant === 'similarProductRecommendation' ||
    variant === 'similarProductRecommendationAdaptivePDP'
  const isAEDrawerGridTypeRecommendation = variant === 'aeDrawerGrid'
  const isAEDrawerRecommendation = variant === 'aeDrawer'

  const products = useMemo(() => {
    const items = get(certonaData, 'items', [])
    return isPdpSimilarRecommendation
      ? items
      : items.slice(0, limit || maxCertonadataRecommendation || MAX_PRODUCTS_QUANTITY)
  }, [certonaData, maxCertonadataRecommendation, limit])

  useEffect(() => {
    if (isMobile) {
      recommendationRef.current?.scrollTo({ left: 0 })
    } else {
      sliderRef.current?.go(0)
    }
  }, [products, isMobile])

  const { addImpression, selectRecommItem, addToWishlistRecommItem, removeFromWishlistRecommItem } =
    useRecommAnalytics({
      products,
      certonaData,
      impressionName,
      selectedFilter,
      numberOfSlides: isMatchingExperience ? 2 : undefined,
    })

  const recommendationArray = usePreferenceGroup({ groupId: 'recommendations' })
  const recommendation = recommendationArray.reduce((obj, pref) => {
    return { ...obj, [pref.id]: getSiteValueFromPref(pref, siteId) }
  }, {})

  const hideYmalOnPDP = recommendation?.disableRecommendationOnPages?.includes('PDP')
  const hideRecentlyViewedPDP = recommendation?.hideRecentlyViewedOnPages?.includes('PDP')
  const hideRecommendations = recommendation?.hideRecommendations

  const {
    priceSitePreferences: { isComparablePriceValue: comparablePriceOn },
  } = usePreferenceNew({
    priceSitePreferences: ['isComparablePriceValue'],
  })

  const styles = useMultiStyleConfig('PDPRecommendations', { variant })

  const [showSkeleton, setShowSkeleton] = useState(true)
  const [certonaInViewport, setCertonaInViewport] = useState(false)
  const [visibleProductsCount, setVisibleProductsCount] = useState(
    RECOMMENDATIONS_HYBRID_PRODUCTS_COUNT
  )

  const recommendationWrapperStyles = useMemo(
    () => styles.recommendationWrapper(isDesktop, hideYmalOnPDP),
    [isDesktop, !hideYmalOnPDP]
  )

  const certonaTitleStyles = useMemo(() => styles.certonaTitle?.(isDesktop), [isDesktop])

  const manageVisibility = useCallback((visible) => {
    if (visible) {
      setCertonaInViewport(true)
    }
    if (visible && certonaData) {
      setShowSkeleton(false)
    }
  }, [])

  useEffect(() => {
    if (certonaData && certonaInViewport) {
      setShowSkeleton(false)
    }
  }, [certonaInViewport, certonaData])

  const priceRangeTogglePref = usePreference({
    groupId: 'priceSitePreferences',
    preferenceId: 'priceRangeToggle',
  })

  const customSliderWidth = products?.length * SLIDE_WIDTH
  const carouselWidth =
    customSliderWidth > SLIDER_WIDTH
      ? SLIDER_WIDTH
      : customSliderWidth + PADDINGS_VALUE + SPLIDE_MARGIN_RIGHT * products?.length

  const handleLoadMoreClick = () => {
    setVisibleProductsCount((prev) => prev + RECOMMENDATIONS_HYBRID_PRODUCTS_COUNT)
    analytics.send('productInteraction', {
      eventAction: 'load more products click',
      eventLabel: productId,
      eventLocationForced: certonaData?.scheme,
    })
  }

  const productItems = products?.map?.((product, idx) => {
    return (
      <Box key={product?.ID}>
        <RecommendationItem
          {...{
            product,
            idx,
            priceRangeTogglePref,
            siteId,
            viewport,
            comparablePriceOn,
            hidePrice,
            hideWishlist,
            addImpression,
            selectRecommItem,
            addToWishlistRecommItem,
            removeFromWishlistRecommItem,
            scheme: certonaData?.scheme,
            experienceId: certonaData?.experience_id,
            label,
            variant,
            onItemClick,
            hideProductName,
            hideATBButton,
          }}
        />
      </Box>
    )
  })

  const mobileRecommendation = () => (
    <Box
      maxW="100vw"
      className="mob-recommend"
      data-qa="recommendations-section"
      sx={styles.mobileRecommendationWrapper}
    >
      <Flex
        maxWidth="100vw"
        sx={styles.mobileRecommendationItems}
        className="mob-recommend-items"
        ref={recommendationRef}
      >
        {productItems}
        {recommendationViewMoreUrl && (
          <Experiment forIDs={EXPERIMENTS.VIEW_MORE_ON_POST_ATC}>
            <ATBDrawerRecommendationsCTA
              url={recommendationViewMoreUrl}
              linkInCarousel={true}
              onClickATCDrawerRecommendationLink={onClickATCDrawerRecommendationLink}
            />
          </Experiment>
        )}
      </Flex>
    </Box>
  )
  const visibleProducts = isAEDrawerGridTypeRecommendation
    ? products
    : products?.slice(0, visibleProductsCount)

  const recommendationGrid = () => (
    <>
      <Grid sx={styles.mobileRecommendationGrid} data-qa="recommendations-section">
        {visibleProducts?.map((product, idx) => (
          <RecommendationItem
            key={`recommendation-item-${idx}`}
            product={product}
            idx={idx}
            priceRangeTogglePref={priceRangeTogglePref}
            siteId={siteId}
            viewport={viewport}
            comparablePriceOn={comparablePriceOn}
            hidePrice={hidePrice}
            hideWishlist={hideWishlist}
            addImpression={addImpression}
            selectRecommItem={selectRecommItem}
            addToWishlistRecommItem={addToWishlistRecommItem}
            removeFromWishlistRecommItem={removeFromWishlistRecommItem}
            scheme={certonaData?.scheme}
            experienceId={certonaData?.experience_id}
            label={label}
            variant={variant}
            onItemClick={onItemClick}
            isSendOnceInViewport={isPdpSimilarRecommendation || isAEDrawerGridTypeRecommendation}
            hideProductName={hideProductName}
          />
        ))}
      </Grid>
      {showLoadMoreButton &&
        !isAEDrawerGridTypeRecommendation &&
        visibleProductsCount < products.length &&
        visibleProductsCount < RECOMMENDATIONS_HYBRID_TOTAL_PRODUCTS_COUNT && (
          <Button
            className="certonaLoadMore"
            sx={styles.loadMoreProductButton}
            onClick={handleLoadMoreClick}
          >
            {formatMessage({
              id: 'pdp.product.loadMoreProductsBtn',
              defaultMessage: 'LOAD MORE PRODUCTS',
            })}
          </Button>
        )}
    </>
  )

  const renderDesktopRecommendation = () => (
    <Box
      as="div"
      sx={styles.recommendationSliderWrapper(carouselWidth)}
      className="recommendSlider"
      data-qa={
        type === 'yaml' ? 'pdp_recommendation_section_wrapper' : 'pdp_recently_viewed_section'
      }
    >
      <SplideSlider
        innerRef={sliderRef}
        options={{
          pagination: false,
          drag: true,
          lazyLoad: 'nearby',
          perPage: isAEDrawerRecommendation ? 3 : 4,
          perMove: 1,
          arrows: products?.length > 4 && isDesktop,
          gap: 'auto',
          ...sliderOptions,
        }}
        styles={{
          arrows: styles?.arrowStyles(),
          arrowPrev: styles?.arrowPrev,
          arrowNext: styles?.arrowNext,
          splidePadding: styles?.splidePadding,
        }}
        arrowProps={{
          next: { 'data-qa': 'recommendation_section_right_carousel' },
          prev: { 'data-qa': 'recommendation_section_left_carousel' },
        }}
        isPLPv3Desktop={isPLPv3Desktop}
      >
        {productItems}
      </SplideSlider>
    </Box>
  )

  const desktopRenderRecommendation = {
    aeDrawerGrid: recommendationGrid,
    inlinegrid: renderDesktopRecommendation,
    inlinegridV3: renderDesktopRecommendation,
    default: renderDesktopRecommendation,
  }

  const mobileRenderRecommendation = {
    similarProductRecommendation: recommendationGrid,
    similarProductRecommendationAdaptivePDP: recommendationGrid,
    aeDrawerGrid: recommendationGrid,
    aeDrawerGridSocial: recommendationGrid,
    metaPLP: recommendationGrid,
    inlinegrid: mobileRecommendation,
    inlinegridV3: mobileRecommendation,
    default: mobileRecommendation,
  }

  const renderFN = isMobile
    ? mobileRenderRecommendation[variant] ?? mobileRenderRecommendation.default
    : desktopRenderRecommendation[variant] ?? desktopRenderRecommendation.default

  if (hideRecommendations && (hideRecentlyViewedPDP || hideYmalOnPDP)) return null

  if (!isCertonaScriptLoaded || (!isLoading && isEmpty(certonaData))) {
    return null
  }

  return (
    <>
      <Lazy rootMargin={`${CERTONA_START_MARGIN}px 0px 0px 0px`} onVisible={manageVisibility}>
        {!isLoading && certonaData && (
          <>
            {products?.length > 0 && Object.keys(products[0])?.length > 0 && (
              <Box sx={styles.mainRecommendationWrapper(isDesktop)}>
                <Box
                  sx={{
                    ...(showDivider && styles.contentDivider(isDesktop, recommendationViewMoreUrl)),
                  }}
                  className={showDivider && 'content-divider'}
                >
                  <Flex
                    flexDirection="column"
                    w="100%"
                    sx={recommendationWrapperStyles}
                    className="certona_wrapper"
                  >
                    {!hideLabel && label && (
                      <Box
                        as="h2"
                        className="certona_title"
                        sx={certonaTitleStyles}
                        data-qa={isPLP && isMobile ? 'certona-title-plp-certona' : 'certona-title'}
                      >
                        {label}
                      </Box>
                    )}
                    {renderFN()}
                  </Flex>
                </Box>
              </Box>
            )}
          </>
        )}
      </Lazy>
      {((skeletonVisible && showSkeleton) || isLoading) && (
        <Box sx={styles.mainRecommendationWrapper(isDesktop)}>
          <CertonaSkeleton variant={variant} manageVisibility={manageVisibility} />
        </Box>
      )}
    </>
  )
}

const withCertonaRenderingWrapper = (CertonaComponent) => {
  return (props) => {
    if (
      !Boolean(props?.certonaData?.items?.length) &&
      props?.certonaData?.display?.toLowerCase() !== 'no'
    ) {
      return null
    }

    const { wrapperComponent: WrapperComponent } = props

    if (WrapperComponent) {
      return (
        <WrapperComponent>
          <CertonaComponent {...props} />
        </WrapperComponent>
      )
    }

    return <CertonaComponent {...props} />
  }
}

export default withErrorBoundaryWrapper(withCertonaRenderingWrapper(CertonaRecommendation))
