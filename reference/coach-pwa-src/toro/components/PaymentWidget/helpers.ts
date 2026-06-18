import serialize from 'toro/helpers/serialize'
import get from 'lodash/get'
import {
  ApplePayCheckoutState,
  ShippingMethodsOcapiData,
  BasketOcapiData,
  ShippingMethodOcapiData,
  ShippingAddressOcapiData,
  UpdateStateProps,
} from 'toro/components/PaymentWidget/types'
import { ApplePaySessionRequest } from '@adyen/adyen-web/dist/types/components/ApplePay/types'
import PaymentMethodsResponse from '@adyen/adyen-web/dist/types/core/ProcessResponse/PaymentMethodsResponse'
import handleResponse, { HandledResponse } from 'toro/lib/shopper-login/helpers/handleResponse'
import { getToken } from 'toro/lib/shopper-login/helpers/token'
import { ApplePayErrorType } from 'store/pdp.atom'
import withCorrId from 'helpers/traceability'
import isBrowser from 'toro/helpers/isBrowser'

const FINAL_LINE_ITEM_TYPE = 'final' as ApplePayJS.ApplePayLineItemType
const fetchWithCorrId = withCorrId()
export async function fetchPaymentMethods(): Promise<HandledResponse<PaymentMethodsResponse>> {
  const response = await fetchWithCorrId(`/api/adyen/payment-methods`)
  return await handleResponse(response)
}
type FetchAddProductToTempBasketResult = {
  basket: BasketOcapiData
}
export async function fetchAddProductToTempBasket(
  productId: string,
  selectedQty: number,
  promoCouponCode: string | null
): Promise<HandledResponse<FetchAddProductToTempBasketResult>> {
  const { token } = await getToken()
  const productIdProtected = productId.replace(/\//g, '%2F')
  const url = new URL(
    `/api/adyen/add-product/${productIdProtected}?selectedQty=${selectedQty}`,
    window.location.origin
  )
  // Append couponCode only if promoCouponCode contains valid value
  if (promoCouponCode) {
    url.searchParams.set('couponCode', promoCouponCode)
  }
  const response = await fetchWithCorrId(url?.toString(), {
    headers: {
      Authorization: token,
    },
  })
  return await handleResponse(response)
}
type FetchValidateMerchantResult = {
  session: ApplePaySessionRequest
}
export async function fetchValidateMerchant(
  validationURL: string
): Promise<HandledResponse<FetchValidateMerchantResult>> {
  const queryStr = serialize({ validationURL })
  const response = await fetchWithCorrId(`/api/adyen/validate-merchant${queryStr}`)
  return await handleResponse(response)
}

export async function fetchRemoveCart(basketId: string): Promise<HandledResponse<void>> {
  const { token } = await getToken()
  const response = await fetchWithCorrId(`/api/user/remove-cart/${basketId}`, {
    headers: {
      Authorization: token,
    },
  })
  return await handleResponse(response)
}
type FetchUpdateShippingMethodResult = {
  basket: BasketOcapiData
}
export async function fetchUpdateShippingMethod(
  basketId: string,
  shipmentId: string,
  shippingMethodData: ShippingMethodOcapiData
): Promise<HandledResponse<FetchUpdateShippingMethodResult>> {
  const queryStr = serialize({ basketId, shipmentId })
  const { token } = await getToken()
  const response = await fetchWithCorrId(`/api/adyen/update-shipping-method${queryStr}`, {
    method: 'POST',
    headers: {
      Authorization: token,
    },
    body: JSON.stringify(shippingMethodData),
  })
  return await handleResponse(response)
}
type FetchUpdateShippingAddressResult = {
  basket: BasketOcapiData
  shippingMethods: ShippingMethodsOcapiData
}
export async function fetchUpdateShippingAddress(
  basketId: string,
  shipmentId: string,
  shippingAddressData: ShippingAddressOcapiData
): Promise<HandledResponse<FetchUpdateShippingAddressResult>> {
  const queryStr = serialize({ basketId, shipmentId })
  const { token } = await getToken()
  const response = await fetchWithCorrId(`/api/adyen/update-shipping-address${queryStr}`, {
    method: 'POST',
    headers: {
      Authorization: token,
    },
    body: JSON.stringify(shippingAddressData),
  })
  return await handleResponse(response)
}

type FetchSubmitOrderResult = {
  redirectUrl: string
}
export async function fetchSubmitOrder(
  basketId: string,
  shipmentId: string,
  submitOrderData: any
): Promise<HandledResponse<FetchSubmitOrderResult>> {
  const queryStr = serialize({ basketId, shipmentId })
  const { token } = await getToken()
  const response = await fetchWithCorrId(`/api/adyen/submit-order${queryStr}`, {
    method: 'POST',
    headers: {
      Authorization: token,
    },
    body: JSON.stringify(submitOrderData),
  })
  return await handleResponse(response)
}

export function getShippingAddressDataFromEvent(
  event: ApplePayJS.ApplePayShippingContactSelectedEvent
): ShippingAddressOcapiData {
  const data = get(event, 'shippingContact')
  return {
    city: data?.locality,
    country_code: data?.countryCode,
    postal_code: data?.postalCode,
    state_code: data?.administrativeArea,
  }
}

export function getShippingMethodDataFromEvent(event, state) {
  const shippingMethodId = get(event, 'shippingMethod.identifier')
  return (state.shippingMethodsFullData || []).find((method) => method.id === shippingMethodId)
}

const getCountryCodeFromLocale = (locale) => get(locale.split('-'), '1', 'US')

export const getAdyenApiKeyFromPrefs = (locale, generalApiKey, countrySpecificConfig) => {
  const countryCode = getCountryCodeFromLocale(locale)
  return get(countrySpecificConfig, `${countryCode}.x_Key`, generalApiKey)
}

export const getMerchantCodeFromPrefs = (locale, generalMerchantCode, countrySpecificConfig) => {
  const countryCode = getCountryCodeFromLocale(locale)
  return get(countrySpecificConfig, `${countryCode}.merchant_code`, generalMerchantCode)
}

export function getNewState(
  { basket, shippingMethods, companyName }: UpdateStateProps,
  prevState: ApplePayCheckoutState
): ApplePayCheckoutState {
  const newState: ApplePayCheckoutState = {}
  if (basket) {
    newState.basketId = get(basket, 'basket_id')
    newState.shipmentId = get(basket, 'product_items[0].shipment_id')
    newState.basketData = basket

    const currentShippingMethodIfo = get(basket, 'shipments[0].shipping_method')
    const lineItems = [
      {
        label: 'Merchandise',
        amount: `${get(basket, 'product_items[0].price_after_order_discount')}`,
        type: FINAL_LINE_ITEM_TYPE,
      },
      {
        label: `${get(currentShippingMethodIfo, 'name')}`,
        amount: `${get(currentShippingMethodIfo, 'price')}`,
        type: FINAL_LINE_ITEM_TYPE,
      },
    ]
    const taxAmount = get(basket, 'tax_total') || 0
    if (taxAmount) {
      lineItems.push({
        label: 'Tax',
        amount: `${taxAmount}`,
        type: FINAL_LINE_ITEM_TYPE,
      })
    }
    const shippingDiscount = get(basket, 'shipping_items[0].price_adjustments[0].price') || 0
    if (shippingDiscount) {
      lineItems.push({
        label: 'Discounts',
        amount: `${shippingDiscount}`,
        type: FINAL_LINE_ITEM_TYPE,
      })
    }
    newState.lineItems = lineItems

    const totalAmount =
      get(basket, 'order_total', 0) ||
      (get(basket, 'product_total') || 0) +
        (get(basket, 'shipping_total') || 0) +
        (get(basket, 'tax_total') || 0)
    newState.total = {
      label: prevState.companyName || '',
      amount: `${totalAmount}`,
    }
  }

  const availableShippingMethods = get(shippingMethods, 'applicable_shipping_methods')
  if (availableShippingMethods) {
    newState.shippingMethods = availableShippingMethods.map((method) => ({
      label: method.name,
      detail: method.description,
      amount: `${method.price}`,
      identifier: method.id,
    }))
    newState.shippingMethodsFullData = availableShippingMethods
  }
  if (companyName) {
    newState.companyName = companyName
  }

  return newState
}

export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
}

