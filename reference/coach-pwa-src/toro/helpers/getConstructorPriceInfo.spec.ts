import { getConstructorPriceInfo } from 'toro/helpers/getConstructorPriceInfo'

export const CURRENT_LOCALE = {
  locale: 'en-US',
  currency: 'USD',
  currencyDecimals: 2,
  currencySymbol: '$',
  lang: 'en',
  region: 'US',
}

export const VARIANTS_DATA_FOR_FILTER_TEST = [
  {
    displayifOOS: false,
    orderable: true,
    prices: {
      tieredPrices: [
        {
          price: '398.0000',
          quantity: 1,
        },
      ],
      currentPrice: '119.4000',
      regularPrice: '398.0000',
      priceRange: null,
      discount: '70',
    },
    VariationId: 'CB901-IMMZI',
  },
  {
    displayifOOS: false,
    orderable: true,
    prices: {
      tieredPrices: [
        {
          price: '398.0000',
          quantity: 1,
        },
      ],
      currentPrice: '169.0000',
      regularPrice: '398.0000',
      priceRange: null,
      discount: '58',
    },
    VariationId: 'CB901-IMOQY',
  },
  {
    displayifOOS: false,
    orderable: false,
    prices: {
      tieredPrices: [
        {
          price: '398.0000',
          quantity: 1,
        },
      ],
      currentPrice: '119.4000',
      regularPrice: '398.0000',
      priceRange: null,
      discount: '70',
    },
    VariationId: 'CB901-QBUOJ',
  },
]

const PRICE_RESULT = [
  {
    sales: {
      currency: 'USD',
      value: 119.4,
      formatted: '$119.40',
      decimalPrice: '119.40',
    },
    list: {
      currency: 'USD',
      value: 398,
      formatted: '$398',
      decimalPrice: '398.00',
    },
    promotionalPrice: null,
    markdownDiscPercent: '70',
    promotionDiscPercent: null,
    discountPercentage: '70',
  },
]

