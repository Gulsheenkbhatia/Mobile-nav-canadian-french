import AdyenCheckout from '@adyen/adyen-web'
import {
  fetchPaymentMethods,
  fetchRemoveCart,
  getNewState,
  logError,
} from 'toro/components/PaymentWidget/helpers'
import initializeApplePay from 'toro/components/PaymentWidget/initializeApplePay'
import { ApplePayCheckoutState, UpdateStateProps } from 'toro/components/PaymentWidget/types'

export default async function initializeCheckout({
  Adyen_ClientKey,
  Adyen_Mode,
  locale,
  showApplePayButton,
  validationURL,
  productIdRef,
  storedPaymentMethods,
  setStoredPaymentMethods,
  selectedQtyRef,
  onClickRef,
  onOpenRef,
  onCloseByUser,
  setApplePayErrorOnPdp,
  handleApplePayErrorAnalytics,
  promoCouponCodeRef,
  onInitError,
}) {
  try {
    let paymentMethods = storedPaymentMethods
    if (!paymentMethods) {
      const { isError, data, error } = await fetchPaymentMethods()
      if (isError) {
        logError(error, 'Fetch payment methods')
        onInitError(error)
        return {}
      } else {
        paymentMethods = data
      }

      setStoredPaymentMethods(paymentMethods)
    }

    const state: ApplePayCheckoutState = {}

    const mutateState = (newState) => {
      Object.keys(newState).forEach((key) => {
        state[key] = newState[key]
      })
    }

    const updateState = (props: UpdateStateProps) => {
      const newState = getNewState(props, state)
      mutateState(newState)
    }

    const cleanupBasket = async () => {
      if (!state.basketId) {
        return
      }
      const { isError, error } = await fetchRemoveCart(state.basketId)
      if (isError) {
        logError(error, 'Remove basket')
        return
      } else {
        state.basketId = null
      }
    }

    const checkout = await AdyenCheckout({
      clientKey: Adyen_ClientKey,
      locale,
      environment: process.env.ADYEN_MODE || Adyen_Mode || 'test',
      onSubmit: () => {},
      onAdditionalDetails: () => {},
      showPayButton: true,
      onError: (error) => {
        console.log(error)
        cleanupBasket()
        // TODO we need to check if it's possible to identify if modal was closed by other or as a result of some error
        onCloseByUser()
      },
      paymentMethodsResponse: paymentMethods,
    })

    initializeApplePay({
      checkout,
      showApplePayButton,
      validationURL,
      productIdRef,
      selectedQtyRef,
      state,
      updateState,
      cleanupBasket,
      onClickRef,
      onOpenRef,
      setApplePayErrorOnPdp,
      handleApplePayErrorAnalytics,
      promoCouponCodeRef,
    })

    return {
      updateTotalPrice: (value, currency) => {
        checkout.update({
          amount: {
            currency: currency,
            value: value * 100,
          },
        })
        state.total = {
          label: 'TAPESTRY, INC.',
          amount: `${value * 100}`,
        }
      },
    }
  } catch (e) {
    onInitError(e)
    return {}
  }
}