export function isInvalidAddressError(error, type = AddressType.SHIPPING) {
  const reason =
    type === AddressType.SHIPPING ? 'InvalidShippingPostalAddress' : 'InvalidBillingPostalAddress'
  return (
    get(error, 'arguments.statusCode') === 'ERROR' &&
    get(error, 'arguments.statusDetails.reason') === reason
  )
}

export function logError(error, prefix) {
  const errorMessage = error?.message || `An unknown error occurred.`
  console.error(`ApplePay: ${prefix}: ${errorMessage}`, error)
}

function getSubmitOrderAdressData(onAuthorizeEventAddress) {
  return {
    address1: get(onAuthorizeEventAddress, 'addressLines[0]'),
    first_name: onAuthorizeEventAddress.givenName,
    last_name: onAuthorizeEventAddress.familyName,
    phone: onAuthorizeEventAddress.phoneNumber,
    city: onAuthorizeEventAddress.locality,
    country_code: onAuthorizeEventAddress.countryCode,
    postal_code: onAuthorizeEventAddress.postalCode,
    state_code: onAuthorizeEventAddress.administrativeArea,
  }
}

function getSubmitOrderShippingContact(onAuthorizeEventAddress, email) {
  return {
    deliveryAddress: {
      address1: get(onAuthorizeEventAddress, 'addressLines[0]'),
      houseNumberOrName: get(onAuthorizeEventAddress, 'addressLines[1]'),
      city: onAuthorizeEventAddress.locality,
      country: onAuthorizeEventAddress.countryCode,
      postalCode: onAuthorizeEventAddress.postalCode,
      stateOrProvince: onAuthorizeEventAddress.administrativeArea,
    },
    profile: {
      firstName: onAuthorizeEventAddress.givenName,
      lastName: onAuthorizeEventAddress.familyName,
      phone: onAuthorizeEventAddress.phoneNumber,
      email,
    },
  }
}

