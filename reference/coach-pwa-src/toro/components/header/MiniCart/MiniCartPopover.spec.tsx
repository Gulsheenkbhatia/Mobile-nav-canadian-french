import usePreference from 'toro/hooks/usePreference_new'
import camelCase from 'lodash/camelCase'
import { Atom, Provider as JotaiProvider } from 'jotai'
jest.mock('toro/components/CloseButton', () => () => 'CloseButton')
jest.mock('toro/components/header/MiniCart/PromoProgressBar', () => () => 'PromoProgressBar')
jest.mock('toro/components/Paypal', () => {
  const { forwardRef } = jest.requireActual('react')
  return {
    __esModule: true,
    default: forwardRef(() => 'PayPalButton'),
  }
})
jest.mock('toro/components/header/MiniCart/MiniCartPopoverItem', () => () => (
  <div>MiniCartPopoverItem</div>
))
jest.mock('toro/hooks/useShoppingGivesTrackingInstance')
jest.mock('toro/hooks/useHeaderPositionPref', () => () => ({ isStaticHeader: true }))
import useShoppingGivesTrackingInstance from 'toro/hooks/useShoppingGivesTrackingInstance'

import miniCartProduct from 'test-utils/MiniCartPopoverItem2.mock'

import MiniCartPopover from 'toro/components/header/MiniCart/MiniCartPopover'
import { render, waitFor, CustomRenderOptions } from 'test-utils/react'
import * as getFullData from 'helpers/getFullData'
import { mockLocation, getPreferencesMock } from 'test-utils/mock-utils'
import cloneDeep from 'lodash/cloneDeep'
import { miniCartOpenReasonAtom, MiniCartOpenReasons } from 'store/global.atom'

jest.spyOn(getFullData, 'fetchFullData').mockResolvedValue([miniCartProduct])

jest.mock('toro/hooks/usePreference_new')
jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    }),
  }
})

mockLocation()

const mockedUsePreference = jest.mocked(usePreference)

const createTrackingInstanceMock = jest.fn().mockReturnValue(Promise.resolve())
jest.mocked(useShoppingGivesTrackingInstance).mockImplementation(() => ({
  createTrackingInstance: createTrackingInstanceMock,
}))

const MOCKED_AMAZON_RESPONSE = {
  merchantId: 'merchant_id',
  publicKeyId: 'SANDBOX-xxxxxxxxxx',
  ledgerCurrency: 'USD',
  checkoutLanguage: 'en_US',
  productType: 'PayAndShip',
  placement: 'Cart',
  buttonColor: 'Gold',
  estimatedOrderAmount: { amount: '109.99', currencyCode: 'USD' },
  createCheckoutSessionConfig: {
    payloadJSON: 'payload',
    signature: 'xxxx',
  },
}

const apiCallsMock = {
  ['/api/get-amazon-credentials']: {
    body: JSON.stringify(MOCKED_AMAZON_RESPONSE),
    req: {},
    res: {
      status: 200,
    },
  },
}

jest.spyOn(global, 'fetch').mockImplementation((url: string) => {
  const pickUpKey = Object.keys(apiCallsMock).find((key) => url.includes(key))
  return Promise.resolve(new Response(apiCallsMock[pickUpKey].body, apiCallsMock[pickUpKey].res))
})

const productsInCart = [miniCartProduct]

const defaultProps = {
  triggerRef: {
    current: null,
  },
  timeoutRef: {
    current: null,
  },
}

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        siteId: 'coh_us_out',
        brand: 'kate-spade',
        paypalDisabledOnMinicart: false,
        preferences: getPreferencesMock({
          paypalExpressCheckout: {
            PP_ShowExpressCheckoutButtonOnCart: true,
          },
        }),
      },
      injectScriptOnce: jest.fn(),
    },
    ViewportContext: {},
    AnalyticsContext: {},
    SessionContext: {
      session: {
        cart: {
          product_items: productsInCart,
          product_total: 149,
          basket_id: 'bfe074e5e5bfbb115c9b5095a8',
        },
      },
    },
  },
}

