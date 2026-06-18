import { useMemo, useContext } from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import ProductInfoMessage from 'toro/components/product/ProductInfoMessage'
import get from 'lodash/get'
import { ORDERING_ERROR, ORDERING_STATUS } from 'toro/helpers/productVariations'
import MONTHS from 'toro/constants/Months'
import HtmlContent from 'toro/components/HtmlContent'
import useBadges from 'toro/components/badges/hooks/useBadges'
import { badgeTypesUnderCTA, badgeTypes } from 'toro/components/badges/constants/badgeTypes'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import Flex from 'toro/components/Flex'
import useTheme from 'toro/hooks/useTheme'
import { getCustom, isFinalSale as isFinalSaleFunc } from 'toro/helpers/preferences'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import SessionContext from 'toro/components/SessionContext'
import PropTypes from 'prop-types'
import { formatLabel } from 'toro/helpers/formatLabel'
import PWAContext from 'components/common/PWAContext'
import { useAtomValue } from 'jotai/utils'
import { applePayErrorMessageAtom } from 'store/pdp.atom'

export const NOT_SELECTED_TEXT = 'Please select a Size and Width.'
export const NOT_SELECTED_TEXT_WIDTH = 'Please select a Width.'
export const NOT_SELECTED_TEXT_SIZE = 'Please select a Size.'
export const NOT_AVAILABLE_TEXT =
  'This item is no longer available and cannot be added to your bag.'
export const NOTIFY_TEXT =
  'This item is currently unavailable, but you can sign up to be notified when it is back in stock.'
export const MAX_QUANTITY_RESTRICTION_TEXT =
  'You have reached the maximum purchase limit for this item.'
export const OUT_OF_STOCK_RESTRICTION_TEXT =
  'This item cannot be added to cart. Please visit the product page for more details.'

