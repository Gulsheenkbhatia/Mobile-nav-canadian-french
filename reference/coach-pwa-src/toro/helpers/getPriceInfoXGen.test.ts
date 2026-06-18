import { getPriceInfoXGen } from './getPriceInfoXGen'

type PriceObject = {
  currency: string
  value: number
  formatted: string
  decimalPrice: string | number
}

type SinglePriceResult = {
  sales: PriceObject
  list: PriceObject | null
  promotionalPrice: PriceObject | null
  markdownDiscPercent: number | null
  promotionDiscPercent: number | null
  discountPercentage: number | null
  listPriceCaption?: string
}

type RangePriceResult = {
  type: string
  min: {
    sales: PriceObject
    list: PriceObject
    discountPercentage: number
  }
  max: {
    sales: PriceObject
    list: PriceObject
    discountPercentage: number
  }
  maxDiscount: {
    maxDiscount: number
    isDiscountSame: boolean
  }
  viewType: string
}

describe('getPriceInfoXGen', () => {
  const mockCurrentLocale = {
    locale: 'en-US',
    currency: 'USD',
    currencyDecimals: 2,
    currencySymbol: '$',
    lang: 'en',
    region: 'US',
  }

  const mockProductVariants = [
    {
      prices: {
        regularPrice: 100,
        currentPrice: 80,
        discount: 20,
      },
    },
    {
      prices: {
        regularPrice: 120,
        currentPrice: 90,
        discount: 25,
      },
    },
  ]

  describe('Bundle Product Cases', () => {
    it('should return bundle pricing when isBundleProduct is true', () => {
      const productData = {
        sale_price: 150,
        price: 200,
      }

      const result = getPriceInfoXGen({
        productData,
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
        isBundleProduct: true,
        bundleListPriceCaption: 'Bundle Price',
      })

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        sales: {
          currency: 'USD',
          value: 150,
          formatted: '$150',
          decimalPrice: '150.00',
        },
        list: {
          currency: 'USD',
          value: 200,
          formatted: '$200',
          decimalPrice: '200.00',
        },
        promotionalPrice: null,
        markdownDiscPercent: null,
        promotionDiscPercent: null,
        discountPercentage: null,
        listPriceCaption: 'Bundle Price',
      })
    })
  })

  describe('Promotional Price Cases', () => {
    it('should return promotional pricing when promotion.promotionPrice exists', () => {
      const promotion = { promotionPrice: 75 }

      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
        promotion,
      })

      expect((result[0] as SinglePriceResult).promotionalPrice).toEqual({
        currency: 'USD',
        value: 75,
        formatted: '$75',
        decimalPrice: '75.00',
      })
    })

    it('should calculate discount percentage based on promotional price', () => {
      const promotion = { promotionPrice: 60 }

      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
        promotion,
      })

      const promoResult = result[0] as SinglePriceResult
      expect(promoResult.discountPercentage).toBe(50)
      expect(promoResult.markdownDiscPercent).toBe(50)
    })

    it('should return max regular price as sales price and null list when promotion exists but no variant discounts exist', () => {
      const promotion = { promotionPrice: 75 }
      const variantsNoDiscount = [
        { prices: { regularPrice: 100, currentPrice: 100 } },
        { prices: { regularPrice: 120, currentPrice: 120 } },
      ]

      const result = getPriceInfoXGen({
        productVariants: variantsNoDiscount,
        currentLocale: mockCurrentLocale,
        promotion,
      })

      const promoResult = result[0] as SinglePriceResult
      expect(promoResult.sales.value).toBe(120)
      expect(promoResult.list).toBeNull()
    })

    it('should return min sales price when promotion exists and variant discounts exist', () => {
      const promotion = { promotionPrice: 75 }

      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
        promotion,
      })

      expect((result[0] as SinglePriceResult).sales.value).toBe(80)
    })

    it('should set markdownDiscPercent equal to discountPercentage', () => {
      const promotion = { promotionPrice: 90 }

      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
        promotion,
      })

      const promoResult = result[0] as SinglePriceResult
      expect(promoResult.markdownDiscPercent).toBe(promoResult.discountPercentage)
    })
  })

  describe('No Discount Cases', () => {
    const variantsNoDiscount = [
      { prices: { regularPrice: 100, currentPrice: 100 } },
      { prices: { regularPrice: 120, currentPrice: 120 } },
    ]

    it('should return regular price as sales value when discountArray is empty', () => {
      const result = getPriceInfoXGen({
        productVariants: variantsNoDiscount,
        currentLocale: mockCurrentLocale,
      })

      expect(result).toHaveLength(1)
      expect((result[0] as SinglePriceResult).sales.value).toBe(120)
    })

    it('should set all discount fields to null', () => {
      const result = getPriceInfoXGen({
        productVariants: variantsNoDiscount,
        currentLocale: mockCurrentLocale,
      })

      const noDiscountResult = result[0] as SinglePriceResult
      expect(noDiscountResult.promotionalPrice).toBeNull()
      expect(noDiscountResult.markdownDiscPercent).toBeNull()
      expect(noDiscountResult.promotionDiscPercent).toBeNull()
      expect(noDiscountResult.discountPercentage).toBeNull()
    })
  })

  describe('Coach Outlet / KSS Cases', () => {
    it('should return one variant price data when isCoachOutletOrKSS is true', () => {
      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
        isCoachOutletOrKSS: true,
      })

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        sales: {
          currency: 'USD',
          value: 80,
          formatted: '$80',
          decimalPrice: '80.00',
        },
        list: {
          currency: 'USD',
          value: 120,
          formatted: '$120',
          decimalPrice: '120.00',
        },
        promotionalPrice: null,
        markdownDiscPercent: '25',
        promotionDiscPercent: null,
        discountPercentage: '25',
      })
    })

    it('should use min sales price', () => {
      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
        isCoachOutletOrKSS: true,
      })

      expect((result[0] as SinglePriceResult).sales.value).toBe(80)
    })

    it('should use max regular price for list', () => {
      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
        isCoachOutletOrKSS: true,
      })

      expect((result[0] as SinglePriceResult).list.value).toBe(120)
    })

    it('should use max discount for discount percentage', () => {
      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
        isCoachOutletOrKSS: true,
      })

      const outletResult = result[0] as SinglePriceResult
      expect(outletResult.discountPercentage).toBe('25')
      expect(outletResult.markdownDiscPercent).toBe('25')
    })
  })

  describe('Partial Discount Cases (discountArray.length !== regularPriceArray.length)', () => {
    const partialDiscountVariants = [
      { prices: { regularPrice: 100, currentPrice: 80, discount: 20 } },
      { prices: { regularPrice: 120, currentPrice: 120 } },
    ]

    it('should return range type pricing', () => {
      const result = getPriceInfoXGen({
        productVariants: partialDiscountVariants,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as RangePriceResult).type).toBe('range')
    })

    it('should include min and max price objects', () => {
      const result = getPriceInfoXGen({
        productVariants: partialDiscountVariants,
        currentLocale: mockCurrentLocale,
      })

      const rangeResult = result[0] as RangePriceResult
      expect(rangeResult.min).toBeDefined()
      expect(rangeResult.max).toBeDefined()
    })

    it('should set min with sales price and discount', () => {
      const result = getPriceInfoXGen({
        productVariants: partialDiscountVariants,
        currentLocale: mockCurrentLocale,
      })

      const rangeResult = result[0] as RangePriceResult
      expect(rangeResult.min.sales.value).toBe(80)
      expect(rangeResult.min.discountPercentage).toBe('20')
    })

    it('should set max with regular price and 0 discount', () => {
      const result = getPriceInfoXGen({
        productVariants: partialDiscountVariants,
        currentLocale: mockCurrentLocale,
      })

      const rangeResult = result[0] as RangePriceResult
      expect(rangeResult.max.sales.value).toBe(120)
      expect(rangeResult.max.discountPercentage).toBe(0)
    })

    it('should include maxDiscount object with isDiscountSame: false', () => {
      const result = getPriceInfoXGen({
        productVariants: partialDiscountVariants,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as RangePriceResult).maxDiscount).toEqual({
        maxDiscount: '20',
        isDiscountSame: false,
      })
    })

    it('should set viewType to Case2', () => {
      const result = getPriceInfoXGen({
        productVariants: partialDiscountVariants,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as RangePriceResult).viewType).toBe('Case2')
    })
  })

  describe('Single Variant Product Cases', () => {
    const singleVariant = [{ prices: { regularPrice: 100, currentPrice: 80, discount: 20 } }]

    it('should return one variant price data when only one variant exists', () => {
      const result = getPriceInfoXGen({
        productVariants: singleVariant,
        currentLocale: mockCurrentLocale,
      })

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        sales: {
          currency: 'USD',
          value: 80,
          formatted: '$80',
          decimalPrice: '80.00',
        },
        list: {
          currency: 'USD',
          value: 100,
          formatted: '$100',
          decimalPrice: '100.00',
        },
        promotionalPrice: null,
        markdownDiscPercent: '20',
        promotionDiscPercent: null,
        discountPercentage: '20',
      })
    })

    it('should use min sales price', () => {
      const result = getPriceInfoXGen({
        productVariants: singleVariant,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as SinglePriceResult).sales.value).toBe(80)
    })

    it('should use max regular price for list', () => {
      const result = getPriceInfoXGen({
        productVariants: singleVariant,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as SinglePriceResult).list.value).toBe(100)
    })

    it('should use max discount percentage', () => {
      const result = getPriceInfoXGen({
        productVariants: singleVariant,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as SinglePriceResult).discountPercentage).toBe('20')
    })
  })

  describe('Single Discount for All Variants Cases', () => {
    const sameDiscountVariants = [
      { prices: { regularPrice: 100, currentPrice: 80, discount: 20 } },
      { prices: { regularPrice: 120, currentPrice: 96, discount: 20 } },
    ]

    it('should return single price object when all variants have same discount', () => {
      const result = getPriceInfoXGen({
        productVariants: sameDiscountVariants,
        currentLocale: mockCurrentLocale,
      })

      expect(result).toHaveLength(1)
      expect((result[0] as SinglePriceResult & { type?: string }).type).toBeUndefined()
    })

    it('should use min sales price', () => {
      const result = getPriceInfoXGen({
        productVariants: sameDiscountVariants,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as SinglePriceResult).sales.value).toBe(80)
    })

    it('should use max regular price for list', () => {
      const result = getPriceInfoXGen({
        productVariants: sameDiscountVariants,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as SinglePriceResult).list.value).toBe(120)
    })

    it('should use max discount percentage', () => {
      const result = getPriceInfoXGen({
        productVariants: sameDiscountVariants,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as SinglePriceResult).discountPercentage).toBe('20')
    })
  })

  describe('Multiple Variants with Different Discounts Cases', () => {
    it('should return range type pricing', () => {
      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as RangePriceResult).type).toBe('range')
    })

    it('should include min object with min sales price and max discount', () => {
      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
      })

      const rangeResult = result[0] as RangePriceResult
      expect(rangeResult.min.sales.value).toBe(80)
      expect(rangeResult.min.discountPercentage).toBe('25')
    })

    it('should include max object with max sales price and min discount', () => {
      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
      })

      const rangeResult = result[0] as RangePriceResult
      expect(rangeResult.max.sales.value).toBe(90)
      expect(rangeResult.max.discountPercentage).toBe('20')
    })

    it('should include maxDiscount object with isDiscountSame: false', () => {
      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as RangePriceResult).maxDiscount).toEqual({
        maxDiscount: '25',
        isDiscountSame: false,
      })
    })

    it('should set viewType to Case2', () => {
      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as RangePriceResult).viewType).toBe('Case2')
    })
  })

  describe('Currency and Locale Handling', () => {
    it('should use currentLocale.currencySymbol or default to $', () => {
      const euroLocale = { ...mockCurrentLocale, currencySymbol: '€' }
      const resultWithSymbol = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: euroLocale,
      })

      expect((resultWithSymbol[0] as RangePriceResult).min.sales.formatted).toContain('€')

      const localeWithoutSymbol = { ...mockCurrentLocale, currencySymbol: undefined }
      const resultWithDefault = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: localeWithoutSymbol,
      })

      expect((resultWithDefault[0] as RangePriceResult).min.sales.formatted).toContain('$')
    })

    it('should use currentLocale.currency or default to USD', () => {
      const euroLocale = { ...mockCurrentLocale, currency: 'EUR' }
      const resultWithCurrency = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: euroLocale,
      })

      expect((resultWithCurrency[0] as RangePriceResult).min.sales.currency).toBe('EUR')

      const localeWithoutCurrency = { ...mockCurrentLocale, currency: undefined }
      const resultWithDefault = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: localeWithoutCurrency,
      })

      expect((resultWithDefault[0] as RangePriceResult).min.sales.currency).toBe('USD')
    })

    it('should use currentLocale.currencyDecimals for formatting', () => {
      const mockVariantsWithDecimals = [
        {
          prices: {
            currentPrice: 80.25,
            discount: 20,
          },
        },
        {
          prices: {
            currentPrice: 90.99,
          },
        },
      ]
      const localeWithDecimals = { ...mockCurrentLocale, currencyDecimals: 3 }
      const resultWithCustomDecimals = getPriceInfoXGen({
        productVariants: mockVariantsWithDecimals,
        currentLocale: localeWithDecimals,
      })

      expect((resultWithCustomDecimals[0] as RangePriceResult).min.sales.decimalPrice).toBe(
        '80.250'
      )
    })

    it('should use currentLocale.locale for formatting', () => {
      const frenchLocale = { ...mockCurrentLocale, locale: 'fr-FR', currencySymbol: '€' }
      const resultWithCustomLocale = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: frenchLocale,
      })

      expect((resultWithCustomLocale[0] as RangePriceResult).min.sales.formatted).toContain('€')
    })

    it('should set disablePriceFormatGrouping to false(when disablePriceFormatGrouping is false (default), large numbers should have thousand separators)', () => {
      const mockVariantsWithLargePrices = [
        {
          prices: {
            regularPrice: 10000,
            currentPrice: 8000,
            discount: 20,
          },
        },
      ]
      const result = getPriceInfoXGen({
        productVariants: mockVariantsWithLargePrices,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as SinglePriceResult).sales.formatted).toEqual('$8,000')
    })

    it('should set hideSymbol to true(default) in currency options', () => {
      const result = getPriceInfoXGen({
        productVariants: mockProductVariants,
        currentLocale: mockCurrentLocale,
      })

      expect((result[0] as RangePriceResult).min.sales.formatted).not.toContain('$$')
    })
  })
})
