import get from 'lodash/get'
import { price as formatPrice } from 'toro/helpers/price-format'
import { PricingValue } from 'toro/types/productTypes'

type CurrencyOption = {
  currency: string
  decimals: number
  locale: string
  disablePriceFormatGrouping: boolean
  hideSymbol: boolean
}

type CurrentLocale = {
  locale: string
  currency: string
  currencyDecimals: number
  currencySymbol: string
  lang: string
  region: string
  currencySymbolAfterPrice?: boolean
}

function getMaxPrice(arr: number[], currencyOptions: CurrencyOption): number | string {
  return formatPrice(Math.max(...arr), currencyOptions)
}

function getMinPrice(arr: number[], currencyOptions: CurrencyOption): number | string {
  return formatPrice(Math.min(...arr), currencyOptions)
}

function getArrayOfValues(arr: object[], str: string): number[] {
  return arr
    .map((item) => {
      if (get(item, str) > 0) {
        return Number(get(item, str))
      }
      return 0
    })
    .filter(Boolean)
}

function getDecimalPrice(price: number | string): number | string {
  if (!/,|\./gm.test(String(price))) {
    return `${price}.00`
  }
  return price
}

function getStructuredPriceObj(
  price: number | string,
  currency: string,
  currencyCode: string,
  currencySymbolAfterPrice: boolean = false
): PricingValue {
  const formatted = currencySymbolAfterPrice ? `${price} ${currency}` : `${currency}${price}`
  return {
    currency: currencyCode,
    value: Number(price),
    formatted,
    decimalPrice: getDecimalPrice(price),
  }
}

