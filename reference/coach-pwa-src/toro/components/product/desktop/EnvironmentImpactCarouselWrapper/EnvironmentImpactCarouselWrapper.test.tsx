import React from 'react'
import { render, screen, cleanup } from 'test-utils/react'
import EnvironmentImpactCarouselWrapper from './index'
import useProductData from 'toro/hooks/useProductData'
import { useAtomValue } from 'jotai/utils'

// Mock the required hooks
jest.mock('toro/hooks/useProductData')
jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithDefault: jest.fn(),
  atomWithStorage: jest.fn(),
  loadable: jest.fn(),
  selectAtom: jest.fn(),
  atomFamily: jest.fn(),
  createJSONStorage: jest.fn(),
}))

jest.mock('toro/helpers/getCurrentLocale', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((locale) => ({ locale })),
}))
jest.mock('toro/components/passport/EnvironmentImpactCarousel', () => ({
  __esModule: true,
  default: ({ impacts, title, locale, rotateGlobeIcon, location, variant }) => (
    <div data-qa="env-impact-carousel">
      <div data-qa="impacts">{JSON.stringify(impacts)}</div>
      <div data-qa="title">{title}</div>
      <div data-qa="locale">{locale}</div>
      <div data-qa="rotate-globe-icon">{rotateGlobeIcon}</div>
      <div data-qa="location">{location}</div>
      <div data-qa="variant">{variant}</div>
    </div>
  ),
}))

describe('EnvironmentImpactCarouselWrapper', () => {
  const mockEnvImpactSlides = [
    {
      id: '1',
      title: 'Carbon Impact',
      description: 'This product reduces carbon emissions',
      icon: '<svg>C</svg>',
      iconAlt: 'Carbon icon',
    },
    {
      id: '2',
      title: 'Water Impact',
      description: 'This product saves water',
      icon: '<svg>W</svg>',
      iconAlt: 'Water icon',
    },
  ]

  const mockEnvImpactModalHeadline = 'Environmental Impact'
  const mockRotateGlobeIcon = '<svg>Globe</svg>'

  const mockContexts = {
    PWAContext: {
      appData: {
        locale: 'en-US',
        coachtopiaRotatingGlobeV4: mockRotateGlobeIcon,
      },
    },
  }

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Setup default mock implementations
    ;(useProductData as jest.Mock).mockReturnValue([
      mockEnvImpactSlides,
      mockEnvImpactModalHeadline,
    ])
    ;(useAtomValue as jest.Mock).mockReturnValue(true) // Default isSubBrandActive to true
  })

  afterEach(() => {
    cleanup()
  })

  it('should render the EnvironmentImpactCarousel with correct props', () => {
    render(<EnvironmentImpactCarouselWrapper location="pdp-test" variant="test-variant" />, {
      contexts: mockContexts,
    })

    // Check that the component is rendered
    expect(screen.getByTestId('env-impact-carousel')).toBeInTheDocument()

    // Check that the correct props are passed
    expect(JSON.parse(screen.getByTestId('impacts').textContent || '[]')).toEqual(
      mockEnvImpactSlides
    )
    expect(screen.getByTestId('title').textContent).toBe(mockEnvImpactModalHeadline)
    expect(screen.getByTestId('locale').textContent).toBe('en_US')
    expect(screen.getByTestId('rotate-globe-icon').textContent).toBe(mockRotateGlobeIcon)
    expect(screen.getByTestId('location').textContent).toBe('pdp-test')
    expect(screen.getByTestId('variant').textContent).toBe('test-variant')
  })

  it('should not render when isSubBrandActive is false', () => {
    ;(useAtomValue as jest.Mock).mockReturnValue(false)

    const { container } = render(<EnvironmentImpactCarouselWrapper />, {
      contexts: mockContexts,
    })

    // Component should not render anything
    expect(container.firstChild).not.toBeVisible()
  })

  it('should not render when no impact slides are available', () => {
    ;(useProductData as jest.Mock).mockReturnValue([[], mockEnvImpactModalHeadline])

    const { container } = render(<EnvironmentImpactCarouselWrapper />, {
      contexts: mockContexts,
    })

    // Component should not render anything
    expect(container.firstChild).not.toBeVisible()
  })

  it('should use default location when not provided', () => {
    render(<EnvironmentImpactCarouselWrapper variant="test-variant" />, {
      contexts: mockContexts,
    })

    // Check that the default location is used
    expect(screen.getByTestId('location').textContent).toBe('product')
  })

  it('should correctly format locale from PWA context', () => {
    const customContexts = {
      PWAContext: {
        appData: {
          locale: 'en-US',
          coachtopiaRotatingGlobeV4: mockRotateGlobeIcon,
        },
      },
    }

    render(<EnvironmentImpactCarouselWrapper />, {
      contexts: customContexts,
    })

    // Check that the locale is correctly formatted from en-US to en_US
    expect(screen.getByTestId('locale').textContent).toBe('en_US')
  })

  it('should pass variant prop correctly to EnvironmentImpactCarousel', () => {
    const testVariant = 'custom-variant'
    render(<EnvironmentImpactCarouselWrapper variant={testVariant} />, {
      contexts: mockContexts,
    })

    expect(screen.getByTestId('variant').textContent).toBe(testVariant)
  })

  it('should pass different location values correctly to EnvironmentImpactCarousel', () => {
    const locationValues = ['product', 'pdp', 'coachtopia passport', 'sustainability']

    locationValues.forEach((location) => {
      render(<EnvironmentImpactCarouselWrapper location={location} />, {
        contexts: mockContexts,
      })

      expect(screen.getByTestId('location').textContent).toBe(location)
      // Cleanup to prevent test interference
      cleanup()
    })
  })
})
