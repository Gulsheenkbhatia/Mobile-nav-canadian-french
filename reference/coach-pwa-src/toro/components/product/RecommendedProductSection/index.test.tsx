import React from 'react'
import RecommendedProductSection from './index'
import { render, screen } from 'test-utils/react'
import useExperiment from 'toro/hooks/useExperiment'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import useProductData from 'toro/hooks/useProductData'
import { useAtomValue } from 'jotai/utils'
import { useLookbookRecommendations } from 'toro/components/product/mobile/LookbookRecommendations/hooks'
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils'

jest.mock('toro/hooks/useExperiment', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/hooks/useLLMRecommendations', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/hooks/useProductData', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/components/product/mobile/LookbookRecommendations/hooks', () => ({
  useLookbookRecommendations: jest.fn(),
}))

jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(() => jest.fn()),
  atomWithStorage: jest.fn(() => jest.fn()),
}))

jest.mock('store/global.atom', () => ({
  visuallySimilarDataAtom: Symbol('visuallySimilarDataAtom'),
  isVisuallySimilarDataInitializedAtom: Symbol('isVisuallySimilarDataInitializedAtom'),
}))

jest.mock('store/xgen-features.atom', () => ({
  xgenFeaturesAtom: Symbol('xgenFeaturesAtom'),
}))

jest.mock('toro/components/product/desktop/VisuallySimilarSlider', () => {
  return function MockVisuallySimilarSlider({ variant }: any) {
    return (
      <div data-qa="visually-similar-slider" data-variant={variant}>
        VisuallySimilarSlider
      </div>
    )
  }
})

jest.mock('toro/components/product/desktop/ProductRecommendationsWrapper', () => {
  const MockWrapper = ({ variant, type }: any) => (
    <div data-qa="product-recommendations-wrapper" data-variant={variant} data-type={type}>
      ProductRecommendationsWrapper
    </div>
  )
  return {
    __esModule: true,
    default: MockWrapper,
    RecommenderPosition: { YMAL: 'YMAL', RECENTLY_VIEWED: 'RECENTLY_VIEWED' },
  }
})

jest.mock(
  'toro/components/product/desktop/RecommendationsSlider/RecommendationsSliderSkeleton',
  () => {
    return function MockSkeleton() {
      return <div data-qa="recommendations-skeleton">RecommendationsSliderSkeleton</div>
    }
  }
)

jest.mock(
  'toro/components/RecommendationsTabbedContainer/PDPRecommendationsTabbedContainer',
  () => {
    return function MockTabbedContainer({ pageType, variant }: any) {
      return (
        <div data-qa="tabbed-container" data-page-type={pageType} data-variant={variant}>
          PDPRecommendationsTabbedContainer
        </div>
      )
    }
  }
)

jest.mock('toro/components/product/mobile/LookbookRecommendations', () => {
  return function MockLookbookRecommendations() {
    return <div data-qa="lookbook-recommendations">LookbookRecommendations</div>
  }
})

jest.mock('toro/hocs/withSchemeValidation', () => {
  return (_Container: any, Fallback: any) => Fallback
})

jest.mock('toro/components/RecommendationsContainer', () => {
  return function MockRecommendationsContainer() {
    return <div>RecommendationsContainer</div>
  }
})

const mockUseLLMRecommendations = jest.mocked(useLLMRecommendations)
const mockUseProductData = jest.mocked(useProductData)
const mockUseExperiment = jest.mocked(useExperiment)
const mockUseAtomValue = jest.mocked(useAtomValue)
const mockUseLookbookRecommendations = jest.mocked(useLookbookRecommendations)

