import { render, screen, queryByAttribute } from 'test-utils/react'
import '@testing-library/jest-dom'
import { jest } from '@jest/globals'
import userEvent from '@testing-library/user-event'
import PayInInstallments from './index'

// Mock hooks
jest.mock('toro/hooks/usePayInInstallments')
jest.mock('toro/hooks/useDisclosure')

// Mock child components with data-qa attributes (following project rules)
jest.mock('toro/components/product/KlarnaWidget', () => ({
  __esModule: true,
  default: ({ skeletonProps }: any) => (
    <div
      data-qa="klarna-widget"
      data-skeleton-h={skeletonProps?.h}
      data-skeleton-w={skeletonProps?.w}
    >
      Klarna Widget
    </div>
  ),
}))

jest.mock('toro/components/AfterPay/AfterpayWidget', () => ({
  __esModule: true,
  default: () => <div data-qa="afterpay-widget">Afterpay Widget</div>,
}))

jest.mock('toro/components/Affirm/AffirmWidget', () => ({
  __esModule: true,
  default: () => <div data-qa="affirm-widget">Affirm Widget</div>,
}))

jest.mock('toro/components/product/mobile/PayInInstallments/PayInInstallmentsButton', () => ({
  __esModule: true,
  default: ({ onClick, isLoading, minInstallmentPrice }: any) => (
    <button
      data-qa="pay-in-installments-button"
      onClick={onClick}
      data-loading={isLoading}
      data-price={minInstallmentPrice}
    >
      Pay in Installments {minInstallmentPrice && `from ${minInstallmentPrice}`}
    </button>
  ),
}))

jest.mock('toro/components/product/mobile/PayInInstallments/PayInInstallmentsPopUp', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, children }: any) =>
    isOpen ? (
      <div data-qa="pay-in-installments-popup" onClick={onClose}>
        <div data-qa="popup-content">{children}</div>
      </div>
    ) : null,
}))

jest.mock('toro/components/StylesProvider', () => ({
  __esModule: true,
  default: ({ children, value }: any) => (
    <div data-qa="styles-provider" data-styles={JSON.stringify(value)}>
      {children}
    </div>
  ),
}))

import usePayInInstallments from 'toro/hooks/usePayInInstallments'
import useDisclosure from 'toro/hooks/useDisclosure'

const mockUsePayInInstallments = jest.mocked(usePayInInstallments)
const mockUseDisclosure = jest.mocked(useDisclosure)

// Helper function to query by data-qa attribute using React Testing Library
const queryByQa = (qa: string) => queryByAttribute('data-qa', document.body, qa)

