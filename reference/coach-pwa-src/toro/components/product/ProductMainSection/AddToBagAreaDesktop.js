import React, { useContext, useMemo } from 'react'
import AddToBagButton from 'toro/components/product/AddToBagButton'
import VariationMessages from 'toro/components/product/VariationMessages'
import {
  ORDERING_STATUS,
  ORDERING_ERROR,
  NOT_AVAILABLE_STATUSES_ARRAY,
  checkInsStockText,
} from 'toro/helpers/productVariations'
import Badges from 'toro/components/badges/Badges'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import Flex from 'toro/components/Flex'
import get from 'lodash/get'
import { ProductMainSectionBreakpointContext } from './context'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { bundleIsNotifyMeAvailableAtom } from 'store/bundle.atom'
import isFunction from 'lodash/isFunction'
import dynamic from 'next/dynamic'
import QuantitySelector from 'toro/components/product/QuantitySelector'
import { useAtomValue } from 'jotai/utils'
import {
  isQuickViewAtom,
  alterCtaToShowAtom,
  AlterCtaToShow,
  productDataAtom,
  appLoadingAtom,
} from 'store/pdp.atom'
import useViewportType from 'toro/hooks/useViewportType'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import PaymentWidget from 'toro/components/PaymentWidget'

import ByNowButtonBase from 'toro/components/BuyNowButton'
const BuyNowButton = withFeatureFlag(ByNowButtonBase, { PDPPreferences: ['showBuyNowButton'] })

