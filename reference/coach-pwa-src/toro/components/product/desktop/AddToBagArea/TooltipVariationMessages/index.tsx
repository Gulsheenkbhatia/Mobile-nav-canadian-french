import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import VariationMessages from 'toro/components/product/VariationMessages'
import {
  orderingStatusAtom,
  maxQuantityErrorAtom,
  orderingErrorAtom,
  isNotifyMeAvailableProductAtom,
  selectedSizeAtom,
  availableSizesAtom,
  isStickyBarMinimizedAtom,
  addingToBagErrorAtom,
  productDataForGaBadgesAtom,
} from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import useProductData from 'toro/hooks/useProductData'
import { useIntl } from 'react-intl'
import { useMultiStyleConfig } from '@chakra-ui/react'
import usePreference from 'toro/hooks/usePreference_new'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

const TooltipVariationMessages = ({
  isMembershipExclusiveProduct = false,
  hideFinalSaleMessaging = false,
}) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('VariationMessages')
  const orderingError = useAtomValue(orderingErrorAtom)
  const maxQuantityError = useAtomValue(maxQuantityErrorAtom)
  const orderingStatus = useAtomValue(orderingStatusAtom)
  const isNotifyMeProduct = useAtomValue(isNotifyMeAvailableProductAtom)
  const selectedSize = useAtomValue(selectedSizeAtom)
  const availableSizes = useAtomValue(availableSizesAtom)
  const isStickyBarMinimized = useAtomValue(isStickyBarMinimizedAtom)
  const addingToBagError = useAtomValue(addingToBagErrorAtom)
  const pdpExpectedShipdayMessage = useProductData(
    'pdpExpectedShipdayMessage.c_body.default.markup'
  )
  const productDataForGaBadges = useAtomValue(productDataForGaBadgesAtom)
  const isFinalSale = useSelectedVariantData('customAttributes.c_isFinalSale')

  const {
    badging: { finalSaleDiscountPercentage: discPercentage },
  } = usePreference({
    badging: ['finalSaleDiscountPercentage'],
  })

  if (isStickyBarMinimized) return null

  const finalSalePrefrence = discPercentage
    ? [{ id: 'finalSaleDiscountPercentage', value: discPercentage }]
    : []

  const variationMessagesProps = {
    ...productDataForGaBadges,
    errorType: orderingError,
    isNotifyMeProduct,
    status: orderingStatus,
    maxQuantityError,
    maxQtyErrorMsg: addingToBagError,
    sizesLength: availableSizes?.length,
    selectedSize,
    pdpExpecteShipdayMessageMarkup:
      pdpExpectedShipdayMessage ||
      formatMessage({ id: 'pdp.expectedShipDate', defaultMessage: 'Expected Ship Date:' }),
    finalSalePrefrence,
    isFinalSale,
    hideFinalSaleMessaging,
  }

  return (
    <Flex width="100%" justifyContent="center" className="atb-variation-messages">
      <Box position="relative" width="100%">
        <Flex sx={styles.variationMessagesContainer} width="100%">
          {<VariationMessages {...variationMessagesProps} />}
        </Flex>
      </Box>
    </Flex>
  )
}

export default TooltipVariationMessages
