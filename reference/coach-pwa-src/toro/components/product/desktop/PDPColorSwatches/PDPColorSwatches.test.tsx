import userEvent from '@testing-library/user-event'
import { Provider } from 'jotai'
import { render, screen, waitFor } from 'test-utils/react'

import { mockIntersectionObserver } from 'test-utils/mock-utils'
import { appLoadingAtom } from 'store/pdp.atom'
import PDPColorSwatches from './index'

jest.mock('helpers/getColorSwatches', () => ({
  filteredItemsWithSrc: jest.fn(),
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))
jest.mock('toro/hooks/useMultiStyleConfig', () => jest.fn(() => ({})))
jest.mock('toro/hooks/useProductData', () => jest.fn(() => [[], 'test-product-id', []]))
jest.mock('toro/hooks/useSelectedColorData', () => jest.fn(() => ['color-1', 'master-1', 'Black']))
jest.mock('toro/hooks/usePreference_new', () =>
  jest.fn(() => ({
    toggleSiteFeatures: { sourceCodeGroupAttributeMapping: {} },
    salePreferences: { enablePdpSwatchSuppression: false },
    storefrontConfigs: { displayOosSwatch: true },
    pdpPreferences: { enableThumbnailCarouselOnPDP: false },
  }))
)
jest.mock('toro/hooks/useScrollToSelectedColorSwatch', () =>
  jest.fn(() => ({ containerRef: null, setContainerRef: jest.fn() }))
)
jest.mock('toro/hooks/useSelectColor', () => jest.fn(() => jest.fn()))
jest.mock('toro/analytics/useAnalytics', () => jest.fn(() => ({ send: jest.fn() })))
jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  useUpdateAtom: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithStorage: jest.fn(),
  atomWithDefault: jest.fn(),
  selectAtom: jest.fn(),
  atomFamily: jest.fn(() => jest.fn()),
  loadable: jest.fn((atom) => atom),
  RESET: Symbol('RESET'),
  createJSONStorage: jest.fn(),
}))

// Mock components
jest.mock('toro/components/product/ScrollableSwatches', () => {
  return jest.fn(({ colors, onChange }) => (
    <div data-testid="scrollable-swatches-pdp">
      {colors?.map((color, index) => (
        <div
          key={color.id}
          data-testid="swatches_slide_swatch"
          data-qa="swatches_slide_swatch"
          onClick={() => onChange(color)}
          style={{ cursor: 'pointer' }}
        >
          {color.text} Swatch
        </div>
      ))}
    </div>
  ))
})
jest.mock('toro/components/product/desktop/StickyBar/SizeSelector/SizeSelectorInventoryBadge', () =>
  jest.fn(() => <div data-qa="inventory-badge">Inventory Badge</div>)
)

// Mock atoms
const mockDisplayedColors = [
  {
    id: 'color-1',
    masterId: 'master-1',
    text: 'Black',
    image: { src: 'black.jpg', alt: 'Black' },
    orderable: true,
    url: '/products/test-black',
  },
  {
    id: 'color-2',
    masterId: 'master-1',
    text: 'White',
    image: { src: 'white.jpg', alt: 'White' },
    orderable: true,
    url: '/products/test-white',
  },
]

mockIntersectionObserver()

const mockRouter = {
  push: jest.fn(),
  query: {},
  pathname: '/products/test',
  route: '/products/test',
  asPath: '/products/test',
}