describe('RecommendedProductSection', () => {
  const mockSetVisuallySimilarProp = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseLLMRecommendations.mockReturnValue({
      isVisuallySimilarPDPEnabled: false,
      setVisuallySimilarProp: mockSetVisuallySimilarProp,
      visuallySimilarProp: 'testProp',
    } as any)

    mockUseProductData.mockReturnValue([null])
    mockUseExperiment.mockReturnValue(false)
    mockUseLookbookRecommendations.mockReturnValue({
      isLookbookRecommendationsEnabled: false,
      data: {} as any,
      isLoading: false,
    })

    mockUseAtomValue.mockImplementation((atom: any) => {
      const key = atom?.toString?.() || ''
      if (key.includes('visuallySimilarData')) return []
      if (key.includes('isVisuallySimilarDataInitialized')) return false
      if (key.includes('xgenFeatures')) return { recommendations: false }
      return null
    })
  })

  describe('visibility behavior', () => {
    it('renders skeleton when not in view', () => {
      render(<RecommendedProductSection />)
      expect(screen.getByText('RecommendationsSliderSkeleton')).toBeVisible()
    })

    it('renders recommendations content when in view', () => {
      render(<RecommendedProductSection />)
      mockAllIsIntersecting(true)
      expect(screen.getByText('ProductRecommendationsWrapper')).toBeVisible()
    })
  })

  describe('inView onChange callback', () => {
    it('calls setVisuallySimilarProp with prop value when visuallySimilarPDP is enabled', () => {
      mockUseLLMRecommendations.mockReturnValue({
        isVisuallySimilarPDPEnabled: true,
        setVisuallySimilarProp: mockSetVisuallySimilarProp,
        visuallySimilarProp: 'myProp',
      } as any)

      render(<RecommendedProductSection />)
      mockAllIsIntersecting(true)

      expect(mockSetVisuallySimilarProp).toHaveBeenCalledWith('myProp')
    })

    it('calls setVisuallySimilarProp with empty string when visuallySimilarPDP is disabled', () => {
      mockUseLLMRecommendations.mockReturnValue({
        isVisuallySimilarPDPEnabled: false,
        setVisuallySimilarProp: mockSetVisuallySimilarProp,
        visuallySimilarProp: 'myProp',
      } as any)

      render(<RecommendedProductSection />)
      mockAllIsIntersecting(true)

      expect(mockSetVisuallySimilarProp).toHaveBeenCalledWith('')
    })
  })

  describe('renderRecommendations branching', () => {
    it('renders LookbookRecommendations when lookbook is enabled', () => {
      mockUseLookbookRecommendations.mockReturnValue({
        isLookbookRecommendationsEnabled: true,
        data: {} as any,
        isLoading: false,
      })

      render(<RecommendedProductSection />)
      mockAllIsIntersecting(true)

      expect(screen.getByText('LookbookRecommendations')).toBeVisible()
      expect(screen.queryByText('ProductRecommendationsWrapper')).toBeNull()
    })

    it('renders PDPRecommendationsTabbedContainer when xgen + inline experiment + similarProductConfigs', () => {
      mockUseAtomValue.mockImplementation((atom: any) => {
        const key = atom?.toString?.() || ''
        if (key.includes('xgenFeatures')) return { recommendations: true }
        return []
      })
      mockUseExperiment.mockReturnValue(true)
      mockUseProductData.mockReturnValue([{ someConfig: true }])

      render(<RecommendedProductSection />)
      mockAllIsIntersecting(true)

      const container = screen.getByText('PDPRecommendationsTabbedContainer')
      expect(container).toBeVisible()
      expect(container).toHaveAttribute('data-page-type', 'product')
      expect(container).toHaveAttribute('data-variant', 'inlinePDPv6')
    })

    it('renders ProductRecommendationsWrapper when visuallySimilarPDP is disabled', () => {
      mockUseLLMRecommendations.mockReturnValue({
        isVisuallySimilarPDPEnabled: false,
        setVisuallySimilarProp: mockSetVisuallySimilarProp,
        visuallySimilarProp: '',
      } as any)

      render(<RecommendedProductSection variant="testVariant" />)
      mockAllIsIntersecting(true)

      const wrapper = screen.getByText('ProductRecommendationsWrapper')
      expect(wrapper).toBeVisible()
      expect(wrapper).toHaveAttribute('data-type', 'ymal')
      expect(wrapper).toHaveAttribute('data-variant', 'testVariant')
    })

    it('renders skeleton when visuallySimilarPDP is enabled but data is not initialized', () => {
      mockUseLLMRecommendations.mockReturnValue({
        isVisuallySimilarPDPEnabled: true,
        setVisuallySimilarProp: mockSetVisuallySimilarProp,
        visuallySimilarProp: '',
      } as any)
      mockUseAtomValue.mockImplementation((atom: any) => {
        const key = atom?.toString?.() || ''
        if (key.includes('visuallySimilarData')) return []
        if (key.includes('isVisuallySimilarDataInitialized')) return false
        if (key.includes('xgenFeatures')) return { recommendations: false }
        return null
      })

      render(<RecommendedProductSection />)
      mockAllIsIntersecting(true)

      expect(screen.getAllByText('RecommendationsSliderSkeleton').length).toBeGreaterThanOrEqual(1)
    })

    it('renders VisuallySimilarSlider when enabled with initialized data', () => {
      mockUseLLMRecommendations.mockReturnValue({
        isVisuallySimilarPDPEnabled: true,
        setVisuallySimilarProp: mockSetVisuallySimilarProp,
        visuallySimilarProp: '',
      } as any)
      mockUseAtomValue.mockImplementation((atom: any) => {
        const key = atom?.toString?.() || ''
        if (key.includes('isVisuallySimilarDataInitialized')) return true
        if (key.includes('visuallySimilarData')) return [{ id: '1' }, { id: '2' }]
        if (key.includes('xgenFeatures')) return { recommendations: false }
        return null
      })

      render(<RecommendedProductSection visuallySimilarVariant="vsPDPv6" />)
      mockAllIsIntersecting(true)

      const slider = screen.getByText('VisuallySimilarSlider')
      expect(slider).toBeVisible()
      expect(slider).toHaveAttribute('data-variant', 'vsPDPv6')
    })

    it('falls back to ProductRecommendationsWrapper when VS is enabled, data initialized, but empty', () => {
      mockUseLLMRecommendations.mockReturnValue({
        isVisuallySimilarPDPEnabled: true,
        setVisuallySimilarProp: mockSetVisuallySimilarProp,
        visuallySimilarProp: '',
      } as any)
      mockUseAtomValue.mockImplementation((atom: any) => {
        const key = atom?.toString?.() || ''
        if (key.includes('isVisuallySimilarDataInitialized')) return true
        if (key.includes('visuallySimilarData')) return []
        if (key.includes('xgenFeatures')) return { recommendations: false }
        return null
      })

      render(<RecommendedProductSection />)
      mockAllIsIntersecting(true)

      expect(screen.getByText('ProductRecommendationsWrapper')).toBeVisible()
    })
  })
})
