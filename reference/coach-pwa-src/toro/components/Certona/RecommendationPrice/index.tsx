import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import { useContext } from 'react'
import { useMultiStyleConfig } from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import Flex from 'toro/components/Flex'
import PWAContext from 'components/common/PWAContext'
import usePreference from 'toro/hooks/usePreference_new'
import useCustomSalePriceColor from 'toro/hooks/useCustomSalePriceColor'
import validatePriceAndDiscount from 'toro/helpers/validatePriceAndDiscount'
import { formatRecommendationPrice } from 'toro/components/Certona/helpers'
import { price as formatPrice } from 'toro/helpers/price-format'
import useGetCurrencyOptions from 'toro/hooks/useGetCurrencyOptions'
import { RecommendationVendors } from 'toro/lib/vendorProductsAdapter/recommendations/configurations'

export interface CertonaProductPricing {
  currency: string
  discountpercentage: string
  fullprice: string
  saleprice: string
}

interface RecommendationPriceComparableProps {
  price: CertonaProductPricing
  isHomePage?: boolean
  variant?: string
}

const RecommendationPriceComparable = ({
  price,
  isHomePage,
  variant,
}: RecommendationPriceComparableProps) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('PDPRecommendations', { variant }) as any

  if (isNil(price)) return null
  return (
    <Flex
      className="recommendation-price-comparable"
      data-qa="wrapper_comparable_value"
      sx={styles.comparablePriceWrapper(isHomePage)}
    >
      <Text
        variant="body-text-secondary"
        size="sm"
        data-qa="txt_comparable_value"
        sx={styles.comparablePrice}
      >
        {formatMessage({ id: 'plp.price.comparablevalue', defaultMessage: 'Comparable Value' })}
      </Text>
      <Text
        variant="body-text-secondary"
        size="sm"
        data-qa="txt_comparable_value_price"
        sx={styles.comparablePrice}
      >
        {price.currency}
        {price.fullprice}
      </Text>
    </Flex>
  )
}

const getDiscountPercentage = (price: CertonaProductPricing, isComparablePrice: boolean) => {
  if (isComparablePrice) {
    return `(${price?.discountpercentage}% off)`
  }
  return `(${price?.discountpercentage}%)`
}

export enum CertonaPriceType {
  NoPrice = 'No Price',
  SinglePrice = 'Single Price',
  ShopGrid = 'ShopGrid',
  ShopGridWODisc = 'ShopGridWODisc',
}

interface RecommendationPriceProps {
  product: any
  hidePrice: boolean
  scheme: string
  variant?: string
  hideDiscount?: boolean
  isHomePage?: boolean
}

const RecommendationPrice = ({
  product,
  hidePrice,
  scheme,
  hideDiscount = false,
  isHomePage = false,
  variant,
}: RecommendationPriceProps) => {
  const { appData } = useContext(PWAContext)
  const {
    generalConfiguration: { siteIdentifier },
    priceSitePreferences: { isComparablePriceValue = false },
    certonaConfiguration: { certonaPriceDisplay = null },
    recommendations: { priceConfiguration = null },
  } = usePreference({
    generalConfiguration: ['siteIdentifier'],
    priceSitePreferences: ['isComparablePriceValue'],
    CertonaConfiguration: ['certonaPriceDisplay'],
    recommendations: ['priceConfiguration'],
  })
  const customSalePriceColor = useCustomSalePriceColor({ isCertonaRecommendationContainer: true })
  const isCoachOutletOrKSS = ['ksna-surprise', 'coach-outlet'].includes(siteIdentifier)
  const price: CertonaProductPricing = product.price
  const styles = useMultiStyleConfig('PDPRecommendations', { variant }) as any
  const samePrice = parseInt(price?.saleprice) === parseInt(price?.fullprice)
  const productSalePrice = formatRecommendationPrice(price?.saleprice, isCoachOutletOrKSS)
  const productFullPrice = formatRecommendationPrice(price?.fullprice, isCoachOutletOrKSS)
  const isDiscountOffDisabled = get(appData, 'isDiscountOffDisabled', false)
  const isVendorXgen = product?.vendor === RecommendationVendors.XGEN
  const vendorPriceConfig = isVendorXgen
    ? priceConfiguration?.[scheme]
    : certonaPriceDisplay?.[scheme]
  const recommendationPriceType = vendorPriceConfig || CertonaPriceType.ShopGrid

  const { isSalePriceValid } = validatePriceAndDiscount(product?.price)
  const getCurrencyOptions = useGetCurrencyOptions()
  const priceToFormate = (price) => {
    const currencyOptions = getCurrencyOptions()

    return formatPrice(price, { ...currencyOptions, hideSymbol: false })
  }

  const isShopGrid =
    recommendationPriceType === CertonaPriceType.ShopGrid ||
    recommendationPriceType === CertonaPriceType.ShopGridWODisc
  const isShopGridWODisc = recommendationPriceType === CertonaPriceType.ShopGridWODisc
  const showSaleColor = isShopGrid && isSalePriceValid && !samePrice
  const showComparablePrice = isShopGrid && !samePrice && isComparablePriceValue
  const showStrikeOffPrice = isShopGrid && isSalePriceValid && !samePrice && !isComparablePriceValue
  const showDiscountPercentage =
    !hideDiscount &&
    !isDiscountOffDisabled &&
    isShopGrid &&
    !isShopGridWODisc &&
    variant !== 'RVRecommendationsItem' &&
    price?.discountpercentage &&
    parseInt(price?.discountpercentage) !== 0
  const discountPercentage = getDiscountPercentage(price, showComparablePrice)

  if (hidePrice || (recommendationPriceType === CertonaPriceType.NoPrice && !price)) return null

  return (
    <Box className="recommended-price" sx={styles.recommendedPriceMainWrapper}>
      <Box w="100%">
        {showComparablePrice && isSalePriceValid && (
          <RecommendationPriceComparable
            price={isCoachOutletOrKSS ? { ...price, fullprice: productFullPrice } : price}
            isHomePage={isHomePage}
            variant={variant}
          />
        )}
        <Box
          className="recommendation-tile-price-wrapper"
          sx={styles.priceContainer(isHomePage)}
          data-qa="recommendation_price_container"
        >
          <Text
            variant="secondary"
            as="span"
            className="price-text"
            data-qa="cm_txt_pdt_price"
            sx={{
              ...styles.recommendedPriceText(showSaleColor),
              ...(showDiscountPercentage ? styles.recommendedPriceColor : {}),
              // The `!important` declaration is necessary here due to the presence of a media query
              // in `recommendedPriceText(showSaleColor)`, which increases its CSS selector specificity.
              // This is particularly important for maintaining styling consistency across PDP Certona Containers.
              ...(showSaleColor ? { color: `${customSalePriceColor?.color}!important` } : {}),
            }}
          >
            <>{priceToFormate(`${isSalePriceValid ? productSalePrice : productFullPrice}`)}</>
          </Text>
          {showStrikeOffPrice && (
            <Text
              variant="secondary"
              as="span"
              className="strike-off-price"
              data-qa="strike-off-price"
              sx={{
                ...styles.priceStrikeoff,
                ...(showDiscountPercentage ? styles.strikeOffWithDiscount : {}),
              }}
            >
              {priceToFormate(price.fullprice)}
            </Text>
          )}
          {showDiscountPercentage && (
            <Text
              variant="secondary"
              as="span"
              className="discount-percentage"
              data-qa="discount-percentage"
              sx={styles.priceDiscount(showSaleColor && isComparablePriceValue, isHomePage)}
            >
              {discountPercentage}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default RecommendationPrice
