import React from 'react'
import { render, screen } from 'test-utils/react'
import '@testing-library/jest-dom'
import PromoRotationBanner from './index'

// Mock external dependencies
jest.mock('lodash/compact', () => jest.fn((arr) => arr.filter(Boolean)))

jest.mock('toro/components/product/CallOutMessage/CallOutMessagePDP', () =>
  jest.fn(({ promoText, masterId }) => (
    <div data-qa="mock-callout-message" data-master-id={masterId}>
      {promoText?.[0]?.['call-out-message']?.content?.text || 'Mock CallOut Message'}
    </div>
  ))
)

jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithDefault: jest.fn(),
  atomWithStorage: jest.fn(),
  selectAtom: jest.fn(),
  createJSONStorage: jest.fn(() => jest.fn()),
}))

jest.mock('toro/hooks/useProductData', () => jest.fn())

jest.mock('store/pdp.atom', () => ({
  promoCalloutsPDPAtom: {},
}))

jest.mock('toro/helpers/getPromoByType', () => ({
  __esModule: true,
  default: jest.fn(),
  PROMO_TYPES: {
    RB: 'RB',
    IPX1: 'IPX1',
    IPX2: 'IPX2',
    UPL: 'UPL',
  },
}))

jest.mock('toro/components/SplideSlider', () =>
  jest.fn(({ children, options, styles }) => (
    <div
      data-qa="mock-splide-slider"
      data-options={JSON.stringify(options)}
      data-styles={JSON.stringify(styles)}
    >
      {children}
    </div>
  ))
)

jest.mock('toro/components/Box', () =>
  jest.fn(({ children, sx, ...props }) => (
    <div data-qa="mock-box" data-styles={JSON.stringify(sx)} {...props}>
      {children}
    </div>
  ))
)

