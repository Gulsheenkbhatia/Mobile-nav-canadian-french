import userEvent from '@testing-library/user-event'
import { render, screen } from 'test-utils/react'

import DesktopThinkRecommendations from './DesktopThinkRecommendations'
import useThinkRecommendations from 'toro/components/list/ThinkPage/ThinkGridRecommendations/useThinkRecommendations'

import type { ProductItem } from 'toro/types'

// Component mocks
jest.mock('toro/components/RecommendationItemTile', () => ({
  __esModule: true,
  default: ({ productItem }: any) => <div>{productItem.name}</div>,
}))
jest.mock('toro/components/Certona/CertonaSkeleton', () => ({
  __esModule: true,
  default: () => <div data-qa="skeleton" />,
}))
jest.mock('toro/icons', () => ({
  __esModule: true,
  NavChevronDownIcon: () => <span />,
  NavChevronUpIcon: () => <span />,
}))
jest.mock('toro/cms/components/LandingContent/LazySlot', () => ({
  __esModule: true,
  default: () => null,
}))

// Hook mocks
jest.mock('./useThinkRecommendations')

const mockUseThinkRecommendations = jest.mocked(useThinkRecommendations)
const VIEW_MORE = 'View More'
const VIEW_LESS = 'View Less'

const baseStyles = {
  container: {},
  title: {},
  gridWrapper: {},
  desktopExpandedWrapper: {},
  ctaWrapper: {},
  ctaButton: {},
}

const createHookReturn = (
  overrides: Partial<ReturnType<typeof useThinkRecommendations>> = {}
): ReturnType<typeof useThinkRecommendations> => {
  const defaultValue = {
    styles: baseStyles,
    ref: jest.fn(),
    inView: true,
    isLoading: false,
    items: [],
    vendor: 'certona',
    label: 'Recommended',
    strategyId: 'strategy-id',
    containerId: 'container-id',
    analytics: { send: jest.fn() },
    analyticsEvents: {
      onTileClick: jest.fn(),
      onTileVisible: jest.fn(),
      onAddToWishlistSuccess: jest.fn(),
      onRemoveFromWishlistSuccess: jest.fn(),
      onLinkClick: jest.fn(),
    },
  }

  return {
    ...defaultValue,
    ...overrides,
    analyticsEvents: {
      ...defaultValue.analyticsEvents,
      ...(overrides.analyticsEvents || {}),
    },
  } as ReturnType<typeof useThinkRecommendations>
}

const makeItems = (count: number): ProductItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `product-${i + 1}`,
    masterId: `master-${i + 1}`,
    variationId: `variation-${i + 1}`,
    variationGroupId: `group-${i + 1}`,
    url: `/product-${i + 1}`,
    image: { src: `image-${i + 1}.jpg`, alt: `Product ${i + 1}` },
    name: `Product ${i + 1}`,
    isSized: true,
  }))

const setMockItems = (items: ProductItem[]) => {
  mockUseThinkRecommendations.mockReturnValue(createHookReturn({ items }))
}

const renderComponent = (overrideProps = {}) =>
  render(
    <DesktopThinkRecommendations
      id="recom-grid-0"
      type="just-for-you"
      viewMoreText={VIEW_MORE}
      viewLessText={VIEW_LESS}
      {...overrideProps}
    />
  )

describe('DesktopThinkRecommendations', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseThinkRecommendations.mockReturnValue(createHookReturn())
    setMockItems([])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Empty State', () => {
    it('renders nothing when no products exist', () => {
      renderComponent()

      expect(screen.queryByText('Recommended')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: VIEW_MORE })).not.toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('renders skeleton when loading', () => {
      mockUseThinkRecommendations.mockReturnValue(
        createHookReturn({
          isLoading: true,
          items: makeItems(4),
        })
      )

      renderComponent()

      expect(screen.getByTestId('skeleton')).toBeVisible()
      expect(screen.queryByText('Recommended')).not.toBeInTheDocument()
    })
  })

  describe('Product Display', () => {
    it('renders label and all 8 products without view more button when exactly 8 products exist', () => {
      const items = makeItems(8)
      setMockItems(items)

      renderComponent({ title: 'Recommended' })

      expect(screen.getByText('Recommended')).toBeVisible()

      // Verify exactly 8 products are rendered
      expect(screen.getAllByText(/^Product \d+$/)).toHaveLength(8)

      // View more button should not appear for exactly 8 products
      expect(screen.queryByRole('button', { name: VIEW_MORE })).not.toBeInTheDocument()
    })

    it('renders only first 4 products when fewer than 8 products exist', () => {
      const items = makeItems(4)
      setMockItems(items)

      renderComponent({ title: 'Recommended' })

      expect(screen.getByText('Recommended')).toBeVisible()

      // Verify all 4 products are rendered
      expect(screen.getAllByText(/^Product \d+$/)).toHaveLength(4)

      expect(screen.queryByRole('button', { name: VIEW_MORE })).not.toBeInTheDocument()
    })
  })

  describe('View More / View Less Functionality', () => {
    it('toggles between view more and view less states', async () => {
      const user = userEvent.setup()
      setMockItems(makeItems(10))

      renderComponent()

      // Initially shows view more button and hides additional products
      expect(screen.getByRole('button', { name: VIEW_MORE })).toBeVisible()
      expect(screen.queryByText('Product 9')).not.toBeInTheDocument()
      expect(screen.queryByText('Product 10')).not.toBeInTheDocument()

      // Click view more - shows additional products and view less button
      await user.click(screen.getByRole('button', { name: VIEW_MORE }))
      expect(screen.getByText('Product 9')).toBeVisible()
      expect(screen.getByText('Product 10')).toBeVisible()
      expect(screen.getByRole('button', { name: VIEW_LESS })).toBeVisible()

      // Click view less - hides additional products and shows view more button
      await user.click(screen.getByRole('button', { name: VIEW_LESS }))
      expect(screen.getByRole('button', { name: VIEW_MORE })).toBeVisible()
      expect(screen.queryByText('Product 9')).not.toBeInTheDocument()
      expect(screen.queryByText('Product 10')).not.toBeInTheDocument()
    })
  })
})
