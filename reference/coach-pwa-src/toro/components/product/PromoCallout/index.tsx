import { useAtomValue } from 'jotai/utils'
import { promoCalloutsPDPAtom } from 'store/pdp.atom'
import getPromoByType, { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import useProductData from 'toro/hooks/useProductData'

type PromoType = keyof typeof PROMO_TYPES

type PromoCalloutProps = {
  promoType?: PromoType
  variant?: string
}

const PromoCallout = ({ promoType, variant = 'pdpV4Rotation' }: PromoCalloutProps) => {
  const promoArr = useAtomValue(promoCalloutsPDPAtom)
  const masterId = useProductData('masterId')

  if (!promoType) return null

  const promoContent = getPromoByType(promoArr, promoType)
  if (!promoContent?.length) return null

  return <CallOutMessage promoText={promoContent} masterId={masterId} variant={variant} />
}
export default PromoCallout