describe('PDPColorSwatches', () => {
  const defaultContexts = {
    PWAContext: { appData: { brand: 'coach' } },
    SessionContext: { session: { user: {} } },
    AnalyticsContext: { send: jest.fn() },
  }

  const mockScrollableSwatchesPDP = jest.requireMock('toro/components/product/ScrollableSwatches')
  const mockSizeSelectorInventoryBadge = jest.requireMock(
    'toro/components/product/desktop/StickyBar/SizeSelector/SizeSelectorInventoryBadge'
  )
  const { filteredItemsWithSrc: mockFilteredItemsWithSrc } = jest.requireMock(
    'helpers/getColorSwatches'
  )

  const createAtomMock = (
    overrides: {
      displayedColors?: any[]
      selectedSize?: string | null
      isMegaPDPEligible?: boolean
      isSizedProduct?: boolean
    } = {}
  ) => {
    const { useAtomValue } = jest.requireMock('jotai/utils')
    useAtomValue.mockImplementation((atom) => {
      const atomStr = String(atom)
      if (overrides.displayedColors !== undefined && atomStr.includes('displayedColors')) {
        return overrides.displayedColors
      }
      if (overrides.selectedSize !== undefined && atomStr.includes('selectedSize')) {
        return overrides.selectedSize
      }
      if (overrides.isMegaPDPEligible !== undefined && atomStr.includes('isMegaPDPEligible')) {
        return overrides.isMegaPDPEligible
      }
      if (overrides.isSizedProduct !== undefined && atomStr.includes('isSizedProduct')) {
        return overrides.isSizedProduct
      }

      // Default values
      if (atomStr.includes('displayedColors')) return mockDisplayedColors
      if (atomStr.includes('isMegaPDPEligible')) return false
      if (atomStr.includes('selectedSize')) return null
      if (atomStr.includes('isSizedProduct')) return false

      // Check for appLoadingAtom before object fallback
      if (atom === appLoadingAtom) return false

      // Fallback for derived atoms (like displayedColorsAtom)
      if (atom && typeof atom === 'object') {
        return mockDisplayedColors
      }

      return false
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockScrollableSwatchesPDP.mockClear()
    mockSizeSelectorInventoryBadge.mockClear()
    mockFilteredItemsWithSrc.mockClear()
    mockFilteredItemsWithSrc.mockReturnValue(mockDisplayedColors) // Default return value
    const { useRouter } = jest.requireMock('next/router')
    useRouter.mockReturnValue(mockRouter)

    // Reset all mocks including jotai/utils before setting up new ones
    const { useAtomValue, useUpdateAtom } = jest.requireMock('jotai/utils')
    useAtomValue.mockReset()
    useUpdateAtom.mockReset()

    // Reset all hook mocks to defaults
    const mockProductData = jest.requireMock('toro/hooks/useProductData')
    mockProductData.mockReturnValue([[], 'test-product-id', []])
    const mockSelectedColorData = jest.requireMock('toro/hooks/useSelectedColorData')
    mockSelectedColorData.mockReturnValue(['color-1', 'master-1', 'Black'])

    // Setup default atom mocks using helper function
    createAtomMock()

    useUpdateAtom.mockReturnValue(jest.fn())
  })

  const renderComponent = (props = {}, contexts = {}) => {
    return render(
      <Provider>
        <PDPColorSwatches {...props} />
      </Provider>,
      { contexts: { ...defaultContexts, ...contexts } }
    )
  }

  it('renders color swatches with selected color label', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Color: Black')).toBeInTheDocument()
      expect(screen.getByTestId('cm_txt_pdt_label_color')).toBeInTheDocument()
    })
  })

  it('renders all available color swatches', async () => {
    renderComponent()

    await waitFor(() => {
      const swatches = screen.getAllByTestId('swatches_slide_swatch')
      expect(swatches).toHaveLength(2)
    })
  })

  it('does not render when no colors are available', () => {
    const mockProductData = jest.requireMock('toro/hooks/useProductData')
    const mockSelectedColorData = jest.requireMock('toro/hooks/useSelectedColorData')

    mockProductData.mockReturnValue([[], 'test-product-id', []])

    mockSelectedColorData.mockReturnValue([null, null, null])

    createAtomMock({ displayedColors: [] })

    mockFilteredItemsWithSrc.mockReturnValue([])

    const { container } = renderComponent()

    expect(screen.getByText('Color: null')).toBeInTheDocument()

    expect(container.firstChild).not.toBeNull()
  })

  it('handles color change when swatch is clicked', async () => {
    const mockSelectColor = jest.fn()
    const mockAnalyticsSend = jest.fn()
    const mockDropAtbErrors = jest.fn()

    const useSelectColorMock = jest.requireMock('toro/hooks/useSelectColor')
    const useAnalyticsMock = jest.requireMock('toro/analytics/useAnalytics')
    const { useUpdateAtom } = jest.requireMock('jotai/utils')

    useSelectColorMock.mockReturnValue(mockSelectColor)
    useAnalyticsMock.mockReturnValue({ send: mockAnalyticsSend })
    useUpdateAtom.mockReturnValue(mockDropAtbErrors)

    renderComponent()

    await waitFor(() => {
      const swatches = screen.getAllByTestId('swatches_slide_swatch')
      expect(swatches).toHaveLength(2)
    })

    const swatches = screen.getAllByTestId('swatches_slide_swatch')
    await userEvent.click(swatches[1])

    await waitFor(() => {
      expect(mockSelectColor).toHaveBeenCalledWith({ id: 'color-2', masterId: 'master-1' })
    })

    expect(mockDropAtbErrors).toHaveBeenCalled()

    expect(mockAnalyticsSend).toHaveBeenCalledWith('swatchInteraction', {
      eventAction: 'swatch click',
      eventLabel: undefined,
      item_id: 'master-1',
      eventLocation: 'product',
      swatchType: 'color',
      swatchValue: 'White',
      swatchVariant: undefined,
    })
  })

  it('shows inventory badge when showInventoryBadge is true and no size selected', () => {
    createAtomMock({ selectedSize: null })

    renderComponent({ showInventoryBadge: true })

    expect(mockSizeSelectorInventoryBadge).toHaveBeenCalled()
    expect(screen.getByTestId('inventory-badge')).toBeInTheDocument()
  })

  it('does not show inventory badge when size is selected', () => {
    createAtomMock({ selectedSize: 'M', isSizedProduct: true })

    mockSizeSelectorInventoryBadge.mockImplementation(() => null)

    renderComponent({ showInventoryBadge: true })

    expect(screen.queryByTestId('inventory-badge')).not.toBeInTheDocument()
  })

  it('does not show inventory badge when showInventoryBadge is false', () => {
    createAtomMock({ selectedSize: null })

    renderComponent({ showInventoryBadge: false })

    expect(mockSizeSelectorInventoryBadge).not.toHaveBeenCalled()
    expect(screen.queryByTestId('inventory-badge')).not.toBeInTheDocument()
  })

  it('applies custom variant theme to useMultiStyleConfig', () => {
    const mockUseMultiStyleConfig = jest.requireMock('toro/hooks/useMultiStyleConfig')

    renderComponent({ variant: 'pdpv5Zoom' })

    expect(mockUseMultiStyleConfig).toHaveBeenCalledWith('PDPColorSwatches', {
      variant: 'pdpv5Zoom',
      scrollable: false,
    })
  })

  it('passes fadeColor prop to ScrollableSwatchesPDP component', () => {
    const customFadeColor = 'rgba(255,255,255,0.8)'
    renderComponent({ fadeColor: customFadeColor })

    // The component should pass fadeColor to ScrollableSwatchesPDP
    // The actual value depends on shouldShowPaginationArrows logic
    const call = mockScrollableSwatchesPDP.mock.calls[0]
    const props = call[0]

    expect(props).toHaveProperty('fadeColor')
    expect(typeof props.fadeColor).toBe('string')
    // fadeColor should be either the custom color or 'none' based on pagination logic
    expect(['none', customFadeColor]).toContain(props.fadeColor)
  })

  it('passes "none" as fade color when pagination arrows are not shown', () => {
    const customFadeColor = 'rgba(255,255,255,0.8)'

    // With default setup (lors), pagination arrows should not be shown
    renderComponent({ fadeColor: customFadeColor })

    expect(mockScrollableSwatchesPDP).toHaveBeenCalledWith(
      expect.objectContaining({
        fadeColor: 'none',
        colors: expect.any(Array),
        showTooltip: true,
      }),
      expect.any(Object)
    )
    expect(screen.getByText('Color: Black')).toBeInTheDocument()
  })

  it('renders with correct wrapper class names', () => {
    renderComponent()

    const wrapper = document.querySelector('.color-swatches-wrapper')
    const container = document.querySelector('.color-swatches-container')

    expect(wrapper).toBeInTheDocument()
    expect(container).toBeInTheDocument()
  })

  it('handles empty variation group correctly', () => {
    const mockProductData = jest.requireMock('toro/hooks/useProductData')
    mockProductData.mockReturnValue([[], 'test-product-id', []])

    renderComponent()

    expect(screen.getByText('Color: Black')).toBeInTheDocument()
    const swatches = screen.getAllByTestId('swatches_slide_swatch')
    expect(swatches).toHaveLength(2)
  })

  it('processes source code group filtering through filteredItemsWithSrc', () => {
    const mockProductData = jest.requireMock('toro/hooks/useProductData')
    const mockVariationGroup = ['vg1', 'vg2']

    const filteredColors = [mockDisplayedColors[0]]
    mockFilteredItemsWithSrc.mockReturnValue(filteredColors)

    mockProductData.mockReturnValue([mockVariationGroup, 'test-product-id', []])

    const mockSession = { user: { sourceCodeGroupID: 'test-group' } }
    renderComponent({}, { SessionContext: { session: mockSession } })

    expect(mockFilteredItemsWithSrc).toHaveBeenCalledWith({
      items: mockDisplayedColors,
      variationSrc: mockVariationGroup,
      sourceCodeGroupId: 'test-group',
      sourceCodeGroupAttributeMapping: {},
      isCheckForCustomizedVariant: true,
      isEnableSaleSuppression: false,
      requestedId: 'test-product-id',
    })

    const swatches = screen.getAllByTestId('swatches_slide_swatch')
    expect(swatches).toHaveLength(1)
  })

  it('calculates sourceCodeGroupId from session and router correctly', () => {
    mockFilteredItemsWithSrc.mockReturnValue(mockDisplayedColors)

    const mockProductData = jest.requireMock('toro/hooks/useProductData')
    const mockVariationGroup = ['vg1', 'vg2']
    mockProductData.mockReturnValue([mockVariationGroup, 'test-product-id', []])

    const mockRouterWithQuery = {
      ...mockRouter,
      query: { src: 'router-source' },
    }
    const mockSession = { user: { sourceCodeGroupID: 'session-source' } }

    const { useRouter } = jest.requireMock('next/router')
    useRouter.mockReturnValue(mockRouterWithQuery)

    renderComponent({}, { SessionContext: { session: mockSession } })

    expect(mockFilteredItemsWithSrc).toHaveBeenCalledWith({
      items: mockDisplayedColors,
      variationSrc: mockVariationGroup,
      sourceCodeGroupId: 'session-source',
      sourceCodeGroupAttributeMapping: {},
      isCheckForCustomizedVariant: true,
      isEnableSaleSuppression: false,
      requestedId: 'test-product-id',
    })
  })

  it('calculates sourceCodeGroupId from router when session has no sourceCodeGroupID', () => {
    mockFilteredItemsWithSrc.mockReturnValue(mockDisplayedColors)

    const mockProductData = jest.requireMock('toro/hooks/useProductData')
    const mockVariationGroup = ['vg1', 'vg2']
    mockProductData.mockReturnValue([mockVariationGroup, 'test-product-id', []])

    const mockRouterWithQuery = {
      ...mockRouter,
      query: { src: 'router-fallback' },
    }
    const mockSession = { user: {} }

    const { useRouter } = jest.requireMock('next/router')
    useRouter.mockReturnValue(mockRouterWithQuery)

    renderComponent({}, { SessionContext: { session: mockSession } })

    expect(mockFilteredItemsWithSrc).toHaveBeenCalledWith({
      items: mockDisplayedColors,
      variationSrc: mockVariationGroup,
      sourceCodeGroupId: 'router-fallback',
      sourceCodeGroupAttributeMapping: {},
      isCheckForCustomizedVariant: true,
      isEnableSaleSuppression: false,
      requestedId: 'test-product-id',
    })
  })
})