function getSubmitOrderBillingContact(onAuthorizeEventAddress) {
  return {
    billingAddress: {
      street: get(onAuthorizeEventAddress, 'addressLines[0]'),
      houseNumberOrName: get(onAuthorizeEventAddress, 'addressLines[1]'),
      city: onAuthorizeEventAddress.locality,
      country: onAuthorizeEventAddress.countryCode,
      postalCode: onAuthorizeEventAddress.postalCode,
      stateOrProvince: onAuthorizeEventAddress.administrativeArea,
    },
  }
}

function getApplePayToken(onAuthorizeEvent) {
  const paymentData = get(onAuthorizeEvent, 'payment.token.paymentData', {})
  try {
    return Buffer.from(JSON.stringify(paymentData), 'binary').toString('base64')
  } catch (e) {
    return ''
  }
}

export function getSubmitOrderData(onAuthorizeEvent) {
  const shippingContact = get(onAuthorizeEvent, 'payment.shippingContact', {})
  const billingContact = get(onAuthorizeEvent, 'payment.billingContact', {})

  return {
    shippingAddress: getSubmitOrderAdressData(shippingContact),
    billingAddress: getSubmitOrderAdressData(billingContact),
    shippingContact: getSubmitOrderShippingContact(
      shippingContact,
      get(shippingContact, 'emailAddress')
    ),
    billingContact: getSubmitOrderBillingContact(billingContact),
    applePayToken: getApplePayToken(onAuthorizeEvent),
    applePayPaymentMethod: get(onAuthorizeEvent, 'payment.token.paymentMethod', {}),
  }
}

export function redirectAsFormSubmission(url) {
  const form = document.createElement('form')
  form.action = url
  form.method = 'post'
  document.body.appendChild(form)
  form.submit()
}

export function isCartThresholdError(errorResponse) {
  const statusCode = get(errorResponse, 'error.arguments.statusCode', '')
  const reason = get(errorResponse, 'error.arguments.statusDetails.reason', '')

  if (statusCode === 'ERROR') {
    if (reason.includes(ApplePayErrorType.CART_THRESHOLD_ERROR)) {
      const parts = reason.split('__')
      if (parts.length > 1) {
        return parts[1].trim()
      }
    }
  }
  return null
}

