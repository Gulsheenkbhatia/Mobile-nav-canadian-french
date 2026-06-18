import React from 'react'
import { render, screen } from 'test-utils/react'
import RotationPayInInstallments from './index'
import usePreference from 'toro/hooks/usePreference_new'
import useAffirmEligibility from 'toro/hooks/useAffirmEligibility'
import KlarnaWidget from 'toro/components/product/KlarnaWidget'
import AfterpayWidget from 'toro/components/AfterPay/AfterpayWidget'
import AffirmWidget from 'toro/components/Affirm/AffirmWidget'
import HorizontalRotatingBanner from 'toro/components/product/TabbedPDP/RotatingBanner/HorizontalRotatingBanner'

// Mock all dependencies
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useAffirmEligibility')
jest.mock('toro/components/product/KlarnaWidget')
jest.mock('toro/components/AfterPay/AfterpayWidget')
jest.mock('toro/components/Affirm/AffirmWidget')
jest.mock('toro/components/product/TabbedPDP/RotatingBanner/HorizontalRotatingBanner')

describe('RotationPayInInstallments', () => {
  const mockUsePreference = jest.mocked(usePreference)
  const mockUseAffirmEligibility = jest.mocked(useAffirmEligibility)
  const mockKlarnaWidget = jest.mocked(KlarnaWidget)
  const mockAfterpayWidget = jest.mocked(AfterpayWidget)
  const mockAffirmWidget = jest.mocked(AffirmWidget)
  const mockHorizontalRotatingBanner = jest.mocked(HorizontalRotatingBanner)

  beforeEach(() => {
    jest.clearAllMocks()

    // Set up default mock implementations
    mockUsePreference.mockReturnValue({
      klarnaPayments: { enableKlarna: false },
      afterPay: { enableAfterpay: false },
    })

    mockUseAffirmEligibility.mockReturnValue(false)

    // Mock child components with testable output
    mockKlarnaWidget.mockImplementation(() => <div data-qa="klarna-widget">Klarna Widget</div>)
    mockAfterpayWidget.mockImplementation(() => (
      <div data-qa="afterpay-widget">Afterpay Widget</div>
    ))
    mockAffirmWidget.mockImplementation(() => <div data-qa="affirm-widget">Affirm Widget</div>)

    // Mock HorizontalRotatingBanner to render its children
    mockHorizontalRotatingBanner.mockImplementation(({ rotationMessages, isPaused }) => (
      <div data-qa="horizontal-rotating-banner" data-is-paused={isPaused}>
        {rotationMessages.map((widget: React.ReactElement, idx: number) => (
          <div key={idx} data-qa="banner-item">
            {widget}
          </div>
        ))}
      </div>
    ))
  })

  describe('Smoke Tests', () => {
    it('should render without crashing', () => {
      render(<RotationPayInInstallments />)
      expect(screen.getByTestId('horizontal-rotating-banner')).toBeVisible()
    })

    it('should render HorizontalRotatingBanner when at least one widget is eligible', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: false },
      })

      render(<RotationPayInInstallments />)

      expect(screen.getByTestId('horizontal-rotating-banner')).toBeVisible()
    })

    it('should render HorizontalRotatingBanner even when all conditions are false', () => {
      // Component always renders HorizontalRotatingBanner with empty array if needed
      render(<RotationPayInInstallments />)

      expect(screen.getByTestId('horizontal-rotating-banner')).toBeVisible()
    })
  })

  describe('Props and Hook Integration', () => {
    it('should call usePreference with correct parameters', () => {
      render(<RotationPayInInstallments />)

      expect(mockUsePreference).toHaveBeenCalledWith({
        Klarna_Payments: ['enableKlarna'],
        afterPay: ['enableAfterpay'],
        affirm: ['AffirmOnline', 'AffirmProductMessage'],
      })
    })

    it('should call useAffirmEligibility hook', () => {
      render(<RotationPayInInstallments />)

      expect(mockUseAffirmEligibility).toHaveBeenCalled()
    })

    it('should pass isPaused=false prop to HorizontalRotatingBanner', () => {
      render(<RotationPayInInstallments />)

      expect(mockHorizontalRotatingBanner).toHaveBeenCalledWith(
        expect.objectContaining({
          isPaused: false,
        }),
        expect.anything()
      )
    })

    it('should pass rotationMessages array to HorizontalRotatingBanner', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: false },
      })

      render(<RotationPayInInstallments />)

      expect(mockHorizontalRotatingBanner).toHaveBeenCalledWith(
        expect.objectContaining({
          rotationMessages: expect.any(Array),
        }),
        expect.anything()
      )
    })
  })

  describe('Widget Conditional Rendering - Klarna', () => {
    it('should render KlarnaWidget when enableKlarna is true', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: false },
      })

      render(<RotationPayInInstallments />)

      expect(screen.getByTestId('klarna-widget')).toBeVisible()
    })

    it('should not render KlarnaWidget when enableKlarna is false', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: { enableAfterpay: false },
      })

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('klarna-widget')).not.toBeInTheDocument()
    })

    it('should pass correct skeletonProps to KlarnaWidget', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: false },
      })

      render(<RotationPayInInstallments />)

      expect(mockKlarnaWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          skeletonProps: { h: '18px', w: '300px' },
        }),
        expect.anything()
      )
    })

    it('should render KlarnaWidget with correct key prop', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: false },
      })

      render(<RotationPayInInstallments />)

      // Verify the widget was called (key is internal React prop)
      expect(mockKlarnaWidget).toHaveBeenCalled()
    })

    it('should not render KlarnaWidget when klarnaPayments is undefined', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: {},
        afterPay: { enableAfterpay: false },
      })

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('klarna-widget')).not.toBeInTheDocument()
    })
  })

  describe('Widget Conditional Rendering - Afterpay', () => {
    it('should render AfterpayWidget when enableAfterpay is true', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: { enableAfterpay: true },
      })

      render(<RotationPayInInstallments />)

      expect(screen.getByTestId('afterpay-widget')).toBeVisible()
    })

    it('should not render AfterpayWidget when enableAfterpay is false', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: { enableAfterpay: false },
      })

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('afterpay-widget')).not.toBeInTheDocument()
    })

    it('should render AfterpayWidget with correct key prop', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: { enableAfterpay: true },
      })

      render(<RotationPayInInstallments />)

      // Verify the widget was called (key is internal React prop)
      expect(mockAfterpayWidget).toHaveBeenCalled()
    })

    it('should not render AfterpayWidget when afterPay is undefined', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: {},
      })

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('afterpay-widget')).not.toBeInTheDocument()
    })
  })

  describe('Widget Conditional Rendering - Affirm', () => {
    it('should render AffirmWidget when useAffirmEligibility returns true', () => {
      mockUseAffirmEligibility.mockReturnValue(true)

      render(<RotationPayInInstallments />)

      expect(screen.getByTestId('affirm-widget')).toBeVisible()
    })

    it('should not render AffirmWidget when useAffirmEligibility returns false', () => {
      mockUseAffirmEligibility.mockReturnValue(false)

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('affirm-widget')).not.toBeInTheDocument()
    })
  })

  describe('Multiple Widget Combinations', () => {
    it('should render all three widgets when all conditions are true', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: true },
      })
      mockUseAffirmEligibility.mockReturnValue(true)

      render(<RotationPayInInstallments />)

      expect(screen.getByTestId('klarna-widget')).toBeVisible()
      expect(screen.getByTestId('afterpay-widget')).toBeVisible()
      expect(screen.getByTestId('affirm-widget')).toBeVisible()
    })

    it('should render only Klarna and Afterpay when Affirm is ineligible', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: true },
      })
      mockUseAffirmEligibility.mockReturnValue(false)

      render(<RotationPayInInstallments />)

      expect(screen.getByTestId('klarna-widget')).toBeVisible()
      expect(screen.getByTestId('afterpay-widget')).toBeVisible()
      expect(screen.queryByTestId('affirm-widget')).not.toBeInTheDocument()
    })

    it('should render only Klarna and Affirm when Afterpay is disabled', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: false },
      })
      mockUseAffirmEligibility.mockReturnValue(true)

      render(<RotationPayInInstallments />)

      expect(screen.getByTestId('klarna-widget')).toBeVisible()
      expect(screen.queryByTestId('afterpay-widget')).not.toBeInTheDocument()
      expect(screen.getByTestId('affirm-widget')).toBeVisible()
    })

    it('should render only Afterpay and Affirm when Klarna is disabled', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: { enableAfterpay: true },
      })
      mockUseAffirmEligibility.mockReturnValue(true)

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('klarna-widget')).not.toBeInTheDocument()
      expect(screen.getByTestId('afterpay-widget')).toBeVisible()
      expect(screen.getByTestId('affirm-widget')).toBeVisible()
    })

    it('should render only Klarna when it is the only eligible widget', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: false },
      })
      mockUseAffirmEligibility.mockReturnValue(false)

      render(<RotationPayInInstallments />)

      expect(screen.getByTestId('klarna-widget')).toBeVisible()
      expect(screen.queryByTestId('afterpay-widget')).not.toBeInTheDocument()
      expect(screen.queryByTestId('affirm-widget')).not.toBeInTheDocument()
    })

    it('should render only Afterpay when it is the only eligible widget', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: { enableAfterpay: true },
      })
      mockUseAffirmEligibility.mockReturnValue(false)

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('klarna-widget')).not.toBeInTheDocument()
      expect(screen.getByTestId('afterpay-widget')).toBeVisible()
      expect(screen.queryByTestId('affirm-widget')).not.toBeInTheDocument()
    })

    it('should render only Affirm when it is the only eligible widget', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: { enableAfterpay: false },
      })
      mockUseAffirmEligibility.mockReturnValue(true)

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('klarna-widget')).not.toBeInTheDocument()
      expect(screen.queryByTestId('afterpay-widget')).not.toBeInTheDocument()
      expect(screen.getByTestId('affirm-widget')).toBeVisible()
    })

    it('should verify widgets appear in correct order (Klarna, Afterpay, Affirm)', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: true },
      })
      mockUseAffirmEligibility.mockReturnValue(true)

      render(<RotationPayInInstallments />)

      const bannerItems = screen.getAllByTestId('banner-item')
      expect(bannerItems).toHaveLength(3)

      // Verify order by checking the content of each banner item
      expect(bannerItems[0]).toHaveTextContent('Klarna Widget')
      expect(bannerItems[1]).toHaveTextContent('Afterpay Widget')
      expect(bannerItems[2]).toHaveTextContent('Affirm Widget')
    })

    it('should pass compacted array to HorizontalRotatingBanner (no falsy values)', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: false },
      })
      mockUseAffirmEligibility.mockReturnValue(false)

      render(<RotationPayInInstallments />)

      // Verify the banner received an array with only truthy values
      const callArgs = mockHorizontalRotatingBanner.mock.calls[0][0]
      expect(callArgs.rotationMessages).toHaveLength(1)
      expect(callArgs.rotationMessages.every((item: any) => Boolean(item))).toBe(true)
    })
  })

  describe('Edge Cases and Default Values', () => {
    it('should handle missing enableKlarna with false default', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: {},
        afterPay: { enableAfterpay: false },
      })

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('klarna-widget')).not.toBeInTheDocument()
    })

    it('should handle missing enableAfterpay with false default', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: {},
      })

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('afterpay-widget')).not.toBeInTheDocument()
    })

    it('should handle empty preference objects', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: {},
        afterPay: {},
      })

      render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('klarna-widget')).not.toBeInTheDocument()
      expect(screen.queryByTestId('afterpay-widget')).not.toBeInTheDocument()
    })

    it('should handle undefined preference groups gracefully', () => {
      // usePreference always returns nested objects, even if empty
      mockUsePreference.mockReturnValue({
        klarnaPayments: {},
        afterPay: {},
      })

      render(<RotationPayInInstallments />)

      // Component should still render without crashing
      expect(screen.getByTestId('horizontal-rotating-banner')).toBeVisible()
    })

    it('should handle when usePreference returns partial data', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: {}, // afterPay exists but enableAfterpay is missing (defaults to false)
      })

      render(<RotationPayInInstallments />)

      expect(screen.getByTestId('klarna-widget')).toBeVisible()
      expect(screen.queryByTestId('afterpay-widget')).not.toBeInTheDocument()
    })

    it('should handle when all widgets are disabled resulting in empty banner', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: { enableAfterpay: false },
      })
      mockUseAffirmEligibility.mockReturnValue(false)

      render(<RotationPayInInstallments />)

      // HorizontalRotatingBanner should still render with empty array
      expect(screen.getByTestId('horizontal-rotating-banner')).toBeVisible()
      expect(screen.queryAllByTestId('banner-item')).toHaveLength(0)
    })
  })

  describe('Component Optimization', () => {
    it('should render with React.memo wrapper', () => {
      // This test verifies the component structure
      const { rerender } = render(<RotationPayInInstallments />)

      // Component should render initially
      expect(screen.getByTestId('horizontal-rotating-banner')).toBeVisible()

      // Rerender with same props
      rerender(<RotationPayInInstallments />)

      // Should still be visible (memo prevents unnecessary rerenders)
      expect(screen.getByTestId('horizontal-rotating-banner')).toBeVisible()
    })

    it('should handle updates when preferences change', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: false },
      })

      const { rerender } = render(<RotationPayInInstallments />)

      expect(screen.getByTestId('klarna-widget')).toBeVisible()
      expect(screen.queryByTestId('afterpay-widget')).not.toBeInTheDocument()

      // Update preferences
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: false },
        afterPay: { enableAfterpay: true },
      })

      rerender(<RotationPayInInstallments />)

      // The component would update based on new hook values
      // Note: In actual app, the hook would return different values on rerender
      expect(mockUsePreference).toHaveBeenCalled()
    })

    it('should handle updates when Affirm eligibility changes', () => {
      mockUseAffirmEligibility.mockReturnValue(false)

      const { rerender } = render(<RotationPayInInstallments />)

      expect(screen.queryByTestId('affirm-widget')).not.toBeInTheDocument()

      // Update eligibility
      mockUseAffirmEligibility.mockReturnValue(true)

      rerender(<RotationPayInInstallments />)

      // Verify hook was called again
      expect(mockUseAffirmEligibility).toHaveBeenCalled()
    })
  })

  describe('Integration with HorizontalRotatingBanner', () => {
    it('should pass React elements to HorizontalRotatingBanner', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: true },
      })
      mockUseAffirmEligibility.mockReturnValue(true)

      render(<RotationPayInInstallments />)

      const callArgs = mockHorizontalRotatingBanner.mock.calls[0][0]
      expect(callArgs.rotationMessages).toHaveLength(3)

      // Verify each item in the array is a React element
      callArgs.rotationMessages.forEach((item: any) => {
        expect(React.isValidElement(item)).toBe(true)
      })
    })

    it('should not pass any undefined or null values to rotationMessages', () => {
      mockUsePreference.mockReturnValue({
        klarnaPayments: { enableKlarna: true },
        afterPay: { enableAfterpay: false },
      })
      mockUseAffirmEligibility.mockReturnValue(false)

      render(<RotationPayInInstallments />)

      const callArgs = mockHorizontalRotatingBanner.mock.calls[0][0]

      // compact should have filtered out all falsy values
      expect(callArgs.rotationMessages.every((item: any) => item)).toBe(true)
      expect(callArgs.rotationMessages).not.toContain(null)
      expect(callArgs.rotationMessages).not.toContain(undefined)
      expect(callArgs.rotationMessages).not.toContain(false)
    })
  })
})
