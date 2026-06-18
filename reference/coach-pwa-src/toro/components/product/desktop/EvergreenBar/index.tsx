import React, { FC } from 'react'
import { useAtomValue } from 'jotai/utils'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import compact from 'lodash/compact'
import usePreference from 'toro/hooks/usePreference_new'
import Flex from 'toro/components/Flex'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import KlarnaWidget from 'toro/components/product/KlarnaWidget'
import AfterpayWidget from 'toro/components/AfterPay/AfterpayWidget'
import AffirmWidget from 'toro/components/Affirm/AffirmWidget'
import ShippingAndReturnsWidget from 'toro/components/product/TabbedPDP/ShippingAndReturnsWidget'
import { finalSaleShippingAtom } from 'store/pdp.atom'
import useAffirmEligibility from 'toro/hooks/useAffirmEligibility'

const EvergreenBar: FC = () => {
  const styles = useStyleConfig('EvergreenBar')
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

  const widgets = compact([
    enableKlarna && <KlarnaWidget key="klarnaWidget" skeletonProps={{ h: '18px', w: '300px' }} />,
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

  return (
    <Flex sx={styles.evergreenBarContainer} className="evergreenBar-container">
      {widgets}
    </Flex>
  )
}

export default withErrorBoundaryWrapper(React.memo(EvergreenBar))
