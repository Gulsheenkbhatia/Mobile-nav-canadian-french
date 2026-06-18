import { useCallback, useMemo } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import ProductVariationControls from 'toro/components/product/ProductVariationControls'
import AddToBagButton from 'toro/components/product/AddToBagButton'
import VariationMessages from 'toro/components/product/VariationMessages'
import { ORDERING_STATUS, ORDERING_ERROR } from 'toro/helpers/productVariations'
import NotifyMeButton from 'toro/components/product/NotifyMeWidget/NotifyMeButton'
import get from 'lodash/get'
import Text from 'toro/components/Text'
import StickyContainer from 'toro/components/StickyContainer'
import StickyBundleContainer from 'toro/components/product/Bundle/BundleVariants/bundleStickyContainer'
import SigninMemberButton from 'toro/components/product/SigninMemberButton'
import { useIntl } from 'react-intl'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import PriceInfo from 'toro/components/product/PriceInfo'
import { CloseIcon } from 'toro/icons'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import { AlterCtaToShow } from 'store/pdp.atom'
import PaymentWidget from 'toro/components/PaymentWidget'

import ByNowButtonBase from 'toro/components/BuyNowButton'
const BuyNowButton = withFeatureFlag(ByNowButtonBase, { PDPPreferences: ['showBuyNowButton'] })

const StickyContent = ({
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
  allLevelsProductsData,
  selectedColor,
  isStickyAddToCartBelowTheFoldEnabled,
  isStickyAddToBagUponLandEnabled,
  membershipExclusiveProductCTAEnabled,
  memberExclusiveButtonProps,
  orderingStatus,
  isNotifyMeProduct,
  isNotifyMeAvailableBundle,
  selectedVariantData,
  setOrderingError,
  selectedVariant,
  addToBagButtonProps,
  selectedQty,
  sizeDrawerCta,
}) => {
  const { formatMessage } = useIntl()
  const newSelectedVariationGroup = useMemo(
    () => get(allLevelsProductsData, 'variationGroupData', null),
    [allLevelsProductsData]
  )

  const onClose = useCallback(() => {
    setFlyoutOpen?.(false)
  }, [setFlyoutOpen])

  return (
    <StickyContainer
      setFlyoutOpen={setFlyoutOpen}
      isFlyoutOpen={stickyATCvarDrawerAttr && isFlyoutOpen}
      isBundleProduct
      isStickyAddToCartBelowTheFoldEnabled={isStickyAddToCartBelowTheFoldEnabled}
      isStickyAddToBagUponLandEnabled={isStickyAddToBagUponLandEnabled}
      stickyAddToCartPriceEnabled={stickyAddToCartPriceEnabled}
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
        {stickyAddToCartPriceEnabled && (
          <Box sx={styles.stickyAddToCartPriceContainer}>
            <PriceInfo
              productData={selectedVariantData || newSelectedVariationGroup || productData}
              isServerSide={productData?.isServerSide}
              selectedColor={selectedColor}
              {...allLevelsProductsData}
              sx={styles.stickyPrice}
              selectedVariant={selectedVariant}
              variationGroups={productData.variationGroup}
              variants={productData.variant}
              defaultVgId={productData?.master?.defaultVariantGroupID}
              defaultVariantID={productData?.master?.defaultVariantID}
              isSticky
            />
          </Box>
        )}
        <Box sx={styles.stickyAddToBagWrapper}>
          {membershipExclusiveProductCTAEnabled ? (
            <SigninMemberButton {...memberExclusiveButtonProps} />
          ) : (
            <>
              {orderingStatus === ORDERING_STATUS.soldOut &&
              (isNotifyMeProduct || isNotifyMeAvailableBundle) ? (
                <NotifyMeButton
                  productId={
                    isBundleProduct ? productData?.id : get(selectedVariantData, 'id', null)
                  }
                  setOrderingError={setOrderingError}
                  selectedVariant={isBundleProduct ? productData : selectedVariant}
                  isSticky
                  isFlyoutOpen={isFlyoutOpen}
                  setFlyoutOpen={setFlyoutOpen}
                  productName={get(productData, 'name') || ''}
                  selectedColor={get(variationControlsProps, 'selectedColor', {})}
                />
              ) : (
                <>
                  {sizeDrawerCta === AlterCtaToShow.BUYNOW ? (
                    <BuyNowButton
                      onBuyNowButtonClick={addToBagButtonProps.onClick}
                      isSticky
                      maxQuantityError={
                        addToBagButtonProps.maxQuantityError ||
                        variationMessagesProps.maxQuantityError
                      }
                      selectedVariantId={selectedVariant?.id}
                      selectedQty={selectedQty}
                      errorType={variationMessagesProps?.errorType}
                    />
                  ) : sizeDrawerCta === AlterCtaToShow.APPLEPAY ? (
                    <PaymentWidget
                      productData={selectedVariant}
                      selectedQty={selectedQty}
                      onClick={addToBagButtonProps.onApplePayClick}
                      onOpen={addToBagButtonProps.onApplePayOpen}
                      disabled={
                        orderingStatus === ORDERING_STATUS.soldOut ||
                        variationMessagesProps?.errorType === ORDERING_ERROR.cartThreshold
                      }
                    />
                  ) : (
                    <AddToBagButton
                      {...addToBagButtonProps}
                      isSticky
                      selectedVariant={selectedVariant}
                      selectedQty={selectedQty}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Flex>
    </StickyContainer>
  )
}

StickyContent.propTypes = {
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

StickyContent.defaultProps = {
  setFlyoutOpen: () => {},
  setOrderingError: () => {},
}

export default withErrorBoundaryWrapper(StickyContent)
