import get from 'lodash/get'

const getProductPricesFromVg = (product, colorId) => {
  const isBundleProduct = get(product, 'isProductSet', null)
  if (isBundleProduct) {
    const bundlePrice = get(product, 'promotionPrice[0]')
    const salePrice = get(bundlePrice, 'sales.formatted', null)
    const listPrice = get(bundlePrice, 'list.formatted', null)
    const discountPercentage = get(bundlePrice, 'discountPercentage', null)
    const isSalePrice = salePrice && salePrice !== 'N/A'
    return {
      value: isSalePrice ? salePrice : listPrice,
      discount: discountPercentage,
      comparable: listPrice,
      strikeoff: isSalePrice ? listPrice : null,
    }
  }
  const activeVariant = colorId
    ? product?.variationGroup?.find?.((item) => item?.color === colorId)
    : product?.variationGroup?.find?.((item) => item?.color === product?.defaultColor?.id)

  const prices = get(activeVariant, 'variantPrice[0]')
  const salePrice = get(prices, 'sales.formatted', null)
  const listPrice = get(prices, 'list.formatted', null)
  const discountPercentage = get(prices, 'discountPercentage', null)
  return {
    value: salePrice,
    discount: discountPercentage,
    comparable: listPrice,
    strikeoff: listPrice,
  }
}

export default getProductPricesFromVg
