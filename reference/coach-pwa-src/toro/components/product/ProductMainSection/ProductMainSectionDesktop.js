import { useContext, useEffect, useMemo } from 'react'
import ProductHeader from 'toro/components/product/ProductHeader'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Breadcrumb from 'toro/components/BreadcrumbPage'
import ProductVariationControls from 'toro/components/product/ProductVariationControls'
import ProductDetails from 'toro/components/ProductDetails'
import get from 'lodash/get'
import Link from 'toro/components/Link'
import Text from 'toro/components/Text'
import SocialMediaArea from 'toro/components/product/SocialMediaArea'
import Skeleton from 'toro/components/Skeleton'
import dynamic from 'next/dynamic'
import ProductMediaArea from 'toro/components/product/ProductMediaArea'
import { ProductMainSectionBreakpointContext } from './context'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useRouter } from 'next/router'
import AddToBagAreaDesktop from 'toro/components/product/ProductMainSection/AddToBagAreaDesktop'
import ShoppingGivesWidget from 'toro/components/product/ShoppingGivesWidget'
import Tangiblee from 'toro/components/product/Tangiblee'
import FindInStore from 'toro/components/product/FindInStore'
import useHasMounted from 'toro/hooks/useHasMounted'
import CustomSlot from 'toro/cms/components/CustomSlot'
import PaymentLogos from 'toro/components/PaymentLogos'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import ContentAreaFour from 'toro/components/product/ContentArea/ContentAreaFour'
import { useAtomValue } from 'jotai/utils'
import { isQuickViewAtom, productDataAtom, appLoadingAtom } from 'store/pdp.atom'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'

import DiscountinuedProduct from 'toro/components/product/DiscountinuedProduct'

const RatingsAndReviews = dynamic(
  () => import('toro/components/product/ProductMainSection/LazyRatingsAndReviews'),
  {
    ssr: false,
  }
)

