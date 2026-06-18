import React, { FC } from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import compact from 'lodash/compact'
import usePreference from 'toro/hooks/usePreference_new'
import KlarnaWidget from 'toro/components/product/KlarnaWidget'
import AfterpayWidget from 'toro/components/AfterPay/AfterpayWidget'
import AffirmWidget from 'toro/components/Affirm/AffirmWidget'
import useAffirmEligibility from 'toro/hooks/useAffirmEligibility'
import HorizontalRotatingBanner from 'toro/components/product/TabbedPDP/RotatingBanner/HorizontalRotatingBanner'

const RotationPayInInstallments: FC = () => {
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
    shouldShowAffirm && <AffirmWidget />,
  ])

  return <HorizontalRotatingBanner rotationMessages={widgets} isPaused={false} />
}

export default withErrorBoundaryWrapper(React.memo(RotationPayInInstallments))