export function getPaymentSheetErrorProps(errorResponse, state) {
  if (isInvalidAddressError(errorResponse, AddressType.SHIPPING)) {
    return {
      newTotal: state.total,
      // eslint-disable-next-line no-undef
      errors: [new ApplePayError('shippingContactInvalid', 'postalAddress')],
    }
  }

  if (isInvalidAddressError(errorResponse, AddressType.BILLING)) {
    return {
      newTotal: state.total,
      // eslint-disable-next-line no-undef
      errors: [new ApplePayError('billingContactInvalid', 'postalAddress')],
    }
  }

  const errorMappings = {
    [ApplePayErrorType.INVALID_SHIPPING_ADDRESS]: 'shippingContactInvalid',
    [ApplePayErrorType.INVALID_BILLING_ADDRESS]: 'billingContactInvalid',
  }

  const errorType = errorMappings[errorResponse?.errorType]

  if (errorType) {
    return {
      newTotal: state.total,
      // eslint-disable-next-line no-undef
      errors: [new ApplePayError(errorType, 'postalAddress', errorResponse?.errorMessage)],
    }
  }
}

export const addErrorOnPdp = (errorResponse) => {
  const errorTypes = Object.values(ApplePayErrorType)
  let errorResult = {
    errorType: ApplePayErrorType.UNKNOWN,
    errorMsg: errorResponse?.errorMessage || 'Something went wrong.',
  }
  if (errorResponse?.errorType === ApplePayErrorType.INVALID_REQUEST) {
    errorResult = {
      errorType: ApplePayErrorType.INVALID_REQUEST,
      errorMsg: 'Something went wrong.',
    }
  } else if (errorResponse?.error?.type === ApplePayErrorType.PRODUCT_NOT_AVAILABLE) {
    errorResult = {
      errorType: ApplePayErrorType.PRODUCT_NOT_AVAILABLE,
      errorMsg: '',
    }
  } else if (errorResponse?.errorType && errorTypes.includes(errorResponse?.errorType)) {
    let message = ''
    if (errorResponse?.errorType === ApplePayErrorType.REAL_TIME_INVENTORY) {
      message = errorResponse?.errorMessage
    }

    errorResult = {
      errorType: errorResponse?.errorType,
      errorMsg: message,
    }
  } else {
    const cartThresholdErrorMsg = isCartThresholdError(errorResponse)
    if (cartThresholdErrorMsg) {
      errorResult = {
        errorType: ApplePayErrorType.CART_THRESHOLD_ERROR,
        errorMsg: cartThresholdErrorMsg,
      }
    }
  }
  return errorResult
}

//  To get apple pay label
export const getEventLabel = (errorResponse, statusCode) => {
  let eventLabel = ''
  if (isInvalidAddressError(errorResponse, AddressType.SHIPPING)) {
    eventLabel = 'Invalid shipping address'
  } else if (isInvalidAddressError(errorResponse, AddressType.BILLING)) {
    eventLabel = 'Invalid billing address'
  } else if (errorResponse?.errorType === ApplePayErrorType.INVALID_BILLING_ADDRESS) {
    eventLabel = 'Invalid billing address'
  } else if (errorResponse?.error?.type === ApplePayErrorType.PRODUCT_NOT_AVAILABLE) {
    eventLabel = 'Invalid basket'
  } else if (errorResponse?.errorType === ApplePayErrorType.REAL_TIME_INVENTORY) {
    eventLabel = 'Item out of stock'
  } else if (errorResponse?.errorType === ApplePayErrorType.FRAUD) {
    eventLabel = 'Fraud'
  } else if (errorResponse?.errorType === ApplePayErrorType.INVALID_REQUEST) {
    eventLabel = 'Invalid request'
  } else if (errorResponse?.errorType === ApplePayErrorType.AUTHFAILED) {
    eventLabel = 'Auth failed'
  } else if (statusCode === 400) {
    eventLabel = 'Bad request error'
  } else if (statusCode === 401) {
    eventLabel = 'Unauthorized error'
  } else if (statusCode === 404) {
    eventLabel = 'Not found error'
  } else if (statusCode === 408) {
    eventLabel = 'Request timeout error'
  } else if (statusCode === 500) {
    eventLabel = 'Internal server error'
  } else {
    const cartThresholdErrorMsg = isCartThresholdError(errorResponse)
    if (cartThresholdErrorMsg) {
      eventLabel = 'Cart threshold error'
    }
  }
  return eventLabel
}

export const isApplePayAvailable = () => {
  return Boolean(
    isBrowser() &&
      location?.protocol === 'https:' &&
      window.ApplePaySession &&
      !!(window as any).ApplePaySession.canMakePayments()
  )
}
