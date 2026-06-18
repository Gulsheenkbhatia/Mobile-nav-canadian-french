import { render, CustomRenderOptions, act } from 'test-utils/react'
import ApplyCode from 'toro/components/CouponTracker/ApplyCode'
import useAnalytics from 'toro/analytics/useAnalytics'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import usePageType from 'toro/hooks/usePageType'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { bannerHeightAtom } from 'store/headroom.atom'
import { promoCouponCodeAtom } from 'store/pdp.atom'
import { SessionContextType } from 'test-utils/ContextValuesTypes'

const setPromoCouponCode = jest.fn()
const mockSendAnalytics = jest.fn()
const mockUseToast = jest.fn()

jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/usePageType')
jest.mock('jotai/utils')
jest.mock('toro/hooks/useToast', () => () => mockUseToast)
jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
    messages: {
      'header.autoPromoCode.Statuscode.noApplicablePromotion':
        'Congratulations! The promo code will be automatically applied to your cart, when the eligible item is added to the cart',
      'header.autoPromoCode.Statuscode.applied':
        'Congratulations! Your {discountCount} off has been applied to eligible items present in your cart.',
      'header.autoPromoCode.Statuscode.applied.otherTypes':
        'Congratulations! Discount has been applied to your cart.',
      'pdp.product.notAvailableNear': 'Not available for pickup near {location}',
      'pdp.product.findOrEditStore': 'Find or Edit Store',
    },
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUseUpdateAtom = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>

const defaultPageType = {
  isPDP: false,
  isHP: true,
  isSRP: false,
  isPLP: false,
  isRetailHP: false,
  isOutletHP: false,
  isSubHP: false,
  isProductPassport: false,
  isContentPage: false,
}

const defaultCouponItems = [
  {
    code: 'SAVE30',
    status_code: 'applied',
  },
]

const defaultOrderPriceAdjustments = [
  {
    coupon_code: 'SAVE30',
    applied_discount: {
      type: 'percentage',
      percentage: '30',
    },
  },
  {
    coupon_code: 'FREESHIP',
    applied_discount: {
      type: 'dicount',
      percentage: '20',
    },
  },
]

const defaultProductItems = [
  {
    price_adjustments: [
      {
        coupon_code: 'SAVE40',
        applied_discount: {
          type: 'percentage',
          percentage: '40',
        },
      },
    ],
  },
]

const defaultProps = {
  couponCode: 'SAVE30',
}

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
    SessionContext: {
      actions: {
        applyCartCoupon: jest.fn().mockReturnValue({
          hasError: false,
          coupon_items: defaultCouponItems,
          currency: 'USD',
          order_price_adjustments: defaultOrderPriceAdjustments,
          product_items: defaultProductItems,
        }),
      } as SessionContextType['actions'] & {
        applyCartCoupon: jest.Mock
      },
      session: {
        cart: { basket_id: 'BASKET123' },
      },
    },
  },
}

const makeSetup = (props: any = {}, modifiedRenderOptions: any = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  const combinedRenderOptions = { ...renderOptions, ...modifiedRenderOptions }
  return render(<ApplyCode {...combinedProps} />, combinedRenderOptions)
}

