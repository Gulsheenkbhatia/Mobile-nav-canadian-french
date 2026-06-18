import React from 'react'
import { render, screen } from 'test-utils/react'
import VisuallySimilarGrid from './VisuallySimilarGrid'
import useRecommendations from 'toro/hooks/useRecommendations'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import useExperiment from 'toro/hooks/useExperiment'
import usePreference from 'toro/hooks/usePreference_new'
import { extractLookbookImage } from 'toro/components/product/ProductMediaArea/helpers'

jest.mock('toro/lib/xgen', () => ({
  XgenContainerID: { ymal: 'sm_el_pdp1' },
}))

jest.mock('toro/hooks/useRecommendations', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/hooks/useVariantGroupData', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/hooks/useExperiment', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/hooks/usePreference_new', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/components/RecommendationsContainer/useAnalyticsEventsRec', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}))

jest.mock('toro/components/product/ProductMediaArea/helpers', () => ({
  extractLookbookImage: jest.fn(),
}))

jest.mock('toro/components/RecommendationItemTile', () => {
  return function MockRecommendationItemTile({ productItem, idx }: any) {
    return (
      <div data-qa="recommendation-item-tile" data-idx={idx}>
        {productItem.name}
      </div>
    )
  }
})

jest.mock('toro/components/VisuallySimilarGrid/VisuallySimilarGridSkeleton', () => {
  return function MockSkeleton() {
    return <div data-qa="visually-similar-grid-skeleton">VisuallySimilarGridSkeleton</div>
  }
})

jest.mock('toro/components/Lazy', () => {
  const { useEffect } = jest.requireActual('react')
  return function MockLazy({ children, onVisible }: any) {
    useEffect(() => {
      onVisible?.(true)
    }, [onVisible])
    return <div data-qa="lazy-wrapper">{children}</div>
  }
})

const mockUseRecommendations = jest.mocked(useRecommendations)
const mockUseVariantGroupData = jest.mocked(useVariantGroupData)
const mockUseExperiment = jest.mocked(useExperiment)
const mockUsePreference = jest.mocked(usePreference)
const mockExtractLookbookImage = jest.mocked(extractLookbookImage)

const createProduct = (id: string, name: string) => ({
  id,
  name,
  image: { src: `img-${id}.jpg`, alt: name, aspectRatio: '1:1' },
  media: [{ src: `img-${id}.jpg`, alt: name }],
})

