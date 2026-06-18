import { resolveCategoryPricingFlags } from './resolveCategoryPricingFlags'

describe('resolveCategoryPricingFlags', () => {
  it('returns empty object when input is not a plain object', () => {
    expect(resolveCategoryPricingFlags(null)).toEqual({})
    expect(resolveCategoryPricingFlags(undefined)).toEqual({})
    expect(resolveCategoryPricingFlags('')).toEqual({})
    expect(resolveCategoryPricingFlags([])).toEqual({})
  })

  it('returns empty object when root flag is absent', () => {
    expect(resolveCategoryPricingFlags({ hits: [] })).toEqual({})
  })

  it('parses boolean pricing flags from SAPI root', () => {
    expect(
      resolveCategoryPricingFlags({
        cleanStateDisplayDiscountPercentage: true,
        fallbackHideDiscountRate: false,
        fallbackHideComparableValue: true,
      })
    ).toEqual({
      cleanStateDisplayDiscountPercentage: true,
      fallbackHideDiscountRate: false,
      fallbackHideComparableValue: true,
    })
  })

  it('omits pricing flags when values are strings or numbers instead of booleans', () => {
    const stringValue = 'true'
    expect(
      resolveCategoryPricingFlags({
        cleanStateDisplayDiscountPercentage: stringValue,
        fallbackHideDiscountRate: stringValue,
        fallbackHideComparableValue: stringValue,
      })
    ).toEqual({})

    const numberValue = 1
    expect(
      resolveCategoryPricingFlags({
        cleanStateDisplayDiscountPercentage: numberValue,
        fallbackHideDiscountRate: numberValue,
        fallbackHideComparableValue: numberValue,
      })
    ).toEqual({})
  })
})
