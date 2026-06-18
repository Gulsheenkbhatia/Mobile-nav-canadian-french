import { useContext, useMemo } from 'react'
import AddToBagButton from 'toro/components/product/AddToBagButton'
import {
  ORDERING_STATUS,
  ORDERING_ERROR,
  NOT_AVAILABLE_STATUSES_ARRAY,
  checkInsStockText,
} from 'toro/helpers/productVariations'
import Flex from 'toro/components/Flex'
import get from 'lodash/get'
import { ProductMainSectionBreakpointContext } from './context'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import isFunction from 'lodash/isFunction'
import dynamic from 'next/dynamic'
import QuantitySelector from 'toro/components/product/QuantitySelector'
import SigninMemberButton from 'toro/components/product/SigninMemberButton'
import {
  isQuickViewAtom,
  productIdAtom,
  alterCtaToShowAtom,
  AlterCtaToShow,
  appLoadingAtom,
} from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import { useIntl } from 'react-intl'
import PaymentWidget from 'toro/components/PaymentWidget'
import usePreferenceNew from 'toro/hooks/usePreference_new'

import ByNowButtonBase from 'toro/components/BuyNowButton'
const BuyNowButton = withFeatureFlag(ByNowButtonBase, { PDPPreferences: ['showBuyNowButton'] })

const NotifyMeButton = dynamic(() =>
  import('toro/components/product/NotifyMeWidget/NotifyMeButton')
)

const FindInStore = dynamic(() => import('toro/components/product/FindInStore'))

function AddToBagAdaptiveAreaMobile({ variant }) {
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
    selectedVariant,
    selectedQty,
    selectedVariantData,
    membershipExclusiveProduct,
    quickViewEventLocation,
    currentVariationGroupId,
    isCustomizerProduct,
    isFindInStorePickup,
    newSelectedVariant,
    onPickUpInStoreClick,
    getGAProduct,
    shouldRenderFindInStore,
    variationControlsProps,
    isBundleProduct,
  } = useContext(ProductMainSectionBreakpointContext)
  const alterCtaToShow = useAtomValue(alterCtaToShowAtom)
  const styles = useMultiStyleConfig('ProductDetailMainSection', {
    variant,
  })
  const addToBagCTAStyles = useMemo(
    () => isFunction(styles.addToBagCTA) && styles.addToBagCTA(),
    []
  )

  const isInStock = useMemo(
    () => checkInsStockText(addToBagButtonProps.productData),
    [addToBagButtonProps?.productData]
  )

  const { formatMessage } = useIntl()
  const productId = useAtomValue(productIdAtom)
  const isQuickView = useAtomValue(isQuickViewAtom)
  const apploading = useAtomValue(appLoadingAtom)
  const quantitySelectorProps = {
    maxQty: productMaxOrderableQty,
    disabled: orderingStatus === ORDERING_STATUS.soldOut || maxQuantityError || isInStock,
    selectedQuantity: selectedQty,
    onChange: onChangeQuantity,
    isQuickView: isQuickView,
    productId: productId,
    quickViewEventLocation,
    selectedVgId: currentVariationGroupId,
    variant,
  }

  const shouldDisplayAlterCta =
    !persistSoldOutSetting &&
    !NOT_AVAILABLE_STATUSES_ARRAY.includes(orderingStatus) &&
    !isInStock &&
    !isBundleProduct &&
    !membershipExclusiveProduct

  const shouldDisplayBuyNowButton =
    shouldDisplayAlterCta && !isCustomizerProduct && alterCtaToShow === AlterCtaToShow.BUYNOW

  const showQuantitySelector = !isQuantitySelectorEnable
  const addToBagCTAButtons = useMemo(() => {
    const addToBagText = formatMessage(
      {
        id: 'pdp.product.addToBagAdaptivePDPTextMobile',
        defaultMessage: 'Add to Bag',
      },
      null,
      { ignoreTag: true }
    )
    return shouldDisplayBuyNowButton
      ? addToBagText.length > 10
        ? {
            ...styles.addToBagCTAButtons,
            ...styles.addToBagCTAQuantitySelectorEnable,
          }
        : styles.addToBagCTAButtons
      : null
  }, [isQuantitySelectorEnable, maxQuantityError, orderingStatus])

  const {
    sfraUnifiedFeatureCartridge: { sfraEnableFindInStoreV4 },
  } = usePreferenceNew({
    'SFRA Unified Feature Cartridge': ['sfraEnableFindInStoreV4'],
  })

  const renderFindInStore = () => {
    if (shouldRenderFindInStore && sfraEnableFindInStoreV4) {
      return (
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
      )
    }

    return null
  }

  let result
  if (isNotifyMeProduct) {
    result = (
      <Box sx={styles.NotifyMeWrapper} className="addToBagCTAWrapper" mb={3}>
        <Flex w="100%" flexDirection="column" sx={addToBagCTAStyles}>
          {membershipExclusiveProductCTAEnabled ? (
            <Flex className="memberExclusiveWrapper">
              {renderFindInStore()}
              <SigninMemberButton {...memberExclusiveButtonProps} />
            </Flex>
          ) : (
            <>
              <Flex
                className="atb-ctas-wrapper"
                sx={{ ...addToBagCTAButtons, ...styles.atbWrapperGridGap }}
              >
                {renderFindInStore()}
                {showQuantitySelector && orderingStatus !== ORDERING_STATUS.soldOut && (
                  <Box className="main-selector" mb={0} sx={styles.selectorWrapper}>
                    <QuantitySelector {...quantitySelectorProps} h="100%" />
                  </Box>
                )}
                {!persistSoldOutSetting && (
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
                {orderingStatus === ORDERING_STATUS.soldOut && (
                  <Flex
                    className="atb-notify-wrapper"
                    w="100%"
                    sx={{ ...styles.atbWrapper, ...styles.atbNotifyMeWrapper }}
                  >
                    {!apploading && (
                      <NotifyMeButton
                        productId={get(selectedVariantData, 'id', null)}
                        setOrderingError={setOrderingError}
                        selectedVariant={selectedVariant}
                        isFlyoutOpen={isFlyoutOpen}
                        setFlyoutOpen={setFlyoutOpen}
                        variant={variant}
                        productName={get(variationControlsProps, 'productData.name', '')}
                        selectedColor={get(variationControlsProps, 'selectedColor', {})}
                      />
                    )}
                  </Flex>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </Box>
    )
  } else {
    result = (
      <Box mb={3} sx={styles.AddToBagCTAWrapper} className="addToBagCTAWrapper">
        <Flex w="100%" flexDirection="column" sx={styles.addToBagButtonWrapper}>
          {membershipExclusiveProduct &&
          !isLoggedIn &&
          orderingStatus !== ORDERING_STATUS.soldOut ? (
            <Flex className="memberExclusiveWrapper">
              {renderFindInStore()}
              <SigninMemberButton {...memberExclusiveButtonProps} />
            </Flex>
          ) : (
            <>
              <Flex
                className="atb-ctas-wrapper"
                sx={{ ...styles.atbWrapper, ...addToBagCTAButtons, ...styles.atbWrapperGridGap }}
              >
                {renderFindInStore()}
                {showQuantitySelector && <QuantitySelector {...quantitySelectorProps} />}
                {!persistSoldOutSetting && (
                  <AddToBagButton
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

export default AddToBagAdaptiveAreaMobile
