import {
  fetchPaymentMethods,
  fetchAddProductToTempBasket,
  fetchValidateMerchant,
  fetchRemoveCart,
  fetchUpdateShippingMethod,
  fetchUpdateShippingAddress,
  fetchSubmitOrder,
  getShippingAddressDataFromEvent,
  getShippingMethodDataFromEvent,
  getAdyenApiKeyFromPrefs,
  getMerchantCodeFromPrefs,
  getNewState,
  isInvalidAddressError,
  logError,
  getSubmitOrderData,
  redirectAsFormSubmission,
  isCartThresholdError,
  addErrorOnPdp,
  getEventLabel,
  AddressType,
  isApplePayAvailable,
} from 'toro/components/PaymentWidget/helpers'
import { ApplePayErrorType } from 'store/pdp.atom'
import fetchWithCorrId from 'helpers/traceability'
import isBrowser from 'toro/helpers/isBrowser'

jest.mock('helpers/traceability', () => {
  const mockedFetchWithCorrId = jest.fn()
  return {
    __esModule: true,
    default: jest.fn(() => mockedFetchWithCorrId),
  }
})

jest.mock('toro/lib/shopper-login/helpers/token', () => ({
  getToken: jest.fn(() => Promise.resolve({ token: 'mock-token' })),
}))

jest.mock('toro/helpers/serialize', () =>
  jest.fn(
    (params) =>
      `?${Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`
  )
)

jest.mock('toro/lib/shopper-login/helpers/handleResponse', () => ({
  __esModule: true,
  default: jest.fn((response) => response),
}))

jest.mock('toro/helpers/isBrowser', () => ({
  __esModule: true,
  default: jest.fn(() => true),
}))