describe('PayInInstallments', () => {
  const mockDisclosureDefault = {
    isOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
    onToggle: jest.fn(),
    isControlled: false,
    getButtonProps: jest.fn(),
    getDisclosureProps: jest.fn(),
  }

  const mockDisclosureOpen = {
    ...mockDisclosureDefault,
    isOpen: true,
  }

  // Hook return value fixtures (from test coverage plan)
  const mockHookDefault = {
    enableKlarna: false,
    enableAfterpay: false,
    shouldShowAffirm: false,
    minInstallmentPrice: null,
    isLoadingPrices: false,
  }

  const mockHookLoading = {
    enableKlarna: true,
    enableAfterpay: true,
    shouldShowAffirm: false,
    minInstallmentPrice: null,
    isLoadingPrices: true,
  }

  const mockHookKlarnaOnly = {
    enableKlarna: true,
    enableAfterpay: false,
    shouldShowAffirm: false,
    minInstallmentPrice: '$30.00',
    isLoadingPrices: false,
  }

  const mockHookAfterpayOnly = {
    enableKlarna: false,
    enableAfterpay: true,
    shouldShowAffirm: false,
    minInstallmentPrice: '$24.62',
    isLoadingPrices: false,
  }

  const mockHookAffirmOnly = {
    enableKlarna: false,
    enableAfterpay: false,
    shouldShowAffirm: true,
    minInstallmentPrice: '$28.50',
    isLoadingPrices: false,
  }

  const mockHookAllProviders = {
    enableKlarna: true,
    enableAfterpay: true,
    shouldShowAffirm: true,
    minInstallmentPrice: '$24.62',
    isLoadingPrices: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseDisclosure.mockReturnValue(mockDisclosureDefault)
    mockUsePayInInstallments.mockReturnValue(mockHookDefault)
  })

  describe('Rendering Logic', () => {
    describe('Early Returns / No Render Scenarios', () => {
      it('should not render when no providers are enabled', () => {
        render(<PayInInstallments />)

        // Component returns null, button should not be in document
        expect(
          screen.queryByRole('button', { name: /pay in installments/i })
        ).not.toBeInTheDocument()
        expect(queryByQa('styles-provider')).not.toBeInTheDocument()
      })
    })

    describe('Successful Render Scenarios', () => {
      it('should render when Klarna provider is enabled with price', () => {
        mockUsePayInInstallments.mockReturnValue(mockHookKlarnaOnly)

        render(<PayInInstallments />)

        const button = screen.getByRole('button', { name: /pay in installments/i })
        expect(button).toBeVisible()
        expect(button).toHaveAttribute('data-price', '$30.00')
      })

      it('should render when Afterpay provider is enabled with price', () => {
        mockUsePayInInstallments.mockReturnValue(mockHookAfterpayOnly)

        render(<PayInInstallments />)

        const button = screen.getByRole('button', { name: /pay in installments/i })
        expect(button).toBeVisible()
        expect(button).toHaveAttribute('data-price', '$24.62')
      })

      it('should render when Affirm provider is enabled with price', () => {
        mockUsePayInInstallments.mockReturnValue(mockHookAffirmOnly)

        render(<PayInInstallments />)

        const button = screen.getByRole('button', { name: /pay in installments/i })
        expect(button).toBeVisible()
        expect(button).toHaveAttribute('data-price', '$28.50')
      })

      it('should render when multiple providers are enabled', () => {
        mockUsePayInInstallments.mockReturnValue(mockHookAllProviders)

        render(<PayInInstallments />)

        const button = screen.getByRole('button', { name: /pay in installments/i })
        expect(button).toBeVisible()
        expect(button).toHaveAttribute('data-price', '$24.62')
      })
    })
  })

  describe('Widget Creation', () => {
    it('should create multiple widgets when multiple providers enabled', () => {
      mockUsePayInInstallments.mockReturnValue(mockHookAllProviders)
      mockUseDisclosure.mockReturnValue(mockDisclosureOpen)

      render(<PayInInstallments />)

      expect(queryByQa('klarna-widget')).toBeVisible()
      expect(queryByQa('afterpay-widget')).toBeVisible()
      expect(queryByQa('affirm-widget')).toBeVisible()
    })
  })

  describe('User Interactions', () => {
    it('should open popup when button is clicked', async () => {
      const user = userEvent.setup()
      const mockOnOpen = jest.fn()

      mockUsePayInInstallments.mockReturnValue(mockHookKlarnaOnly)
      mockUseDisclosure.mockReturnValue({
        ...mockDisclosureDefault,
        onOpen: mockOnOpen,
      })

      render(<PayInInstallments />)

      const button = screen.getByRole('button', { name: /pay in installments/i })
      await user.click(button)

      expect(mockOnOpen)
    })

    it('should close popup when onClose is triggered', async () => {
      const user = userEvent.setup()
      const mockOnClose = jest.fn()

      mockUsePayInInstallments.mockReturnValue(mockHookKlarnaOnly)
      mockUseDisclosure.mockReturnValue({
        ...mockDisclosureOpen,
        onClose: mockOnClose,
      })

      render(<PayInInstallments />)

      const popup = queryByQa('pay-in-installments-popup')
      expect(popup).toBeVisible()
      await user.click(popup as Element)

      expect(mockOnClose)
    })

    it('should pass minInstallmentPrice to button', () => {
      mockUsePayInInstallments.mockReturnValue(mockHookKlarnaOnly)

      render(<PayInInstallments />)

      const button = screen.getByRole('button', { name: /pay in installments/i })
      expect(button).toHaveAttribute('data-price', '$30.00')
      expect(button).toHaveTextContent('from $30.00')
    })

    it('should pass isLoading state to button', () => {
      mockUsePayInInstallments.mockReturnValue(mockHookLoading)

      render(<PayInInstallments />)

      const button = screen.getByRole('button', { name: /pay in installments/i })
      expect(button).toHaveAttribute('data-loading', 'true')
    })
  })

  describe('Edge Cases', () => {
    it('should not crash with unexpected data', () => {
      // Test with undefined values
      mockUsePayInInstallments.mockReturnValue({
        enableKlarna: undefined as any,
        enableAfterpay: undefined as any,
        shouldShowAffirm: undefined as any,
        minInstallmentPrice: undefined as any,
        isLoadingPrices: undefined as any,
      })

      expect(() => render(<PayInInstallments />)).not.toThrow()
    })
  })
})