const ProductMainSectionDesktop = ({ selectedVariantOrVG }) => {
  const quickViewStyles = useMultiStyleConfig('ProductDetailMainSection', { variant: 'quickview' })
  const productData = useAtomValue(productDataAtom)
  const apploading = useAtomValue(appLoadingAtom)

  const isReviewSectionUnderProductImage = useExperiment(EXPERIMENTS.REVIEW_UNDER_PRODUCT_IMAGE)
  const { isDesktop } = useViewportType()
  const isQuickView = useAtomValue(isQuickViewAtom)
  const {
    // Note: Desktop only
    membershipTooltipContent,
    onClickViewFullProductDetails,
    formatMessage,
    activeUrl,
    paymentLogosData,
    isPaymentLogosEnabledOnPDP,

    // Note: shared between Mobile and Desktop
    onAddToWishlistSuccess,
    onRemoveFromWishlistSuccess,
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
    isHideReview,
    ratingsAndReviews,
    selectedColor,
    discountinuedProductProps,
    isCustomizerProduct,
    selectedVariant,
    variationControlsProps,
    variationTangibleeProps,
    customizeComponent,
    selectedQty,
    selectedVariantData,
    theme,
    onPickUpInStoreClick,
    isFindInStorePickup,
    tulipEnabled,
    tulipConfigData,
    bundleModuleProperties,
    bundleContentModuleComponent,
    bundleVariationComponent,
    isBundleProduct,
    showBundleSave,
    tangibleeWidgetProps,
    sustainabilityIconsData,
    shoppingWidgetProps,
    newSelectedVariant,
    onPurposeProps,
    getGAProduct,
    contentAreaFour,
    shouldRenderFindInStore,
  } = useContext(ProductMainSectionBreakpointContext)
  const router = useRouter()

  const handleRouteChange = () => {
    window.history.scrollRestoration = 'manual'
    const isRecommendation = router.query?.rrec
    const top = isRecommendation ? 0 : window?.scrollY || 0
    window.scrollTo({ top: top, left: 0 })
  }

  const activePageData = useMemo(() => {
    if (selectedVariantData) {
      return {
        ...productData,
        selectedVariantData,
        selectedColor,
        isServerSide: false,
        vgFetched: {},
      }
    } else if (selectedColor) {
      return { ...productData, selectedColor, isServerSide: false, vgFetched: {} }
    } else {
      return { ...productData, isServerSide: false, vgFetched: {} }
    }
  }, [productData, selectedVariantData, selectedColor])

  const {
    powerReviews: { enableEmplifi = false },
  } = usePreference({
    powerReviews: ['enableEmplifi'],
  })
  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  const isMounted = useHasMounted()

  return (
    <>
      {!isQuickView && (
        <Box overflowX="auto" minW="386px" mb="m">
          <Breadcrumb
            plpToPDPBreadcrumbData={makeBreadcrumb(promotionData)}
            breadcrumbData={productData?.breadcrumbs}
            apploading={apploading}
          />
        </Box>
      )}
      <Flex w="100%" alignItems="stretch">
        <Box
          flexBasis="0"
          flexGrow={isQuickView ? '0' : 1}
          position="relative"
          mr={isQuickView ? 'mar' : 'l'}
          ml={isQuickView ? '-12px' : '0'}
          maxWidth={!isQuickView ? 'calc(100% - 454px)' : null}
        >
          <ProductMediaArea
            isQuickView={isQuickView}
            {...carouselProps}
            isGuestUser={isGuestUser}
            membershipExclusiveProduct={membershipExclusiveProduct}
            membershipTooltipContent={membershipTooltipContent}
            onSwatchInteraction={onSwatchInteraction}
            isBundleProduct={isBundleProduct}
            tangibleeWidgetProps={tangibleeWidgetProps}
            onAddToWishlistSuccess={onAddToWishlistSuccess}
            onRemoveFromWishlistSuccess={onRemoveFromWishlistSuccess}
          />
          {isReviewSectionUnderProductImage &&
            !isQuickView &&
            !isBundleProduct &&
            !apploading &&
            !isHideReview &&
            enableEmplifi && <RatingsAndReviews {...ratingsAndReviews} />}
        </Box>
        <Box w={isQuickView ? '50%' : '430px'} sx={{ minWidth: isQuickView ? '50%' : '' }}>
          <ProductHeader
            productData={productData}
            badges={headerBadges}
            allLevelsProductsData={allLevelsProductsData}
            isDiscontinued={isDiscontinued}
            isQuickView={isQuickView}
            loading={loading}
            selectedColor={selectedColor}
            apploading={apploading}
            selectedVariantData={selectedVariantData}
            selectedVariant={selectedVariant}
            onPurposeProps={onPurposeProps}
          />
          {isDiscontinued && (
            <DiscountinuedProduct {...discountinuedProductProps} h={isDesktop && '62px'} />
          )}
          {!isCustomizerProduct && tangibleeWidgetProps.isVisible && (
            <Tangiblee.OnDetails {...tangibleeWidgetProps} />
          )}
          <Box data-qa={isBundleProduct ? 'bundle_look_wrapper' : 'pdp_attribute_wrapper'}>
            {variationControlsProps?.productData && (
              <Box data-qa={isQuickView ? 'qv_attribute_wrapper' : ''}>
                {!isDiscontinued && (
                  <ProductVariationControls
                    {...variationControlsProps}
                    {...variationTangibleeProps}
                  />
                )}
              </Box>
            )}
            {!isDiscontinued && customizeComponent}
            {bundleModuleProperties?.bundleUrl && showBundleSave && (
              <Box>{bundleContentModuleComponent}</Box>
            )}
            {!isDiscontinued && <AddToBagAreaDesktop />}
            {isQuickView ? (
              <Box
                textAlign="center"
                pt={theme.space[4]}
                sx={quickViewStyles.viewProductDetailsStyles}
              >
                {loading ? (
                  <Skeleton
                    minHeight={'20px'}
                    bg="var(--neutrals-color-neutral-light)"
                    w={'100%'}
                  />
                ) : (
                  <Link
                    href={activeUrl}
                    textDecoration="underline"
                    data-qa="qv_link_viewfull_pdtls"
                    pageData={activePageData}
                  >
                    <Text
                      size="xs"
                      variant="body-text-primary"
                      sx={quickViewStyles.pdpRedirectLink}
                      onClick={onClickViewFullProductDetails}
                    >
                      {formatMessage({ id: 'plp.quickview.viewFullProductDetails' })}
                    </Text>
                  </Link>
                )}
              </Box>
            ) : (
              <>
                {shouldRenderFindInStore && (
                  <FindInStore
                    productData={productData}
                    selectedVariant={newSelectedVariant}
                    onPickUpInStoreClick={onPickUpInStoreClick}
                    isFindInStorePickup={isFindInStorePickup}
                    selectedVariantData={selectedVariantData}
                    selectedQty={selectedQty}
                    getGAProduct={getGAProduct}
                    lazyMinHeight={100}
                  />
                )}
                {isBundleProduct && bundleVariationComponent}
                {!isBundleProduct && !isQuickView && !isDiscontinued && (
                  <ShoppingGivesWidget {...shoppingWidgetProps} />
                )}
                {!isBundleProduct && <ContentAreaFour {...contentAreaFour} />}
                <ProductDetails
                  isBundleProduct={isBundleProduct}
                  isDiscontinued={isDiscontinued}
                  isCustomized={isCustomizerProduct}
                  sustainabilityIconsData={sustainabilityIconsData}
                  selectedVariantOrVG={selectedVariantOrVG}
                  {...tangibleeWidgetProps}
                />
                {!isDiscontinued && isMounted && (
                  <SocialMediaArea
                    socialMedia={
                      tulipEnabled
                        ? get(productData, 'tulipSocialMedia["liveConnect-StylingAdvice-new"]', {})
                        : get(productData, 'socialMedia["liveConnect-StylingAdvice"]', {})
                    }
                    productData={productData}
                    tulipConfigData={tulipConfigData}
                  />
                )}
                {isPaymentLogosEnabledOnPDP && (
                  <CustomSlot content={paymentLogosData} Component={PaymentLogos} />
                )}
              </>
            )}
          </Box>
        </Box>
      </Flex>
    </>
  )
}

export default ProductMainSectionDesktop
