export const PROMO_TYPES = {
  UPL: 'UPL',
  IPX1: 'IPX1',
  IPX2: 'IPX2',
  IPX3: 'IPX3',
  RB: 'RB',
} as const

const VALID_PROMO_TYPES = ['IPX1', 'IPX2', 'IPX3', 'RB']

export const PROMO_TEMPLATES = {
  V3: 'V3',
} as const

export const PROMO_CALLOUT_FIELDS = {
  IPX1: 'promoCalloutPdpIpx1',
  IPX2: 'promoCalloutPdpIpx2',
  IPX3: 'promoCalloutPdpIpx3',
  RB: 'promoCalloutPdpRB',
  UPL: 'promoCalloutPdpUpl',
} as const

type PromoTypes = keyof typeof PROMO_TYPES
type PromoTemplates = keyof typeof PROMO_TEMPLATES

const getPromoByType = (promos, promoType: PromoTypes, promoTemplate?: PromoTemplates) => {
  if (!promos?.length || !promoType) return []
  const promosByType = promos?.filter(
    (promo) => promo['call-out-message']?.content?.promo?.type === PROMO_TYPES[promoType]
  )

  return promosByType
}

export const getPromoByTypeFromSeparateFields = (promotionalCallouts, promoType: PromoTypes) => {
  if (!promotionalCallouts || !promoType) return []

  const fieldName = PROMO_CALLOUT_FIELDS[promoType]
  if (!fieldName) return []

  const promoContent = promotionalCallouts[fieldName]
  if (!promoContent || promoContent === '') return []

  return [promoContent]
}

export const getAllValidTypePromos = (promoArr = []) => {
  const promos = promoArr.reduce((acc, promo) => {
    const content = promo?.['call-out-message']?.content
    if (!content) return acc

    const type = content?.promo?.type
    if (!VALID_PROMO_TYPES.includes(type)) return acc

    let text = content?.OTDPrice
    if (typeof text !== 'string' || text.trim() === '') return acc

    acc.push({ type, text })
    return acc
  }, [])

  return promos
}

export default getPromoByType
