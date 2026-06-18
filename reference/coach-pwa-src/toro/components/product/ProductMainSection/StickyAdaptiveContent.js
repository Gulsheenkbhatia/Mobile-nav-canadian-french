import React, { useCallback, useContext, useMemo } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import ProductVariationControls from 'toro/components/product/ProductVariationControls'
import AddToBagButton from 'toro/components/product/AddToBagButton'
import VariationMessages from 'toro/components/product/VariationMessages'
import {
  ORDERING_STATUS,
  ORDERING_ERROR,
  checkInsStockText,
  NOT_AVAILABLE_STATUSES_ARRAY,
} from 'toro/helpers/productVariations'
import NotifyMeButton from 'toro/components/product/NotifyMeWidget/NotifyMeButton'
import SigninMemberButton from 'toro/components/product/SigninMemberButton'
import get from 'lodash/get'
import Text from 'toro/components/Text'
import StickyContainer from 'toro/components/StickyContainer'
import StickyBundleContainer from 'toro/components/product/Bundle/BundleVariants/bundleStickyContainer'
import { useIntl } from 'react-intl'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import { CloseIcon } from 'toro/icons'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import { useAtomValue } from 'jotai/utils'
import { isQuickViewAtom, productIdAtom, alterCtaToShowAtom, AlterCtaToShow } from 'store/pdp.atom'
import QuantitySelector from 'toro/components/product/QuantitySelector'
import { ProductMainSectionBreakpointContext } from './context'
import PaymentWidget from 'toro/components/PaymentWidget'
import FindInStore from 'toro/components/product/FindInStore'
import ByNowButtonBase from 'toro/components/BuyNowButton'
const BuyNowButton = withFeatureFlag(ByNowButtonBase, { PDPPreferences: ['showBuyNowButton'] })

