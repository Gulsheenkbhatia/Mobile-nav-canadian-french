import React, { useMemo } from 'react'

import RotatingBanner from 'toro/components/product/TabbedPDP/RotatingBanner'
import compact from 'lodash/compact'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import { useAtomValue } from 'jotai/utils'
import { rotationPromoMessagesAtom } from 'store/pdp.atom'
import useProductData from 'toro/hooks/useProductData'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Flex from 'toro/components/Flex'

const PromoRotationBanner = () => {
  const styles = useMultiStyleConfig('PromoRotationBanner')
  const masterId = useProductData('masterId')

  const promoArr = useAtomValue(rotationPromoMessagesAtom)

  const rotationMessages = useMemo(() => {
    if (promoArr.length > 0) {
      const messages = promoArr.map((promo, index) => (
        <CallOutMessage
          key={`${promo?.['call-out-message']?.content?.promo?.type}-${index}`}
          promoText={[promo]}
          masterId={masterId}
          variant="pdpV5"
        />
      ))
      return compact(messages)
    }

    return []
  }, [promoArr])

  return (
    <Flex sx={styles.promoRotationBanner} className="promo-rotation-banner-wrapper">
      <RotatingBanner rotationMessages={rotationMessages} isPaused={false} />
    </Flex>
  )
}

export default PromoRotationBanner
