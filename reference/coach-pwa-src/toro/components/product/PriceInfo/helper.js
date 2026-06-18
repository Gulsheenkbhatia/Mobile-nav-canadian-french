import get from 'lodash/get'

export const promotionalPricingData = (productData, isPlp = false) => {
  const pricingDataPlpConfig = {
    promotionalPricePath: 'promotionPrice',
    defaultVariantPath: 'defaultVariantData',
    defaultVariantGroupPath: 'defaultVariationGroupData',
  }
  const pricingDataConfig = {
    promotionalPricePath: 'pricingInfo',
    defaultVariantPath: 'defaultVariant',
    defaultVariantGroupPath: 'defaultVariantGroup',
  }
  const config = isPlp ? pricingDataPlpConfig : pricingDataConfig
  return retrievePromotionalPriceData(productData, config)
}

const retrievePromotionalPriceData = (productData, config) => {
  if (get(productData, `${config.promotionalPricePath}.0.promotionalPrice`)) {
    return extractPricingData(productData, config.promotionalPricePath)
  }
  if (
    get(
      productData,
      `${config.defaultVariantPath}.${config.promotionalPricePath}.0.promotionalPrice`
    )
  ) {
    return extractPricingData(
      productData,
      `${config.defaultVariantPath}.${config.promotionalPricePath}`
    )
  }
  if (
    get(
      productData,
      `${config.defaultVariantGroupPath}.${config.promotionalPricePath}.0.promotionalPrice`
    )
  ) {
    return extractPricingData(
      productData,
      `${config.defaultVariantGroupPath}.${config.promotionalPricePath}`
    )
  }
  return extractPricingData(productData)
}

const extractPricingData = (productData, path) => {
  if (path) {
    return {
      disPercent: get(productData, `${path}.0.discountPercentage`),
      prices: get(productData, `${path}.0.promotionalPrice`),
      markdownDiscPercent: get(productData, `${path}.0.markdownDiscPercent`),
      promotionDiscPercent: get(productData, `${path}.0.promotionDiscPercent`),
    }
  }
  return {
    disPercent: null,
    prices: null,
    markdownDiscPercent: null,
    promotionDiscPercent: null,
  }
}