describe('VisuallySimilarGrid', () => {
  const mockFetchRecommendations = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseRecommendations.mockReturnValue({
      fetchRecommendations: mockFetchRecommendations,
      data: null,
      isLoading: false,
    } as any)

    mockUseVariantGroupData.mockReturnValue('vg-123')
    mockUseExperiment.mockReturnValue(false)
    mockUsePreference.mockReturnValue({
      adaptiveExperience: { enableLookBook: undefined },
    } as any)
    mockExtractLookbookImage.mockReturnValue([null, []])
  })

  describe('lazy loading and data fetching', () => {
    it('triggers fetchRecommendations when visible with a variant group id', () => {
      mockUseVariantGroupData.mockReturnValue('vg-456')

      render(<VisuallySimilarGrid />)

      expect(mockFetchRecommendations).toHaveBeenCalledWith('vg-456')
    })

    it('does not fetch when selectedVgId is falsy', () => {
      mockUseVariantGroupData.mockReturnValue(null)

      render(<VisuallySimilarGrid />)

      expect(mockFetchRecommendations).not.toHaveBeenCalled()
    })
  })

  describe('loading state', () => {
    it('renders skeleton when loading', () => {
      mockUseRecommendations.mockReturnValue({
        fetchRecommendations: mockFetchRecommendations,
        data: null,
        isLoading: true,
      } as any)

      render(<VisuallySimilarGrid />)

      expect(screen.getByText('VisuallySimilarGridSkeleton')).toBeVisible()
      expect(screen.queryByRole('heading', { level: 2 })).toBeNull()
    })
  })

  describe('empty state', () => {
    it('renders null when no products, not loading, and fetch was triggered', () => {
      mockUseRecommendations.mockReturnValue({
        fetchRecommendations: mockFetchRecommendations,
        data: { items: [], containerDisplayName: '' },
        isLoading: false,
      } as any)

      render(<VisuallySimilarGrid />)

      expect(screen.queryByTestId('lazy-wrapper')).toBeNull()
      expect(screen.queryByRole('heading', { level: 2 })).toBeNull()
      expect(screen.queryByTestId('recommendation-item-tile')).toBeNull()
    })
  })

  describe('products rendering', () => {
    it('renders product tiles when data is available', () => {
      const products = [createProduct('p1', 'Bag A'), createProduct('p2', 'Bag B')]
      mockUseRecommendations.mockReturnValue({
        fetchRecommendations: mockFetchRecommendations,
        data: { items: products, containerDisplayName: 'You May Also Like' },
        isLoading: false,
      } as any)

      render(<VisuallySimilarGrid />)

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('You May Also Like')
      expect(screen.getByText('Bag A')).toBeVisible()
      expect(screen.getByText('Bag B')).toBeVisible()
    })
  })

  describe('lookbook prioritization', () => {
    const products = [
      {
        ...createProduct('p1', 'Bag A'),
        media: [
          { src: 'original.jpg', alt: 'Original' },
          { src: 'lookbook.jpg', alt: 'Lookbook' },
        ],
      },
    ]

    it('replaces product image with lookbook image when lookbook is active', () => {
      mockUseExperiment.mockReturnValue(true)
      mockUsePreference.mockReturnValue({
        adaptiveExperience: { enableLookBook: { imageAssets: ['lookbook_type'] } },
      } as any)
      mockUseRecommendations.mockReturnValue({
        fetchRecommendations: mockFetchRecommendations,
        data: { items: products, containerDisplayName: '' },
        isLoading: false,
      } as any)
      mockExtractLookbookImage.mockReturnValue([
        { src: 'lookbook.jpg', alt: 'Lookbook Image' },
        [],
      ] as any)

      render(<VisuallySimilarGrid />)

      expect(mockExtractLookbookImage).toHaveBeenCalledWith(products[0].media, ['lookbook_type'])
      expect(screen.getByText('Bag A')).toBeVisible()
    })

    it('keeps original product when lookbook experiment is inactive', () => {
      mockUseExperiment.mockReturnValue(false)
      mockUseRecommendations.mockReturnValue({
        fetchRecommendations: mockFetchRecommendations,
        data: { items: products, containerDisplayName: '' },
        isLoading: false,
      } as any)

      render(<VisuallySimilarGrid />)

      expect(mockExtractLookbookImage).not.toHaveBeenCalled()
      expect(screen.getByText('Bag A')).toBeVisible()
    })

    it('keeps original product when extractLookbookImage returns null', () => {
      mockUseExperiment.mockReturnValue(true)
      mockUsePreference.mockReturnValue({
        adaptiveExperience: { enableLookBook: { imageAssets: ['lookbook_type'] } },
      } as any)
      mockUseRecommendations.mockReturnValue({
        fetchRecommendations: mockFetchRecommendations,
        data: { items: products, containerDisplayName: '' },
        isLoading: false,
      } as any)
      mockExtractLookbookImage.mockReturnValue([null, []] as any)

      render(<VisuallySimilarGrid />)

      expect(screen.getByText('Bag A')).toBeVisible()
    })
  })

  describe('schema prop', () => {
    it('passes schema to useRecommendations', () => {
      render(<VisuallySimilarGrid schema="custom-schema" />)

      expect(mockUseRecommendations).toHaveBeenCalledWith('custom-schema')
    })

    it('defaults schema to ymal', () => {
      render(<VisuallySimilarGrid />)

      expect(mockUseRecommendations).toHaveBeenCalledWith('ymal')
    })
  })
})
