import { render, screen } from 'test-utils/react'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'

// Mock external dependencies
jest.mock('jotai/utils')
jest.mock('toro/helpers/getPromoByType')
jest.mock('toro/hooks/useProductData')
jest.mock('toro/components/product/CallOutMessage/CallOutMessagePDP', () => ({
  __esModule: true,
  default: ({ promoText, masterId, variant }: any) => (
    <div
      data-qa="callout-message"
      data-testid="callout-message"
      data-promo-count={promoText?.length || 0}
      data-master-id={masterId}
      data-variant={variant}
    >
      Mocked CallOutMessage
    </div>
  ),
}))

// Import after mocking
import { useAtomValue } from 'jotai/utils'
import PromoCallout from './index'
import getPromoByType from 'toro/helpers/getPromoByType'
import useProductData from 'toro/hooks/useProductData'

// Mock data
const PROMOS_MOCK = [
  {
    'call-out-message': {
      content: {
        text: '<span data-otd="true">$157.50</span> With Extra 15% Off IPX1 ',
        spanText: '<span data-otd="true">$157.50</span>',
        scriptContent: '',
        mainHtml:
          '<html><head></head><body><span data-otd="true">$157.50</span> With Extra 15% Off IPX1 </body></html>',
        isPromoModal: false,
        shouldInjectJquery: null,
        isOTD: true,
        OTDPrice: '$157.50',
        promo: {
          type: 'IPX1',
        },
        styles: null,
      },
      config: {
        device: 'All',
      },
      id: 'call-out-message',
    },
  },
  {
    'call-out-message': {
      content: {
        text: '<span data-otd="true">$157.50</span> With Extra 15% Off IPX2 ',
        spanText: '<span data-otd="true">$157.50</span>',
        scriptContent: '',
        mainHtml:
          '<html><head></head><body><span data-otd="true">$157.50</span> With Extra 15% Off IPX2 </body></html>',
        isPromoModal: false,
        shouldInjectJquery: null,
        isOTD: true,
        OTDPrice: '$157.50',
        promo: {
          type: 'IPX2',
        },
        styles: null,
      },
      config: {
        device: 'All',
      },
      id: 'call-out-message',
    },
  },
  {
    'call-out-message': {
      content: {
        text: '<span data-otd="true">$157.50</span> With Extra 15% Off RB ',
        spanText: '<span data-otd="true">$157.50</span>',
        scriptContent: '',
        mainHtml:
          '<html><head></head><body><span data-otd="true">$157.50</span> With Extra 15% Off RB </body></html>',
        isPromoModal: false,
        shouldInjectJquery: null,
        isOTD: true,
        OTDPrice: '$157.50',
        promo: {
          type: 'RB',
        },
        styles: null,
      },
      config: {
        device: 'All',
      },
      id: 'call-out-message',
    },
  },
]

// TypeScript interfaces
interface MockSetup {
  promoArr: typeof PROMOS_MOCK | []
  masterId: string | null
  filteredPromos: typeof PROMOS_MOCK | []
}