describe('PaymentWidget Helpers', () => {
  let mockedFetchWithCorrId

  beforeEach(() => {
    jest.clearAllMocks()
    mockedFetchWithCorrId = fetchWithCorrId()
  })

  describe('fetchPaymentMethods', () => {
    it('should fetch payment methods successfully', async () => {
      fetchPaymentMethods()

      expect(mockedFetchWithCorrId).toHaveBeenCalledWith('/api/adyen/payment-methods')
    })

    it('should handle errors when fetching payment methods', async () => {
      const error = new Error('Network error')
      mockedFetchWithCorrId.mockRejectedValueOnce(error)

      await expect(fetchPaymentMethods()).rejects.toThrow('Network error')
    })
  })

  describe('fetchAddProductToTempBasket', () => {
    it('should add product to temp basket successfully', async () => {
      await fetchAddProductToTempBasket('product-id', 1, 'promo-code')
      expect(mockedFetchWithCorrId).toHaveBeenCalledWith(
        expect.stringContaining('/api/adyen/add-product/product-id'),
        expect.any(Object)
      )
    })

    it('should handle errors when adding product to temp basket', async () => {
      const error = new Error('Network error')
      mockedFetchWithCorrId.mockRejectedValueOnce(error)

      await expect(fetchAddProductToTempBasket('product-id', 1, 'promo-code')).rejects.toThrow(
        'Network error'
      )
    })
  })

  describe('fetchValidateMerchant', () => {
    it('should validate merchant successfully', async () => {
      fetchValidateMerchant('validation-url')
      expect(mockedFetchWithCorrId).toHaveBeenCalledWith(
        expect.stringContaining('/api/adyen/validate-merchant')
      )
    })

    it('should handle errors when validating merchant', async () => {
      const error = new Error('Network error')
      mockedFetchWithCorrId.mockRejectedValueOnce(error)

      await expect(fetchValidateMerchant('validation-url')).rejects.toThrow('Network error')
    })
  })

  describe('fetchRemoveCart', () => {
    it('should remove cart successfully', async () => {
      await fetchRemoveCart('basket-id')
      expect(mockedFetchWithCorrId).toHaveBeenCalledWith(
        expect.stringContaining('/api/user/remove-cart/basket-id'),
        expect.any(Object)
      )
    })

    it('should handle errors when removing cart', async () => {
      const error = new Error('Network error')
      mockedFetchWithCorrId.mockRejectedValueOnce(error)

      await expect(fetchRemoveCart('basket-id')).rejects.toThrow('Network error')
    })
  })

  describe('fetchUpdateShippingMethod', () => {
    const shippingMethod = {
      id: 'standard-shipping',
      name: 'Standard Shipping',
      description: 'Delivery within 5-7 business days',
      price: 6.99,
    }
    it('should update shipping method successfully', async () => {
      await fetchUpdateShippingMethod('basket-id', 'shipment-id', shippingMethod)
      expect(mockedFetchWithCorrId).toHaveBeenCalledWith(
        expect.stringContaining('/api/adyen/update-shipping-method'),
        expect.any(Object)
      )
    })

    it('should handle errors when updating shipping method', async () => {
      const error = new Error('Network error')
      mockedFetchWithCorrId.mockRejectedValueOnce(error)

      await expect(
        fetchUpdateShippingMethod('basket-id', 'shipment-id', shippingMethod)
      ).rejects.toThrow('Network error')
    })
  })

  describe('fetchUpdateShippingAddress', () => {
    const shippingAddressData = {
      city: 'New Jersey',
      country_code: 'US',
      postal_code: '12345',
      state_code: 'Jersey city',
    }
    it('should update shipping address successfully', async () => {
      await fetchUpdateShippingAddress('basket-id', 'shipment-id', shippingAddressData)
      expect(mockedFetchWithCorrId).toHaveBeenCalledWith(
        expect.stringContaining('/api/adyen/update-shipping-address'),
        expect.any(Object)
      )
    })

    it('should handle errors when updating shipping address', async () => {
      const error = new Error('Network error')
      mockedFetchWithCorrId.mockRejectedValueOnce(error)
      await expect(
        fetchUpdateShippingAddress('basket-id', 'shipment-id', shippingAddressData)
      ).rejects.toThrow('Network error')
    })
  })

  describe('fetchSubmitOrder', () => {
    it('should submit order successfully', async () => {
      await fetchSubmitOrder('basket-id', 'shipment-id', {})
      expect(mockedFetchWithCorrId).toHaveBeenCalledWith(
        expect.stringContaining('/api/adyen/submit-order'),
        expect.any(Object)
      )
    })

    it('should handle errors when submitting order', async () => {
      const error = new Error('Network error')
      mockedFetchWithCorrId.mockRejectedValueOnce(error)

      await expect(fetchSubmitOrder('basket-id', 'shipment-id', {})).rejects.toThrow(
        'Network error'
      )
    })
  })

  describe('getShippingAddressDataFromEvent', () => {
    it('should extract shipping address data from event', () => {
      const event = {
        shippingContact: {
          locality: 'City',
          countryCode: 'US',
          postalCode: '12345',
          administrativeArea: 'State',
        },
      } as unknown as ApplePayJS.ApplePayShippingContactSelectedEvent
      const result = getShippingAddressDataFromEvent(event)
      expect(result).toEqual({
        city: 'City',
        country_code: 'US',
        postal_code: '12345',
        state_code: 'State',
      })
    })
  })

  describe('getShippingMethodDataFromEvent', () => {
    it('should extract shipping method data from event', () => {
      const event = {
        shippingMethod: {
          identifier: 'method-id',
        },
      }
      const state = {
        shippingMethodsFullData: [{ id: 'method-id', name: 'Method Name' }],
      }
      const result = getShippingMethodDataFromEvent(event, state)
      expect(result).toEqual({ id: 'method-id', name: 'Method Name' })
    })
  })

  describe('getAdyenApiKeyFromPrefs', () => {
    it('should return the correct API key based on locale', () => {
      const locale = 'en-US'
      const generalApiKey = 'general-key'
      const countrySpecificConfig = {
        US: { x_Key: 'us-key' },
      }
      const result = getAdyenApiKeyFromPrefs(locale, generalApiKey, countrySpecificConfig)
      expect(result).toBe('us-key')
    })

    it('should return the general API key if no country-specific config is found', () => {
      const locale = 'fr-FR'
      const generalApiKey = 'general-key'
      const countrySpecificConfig = {
        US: { x_Key: 'us-key' },
      }
      const result = getAdyenApiKeyFromPrefs(locale, generalApiKey, countrySpecificConfig)
      expect(result).toBe('general-key')
    })
  })

  describe('getMerchantCodeFromPrefs', () => {
    it('should return the correct merchant code based on locale', () => {
      const locale = 'en-US'
      const generalMerchantCode = 'general-code'
      const countrySpecificConfig = {
        US: { merchant_code: 'us-code' },
      }
      const result = getMerchantCodeFromPrefs(locale, generalMerchantCode, countrySpecificConfig)
      expect(result).toBe('us-code')
    })

    it('should return the general merchant code if no country-specific config is found', () => {
      const locale = 'fr-FR'
      const generalMerchantCode = 'general-code'
      const countrySpecificConfig = {
        US: { merchant_code: 'us-code' },
      }
      const result = getMerchantCodeFromPrefs(locale, generalMerchantCode, countrySpecificConfig)
      expect(result).toBe('general-code')
    })
  })

  describe('getNewState', () => {
    it('should return new state with updated basket and shipping methods', () => {
      const basket = {
        basket_id: 'basket-id',
        product_items: [
          {
            shipment_id: 'shipment-id',
            product_name: 'Tabby Shoulder bag',
            price_after_order_discount: 100,
          },
        ],
        tax_total: 5,
        order_total: 110,
        product_total: 115,
        shipping_total: 10,
        shipments: [{ shipping_method: { name: 'Standard', price: '10' } }],
      }
      const shippingMethods = {
        applicable_shipping_methods: [
          { name: 'Standard', description: 'Standard Shipping', price: 10, id: 'method-id' },
        ],
      }
      const prevState = { companyName: 'UPS' }
      const result = getNewState({ basket, shippingMethods, companyName: 'UPS' }, prevState)
      expect(result).toEqual({
        basketId: 'basket-id',
        shipmentId: 'shipment-id',
        basketData: {
          basket_id: 'basket-id',
          product_items: [
            {
              shipment_id: 'shipment-id',
              product_name: 'Tabby Shoulder bag',
              price_after_order_discount: 100,
            },
          ],
          tax_total: 5,
          order_total: 110,
          product_total: 115,
          shipping_total: 10,
          shipments: [{ shipping_method: { name: 'Standard', price: '10' } }],
        },
        lineItems: [
          { label: 'Merchandise', amount: '100', type: 'final' },
          { label: 'Standard', amount: '10', type: 'final' },
          { label: 'Tax', amount: '5', type: 'final' },
        ],
        total: { label: 'UPS', amount: '110' },
        shippingMethods: [
          {
            label: 'Standard',
            detail: 'Standard Shipping',
            amount: '10',
            identifier: 'method-id',
          },
        ],
        shippingMethodsFullData: [
          {
            name: 'Standard',
            description: 'Standard Shipping',
            price: 10,
            id: 'method-id',
          },
        ],
        companyName: 'UPS',
      })
    })
  })

  describe('isInvalidAddressError', () => {
    it('should return true for invalid shipping address error', () => {
      const error = {
        arguments: {
          statusCode: 'ERROR',
          statusDetails: { reason: 'InvalidShippingPostalAddress' },
        },
      }
      const result = isInvalidAddressError(error, AddressType.SHIPPING)
      expect(result).toBe(true)
    })

    it('should return false for non-invalid address error', () => {
      const error = {
        arguments: {
          statusCode: 'ERROR',
          statusDetails: { reason: 'SomeOtherReason' },
        },
      }
      const result = isInvalidAddressError(error, AddressType.SHIPPING)
      expect(result).toBe(false)
    })

    it('should return false for null error', () => {
      const result = isInvalidAddressError(null, AddressType.SHIPPING)
      expect(result).toBe(false)
    })

    it('should return false for error without statusDetails', () => {
      const error = {
        arguments: {
          statusCode: 'ERROR',
        },
      }
      const result = isInvalidAddressError(error, AddressType.SHIPPING)
      expect(result).toBe(false)
    })
  })

  describe('logError', () => {
    it('should log error with prefix', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Test error')
      logError(error, 'TestPrefix')
      expect(consoleErrorSpy).toHaveBeenCalledWith('ApplePay: TestPrefix: Test error', error)
      consoleErrorSpy.mockRestore()
    })
  })

  describe('getSubmitOrderData', () => {
    it('should return submit order data from event', () => {
      const onAuthorizeEvent = {
        payment: {
          shippingContact: {
            addressLines: ['123 Main St', 'Apt 4'],
            familyName: 'Doe',
            givenName: 'John',
            phoneNumber: '1234567890',
            locality: 'City',
            countryCode: 'US',
            postalCode: '12345',
            administrativeArea: 'State',
            emailAddress: 'john.doe@example.com',
          },
          billingContact: {
            addressLines: ['123 Main St', 'Apt 4'],
            familyName: 'Doe',
            givenName: 'John',
            phoneNumber: '1234567890',
            locality: 'City',
            countryCode: 'US',
            postalCode: '12345',
            administrativeArea: 'State',
          },
          token: {
            paymentData: {},
            paymentMethod: {},
          },
        },
      }
      const result = getSubmitOrderData(onAuthorizeEvent)
      expect(result).toEqual({
        shippingAddress: {
          address1: '123 Main St',
          first_name: 'John',
          last_name: 'Doe',
          phone: '1234567890',
          city: 'City',
          country_code: 'US',
          postal_code: '12345',
          state_code: 'State',
        },
        billingAddress: {
          address1: '123 Main St',
          first_name: 'John',
          last_name: 'Doe',
          phone: '1234567890',
          city: 'City',
          country_code: 'US',
          postal_code: '12345',
          state_code: 'State',
        },
        shippingContact: {
          deliveryAddress: {
            address1: '123 Main St',
            houseNumberOrName: 'Apt 4',
            city: 'City',
            country: 'US',
            postalCode: '12345',
            stateOrProvince: 'State',
          },
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            phone: '1234567890',
            email: 'john.doe@example.com',
          },
        },
        billingContact: {
          billingAddress: {
            street: '123 Main St',
            houseNumberOrName: 'Apt 4',
            city: 'City',
            country: 'US',
            postalCode: '12345',
            stateOrProvince: 'State',
          },
        },
        applePayToken: 'e30=',
        applePayPaymentMethod: {},
      })
    })

    it('should handle missing payment data gracefully', () => {
      const onAuthorizeEvent = {
        payment: {
          shippingContact: {
            addressLines: ['123 Main St', 'Apt 4'],
            familyName: 'Doe',
            givenName: 'John',
            phoneNumber: '1234567890',
            locality: 'City',
            countryCode: 'US',
            postalCode: '12345',
            administrativeArea: 'State',
            emailAddress: 'john.doe@example.com',
          },
          billingContact: {
            addressLines: ['123 Main St', 'Apt 4'],
            familyName: 'Doe',
            givenName: 'John',
            phoneNumber: '1234567890',
            locality: 'City',
            countryCode: 'US',
            postalCode: '12345',
            administrativeArea: 'State',
          },
          token: null, // Missing payment data
        },
      }
      const result = getSubmitOrderData(onAuthorizeEvent)
      expect(result.applePayToken).toBe('e30=')
      expect(result.applePayPaymentMethod).toEqual({})
    })
  })

  describe('redirectAsFormSubmission', () => {
    it('should create and submit a form', () => {
      const formSubmitSpy = jest.fn()
      const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
        return {
          action: '',
          method: '',
          submit: formSubmitSpy,
          appendChild: jest.fn(),
        } as unknown as HTMLElement
      })
      const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        return node
      })

      redirectAsFormSubmission('http://coach.com')

      expect(createElementSpy).toHaveBeenCalledWith('form')
      expect(appendChildSpy).toHaveBeenCalled()
      expect(formSubmitSpy).toHaveBeenCalled()

      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
    })
  })

  describe('isCartThresholdError', () => {
    it('should return cart threshold error message', () => {
      const errorResponse = {
        error: {
          arguments: {
            statusCode: 'ERROR',
            statusDetails: { reason: 'cartThresholdError__Threshold exceeded' },
          },
        },
      }
      const result = isCartThresholdError(errorResponse)
      expect(result).toBe('Threshold exceeded')
    })

    it('should return null for non-cart threshold error', () => {
      const errorResponse = {
        error: {
          arguments: {
            statusCode: 'ERROR',
            statusDetails: { reason: 'SomeOtherReason' },
          },
        },
      }
      const result = isCartThresholdError(errorResponse)
      expect(result).toBeNull()
    })
  })

  describe('addErrorOnPdp', () => {
    it('should return error result for invalid request', () => {
      const errorResponse = { errorType: ApplePayErrorType.INVALID_REQUEST }
      const result = addErrorOnPdp(errorResponse)
      expect(result).toEqual({
        errorType: ApplePayErrorType.INVALID_REQUEST,
        errorMsg: 'Something went wrong.',
      })
    })

    it('should return error result for product not available', () => {
      const errorResponse = { error: { type: ApplePayErrorType.PRODUCT_NOT_AVAILABLE } }
      const result = addErrorOnPdp(errorResponse)
      expect(result).toEqual({
        errorType: ApplePayErrorType.PRODUCT_NOT_AVAILABLE,
        errorMsg: '',
      })
    })

    it('should return error result for real-time inventory', () => {
      const errorResponse = {
        errorType: ApplePayErrorType.REAL_TIME_INVENTORY,
        errorMessage: 'Out of stock',
      }
      const result = addErrorOnPdp(errorResponse)
      expect(result).toEqual({
        errorType: ApplePayErrorType.REAL_TIME_INVENTORY,
        errorMsg: 'Out of stock',
      })
    })

    it('should return error result for cart threshold error', () => {
      const errorResponse = {
        error: {
          arguments: {
            statusCode: 'ERROR',
            statusDetails: { reason: 'cartThresholdError__Threshold exceeded' },
          },
        },
      }
      const result = addErrorOnPdp(errorResponse)
      expect(result).toEqual({
        errorType: ApplePayErrorType.CART_THRESHOLD_ERROR,
        errorMsg: 'Threshold exceeded',
      })
    })
  })

  describe('getEventLabel', () => {
    it('should return "Invalid shipping address" for InvalidShippingPostalAddress error', () => {
      const errorResponse = {
        arguments: {
          statusDetails: { reason: 'InvalidShippingPostalAddress' },
          statusCode: 'ERROR',
        },
      }
      const result = getEventLabel(errorResponse, 400)
      expect(result).toBe('Invalid shipping address')
    })

    it('should return "Invalid billing address" for InvalidBillingPostalAddress error', () => {
      const errorResponse = {
        arguments: {
          statusDetails: { reason: 'InvalidBillingPostalAddress' },
          statusCode: 'ERROR',
        },
      }
      const result = getEventLabel(errorResponse, 400)
      expect(result).toBe('Invalid billing address')
    })

    it('should return "Invalid basket" for PRODUCT_NOT_AVAILABLE error', () => {
      const errorResponse = {
        error: { type: ApplePayErrorType.PRODUCT_NOT_AVAILABLE },
      }
      const result = getEventLabel(errorResponse, 400)
      expect(result).toBe('Invalid basket')
    })

    it('should return "Item out of stock" for REAL_TIME_INVENTORY error', () => {
      const errorResponse = {
        errorType: ApplePayErrorType.REAL_TIME_INVENTORY,
      }
      const result = getEventLabel(errorResponse, 400)
      expect(result).toBe('Item out of stock')
    })

    it('should return "Fraud" for FRAUD error', () => {
      const errorResponse = {
        errorType: ApplePayErrorType.FRAUD,
      }
      const result = getEventLabel(errorResponse, 400)
      expect(result).toBe('Fraud')
    })

    it('should return "Invalid request" for INVALID_REQUEST error', () => {
      const errorResponse = {
        errorType: ApplePayErrorType.INVALID_REQUEST,
      }
      const result = getEventLabel(errorResponse, 400)
      expect(result).toBe('Invalid request')
    })

    it('should return "Auth failed" for AUTHFAILED error', () => {
      const errorResponse = {
        errorType: ApplePayErrorType.AUTHFAILED,
      }
      const result = getEventLabel(errorResponse, 400)
      expect(result).toBe('Auth failed')
    })

    it('should return "Bad request error" for status code 400', () => {
      const errorResponse = {
        arguments: {
          statusDetails: { reason: 'SomeOtherReason' },
        },
      }
      const result = getEventLabel(errorResponse, 400)
      expect(result).toBe('Bad request error')
    })

    it('should return "Unauthorized error" for status code 401', () => {
      const errorResponse = {
        arguments: {
          statusDetails: { reason: 'SomeOtherReason' },
        },
      }
      const result = getEventLabel(errorResponse, 401)
      expect(result).toBe('Unauthorized error')
    })

    it('should return "Not found error" for status code 404', () => {
      const errorResponse = {
        arguments: {
          statusDetails: { reason: 'SomeOtherReason' },
        },
      }
      const result = getEventLabel(errorResponse, 404)
      expect(result).toBe('Not found error')
    })

    it('should return "Request timeout error" for status code 408', () => {
      const errorResponse = {
        arguments: {
          statusDetails: { reason: 'SomeOtherReason' },
        },
      }
      const result = getEventLabel(errorResponse, 408)
      expect(result).toBe('Request timeout error')
    })

    it('should return "Internal server error" for status code 500', () => {
      const errorResponse = {
        arguments: {
          statusDetails: { reason: 'SomeOtherReason' },
        },
      }
      const result = getEventLabel(errorResponse, 500)
      expect(result).toBe('Internal server error')
    })

    it('should return "Cart threshold error" for cart threshold error', () => {
      const errorResponse = {
        error: {
          arguments: {
            statusCode: 'ERROR',
            statusDetails: { reason: 'cartThresholdError__Threshold exceeded' },
          },
        },
      }
      const result = getEventLabel(errorResponse, 302)
      expect(result).toBe('Cart threshold error')
    })

    it('should return an empty string for unknown errors', () => {
      const errorResponse = {
        arguments: {
          statusDetails: { reason: 'SomeOtherReason' },
        },
      }
      const result = getEventLabel(errorResponse, 999)
      expect(result).toBe('')
    })
  })

  describe('isApplePayAvailable', () => {
    const originalLocation = window.location
    const originalApplePaySession = window.ApplePaySession

    beforeEach(() => {
      // Reset window and location before each test
      delete (window as any).ApplePaySession
      Object.defineProperty(window, 'location', {
        value: { protocol: 'https:' },
        writable: true,
      })
    })

    afterEach(() => {
      // Restore original window and location after each test
      window.ApplePaySession = originalApplePaySession
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      })
    })

    it('should return true when all conditions are met', () => {
      // Mock ApplePaySession and canMakePayments
      window.ApplePaySession = {
        canMakePayments: () => true,
      } as any

      expect(isApplePayAvailable()).toBe(true)
    })

    it('should return false when not in browser environment', () => {
      // Mock isBrowser to return false
      ;(isBrowser as jest.Mock).mockReturnValue(false)

      expect(isApplePayAvailable()).toBe(false)
    })

    it('should return false when protocol is not https', () => {
      // Set protocol to http
      Object.defineProperty(window, 'location', {
        value: { protocol: 'http:' },
        writable: true,
      })

      window.ApplePaySession = {
        canMakePayments: () => true,
      } as any

      expect(isApplePayAvailable()).toBe(false)
    })

    it('should return false when ApplePaySession is not available', () => {
      // ApplePaySession is not defined
      expect(isApplePayAvailable()).toBe(false)
    })

    it('should return false when canMakePayments returns false', () => {
      window.ApplePaySession = {
        canMakePayments: () => false,
      } as any

      expect(isApplePayAvailable()).toBe(false)
    })
  })
})
