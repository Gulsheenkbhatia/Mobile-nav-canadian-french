import {
  fetchAddProductToTempBasket,
  fetchValidateMerchant,
  fetchUpdateShippingMethod,
  fetchUpdateShippingAddress,
  fetchSubmitOrder,
  getShippingAddressDataFromEvent,
  getShippingMethodDataFromEvent,
  logError,
  getSubmitOrderData,
  redirectAsFormSubmission,
  addErrorOnPdp,
  getPaymentSheetErrorProps,
  getEventLabel,
} from 'toro/components/PaymentWidget/helpers'
import Core from '@adyen/adyen-web/dist/types/core'
import ApplePayElement from '@adyen/adyen-web/dist/types/components/ApplePay/ApplePay'
import {
  ApplePayCheckoutState,
  UpdateStateProps,
  OnClickHandler,
  OnOpenHandler,
  ApplePayErrorInfo,
} from 'toro/components/PaymentWidget/types'

type InitializeApplePayProps = {
  checkout: Core
  showApplePayButton: (ApplePayElement, boolean) => void
  validationURL: string
  productIdRef: React.RefObject<string>
  selectedQtyRef: React.RefObject<number>
  state: ApplePayCheckoutState
  updateState: (props: UpdateStateProps) => void
  cleanupBasket: () => Promise<void>
  onClickRef: React.RefObject<OnClickHandler>
  onOpenRef: React.RefObject<OnOpenHandler>
  setApplePayErrorOnPdp: (error: ApplePayErrorInfo | null) => void
  handleApplePayErrorAnalytics
  promoCouponCodeRef: React.RefObject<string | null>
}

export default async function initializeApplePay({
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
}: InitializeApplePayProps) {
  const applepay = checkout.create('applepay', {
    requiredBillingContactFields: ['postalAddress', 'name'],
    requiredShippingContactFields: ['postalAddress', 'name', 'phone', 'email'],
    onClick: async (resolve, reject) => {
      const success = onClickRef.current?.()
      if (!success) {
        reject()
        return
      }
      const {
        isError,
        data,
        error: errorResponse,
        status,
      } = await fetchAddProductToTempBasket(
        productIdRef.current,
        selectedQtyRef.current,
        promoCouponCodeRef.current
      )
      if (isError) {
        setApplePayErrorOnPdp(addErrorOnPdp(errorResponse))
        const eventLabel = getEventLabel(errorResponse, status)
        handleApplePayErrorAnalytics(eventLabel)
        logError(errorResponse, 'Create basket and add product')
        reject(errorResponse?.errorMessage)
        return
      } else {
        updateState({ basket: data?.basket })
        resolve()
      }
    },
    onValidateMerchant: async (resolve, reject) => {
      const {
        isError,
        data,
        error: errorResponse,
        status,
      } = await fetchValidateMerchant(validationURL)
      if (isError) {
        setApplePayErrorOnPdp(addErrorOnPdp(errorResponse))
        const eventLabel = getEventLabel(errorResponse, status)
        handleApplePayErrorAnalytics(eventLabel)
        logError(errorResponse, 'Merchant validation')
        await cleanupBasket()
        reject(errorResponse?.errorMessage)
        return
      } else {
        onOpenRef.current?.()
        updateState({ companyName: data?.session?.displayName })
        resolve(data?.session)
      }
    },
    onShippingContactSelected: async (resolve, reject, event) => {
      const shippingAddressData = getShippingAddressDataFromEvent(event)

      const {
        isError,
        data,
        error: errorResponse,
        status,
      } = await fetchUpdateShippingAddress(state.basketId, state.shipmentId, shippingAddressData)
      if (isError) {
        const eventLabel = getEventLabel(errorResponse, status)
        handleApplePayErrorAnalytics(eventLabel)
        logError(errorResponse, 'Update shipping address')
        const paymentSheetErrorProps = getPaymentSheetErrorProps(errorResponse, state)
        if (paymentSheetErrorProps) {
          resolve(paymentSheetErrorProps)
          return
        }
        setApplePayErrorOnPdp(addErrorOnPdp(errorResponse))
        reject(errorResponse?.errorMessage)
        return
      } else {
        updateState({ basket: data?.basket, shippingMethods: data?.shippingMethods })
        const newApplePayProps = {
          newShippingMethods: state.shippingMethods,
          newLineItems: state.lineItems,
          newTotal: state.total,
        }
        resolve(newApplePayProps)
      }
    },
    onShippingMethodSelected: async (resolve, reject, event) => {
      const shippingMethodData = getShippingMethodDataFromEvent(event, state)
      const {
        isError,
        data,
        error: errorResponse,
        status,
      } = await fetchUpdateShippingMethod(state.basketId, state.shipmentId, shippingMethodData)
      if (isError) {
        setApplePayErrorOnPdp(addErrorOnPdp(errorResponse))
        const eventLabel = getEventLabel(errorResponse, status)
        handleApplePayErrorAnalytics(eventLabel)
        logError(errorResponse, 'Update shipping method')
        reject(errorResponse?.errorMessage)
        return
      } else {
        updateState({ basket: data?.basket })
        const newApplePayProps = {
          newTotal: state.total,
          newLineItems: state.lineItems,
        }
        resolve(newApplePayProps)
      }
    },
    onAuthorized: async (resolve, reject, event) => {
      const submitOrderData = getSubmitOrderData(event)
      const {
        isError,
        data,
        error: errorResponse,
        status,
      } = await fetchSubmitOrder(state.basketId, state.shipmentId, submitOrderData)

      if (isError) {
        const eventLabel = getEventLabel(errorResponse, status)
        handleApplePayErrorAnalytics(eventLabel)
        logError(errorResponse, 'Submit order')
        const paymentSheetErrorProps = getPaymentSheetErrorProps(errorResponse, state)
        if (paymentSheetErrorProps) {
          resolve(paymentSheetErrorProps)
          return
        }
        setApplePayErrorOnPdp(addErrorOnPdp(errorResponse))
      } else {
        const { redirectUrl } = data || {}
        if (redirectUrl) {
          resolve()
          redirectAsFormSubmission(redirectUrl)
          return
        }
      }
      reject()
    },
    buttonType: 'plain',
    buttonColor: 'white-with-line',
  }) as unknown as ApplePayElement

  try {
    const isApplePayAvailable = await applepay.isAvailable()
    showApplePayButton(applepay, isApplePayAvailable)
  } catch (e) {
    showApplePayButton(applepay, false)
  }
}