describe('PromoCallout', () => {
  // Get mocked functions
  const mockUseAtomValue = jest.mocked(useAtomValue)
  const mockGetPromoByType = jest.mocked(getPromoByType)
  const mockUseProductData = jest.mocked(useProductData)

  const defaultMockSetup: MockSetup = {
    promoArr: PROMOS_MOCK,
    masterId: 'TEST-MASTER-ID-123',
    filteredPromos: [PROMOS_MOCK[0]], // Default to IPX1 promo
  }

  const setupMocks = (setup: Partial<MockSetup> = {}) => {
    const mockSetup = { ...defaultMockSetup, ...setup }

    mockUseAtomValue.mockReturnValue(mockSetup.promoArr)
    mockUseProductData.mockReturnValue(mockSetup.masterId)
    mockGetPromoByType.mockReturnValue(mockSetup.filteredPromos)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    setupMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing with valid props', () => {
      render(<PromoCallout promoType="IPX1" />)

      expect(screen.getByText('Mocked CallOutMessage')).toBeVisible()
    })

    it('should render with correct default variant', () => {
      render(<PromoCallout promoType="IPX1" />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).toHaveAttribute('data-variant', 'pdpV4Rotation')
      expect(calloutElement).toHaveAttribute('data-master-id', 'TEST-MASTER-ID-123')
      expect(calloutElement).toHaveAttribute('data-promo-count', '1')
    })

    it('should render with custom variant', () => {
      render(<PromoCallout promoType="IPX1" variant="pdpV5_1" />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).toHaveAttribute('data-variant', 'pdpV5_1')
    })

    it('should pass correct promo data attributes', () => {
      const filteredPromos = [PROMOS_MOCK[1]] // IPX2 promo
      setupMocks({ filteredPromos })

      render(<PromoCallout promoType="IPX2" />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).toHaveAttribute('data-promo-count', '1')
      expect(calloutElement).toHaveAttribute('data-master-id', 'TEST-MASTER-ID-123')
      expect(calloutElement).toHaveAttribute('data-variant', 'pdpV4Rotation')
    })
  })

  describe('Props Handling', () => {
    it('should handle all valid promo types', () => {
      const promoTypes: Array<'IPX1' | 'IPX2' | 'RB' | 'UPL'> = ['IPX1', 'IPX2', 'RB', 'UPL']

      promoTypes.forEach((promoType) => {
        const { unmount } = render(<PromoCallout promoType={promoType} />)

        expect(mockGetPromoByType).toHaveBeenCalledWith(PROMOS_MOCK, promoType)

        unmount()
        jest.clearAllMocks()
        setupMocks()
      })
    })

    it('should use default variant when not provided', () => {
      render(<PromoCallout promoType="IPX1" />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).toHaveAttribute('data-variant', 'pdpV4Rotation')
    })

    it('should accept custom variant values', () => {
      const customVariants = ['pdpV5_1', 'underATBPromo', 'customVariant']

      customVariants.forEach((variant) => {
        const { unmount } = render(<PromoCallout promoType="IPX1" variant={variant} />)

        const calloutElement = screen.getByTestId('callout-message')
        expect(calloutElement).toHaveAttribute('data-variant', variant)

        unmount()
        jest.clearAllMocks()
        setupMocks()
      })
    })

    it('should handle undefined variant gracefully', () => {
      render(<PromoCallout promoType="IPX1" variant={undefined} />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).toHaveAttribute('data-variant', 'pdpV4Rotation')
    })
  })

  describe('Conditional Rendering', () => {
    it('should return null when promoType is not provided', () => {
      render(<PromoCallout />)

      expect(screen.queryByText('Mocked CallOutMessage')).not.toBeInTheDocument()
      expect(mockGetPromoByType).not.toHaveBeenCalled()
    })

    it('should return null when promoType is null', () => {
      render(<PromoCallout promoType={null as any} />)

      expect(screen.queryByText('Mocked CallOutMessage')).not.toBeInTheDocument()
      expect(mockGetPromoByType).not.toHaveBeenCalled()
    })

    it('should return null when promoType is undefined', () => {
      render(<PromoCallout promoType={undefined} />)

      expect(screen.queryByText('Mocked CallOutMessage')).not.toBeInTheDocument()
      expect(mockGetPromoByType).not.toHaveBeenCalled()
    })

    it('should return null when no promotional content is found', () => {
      setupMocks({ filteredPromos: [] })

      render(<PromoCallout promoType="IPX1" />)

      expect(screen.queryByText('Mocked CallOutMessage')).not.toBeInTheDocument()
      expect(mockGetPromoByType).toHaveBeenCalledWith(PROMOS_MOCK, 'IPX1')
    })

    it('should return null when getPromoByType returns null', () => {
      setupMocks({ filteredPromos: null as any })

      render(<PromoCallout promoType="IPX1" />)

      expect(screen.queryByText('Mocked CallOutMessage')).not.toBeInTheDocument()
    })

    it('should render when valid promotional content exists', () => {
      const filteredPromos = [PROMOS_MOCK[2]] // RB promo
      setupMocks({ filteredPromos })

      render(<PromoCallout promoType="RB" />)

      expect(screen.getByText('Mocked CallOutMessage')).toBeVisible()
    })
  })

  describe('State Management Integration', () => {
    it('should call useAtomValue to get promotional data', () => {
      render(<PromoCallout promoType="IPX1" />)

      expect(mockUseAtomValue).toHaveBeenCalledTimes(1)
    })

    it('should call useProductData to get masterId', () => {
      render(<PromoCallout promoType="IPX1" />)

      expect(mockUseProductData).toHaveBeenCalledWith('masterId')
    })

    it('should handle empty promotional data array from atom', () => {
      setupMocks({ promoArr: [], filteredPromos: [] })

      render(<PromoCallout promoType="IPX1" />)

      expect(mockGetPromoByType).toHaveBeenCalledWith([], 'IPX1')
      expect(screen.queryByText('Mocked CallOutMessage')).not.toBeInTheDocument()
    })

    it('should handle null promotional data from atom', () => {
      setupMocks({ promoArr: null as any, filteredPromos: [] })

      render(<PromoCallout promoType="IPX1" />)

      expect(mockGetPromoByType).toHaveBeenCalledWith(null, 'IPX1')
      expect(screen.queryByText('Mocked CallOutMessage')).not.toBeInTheDocument()
    })
  })

  describe('Data Filtering and Transformation', () => {
    it('should call getPromoByType with correct parameters', () => {
      render(<PromoCallout promoType="IPX2" />)

      expect(mockGetPromoByType).toHaveBeenCalledWith(PROMOS_MOCK, 'IPX2')
    })

    it('should handle multiple promotional items of the same type', () => {
      const multiplePromos = [PROMOS_MOCK[0], PROMOS_MOCK[0]] // Two IPX1 promos
      setupMocks({ filteredPromos: multiplePromos })

      render(<PromoCallout promoType="IPX1" />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).toHaveAttribute('data-promo-count', '2')
    })

    it('should handle mixed promotional data with different types', () => {
      const mixedPromos = [PROMOS_MOCK[1]] // IPX2 promo when requesting IPX1
      setupMocks({ filteredPromos: mixedPromos })

      render(<PromoCallout promoType="IPX1" />)

      expect(mockGetPromoByType).toHaveBeenCalledWith(PROMOS_MOCK, 'IPX1')
      expect(screen.getByText('Mocked CallOutMessage')).toBeVisible()
    })
  })

  describe('Error Handling', () => {
    it('should handle missing masterId gracefully', () => {
      setupMocks({ masterId: null })

      render(<PromoCallout promoType="IPX1" />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).not.toHaveAttribute('data-master-id')
    })

    it('should handle empty string masterId', () => {
      setupMocks({ masterId: '' })

      render(<PromoCallout promoType="IPX1" />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).toHaveAttribute('data-master-id', '')
    })

    it('should handle undefined masterId', () => {
      setupMocks({ masterId: undefined as any })

      render(<PromoCallout promoType="IPX1" />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).not.toHaveAttribute('data-master-id')
    })

    it('should handle malformed promotional data structure', () => {
      const malformedPromos = [
        {
          'invalid-structure': {
            content: null,
          },
        },
      ] as any
      setupMocks({ filteredPromos: malformedPromos })

      render(<PromoCallout promoType="IPX1" />)

      expect(screen.getByText('Mocked CallOutMessage')).toBeVisible()
    })
  })

  describe('Edge Cases', () => {
    it('should handle invalid promo type gracefully', () => {
      render(<PromoCallout promoType={'INVALID_TYPE' as any} />)

      expect(mockGetPromoByType).toHaveBeenCalledWith(PROMOS_MOCK, 'INVALID_TYPE')
    })

    it('should handle empty string promo type', () => {
      render(<PromoCallout promoType={'' as any} />)

      // Empty string is falsy, so component should return null before calling getPromoByType
      expect(screen.queryByText('Mocked CallOutMessage')).not.toBeInTheDocument()
      expect(mockGetPromoByType).not.toHaveBeenCalled()
    })

    it('should handle promotional data with missing required fields', () => {
      const incompletePromos = [
        {
          'call-out-message': {
            content: {
              // Missing text, spanText, and promo type
              isPromoModal: false,
            },
          },
        },
      ] as any
      setupMocks({ filteredPromos: incompletePromos })

      render(<PromoCallout promoType="IPX1" />)

      expect(screen.getByText('Mocked CallOutMessage')).toBeVisible()
    })

    it('should handle promotional data with null content', () => {
      const nullContentPromos = [
        {
          'call-out-message': {
            content: null,
          },
        },
      ] as any
      setupMocks({ filteredPromos: nullContentPromos })

      render(<PromoCallout promoType="IPX1" />)

      expect(screen.getByText('Mocked CallOutMessage')).toBeVisible()
    })

    it('should handle very long variant strings', () => {
      const longVariant = 'very-long-variant-name-that-exceeds-normal-length-expectations'

      render(<PromoCallout promoType="IPX1" variant={longVariant} />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).toHaveAttribute('data-variant', longVariant)
    })

    it('should handle special characters in variant', () => {
      const specialVariant = 'pdp-v5_1@special#variant$'

      render(<PromoCallout promoType="IPX1" variant={specialVariant} />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).toHaveAttribute('data-variant', specialVariant)
    })
  })

  describe('Integration with PROMO_TYPES', () => {
    it('should work with all defined PROMO_TYPES constants', () => {
      const PROMO_TYPES_VALUES = ['IPX1', 'IPX2', 'RB', 'UPL']

      PROMO_TYPES_VALUES.forEach((promoType) => {
        const { unmount } = render(<PromoCallout promoType={promoType as any} />)

        expect(mockGetPromoByType).toHaveBeenCalledWith(PROMOS_MOCK, promoType)

        unmount()
        jest.clearAllMocks()
        setupMocks()
      })
    })

    it('should handle UPL promo type specifically', () => {
      render(<PromoCallout promoType="UPL" />)

      expect(mockGetPromoByType).toHaveBeenCalledWith(PROMOS_MOCK, 'UPL')
    })
  })

  describe('Component Dependencies', () => {
    it('should use correct import paths for dependencies', () => {
      render(<PromoCallout promoType="IPX1" />)

      // Verify that all mocked dependencies are called
      expect(mockUseAtomValue).toHaveBeenCalled()
      expect(mockUseProductData).toHaveBeenCalled()
      expect(mockGetPromoByType).toHaveBeenCalled()
    })

    it('should render with expected DOM structure', () => {
      render(<PromoCallout promoType="RB" variant="customVariant" />)

      const calloutElement = screen.getByTestId('callout-message')
      expect(calloutElement).toHaveAttribute('data-variant', 'customVariant')
      expect(calloutElement).toHaveAttribute('data-master-id', 'TEST-MASTER-ID-123')
      expect(calloutElement).toHaveAttribute('data-promo-count', '1')
    })
  })
})
