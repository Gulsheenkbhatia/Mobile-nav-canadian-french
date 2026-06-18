import React, { useCallback, useEffect, useRef, memo } from 'react'
import Box from 'toro/components/Box'
import initializeCheckout from 'toro/components/PaymentWidget/initializeCheckout'
import { useIntl } from 'react-intl'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import noop from 'lodash/noop'
import {
  adyenPaymentMethodsAtom,
  alterCtaToShowAtom,
  AlterCtaToShow,
  setApplePayErrorOnPdpAtom,
} from 'store/pdp.atom'
import { useAtom } from 'jotai'
import { OnClickHandler, OnOpenHandler } from 'toro/components/PaymentWidget/types'
import { useUpdateAtom } from 'jotai/utils'
import useAnalytics from 'toro/analytics/useAnalytics'

import '@adyen/adyen-web/dist/es/adyen.css'

type PaymentWidgetProps = {
  variant?: string
  productIdRef: React.RefObject<string>
  totalPrice: number
  selectedQtyRef: React.RefObject<number>
  onClickRef: React.RefObject<OnClickHandler>
  onOpenRef: React.RefObject<OnOpenHandler>
  disabled: boolean
  promoCouponCodeRef: React.RefObject<string>
  isPdpV5?: boolean
  currency: string
}

const PaymentWidget = ({
  variant,
  productIdRef,
  totalPrice,
  selectedQtyRef,
  onClickRef,
  onOpenRef,
  disabled = false,
  promoCouponCodeRef,
  isPdpV5 = false,
  currency,
}: PaymentWidgetProps) => {
  let { locale } = useIntl()
  locale = locale.replace('_', '-')
  const {
    applePayConfigs: { appleValidationURL: validationURL, Adyen_Mode, Adyen_ClientKey },
  } = usePreference({
    applePayConfigs: ['appleValidationURL', 'Adyen_Mode', 'Adyen_ClientKey'],
  })
  const themeComponentName = isPdpV5 ? 'AddToBagArea' : 'ProductDetailMainSection'
  const styles = useMultiStyleConfig(themeComponentName, {
    variant,
  })
  const rootNode = useRef(null)
  const applePayButtonRef = useRef(null)
  const updateTotalPriceRef = useRef(noop)
  const [adyenPaymentMethods, setAdyenPaymentMethods] = useAtom(adyenPaymentMethodsAtom)
  const setAlterCtaToShowAtom = useUpdateAtom(alterCtaToShowAtom)
  const analytics = useAnalytics()
  const setApplePayErrorOnPdp = useUpdateAtom(setApplePayErrorOnPdpAtom)

  const showApplePayButton = useCallback((applepay, isApplePayAvailable) => {
    if (!rootNode.current || !applePayButtonRef?.current) {
      return
    }
    if (!applepay || !isApplePayAvailable) {
      setAlterCtaToShowAtom(AlterCtaToShow.BUYNOW)
      return
    }
    rootNode.current?.classList.remove('merchant-checkout__payment-method--hidden')
    applepay?.mount(applePayButtonRef.current)
    setAlterCtaToShowAtom(AlterCtaToShow.APPLEPAY)
  }, [])

  const onInitError = useCallback((e) => {
    console.warn(e)
    setAlterCtaToShowAtom(AlterCtaToShow.BUYNOW)
  }, [])

  const onCloseByUser = useCallback(() => {
    analytics.send('productInteraction', {
      event: 'product_interaction',
      eventAction: 'apple pay pdp cta interaction',
      eventLabel: 'modal close',
      eventLocation: 'apple pay modal',
    })
  }, [])

  const handleApplePayErrorAnalytics = useCallback((eventLabel) => {
    analytics.send('siteError', {
      eventLocation: 'apple pay modal',
      eventAction: 'apple pay',
      eventLabel: eventLabel,
      eventPageLocation: 'product',
    })
  }, [])

  const onClickHandler = (e) => {
    const applePayButtonElement = rootNode?.current?.querySelector('button')
    if (e?.target !== applePayButtonElement) {
      applePayButtonElement?.click()
    }
  }

  useEffect(() => {
    if (totalPrice) {
      updateTotalPriceRef.current?.(totalPrice, currency)
    }
  }, [totalPrice, currency])

  useEffect(() => {
    if (!Adyen_ClientKey) {
      return
    }
    async function init() {
      const { updateTotalPrice } = await initializeCheckout({
        Adyen_ClientKey,
        Adyen_Mode,
        locale,
        showApplePayButton,
        validationURL,
        productIdRef,
        selectedQtyRef,
        storedPaymentMethods: adyenPaymentMethods,
        setStoredPaymentMethods: setAdyenPaymentMethods,
        onClickRef,
        onOpenRef,
        onCloseByUser,
        setApplePayErrorOnPdp,
        handleApplePayErrorAnalytics,
        promoCouponCodeRef,
        onInitError,
      })
      updateTotalPriceRef.current = updateTotalPrice
      if (totalPrice) {
        updateTotalPriceRef.current?.(totalPrice, currency)
      }
    }
    init()
  }, [])

  if (!Adyen_ClientKey) {
    return null
  }

  return (
    <Box
      sx={styles.applePayWrapper}
      pointerEvents={disabled ? 'none' : 'auto'}
      className={`applePayContainer ${disabled ? 'applePayContainer-disabled' : ''}`}
    >
      <Box
        className="merchant-checkout__payment-method merchant-checkout__payment-method--hidden"
        id="applepay"
        width="100%"
        ref={rootNode}
        onClick={onClickHandler}
        data-qa="apple_pay_cta"
      >
        <Box className="merchant-checkout__payment-method__details">
          <Box
            className="applepay-field"
            data-qa="add_applepay-field_pdt_img"
            ref={applePayButtonRef}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default memo(PaymentWidget)
