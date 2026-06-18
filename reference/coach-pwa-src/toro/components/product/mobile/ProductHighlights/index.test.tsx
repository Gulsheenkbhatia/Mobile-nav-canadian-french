import React from 'react'
import { render, screen, fireEvent } from 'test-utils/react'
import ProductHighlights from './index'
import { useAtomValue } from 'jotai/utils'
import useAnalytics from 'toro/analytics/useAnalytics'

// Mock hooks
jest.mock('toro/analytics/useAnalytics', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/hooks/useSelectedVariantData', () => () => 'variant-123')
jest.mock('toro/hooks/useProductData', () => () => 'product-123')

jest.mock('jotai/utils', () => {
  const original = jest.requireActual('jotai/utils')
  return {
    ...original,
    useAtomValue: jest.fn(),
  }
})

jest.mock('store/pdp.atom', () => ({
  isMegaPDPEligibleAtom: 'isMegaPDPEligibleAtom',
  isNewMegaPDPEligibleAtom: 'isNewMegaPDPEligibleAtom',
  productCardDetailsAtom: 'productCardDetailsAtom',
  skuIdAtom: 'skuIdAtom',
  tangibleeDataAtom: 'tangibleeDataAtom',
}))

jest.mock('store/global.atom', () => ({
  isSubBrandActiveAtom: 'isSubBrandActiveAtom',
}))

jest.mock('store/image-placeholder.atom', () => ({
  imagePlaceholderUrlAtom: 'imagePlaceholderUrlAtom',
}))

jest.mock('toro/hooks/usePreference_new', () => () => ({
  tangiblee: { enableStrategicTangiblee: false },
  priceSitePreferences: { hideListPrice: false },
}))

jest.mock('toro/hooks/useVariantGroupData', () => () => [false, false])

jest.mock('toro/hooks/useTemplate', () => ({
  __esModule: true,
  default: () => false,
}))

// Mock Intersection Observer
jest.mock('react-intersection-observer', () => ({
  InView: ({ children }) => {
    if (typeof children === 'function') {
      return children({ inView: true, ref: null })
    }
    return children
  },
}))

// Mock Chakra Breakpoint
jest.mock('@chakra-ui/react', () => {
  const original = jest.requireActual('@chakra-ui/react')
  return {
    ...original,
    useBreakpointValue: jest.fn().mockReturnValue('slider'),
  }
})

jest.mock('toro/hooks/useViewportType', () => () => ({
  isMobile: true,
  isDesktop: false,
}))

// Mock Splide because it relies on layout engines not present in JSDOM
jest.mock('@splidejs/react-splide', () => {
  const React = jest.requireActual('react')
  return {
    Splide: React.forwardRef(({ children, onMove }, ref) => {
      React.useImperativeHandle(ref, () => ({
        go: jest.fn(),
      }))
      return (
        <div data-qa="splide-mock">
          <button
            className="splide__arrow splide__arrow--next"
            onClick={() => onMove && onMove(null, 1)}
            data-qa="splide-move-button"
          >
            Move Slide
          </button>
          {children}
        </div>
      )
    }),
    SplideSlide: ({ children }) => <div data-qa="splide-slide">{children}</div>,
    SplideTrack: ({ children }) => <div data-qa="splide-track">{children}</div>,
  }
})

describe('ProductHighlights', () => {
  const mockAnalyticsSend = jest.fn()

  const mockCardDetails = [
    {
      title: 'Card 1 Title',
      subtitle: 'Card 1 Subtitle',
      image: 'image1.jpg',
      styleVariant: 'tooltip',
      hotspots: [
        {
          title: 'Hotspot 1',
          x: 10,
          y: 10,
        },
      ],
    },
    {
      title: 'Card 2 Title',
      subtitle: 'Card 2 Subtitle',
      image: 'image2.jpg',
      hotspots: [],
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAnalytics as jest.Mock).mockReturnValue({
      send: mockAnalyticsSend,
    })
  })

  it('renders nothing when productCardDetails is empty', () => {
    ;(useAtomValue as jest.Mock).mockImplementation((atom) => {
      if (atom === 'productCardDetailsAtom') return []
      return false
    })

    render(<ProductHighlights />)
    expect(screen.queryByText('Product highlights')).not.toBeInTheDocument()
  })

  it('renders nothing when productCardDetails is null', () => {
    ;(useAtomValue as jest.Mock).mockImplementation((atom) => {
      if (atom === 'productCardDetailsAtom') return null
      return false
    })

    render(<ProductHighlights />)
    expect(screen.queryByText('Product highlights')).not.toBeInTheDocument()
  })

  it('renders product highlights when data is present', () => {
    ;(useAtomValue as jest.Mock).mockImplementation((atom) => {
      if (atom === 'productCardDetailsAtom') return mockCardDetails
      if (atom === 'tangibleeDataAtom') return {}
      return false
    })

    render(<ProductHighlights />)

    // Check for main title
    expect(screen.getByText('Product highlights')).toBeVisible()

    // Check for card content (rendered by real ProductCard)
    expect(screen.getByText('Card 1 Title')).toBeVisible()

    // Check for hotspot (rendered by real HotSpotBadge)
    const hotspots = document.getElementsByClassName('hotspot-wrapper')
    expect(hotspots.length).toBeGreaterThan(0)
  })

  it('sends analytics event on move', () => {
    ;(useAtomValue as jest.Mock).mockImplementation((atom) => {
      if (atom === 'productCardDetailsAtom') return mockCardDetails
      if (atom === 'tangibleeDataAtom') return {}
      return false
    })

    const { container } = render(<ProductHighlights />)

    const moveButton = container.querySelector('.splide__arrow.splide__arrow--next')
    fireEvent.click(moveButton as Element)

    expect(mockAnalyticsSend).toHaveBeenCalledWith(
      'productInteraction',
      expect.objectContaining({
        eventAction: 'visual product details swipe',
      })
    )
  })

  it('sends analytics event on hotspot click', () => {
    ;(useAtomValue as jest.Mock).mockImplementation((atom) => {
      if (atom === 'productCardDetailsAtom') return mockCardDetails
      if (atom === 'tangibleeDataAtom') return {}
      return false
    })

    render(<ProductHighlights />)

    const hotspotWrapper = document.querySelector('.hotspot-wrapper')
    const clickableElement = hotspotWrapper?.firstChild as Element

    if (clickableElement) {
      fireEvent.click(clickableElement)
    }

    expect(mockAnalyticsSend).toHaveBeenCalledWith(
      'productInteraction',
      expect.objectContaining({
        event: 'product_interaction',
        eventAction: 'visual product details hotspot click',
        eventLabel: 'product-123',
      })
    )
  })

  it('uses correct event location for mega pdp', () => {
    ;(useAtomValue as jest.Mock).mockImplementation((atom) => {
      if (atom === 'productCardDetailsAtom') return mockCardDetails
      if (atom === 'isMegaPDPEligibleAtom') return true
      if (atom === 'tangibleeDataAtom') return {}
      return false
    })

    render(<ProductHighlights />)

    const hotspotWrapper = document.querySelector('.hotspot-wrapper')
    const clickableElement = hotspotWrapper?.firstChild as Element

    if (clickableElement) {
      fireEvent.click(clickableElement)
    }

    expect(mockAnalyticsSend).toHaveBeenCalledWith(
      'productInteraction',
      expect.objectContaining({
        eventLocation: 'mega product',
      })
    )
  })
})