describe('ApplyCode', () => {
  beforeEach(() => {
    mockedUseViewportType.mockImplementation(() => ({ isMobile: true }))
    mockedUsePageType.mockImplementation(() => defaultPageType)
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case bannerHeightAtom:
          return 0
        default:
          return undefined
      }
    })
    mockedUseUpdateAtom.mockImplementation((atom) => {
      switch (atom) {
        case promoCouponCodeAtom:
          return setPromoCouponCode
        default:
          return undefined
      }
    })
    mockedUsePreference.mockImplementation(() => ({
      toggleSiteFeatures: {
        autoApplyMsg: {
          animation: 'slide-out',
        },
      },
      generalConfiguration: { enableNewGlobalHeader: true },
    }))
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component without crashing', async () => {
    await act(async () => {
      makeSetup()
    })
    expect(mockSendAnalytics).toHaveBeenCalledWith('promoCodeInteraction', {
      eventAction: 'apply',
      eventLocation: 'auto apply sms',
      eventLabel: 'SAVE30',
    })
    expect(mockUseToast).toHaveBeenCalledWith({
      description:
        'Congratulations! Your 30% off has been applied to eligible items present in your cart.',
      duration: 5000,
      link: null,
      dataQa: null,
    })
  })

  it('should render the component without crashing when applyCartCoupon throws and error', async () => {
    const updatedRenderOptions: CustomRenderOptions = {
      contexts: {
        ...renderOptions.contexts,
        SessionContext: {
          ...renderOptions.contexts.SessionContext,
          actions: {
            ...renderOptions.contexts.SessionContext.actions,
            applyCartCoupon: jest.fn().mockReturnValue({
              hasError: true,
              coupon_items: defaultCouponItems,
              currency: 'USD',
              order_price_adjustments: defaultOrderPriceAdjustments,
              product_items: defaultProductItems,
            }),
          } as SessionContextType['actions'] & {
            applyCartCoupon: jest.Mock
          },
        },
      },
    }

    await act(async () => {
      makeSetup({}, updatedRenderOptions)
    })
    expect(mockSendAnalytics).toHaveBeenCalledTimes(2)
    expect(mockSendAnalytics).toHaveBeenCalledWith('promoCodeInteraction', {
      eventAction: 'invalid',
      eventLocation: 'auto apply sms',
      eventLabel: 'SAVE30',
    })
    expect(mockSendAnalytics).toHaveBeenCalledWith('siteError', {
      eventAction: 'promo',
      eventLocation: 'auto apply sms',
      eventLabel: 'Invalid promo code SAVE30',
    })
  })

  it('should render the component without crashing when viewport and page type changes', async () => {
    mockedUseViewportType.mockImplementation(() => ({ isMobile: false }))
    mockedUsePageType.mockImplementation(() => ({
      ...defaultPageType,
      isPDP: true,
      isHP: false,
    }))
    await act(async () => {
      makeSetup()
    })
    expect(mockSendAnalytics).toHaveBeenCalledWith('promoCodeInteraction', {
      eventAction: 'apply',
      eventLocation: 'auto apply sms',
      eventLabel: 'SAVE30',
    })
    expect(mockUseToast).toHaveBeenCalledWith({
      description:
        'Congratulations! Your 30% off has been applied to eligible items present in your cart.',
      duration: 5000,
      link: null,
      dataQa: null,
    })
  })

  it('should render the component without crashing when viewport is mobile and page type changes', async () => {
    mockedUsePageType.mockImplementation(() => ({
      ...defaultPageType,
      isPDP: true,
      isHP: false,
    }))
    await act(async () => {
      makeSetup()
    })
    expect(mockSendAnalytics).toHaveBeenCalledWith('promoCodeInteraction', {
      eventAction: 'apply',
      eventLocation: 'auto apply sms',
      eventLabel: 'SAVE30',
    })
    expect(mockUseToast).toHaveBeenCalledWith({
      description:
        'Congratulations! Your 30% off has been applied to eligible items present in your cart.',
      duration: 5000,
      link: null,
      dataQa: null,
    })
  })

  it('should render the component without crashing when type of applied discount is amount', async () => {
    const updatedOrderPriceAdjustments = defaultOrderPriceAdjustments.map((item) => {
      if (item.applied_discount) {
        return {
          ...item,
          applied_discount: {
            type: 'amount',
            amount: '$20',
          },
        }
      }
      return item
    })
    const updatedRenderOptions: CustomRenderOptions = {
      contexts: {
        ...renderOptions.contexts,
        SessionContext: {
          ...renderOptions.contexts.SessionContext,
          actions: {
            ...renderOptions.contexts.SessionContext.actions,
            applyCartCoupon: jest.fn().mockReturnValue({
              hasError: false,
              coupon_items: defaultCouponItems,
              currency: 'USD',
              order_price_adjustments: updatedOrderPriceAdjustments,
              product_items: defaultProductItems,
            }),
          } as SessionContextType['actions'] & {
            applyCartCoupon: jest.Mock
          },
        },
      },
    }

    await act(async () => {
      makeSetup({}, updatedRenderOptions)
    })
    expect(mockSendAnalytics).toHaveBeenCalledWith('promoCodeInteraction', {
      eventAction: 'apply',
      eventLocation: 'auto apply sms',
      eventLabel: 'SAVE30',
    })
    expect(mockUseToast).toHaveBeenCalledWith({
      description:
        'Congratulations! Your $20 off has been applied to eligible items present in your cart.',
      duration: 5000,
      link: null,
      dataQa: null,
    })
  })

  it('should render the component without crashing when type of applied discount is other than amount or percentage', async () => {
    const updatedOrderPriceAdjustments = defaultOrderPriceAdjustments.map((item) => {
      if (item.applied_discount) {
        return {
          ...item,
          applied_discount: {
            ...item.applied_discount,
            type: 'other',
          },
        }
      }
      return item
    })
    const updatedRenderOptions: CustomRenderOptions = {
      contexts: {
        ...renderOptions.contexts,
        SessionContext: {
          ...renderOptions.contexts.SessionContext,
          actions: {
            ...renderOptions.contexts.SessionContext.actions,
            applyCartCoupon: jest.fn().mockReturnValue({
              hasError: false,
              coupon_items: defaultCouponItems,
              currency: 'USD',
              order_price_adjustments: updatedOrderPriceAdjustments,
              product_items: defaultProductItems,
            }),
          } as SessionContextType['actions'] & {
            applyCartCoupon: jest.Mock
          },
        },
      },
    }

    await act(async () => {
      makeSetup({}, updatedRenderOptions)
    })
    expect(mockSendAnalytics).toHaveBeenCalledWith('promoCodeInteraction', {
      eventAction: 'apply',
      eventLocation: 'auto apply sms',
      eventLabel: 'SAVE30',
    })
    expect(mockUseToast).toHaveBeenCalledWith({
      description: 'Congratulations! Discount has been applied to your cart.',
      duration: 5000,
      link: null,
      dataQa: null,
    })
  })

  it('should render the component without crashing when type of applied discount is other than amount or percentage and coupon status code is no promotion applied', async () => {
    const updatedOrderPriceAdjustments = defaultOrderPriceAdjustments.map((item) => {
      if (item.applied_discount) {
        return {
          ...item,
          applied_discount: {
            ...item.applied_discount,
            type: 'other',
          },
        }
      }
      return item
    })
    const updatedCouponItems = defaultCouponItems.map((item) => ({
      ...item,
      status_code: 'no_applicable_promotion',
    }))
    const updatedRenderOptions: CustomRenderOptions = {
      contexts: {
        ...renderOptions.contexts,
        SessionContext: {
          ...renderOptions.contexts.SessionContext,
          actions: {
            ...renderOptions.contexts.SessionContext.actions,
            applyCartCoupon: jest.fn().mockReturnValue({
              hasError: false,
              coupon_items: updatedCouponItems,
              currency: 'USD',
              order_price_adjustments: updatedOrderPriceAdjustments,
              product_items: defaultProductItems,
            }),
          } as SessionContextType['actions'] & {
            applyCartCoupon: jest.Mock
          },
        },
      },
    }

    await act(async () => {
      makeSetup({}, updatedRenderOptions)
    })
    expect(mockSendAnalytics).toHaveBeenCalledWith('promoCodeInteraction', {
      eventAction: 'apply',
      eventLocation: 'auto apply sms',
      eventLabel: 'SAVE30',
    })
    expect(mockUseToast).toHaveBeenCalledWith({
      description:
        'Congratulations! The promo code will be automatically applied to your cart, when the eligible item is added to the cart',
      duration: 5000,
      link: null,
      dataQa: null,
    })
  })

  it('should render the component without crashing when autoApplyMsg animation is slide-in and coupon status code is different', async () => {
    mockedUsePreference.mockImplementation(() => ({
      toggleSiteFeatures: {
        autoApplyMsg: {
          animation: 'slide-in',
        },
      },
      generalConfiguration: { enableNewGlobalHeader: true },
    }))
    const updatedCouponItems = defaultCouponItems.map((item) => ({
      ...item,
      status_code: 'not_eligible',
    }))
    const updatedRenderOptions: CustomRenderOptions = {
      contexts: {
        ...renderOptions.contexts,
        SessionContext: {
          ...renderOptions.contexts.SessionContext,
          actions: {
            ...renderOptions.contexts.SessionContext.actions,
            applyCartCoupon: jest.fn().mockReturnValue({
              hasError: false,
              coupon_items: updatedCouponItems,
              currency: 'USD',
              order_price_adjustments: defaultOrderPriceAdjustments,
              product_items: defaultProductItems,
            }),
          } as SessionContextType['actions'] & {
            applyCartCoupon: jest.Mock
          },
        },
      },
    }

    await act(async () => {
      makeSetup({}, updatedRenderOptions)
    })
    expect(mockSendAnalytics).toHaveBeenCalledWith('promoCodeInteraction', {
      eventAction: 'apply',
      eventLocation: 'auto apply sms',
      eventLabel: 'SAVE30',
    })
    expect(mockUseToast).toHaveBeenCalledWith({
      description: 'Congratulations! Discount has been applied to your cart.',
      duration: 5000,
      link: null,
      dataQa: null,
    })
  })

  it('should render the component without crashing when product level coupon is applied', async () => {
    const updatedCouponItems = defaultCouponItems.map((item) => ({
      ...item,
      code: 'SAVE40',
    }))
    const updatedRenderOptions: CustomRenderOptions = {
      contexts: {
        ...renderOptions.contexts,
        SessionContext: {
          ...renderOptions.contexts.SessionContext,
          actions: {
            ...renderOptions.contexts.SessionContext.actions,
            applyCartCoupon: jest.fn().mockReturnValue({
              hasError: false,
              coupon_items: updatedCouponItems,
              currency: 'USD',
              order_price_adjustments: defaultOrderPriceAdjustments,
              product_items: defaultProductItems,
            }),
          } as SessionContextType['actions'] & {
            applyCartCoupon: jest.Mock
          },
        },
      },
    }

    await act(async () => {
      makeSetup({ couponCode: 'SAVE40' }, updatedRenderOptions)
    })
    expect(mockSendAnalytics).toHaveBeenCalledWith('promoCodeInteraction', {
      eventAction: 'apply',
      eventLocation: 'auto apply sms',
      eventLabel: 'SAVE40',
    })
    expect(mockUseToast).toHaveBeenCalledWith({
      description:
        'Congratulations! Your 40% off has been applied to eligible items present in your cart.',
      duration: 5000,
      link: null,
      dataQa: null,
    })
  })
})
