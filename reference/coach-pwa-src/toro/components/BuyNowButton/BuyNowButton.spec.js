import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import BuyNowButton from './index'
import { useUpdateAtom } from 'jotai/utils'
import get from 'lodash/get'
import { render } from 'test-utils/react'

jest.mock('toro/hooks/useMultiStyleConfig', () => () => ({
  buyNowWrapper: {},
  buyNowButton: {},
}))

jest.mock('toro/hooks/usePreference_new', () => () => ({
  pdpPreferences: {},
}))

jest.mock('toro/hooks/useLocaleUrl', () => (url) => url)

jest.mock('lodash/get', () => jest.fn())

jest.mock('jotai/utils', () => {
  const original = jest.requireActual('jotai/utils')
  return {
    ...original,
    useUpdateAtom: jest.fn(),
  }
})

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ defaultMessage }) => defaultMessage,
  }),
  IntlProvider: ({ children }) => children,
  FormattedMessage: ({ defaultMessage }) => defaultMessage,
}))

const mockSetFullscreenLoading = jest.fn()

const defaultProps = {
  onBuyNowButtonClick: jest.fn(),
  isSticky: false,
  selectedVariantId: 1,
  errorType: '',
  maxQuantityError: false,
  variant: 'default',
}

describe('BuyNowButton', () => {
  beforeEach(() => {
    useUpdateAtom.mockReturnValue(mockSetFullscreenLoading)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  const originalLocation = window.location

  beforeAll(() => {
    delete window.location
    window.location = { href: '' }
  })

  afterAll(() => {
    window.location = originalLocation
  })

  const renderComponent = (props = {}, isCartItem = false) => {
    const session = {
      session: {
        cart: {
          product_items: isCartItem ? [{ item: 1 }] : [],
        },
      },
    }
    return render(<BuyNowButton {...defaultProps} {...props} />, {
      contexts: {
        SessionContext: {
          session,
        },
      },
    })
  }

  test('renders the button with correct text', () => {
    renderComponent()
    const button = screen.getByText('Buy Now')
    expect(button).toBeInTheDocument()
  })

  test('calls onBuyNowButtonClick and sets loading state when button is clicked', async () => {
    const onBuyNowButtonClick = jest.fn()
    const { user } = renderComponent({ onBuyNowButtonClick })

    const button = screen.getByText('Buy Now')
    await user.click(button)

    expect(mockSetFullscreenLoading).toHaveBeenCalledWith(true)
    expect(onBuyNowButtonClick).toHaveBeenCalledWith(false, true)
  })

  test('disables button when maxQuantityError is true', () => {
    renderComponent({ maxQuantityError: true })

    const button = screen.getByText('Buy Now')
    expect(button).toBeDisabled()
  })

  test('handles error scenario and stops loading', async () => {
    const onBuyNowButtonClick = jest.fn()
    const { rerender, user } = renderComponent({ onBuyNowButtonClick })
    get.mockReturnValue([])

    const button = screen.getByText('Buy Now')
    await user.click(button)

    rerender(<BuyNowButton {...defaultProps} errorType="error" />)

    await waitFor(() => {
      expect(mockSetFullscreenLoading).toHaveBeenCalledWith(false)
    })
  })

  test('redirects to the expected url if items are present', async () => {
    const { user } = renderComponent({}, true)
    get.mockReturnValue([{ id: 1, product: '1' }])

    const button = screen.getByText('Buy Now')
    await user.click(button)

    await waitFor(() => {
      expect(mockSetFullscreenLoading).toHaveBeenCalledWith(true)
      expect(window.location.href).toBe(
        '/checkout-begin?stage=shipping&skuid=1&quantity=1#shipping'
      )
    })
  })
})
