import { useContext, useEffect, useMemo } from 'react'
import ProductHeader from 'toro/components/product/ProductHeader'
import MainContainer from 'toro/components/MainContainer'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import { useRouter } from 'next/router'
import ProductVariationControls from 'toro/components/product/ProductVariationControls'
import AddToBagAreaMobile from 'toro/components/product/ProductMainSection/AddToBagAreaMobile'
import get from 'lodash/get'
import PriceBadge from 'toro/components/product/PriceBadge'
import dynamic from 'next/dynamic'
import ProductMediaArea from 'toro/components/product/ProductMediaArea'
import { ProductMainSectionBreakpointContext } from './context'
import { useAtomValue } from 'jotai/utils'
import {
  productDataAtom,
  appLoadingAtom,
  isMegaPDPEligibleAtom,
  isNewMegaPDPEligibleAtom,
} from 'store/pdp.atom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import FindInStore from 'toro/components/product/FindInStore'
import StarRatingMobileV3 from 'toro/components/StarRating/StarRatingMobileV3'
import usePreference from 'toro/hooks/usePreference_new'
import Link from 'toro/components/Link'
import getAPIURL from 'helpers/getAPIURL'
import HtmlContent from 'toro/components/HtmlContent'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import Lazy from 'toro/components/Lazy'
import BreadcrumbPDPV3 from 'toro/components/BreadcrumbPDPV3'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import KlarnaWidget from 'toro/components/product/KlarnaWidget'
import useScrollToImageCarousel from 'toro/hooks/useScrollToImageCarousel'
import { isHeaderHeightAtom } from 'store/headroom.atom'
import usePDPContainerMargin from 'toro/hooks/usePDPContainerMargin'
import { getAverageRating, getTotalReviews } from 'toro/helpers/getReviewData'
import PDPRotatingBanner from 'toro/components/product/AdaptivePDPRotatingBanner'
import AfterpayWidget from 'toro/components/AfterPay/AfterpayWidget'
import AffirmWidget from 'toro/components/Affirm/AffirmWidget'
import useAffirmEligibility from 'toro/hooks/useAffirmEligibility'

import DiscountinuedProduct from 'toro/components/product/DiscountinuedProduct'
import getPromoByType, { PROMO_TEMPLATES, PROMO_TYPES } from 'toro/helpers/getPromoByType'
import { isSubBrandActiveAtom } from 'store/global.atom'
import CoachtopiaLogoButton from 'toro/components/CoachtopiaLogoButton'

const ShoppingGivesWidget = dynamic(() => import('toro/components/product/ShoppingGivesWidget'), {
  ssr: false,
})

