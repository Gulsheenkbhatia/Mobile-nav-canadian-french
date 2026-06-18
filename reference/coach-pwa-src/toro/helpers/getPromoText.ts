import get from 'lodash/get'
import { NormalizedPromoData } from 'toro/types/productTypes'

interface IGetPromoText {
  (
    promoData: NormalizedPromoData,
    isProductSet: boolean,
    maxPromoCalloutsDisplayPLP: number
  ): NormalizedPromoData[]
}

const getPromoText: IGetPromoText = (promoData, isProductSet, maxPromoCalloutsDisplayPLP) => {
  const promoCallOutData = get(promoData, 'promoCallOut', [])

  if (isProductSet) {
    return promoCallOutData
  }
  return promoCallOutData.slice(0, maxPromoCalloutsDisplayPLP).filter((promo) => {
    const text = get(promo, '["call-out-message"].content.text')
    const spanText = get(promo, '["call-out-message"].content.spanText')
    return !!text || !!spanText
  })
}

export default getPromoText
