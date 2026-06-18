import get from 'lodash/get'

export const getPrices = (priceData, isOnSale, promotionData) => {
  const priceRange = getPromotionDataPriceRange(promotionData)
  return {
    currentPrice: get(priceData, 'sales.value'),
    regularPrice: get(priceData, 'list.value'),
    priceRange,
    isOnSale,
    discount: priceData.discountPercentage,
  }
}

export const getPromotionDataPriceRange = (promotionData) => {
  if (promotionData) {
    return null
  }
  return promotionData?.maxPrice &&
    promotionData?.minPrice &&
    promotionData?.maxPrice !== promotionData?.minPrice
    ? { maxPrice: promotionData?.maxPrice, minPrice: promotionData?.minPrice }
    : null
}
