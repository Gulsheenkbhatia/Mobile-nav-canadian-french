import { useAtomValue } from 'jotai/utils'
import type { FC } from 'react'
import { promoCalloutsPDPAtom } from 'store/pdp.atom'
import getPromoByType, { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import get from 'lodash/get'
import useProductData from 'toro/hooks/useProductData'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

const PriceCallout: FC = () => {
  const promoArr = useAtomValue(promoCalloutsPDPAtom)
  const masterId = useProductData('masterId')
  const isPDPv6 = useTemplate([TemplateName.pdpv6])

  const ipx1Slot = getPromoByType(promoArr, PROMO_TYPES.IPX1)
  const isOTDPricePromo = ipx1Slot?.filter((promo) =>
    get(promo, '[call-out-message].content.promo.hasOTDPrice', false)
  )
  if (ipx1Slot?.length === 0 || (!isPDPv6 && !isOTDPricePromo?.length)) return null

  return (
    <CallOutMessage
      promoText={isPDPv6 ? ipx1Slot : isOTDPricePromo}
      masterId={masterId}
      variant="pdpV4Rotation"
    />
  )
}
export default PriceCallout
