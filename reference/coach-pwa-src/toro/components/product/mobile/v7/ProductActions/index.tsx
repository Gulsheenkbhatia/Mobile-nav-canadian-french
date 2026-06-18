import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import get from 'lodash/get'
import isString from 'lodash/isString'
import unescape from 'lodash/unescape'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import StylesProvider from 'toro/components/StylesProvider'
import TooltipVariationMessages from 'toro/components/product/desktop/AddToBagArea/TooltipVariationMessages'
import MembershipButton from 'toro/components/product/desktop/AddToBagArea/MembershipButton'
import SessionContext from 'toro/components/SessionContext'
import usePreference from 'toro/hooks/usePreference_new'
import useAddItemToCart from 'toro/hooks/useAddToCartDesktopMobile'
import getAverageColor from 'toro/helpers/getAverageColor'
import { getContrastColor } from 'toro/helpers/getContrastColor'
import { getProductImageSrc } from 'toro/helpers/productImages'
import {
  selectedColorAtom,
  selectedSizeAtom,
  productPriceAtom,
  addToBagButtonTextDataAtom,
  orderingStatusAtom,
  maxQuantityErrorAtom,
  isInStockTextAtom,
  isSizedProductAtom,
  dropAtbErrorsAtom,
} from 'store/pdp.atom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useDisclosure from 'toro/hooks/useDisclosure'
import SizeSelectorModern from 'toro/components/product/mobile/v7/SizeSelectorModern'
import useProductData from 'toro/hooks/useProductData'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'
import AlternateCta from 'toro/components/product/desktop/AddToBagArea/AlternateCta'
import usePdpV7AlternateCtaVisibility from 'toro/components/product/mobile/v7/ProductActions/hooks/usePdpV7AlternateCtaVisibility'
import useAnalytics from 'toro/analytics/useAnalytics'

export type ProductActionsProps = {
  isSticky?: boolean
}