describe('src/toro/helpers/getConstructorPriceInfo.ts', () => {
  test('return single price if there is no discount and same price', () => {
    expect(
      getConstructorPriceInfo({
        productVariants: [
          {
            orderable: true,
            displayifOOS: true,
            prices: {
              currentPrice: 0,
              regularPrice: '400.00',
              discount: 0,
            },
          },
          {
            orderable: false,
            displayifOOS: false,
            prices: {
              currentPrice: 0,
              regularPrice: '400.00',
              discount: 0,
            },
          },
        ],
        currentLocale: {
          locale: 'en-US',
          currency: 'USD',
          currencyDecimals: 2,
          currencySymbol: '$',
          lang: 'en',
          region: 'US',
        },
        displayOosSwatchPref: true,
        enableSaleSuppression: false,
      })
    ).toEqual([
      {
        sales: {
          currency: 'USD',
          value: 400,
          formatted: '$400',
          decimalPrice: '400.00',
        },
        list: null,
        promotionalPrice: null,
        markdownDiscPercent: null,
        promotionDiscPercent: null,
        discountPercentage: null,
      },
    ])
  })

  test('return price range with discount if product has multiple variants with different prices', () => {
    expect(
      getConstructorPriceInfo({
        productVariants: [
          {
            orderable: true,
            displayifOOS: true,
            prices: {
              currentPrice: '225.0000',
              regularPrice: '450.00',
              discount: '50',
            },
          },
          {
            orderable: false,
            displayifOOS: false,
            prices: {
              currentPrice: '225.0000',
              regularPrice: '450.00',
              discount: '50',
            },
          },
          {
            orderable: true,
            displayifOOS: true,
            prices: {
              currentPrice: '112.50000',
              regularPrice: '450.00',
              discount: '75',
            },
          },
          {
            orderable: false,
            displayifOOS: false,
            prices: {
              currentPrice: '112.50000',
              regularPrice: '450.00',
              discount: '75',
            },
          },
          {
            orderable: true,
            displayifOOS: true,
            prices: {
              currentPrice: '337.50000',
              regularPrice: '450.00',
              discount: '25',
            },
          },
          {
            orderable: false,
            displayifOOS: false,
            prices: {
              currentPrice: '337.50000',
              regularPrice: '450.00',
              discount: '25',
            },
          },
        ],
        currentLocale: {
          locale: 'en-US',
          currency: 'USD',
          currencyDecimals: 2,
          currencySymbol: '$',
          lang: 'en',
          region: 'US',
        },
        displayOosSwatchPref: false,
      })
    ).toEqual([
      {
        type: 'range',
        min: {
          sales: {
            value: 112.5,
            currency: 'USD',
            formatted: `$112.50`,
            decimalPrice: '112.50',
          },
          list: {
            value: 450,
            currency: 'USD',
            formatted: '$450',
            decimalPrice: '450.00',
          },
          promotionalPrice: null,
          discountPercentage: '75',
        },
        max: {
          sales: {
            value: 337.5,
            currency: 'USD',
            formatted: '$337.50',
            decimalPrice: '337.50',
          },
          list: {
            value: 450,
            currency: 'USD',
            formatted: '$450',
            decimalPrice: '450.00',
          },
          promotionalPrice: null,
          discountPercentage: '25',
        },
        maxDiscount: {
          maxDiscount: '75',
          isDiscountSame: false,
        },
        viewType: 'Case2',
      },
    ])
  })

  test('return price range with discount if product has multiple variants with different prices and one variant without discount', () => {
    expect(
      getConstructorPriceInfo({
        productVariants: [
          {
            orderable: true,
            displayifOOS: true,
            prices: {
              currentPrice: 0,
              regularPrice: '450.00',
              discount: 0,
            },
          },
          {
            orderable: false,
            displayifOOS: false,
            prices: {
              currentPrice: 0,
              regularPrice: '450.00',
              discount: 0,
            },
          },
          {
            orderable: true,
            displayifOOS: true,
            prices: {
              currentPrice: '112.5000',
              regularPrice: '450.00',
              discount: '75',
            },
          },
          {
            orderable: false,
            displayifOOS: false,
            prices: {
              currentPrice: '112.5000',
              regularPrice: '450.00',
              discount: '75',
            },
          },
          {
            orderable: true,
            displayifOOS: true,
            prices: {
              currentPrice: '337.50000',
              regularPrice: '450.00',
              discount: '25',
            },
          },
          {
            orderable: false,
            displayifOOS: false,
            prices: {
              currentPrice: '337.50000',
              regularPrice: '450.00',
              discount: '25',
            },
          },
        ],
        currentLocale: {
          locale: 'en-US',
          currency: 'USD',
          currencyDecimals: 2,
          currencySymbol: '$',
          lang: 'en',
          region: 'US',
        },
        displayOosSwatchPref: false,
      })
    ).toEqual([
      {
        type: 'range',
        min: {
          sales: {
            value: 112.5,
            currency: 'USD',
            formatted: '$112.50',
            decimalPrice: '112.50',
          },
          list: {
            value: 450,
            currency: 'USD',
            formatted: '$450',
            decimalPrice: '450.00',
          },
          promotionalPrice: null,
          discountPercentage: '75',
        },
        max: {
          sales: {
            value: 450,
            currency: 'USD',
            formatted: '$450',
            decimalPrice: '450.00',
          },
          list: {
            value: 450,
            currency: 'USD',
            formatted: '$450',
            decimalPrice: '450.00',
          },
          promotionalPrice: null,
          discountPercentage: 0,
        },
        maxDiscount: {
          maxDiscount: '75',
          isDiscountSame: false,
        },
        viewType: 'Case2',
      },
    ])
  })

  test('return single sales price with discount when product has the same discount', () => {
    expect(
      getConstructorPriceInfo({
        productVariants: [
          {
            orderable: true,
            displayifOOS: true,
            prices: {
              currentPrice: '225.00',
              regularPrice: '450.00',
              discount: '50',
            },
          },
          {
            orderable: false,
            displayifOOS: false,
            prices: {
              currentPrice: '225.00',
              regularPrice: '450.00',
              discount: '50',
            },
          },
        ],
        currentLocale: {
          locale: 'en-US',
          currency: 'USD',
          currencyDecimals: 2,
          currencySymbol: '$',
          lang: 'en',
          region: 'US',
        },
        displayOosSwatchPref: false,
      })
    ).toEqual([
      {
        sales: {
          value: 225,
          currency: 'USD',
          formatted: '$225',
          decimalPrice: '225.00',
        },
        list: {
          value: 450,
          currency: 'USD',
          formatted: '$450',
          decimalPrice: '450.00',
        },
        promotionalPrice: null,
        markdownDiscPercent: '50',
        promotionDiscPercent: null,
        discountPercentage: '50',
      },
    ])
  })

  test('return single sales FRP price with discount if displayOosSwatchPref is enabled and its CoachOutlet or KSS', () => {
    expect(
      getConstructorPriceInfo({
        productVariants: VARIANTS_DATA_FOR_FILTER_TEST,
        currentLocale: CURRENT_LOCALE,
        displayOosSwatchPref: true,
        isCoachOutletOrKSS: true,
        frpVGId: 'CB901-IMMZI',
      })
    ).toEqual(PRICE_RESULT)
  })

  test('return single sales FRP price with discount if displayOosSwatchPref is disabled and its CoachOutlet or KSS', () => {
    expect(
      getConstructorPriceInfo({
        productVariants: VARIANTS_DATA_FOR_FILTER_TEST,
        currentLocale: CURRENT_LOCALE,
        displayOosSwatchPref: false,
        isCoachOutletOrKSS: true,
        frpVGId: 'CB901-IMMZI',
      })
    ).toEqual(PRICE_RESULT)
  })

  test('return list and sales prices for bundle product', () => {
    const productData = {
      sale_price: 150.9,
      price: 267.4,
    }
    expect(
      getConstructorPriceInfo({
        productData,
        productVariants: VARIANTS_DATA_FOR_FILTER_TEST,
        currentLocale: CURRENT_LOCALE,
        displayOosSwatchPref: false,
        isCoachOutletOrKSS: true,
        frpVGId: 'CB901-IMMZI',
        bundleListPriceCaption: 'Retail: ',
        isBundleProduct: true,
      })
    ).toEqual([
      {
        sales: {
          currency: 'USD',
          value: 150.9,
          decimalPrice: '150.90',
          formatted: '$150.90',
        },
        list: {
          currency: 'USD',
          value: 267.4,
          decimalPrice: '267.40',
          formatted: '$267.40',
        },
        promotionalPrice: null,
        markdownDiscPercent: null,
        promotionDiscPercent: null,
        discountPercentage: null,
        listPriceCaption: 'Retail: ',
      },
    ])
  })
})