const ProductMainSectionMobileV3 = () => {
  const productData = useAtomValue(productDataAtom)
  const apploading = useAtomValue(appLoadingAtom)
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isNewMegaPDPEligible = useAtomValue(isNewMegaPDPEligibleAtom)
  const {
    // Note: Mobile only
    onAddToWishlistSuccess,
    onRemoveFromWishlistSuccess,
    isBundleVariant,
    bundleCardRedirect,
    bundleVariantUrl,

    // Note: Desktop only
    membershipTooltipContent,

    // Note: shared between Mobile and Desktop
    makeBreadcrumb,
    promotionData,
    carouselProps,
    isGuestUser,
    membershipExclusiveProduct,
    onSwatchInteraction,
    loading,
    headerBadges,
    allLevelsProductsData,
    isDiscontinued,
    selectedColor,
    discountinuedProductProps,
    selectedVariant,
    variationControlsProps,
    variationTangibleeProps,
    customizeComponent,
    selectedQty,
    selectedVariantData,
    onPickUpInStoreClick,
    isFindInStorePickup,
    bundleModuleProperties,
    bundleContentModuleComponent,
    isBundleProduct,
    bundleVariationComponent,
    showBundleSave,
    tangibleeWidgetProps,
    onPurposeProps,
    shoppingWidgetProps,
    getGAProduct,
    currentVariationGroupId,
    enablePricingPromoUpdates,
    shouldRenderFindInStore,
  } = useContext(ProductMainSectionBreakpointContext)
  const router = useRouter()
  const styles = useMultiStyleConfig('ProductDetailMainSection')
  const callOutMessageStyles = useMultiStyleConfig('Calloutmessage')
  const headerHeight = useAtomValue(isHeaderHeightAtom)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  const scrollToImageCarousel = useScrollToImageCarousel()

  const containerMarginTop = usePDPContainerMargin()

  const handleRouteChange = () => {
    window.history.scrollRestoration = 'manual'
    scrollToImageCarousel()
  }

  useEffect(() => {
    scrollToImageCarousel()
  }, [headerHeight])

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  const { custom } = productData || {}
  const mobileStyles = useMultiStyleConfig('ProductHeader', { variant: 'mobile' })

  const imageEditorialCopy = get(productData, 'imageEditorialCopy')
  const { url: activeUrl } = selectedVariantData || selectedColor || productData || {}
  const isVisible = tangibleeWidgetProps?.onHeroImage && tangibleeWidgetProps?.isVisible
  const shouldShowAffirm = useAffirmEligibility()

  const {
    powerReviews: { isEnableLoaderOnPDP = true, enableEmplifi = true },
    afterPay: { enableAfterpay },
  } = usePreference({
    powerReviews: ['isEnableLoaderOnPDP', 'enableEmplifi'],
    afterPay: ['enableAfterpay'],
    affirm: ['AffirmOnline', 'AffirmProductMessage'],
  })

  const isHideReview = get(custom, 'c_hideReview')
  const averageRating = getAverageRating(productData)
  const totalReviews = getTotalReviews(productData)

  const reviewAndRatingStyles = useMemo(
    () => styles.ReviewAndRating(isBundleVariant, totalReviews, averageRating),
    [isBundleVariant, totalReviews, averageRating]
  )

  const shouldShowReviews =
    enableEmplifi && (totalReviews > 0 || averageRating > 0) && !isHideReview

  const isMegaPDP = isMegaPDPEligible || isNewMegaPDPEligible

  const renderStarRating = (additionalProps) => {
    const starRating = (
      <StarRatingMobileV3
        rating={averageRating}
        variant="mobile"
        bundleCardRedirect={bundleCardRedirect}
        masterId={productData?.masterId}
        {...additionalProps}
      />
    )
    const currentUrl = isBundleVariant ? bundleVariantUrl : activeUrl
    const matches = currentUrl?.match(/[a-z\d]+=[a-z\d]+/gi)
    const count = matches ? matches.length : 0

    return isBundleVariant ? (
      <Link
        href={
          isBundleVariant
            ? `${currentUrl}`
            : `${currentUrl}${count === 0 ? '?' : '&'}scrollToReview=true`
        }
        variant="unstyled"
        prefetchUrl={getAPIURL(currentUrl)}
        pointerEvents={isEnableLoaderOnPDP ? null : 'none'}
      >
        {starRating}
      </Link>
    ) : (
      <>{starRating}</>
    )
  }

  const promoText = useMemo(() => {
    const newSelectedVariant = get(allLevelsProductsData, 'newSelectedVariant')
    const newSelectedVariationGroup = get(allLevelsProductsData, 'variationGroupData')

    const selectedVariantDataCallOut = get(
      newSelectedVariant || selectedVariantData,
      'promoPDP.promoCallOut',
      []
    )
    const productDataCallOut = get(
      newSelectedVariationGroup || productData,
      'promoPDP.promoCallOut',
      []
    )

    const promoArr = !!newSelectedVariant ? selectedVariantDataCallOut : productDataCallOut

    if (enablePricingPromoUpdates) {
      // keep only IPX1 callout message without OTD price
      const ipxOnePromo = getPromoByType(promoArr, PROMO_TYPES.IPX1, PROMO_TEMPLATES.V3)
      const isOTDPricePromo = ipxOnePromo.filter((promo) =>
        get(promo, '[call-out-message].content.promo.hasOTDPrice', false)
      )
      return isOTDPricePromo
    }

    // keep only first callout message
    return promoArr.slice(0, 1)
  }, [allLevelsProductsData])

  return (
    <MainContainer
      p="mar"
      pt="0"
      display="inherit"
      sx={{ ...styles.mobileMainContainer, ...styles.mobileUpperMainContainer }}
      mt={containerMarginTop}
    >
      {isSubBrandActive && <CoachtopiaLogoButton variant="pdp" eventPageLocation="product" />}
      <Box
        position="relative"
        sx={styles.mobileHeroContainer()}
        className="pdp-product-image-container"
        ml="-mar"
        minWidth="0"
      >
        <ProductMediaArea
          isVisible={isVisible}
          isMobile
          {...carouselProps}
          onPurposeProps={onPurposeProps}
          isGuestUser={isGuestUser}
          membershipExclusiveProduct={membershipExclusiveProduct}
          membershipTooltipContent={membershipTooltipContent}
          onSwatchInteraction={onSwatchInteraction}
          isBundleProduct={isBundleProduct}
          tangibleeWidgetProps={tangibleeWidgetProps}
          onAddToWishlistSuccess={onAddToWishlistSuccess}
          onRemoveFromWishlistSuccess={onRemoveFromWishlistSuccess}
          imageEditorialCopy={imageEditorialCopy}
          isSwatchChanged={variationControlsProps?.colorClicked}
        />
      </Box>
      {!productData.isBundleProduct && !isDiscontinued && promoText.length > 0 && (
        <CallOutMessage
          promoText={promoText}
          masterId={productData.masterId}
          variant={enablePricingPromoUpdates ? 'pdpV3Promo' : null}
        />
      )}
      {productData.isBundleProduct && !isDiscontinued && productData.promoText?.trim() && (
        <Box className="callout-message-container callout-message-full-width">
          <HtmlContent
            sx={callOutMessageStyles.pdpCalloutmessage()}
            content={productData.promoText}
          />
        </Box>
      )}
      <Flex sx={styles.breadCrumbWrapperContainer}>
        <BreadcrumbPDPV3
          dataFromPLP={makeBreadcrumb(promotionData)}
          data={productData?.breadcrumbs}
          apploading={apploading}
          sx={
            shouldShowReviews
              ? mobileStyles.breadcrumbsWrapperSmall
              : mobileStyles.breadcrumbsWrapperLarge
          }
        />
        {shouldShowReviews && (
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
      </Flex>
      {variationControlsProps?.productData && !isMegaPDP && (
        <Box>
          {!isDiscontinued && (
            <ProductVariationControls
              {...variationControlsProps}
              {...variationTangibleeProps}
              hideSizes
              isPDPTemplateV3Mobile
            />
          )}
        </Box>
      )}
      <ProductHeader
        currentVariationGroupId={currentVariationGroupId}
        productData={productData}
        variant="mobile"
        badges={headerBadges}
        allLevelsProductsData={allLevelsProductsData}
        isDiscontinued={isDiscontinued}
        loading={loading}
        selectedColor={selectedColor}
        apploading={apploading}
        selectedVariant={selectedVariant}
        onAddToWishlistSuccess={onAddToWishlistSuccess}
        onRemoveFromWishlistSuccess={onRemoveFromWishlistSuccess}
      />

      {!isDiscontinued && (
        <PriceBadge
          productData={productData}
          allLevelsProductsData={allLevelsProductsData}
          variant="mobile"
          selectedColor={selectedColor}
          apploading={apploading}
          selectedVariantData={selectedVariantData}
          selectedVariant={selectedVariant}
          isPDPTemplateV3Mobile
          priceBadgeStyleVariant={enablePricingPromoUpdates && 'v3PromoPriceBadge'}
        />
      )}
      {enablePricingPromoUpdates && (
        <PDPRotatingBanner
          productData={productData}
          variantData={selectedVariantData}
          v3RotationBanner
        />
      )}
      {variationControlsProps?.productData && (
        <Box
          mb="var(--spacing-2)"
          sx={styles.BottomProductVariationControls}
          className="product-variations-wrapper"
        >
          {!isDiscontinued && (
            <ProductVariationControls
              {...variationControlsProps}
              {...variationTangibleeProps}
              hideColors={!isMegaPDP}
              isPDPTemplateV3Mobile
            />
          )}
        </Box>
      )}
      <Box
        data-qa={isBundleProduct ? 'bundle_look_wrapper' : 'pdp_attribute_wrapper'}
        sx={styles?.customizedContainer}
        className="product-attribute-wrapper"
      >
        {customizeComponent}
        {bundleModuleProperties?.bundleUrl && showBundleSave && (
          <Box>{bundleContentModuleComponent}</Box>
        )}
        {!isDiscontinued && <AddToBagAreaMobile />}

        {shouldRenderFindInStore && (
          <FindInStore
            productData={productData}
            selectedVariant={selectedVariant}
            onPickUpInStoreClick={onPickUpInStoreClick}
            isFindInStorePickup={isFindInStorePickup}
            selectedVariantData={selectedVariantData}
            selectedQty={selectedQty}
            getGAProduct={getGAProduct}
          />
        )}
        {!isBundleProduct && !enablePricingPromoUpdates && (
          <Experiment forIDs={EXPERIMENTS.PDP_V3_3}>
            <KlarnaWidget skeletonProps={{ h: '42.5px', w: '100%' }} />
            {enableAfterpay && <AfterpayWidget variant="pdpV3" />}
            {shouldShowAffirm && <AffirmWidget />}
          </Experiment>
        )}
        {isDiscontinued && <DiscountinuedProduct {...discountinuedProductProps} />}
        {isBundleProduct && bundleVariationComponent}
        <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD}>
          {!isBundleProduct && !isDiscontinued && (
            <Lazy>
              <ShoppingGivesWidget {...shoppingWidgetProps} />
            </Lazy>
          )}
        </Experiment>
      </Box>
    </MainContainer>
  )
}

export default ProductMainSectionMobileV3
