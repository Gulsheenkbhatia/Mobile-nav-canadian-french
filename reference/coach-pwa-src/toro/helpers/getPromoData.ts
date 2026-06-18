import get from 'lodash/get'

const getPromoDataWithMaxLimit = (activeProduct, activeColorId, maxPromoCalloutsDisplayPLP) => {
  const promoPLP = getPromoData(activeProduct, activeColorId)
  // Initial loading has an array in promoPLP
  // After swatch selection promoP LP will have promoCallOut - array of promos
  if (maxPromoCalloutsDisplayPLP) {
    if (Array.isArray(promoPLP)) {
      return promoPLP.slice(0, maxPromoCalloutsDisplayPLP)
    }
    if (Array.isArray(promoPLP?.promoCallOut)) {
      return promoPLP?.promoCallOut.slice(0, maxPromoCalloutsDisplayPLP)
    }
  }
  return promoPLP
}
const getPromoData = (activeProduct = {}, activeColorId = '') => {
  const promoPLP = get(activeProduct, 'promoPLP')
  if (promoPLP) {
    return promoPLP
  }

  const variants = get(activeProduct, 'variant', [])

  const [activeVariant] = variants.filter(
    (variant) => variant?.variationValues?.color == activeColorId
  )

  const promoData = get(activeVariant, 'promoPLP.promoCallOut', [])

  return activeColorId
    ? promoData?.filter((promo) => {
        const text = get(promo, '["call-out-message"].content.text')
        const spanText = get(promo, '["call-out-message"].content.spanText')
        return !!text || !!spanText
      })
    : /** Technical Debt: block below is a hot fix. Need to find the root cause why promoPLP has wrong format from /api/get-product-data call*/
      get(activeProduct, 'promoPLP', get(activeProduct, 'promoPLP.promoCallOut'))
}

export default getPromoDataWithMaxLimit
