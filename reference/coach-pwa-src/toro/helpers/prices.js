import get from 'lodash/get'

export const getPrices = (data) => {
  const tieredPrices = get(data, 'tieredPrices', [])
  const { regular: regularPrice } = getPricebookPrices(tieredPrices)
  const currentPrice = data.price
  const isOnSale = data.c_isOnSale // may not be present for variants
  let discount = 0
  if (regularPrice !== undefined && currentPrice !== undefined) {
    discount = Math.round(((regularPrice - currentPrice) * 100) / regularPrice) // temporary implementation
  }

  const priceRange = getPromotionDataPriceRange(data)
  return {
    tieredPrices,
    currentPrice,
    regularPrice,
    priceRange,
    isOnSale,
    discount,
  }
}

export const getPromotionDataPriceRange = (data) => {
  if (!data?.promotionData) {
    return null
  }
  const promotionData = data?.sapiFrpData?.promotion
  return promotionData?.maxPrice &&
    promotionData?.minPrice &&
    promotionData?.maxPrice !== promotionData?.minPrice
    ? { maxPrice: promotionData?.maxPrice, minPrice: promotionData?.minPrice }
    : null
}

export const getPricebookPrices = (tieredPrices) => {
  if (!tieredPrices || tieredPrices?.length === 0) {
    return {}
  }

  const regularPricebook = tieredPrices.find((tp) => tp.pricebook?.includes('regular'))
  const salePricebook = tieredPrices.find((tp) => tp.pricebook?.includes('sale'))
  const regularPrice = get(regularPricebook, 'price')
  const salePrice = get(salePricebook, 'price')
  return { regular: regularPrice, sale: salePrice }
}

export const getFormattedPriceFromVariant = (variant) => {
  const price = get(variant, 'variantPrice.0', get(variant, 'pricingInfo.0', {}))
  return (
    get(price, 'promotionalPrice.formatted', 0) ||
    get(price, 'sales.formatted') ||
    get(price, 'list.formatted') ||
    get(variant, 'price') ||
    ''
  )
}

export const getSelectedVariantGroup = (activeProduct) => {
  const vgs = get(activeProduct, 'variationGroup', [])
  return vgs?.find(
    (vgProduct) =>
      vgProduct?.id === activeProduct?.id || vgProduct?.firstVariant === activeProduct?.id
  )
}
