import { memo } from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import usePreference from 'toro/hooks/usePreference_new'
import validatePriceAndDiscount from 'toro/helpers/validatePriceAndDiscount'
import { formatRecommendationPrice } from 'toro/components/Certona/helpers'

const LLMRecommendationPrice = ({ product, styles }) => {
  const { formatMessage } = useIntl()
  const {
    generalConfiguration: { siteIdentifier },
    priceSitePreferences: { isComparablePriceValue },
  } = usePreference({
    priceSitePreferences: ['isComparablePriceValue'],
    generalConfiguration: ['siteIdentifier'],
  })
  const { isListPriceValid, isSalePriceValid, hasDiscount } = validatePriceAndDiscount(
    product?.price
  )

  if (!(isSalePriceValid || isListPriceValid)) {
    return null
  }
  const isKSS = 'ksna-surprise'.includes(siteIdentifier)
  const isCoachOutletOrKSS = 'coach-outlet'.includes(siteIdentifier) || isKSS

  return (
    <Box sx={styles.priceWrapper}>
      {!isKSS && isComparablePriceValue && hasDiscount && (
        <Box sx={styles.comparablePrice}>
          {formatMessage(
            {
              id: 'pdp.product.shopSimilarComparableValue',
              defaultMessage: 'Comparable Value {currency}{price}',
            },
            {
              currency: product.price?.currency,
              price: formatRecommendationPrice(product.listPrice, isCoachOutletOrKSS),
            }
          )}
        </Box>
      )}
      <Box sx={styles.price} data-qa="cm_txt_pdp_price">
        {product.price?.currency}
        {formatRecommendationPrice(
          isSalePriceValid ? product.salePrice : product.listPrice,
          isCoachOutletOrKSS
        )}
      </Box>
      {!isKSS && isComparablePriceValue && hasDiscount && (
        <Box sx={styles.priceDiscount}>
          {formatMessage(
            {
              id: 'pdp.product.shopSimilarDiscount',
              defaultMessage: '({discount}% off)',
            },
            { discount: product.discountPercent }
          )}
        </Box>
      )}
    </Box>
  )
}

export default memo(LLMRecommendationPrice)