const makeSetup = async (props: object = {}, customRenderOptions?) => {
  const initialProviderValues = [[miniCartOpenReasonAtom, MiniCartOpenReasons.Hovered]] as Iterable<
    readonly [Atom<MiniCartOpenReasons>, string]
  >
  const component = (
    <JotaiProvider initialValues={initialProviderValues}>
      <MiniCartPopover {...defaultProps} {...props} />
    </JotaiProvider>
  )
  const result = render(component, customRenderOptions || renderOptions)
  await result.findByText('MiniCartPopoverItem')
  return result
}

describe('MiniCartPopover tests', () => {
  const env = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...env,
    }
  })

  afterEach(() => {
    process.env = env
  })
  it.only.each([
    {
      enableAmazonPayMinicart: true,
      amazonPayScript: 'test script',
      expected: true,
    },
    {
      enableAmazonPayMinicart: true,
      amazonPayScript: '',
      expected: false,
    },
    {
      amazonPayScript: 'test script',
      expected: false,
    },
  ])(
    'Should render amazon checkout button',
    async ({ expected, enableAmazonPayMinicart, amazonPayScript }) => {
      mockedUsePreference.mockImplementation((prefs: object) => {
        return {
          ...Object.keys(prefs).reduce(
            (acc, prefKey) => ({ ...acc, [camelCase(prefKey)]: {} }),
            {}
          ),
          amazonPayV2: {
            enableAmazonPayMinicart,
            amazonPayScript,
          },
        }
      })
      const { queryByTestId } = await makeSetup({}, renderOptions)
      const button = queryByTestId('mb_cntnr_amazon')

      expected ? expect(button).toBeVisible() : expect(button).not.toBeInTheDocument()
    }
  )
  it('Should render popover with product item, total price, shopping bag and checkout buttons', async () => {
    const { getByText, getByTestId } = await makeSetup()
    getByText('CloseButton')
    getByText('$149')
    getByTestId('mb_btn_checkout')
    getByTestId('mb_btn_vsb')
  })
  it('Should render dummy paypal modal when country selection needed', async () => {
    const { user, getByText, getByTestId } = await makeSetup()

    const button = getByTestId('mb_btn_paypal')
    await user.click(button)
    getByText('Please select your shipping destination to continue')
    getByText('Select your country')
    getByText('United States')
    getByText('Canada')
    getByText('Submit')
  })
  it('Should handle view shopping bag click', async () => {
    const { user, getContextValue, getByTestId } = await makeSetup()
    const button = getByTestId('mb_btn_vsb')
    await user.click(button)

    const analyticsSend = getContextValue('AnalyticsContext.send')
    expect(analyticsSend).toHaveBeenCalledWith('cartInteraction', {
      eventLocation: 'minicart',
      eventAction: 'view bag',
    })
    await waitFor(() => expect(createTrackingInstanceMock).toHaveBeenCalled())
    expect(window.location.href).toBe('/shopping-bag')
  })
  it('Should handle checkout button click', async () => {
    const { user, getContextValue, getByTestId } = await makeSetup()
    const button = getByTestId('mb_btn_checkout')
    await user.click(button)

    const analyticsSend = getContextValue('AnalyticsContext.send')
    expect(analyticsSend).toHaveBeenCalledWith('beginCheckout', {
      products: productsInCart,
      eventLocation: 'minicart',
      checkoutOption: 'regular',
    })
    expect(analyticsSend).toHaveBeenCalledWith('cartInteraction', {
      eventLocation: 'minicart',
      eventAction: 'checkout',
    })
    await waitFor(() => expect(createTrackingInstanceMock).toHaveBeenCalled())
    expect(window.location.href).toBe('/checkout-begin?stage=shipping')
  })

  it('Should handle paypal checkout button click', async () => {
    const _renderOptions = cloneDeep(renderOptions)
    _renderOptions.contexts.PWAContext.appData.brand = 'coach'
    const { user, getContextValue, getByTestId } = await makeSetup({}, _renderOptions)
    const button = getByTestId('mb_btn_paypal')
    const analyticsSend = getContextValue('AnalyticsContext.send')
    await user.click(button)

    expect(analyticsSend).toHaveBeenCalledWith('cartInteraction', {
      eventLocation: 'minicart',
      eventAction: 'paypal checkout',
    })
    expect(analyticsSend).toHaveBeenCalledWith('beginCheckout', {
      products: productsInCart,
      eventLocation: 'minicart',
      checkoutOption: 'paypal',
    })
  })
})
