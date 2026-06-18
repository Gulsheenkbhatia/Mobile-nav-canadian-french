import { useCallback, useEffect, useState } from 'react'
import DrawerHeader from 'toro/components/DrawerHeader'
import DrawerBody from 'toro/components/DrawerBody'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import SizesList from 'toro/components/product/mobile/v7/SizeSelectorModern/SizeList'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useStyles from 'toro/hooks/useStyles'
import NotifyMeButton from 'toro/components/product/NotifyMeWidget/NotifyMeButton'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useProductData from 'toro/hooks/useProductData'
import FitIcon from 'toro/icons/fitIcon.svg'
import { AwardStarIcon } from 'toro/icons'
import {
  addingToBagErrorAtom,
  dropAtbErrorsAtom,
  isNotifyMeAvailableProductAtom,
  maxQuantityErrorAtom,
  orderingErrorAtom,
  isMatchedVariant,
  selectedColorAtom,
  setSelectedSizeAtom,
} from 'store/pdp.atom'
import { useIntl } from 'react-intl'
import useAddItemToCart from 'toro/hooks/useAddToCartDesktopMobile'
import { useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import TooltipVariationMessages from 'toro/components/product/desktop/AddToBagArea/TooltipVariationMessages'
import ProductInfoMessage from 'toro/components/product/ProductInfoMessage'
import { NOTIFY_TEXT } from 'toro/components/product/VariationMessages'
import useAnalytics from 'toro/analytics/useAnalytics'

interface Props {
  draftSize: string
  onChangeSize: (val: string) => void
  onConfirm: () => void
  onOpenFitGuide: () => void
  onNotifyClick: () => void
  recommendedSize?: string | null
}

const SelectSizeContainer = ({
  draftSize,
  onChangeSize,
  onConfirm,
  onOpenFitGuide,
  recommendedSize,
  onNotifyClick,
}: Props) => {
  const [sizes] = useSelectedColorData(['sizes', 'id'])
  const [variants, name, masterId, productId] = useProductData([
    'variant',
    'name',
    'masterId',
    'id',
  ])
  const analytics = useAnalytics()
  const styles = useStyles()
  const showRecommended = !!recommendedSize
  const selectedColor = useAtomValue(selectedColorAtom)
  const { formatMessage } = useIntl()
  const [{ drawerVisible }] = useDrawerAtom()
  const selectedSizeObj = sizes?.find((s) => s.value === draftSize)
  const isSelectedSizeDisabled = selectedSizeObj?.orderable === false
  const setOrderingError = useUpdateAtom(orderingErrorAtom)
  const orderingError = useAtomValue(orderingErrorAtom)
  const maxQuantityError = useAtomValue(maxQuantityErrorAtom)
  const addingToBagError = useAtomValue(addingToBagErrorAtom)
  const setSelectedSize = useUpdateAtom(setSelectedSizeAtom)
  const dropAtbErrors = useUpdateAtom(dropAtbErrorsAtom)
  const { addToCart } = useAddItemToCart()
  const isNotifyMeAvailableProduct = useAtomValue(isNotifyMeAvailableProductAtom)
  const notifySelectedVariant = variants?.find((variant) =>
    isMatchedVariant(variant, selectedColor, draftSize)
  )
  const [isAddingToBag, setIsAddingToBag] = useState(false)
  const closeDrawerAfterAtbSuccess = onConfirm

  useEffect(() => {
    dropAtbErrors()
  }, [dropAtbErrors])

  const handleSizeChange = useCallback(
    (val: string) => {
      onChangeSize(val)
      const nextSelectedSize = sizes?.find((size) => size?.value === val)
      const matchedVariant = variants?.find((variant) =>
        isMatchedVariant(variant, selectedColor, val)
      )
      if (nextSelectedSize?.orderable !== false) {
        setSelectedSize(val)
      }
      analytics.send('swatchInteraction', {
        eventAction: 'swatch click',
        eventLabel: masterId,
        eventLocation: 'size select drawer',
        swatchType: 'size',
        swatchValue: nextSelectedSize?.name,
        eventPageLocation: 'product',
        swatchVariant: matchedVariant?.id,
      })
      dropAtbErrors()
    },
    [dropAtbErrors, onChangeSize, setSelectedSize]
  )

  const handleOpenFitGuide = useCallback(() => {
    analytics.send('productInteraction', {
      eventAction: 'size chart click',
      eventLocation: 'size select drawer',
      eventLabel: productId,
      eventPageLocation: 'product',
    })
    onOpenFitGuide()
  }, [onOpenFitGuide])

  useEffect(() => {
    if (!isAddingToBag) return

    if (drawerVisible) {
      setIsAddingToBag(false)
      closeDrawerAfterAtbSuccess()
      return
    }

    if (orderingError || maxQuantityError || addingToBagError) {
      setIsAddingToBag(false)
    }
  }, [
    addingToBagError,
    closeDrawerAfterAtbSuccess,
    drawerVisible,
    isAddingToBag,
    maxQuantityError,
    orderingError,
  ])

  const handleAddToBag = useCallback(async () => {
    if (!draftSize || isAddingToBag || !notifySelectedVariant) return

    setSelectedSize(draftSize)
    setIsAddingToBag(true)
    await addToCart()
  }, [
    addToCart,
    draftSize,
    isAddingToBag,
    setSelectedSize,
    setIsAddingToBag,
    notifySelectedVariant,
  ])

  const shouldDisplayNotifyMeButton = isNotifyMeAvailableProduct
  const shouldShowInlineNotifyMessage = isSelectedSizeDisabled && shouldDisplayNotifyMeButton
  return (
    <>
      <DrawerHeader sx={styles.shoeSizeDrawerHeader}>
        <Text sx={styles.shoeSizeDrawerText}>
          {formatMessage({
            id: 'pdp.product.selectYourSize',
            defaultMessage: 'Select Your Size',
          })}
        </Text>
      </DrawerHeader>

      <DrawerBody sx={styles.shoeSizeDrawerBody}>
        <Box flex="1" width="100%">
          <SizesList items={sizes} value={draftSize} onChange={handleSizeChange} />
          {showRecommended && (
            <Box sx={styles.recommendedShoeSizeContainer}>
              <Flex align="center" gap="6px">
                <AwardStarIcon width="22px" height="22px" />
                <Box>
                  <Text sx={styles.recommendedShoeSizeText}>
                    {formatMessage(
                      {
                        id: 'pdp.product.confirm',
                        defaultMessage: '{recommendedSize} is your recommended size',
                      },
                      { recommendedSize }
                    )}
                  </Text>
                  <Text sx={styles.recommendedShoeSizeTextSecond}>
                    {formatMessage({
                      id: 'pdp.product.fitGuideSubheading',
                      defaultMessage: 'Based on previous orders and reviews',
                    })}
                  </Text>
                </Box>
              </Flex>

              <Button sx={styles.recommendedFitGuideButton} onClick={handleOpenFitGuide}>
                <Text as="span" sx={styles.recommendedFitGuideButtonText}>
                  {formatMessage({
                    id: 'pdp.product.viewFitGuide',
                    defaultMessage: 'View Fit Guide',
                  })}
                </Text>
              </Button>
            </Box>
          )}
        </Box>

        <Box w="100%" sx={styles.fitGuideBottomSection}>
          {!shouldShowInlineNotifyMessage && (
            <Box sx={styles.variationMessagesWrap} className="atb-variation-messages">
              <TooltipVariationMessages hideFinalSaleMessaging={true} />
            </Box>
          )}
          {draftSize ? (
            <>
              {isSelectedSizeDisabled ? (
                <>
                  {shouldShowInlineNotifyMessage && (
                    <Box sx={styles.variationMessagesWrap} className="atb-variation-messages">
                      <ProductInfoMessage
                        variant="alert"
                        size="sm"
                        mb="l"
                        className="biz-upper-misc-container biz-notify-me product-info-message-alert"
                      >
                        {formatMessage({
                          id: 'pdp.product.notify.text',
                          defaultMessage: NOTIFY_TEXT,
                        })}
                      </ProductInfoMessage>
                    </Box>
                  )}
                  <Box sx={styles.soldOutNotifyContainer}>
                    <Button isDisabled flex="1" sx={styles.shoeSizeSoldOutButton}>
                      <Text as="span" sx={styles.shoeSizeSelectButtonText}>
                        {formatMessage({
                          id: 'pdp.product.soldOut',
                          defaultMessage: 'SOLD OUT',
                        })}
                      </Text>
                    </Button>
                    {shouldDisplayNotifyMeButton && (
                      <Box
                        sx={styles.shoeSizeSelectorNotifyButton}
                        onClick={onNotifyClick}
                        flex="1"
                      >
                        <NotifyMeButton
                          productId={notifySelectedVariant?.id}
                          setOrderingError={setOrderingError}
                          selectedColor={selectedColor}
                          productName={name}
                          selectedVariant={notifySelectedVariant}
                          variant="sizeSelectorPDPV7"
                        />
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <>
                  <Button
                    sx={styles.shoeSizeSelectButton}
                    onClick={handleAddToBag}
                    isLoading={isAddingToBag}
                  >
                    <Text as="span" sx={styles.shoeSizeSelectButtonText}>
                      {formatMessage(
                        {
                          id: 'pdp.product.addToBagWithSize',
                          defaultMessage: 'Add US {draftSize} to Bag',
                        },
                        { draftSize }
                      )}
                    </Text>
                  </Button>

                  {!showRecommended && (
                    <Button
                      sx={styles.shoeFitGuideButton}
                      variant="ghost"
                      onClick={handleOpenFitGuide}
                    >
                      <Text as="span" sx={styles.shoeFitGuideButtonText}>
                        {formatMessage({
                          id: 'pdp.product.viewFitGuide',
                          defaultMessage: 'View Fit Guide',
                        })}
                      </Text>
                      <FitIcon width="24px" height="24px" viewBox="8 8 24 24" aria-hidden="true" />
                    </Button>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <Button sx={styles.shoeSizeSelectButton}>
                <Text as="span" sx={styles.shoeSizeSelectButtonText}>
                  {formatMessage({
                    id: 'pdp.product.selectSizeCta',
                    defaultMessage: 'Select Size',
                  })}
                </Text>
              </Button>
              {!showRecommended && (
                <Button variant="ghost" sx={styles.shoeFitGuideButton} onClick={handleOpenFitGuide}>
                  <Text as="span" sx={styles.shoeFitGuideButtonText}>
                    {formatMessage({
                      id: 'pdp.product.viewFitGuide',
                      defaultMessage: 'View Fit Guide',
                    })}
                  </Text>
                  <FitIcon width="24px" height="24px" viewBox="8 8 24 24" aria-hidden="true" />
                </Button>
              )}
            </>
          )}
        </Box>
      </DrawerBody>
    </>
  )
}

export default SelectSizeContainer