function getShipDateString(dateStr, dateformat, locale) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const monthNum = date.getMonth()
  const monthNames = MONTHS[locale] || {}
  return formatLabel(dateformat, {
    month: monthNames[monthNum] || monthNum + 1,
    day: date.getDate(),
    year: date.getFullYear(),
  })
}
function VariationMessages({
  product = undefined,
  variationGroupData = undefined,
  masterData = undefined,
  errorType = undefined,
  isNotifyMeProduct = undefined,
  status = undefined,
  maxQuantityError = undefined,
  maxQtyErrorMsg = undefined,
  itemsNotAvailableMsgFlag = undefined,
  itemsNotAvailableMsg = undefined,
  isSticky = undefined,
  widthLength = undefined,
  sizesLength = undefined,
  selectedSize = undefined,
  selectedWidth = undefined,
  pdpExpecteShipdayMessageMarkup = undefined,
  finalSalePrefrence = undefined,
  siteId = undefined,
  isFinalSale = undefined,
  isBundleVariant = false,
  isMembershipExclusiveProduct = undefined,
  hideCustomMessages = false,
  hideFinalSaleMessaging = false,
}) {
  const theme = useTheme()
  const styles = useMultiStyleConfig('VariationMessages')
  const { appData } = useContext(PWAContext)
  const locale = get(appData, 'locale')
  const { inStockDate } = get(product || masterData, 'inventory') || {}
  const { session } = useContext(SessionContext)
  const applePayErrorMessage = useAtomValue(applePayErrorMessageAtom)
  const sourceCodeGroupID = get(session, 'user.sourceCodeGroupID')
  const visibleStockDateBadges = [badgeTypesUnderCTA.preorder, badgeTypesUnderCTA.backorder]
  const { formatMessage } = useIntl()
  const bizClassName = {
    [ORDERING_STATUS.backorder]: 'biz-upper-misc-container biz-backorder',
    [ORDERING_STATUS.preorder]: 'biz-upper-misc-container biz-preorder',
    [ORDERING_STATUS.soldOut]: isNotifyMeProduct ? 'biz-upper-misc-container biz-notify-me' : '',
  }

  const getBizClassName = (status) => bizClassName[status] || ''

  const orderingBadges = useBadges({
    page: 'pdp',
    area: BadgeArea.UPPER_MISC,
    product,
    variationGroupData,
    masterData,
  })
  let isFinalSaleMsg = false
  if (!hideFinalSaleMessaging) {
    isFinalSaleMsg = isBundleVariant
      ? isFinalSale
      : get(product, `${getCustom(product)}.c_isFinalSale`, false) ||
        isFinalSaleFunc(finalSalePrefrence, masterData, product, siteId)
  }

  const showCustomMsg =
    !hideCustomMessages &&
    ((['preorder', 'backorder']?.includes?.(status) &&
      !get(product, 'customAttributes.c_inStockCustomText')) ||
      isFinalSaleMsg ||
      (Object.keys(product?.sourceCodeMessage || []).length > 0 && sourceCodeGroupID) ||
      get(product, 'marketingMessageConf'))

  const errors = []
  if (errorType === ORDERING_ERROR.notSelected) {
    if (!selectedWidth && !selectedSize && widthLength && sizesLength) {
      errors.push(
        formatMessage({
          id: 'pdp.product.notSelected.text',
          defaultMessage: NOT_SELECTED_TEXT,
        })
      )
    } else if (!selectedWidth && widthLength) {
      errors.push(
        formatMessage({
          id: 'pdp.product.notSelectedWidth.text',
          defaultMessage: NOT_SELECTED_TEXT_WIDTH,
        })
      )
    } else if (!selectedSize && sizesLength) {
      errors.push(
        formatMessage({
          id: 'pdp.product.notSelectedSize.text',
          defaultMessage: NOT_SELECTED_TEXT_SIZE,
        })
      )
    }
  }
  if (errorType === ORDERING_ERROR.notAvailable) {
    errors.push(
      formatMessage({
        id: 'pdp.product.notAvailable.text',
        defaultMessage: NOT_AVAILABLE_TEXT,
      })
    )
  }
  if (applePayErrorMessage) {
    errors.push(applePayErrorMessage)
  }

  if (status === ORDERING_STATUS.soldOut) {
    isNotifyMeProduct &&
      errors.push(
        formatMessage({
          id: 'pdp.product.notify.text',
          defaultMessage: NOTIFY_TEXT,
        })
      )
  }

  if (maxQuantityError && !itemsNotAvailableMsgFlag) {
    errors.push(
      formatMessage({
        id: 'pdp.product.maxQuantityRestriction.text',
        defaultMessage: MAX_QUANTITY_RESTRICTION_TEXT,
      })
    )
  }

  if (maxQtyErrorMsg) {
    errors.push(maxQtyErrorMsg)
  }

  if (itemsNotAvailableMsg) {
    errors.push(itemsNotAvailableMsg)
  }

  const errorMessageContainerStyles = useMemo(
    () => styles.ErrorMessageContainer(isSticky),
    [isSticky]
  )

  const dateFormat = `{month} {day}`

  return (
    <Box
      w="100%"
      flexBasis="100%"
      sx={errorMessageContainerStyles}
      className="product-variation-message-error-container"
    >
      {isMembershipExclusiveProduct && !errors.length && (
        <ProductInfoMessage
          sx={styles.variationAlertMessage}
          variant="alert"
          size="sm"
          mb="l"
          className="product-info-message-alert"
        >
          {formatMessage({
            id: 'pdp.product.membershipExclusive',
            defaultMessage: 'Membership Exclusive',
          })}
        </ProductInfoMessage>
      )}
      {errors.map((text) => (
        <ProductInfoMessage
          sx={styles.variationAlertMessage}
          variant="alert"
          size="sm"
          mb="l"
          key={text}
          className={`${getBizClassName(status)} product-info-message-alert`}
        >
          {text}
        </ProductInfoMessage>
      ))}
      {showCustomMsg &&
        orderingBadges &&
        orderingBadges.map?.(({ content, badgeID }) => {
          const hideFinalSaleBadge =
            hideFinalSaleMessaging &&
            (badgeID === badgeTypes.isFinalSale || badgeID === badgeTypes.isFinalSaleMessage)
          if (hideFinalSaleBadge) return null

          return (
            <ProductInfoMessage
              size="sm"
              mb="s"
              key={badgeID}
              p="mar"
              data-qa="pdp_txt_preorder_backorder_callout_msg"
              className={`${getBizClassName(status)} product-info-message`}
              sx={styles.customMessageWrapper}
            >
              <Flex>
                <HtmlContent
                  content={content}
                  sx={{ color: theme.colors.neutral.dark, ...styles.infoMessage }}
                  data-qa="pdp_txt_preorder_backorder_callout_msg"
                />
              </Flex>
              {visibleStockDateBadges?.includes(badgeID) && inStockDate && (
                <Box
                  mt="s"
                  sx={{ color: theme.colors.neutral.dark, ...styles.shipDate }}
                  data-qa="pdp_txt_callout_exptd_shipdate"
                >{`${pdpExpecteShipdayMessageMarkup} ${getShipDateString(
                  inStockDate,
                  dateFormat,
                  locale
                )}`}</Box>
              )}
            </ProductInfoMessage>
          )
        })}
    </Box>
  )
}

VariationMessages.propTypes = {
  product: PropTypes.object,
  variationGroupData: PropTypes.object,
  masterData: PropTypes.object,
  errorType: PropTypes.string,
  isNotifyMeProduct: PropTypes.bool,
  status: PropTypes.string,
  maxQuantityError: PropTypes.bool,
  maxQtyErrorMsg: PropTypes.string,
  itemsNotAvailableMsgFlag: PropTypes.bool,
  itemsNotAvailableMsg: PropTypes.string,
  isSticky: PropTypes.bool,
  widthLength: PropTypes.number,
  sizesLength: PropTypes.number,
  selectedSize: PropTypes.object,
  selectedWidth: PropTypes.object,
  pdpExpecteShipdayMessageMarkup: PropTypes.string,
  finalSalePrefrence: PropTypes.array,
  siteId: PropTypes.string,
  isBundleVariant: PropTypes.bool,
  isMembershipExclusiveProduct: PropTypes.bool,
  hideCustomMessages: PropTypes.bool,
  hideFinalSaleMessaging: PropTypes.bool,
}

VariationMessages.defaultProps = {
  isBundleVariant: false,
  isMembershipExclusiveProduct: false,
  hideFinalSaleMessaging: false,
}

export default withErrorBoundaryWrapper(VariationMessages)
