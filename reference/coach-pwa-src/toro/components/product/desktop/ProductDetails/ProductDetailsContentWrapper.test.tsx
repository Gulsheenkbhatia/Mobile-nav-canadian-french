import React from 'react'
import { render, screen } from 'test-utils/react'
import ProductDetailsContentWrapper from './ProductDetailsContentWrapper'
import { useBreakpointValue } from '@chakra-ui/react'
import { productDataAtom, selectedVariantAtom } from 'store/pdp.atom'

// Mock dependencies
jest.mock('@chakra-ui/react', () => ({
  ...(jest.requireActual('@chakra-ui/react') as Record<string, unknown>),
  useBreakpointValue: jest.fn(),
  Box: ({ children, maxWidth, sx, ...props }: any) => (
    <div style={{ maxWidth, ...sx }} {...props}>
      {children}
    </div>
  ),
}))

const TestChild = ({ children, loadStrategy }: any) => (
  <div data-load-strategy={loadStrategy}>{children}</div>
)

jest.mock('toro/components/Flex', () => ({ children, ...props }: any) => (
  <div data-qa="flex-wrapper" {...props}>
    {children}
  </div>
))

jest.mock('@splidejs/react-splide', () => {
  const React = jest.requireActual('react')
  const Splide = React.forwardRef(({ children, ...props }: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      go: jest.fn(),
    }))
    return <div data-qa="splide-wrapper">{children}</div>
  })
  return {
    Splide,
    SplideSlide: ({ children }: any) => <div data-qa="splide-slide">{children}</div>,
    SplideTrack: ({ children }: any) => <div data-qa="splide-track">{children}</div>,
  }
})

jest.mock('toro/components/product/CustomSliderPagination', () => () => (
  <div data-qa="custom-pagination" />
))

jest.mock('toro/analytics/ImpressionSensor', () => ({ children, onVisible }: any) => {
  // Simulate visibility immediately for testing
  const { useEffect } = jest.requireActual('react')
  useEffect(() => {
    onVisible && onVisible()
  }, [onVisible])
  return <div data-qa="impression-sensor">{children}</div>
})

describe('ProductDetailsContentWrapper', () => {
  const mockOnMove = jest.fn()
  const defaultProps = {
    styles: {},
    onMove: mockOnMove,
    hasCardDetails: false,
    options: {},
    customPaginationVariant: 'desktop',
    customPagination: true,
  }

  const jotaiContext = new Map()
  jotaiContext.set(productDataAtom, {
    templates: { mobile: 'default', desktop: 'default' },
  })
  jotaiContext.set(selectedVariantAtom, { id: 'variant-123' })

  const defaultContexts = {
    JotaiProviderContext: jotaiContext,
    PWAContext: {},
    AnalyticsContext: {},
    ViewportContext: {},
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders SectionSlider when breakpoint is base (mobile)', () => {
    jest.mocked(useBreakpointValue).mockReturnValue('slider')

    render(
      <ProductDetailsContentWrapper {...defaultProps}>
        <TestChild>Child 1</TestChild>
        <TestChild>Child 2</TestChild>
      </ProductDetailsContentWrapper>,
      { contexts: defaultContexts }
    )

    // Check if Splide (part of SectionSlider) is rendered
    expect(screen.getByTestId('splide-wrapper')).toBeVisible()
    // Check children are rendered inside slides
    expect(screen.getAllByText(/Child \d/)).toHaveLength(2)
  })

  it('renders Flex when breakpoint is desktopMax', () => {
    jest.mocked(useBreakpointValue).mockReturnValue('flex')

    render(
      <ProductDetailsContentWrapper {...defaultProps}>
        <TestChild>Child 1</TestChild>
        <TestChild>Child 2</TestChild>
      </ProductDetailsContentWrapper>,
      { contexts: defaultContexts }
    )

    // Check if Flex wrapper is rendered
    expect(screen.getByTestId('flex-wrapper')).toBeVisible()
    // Check children are rendered
    expect(screen.getAllByText(/Child \d/)).toHaveLength(2)
  })

  it('wraps content in ImpressionSensor when hasCardDetails is true', () => {
    jest.mocked(useBreakpointValue).mockReturnValue('flex')
    const mockAnalyticsSend = jest.fn()

    render(
      <ProductDetailsContentWrapper {...defaultProps} hasCardDetails={true}>
        <TestChild>Child 1</TestChild>
      </ProductDetailsContentWrapper>,
      {
        contexts: {
          ...defaultContexts,
          AnalyticsContext: { send: mockAnalyticsSend },
        },
      }
    )

    // Check if ImpressionSensor is rendered
    expect(screen.getByTestId('impression-sensor')).toBeVisible()

    // Since we mocked ImpressionSensor to trigger onVisible immediately, check analytics call
    expect(mockAnalyticsSend).toHaveBeenCalledWith('productInteraction', {
      eventAction: 'visual product details impression',
      eventLabel: 'variant-123',
      eventLocation: 'product',
    })
  })

  it('does not wrap content in ImpressionSensor when hasCardDetails is false', () => {
    jest.mocked(useBreakpointValue).mockReturnValue('flex')

    render(
      <ProductDetailsContentWrapper {...defaultProps} hasCardDetails={false}>
        <TestChild>Child 1</TestChild>
      </ProductDetailsContentWrapper>,
      { contexts: defaultContexts }
    )

    // Check if ImpressionSensor is NOT rendered
    expect(screen.queryByTestId('impression-sensor')).not.toBeInTheDocument()
    // Content should still be there
    expect(screen.getByText('Child 1')).toBeVisible()
  })

  it('passes correct props to SectionSlider', () => {
    jest.mocked(useBreakpointValue).mockReturnValue('slider')

    render(
      <ProductDetailsContentWrapper
        {...defaultProps}
        customPagination={false}
        customPaginationVariant="mobile"
      >
        <TestChild>Child 1</TestChild>
      </ProductDetailsContentWrapper>,
      { contexts: defaultContexts }
    )

    // Verify pagination is not rendered if customPagination is false
    expect(screen.queryByTestId('custom-pagination')).not.toBeInTheDocument()
  })
})
