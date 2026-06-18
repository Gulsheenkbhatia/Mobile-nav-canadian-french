import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import MainContainer from 'toro/components/MainContainer'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import { useIntl } from 'react-intl'
import Heading from 'toro/components/Heading'
import { useRouter } from 'next/router'
import ProductVariationControls from 'toro/components/product/ProductVariationControls'
import AddToBagAdaptiveAreaMobile from 'toro/components/product/ProductMainSection/AddToBagAdaptiveAreaMobile'
import get from 'lodash/get'
import PriceBadge from 'toro/components/product/PriceBadge'
import ProductMediaArea from 'toro/components/product/ProductMediaArea'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import { useAtom } from 'jotai'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import {
  productDataAtom,
  appLoadingAtom,
  isTabbedAdaptiveScrolledAtom,
  isTabbedAdaptiveDynamicAssetInViewportAtom,
  isProductFullyOOSAtom,
  isPdpV4ATFFullPricingAtom,
} from 'store/pdp.atom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useScrollToImageCarousel from 'toro/hooks/useScrollToImageCarousel'
import { isHeaderHeightAtom } from 'store/headroom.atom'
import hexToCssHsl from 'toro/helpers/hexToCssHsl'
import getAverageColor from 'toro/helpers/getAverageColor'
import usePreference from 'toro/hooks/usePreference_new'
import TabbedAdaptivePDPLower from 'toro/components/product/TabbedAdaptivePDP/TabbedAdaptivePDPLower'
import SlideFade from 'toro/components/SlideFade'
import throttle from 'lodash/throttle'
import { isSpecificAssetTypeSrc } from 'toro/components/product/ProductMediaArea/helpers'
import usePDPContainerMargin from 'toro/hooks/usePDPContainerMargin'
import { getProductImageSrc } from 'toro/helpers/productImages'
import OutOfStockPDPBottom from 'toro/components/product/OutOfStockPDPBottom'
import {
  hslColorAdaptivePDPAtom,
  isHeaderMountedAtom,
  currentLocaleAtom,
  isSubBrandActiveAtom,
} from 'store/global.atom'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import SurveyContainer from 'toro/components/Survey/SurveyContainer'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import StarRatingMobileV3 from 'toro/components/StarRating/StarRatingMobileV3'
import { getAverageRating, getTotalReviews } from 'toro/helpers/getReviewData'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import getPromoByType, { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import PWAContext from 'components/common/PWAContext'
import CoachtopiaLogoButton from 'toro/components/CoachtopiaLogoButton'

export const PARALLAX_THRESHOLD = 80
const IMAGE_BASE_BACKGROUND_COLOR = 'var(--color-product-image-bg, #f0f0f0)'
const hslDefaultColor = { main: IMAGE_BASE_BACKGROUND_COLOR, second: '#e1e1e1' }

const TabbedAdaptivePDPUpper = ({ tabbedPDPLower }) => {
  const { formatMessage } = useIntl()
  const productData = useAtomValue(productDataAtom)
  const apploading = useAtomValue(appLoadingAtom)
  const {
    // Note: Mobile only
    isBundleVariant,

    // Note: shared between Mobile and Desktop
    headerBadges,
    carouselProps,
    isGuestUser,
    membershipExclusiveProduct,
    onSwatchInteraction,
    allLevelsProductsData,
    isDiscontinued,
    selectedColor,
    selectedVariant,
    variationControlsProps,
    variationTangibleeProps,
    selectedVariantData,
    tangibleeWidgetProps,
    klarnaDetails,
    onPurposeProps,
    adaptiveCarouselAltMedia,
    variationMessagesProps,
    bundleCardRedirect,
    customizeComponent,
    bundleModuleProperties,
    bundleContentModuleComponent,
    showBundleSave,
  } = useContext(ProductMainSectionBreakpointContext)
  const { appData } = useContext(PWAContext)
  const enablePricingPromoUpdates = get(appData, 'enablePricingPromoUpdates', false)

  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const router = useRouter()
  const styles = useMultiStyleConfig('TabbedAdaptivePDP', {
    variant: isPdpV41Enabled ? 'pdpV41' : isPdpV42Enabled ? 'pdpV42' : null,
  })
  const mobileStyles = useMultiStyleConfig('ProductHeader', { variant: 'mobile' })
  const headerHeight = useAtomValue(isHeaderHeightAtom)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const isProductFullyOOS = useAtomValue(isProductFullyOOSAtom)
  const [hslColors, setHslColors] = useAtom(hslColorAdaptivePDPAtom)
  const isHeaderMounted = useAtomValue(isHeaderMountedAtom)
  const locale = useAtomValue(currentLocaleAtom)
  const [isScrolled, setIsScrolled] = useAtom(isTabbedAdaptiveScrolledAtom)
  const setIsDynamicAssetInViewport = useUpdateAtom(isTabbedAdaptiveDynamicAssetInViewportAtom)
  const scrollToImageCarousel = useScrollToImageCarousel()
  const [carouselIndex, setCarouselIndex] = useState(0)
  const fullMedias = get(carouselProps, 'media.full', [])
  const containerMarginTop = usePDPContainerMargin()
  const isEnabledColorAdaptive = get(productData, 'custom.c_enableColorAdaptive', false)
  const isBundleProduct = get(productData, 'isBundleProduct', false)
  const isPdpV4ATFFullPricing = useAtomValue(isPdpV4ATFFullPricingAtom)
  const { isVisuallySimilarPDPEnabled, setVisuallySimilarProp, visuallySimilarProp } =
    useLLMRecommendations()

  const {
    fullBleed: { fullBleedColorLightness, dynamicAssetConfig },
    pdpPreferences: { enableProductSKU = false },
    adaptiveExperience: { surveyDetails },
    powerReviews: { enableEmplifi = true },
  } = usePreference({
    'Full-Bleed': ['fullBleedColorLightness', 'dynamicAssetConfig'],
    PDPPreferences: ['enableProductSKU'],
    adaptiveExperience: ['surveyDetails'],
    powerReviews: ['isEnableLoaderOnPDP', 'enableEmplifi'],
  })

  const dynamicAssetImage = get(carouselProps, 'dynamicAssetImage')

  const isDynamicAssetPresent = useMemo(() => {
    const adaptiveCarouselAltItems = get(
      adaptiveCarouselAltMedia,
      'firstVisitItems',
      get(adaptiveCarouselAltMedia, 'secondVisitItems')
    )
    const isAssetPresent =
      dynamicAssetConfig?.enable &&
      !!dynamicAssetImage &&
      fullMedias.some((item) => isSpecificAssetTypeSrc(item.src, dynamicAssetConfig?.assetType))

    if (adaptiveCarouselAltItems && isAssetPresent && isEnabledColorAdaptive) {
      const assetType = get(dynamicAssetConfig, 'assetType')
      return adaptiveCarouselAltItems?.at(0)?.src?.includes(`_${assetType}`)
    }
    return isAssetPresent && isEnabledColorAdaptive
  }, [
    fullMedias,
    isEnabledColorAdaptive,
    dynamicAssetConfig,
    adaptiveCarouselAltMedia,
    dynamicAssetImage,
  ])

  const bgColor = useMemo(() => {
    if (carouselIndex > 0 || isScrolled) {
      return IMAGE_BASE_BACKGROUND_COLOR
    }

    return hslColors?.main
  }, [isScrolled, carouselIndex, hslColors])

  const doSetBackgroundColor = useCallback(async () => {
    if (!selectedColor?.image?.src || !isHeaderMounted) {
      return
    }
    if (isScrolled || carouselIndex > 0 || !isDynamicAssetPresent) {
      setHslColors(hslDefaultColor)
      return
    }
    const imageSrc = getProductImageSrc(selectedColor.image.src, 'mobile', 'pdp', {
      isSwatchImage: true,
    })
    const hexValue = await getAverageColor(imageSrc)
    const hslValue = hexToCssHsl(hexValue, fullBleedColorLightness)
    const secondColor = hexToCssHsl(hexValue, 0.89)
    setHslColors({
      main: hslValue,
      second: secondColor,
    })
  }, [carouselIndex, isScrolled, selectedColor, isHeaderMounted, isDynamicAssetPresent])

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > PARALLAX_THRESHOLD)
    }, 150)

    setIsScrolled(window.scrollY > PARALLAX_THRESHOLD)
    document.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    doSetBackgroundColor()
  }, [doSetBackgroundColor])

  useEffect(() => {
    setIsDynamicAssetInViewport(carouselIndex === 0 && isDynamicAssetPresent)
  }, [isDynamicAssetPresent, carouselIndex])

  const handleRouteChange = () => {
    window.history.scrollRestoration = 'manual'
    scrollToImageCarousel()
  }

  useEffect(() => {
    scrollToImageCarousel()
  }, [headerHeight])

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      setHslColors({
        main: 'var(--color-white-base)',
        second: 'var(--color-neutral-light-2)',
      })
    }
  }, [])

  useEffect(() => {
    if (isVisuallySimilarPDPEnabled) {
      setVisuallySimilarProp(visuallySimilarProp)
    } else {
      setVisuallySimilarProp('')
    }
  }, [visuallySimilarProp, isVisuallySimilarPDPEnabled])

  const imageEditorialCopy = get(productData, 'imageEditorialCopy')
  const isVisible = tangibleeWidgetProps?.onHeroImage && tangibleeWidgetProps?.isVisible

  const productSKUId = useMemo(() => {
    if (!enableProductSKU) {
      return ''
    }

    if (isBundleVariant) {
      const { requestedVariantId } = productData?.normalizeBundleProduct || {}
      const bundleVariantSKUId = requestedVariantId || ''
      return bundleVariantSKUId
    } else {
      const { productId } = productData?.defaultVariant || ''
      const productSKUValue = selectedVariantData?.id || selectedVariant?.id || productId
      return productSKUValue
    }
  }, [enableProductSKU, selectedVariantData, selectedVariant?.id])

  const isHideReview = get(productData, 'custom.c_hideReview')
  const averageRating = getAverageRating(productData)
  const totalReviews = getTotalReviews(productData)
  const stylesProductDetail = useMultiStyleConfig('ProductDetailMainSection')

  const reviewAndRatingStyles = useMemo(
    () => stylesProductDetail.ReviewAndRating(isBundleVariant, totalReviews, averageRating),
    [isBundleVariant, totalReviews, averageRating]
  )

  const shouldShowReviews =
    enableEmplifi && (totalReviews > 0 || averageRating > 0) && !isHideReview

  const renderStarRating = (additionalProps) => {
    return (
      <StarRatingMobileV3
        rating={averageRating}
        variant="mobile"
        bundleCardRedirect={bundleCardRedirect}
        masterId={productData?.masterId}
        showViewMore={false}
        svgWidth={16}
        svgHeight={16}
        isPdpV42Enabled={isPdpV42Enabled}
        {...additionalProps}
      />
    )
  }

  const newSelectedVariantAndGroup = useMemo(() => {
    return {
      variant: get(allLevelsProductsData, 'newSelectedVariant', null),
      group: get(allLevelsProductsData, 'variationGroupData', null),
    }
  }, [allLevelsProductsData])

  const promoText = useMemo(() => {
    const selectedVariantDataCallOut = get(
      newSelectedVariantAndGroup.variant || selectedVariantData,
      'promoPDP.promoCallOut',
      []
    )
    const productDataCallOut = get(
      newSelectedVariantAndGroup.group || productData,
      'promoPDP.promoCallOut',
      []
    )

    const promoArr = !!newSelectedVariantAndGroup.variant
      ? selectedVariantDataCallOut
      : productDataCallOut
    const allowedPromoCallOutArray = promoArr.filter((promo) => {
      const text = get(promo, '["call-out-message"].content.text')
      const spanText = get(promo, '["call-out-message"].content.spanText')
      return !!text || !!spanText
    })

    if (!allowedPromoCallOutArray?.length) {
      return []
    }

    if (isPdpV42Enabled && isScrolled && enablePricingPromoUpdates) {
      return getPromoByType(allowedPromoCallOutArray, PROMO_TYPES.IPX2)
    }

    return enablePricingPromoUpdates
      ? getPromoByType(allowedPromoCallOutArray, PROMO_TYPES.UPL)
      : allowedPromoCallOutArray.filter(
          (promo) => !!get(promo, '["call-out-message"].content.isOTD', false)
        )
  }, [
    selectedVariantData,
    newSelectedVariantAndGroup,
    enablePricingPromoUpdates,
    isScrolled,
    isPdpV42Enabled,
  ])

  return (
    <MainContainer
      p="mar"
      pt="0"
      pb="0"
      display="inherit"
      position="relative"
      id="tabbed-adaptive-pdp"
      mt={containerMarginTop}
      backgroundColor={bgColor}
      boxShadow={isPdpV41Enabled ? '0px -4px 44px 0px rgba(0, 0, 0, 0.08)' : null}
    >
      {isSubBrandActive && <CoachtopiaLogoButton variant="pdp" eventPageLocation="product" />}
      <Box
        sx={{
          ...styles.heroContainer,
          ...(isScrolled ? styles.heroContainerParallax : {}),
        }}
        className="pdp-product-image-container"
      >
        <ProductMediaArea
          isVisible={isVisible}
          isMobile
          {...carouselProps}
          onPurposeProps={onPurposeProps}
          isGuestUser={isGuestUser}
          membershipExclusiveProduct={membershipExclusiveProduct}
          onSwatchInteraction={onSwatchInteraction}
          tangibleeWidgetProps={tangibleeWidgetProps}
          imageEditorialCopy={imageEditorialCopy}
          isTabbedAdaptivePDP
          setCarouselIndex={setCarouselIndex}
          isDynamicAssetPresent={isDynamicAssetPresent}
          isEnabledColorAdaptive={isEnabledColorAdaptive}
        />
        {variationControlsProps?.productData && !isPdpV41Enabled && !isPdpV42Enabled && (
          <Box sx={styles.variationControlsWrapper}>
            {!isDiscontinued && (
              <ProductVariationControls
                {...variationControlsProps}
                {...variationTangibleeProps}
                hideSizes
                hideMegaPDPTabs
                isPDPTemplateV3Mobile
                hslColor={bgColor}
                variant="adaptiveTabbedPDP"
              />
            )}
          </Box>
        )}
      </Box>
      <Box
        sx={styles.contentWrapper}
        backgroundColor={
          isPdpV41Enabled || isPdpV42Enabled
            ? isScrolled
              ? '#f0f0f0'
              : 'var(--color-white-base)'
            : bgColor
        }
      >
        <Box
          id={`ministage-w-atb${isScrolled ? ' ministage-w-atb-parallax' : ''}`}
          backgroundColor={bgColor}
          sx={{
            ...styles.ministageWrapper,
            ...(isScrolled && styles.ministageWrapperParallax),
          }}
          className={isScrolled ? ' ministage-w-atb-parallax' : 'ministage-w-atb'}
        >
          {variationControlsProps?.productData && isPdpV41Enabled && (
            <Box sx={styles.variationControlsWrapper} className="variationControlsWrapper">
              {!isDiscontinued && (
                <ProductVariationControls
                  {...variationControlsProps}
                  {...variationTangibleeProps}
                  hideSizes
                  hideMegaPDPTabs
                  isPDPTemplateV3Mobile
                  hslColor={bgColor}
                  variant="adaptiveTabbedPDP"
                />
              )}
            </Box>
          )}
          <Box
            id="ministage"
            sx={{
              ...styles.ministageContainer,
              ...(isScrolled && styles.ministageContainerParallax),
            }}
          >
            <Box
              className="product-title-price-reviews-container"
              sx={styles.headerPriceReviewContainer}
            >
              <Box className="product-title-review-container" sx={styles.headerReviewContainer}>
                <Box sx={styles.headerContainer}>
                  {!isBundleVariant && headerBadges && (
                    <SlideFade unmountOnExit direction="right" in={isScrolled}>
                      <Box className="pdp-header-badges-container">
                        <Flex
                          wrap="wrap"
                          className="pdp-header-badges-list"
                          sx={styles.badgesListContainer}
                        >
                          {headerBadges}
                        </Flex>
                      </Box>
                    </SlideFade>
                  )}
                  <Heading
                    level="1"
                    variant="secondary"
                    data-qa="pdp_txt_pdt_title"
                    sx={{
                      ...styles.productHeaderTitle,
                      ...(!isPdpV42Enabled &&
                      !isScrolled &&
                      (isPdpV4ATFFullPricing || isPdpV41Enabled)
                        ? styles.productHeaderTitleTruncated
                        : {}),
                    }}
                    className={'tabbed-pdp-product-title'}
                  >
                    {productData?.name}
                  </Heading>
                </Box>
                {isPdpV42Enabled && shouldShowReviews && (
                  <Box sx={reviewAndRatingStyles}>
                    {averageRating > 0 && (
                      <Box>
                        <Flex sx={mobileStyles.reviewsWrapper} className="rating-container">
                          {renderStarRating()}
                        </Flex>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
              {!isDiscontinued && (
                <PriceBadge
                  productData={productData}
                  allLevelsProductsData={allLevelsProductsData}
                  variant="mobile"
                  selectedColor={selectedColor}
                  apploading={apploading}
                  selectedVariantData={selectedVariantData}
                  klarnaDetails={klarnaDetails}
                  selectedVariant={selectedVariant}
                  isPDPTemplateV3Mobile
                  priceBadgeStyleVariant="adaptiveTabbedPDP"
                />
              )}
              {productSKUId && !isBundleProduct && isScrolled && (
                <Box sx={styles.productSkuContainer}>
                  <Text as="span" sx={styles.productSku}>
                    <Box as="span">
                      {formatMessage({
                        id: 'pdp.product.productSKU',
                        defaultMessage: 'Product number',
                      })}
                    </Box>
                    : {productSKUId}
                  </Text>
                </Box>
              )}
            </Box>
            {isPdpV42Enabled && !isScrolled && (
              <Box className="pdp-v4-2-upl-promo-container">
                <CallOutMessage
                  promoText={promoText}
                  masterId={productData?.masterId}
                  variant="pdpV41UponLand"
                />
              </Box>
            )}
            {variationControlsProps?.productData && isPdpV42Enabled && (
              <Box sx={styles.variationControlsWrapper} className="variationControlsWrapper">
                {!isDiscontinued && (
                  <ProductVariationControls
                    {...variationControlsProps}
                    {...variationTangibleeProps}
                    hideSizes
                    hideMegaPDPTabs
                    isPDPTemplateV3Mobile
                    hslColor={bgColor}
                    variant="adaptiveTabbedPDP"
                  />
                )}
              </Box>
            )}
          </Box>
          <Box sx={styles.controlsContainer} className="controlsWrapper">
            <ProductVariationControls
              {...variationControlsProps}
              {...variationTangibleeProps}
              variationMessagesProps={variationMessagesProps}
              hideSizes={!isScrolled}
              hideMegaPDPTabs={!isScrolled}
              hideError={!isScrolled}
              hideExtendedColors={!isScrolled}
              hideColors
              isPDPTemplateV3Mobile
              hslColor={bgColor}
              variant="extendedAdaptiveTabbedPDP"
            />
          </Box>
          {isPdpV42Enabled && (
            <Box sx={styles.customizeCtaWrapper} display={isScrolled ? 'flex' : 'none'}>
              {customizeComponent}
            </Box>
          )}
          {isPdpV42Enabled && isScrolled && bundleModuleProperties?.bundleUrl && showBundleSave && (
            <Box>{bundleContentModuleComponent}</Box>
          )}
          {isPdpV42Enabled && isScrolled && (
            <Box className="pdp-v4-2-ipx2-promo-container">
              <CallOutMessage
                promoText={promoText}
                masterId={productData?.masterId}
                variant="pdpV42Parallax"
              />
            </Box>
          )}
          <Box
            data-qa="pdp_attribute_wrapper"
            sx={{
              ...styles.atbContainer,
              ...(isScrolled && styles.atbContainerParallax),
            }}
          >
            {!isDiscontinued && <AddToBagAdaptiveAreaMobile variant="adaptiveTabbedPDP" />}
          </Box>
        </Box>
        {isProductFullyOOS ? (
          <OutOfStockPDPBottom {...tabbedPDPLower} />
        ) : (
          <TabbedAdaptivePDPLower {...tabbedPDPLower} />
        )}
        <SurveyContainer answers={get(surveyDetails, `${locale}.answers`)} variant="round" />
      </Box>
    </MainContainer>
  )
}

export default TabbedAdaptivePDPUpper
