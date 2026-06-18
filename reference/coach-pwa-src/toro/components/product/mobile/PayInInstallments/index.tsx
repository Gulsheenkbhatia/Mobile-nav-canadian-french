import React, { FC } from 'react'
import compact from 'lodash/compact'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import KlarnaWidget from 'toro/components/product/KlarnaWidget'
import AfterpayWidget from 'toro/components/AfterPay/AfterpayWidget'
import AffirmWidget from 'toro/components/Affirm/AffirmWidget'
import usePayInInstallments from 'toro/hooks/usePayInInstallments'
import PayInInstallmentsButton from 'toro/components/product/mobile/PayInInstallments/PayInInstallmentsButton'
import PayInInstallmentsPopUp from 'toro/components/product/mobile/PayInInstallments/PayInInstallmentsPopUp'
import useDisclosure from 'toro/hooks/useDisclosure'
import StylesProvider from 'toro/components/StylesProvider'

const PayInInstallments: FC = () => {
  const styles = useStyleConfig('PayInInstallments')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { enableKlarna, enableAfterpay, shouldShowAffirm, minInstallmentPrice, isLoadingPrices } =
    usePayInInstallments()

  const widgets = compact([
    enableKlarna && <KlarnaWidget key="klarnaWidget" skeletonProps={{ h: '18px', w: '300px' }} />,
    enableAfterpay && <AfterpayWidget key="afterpayWidget" />,
    shouldShowAffirm && <AffirmWidget />,
  ])

  if (!widgets?.length) {
    return null
  }

  if (!isLoadingPrices && !minInstallmentPrice) {
    return null
  }

  return (
    <StylesProvider value={styles}>
      <PayInInstallmentsButton
        onClick={onOpen}
        isLoading={isLoadingPrices}
        minInstallmentPrice={minInstallmentPrice}
      />
      <PayInInstallmentsPopUp isOpen={isOpen} onClose={onClose}>
        {widgets}
      </PayInInstallmentsPopUp>
    </StylesProvider>
  )
}

export default PayInInstallments
