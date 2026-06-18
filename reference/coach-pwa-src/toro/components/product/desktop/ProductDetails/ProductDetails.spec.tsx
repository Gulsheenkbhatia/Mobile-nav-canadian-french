import { render, screen } from 'test-utils/react'
import ProductDetails from 'toro/components/product/desktop/ProductDetails'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useTemplate from 'toro/hooks/useTemplate'
import * as pdpGaEvents from 'toro/helpers/pdpGaEvents'
import { productDataAtom } from 'store/pdp.atom'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import type { Atom } from 'jotai'

mockIntersectionObserver()

jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useSelectedVariantData')
jest.mock('toro/hooks/useTemplate')
jest.mock('toro/helpers/pdpGaEvents')

// Mock Image component to always render <img> elements for testing
// This bypasses lazy loading logic so tests can assert on image presence
jest.mock('toro/components/Image', () => ({
  __esModule: true,
  default: ({ lazy, children, ...rest }: any) => (
    <div>
      <img {...rest} />
      {children}
    </div>
  ),
}))

const mockUseAnalytics = jest.mocked(useAnalytics)
const mockUseSelectedVariantData = jest.mocked(useSelectedVariantData)
const mockUseTemplate = jest.mocked(useTemplate)
const mockPdpGaEvents = jest.mocked(pdpGaEvents)

interface SetupOptions {
  cardDetails?: any[]
  isV51Template?: boolean
  selectedVariantId?: string
  analytics?: any
}

const setupMocks = (options: SetupOptions = {}) => {
  const {
    isV51Template = false,
    selectedVariantId = 'test-variant-id',
    analytics = { track: jest.fn(), send: jest.fn() },
  } = options

  mockUseAnalytics.mockReturnValue(analytics)
  mockUseSelectedVariantData.mockReturnValue(selectedVariantId)
  mockUseTemplate.mockReturnValue(isV51Template)
  mockPdpGaEvents.getProductDetailsMoveEvent.mockReturnValue([
    'product_details_move',
    { eventAction: 'test', eventLabel: 'test', eventLocation: 'test' },
  ])
}

const makeSetup = ({
  atomsData,
  ...options
}: { atomsData: Array<[Atom<unknown>, unknown]> } & SetupOptions) => {
  setupMocks(options)

  return render(<ProductDetails />, {
    contexts: {
      JotaiProviderContext: new Map(atomsData),
    },
  })
}