const StickyAdaptiveContent = ({
  setFlyoutOpen,
  stickyATCvarDrawerAttr,
  isFlyoutOpen,
  styles,
  isBundleProduct,
  stickyBundleCount,
  stickyContainerComp,
  stickyContainerState,
  variationControlsProps,
  variationTangibleeProps,
  variationMessagesProps,
  stickyAddToCartPriceEnabled,
  productData,
  isStickyAddToCartBelowTheFoldEnabled,
  isStickyAddToBagUponLandEnabled,
  orderingStatus,
  isNotifyMeProduct,
  selectedVariantData,
  setOrderingError,
  selectedVariant,
  addToBagButtonProps,
  selectedQty,
  isFindInStorePickup,
  newSelectedVariant,
  onPickUpInStoreClick,
  getGAProduct,
  sfraEnableFindInStoreV4,
  shouldRenderFindInStore,
}) => {
  const { formatMessage } = useIntl()

  const {
    productMaxOrderableQty,
    onChangeQuantity,
    quickViewEventLocation,
    currentVariationGroupId,
    isQuantitySelectorEnable,
    membershipExclusiveProduct,
    persistSoldOutSetting,
    isCustomizerProduct,
    membershipExclusiveProductCTAEnabled,
    memberExclusiveButtonProps,
  } = useContext(ProductMainSectionBreakpointContext)

  const productId = useAtomValue(productIdAtom)
  const isQuickView = useAtomValue(isQuickViewAtom)
  const alterCtaToShow = useAtomValue(alterCtaToShowAtom)
  const isInStock = useMemo(
    () => checkInsStockText(addToBagButtonProps.productData),
    [addToBagButtonProps?.productData]
  )
  const showQuantitySelector = !isQuantitySelectorEnable && !isBundleProduct

  const quantitySelectorProps = {
    maxQty: productMaxOrderableQty,
    disabled: orderingStatus === ORDERING_STATUS.soldOut || addToBagButtonProps.maxQuantityError,
    selectedQuantity: selectedQty,
    onChange: onChangeQuantity,
    isQuickView: isQuickView,
    productId: productId,
    quickViewEventLocation,
    selectedVgId: currentVariationGroupId,
    variant: 'adaptiveTabbedPDP',
  }

  const shouldDisplayAlterCta =
    !persistSoldOutSetting &&
    !NOT_AVAILABLE_STATUSES_ARRAY.includes(orderingStatus) &&
    !isInStock &&
    !isBundleProduct &&
    !membershipExclusiveProduct

  const shouldDisplayBuyNowButton =
    shouldDisplayAlterCta && !isCustomizerProduct && alterCtaToShow === AlterCtaToShow.BUYNOW

  const onClose = useCallback(() => {
    setFlyoutOpen?.(false)
  }, [setFlyoutOpen])

  const showFindInStore = shouldRenderFindInStore && sfraEnableFindInStoreV4

  return (
    <StickyContainer
      setFlyoutOpen={setFlyoutOpen}
      isFlyoutOpen={stickyATCvarDrawerAttr && isFlyoutOpen}
      isBundleProduct
      isStickyAddToCartBelowTheFoldEnabled={isStickyAddToCartBelowTheFoldEnabled}
      isStickyAddToBagUponLandEnabled={isStickyAddToBagUponLandEnabled}
      stickyAddToCartPriceEnabled={stickyAddToCartPriceEnabled}
      variant="adaptiveTabbedPDP"
    >
      {stickyATCvarDrawerAttr && (
        <Box
          sx={styles.drawerWrapper}
          display={isFlyoutOpen && stickyATCvarDrawerAttr ? 'block' : 'none'}
        >
          <Flex sx={styles.drawerSelectoptionWrapper} justify="space-between" alignItems="center">
            <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
              <Text size="xs" variant="body-text-primary" sx={styles.drawerSelectoptionWrapperText}>
                {formatMessage({
                  id: 'pdp.drawerSelectoptionText',
                  defaultMessage: 'SELECT OPTIONS',
                })}{' '}
                {isBundleProduct && stickyBundleCount}
              </Text>
            </Experiment>
            <CloseIcon height="32px" width="32px" viewBox="0 0 26 26" onClick={onClose} />
          </Flex>
          {isBundleProduct && stickyContainerComp?.length && (
            <StickyBundleContainer {...stickyContainerState[stickyContainerComp?.[0]?.productId]} />
          )}
          {!isBundleProduct && variationControlsProps?.productData && (
            <ProductVariationControls
              {...variationControlsProps}
              {...variationTangibleeProps}
              isSticky
            />
          )}
          <VariationMessages
            {...(isBundleProduct
              ? {
                  ...stickyContainerState[stickyContainerComp?.[0]?.productId]
                    ?.variationMessagesProps,
                }
              : { ...variationMessagesProps })}
            isSticky
          />
        </Box>
      )}

      <Flex sx={styles.stickyPriceWrapper}>
        {showFindInStore && (
          <FindInStore
            productData={addToBagButtonProps.productData}
            selectedVariant={newSelectedVariant}
            onPickUpInStoreClick={onPickUpInStoreClick}
            isFindInStorePickup={isFindInStorePickup}
            selectedVariantData={selectedVariantData}
            selectedQty={selectedQty}
            getGAProduct={getGAProduct}
            sfraEnableFindInStoreV4={sfraEnableFindInStoreV4}
            displayV2Bopis
          />
        )}
        {showQuantitySelector && !isInStock && orderingStatus !== ORDERING_STATUS.soldOut && (
          <QuantitySelector isSticky {...quantitySelectorProps} />
        )}
        {!persistSoldOutSetting && !membershipExclusiveProductCTAEnabled ? (
          <AddToBagButton
            {...addToBagButtonProps}
            isSticky
            selectedVariant={selectedVariant}
            selectedQty={selectedQty}
            variant="adaptiveTabbedPDP"
            priceInButton={
              !showFindInStore && !shouldDisplayBuyNowButton && productData?.prices?.currentPrice
            }
          />
        ) : (
          membershipExclusiveProduct &&
          membershipExclusiveProductCTAEnabled && (
            <SigninMemberButton {...memberExclusiveButtonProps} variant="pdpV41" />
          )
        )}
        {shouldDisplayBuyNowButton && (
          <BuyNowButton
            onBuyNowButtonClick={addToBagButtonProps.onClick}
            isSticky
            maxQuantityError={
              addToBagButtonProps.maxQuantityError || variationMessagesProps.maxQuantityError
            }
            selectedVariantId={selectedVariant?.id}
            selectedQty={selectedQty}
            errorType={variationMessagesProps?.errorType}
            variant="adaptiveTabbedPDP"
          />
        )}
        {shouldDisplayAlterCta && (
          <PaymentWidget
            variant="adaptiveTabbedPDP"
            productData={selectedVariant}
            selectedQty={selectedQty}
            onClick={addToBagButtonProps.onApplePayClick}
            onOpen={addToBagButtonProps.onApplePayOpen}
            disabled={variationMessagesProps?.errorType === ORDERING_ERROR.cartThreshold}
          />
        )}
        {orderingStatus === ORDERING_STATUS.soldOut && isNotifyMeProduct && (
          <NotifyMeButton
            productId={get(selectedVariantData, 'id', null)}
            setOrderingError={setOrderingError}
            selectedVariant={selectedVariant}
            isSticky
            isFlyoutOpen={isFlyoutOpen}
            setFlyoutOpen={setFlyoutOpen}
            productName={get(productData, 'name') || ''}
            variant="adaptiveTabbedPDP"
            selectedColor={get(variationControlsProps, 'selectedColor', {})}
          />
        )}
      </Flex>
    </StickyContainer>
  )
}

StickyAdaptiveContent.propTypes = {
  setFlyoutOpen: PropTypes.func,
  stickyATCvarDrawerAttr: PropTypes.array,
  isFlyoutOpen: PropTypes.bool,
  styles: PropTypes.object,
  isBundleProduct: PropTypes.bool,
  stickyBundleCount: PropTypes.string,
  stickyContainerComp: PropTypes.array,
  stickyContainerState: PropTypes.object,
  variationControlsProps: PropTypes.object,
  variationTangibleeProps: PropTypes.object,
  variationMessagesProps: PropTypes.object,
  stickyAddToCartPriceEnabled: PropTypes.bool,
  productData: PropTypes.object,
  allLevelsProductsData: PropTypes.object,
  selectedColor: PropTypes.object,
  isStickyAddToCartBelowTheFoldEnabled: PropTypes.bool,
  isStickyAddToBagUponLandEnabled: PropTypes.bool,
  membershipExclusiveProductCTAEnabled: PropTypes.bool,
  memberExclusiveButtonProps: PropTypes.object,
  orderingStatus: PropTypes.string,
  isNotifyMeProduct: PropTypes.bool,
  isNotifyMeAvailableBundle: PropTypes.bool,
  selectedVariantData: PropTypes.object,
  setOrderingError: PropTypes.func,
  selectedVariant: PropTypes.object,
  addToBagButtonProps: PropTypes.object,
}

StickyAdaptiveContent.defaultProps = {
  setFlyoutOpen: () => {},
  setOrderingError: () => {},
}

export default withErrorBoundaryWrapper(StickyAdaptiveContent)
