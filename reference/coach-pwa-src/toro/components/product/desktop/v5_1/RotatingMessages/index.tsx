import { FC, memo } from 'react'
import { useAtomValue } from 'jotai/utils'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import compact from 'lodash/compact'
import usePreference from 'toro/hooks/usePreference_new'
import KlarnaWidget from 'toro/components/product/KlarnaWidget'
import AfterpayWidget from 'toro/components/AfterPay/AfterpayWidget'
import AffirmWidget from 'toro/components/Affirm/AffirmWidget'
import ShippingAndReturnsWidget from 'toro/components/product/TabbedPDP/ShippingAndReturnsWidget'
import { finalSaleShippingAtom } from 'store/pdp.atom'
import useAffirmEligibility from 'toro/hooks/useAffirmEligibility'
import Box from 'toro/components/Box'
import { useMultiStyleConfig } from '@chakra-ui/react'
import useMarquee from 'toro/components/product/desktop/v5_1/RotatingMessages/useMarquee'

const RotatingMessages: FC = () => {
  const styles = useMultiStyleConfig('RotatingMessages')
  const { finalSaleText, shippingBody } = useAtomValue(finalSaleShippingAtom)
  const shouldShowAffirm = useAffirmEligibility()
  const {
    klarnaPayments: { enableKlarna = false },
    afterPay: { enableAfterpay = false },
  } = usePreference({
    Klarna_Payments: ['enableKlarna'],
    afterPay: ['enableAfterpay'],
    affirm: ['AffirmOnline', 'AffirmProductMessage'],
  })
  const { wrapperRef, trackRef, enableAnimation } = useMarquee()

  const widgets = compact([
    enableKlarna && <KlarnaWidget key="klarnaWidget" skeletonProps={{ h: '18px', w: '274px' }} />,
    enableAfterpay && <AfterpayWidget key="afterpayWidget" />,
    shouldShowAffirm && <AffirmWidget variant="pdpv5" />,
    finalSaleText && (
      <ShippingAndReturnsWidget
        key="shippingReturnsWidget"
        finalSaleText={finalSaleText}
        shippingBody={shippingBody}
      />
    ),
  ])

  if (!widgets.length) return null

  return (
    <Box data-qa="bnplExperience" sx={styles.marqueeBox} ref={wrapperRef}>
      <Box sx={styles.marqueeTrack} ref={trackRef} className={enableAnimation ? 'animate' : null}>
        {widgets.map((message, index) => (
          <Box sx={styles.marqueeItem} key={index}>
            {message}
          </Box>
        ))}
        {/* To ensure the infinite animation runs correctly without any gaps, these duplicates are required. */}
        {enableAnimation &&
          widgets.map((message, index) => (
            <Box sx={styles.marqueeItem} key={`duplicate-${index}`} aria-hidden="true">
              {message}
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default withErrorBoundaryWrapper(memo(RotatingMessages))
