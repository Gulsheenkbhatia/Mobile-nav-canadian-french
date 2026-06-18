import { useContext, useMemo } from 'react'
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
import Box from 'toro/components/Box'
import isFunction from 'lodash/isFunction'
import dynamic from 'next/dynamic'
import QuantitySelector from 'toro/components/product/QuantitySelector'
import SigninMemberButton from 'toro/components/product/SigninMemberButton'
import {
  isQuickViewAtom,
  productIdAtom,
  isTabbedAdaptivePDPEligibleAtom,
  alterCtaToShowAtom,
  AlterCtaToShow,
  productDataAtom,
  appLoadingAtom,
} from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import { useIntl } from 'react-intl'
import { badgeTypes } from 'toro/components/badges/constants/badgeTypes'
import PaymentWidget from 'toro/components/PaymentWidget'

import ByNowButtonBase from 'toro/components/BuyNowButton'
const BuyNowButton = withFeatureFlag(ByNowButtonBase, { PDPPreferences: ['showBuyNowButton'] })

const NotifyMeButton = dynamic(() =>
  import('toro/components/product/NotifyMeWidget/NotifyMeButton')
)

function AddToBagAreaMobile({ variant }) {
  const {
    stickyContent,
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
    selectedVariantData,
    membershipExclusiveProduct,
    quickViewEventLocation,
    currentVariationGroupId,
    isCustomizerProduct,
    variationControlsProps,
  } = useContext(ProductMainSectionBreakpointContext)
  const alterCtaToShow = useAtomValue(alterCtaToShowAtom)
  const isPDPTemplateV3 = useExperiment(EXPERIMENTS.PDP_V3)
  const isNotifyMeAvailableBundle = useAtomValue(bundleIsNotifyMeAvailableAtom)
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const qtySelectorVariant = (isPDPTemplateV3 && 'quantitySelectorV3') || undefined
  const styles = useMultiStyleConfig('ProductDetailMainSection', {
    variant: variant || qtySelectorVariant,
  })
  const addToBagCTAStyles = useMemo(
    () => isFunction(styles.addToBagCTA) && styles.addToBagCTA(isBundleProduct),
    [isBundleProduct]
  )

  const isInStock = useMemo(
    () => checkInsStockText(addToBagButtonProps.productData),
    [addToBagButtonProps?.productData]
  )

  const { formatMessage } = useIntl()
  const productId = useAtomValue(productIdAtom)
  const isQuickView = useAtomValue(isQuickViewAtom)
  const productData = useAtomValue(productDataAtom)
  const apploading = useAtomValue(appLoadingAtom)
  const quantitySelectorProps = {
    maxQty: productMaxOrderableQty,
    disabled: orderingStatus === ORDERING_STATUS.soldOut || maxQuantityError,
    selectedQuantity: selectedQty,
    onChange: onChangeQuantity,
    isQuickView: isQuickView,
    productId: productId,
    quickViewEventLocation,
    selectedVgId: currentVariationGroupId,
    variant: variant || qtySelectorVariant,
    selectedProductId: selectedVariant?.id,
  }

  const shouldDisplayAlterCta =
    !persistSoldOutSetting &&
    !NOT_AVAILABLE_STATUSES_ARRAY.includes(orderingStatus) &&
    !isInStock &&
    !isBundleProduct &&
    !membershipExclusiveProduct

  const shouldDisplayBuyNowButton =
    shouldDisplayAlterCta && !isCustomizerProduct && alterCtaToShow === AlterCtaToShow.BUYNOW

  const showQuantitySelector = !isQuantitySelectorEnable && !isBundleProduct
  const addToBagCTAButtons = useMemo(() => {
    if (!shouldDisplayBuyNowButton && alterCtaToShow !== AlterCtaToShow.APPLEPAY) return null
    const addToBagText = formatMessage(
      {
        id: 'pdp.product.addToBagTextMobile',
        defaultMessage: 'Add To Bag Before Its Gone',
      },
      null,
      { ignoreTag: true }
    )

    const buttonStyles =
      addToBagText.length > 10
        ? styles.addToBagCTAQuantitySelectorEnable
        : styles.addToBagWithSmallerText

    return { ...styles.addToBagCTAButtons, ...buttonStyles }
  }, [isQuantitySelectorEnable, maxQuantityError, orderingStatus, alterCtaToShow])

  let result
  if (isNotifyMeProduct || isNotifyMeAvailableBundle) {
    result = (
      <Box sx={styles.NotifyMeWrapper} className="addToBagCTAWrapper" mb={3}>
        <Flex flexDirection="column" w="100%">
          {!isBundleProduct && <VariationMessages {...variationMessagesProps} />}
          <Badges
            area={BadgeArea.INVENTORY_STATUS}
            page="pdp"
            variant="inventoryStatus"
            {...allLevelsProductsData}
            notAllowedBadges={isTabbedAdaptivePDPEligible && [badgeTypes.inventoryCallout]}
          />
          <Flex w="100%" flexDirection="column" sx={addToBagCTAStyles}>
            {membershipExclusiveProductCTAEnabled ? (
              <SigninMemberButton {...memberExclusiveButtonProps} />
            ) : (
              <>
                <Flex sx={{ ...addToBagCTAButtons, ...styles.atbWrapperGridGap }}>
                  {showQuantitySelector && orderingStatus !== ORDERING_STATUS.soldOut && (
                    <Box className="main-selector" mb={0} sx={styles.selectorWrapper}>
                      <QuantitySelector {...quantitySelectorProps} h="100%" />
                    </Box>
                  )}
                  {((isBundleProduct && !isNotifyMeAvailableBundle) ||
                    (!isBundleProduct && !persistSoldOutSetting)) && (
                    <AddToBagButton
                      whiteSpace={'normal'}
                      height={'auto'}
                      {...addToBagButtonProps}
                      isQuickView={isQuickView}
                      selectedVariant={selectedVariant}
                      selectedQty={selectedQty}
                      variant={variant}
                    />
                  )}
                  {shouldDisplayBuyNowButton && (
                    <BuyNowButton
                      onBuyNowButtonClick={addToBagButtonProps.onClick}
                      isSticky={addToBagButtonProps.isSticky}
                      maxQuantityError={
                        addToBagButtonProps.maxQuantityError ||
                        variationMessagesProps.maxQuantityError
                      }
                      selectedVariantId={selectedVariant?.id}
                      selectedQty={selectedQty}
                      errorType={variationMessagesProps?.errorType}
                      variant={variant}
                    />
                  )}
                  {shouldDisplayAlterCta && (
                    <PaymentWidget
                      variant={variant}
                      productData={selectedVariant}
                      selectedQty={selectedQty}
                      onClick={addToBagButtonProps.onApplePayClick}
                      onOpen={addToBagButtonProps.onApplePayOpen}
                      disabled={variationMessagesProps?.errorType === ORDERING_ERROR.cartThreshold}
                    />
                  )}
                </Flex>
              </>
            )}
          </Flex>
          {orderingStatus === ORDERING_STATUS.soldOut && (
            <Flex w="100%" sx={{ ...styles.atbWrapper, ...styles.atbNotifyMeWrapper }}>
              {showQuantitySelector && <QuantitySelector {...quantitySelectorProps} />}
              {!apploading &&
                (!isBundleProduct || (isBundleProduct && isNotifyMeAvailableBundle)) && (
                  <NotifyMeButton
                    productId={
                      isBundleProduct ? productData?.id : get(selectedVariantData, 'id', null)
                    }
                    setOrderingError={setOrderingError}
                    selectedVariant={isBundleProduct ? productData : selectedVariant}
                    isFlyoutOpen={isFlyoutOpen}
                    setFlyoutOpen={setFlyoutOpen}
                    variant={variant}
                    productName={get(productData, 'name', '')}
                    selectedColor={get(variationControlsProps, 'selectedColor', {})}
                  />
                )}
            </Flex>
          )}
        </Flex>
      </Box>
    )
  } else {
    result = (
      <Box mb={3} sx={styles.AddToBagCTAWrapper} className="addToBagCTAWrapper">
        <Flex flexDirection="column" w="100%">
          {selectedVariant && (
            <Badges
              area={BadgeArea.INVENTORY_STATUS}
              page="pdp"
              variant="inventoryStatus"
              {...allLevelsProductsData}
              notAllowedBadges={isTabbedAdaptivePDPEligible && [badgeTypes.inventoryCallout]}
            />
          )}
          <VariationMessages {...variationMessagesProps} />
          <Flex w="100%" flexDirection="column" sx={styles.addToBagButtonWrapper}>
            {membershipExclusiveProduct &&
            !isLoggedIn &&
            orderingStatus !== ORDERING_STATUS.soldOut ? (
              <SigninMemberButton {...memberExclusiveButtonProps} />
            ) : (
              <>
                <Flex sx={{ ...styles.atbWrapper, ...addToBagCTAButtons }}>
                  {showQuantitySelector && <QuantitySelector {...quantitySelectorProps} />}
                  {!persistSoldOutSetting && (
                    <AddToBagButton
                      {...addToBagButtonProps}
                      isQuickView={isQuickView}
                      className={isBundleProduct ? 'bundleProductBtn' : ''}
                      selectedVariant={selectedVariant}
                      selectedQty={selectedQty}
                      variant={variant}
                    />
                  )}
                  {shouldDisplayBuyNowButton && (
                    <BuyNowButton
                      onBuyNowButtonClick={addToBagButtonProps.onClick}
                      isSticky={addToBagButtonProps.isSticky}
                      maxQuantityError={
                        addToBagButtonProps.maxQuantityError ||
                        variationMessagesProps.maxQuantityError
                      }
                      selectedVariantId={selectedVariant?.id}
                      selectedQty={selectedQty}
                      errorType={variationMessagesProps?.errorType}
                      variant={variant}
                    />
                  )}
                  {shouldDisplayAlterCta && (
                    <PaymentWidget
                      variant={variant}
                      productData={selectedVariant}
                      selectedQty={selectedQty}
                      onClick={addToBagButtonProps.onApplePayClick}
                      onOpen={addToBagButtonProps.onApplePayOpen}
                      disabled={variationMessagesProps?.errorType === ORDERING_ERROR.cartThreshold}
                    />
                  )}
                </Flex>
              </>
            )}
          </Flex>
        </Flex>
      </Box>
    )
  }

  return (
    <>
      {result}
      {stickyContent}
    </>
  )
}

export default AddToBagAreaMobile
