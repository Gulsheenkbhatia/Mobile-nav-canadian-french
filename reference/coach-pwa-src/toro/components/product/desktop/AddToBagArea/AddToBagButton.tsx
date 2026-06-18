import React, { useMemo } from 'react'
import Flex from 'toro/components/Flex'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useStyles from 'toro/hooks/useStyles'
import Button from 'toro/components/Button'
import QuantitySelector from 'toro/components/product/desktop/AddToBagArea/QuantitySelector'
import { useIntl } from 'react-intl'
import useAddItemToCart from 'toro/hooks/useAddToCartDesktopMobile'
import useAddToBagAnimation from 'toro/hooks/useAddToBagAnimation'
import {
  addToBagButtonTextDataAtom,
  orderingStatusAtom,
  maxQuantityErrorAtom,
  isInStockTextAtom,
} from 'store/pdp.atom'
import unescape from 'lodash/unescape'
import { useAtomValue } from 'jotai/utils'
import isString from 'lodash/isString'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'
import TooltipVariationMessages from 'toro/components/product/desktop/AddToBagArea/TooltipVariationMessages'
import Box from 'toro/components/Box'
import Template from 'toro/components/Template'
import { TemplateName } from 'toro/constants/templates'
import useTemplate from 'toro/hooks/useTemplate'
import usePreference from 'toro/hooks/usePreference_new'

export const customAtbCtaBackgroundColorVariable = '--color-custom-atb-background'

const AddToBagButton = () => {
  const styles = useStyles()
  const { formatMessage } = useIntl()
  const {
    addToCart,
    isQuantitySelectorDisabled,
    enableMaxQtyRestriction,
    defaultMaxOrderQuantity,
    maxQty,
  } = useAddItemToCart()
  const {
    toggleSiteFeatures: { atbCtaBackgroundColor },
  } = usePreference({
    ToggleSiteFeatures: ['atbCtaBackgroundColor'],
  })
  const addToBagButtonTextData = useAtomValue(addToBagButtonTextDataAtom)
  const orderingStatus = useAtomValue(orderingStatusAtom)
  const isInStockText = useAtomValue(isInStockTextAtom)
  const maxQuantityError = useAtomValue(maxQuantityErrorAtom)
  const isPDPv6 = useTemplate([TemplateName.pdpv6])

  const isAtbDisabled =
    maxQuantityError || orderingStatus === ORDERING_STATUS.soldOut || isInStockText

  // Use animation hook
  const {
    animationState,
    addToCartWithAnimation,
    progressClassName,
    textSliderClassName,
    progressText,
  } = useAddToBagAnimation({
    isPDPv6,
    isAtbDisabled,
    addToCart,
  })

  const isQuantitySelectorHidden =
    isQuantitySelectorDisabled || isAtbDisabled || (isPDPv6 && animationState.active)

  const buttonText = unescape(
    isString(addToBagButtonTextData)
      ? addToBagButtonTextData
      : formatMessage(addToBagButtonTextData, null, { ignoreTag: true })
  )

  const buttonStyles = useMemo(
    () => ({
      ...styles.addToBagBtn,
      ...(isQuantitySelectorHidden && styles.qtySelectorHidden),
      ...(atbCtaBackgroundColor && styles.addToBagBtnCustomColor),
    }),
    [styles.addToBagBtn, styles.qtySelectorHidden, isQuantitySelectorHidden, atbCtaBackgroundColor]
  )

  const addToBagContainerStyles = useMemo(
    () => ({
      ...styles.addToBagContainer,
      ...(atbCtaBackgroundColor && {
        ...styles.addToBagContainerCustomColor,
        [customAtbCtaBackgroundColorVariable]: atbCtaBackgroundColor,
      }),
    }),
    [styles.addToBagContainer, styles.addToBagContainerCustomColor, atbCtaBackgroundColor]
  )

  const animationContainerStyles = useMemo(
    () => ({
      ...styles.addToBagAnimation,
      // Ensure full width when quantity selector is hidden
      ...(isQuantitySelectorHidden && { position: 'absolute', left: 0, right: 0 }),
      ...(atbCtaBackgroundColor && styles.addToBagAnimationCustomColor),
    }),
    [styles.addToBagAnimation, isQuantitySelectorHidden, atbCtaBackgroundColor]
  )

  const addToBagControlsStyles = useMemo(
    () => ({
      ...styles.addToBagControls,
      // Make the container relative when quantity selector is hidden for proper absolute positioning
      ...(isPDPv6 && isQuantitySelectorHidden && { position: 'relative' }),
      ...(atbCtaBackgroundColor && styles.addToBagBtnCustomColor),
    }),
    [styles.addToBagControls, isPDPv6, isQuantitySelectorHidden, atbCtaBackgroundColor]
  )

  const buttonClickHandler = isPDPv6 ? addToCartWithAnimation : addToCart

  const renderAddToBagButton = () => (
    <Button
      id="add-to-cart"
      onClick={buttonClickHandler}
      disabled={isAtbDisabled}
      sx={buttonStyles}
      data-qa="pdp_state_btn"
    >
      {buttonText}
    </Button>
  )

  const renderButtonWithAnimation = () => (
    <>
      <Box className="atb-button-animation" sx={animationContainerStyles}>
        <Box className={progressClassName} sx={styles.addToBagAnimationProgress} />
        <Box className="text-wrapper" sx={styles.addToBagTextWrapper}>
          <Box className={textSliderClassName}>
            {renderAddToBagButton()}
            <Flex
              alignItems="center"
              justifyContent="center"
              className="text-progress"
              sx={styles.animationTextProgress}
            >
              {progressText}
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  )

  return (
    <Box
      className={`atb-container ${isAtbDisabled ? 'atb-container-disabled' : ''}`}
      sx={addToBagContainerStyles}
    >
      <Template notForIDs={[TemplateName.pdpv6, TemplateName.pdpv5_1]}>
        <TooltipVariationMessages />
      </Template>
      <Flex sx={addToBagControlsStyles}>
        {!isQuantitySelectorHidden && (
          <QuantitySelector
            isDisabled={isAtbDisabled}
            enableMaxQtyRestriction={enableMaxQtyRestriction}
            defaultMaxOrderQuantity={defaultMaxOrderQuantity}
            maxQty={maxQty}
            className={isPDPv6 && animationState.active ? 'qty-selector-hidden' : ''}
          />
        )}
        {isPDPv6 && !isAtbDisabled ? renderButtonWithAnimation() : renderAddToBagButton()}
      </Flex>
    </Box>
  )
}

export default withErrorBoundaryWrapper(AddToBagButton)
