import React, { useMemo } from 'react'

import compact from 'lodash/compact'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import { useAtomValue } from 'jotai/utils'
import useProductData from 'toro/hooks/useProductData'
import { promoCalloutsPDPAtom } from 'store/pdp.atom'
import getPromoByType, { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import SplideSlider from 'toro/components/SplideSlider'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const PromoRotationBanner = () => {
  const masterId = useProductData('masterId')
  const promoArr = useAtomValue(promoCalloutsPDPAtom)
  const promoContent = getPromoByType(promoArr, PROMO_TYPES.RB)
  const styles = useMultiStyleConfig('PromoRotationBanner')

  const rotationMessages = useMemo(() => {
    return compact(
      promoContent.map((promo, index) => (
        <CallOutMessage
          key={`${promo?.['call-out-message']?.content?.promo?.type}-${index}`}
          promoText={[promo]}
          masterId={masterId}
        />
      ))
    )
  }, [promoContent, masterId])
  if (!rotationMessages?.length) return null

  if (rotationMessages?.length === 1) {
    return <Box sx={styles.container}>{rotationMessages}</Box>
  }

  return (
    <SplideSlider
      options={{
        type: 'slide',
        fixedWidth: '84%', // to match figma design
        gap: 'var(--spacing-3)',
        arrows: false,
        pagination: false,
        rewind: false,
      }}
      styles={{
        container: styles.sliderContainer,
      }}
    >
      {rotationMessages}
    </SplideSlider>
  )
}

export default PromoRotationBanner