const SigninMemberButton = dynamic(() => import('toro/components/product/SigninMemberButton'))
const NotifyMeButton = dynamic(() =>
  import('toro/components/product/NotifyMeWidget/NotifyMeButton')
)
function AddToBagAreaDesktop() {
  const {
    setQuickViewedProduct,
    maxQuantityError,
    isNotifyMeProduct,
    variationMessagesProps,
    isLoggedIn,
    orderingStatus,
    memberExclusiveButtonProps,
    isQuantitySelectorEnable,
    productMaxOrderableQty,
    onChangeQuantity,
    persistSoldOutSetting,
    addToBagButtonProps,
    setOrderingError,
    isFlyoutOpen,
    setFlyoutOpen,
    membershipExclusiveProductCTAEnabled,
    isBundleProduct,
    selectedVariant,
    allLevelsProductsData,
    selectedQty,
    membershipExclusiveProduct,
    newSelectedVariant,
    quickViewEventLocation,
    currentVariationGroupId,
    stickyContent,
    isCustomizerProduct,
  } = useContext(ProductMainSectionBreakpointContext)
  const quickViewStyles = useMultiStyleConfig('ProductDetailMainSection', { variant: 'quickview' })
  const isNotifyMeAvailableBundle = useAtomValue(bundleIsNotifyMeAvailableAtom)
  const styles = useMultiStyleConfig('ProductDetailMainSection', {})
  const addToBagCTAStyles = useMemo(
    () => isFunction(styles.addToBagCTA) && styles.addToBagCTA(isBundleProduct),
    [isBundleProduct]
  )
  const { isDesktop } = useViewportType()
  const isQuickView = useAtomValue(isQuickViewAtom)
  const alterCtaToShow = useAtomValue(alterCtaToShowAtom)
  const productData = useAtomValue(productDataAtom)
  const apploading = useAtomValue(appLoadingAtom)
  const isInStock = useMemo(
    () => checkInsStockText(addToBagButtonProps.productData),
    [addToBagButtonProps?.productData]
  )

  let selectedProductIdWithColor = get(selectedVariant, 'productId', get(selectedVariant, 'id', ''))
  const selectedColorId = get(selectedVariant, 'variationValues.color', '')
  if (!selectedProductIdWithColor.includes(selectedColorId)) {
    selectedProductIdWithColor = `${selectedProductIdWithColor}-${selectedColorId}`
  }

  const shouldDisplayAlterCta =
    !persistSoldOutSetting &&
    !NOT_AVAILABLE_STATUSES_ARRAY.includes(orderingStatus) &&
    !isInStock &&
    !isBundleProduct &&
    !membershipExclusiveProduct

  const shouldDisplayBuyNowButton =
    shouldDisplayAlterCta &&
    !isCustomizerProduct &&
    !isQuickView &&
    alterCtaToShow === AlterCtaToShow.BUYNOW

  const quantitySelectorProps = {
    mr: 'mar',
    maxQty: productMaxOrderableQty,
    disabled: orderingStatus === ORDERING_STATUS.soldOut || maxQuantityError,
    selectedQuantity: selectedQty,
    onChange: onChangeQuantity,
    isQuickView: isQuickView,
    productId: selectedProductIdWithColor,
    sxStyles: quickViewStyles.quantitySelector,
    quickViewEventLocation,
    selectedVgId: currentVariationGroupId,
    selectedProductId: selectedVariant?.id,
  }

  const renderAddToBagButton = () => (
    <AddToBagButton
      {...addToBagButtonProps}
      isQuickView={isQuickView}
      selectedVariant={selectedVariant}
      selectedQty={selectedQty}
    />
  )

  if (isNotifyMeProduct || isNotifyMeAvailableBundle) {
    return (
      <Flex
        flexDirection="column"
        minH={isDesktop && '60px'}
        sx={styles.leftItem}
        className="left-item"
      >
        {!isBundleProduct && <VariationMessages {...variationMessagesProps} />}
        {!isQuickView && orderingStatus !== ORDERING_STATUS.soldOut && selectedVariant && (
          <Badges
            area={BadgeArea.INVENTORY_STATUS}
            page="pdp"
            variant="inventoryStatus"
            {...allLevelsProductsData}
          />
        )}
        <Flex w="100%" flexDirection="column" flexWrap="nowrap" sx={addToBagCTAStyles} mb={3}>
          {membershipExclusiveProductCTAEnabled ? (
            <SigninMemberButton {...memberExclusiveButtonProps} />
          ) : (
            <>
              <Flex w="100%">
                {!isQuantitySelectorEnable &&
                  !isBundleProduct &&
                  orderingStatus !== ORDERING_STATUS.soldOut && (
                    <QuantitySelector {...quantitySelectorProps} flexShrink={0} />
                  )}
                {isBundleProduct && !isNotifyMeAvailableBundle && renderAddToBagButton()}
                {!persistSoldOutSetting && !isBundleProduct && renderAddToBagButton()}
              </Flex>
              {shouldDisplayBuyNowButton && (
                <BuyNowButton
                  onBuyNowButtonClick={addToBagButtonProps.onClick}
                  isSticky={addToBagButtonProps.isSticky}
                  maxQuantityError={
                    addToBagButtonProps.maxQuantityError || variationMessagesProps.maxQuantityError
                  }
                  selectedVariantId={selectedVariant?.id}
                  selectedQty={selectedQty}
                  errorType={variationMessagesProps?.errorType}
                />
              )}
              {shouldDisplayAlterCta && (
                <PaymentWidget
                  productData={selectedVariant}
                  selectedQty={selectedQty}
                  onClick={addToBagButtonProps.onApplePayClick}
                  onOpen={addToBagButtonProps.onApplePayOpen}
                  disabled={variationMessagesProps?.errorType === ORDERING_ERROR.cartThreshold}
                />
              )}
            </>
          )}
        </Flex>
        {orderingStatus === ORDERING_STATUS.soldOut && (
          <Flex w="100%" mb={3}>
            {!isQuantitySelectorEnable && !isBundleProduct && (
              <QuantitySelector {...quantitySelectorProps} flexShrink={0} />
            )}
            {!apploading &&
              (!isBundleProduct || (isBundleProduct && isNotifyMeAvailableBundle)) && (
                <NotifyMeButton
                  productId={
                    isBundleProduct ? productData?.id : get(newSelectedVariant, 'id', null)
                  }
                  setOrderingError={setOrderingError}
                  selectedVariant={isBundleProduct ? productData : selectedVariant}
                  setQuickViewedProduct={setQuickViewedProduct}
                  isQuickView={isQuickView}
                  isFlyoutOpen={isFlyoutOpen}
                  setFlyoutOpen={setFlyoutOpen}
                />
              )}
          </Flex>
        )}
        {!isQuickView && stickyContent}
      </Flex>
    )
  }

  return (
    <Flex flexDirection="column">
      {selectedVariant && !isQuickView && (
        <Badges
          area={BadgeArea.INVENTORY_STATUS}
          page="pdp"
          variant="inventoryStatus"
          {...allLevelsProductsData}
        />
      )}
      {!persistSoldOutSetting && <VariationMessages {...variationMessagesProps} />}
      <Flex w="100%" flexDirection="column" flexWrap="nowrap" mb={3}>
        {membershipExclusiveProduct && !isLoggedIn && orderingStatus !== ORDERING_STATUS.soldOut ? (
          <SigninMemberButton {...memberExclusiveButtonProps} />
        ) : (
          <>
            <Flex>
              {!isQuantitySelectorEnable && !isBundleProduct && (
                <QuantitySelector {...quantitySelectorProps} />
              )}
              {!persistSoldOutSetting && renderAddToBagButton()}
            </Flex>
            {shouldDisplayBuyNowButton && (
              <BuyNowButton
                onBuyNowButtonClick={addToBagButtonProps.onClick}
                isSticky={addToBagButtonProps.isSticky}
                maxQuantityError={
                  addToBagButtonProps.maxQuantityError || variationMessagesProps.maxQuantityError
                }
                selectedVariantId={selectedVariant?.id}
                selectedQty={selectedQty}
                errorType={variationMessagesProps?.errorType}
              />
            )}
            {shouldDisplayAlterCta && (
              <PaymentWidget
                productData={selectedVariant}
                selectedQty={selectedQty}
                onClick={addToBagButtonProps.onApplePayClick}
                onOpen={addToBagButtonProps.onApplePayOpen}
                disabled={variationMessagesProps?.errorType === ORDERING_ERROR.cartThreshold}
              />
            )}
          </>
        )}
      </Flex>
      {!isQuickView && stickyContent}
    </Flex>
  )
}

export default AddToBagAreaDesktop
