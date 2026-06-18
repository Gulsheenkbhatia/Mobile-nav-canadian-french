import get from 'lodash/get'

export const appendQuantityToProducts = (products) => {
  const productMap = {}
  products.forEach(function (product) {
    const productKey = product?.storeName
      ? `${product.product_id} ${product.storeName}`
      : product.product_id
    productMap[productKey] = productMap[productKey]
      ? {
          ...product,
          quantity: productMap[productKey]?.quantity + product.quantity,
        }
      : product
  })
  return Object.values(productMap)
}

const getBodyStyles = () => {
  return {
    overflow: 'hidden',
    margin: `0 ${window.innerWidth - document.documentElement.clientWidth}px 0 0`,
    padding: 0,
    position: 'relative',
  }
}

export const applyBodyStyles = () => {
  const bodyStyles = getBodyStyles()
  for (const key of Object.keys(bodyStyles)) {
    document.body.style[key] = bodyStyles[key]
  }
}

export const revertBodyStyles = () => {
  const bodyStyles = getBodyStyles()
  for (const key of Object.keys(bodyStyles)) {
    document.body.style[key] = ''
  }
}

export const hasPromotion = (item, cart) => {
  if (
    get(item, 'master.customAttributes.c_isGiftCardProduct') ||
    get(item, 'variant[0].customAttributes.c_isGiftCardProduct')
  ) {
    return false
  }
  return (
    get(item, 'pickedProps.promotionData.promostatus') === 'Product Promotion exists' ||
    (get(cart, 'coupon_items', []).some((item) => item?.status_code === 'applied') &&
      get(item, 'miniCartPromoText', []).length > 0) ||
    !!get(item, 'basketInfo.price_adjustments', []).length
  )
}

export const getTotalQty = (productItems = []) =>
  productItems.reduce((acc, p) => {
    if (get(p, 'c_customizerParentId')) {
      return acc
    }

    return acc + p.quantity
  }, 0)

export function getRegularPriceToRender({
  regularPrice,
  discountedPrice,
  regularPriceFromBasket,
  discountedPriceFromBasket,
  isOutlet,
}) {
  if (!isOutlet) {
    if (
      regularPrice !== undefined &&
      discountedPrice !== undefined &&
      regularPrice !== discountedPrice
    ) {
      return regularPrice
    }
  } else if (
    regularPriceFromBasket !== undefined &&
    discountedPriceFromBasket !== undefined &&
    discountedPriceFromBasket !== regularPriceFromBasket
  ) {
    // DIGIT-2323
    return regularPriceFromBasket
  }

  return
}
