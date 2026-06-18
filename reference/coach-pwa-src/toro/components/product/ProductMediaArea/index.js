import React, { useCallback, useState, memo, useContext, useMemo } from 'react'
import useStickyHeaderHeight from 'toro/hooks/useStickyHeaderHeight'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'

import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import ProductZoomModal from 'toro/components/product/ProductMediaArea/ProductZoomModal'
import ProductCarouselDesktop from 'toro/components/product/ProductMediaArea/ProductCarouselDesktop'
import ProductCarouselMobile from 'toro/components/product/ProductMediaArea/ProductCarouselMobile'
import ProductHeroRightWidgets from 'toro/components/product/ProductMediaArea/ProductHeroRightWidgets'
import ProductHeroLeftWidgets from 'toro/components/product/ProductMediaArea/ProductHeroLeftWidgets'

import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtomValue } from 'jotai/utils'
import { isTabbedAdaptiveScrolledAtom } from 'store/pdp.atom'
import AdaptiveProductCarouselMobile from 'toro/components/product/ProductMediaArea/AdaptiveProductCarouselMobile'
import AdaptiveProductCarouselMobileAlt from 'toro/components/product/ProductMediaArea/AdaptiveProductCarouselMobileAlt'

/**
 * PDP responsive media carousel
 *
 * @param  {Object} productData normalized product data
 * @param  {string} variant desktop|mobile (default 'desktop')
 */
