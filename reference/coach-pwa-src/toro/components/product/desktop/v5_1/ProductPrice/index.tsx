import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtomValue } from 'jotai/utils'
import {
  productPriceAtom,
  selectedSubmittableVariantDataAtom,
  selectedVariantGroupAtom,
} from 'store/pdp.atom'
import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'
import { useIntl } from 'react-intl'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import { useContext } from 'react'
import PWAContext from 'components/common/PWAContext'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'

const ProductPrice = () => {
  const styles = useMultiStyleConfig('ProductPrice')
  const { formatMessage } = useIntl()
  const { appData } = useContext(PWAContext)

  const {
    priceSitePreferences: { isComparablePriceValue: comparablePriceOn },
    generalConfiguration: { siteIdentifier },
  } = usePreference({
    priceSitePreferences: ['isComparablePriceValue'],
    generalConfiguration: ['siteIdentifier'],
  })

  const selectedVariant = useAtomValue(selectedSubmittableVariantDataAtom)
  const selectedVariantGroup = useAtomValue(selectedVariantGroupAtom)

  const { regularPrice, salePrice, discountPercentageValue } = useAtomValue(productPriceAtom)
  const [hideDiscountRate, hideComparablePrice] = useProductData([
    'custom.c_hideDiscountRate',
    'custom.c_hideComparablePriceValue',
  ])

  const [hideComparablePriceVG, hideDiscountRateVG] = useVariantGroupData([
    'customAttributes.c_hideComparablePriceValue',
    'customAttributes.c_hideDiscountRate',
  ])

  const [hideComparablePriceSV, hideDiscountRateSV] = useSelectedVariantData([
    'customAttributes.c_hideComparablePriceValue',
    'customAttributes.c_hideDiscountRate',
  ])

  const isOutletBrand = ['coach-outlet', 'ksna-surprise'].includes(siteIdentifier) // NOTE add coach-outlet if need to extend for coach brands

  let shouldHideComparablePrice
  let shouldHideDiscountRate

  if (selectedVariant) {
    shouldHideComparablePrice = hideComparablePriceSV
    shouldHideDiscountRate = hideDiscountRateSV
  } else if (selectedVariantGroup) {
    shouldHideComparablePrice = hideComparablePriceVG
    shouldHideDiscountRate = hideDiscountRateVG
  } else {
    shouldHideComparablePrice = hideComparablePrice
    shouldHideDiscountRate = hideDiscountRate
  }

  const showComparablePrice =
    isOutletBrand && comparablePriceOn && !shouldHideComparablePrice && !!regularPrice
  const isDiscountedProduct = !!discountPercentageValue && discountPercentageValue > 0
  const comparablePriceText = formatMessage({
    id: 'pdp.product.comparableValueText',
    defaultMessage: 'Comparable Value',
  })
  return (
    <Flex sx={styles.productPriceRow}>
      <Box as="span" sx={styles.productPrice} data-qa="cm_txt_pdt_price">
        {salePrice || regularPrice}
      </Box>
      {isDiscountedProduct && (
        <>
          {!isOutletBrand && (
            <Box
              as="span"
              sx={styles.oldPrice}
              className="regular-price"
              data-qa="cm_txt_pdt_price_strthr"
            >
              {regularPrice}
            </Box>
          )}
          {!shouldHideDiscountRate && !appData?.isDiscountOffDisabled && (
            <Box
              as="span"
              sx={styles.discount}
              className="discount-rate"
              data-qa="cm_txt_pdt_price_dpercent"
            >
              {formatMessage(
                {
                  id: 'pdp.price.discount',
                  defaultMessage: `({discountPercentageValue}% off)`,
                },
                { discountPercentageValue }
              )}
            </Box>
          )}
        </>
      )}
      {showComparablePrice && (
        <Box data-qa="wrapper_comparable_value" sx={styles.comparablePrice}>
          {comparablePriceText} {regularPrice}
        </Box>
      )}
    </Flex>
  )
}

export default ProductPrice