export const getPriceInfoXGen = ({
  productData,
  productVariants,
  currentLocale,
  displayOosSwatchPref,
  isCoachOutletOrKSS = false,
  frpVGId = null,
  isBundleProduct = false,
  bundleListPriceCaption,
  promotion,
  enableSaleSuppression,
  src,
}: {
  productData?: object
  productVariants: object[]
  currentLocale: CurrentLocale
  displayOosSwatchPref?: boolean
  isCoachOutletOrKSS?: boolean
  frpVGId?: string
  isBundleProduct?: boolean
  bundleListPriceCaption?: string
  promotion?: object
  enableSaleSuppression?: boolean
  src?: string
}) => {
  const regularPriceArray = productVariants.map((item) =>
    Number(get(item, 'prices.regularPrice', 0))
  )
  const discountArray = getArrayOfValues(productVariants, 'prices.discount')
  const salesPriceArray = getArrayOfValues(productVariants, 'prices.currentPrice')
  const isOneVariantProduct = productVariants?.length && productVariants?.length === 1
  const isSingleDiscountForProduct = Math.min(...discountArray) === Math.max(...discountArray)
  const currency = currentLocale?.currencySymbol ?? '$'
  const currencyCode = currentLocale?.currency ?? 'USD'
  const currencySymbolAfterPrice = currentLocale?.currencySymbolAfterPrice ?? false
  const currenCyOptions = {
    currency: currencyCode,
    decimals: currentLocale?.currencyDecimals,
    locale: currentLocale?.locale,
    disablePriceFormatGrouping: false,
    hideSymbol: true,
  }

  if (isBundleProduct) {
    return [
      {
        sales: getStructuredPriceObj(
          formatPrice(get(productData, 'sale_price'), currenCyOptions),
          currency,
          currencyCode,
          currencySymbolAfterPrice
        ),
        list: getStructuredPriceObj(
          formatPrice(get(productData, 'price'), currenCyOptions),
          currency,
          currencyCode,
          currencySymbolAfterPrice
        ),
        promotionalPrice: null,
        markdownDiscPercent: null,
        promotionDiscPercent: null,
        discountPercentage: null,
        listPriceCaption: bundleListPriceCaption,
      },
    ]
  }

  const promotionalPrice = get(promotion, 'promotionPrice', null)
  if (promotionalPrice) {
    const discountPercentage =
      100 -
      Math.floor(100 * (promotionalPrice / Number(getMaxPrice(regularPriceArray, currenCyOptions))))
    return [
      {
        /// The condition needs to show list price on the UI
        sales: getStructuredPriceObj(
          !discountArray?.length
            ? getMaxPrice(regularPriceArray, currenCyOptions)
            : getMinPrice(salesPriceArray, currenCyOptions),
          currency,
          currencyCode,
          currencySymbolAfterPrice
        ),
        /// The condition needs to remove comparable value from UI
        list: discountArray?.length
          ? getStructuredPriceObj(
              getMaxPrice(regularPriceArray, currenCyOptions),
              currency,
              currencyCode,
              currencySymbolAfterPrice
            )
          : null,
        promotionalPrice: promotionalPrice
          ? getStructuredPriceObj(
              promotionalPrice,
              currency,
              currencyCode,
              currencySymbolAfterPrice
            )
          : null,
        markdownDiscPercent: promotionalPrice && discountPercentage ? discountPercentage : null,
        promotionDiscPercent: null,
        discountPercentage: promotionalPrice && discountPercentage ? discountPercentage : null,
      },
    ]
  }

  if (!discountArray?.length) {
    return [
      {
        sales: getStructuredPriceObj(
          getMaxPrice(regularPriceArray, currenCyOptions),
          currency,
          currencyCode,
          currencySymbolAfterPrice
        ),
        list: null, // setting to null because this is what we got in regular SFCC data, and this is no have affect on pricing
        promotionalPrice: null,
        markdownDiscPercent: null,
        promotionDiscPercent: null,
        discountPercentage: null,
      },
    ]
  }

  const oneVariantPriceData = [
    {
      sales: getStructuredPriceObj(
        getMinPrice(salesPriceArray, currenCyOptions),
        currency,
        currencyCode,
        currencySymbolAfterPrice
      ),
      list: getStructuredPriceObj(
        getMaxPrice(regularPriceArray, currenCyOptions),
        currency,
        currencyCode,
        currencySymbolAfterPrice
      ),
      promotionalPrice: null,
      markdownDiscPercent: getMaxPrice(discountArray, currenCyOptions),
      promotionDiscPercent: null,
      discountPercentage: getMaxPrice(discountArray, currenCyOptions),
    },
  ]

  if (isCoachOutletOrKSS) {
    return oneVariantPriceData
  }

  if (discountArray?.length !== regularPriceArray?.length) {
    return [
      {
        type: 'range',
        min: {
          sales: getStructuredPriceObj(
            getMinPrice(salesPriceArray, currenCyOptions),
            currency,
            currencyCode,
            currencySymbolAfterPrice
          ),
          list: getStructuredPriceObj(
            getMaxPrice(regularPriceArray, currenCyOptions),
            currency,
            currencyCode,
            currencySymbolAfterPrice
          ),
          promotionalPrice: null,
          discountPercentage: getMaxPrice(discountArray, currenCyOptions),
        },
        max: {
          sales: getStructuredPriceObj(
            getMaxPrice(regularPriceArray, currenCyOptions),
            currency,
            currencyCode,
            currencySymbolAfterPrice
          ),
          list: getStructuredPriceObj(
            getMaxPrice(regularPriceArray, currenCyOptions),
            currency,
            currencyCode,
            currencySymbolAfterPrice
          ),
          promotionalPrice: null,
          discountPercentage: 0,
        },
        maxDiscount: {
          maxDiscount: getMaxPrice(discountArray, currenCyOptions),
          isDiscountSame: false,
        },
        viewType: 'Case2',
      },
    ]
  } else {
    if (isOneVariantProduct) {
      return oneVariantPriceData
    }
    if (isSingleDiscountForProduct) {
      return [
        {
          sales: getStructuredPriceObj(
            getMinPrice(salesPriceArray, currenCyOptions),
            currency,
            currencyCode,
            currencySymbolAfterPrice
          ),
          list: getStructuredPriceObj(
            getMaxPrice(regularPriceArray, currenCyOptions),
            currency,
            currencyCode,
            currencySymbolAfterPrice
          ),
          promotionalPrice: null,
          discountPercentage: getMaxPrice(discountArray, currenCyOptions),
        },
      ]
    }
    return [
      {
        type: 'range',
        min: {
          sales: getStructuredPriceObj(
            getMinPrice(salesPriceArray, currenCyOptions),
            currency,
            currencyCode,
            currencySymbolAfterPrice
          ),
          list: getStructuredPriceObj(
            getMaxPrice(regularPriceArray, currenCyOptions),
            currency,
            currencyCode,
            currencySymbolAfterPrice
          ),
          promotionalPrice: null,
          discountPercentage: getMaxPrice(discountArray, currenCyOptions),
        },
        max: {
          sales: getStructuredPriceObj(
            getMaxPrice(salesPriceArray, currenCyOptions),
            currency,
            currencyCode,
            currencySymbolAfterPrice
          ),
          list: getStructuredPriceObj(
            getMaxPrice(regularPriceArray, currenCyOptions),
            currency,
            currencyCode,
            currencySymbolAfterPrice
          ),
          promotionalPrice: null,
          discountPercentage: getMinPrice(discountArray, currenCyOptions),
        },
        maxDiscount: {
          maxDiscount: getMaxPrice(discountArray, currenCyOptions),
          isDiscountSame: false,
        },
        viewType: 'Case2',
      },
    ]
  }
}
