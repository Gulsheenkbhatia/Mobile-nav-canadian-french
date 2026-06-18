import { useContext, useEffect } from 'react'
import ProductHeader from 'toro/components/product/ProductHeader'
import MainContainer from 'toro/components/MainContainer'
import Box from 'toro/components/Box'
import { useRouter } from 'next/router'
import Breadcrumb from 'toro/components/BreadcrumbPage'
import ProductVariationControls from 'toro/components/product/ProductVariationControls'
import AddToBagAreaMobile from 'toro/components/product/ProductMainSection/AddToBagAreaMobile'
import PriceBadge from 'toro/components/product/PriceBadge'
import Tangiblee from 'toro/components/product/Tangiblee'
import dynamic from 'next/dynamic'
import ProductMediaArea from 'toro/components/product/ProductMediaArea'
import { ProductMainSectionBreakpointContext } from './context'
import scrollToBreadcrumb from 'helpers/scrollToBreadCrumb'
import useScrollWithHeadroomDisabled from 'toro/hooks/useScrollWithHeadroomDisabled'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useStickyHeaderHeight from 'toro/hooks/useStickyHeaderHeight'
import FindInStore from 'toro/components/product/FindInStore'
import useIsInitialRoute from 'toro/hooks/useIsInitialRoute'
import { useAtomValue } from 'jotai/utils'
import { isQuickViewAtom, productDataAtom, appLoadingAtom } from 'store/pdp.atom'
import Lazy from 'toro/components/Lazy'
import ContentAreaFour from 'toro/components/product/ContentArea/ContentAreaFour'

import DiscountinuedProduct from 'toro/components/product/DiscountinuedProduct'

const ShoppingGivesWidget = dynamic(() => import('toro/components/product/ShoppingGivesWidget'), {
  ssr: false,
})

const ProductMainSectionMobile = () => {
  const productData = useAtomValue(productDataAtom)
  const apploading = useAtomValue(appLoadingAtom)
  const scrollTo = useScrollWithHeadroomDisabled()
  const isInitialRoute = useIsInitialRoute()
  const stickyHeaderHeight = useStickyHeaderHeight()
  const isQuickView = useAtomValue(isQuickViewAtom)

  const {
    // Note: Mobile only
    onAddToWishlistSuccess,
    onRemoveFromWishlistSuccess,

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
    bundleModuleProperties,
    bundleContentModuleComponent,
    isBundleProduct,
    bundleVariationComponent,
    showBundleSave,
    tangibleeWidgetProps,
    onPurposeProps,
    shoppingWidgetProps,
    getGAProduct,
    contentAreaFour,
    shouldRenderFindInStore,
  } = useContext(ProductMainSectionBreakpointContext)

  const router = useRouter()
  const styles = useMultiStyleConfig('ProductDetailMainSection')

  const handleRouteChange = () => {
    window.history.scrollRestoration = 'manual'
    scrollToBreadcrumb(scrollTo, stickyHeaderHeight, window?.scrollY)
  }

  useEffect(() => {
    if (!isInitialRoute) {
      scrollToBreadcrumb(scrollTo, stickyHeaderHeight, window?.scrollY)
    }
  }, [])

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <>
      <Box id="breadcrumb-container" pl="mar" pr="mar" as="div" pt={'15px'}>
        <Box className="pdp-breadcrumb" overflowX="auto" w="100%">
          <Breadcrumb
            plpToPDPBreadcrumbData={makeBreadcrumb(promotionData)}
            breadcrumbData={productData?.breadcrumbs}
            lineHeight={theme.lineHeights.lg}
            apploading={apploading}
          />
        </Box>
      </Box>
      <MainContainer p={'mar'} display="inherit" sx={styles.mobileMainContainer}>
        <ProductHeader
          productData={productData}
          variant="mobile"
          badges={headerBadges}
          allLevelsProductsData={allLevelsProductsData}
          isDiscontinued={isDiscontinued}
          loading={loading}
          selectedColor={selectedColor}
          apploading={apploading}
          selectedVariant={selectedVariant}
        />
        <Box position="relative" sx={styles.mobileHeroContainer()} ml="-mar" minWidth="0">
          <ProductMediaArea
            isVisible={tangibleeWidgetProps?.isVisible}
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
          />
        </Box>

        {!isDiscontinued && (
          <PriceBadge
            productData={productData}
            allLevelsProductsData={allLevelsProductsData}
            variant="mobile"
            selectedColor={selectedColor}
            apploading={apploading}
            selectedVariantData={selectedVariantData}
            selectedVariant={selectedVariant}
          />
        )}

        {!isCustomizerProduct && tangibleeWidgetProps.isVisible && (
          <Tangiblee.OnDetails {...tangibleeWidgetProps} />
        )}
        <Box w="100%" data-qa={isBundleProduct ? 'bundle_look_wrapper' : 'pdp_attribute_wrapper'}>
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
          {isDiscontinued && <DiscountinuedProduct {...discountinuedProductProps} />}
          {isBundleProduct && bundleVariationComponent}
          {!isBundleProduct && !isQuickView && !isDiscontinued && (
            <Lazy>
              <ShoppingGivesWidget {...shoppingWidgetProps} />
            </Lazy>
          )}
          {!isBundleProduct && <ContentAreaFour {...contentAreaFour} />}
        </Box>
      </MainContainer>
    </>
  )
}

export default ProductMainSectionMobile