describe('ProductDetails', () => {
  const mockAnalytics = {
    track: jest.fn(),
    send: jest.fn(),
  }

  const mockCardDetails = [
    {
      title: 'Care Instructions',
      subtitle: 'How to care for your product',
      description: 'Detailed care instructions here',
      image: '/test-image.jpg',
      styleVariant: 'default',
      tangibleeCta: false,
      loadStrategy: 'lazy',
      hotspots: [
        {
          id: 'spot1',
          icon: 'care',
          title: 'Care Spot 1',
          x: 10,
          y: 20,
          titleAbove: false,
        },
        {
          id: 'spot2',
          icon: 'info',
          title: 'Info Spot 2',
          x: 30,
          y: 40,
          titleAbove: true,
        },
      ],
    },
  ]

  const createProductDataAtoms = (cardDetails: any = mockCardDetails) => {
    if (!cardDetails || cardDetails.length === 0) {
      return [[productDataAtom, null]] as Array<[Atom<unknown>, unknown]>
    }

    const productData = {
      selectedColor: { id: 'red', name: 'Red' },
      defaultColor: { id: 'red', name: 'Red' },
      variationGroup: [
        {
          id: 'variant-red-123',
          name: 'Red Variant',
          color: 'red',
          variationAttributes: [],
        },
      ],
      productCardDetails: cardDetails.map((card: any) => ({
        title: card.title || 'Default Title',
        subtitle: card.subtitle,
        description: card.description,
        styleVariant: card.styleVariant || 'default',
        tangibleeCta: card.tangibleeCta || false,
        loadStrategy: card.loadStrategy || 'lazy',
        hotspots: card.hotspots || [],
        images: {
          'variant-red-123': card.image || '/test-image.jpg',
        },
      })),
    }

    return [[productDataAtom, productData]] as Array<[Atom<unknown>, unknown]>
  }

  beforeEach(() => {
    jest.clearAllMocks()

    setupMocks({ analytics: mockAnalytics })
  })

  describe('Component Rendering Structure', () => {
    it('renders the component with main heading', () => {
      makeSetup({
        atomsData: createProductDataAtoms(mockCardDetails),
      })

      expect(screen.getByText('Product details')).toBeVisible()
      expect(screen.getByTestId('cm_pdp_btn_pdtls_card_hdr')).toHaveAttribute(
        'data-qa',
        'cm_pdp_btn_pdtls_card_hdr'
      )
    })

    it('calls necessary hooks for initialization', () => {
      makeSetup({
        atomsData: createProductDataAtoms(mockCardDetails),
      })

      expect(mockUseAnalytics).toHaveBeenCalled()
      expect(mockUseSelectedVariantData).toHaveBeenCalled()
      expect(mockUseTemplate).toHaveBeenCalledWith(['pdpv5_1'])
    })
  })

  describe('Conditional Rendering Based on Card Data', () => {
    it('renders ProductCardTable when no card details', () => {
      makeSetup({
        atomsData: createProductDataAtoms([]),
      })

      expect(screen.getByRole('list')).toBeVisible()
      expect(screen.getByText('Product details')).toBeVisible()
    })

    it('renders ProductCard components when card details exist', () => {
      makeSetup({
        atomsData: createProductDataAtoms(mockCardDetails),
      })

      expect(screen.getByText('Care Instructions')).toBeVisible()
      expect(screen.getByText('How to care for your product')).toBeVisible()

      expect(screen.getByRole('group')).toBeVisible()
      expect(screen.getByRole('img')).toBeVisible()
    })
  })

  describe('Template-Based Conditional Rendering', () => {
    it('calls useTemplate hook with correct template name', () => {
      makeSetup({
        atomsData: createProductDataAtoms(mockCardDetails),
      })

      expect(mockUseTemplate).toHaveBeenCalledWith(['pdpv5_1'])
    })

    it('renders subtitle and description when not v5.1 template', () => {
      makeSetup({
        atomsData: createProductDataAtoms(mockCardDetails),
        isV51Template: false,
      })

      expect(screen.getByText('How to care for your product')).toBeVisible()
      expect(screen.getByText('Detailed care instructions here')).toBeVisible()
    })

    it('hides subtitle and description when v5.1 template is active', () => {
      makeSetup({
        atomsData: createProductDataAtoms(mockCardDetails),
        isV51Template: true,
      })

      expect(screen.getByText('Care Instructions')).toBeVisible()

      expect(screen.queryByText('How to care for your product')).not.toBeInTheDocument()
      expect(screen.queryByText('Detailed care instructions here')).not.toBeInTheDocument()
    })
  })

  describe('ProductCard Structure', () => {
    it('renders ProductCard header with title only when subtitle missing', () => {
      const cardWithoutSubtitle = [
        {
          title: 'Care Instructions',
          description: 'Detailed care instructions here',
          image: '/test-image.jpg',
          styleVariant: 'default',
          hotspots: [],
        },
      ]

      makeSetup({
        atomsData: createProductDataAtoms(cardWithoutSubtitle),
      })

      expect(screen.getByText('Care Instructions')).toBeVisible()
      expect(screen.queryByText('How to care for your product')).not.toBeInTheDocument()
    })
  })

  describe('Hotspot Badge Mapping', () => {
    it('handles cards without hotspots', () => {
      const cardWithoutHotspots = [
        {
          title: 'Care Instructions',
          image: '/test-image.jpg',
          styleVariant: 'default',
          hotspots: [],
        },
      ]

      makeSetup({
        atomsData: createProductDataAtoms(cardWithoutHotspots),
      })

      expect(screen.queryByText('Care Spot 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Info Spot 2')).not.toBeInTheDocument()
    })

    it('passes correct props to HotSpotBadge components', () => {
      makeSetup({ atomsData: createProductDataAtoms(mockCardDetails) })

      expect(screen.getByText('Care Spot 1')).toBeVisible()
      expect(screen.getByText('Info Spot 2')).toBeVisible()
      expect(screen.getByRole('img')).toBeVisible()
    })

    it('renders multiple hotspots from card data', () => {
      const cardWithManyHotspots = [
        {
          title: 'Care Instructions',
          image: '/test-image.jpg',
          styleVariant: 'default',
          hotspots: [
            { id: 'spot1', icon: 'care', title: 'Care Spot 1', x: 10, y: 20 },
            { id: 'spot2', icon: 'info', title: 'Info Spot 2', x: 30, y: 40 },
            { id: 'spot3', icon: 'warning', title: 'Warning Spot 3', x: 50, y: 60 },
          ],
        },
      ]

      makeSetup({
        atomsData: createProductDataAtoms(cardWithManyHotspots),
      })

      expect(screen.getByText('Care Spot 1')).toBeVisible()
      expect(screen.getByText('Info Spot 2')).toBeVisible()
      expect(screen.getByText('Warning Spot 3')).toBeVisible()
    })
  })

  describe('Analytics Integration', () => {
    it('initializes analytics with useAnalytics hook', () => {
      makeSetup({
        atomsData: createProductDataAtoms(mockCardDetails),
      })

      expect(mockUseAnalytics).toHaveBeenCalled()
    })

    it('uses selectedVariantId in analytics events', () => {
      makeSetup({
        atomsData: createProductDataAtoms(mockCardDetails),
      })

      expect(mockUseSelectedVariantData).toHaveBeenCalledWith('id')
      expect(mockUseSelectedVariantData).toHaveReturnedWith('test-variant-id')
    })

    it('integrates with product card details atom', () => {
      makeSetup({
        atomsData: createProductDataAtoms(mockCardDetails),
      })

      expect(screen.getByText('Care Instructions')).toBeVisible()
      expect(screen.getByText('How to care for your product')).toBeVisible()
      expect(screen.getByText('Detailed care instructions here')).toBeVisible()
      expect(screen.getByText('Care Spot 1')).toBeVisible()
      expect(screen.getByText('Info Spot 2')).toBeVisible()

      const productImage = screen.getByRole('img')
      expect(productImage).toHaveAttribute(
        'data-splide-lazy',
        '/test-image.jpg?$productTile-1-1-m$'
      )
    })
  })
})
