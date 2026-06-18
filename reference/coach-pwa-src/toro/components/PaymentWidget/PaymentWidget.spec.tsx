import { render, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import PaymentWidget from './PaymentWidget'
import initializeCheckout from 'toro/components/PaymentWidget/initializeCheckout'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import useAnalytics from 'toro/analytics/useAnalytics'
import { alterCtaToShowAtom, AlterCtaToShow, setApplePayErrorOnPdpAtom } from 'store/pdp.atom'

jest.mock('toro/components/PaymentWidget/initializeCheckout')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/analytics/useAnalytics')
jest.mock('jotai/utils', () => {
  const actual = jest.requireActual('jotai/utils')

  return {
    ...actual,
    useUpdateAtom: jest.fn(),
  }
})
jest.mock('jotai', () => {
  const actual = jest.requireActual('jotai')

  return {
    ...actual,
    useAtom: jest.fn(),
  }
})

const mockUpdateTotalPrice = jest.fn()
const mockUsePreference = usePreference as jest.Mock
const mockInitializeCheckout = initializeCheckout as jest.Mock
const mockuseAnalytics = useAnalytics as jest.Mock
const mockedUseAtom = useAtom as jest.Mock
const mockedUseUpdateAtom = useUpdateAtom as jest.Mock
const mockSetAlterCtaToShow = jest.fn()
const mockSetApplePayErrorOnPdp = jest.fn()

const mockOnClick = jest.fn()
const defaultProps = {
  variant: 'default',
  productIdRef: { current: '12345' },
  totalPrice: 100,
  selectedQtyRef: { current: 1 },
  onClickRef: { current: mockOnClick },
  onOpenRef: { current: jest.fn() },
  disabled: false,
  promoCouponCodeRef: { current: '' },
  isPdpV5: false,
  currency: 'USD',
}

describe('PaymentWidget', () => {
  beforeEach(() => {
    mockUsePreference.mockReturnValue({
      applePayConfigs: {
        appleValidationURL: 'https://test-url.com',
        Adyen_Mode: 'test',
        Adyen_ClientKey: 'test-key',
      },
    })

    mockInitializeCheckout.mockResolvedValue({
      updateTotalPrice: mockUpdateTotalPrice,
      applepay: {
        mount: jest.fn(),
      },
    })
    mockedUseAtom.mockReturnValue([[], jest.fn()])
    mockedUseUpdateAtom.mockImplementation((atom) => {
      if (atom === alterCtaToShowAtom) {
        return mockSetAlterCtaToShow
      }

      if (atom === setApplePayErrorOnPdpAtom) {
        return mockSetApplePayErrorOnPdp
      }

      return jest.fn()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('does not render if Adyen_ClientKey is missing', () => {
    mockUsePreference.mockReturnValue({ applePayConfigs: { Adyen_ClientKey: '' } })
    const { container } = render(<PaymentWidget {...defaultProps} />)
    expect(container.querySelector('.applePayContainer')).toBeNull()
  })

  it('calls initializeCheckout on mount and handles price updates', async () => {
    const user = userEvent.setup()
    const { rerender, container } = render(<PaymentWidget {...defaultProps} />)
    await waitFor(() => expect(initializeCheckout).toHaveBeenCalled())
    await waitFor(() => expect(mockUpdateTotalPrice).toHaveBeenCalledWith(100, 'USD'))
    rerender(<PaymentWidget {...defaultProps} totalPrice={200} />)
    await waitFor(() => {
      expect(mockUpdateTotalPrice).toHaveBeenNthCalledWith(1, 100, 'USD')
      expect(mockUpdateTotalPrice).toHaveBeenNthCalledWith(2, 200, 'USD')
    })
    const applePayButton = container.querySelector('.merchant-checkout__payment-method')
    expect(applePayButton).not.toBeNull()
    await user.click(applePayButton)
    expect(container.querySelector('.applePayContainer')).not.toBeNull()
  })

  it('calls onCloseByUser on modal close and tracks analytics', async () => {
    const analytics = { send: jest.fn() }
    mockuseAnalytics.mockReturnValue(analytics)
    render(<PaymentWidget {...defaultProps} />)
    await waitFor(() => expect(initializeCheckout).toHaveBeenCalled())
    const onCloseByUser = mockInitializeCheckout.mock.calls[0][0].onCloseByUser
    onCloseByUser()
    expect(analytics.send).toHaveBeenCalledWith('productInteraction', {
      event: 'product_interaction',
      eventAction: 'apple pay pdp cta interaction',
      eventLabel: 'modal close',
      eventLocation: 'apple pay modal',
    })
  })

  it('calls handleApplePayErrorAnalytics on error', async () => {
    const analytics = { send: jest.fn() }
    mockuseAnalytics.mockReturnValue(analytics)
    render(<PaymentWidget {...defaultProps} />)
    await waitFor(() => expect(initializeCheckout).toHaveBeenCalled())
    const handleApplePayErrorAnalytics =
      mockInitializeCheckout.mock.calls[0][0].handleApplePayErrorAnalytics
    handleApplePayErrorAnalytics('test error')
    expect(analytics.send).toHaveBeenCalledWith('siteError', {
      eventLocation: 'apple pay modal',
      eventAction: 'apple pay',
      eventLabel: 'test error',
      eventPageLocation: 'product',
    })
  })

  it('handles disabled state', async () => {
    const { container } = render(<PaymentWidget {...{ ...defaultProps, disabled: true }} />)
    expect(container.querySelector('.applePayContainer-disabled')).not.toBeNull()
  })

  it('ensures Apple Pay button becomes visible when conditions are met', async () => {
    const { container } = render(<PaymentWidget {...defaultProps} />)

    await waitFor(() => expect(initializeCheckout).toHaveBeenCalled())

    const applePayButton = container.querySelector('.merchant-checkout__payment-method')
    expect(applePayButton).not.toBeNull()

    const showApplePayButton = mockInitializeCheckout.mock.calls[0][0].showApplePayButton
    showApplePayButton({ mount: jest.fn() }, true)
    await waitFor(() => {
      expect(applePayButton?.classList.contains('merchant-checkout__payment-method--hidden')).toBe(
        false
      )
    })
    expect(mockSetAlterCtaToShow).toHaveBeenCalledWith(AlterCtaToShow.APPLEPAY)
  })

  it('sets buy-now CTA when applepay instance is missing', async () => {
    render(<PaymentWidget {...defaultProps} />)

    await waitFor(() => expect(initializeCheckout).toHaveBeenCalled())

    const showApplePayButton = mockInitializeCheckout.mock.calls[0][0].showApplePayButton
    showApplePayButton(undefined, true)

    expect(mockSetAlterCtaToShow).toHaveBeenCalledWith(AlterCtaToShow.BUYNOW)
  })

  it('sets buy-now CTA when Apple Pay is unavailable', async () => {
    render(<PaymentWidget {...defaultProps} />)

    await waitFor(() => expect(initializeCheckout).toHaveBeenCalled())

    const showApplePayButton = mockInitializeCheckout.mock.calls[0][0].showApplePayButton
    showApplePayButton({ mount: jest.fn() }, false)

    expect(mockSetAlterCtaToShow).toHaveBeenCalledWith(AlterCtaToShow.BUYNOW)
  })

  it('returns early when refs are unavailable in showApplePayButton', async () => {
    const { unmount } = render(<PaymentWidget {...defaultProps} />)

    await waitFor(() => expect(initializeCheckout).toHaveBeenCalled())

    const showApplePayButton = mockInitializeCheckout.mock.calls[0][0].showApplePayButton
    const mockMount = jest.fn()

    unmount()
    showApplePayButton({ mount: mockMount }, true)

    expect(mockMount).not.toHaveBeenCalled()
  })
})
