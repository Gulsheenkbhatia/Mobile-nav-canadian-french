import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtomValue } from 'jotai/utils'
import {
  productPriceAtom,
  currentProductVerticalAtom,
  selectedSubmittableVariantDataAtom,
  selectedVariantGroupAtom,
} from 'store/pdp.atom'
import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'
import PriceCallout from 'toro/components/product/desktop/PriceCallout'
import { isSubBrandActiveAtom } from 'store/global.atom'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import { useIntl } from 'react-intl'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import Template from 'toro/components/Template'
import { useContext } from 'react'
import PWAContext from 'components/common/PWAContext'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import { ProductVertical } from 'toro/constants/OneSite'

const ProductPrice = () => {
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const productVertical = useAtomValue(currentProductVerticalAtom)
  const styles = useMultiStyleConfig('ProductPrice', {
    variant: isSubBrandActive ? 'coachtopia' : null,
  })
  const { formatMessage } = useIntl()
  const isPDPv6 = useTemplate([TemplateName.pdpv6])
  const { appData } = useContext(PWAContext)

  const {
    priceSitePreferences: { isComparablePriceValue: comparablePriceOn },
    generalConfiguration: { siteIdentifier },
    oneSite,
  } = usePreference({
    priceSitePreferences: ['isComparablePriceValue'],
    generalConfiguration: ['siteIdentifier'],
    OneSite: ['enableOneSite'],
  })
  const enableOneSite = oneSite?.enableOneSite

  const {
    regularPrice,
    salePrice,
    discountPercentageValue,
    hideDiscountPercentageOneSite,
    hideComparableValueOneSite,
  } = useAtomValue(productPriceAtom)
  const selectedVariant = useAtomValue(selectedSubmittableVariantDataAtom)
  const selectedVariantGroup = useAtomValue(selectedVariantGroupAtom)

  const [hideDiscountRate, hideComparablePrice, isOutletProduct] = useProductData([
    'custom.c_hideDiscountRate',
    'custom.c_hideComparablePriceValue',
    'custom.c_isOutlet',
  ])

  const [hideComparablePriceVG, hideDiscountRateVG] = useVariantGroupData([
    'customAttributes.c_hideComparablePriceValue',
    'customAttributes.c_hideDiscountRate',
  ])

  const [hideComparablePriceSV, hideDiscountRateSV] = useSelectedVariantData([
    'customAttributes.c_hideComparablePriceValue',
    'customAttributes.c_hideDiscountRate',
  ])

  const isOutletBrand = enableOneSite
    ? productVertical === ProductVertical.Outlet
    : ['coach-outlet', 'ksna-surprise'].includes(siteIdentifier) // NOTE add coach-outlet if need to extend for coach brands

  let shouldHideComparablePrice
  let shouldHideDiscountRate

  if (enableOneSite) {
    shouldHideComparablePrice = hideComparableValueOneSite
    shouldHideDiscountRate = hideDiscountPercentageOneSite
  } else {
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
  }

  const showComparablePrice =
    isOutletBrand &&
    (enableOneSite || comparablePriceOn) &&
    !shouldHideComparablePrice &&
    !!regularPrice
  const isDiscountedProduct = !!discountPercentageValue && discountPercentageValue > 0
  const comparablePriceText = formatMessage({
    id: 'pdp.product.comparableValueText',
    defaultMessage: 'Comparable Value',
  })
  return (
    <Flex
      sx={styles.productPriceWrapper}
      className={isSubBrandActive ? 'sub-brand-price-container' : ''}
    >
      {!isPDPv6 && showComparablePrice && (
        <Box sx={styles.comparablePrice}>
          {comparablePriceText} {regularPrice}
        </Box>
      )}
      <Flex
        sx={styles.productPriceRow}
        className={showComparablePrice ? 'outlet-price-container' : ''}
      >
        <Box
          as="span"
          sx={styles.productPrice}
          className={`${isDiscountedProduct ? 'product-price-with-discount' : ''} ${
            isPDPv6 ? 'pdp-active-price' : ''
          }`.trim()}
          data-qa="cm_txt_pdt_price"
        >
          {salePrice || regularPrice}
        </Box>
        {isDiscountedProduct && (
          <>
            {!(isOutletBrand || isOutletProduct) && (
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
                className={`${isOutletBrand ? 'outlet-discount-rate' : ''} discount-rate`}
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
        {isPDPv6 && showComparablePrice && (
          <Box sx={styles.comparablePrice}>
            {comparablePriceText} {regularPrice}
          </Box>
        )}
      </Flex>
      <Template notForIDs={[TemplateName.pdpv6]}>
        <PriceCallout />
      </Template>
    </Flex>
  )
}

export default ProductPrice
