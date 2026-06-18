import React from 'react'
import { render, screen } from 'test-utils/react'
import { useInView } from 'react-intersection-observer'
import { useAtomValue } from 'jotai/utils'
import VisuallySimilarContainer from 'toro/components/product/mobile/v7/VisuallySimilarContainer'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import { visuallySimilarDataAtom, isVisuallySimilarDataInitializedAtom } from 'store/global.atom'

jest.mock('react-intersection-observer')
jest.mock('jotai/utils')
jest.mock('toro/hooks/useLLMRecommendations')
jest.mock('toro/components/product/desktop/VisuallySimilarSlider', () => {
  return function MockVisuallySimilarSlider({ variant }: { variant?: string }) {
    return (
      <div data-qa="visually-similar-slider" data-variant={variant}>
        VisuallySimilarSlider
      </div>
    )
  }
})

jest.mock('toro/components/Box', () => {
  const React = jest.requireActual('react')

  return React.forwardRef((props: any, ref: any) => {
    const { children, sx, ...rest } = props
    return (
      <div ref={ref} style={sx} data-qa="box" {...rest}>
        {children}
      </div>
    )
  })
})

jest.mock(
  'toro/components/product/desktop/RecommendationsSlider/RecommendationsSliderSkeleton',
  () => {
    return function MockSkeleton() {
      return <div data-qa="recommendations-skeleton">Skeleton</div>
    }
  }
)

jest.mock('toro/hocs/withErrorBoundaryWrapper', () => {
  return (Component: React.ComponentType) => Component
})

const mockUseInView = useInView as jest.Mock
const mockUseAtomValue = useAtomValue as jest.Mock
const mockUseLLMRecommendations = useLLMRecommendations as jest.Mock

describe('VisuallySimilarContainer V7', () => {
  const mockSetVisuallySimilarProp = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    })

    mockUseLLMRecommendations.mockReturnValue({
      isVisuallySimilarPDPEnabled: true,
      setVisuallySimilarProp: mockSetVisuallySimilarProp,
      visuallySimilarProp: 'test-prop',
    } as any)

    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === visuallySimilarDataAtom) return ['p1', 'p2']
      if (atom === isVisuallySimilarDataInitializedAtom) return false
      return []
    })
  })

  it('renders skeleton when not in view', () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: false,
    })

    render(<VisuallySimilarContainer />)

    expect(screen.getByTestId('recommendations-skeleton')).toBeInTheDocument()
  })

  it('renders skeleton when data is initializing', () => {
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === visuallySimilarDataAtom) return []
      if (atom === isVisuallySimilarDataInitializedAtom) return false
      return []
    })

    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: false,
    })

    render(<VisuallySimilarContainer />)

    const skeleton = document.querySelector('[data-qa="recommendations-skeleton"]')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders slider when data is available', () => {
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === visuallySimilarDataAtom) return ['p1']
      if (atom === isVisuallySimilarDataInitializedAtom) return true
      return []
    })

    render(<VisuallySimilarContainer variant="test-variant" />)

    const slider = document.querySelector('[data-qa="visually-similar-slider"]')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('data-variant', 'test-variant')
  })

  it('returns null when feature is disabled', () => {
    jest.clearAllMocks()
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    })
    mockUseLLMRecommendations.mockReturnValue({
      isVisuallySimilarPDPEnabled: false,
      setVisuallySimilarProp: mockSetVisuallySimilarProp,
      visuallySimilarProp: 'test-prop',
    } as any)
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === visuallySimilarDataAtom) return ['p1', 'p2']
      if (atom === isVisuallySimilarDataInitializedAtom) return false
      return []
    })

    render(<VisuallySimilarContainer />)

    expect(document.querySelector('[data-qa="box"]')).not.toBeInTheDocument()
    expect(screen.queryByTestId('visually-similar-slider')).not.toBeInTheDocument()
    expect(screen.queryByTestId('recommendations-skeleton')).not.toBeInTheDocument()
  })

  it('renders nothing when no data is available', () => {
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === visuallySimilarDataAtom) return []
      if (atom === isVisuallySimilarDataInitializedAtom) return false
      return []
    })

    render(<VisuallySimilarContainer />)

    expect(document.querySelector('[data-qa="box"]')).toBeInTheDocument()
    expect(screen.queryByTestId('visually-similar-slider')).not.toBeInTheDocument()
    expect(screen.getByTestId('recommendations-skeleton')).toBeInTheDocument()
  })

  it('calls setVisuallySimilarProp when in view', () => {
    render(<VisuallySimilarContainer />)

    expect(mockSetVisuallySimilarProp).toHaveBeenCalledWith('test-prop')
  })

  it('does not call setVisuallySimilarProp when not in view', () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: false,
    })

    render(<VisuallySimilarContainer />)

    expect(mockSetVisuallySimilarProp).not.toHaveBeenCalled()
  })

  it('does not call API when feature is disabled', () => {
    mockUseLLMRecommendations.mockReturnValue({
      isVisuallySimilarPDPEnabled: false,
      setVisuallySimilarProp: mockSetVisuallySimilarProp,
      visuallySimilarProp: 'test-prop',
    } as any)

    render(<VisuallySimilarContainer />)

    expect(mockSetVisuallySimilarProp).not.toHaveBeenCalled()
  })

  it('does not call API when visuallySimilarProp is null', () => {
    mockUseLLMRecommendations.mockReturnValue({
      isVisuallySimilarPDPEnabled: true,
      setVisuallySimilarProp: mockSetVisuallySimilarProp,
      visuallySimilarProp: null,
    } as any)

    render(<VisuallySimilarContainer />)

    expect(mockSetVisuallySimilarProp).not.toHaveBeenCalled()
  })

  it('uses visuallySimilarVariant over variant', () => {
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === visuallySimilarDataAtom) return ['p1']
      if (atom === isVisuallySimilarDataInitializedAtom) return true
      return []
    })

    render(<VisuallySimilarContainer variant="fallback" visuallySimilarVariant="preferred" />)

    const slider = screen.getByTestId('visually-similar-slider')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('data-variant', 'preferred')
  })
})