const ProductActions = ({ isSticky = false }: ProductActionsProps) => {
  const styles = useMultiStyleConfig('ProductActions')
  const addToBagAreaStyles = useMultiStyleConfig('AddToBagArea')
  const { formatMessage } = useIntl()
  const { addToCart } = useAddItemToCart()
  const analytics = useAnalytics()
  const dropAtbErrors = useUpdateAtom(dropAtbErrorsAtom)

  const { session } = useContext(SessionContext)
  const orderingStatus = useAtomValue(orderingStatusAtom)
  const membershipExclusiveProduct = useProductData('master.customAttributes.c_isMemberExclusive')
  const productId = useProductData('id')
  const isSizedProduct = useAtomValue(isSizedProductAtom)
  const isLoggedIn = !!get(session, 'user.userEmail')
  const membershipExclusiveProductCTAEnabled =
    membershipExclusiveProduct && !isLoggedIn && orderingStatus !== ORDERING_STATUS.soldOut

  const {
    pdpPreferences: {
      templateConfigs: { pdpv7: { atbCtaBackgroundColorAdaptive = false } = {} } = {},
    } = {},
  } = usePreference({
    PDPPreferences: ['templateConfigs.pdpv7.atbCtaBackgroundColorAdaptive'],
  })
  const [ctaColor, setCtaColor] = useState('var(--color-black-base)')
  const [textColor, setTextColor] = useState('var(--color-white-base)')
  const selectedColor = useAtomValue(selectedColorAtom)
  const selectedSize = useAtomValue(selectedSizeAtom)
  const { regularPrice, salePrice } = useAtomValue(productPriceAtom)
  const addToBagButtonTextData = useAtomValue(addToBagButtonTextDataAtom)
  const maxQuantityError = useAtomValue(maxQuantityErrorAtom)
  const isInStockText = useAtomValue(isInStockTextAtom)

  const { shouldDisplayAlterPaymentMethods, shouldDisplayNotifyMeButton } =
    usePdpV7AlternateCtaVisibility()

  const colorRequestIdRef = useRef(0)
  const [isColorReady, setIsColorReady] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const isAtbDisabled =
    maxQuantityError || orderingStatus === ORDERING_STATUS.soldOut || isInStockText

  const isNotifySoldOutSwapLayout = shouldDisplayNotifyMeButton && !shouldDisplayAlterPaymentMethods

  const showAlterSlot =
    shouldDisplayNotifyMeButton || (shouldDisplayAlterPaymentMethods && !isSizedProduct)

  const showSizeSelector = isSizedProduct && orderingStatus !== ORDERING_STATUS.soldOut

  const gridTwoColumns = showSizeSelector || showAlterSlot

  const buttonText = unescape(
    isString(addToBagButtonTextData)
      ? addToBagButtonTextData
      : formatMessage(addToBagButtonTextData, undefined, { ignoreTag: true })
  )

  const showPricePrefix =
    orderingStatus === ORDERING_STATUS.addToBag &&
    !isInStockText &&
    Boolean(salePrice || regularPrice)

  const doSetBackgroundColor = useCallback(async () => {
    if (atbCtaBackgroundColorAdaptive === false) {
      setIsColorReady(true)
      return
    }
    if (!selectedColor?.image?.src) {
      setIsColorReady(true)
      return
    }
    const currentRequestId = ++colorRequestIdRef.current
    const imageSrc = getProductImageSrc(selectedColor.image.src, 'mobile', 'pdp', {
      isSwatchImage: true,
    })
    try {
      const hexValue = await getAverageColor(imageSrc)
      const contrast = getContrastColor(hexValue)
      if (currentRequestId !== colorRequestIdRef.current) {
        return
      }
      setCtaColor(hexValue)
      setTextColor(contrast)
    } catch (error) {
      console.error('Error getting average color: ', error)
    } finally {
      setIsColorReady(true)
    }
  }, [selectedColor, atbCtaBackgroundColorAdaptive])

  useEffect(() => {
    doSetBackgroundColor()
  }, [doSetBackgroundColor])

  useEffect(() => {
    dropAtbErrors()
  }, [dropAtbErrors])

  const handleOpenSizeDrawer = useCallback(() => {
    analytics.send('productInteraction', {
      eventAction: 'size drawer open',
      eventLocation: 'size select drawer',
      eventLabel: productId,
      eventPageLocation: 'product',
    })
    onOpen()
  }, [onOpen])

  const renderSizeSelectorControl = () => (
    <Button data-qa="pdp_select_btn" sx={styles.selectSizeBtn} onClick={handleOpenSizeDrawer}>
      {selectedSize ? (
        <>
          {formatMessage({ id: 'pdp.product.sizeCta', defaultMessage: 'Size' })}
          <Box as="span" sx={styles.selectSizeHyphen}>
            —
          </Box>
          <Box as="span" sx={styles.selectSizeLabel}>
            ({formatMessage({ id: 'pdp.product.us', defaultMessage: 'US' })})
          </Box>
          {selectedSize}
        </>
      ) : (
        formatMessage({
          id: 'pdp.product.selectSizeCta',
          defaultMessage: 'Select Size',
        })
      )}
    </Button>
  )

  const renderAtcButton = () => (
    <Button
      type="button"
      id={isSticky ? undefined : 'add-to-cart'}
      onClick={addToCart}
      disabled={isAtbDisabled}
      sx={{
        ...styles.addToBagBtn,
        ...(isAtbDisabled ? styles.swapSoldOutBtn : {}),
        ...(!isAtbDisabled
          ? {
              color: textColor,
              '&:hover:not(:disabled), &:active, &:focus, &:focus-visible': {
                backgroundColor: ctaColor,
                color: textColor,
              },
            }
          : {}),
      }}
      data-qa="pdp_addtocart_btn"
      backgroundColor={!isAtbDisabled ? ctaColor : undefined}
      transition="background-color 200ms ease, color 200ms ease"
    >
      {showPricePrefix && `${salePrice || regularPrice} — `}
      {buttonText}
    </Button>
  )

  const renderAtcColumn = () => <Box sx={styles.atcColumn}>{renderAtcButton()}</Box>

  const renderAlternateCtaSlot = () => (
    <Box sx={styles.alternateCtaSlot} data-qa="pdp_alternate_cta_slot">
      <StylesProvider value={addToBagAreaStyles}>
        <AlternateCta hideBuyNowAndApplePay={isSizedProduct} />
      </StylesProvider>
    </Box>
  )

  const renderLeftColumn = () => (
    <Box sx={styles.leftColumnStack}>
      {showSizeSelector && renderSizeSelectorControl()}
      {showAlterSlot && renderAlternateCtaSlot()}
    </Box>
  )

  const renderNotifySwapLayout = () => {
    const swapGridTwoColumns = showSizeSelector

    return (
      <Box sx={styles.productActionsContainer}>
        {swapGridTwoColumns && <Box sx={styles.leftColumnStack}>{renderSizeSelectorControl()}</Box>}
        <Box sx={styles.atcColumn}>
          <Box sx={styles.productActionsNotifySwap}>
            {renderAtcButton()}
            {renderAlternateCtaSlot()}
          </Box>
        </Box>
      </Box>
    )
  }

  const flipSoldOutNotifyPrimaryColumns =
    orderingStatus === ORDERING_STATUS.soldOut &&
    shouldDisplayNotifyMeButton &&
    gridTwoColumns &&
    !showSizeSelector

  const renderPrimaryGrid = () => (
    <Box sx={styles.productActionsContainer}>
      {flipSoldOutNotifyPrimaryColumns ? (
        <>
          {renderAtcColumn()}
          {renderLeftColumn()}
        </>
      ) : (
        <>
          {gridTwoColumns && renderLeftColumn()}
          {renderAtcColumn()}
        </>
      )}
    </Box>
  )

  if (membershipExclusiveProductCTAEnabled) {
    return (
      <Box sx={styles.productActionsArea} data-qa="product-actions-area">
        <StylesProvider value={addToBagAreaStyles}>
          <Box sx={styles.membershipExclusiveSlot}>
            <MembershipButton />
          </Box>
        </StylesProvider>
      </Box>
    )
  }

  if (!isColorReady) {
    return null
  }

  return (
    <StylesProvider value={addToBagAreaStyles}>
      <Box sx={styles.productActionsArea} data-qa="product-actions-area">
        {!isSticky && (
          <Box sx={styles.variationMessagesWrap} className="atb-variation-messages">
            <TooltipVariationMessages hideFinalSaleMessaging={true} />
          </Box>
        )}

        {isNotifySoldOutSwapLayout ? renderNotifySwapLayout() : renderPrimaryGrid()}
        {showSizeSelector && <SizeSelectorModern isOpen={isOpen} onClose={onClose} />}
      </Box>
    </StylesProvider>
  )
}

export default memo(ProductActions)
