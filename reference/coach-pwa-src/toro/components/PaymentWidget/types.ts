import { ApplePayErrorType } from 'store/pdp.atom'

export type ShippingMethodOcapiData = {
  id: string
  name: string
  description: string
  price: number
}
export type ShippingMethodsOcapiData = {
  applicable_shipping_methods: ShippingMethodOcapiData[]
}
type BasketProductItemOcapiData = {
  shipment_id: string
  product_name: string
  price_after_order_discount: number
}
type BasketShippingMethodOcapiData = {
  shipping_method: {
    name: string
    price: string
  }
}
export type BasketOcapiData = {
  basket_id: string
  product_items: BasketProductItemOcapiData[]
  tax_total: number
  order_total: number
  product_total: number
  shipping_total: number
  shipments: BasketShippingMethodOcapiData[]
}
export type ShippingAddressOcapiData = {
  city: string
  country_code: string
  postal_code: string
  state_code: string
}
export type ApplePayLineItem = ApplePayJS.ApplePayLineItem

export type ApplePayCheckoutState = {
  basketId?: string
  shipmentId?: string
  wasPopupInitialized?: boolean
  shippingMethodsFullData?: ShippingMethodOcapiData[]
  lineItems?: ApplePayLineItem[]
  total?: ApplePayLineItem
  shippingMethods?: ApplePayJS.ApplePayShippingMethod[]
  basketData?: BasketOcapiData
  companyName?: string
}

export type UpdateStateProps = {
  basket?: BasketOcapiData
  shippingMethods?: ShippingMethodsOcapiData
  onAuthorizeEvent?: ApplePayJS.ApplePayPaymentAuthorizedEvent
  companyName?: string
}
export type OnClickHandler = () => {
  success: boolean
}

export type OnOpenHandler = () => void

export type ApplePayErrorInfo = {
  errorType: ApplePayErrorType | null
  errorMsg?: string
}
export type ApplePayErrorOnPdp = {
  applePayTechnicalErrorMsg?: string
} & ApplePayErrorInfo

export type ApplePayErrorHandler = (
  error: ApplePayErrorInfo,
  setOrderingStatus: (status: string) => void,
  setOrderingError: (error: string) => void
) => void