// Import the PROMO_TYPES for use in tests and get typed mock functions
import getPromoByType, { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import { useAtomValue } from 'jotai/utils'
import useProductData from 'toro/hooks/useProductData'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import SplideSlider from 'toro/components/SplideSlider'
import Box from 'toro/components/Box'
import compact from 'lodash/compact'

// Get typed mock functions
const mockUseAtomValue = jest.mocked(useAtomValue)
const mockUseProductData = jest.mocked(useProductData)
const mockGetPromoByType = jest.mocked(getPromoByType)
const mockCallOutMessage = jest.mocked(CallOutMessage)
const mockSplideSlider = jest.mocked(SplideSlider)
const mockBox = jest.mocked(Box)
const mockCompact = jest.mocked(compact)

// Mock data interfaces
interface MockPromoCallout {
  'call-out-message': {
    content: {
      text?: string
      promo?: {
        type?: string
      }
    }
  }
}

describe('PromoRotationBanner', () => {
  const mockMasterId = 'TEST123'
  const mockPromoCallouts: MockPromoCallout[] = [
    {
      'call-out-message': {
        content: {
          text: 'Test promo message 1',
          promo: {
            type: 'RB',
          },
        },
      },
    },
    {
      'call-out-message': {
        content: {
          text: 'Test promo message 2',
          promo: {
            type: 'RB',
          },
        },
      },
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations
    mockUseProductData.mockReturnValue(mockMasterId)
    mockUseAtomValue.mockReturnValue(mockPromoCallouts)
    mockGetPromoByType.mockReturnValue(mockPromoCallouts)

    // Mock compact to return the same array (filtering out falsy values)
    mockCompact.mockImplementation((arr) => (Array.isArray(arr) ? arr.filter(Boolean) : []))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<PromoRotationBanner />)

      expect(mockUseProductData).toHaveBeenCalledWith('masterId')
      expect(mockUseAtomValue).toHaveBeenCalled()
      expect(mockGetPromoByType).toHaveBeenCalledWith(mockPromoCallouts, PROMO_TYPES.RB)
    })

    it('should return null when there are no rotation messages', () => {
      mockGetPromoByType.mockReturnValue([])

      render(<PromoRotationBanner />)

      // Check that the component itself returns null by looking for our mock elements
      expect(screen.queryByTestId('mock-box')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mock-splide-slider')).not.toBeInTheDocument()
      expect(mockCallOutMessage).not.toHaveBeenCalled()
    })
  })

  describe('Single Message Rendering', () => {
    it('should render single message in Box when only one rotation message exists', () => {
      const singlePromo = [mockPromoCallouts[0]]
      mockGetPromoByType.mockReturnValue(singlePromo)

      render(<PromoRotationBanner />)

      expect(mockBox).toHaveBeenCalledWith(
        expect.objectContaining({
          sx: {
            m: 'var(--spacing-4) var(--spacing-3)',
            display: 'flex',
            justifyContent: 'center',
          },
          children: expect.anything(),
        }),
        expect.anything()
      )
      expect(mockSplideSlider).not.toHaveBeenCalled()
    })

    it('should pass correct styles to Box for single message', () => {
      const singlePromo = [mockPromoCallouts[0]]
      mockGetPromoByType.mockReturnValue(singlePromo)

      render(<PromoRotationBanner />)

      expect(mockBox).toHaveBeenCalledWith(
        expect.objectContaining({
          sx: {
            m: 'var(--spacing-4) var(--spacing-3)',
            display: 'flex',
            justifyContent: 'center',
          },
        }),
        expect.anything()
      )
    })
  })

  describe('Multiple Messages Rendering', () => {
    it('should render multiple messages in SplideSlider when more than one rotation message exists', () => {
      render(<PromoRotationBanner />)

      expect(mockSplideSlider).toHaveBeenCalledWith(
        expect.objectContaining({
          options: {
            type: 'slide',
            fixedWidth: '84%',
            gap: 'var(--spacing-3)',
            arrows: false,
            pagination: false,
            rewind: false,
          },
          styles: {
            container: {
              m: 'var(--spacing-4) 0 var(--spacing-4) var(--spacing-3)',
            },
          },
          children: expect.anything(),
        }),
        expect.anything()
      )
      expect(mockBox).not.toHaveBeenCalled()
    })

    it('should pass correct options to SplideSlider', () => {
      render(<PromoRotationBanner />)

      expect(mockSplideSlider).toHaveBeenCalledWith(
        expect.objectContaining({
          options: {
            type: 'slide',
            fixedWidth: '84%',
            gap: 'var(--spacing-3)',
            arrows: false,
            pagination: false,
            rewind: false,
          },
        }),
        expect.anything()
      )
    })

    it('should pass correct styles to SplideSlider', () => {
      render(<PromoRotationBanner />)

      expect(mockSplideSlider).toHaveBeenCalledWith(
        expect.objectContaining({
          styles: {
            container: {
              m: 'var(--spacing-4) 0 var(--spacing-4) var(--spacing-3)',
            },
          },
        }),
        expect.anything()
      )
    })
  })

  describe('Hook Integration', () => {
    it('should call useProductData with correct parameter', () => {
      render(<PromoRotationBanner />)

      expect(mockUseProductData).toHaveBeenCalledWith('masterId')
    })

    it('should call useAtomValue with promoCalloutsPDPAtom', () => {
      render(<PromoRotationBanner />)

      expect(mockUseAtomValue).toHaveBeenCalledWith(expect.objectContaining({}))
    })

    it('should call getPromoByType with correct parameters', () => {
      render(<PromoRotationBanner />)

      expect(mockGetPromoByType).toHaveBeenCalledWith(mockPromoCallouts, PROMO_TYPES.RB)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty promoContent gracefully', () => {
      mockGetPromoByType.mockReturnValue([])

      render(<PromoRotationBanner />)

      expect(screen.queryByTestId('mock-box')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mock-splide-slider')).not.toBeInTheDocument()
      expect(mockCallOutMessage).not.toHaveBeenCalled()
      expect(mockSplideSlider).not.toHaveBeenCalled()
      expect(mockBox).not.toHaveBeenCalled()
    })

    it('should handle null promoArr from atom gracefully', () => {
      mockUseAtomValue.mockReturnValue(null)
      mockGetPromoByType.mockReturnValue([])

      render(<PromoRotationBanner />)

      expect(screen.queryByTestId('mock-box')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mock-splide-slider')).not.toBeInTheDocument()
      expect(mockGetPromoByType).toHaveBeenCalledWith(null, PROMO_TYPES.RB)
    })

    it('should handle undefined promoArr from atom gracefully', () => {
      mockUseAtomValue.mockReturnValue(undefined)
      mockGetPromoByType.mockReturnValue([])

      render(<PromoRotationBanner />)

      expect(screen.queryByTestId('mock-box')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mock-splide-slider')).not.toBeInTheDocument()
      expect(mockGetPromoByType).toHaveBeenCalledWith(undefined, PROMO_TYPES.RB)
    })
  })

  describe('Component Integration', () => {
    it('should pass children to SplideSlider correctly', () => {
      render(<PromoRotationBanner />)

      expect(mockSplideSlider).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.any(Array),
        }),
        expect.anything()
      )
    })

    it('should render CallOutMessage components as children of Box for single message', () => {
      const singlePromo = [mockPromoCallouts[0]]
      mockGetPromoByType.mockReturnValue(singlePromo)

      render(<PromoRotationBanner />)

      expect(mockBox).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.any(Array),
        }),
        expect.anything()
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle errors from useProductData gracefully', () => {
      mockUseProductData.mockImplementation(() => {
        throw new Error('useProductData error')
      })

      expect(() => render(<PromoRotationBanner />)).toThrow('useProductData error')
    })

    it('should handle errors from useAtomValue gracefully', () => {
      mockUseAtomValue.mockImplementation(() => {
        throw new Error('useAtomValue error')
      })

      expect(() => render(<PromoRotationBanner />)).toThrow('useAtomValue error')
    })

    it('should handle errors from getPromoByType gracefully', () => {
      mockGetPromoByType.mockImplementation(() => {
        throw new Error('getPromoByType error')
      })

      expect(() => render(<PromoRotationBanner />)).toThrow('getPromoByType error')
    })
  })

  describe('Performance Considerations', () => {
    it('should not render SplideSlider when there is only one message', () => {
      const singlePromo = [mockPromoCallouts[0]]
      mockGetPromoByType.mockReturnValue(singlePromo)

      render(<PromoRotationBanner />)

      expect(mockSplideSlider).not.toHaveBeenCalled()
      expect(mockBox).toHaveBeenCalled()
    })

    it('should not render Box when there are multiple messages', () => {
      render(<PromoRotationBanner />)

      expect(mockBox).not.toHaveBeenCalled()
      expect(mockSplideSlider).toHaveBeenCalled()
    })

    it('should call compact to filter out falsy values efficiently', () => {
      render(<PromoRotationBanner />)

      expect(mockCompact).toHaveBeenCalled()
    })
  })
})