function ProductMediaArea({
  isVisible,
  isQuickView,
  isGuestUser,
  membershipExclusiveProduct,
  isMobile,
  isBundleProduct,
  tangibleeWidgetProps,
  imageBadges,
  selectedVariant,
  currentVariationGroupId,
  onAddToWishlistSuccess,
  onRemoveFromWishlistSuccess,
  selectedColor,
  productData,
  media,
  onSwatchInteraction,
  sustainabilityIconsData,
  isSustainabilityIconExpEnabled,
  onPurposeProps,
  imageEditorialCopy,
  isTabbedAdaptivePDP,
  setCarouselIndex = () => {},
  isSwatchChanged,
  isDynamicAssetPresent,
  dynamicAssetImage,
  isEnabledColorAdaptive,
}) {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const {
    toggleSiteFeatures: { similarOptionsCTAConfig },
    powerReviews: { enableEmplifi = false },
  } = usePreference({
    ToggleSiteFeatures: ['similarOptionsCTAConfig'],
    powerReviews: ['enableEmplifi'],
  })
  const isSimilarOptionOnPDP = get(similarOptionsCTAConfig, 'PDP.enable', false)
  const { appData } = useContext(PWAContext)
  const isHeaderHeight = useStickyHeaderHeight()
  const isPDPV3 = useExperiment(EXPERIMENTS.PDP_V3)
  const isReviewSectionUnderProductImage = useExperiment(EXPERIMENTS.REVIEW_UNDER_PRODUCT_IMAGE)
  const shouldPreferAltAdaptiveCarousel = useExperiment(
    `${EXPERIMENTS.ADAPTIVE_CAROUSEL_ALT}-${EXPERIMENTS.ADAPTIVE_CAROUSEL_ALT_RETURN}`
  )
  const membershipContent = get(appData, 'membership.contentSlots["membership-exclusive"]')
  const brand = get(appData, 'brand')
  const siteId = get(appData, 'siteId')
  const { isOnPurposeEnabled, onPurposeMaterials, isKateSpade, onPurposeBadgeImage } =
    onPurposeProps || {}
  const reviewsData = get(productData, 'reviewsData.results[0].reviews', [])
  const reviewsAvgRating = useMemo(() => {
    const customAttributesAvgRating = get(productData, 'custom.c_avgRatingEmplifi')
    return Number(
      get(productData, 'reviewsData.results[0].rollup.average_rating') || customAttributesAvgRating
    )
  }, [
    get(productData, 'reviewsData.results[0].rollup.average_rating'),
    get(productData, 'custom.c_avgRatingEmplifi'),
    enableEmplifi,
  ])
  const isTabbedAdaptiveScrolled = useAtomValue(isTabbedAdaptiveScrolledAtom)

  const handleIsZoomModalOpen = useCallback(() => {
    if (!isQuickView) {
      setIsModalOpened(true)
    }
  }, [isQuickView])
  const handleModalClose = () => {
    setIsModalOpened(false)
  }

  const commonCarouselProps = {
    isVisible,
    media,
    hasZoomedImage: false,
    onMediaClick: handleIsZoomModalOpen,
    onChange: setActiveIdx,
    onSwatchInteraction,
    initialIdx: activeIdx,
    isSimilarOptionOnPDP,
    brand,
    siteId,
    label: selectedColor?.text,
    selectedVariant,
    selectedColor,
    imageEditorialCopy,
    tangiblee: tangibleeWidgetProps,
    reviewsData,
    reviewsAvgRating,
    isSwatchChanged,
    productId: productData.id,
  }

  const productHeroLeftWidgetsProps = {
    imageBadges,
    selectedColor,
    productData,
    initialIdx: activeIdx,
    isSustainabilityIconExpEnabled,
    sustainabilityIconsData,
    isOnPurposeEnabled,
    onPurposeMaterials,
    isKateSpade,
    onPurposeBadgeImage,
  }

  const productHeroRightWidgetsProps = {
    selectedVariant,
    isGuestUser,
    membershipExclusiveProduct,
    currentVariationGroupId,
    onAddToWishlistSuccess,
    onRemoveFromWishlistSuccess,
    tangibleeWidgetProps,
    selectedColor,
    productData,
    isQuickView,
    membershipContent,
  }

  const adaptiveCarouselProps = {
    canZoom: !isTabbedAdaptiveScrolled,
    brand,
    ...commonCarouselProps,
    setCarouselIndex,
    isScrolled: isTabbedAdaptiveScrolled,
    isDynamicAssetPresent,
    dynamicAssetImage,
    isEnabledColorAdaptive,
    isTabbedAdaptivePDP: isTabbedAdaptivePDP,
  }

  if (isMobile) {
    return (
      <Box w="100%">
        <ProductHeroLeftWidgets isMobile {...productHeroLeftWidgetsProps} />
        {shouldPreferAltAdaptiveCarousel && (isTabbedAdaptivePDP || isPDPV3) ? (
          <AdaptiveProductCarouselMobileAlt {...adaptiveCarouselProps} />
        ) : isTabbedAdaptivePDP ? (
          <AdaptiveProductCarouselMobile {...adaptiveCarouselProps} />
        ) : (
          <ProductCarouselMobile canZoom brand={brand} {...commonCarouselProps} />
        )}
        {!isBundleProduct && <ProductHeroRightWidgets isMobile {...productHeroRightWidgetsProps} />}
      </Box>
    )
  }

  const carouselPropsDesktop = {
    ...commonCarouselProps,
    customizedOrMonogrammed: selectedColor?.isCustomized || selectedColor?.isMonogrammed,
    isQuickView,
  }

  return (
    <Box w="100%" h={!isReviewSectionUnderProductImage && '100%'}>
      <Flex
        w="100%"
        position={!isReviewSectionUnderProductImage && 'sticky'}
        top={!isQuickView ? `${isHeaderHeight}px` : 0}
      >
        <ProductHeroLeftWidgets {...productHeroLeftWidgetsProps} />
        <ProductCarouselDesktop {...carouselPropsDesktop} />
        {!isBundleProduct ? <ProductHeroRightWidgets {...productHeroRightWidgetsProps} /> : <Box />}
      </Flex>
      <ProductZoomModal isOpen={isModalOpened} onClose={handleModalClose}>
        <Flex w="75vw" top={!isQuickView ? `${isHeaderHeight}px` : 0} h="100%">
          <ProductCarouselDesktop
            {...carouselPropsDesktop}
            canZoom
            hasZoomedImage
            initialIdx={activeIdx}
            isModalOpened
            isBundleProduct
          />
        </Flex>
      </ProductZoomModal>
    </Box>
  )
}

ProductMediaArea.propTypes = {
  isVisible: PropTypes.bool,
  isQuickView: PropTypes.bool,
  isGuestUser: PropTypes.bool,
  membershipExclusiveProduct: PropTypes.bool,
  isMobile: PropTypes.bool,
  isBundleProduct: PropTypes.bool,
  tangibleeWidgetProps: PropTypes.object,
  imageBadges: PropTypes.node,
  selectedVariant: PropTypes.object,
  currentVariationGroupId: PropTypes.string,
  onAddToWishlistSuccess: PropTypes.func,
  onRemoveFromWishlistSuccess: PropTypes.func,
  selectedColor: PropTypes.object,
  productData: PropTypes.object,
  media: PropTypes.object,
  onSwatchInteraction: PropTypes.func,
  sustainabilityIconsData: PropTypes.array,
  isSustainabilityIconExpEnabled: PropTypes.bool,
  isEnabledColorAdaptive: PropTypes.bool,
}

export default withErrorBoundaryWrapper(memo(ProductMediaArea))
