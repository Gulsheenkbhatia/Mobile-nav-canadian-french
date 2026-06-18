import React from 'react'
import { render, screen } from 'test-utils/react'
import YouMayAlsoLikeContainer from './index'
import useExperiment from 'toro/hooks/useExperiment'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtomValue } from 'jotai/utils'
import { XgenContainerID } from 'toro/lib/xgen/types'

jest.mock('toro/hooks/useExperiment', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/hooks/usePreference_new', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(() => jest.fn()),
  atomWithStorage: jest.fn(() => jest.fn()),
  createJSONStorage: jest.fn(() => jest.fn()),
}))

jest.mock('toro/components/VisuallySimilarGrid/VisuallySimilarGrid', () => {
  return function MockVisuallySimilarGrid({ schema, gridColumns }: any) {
    return (
      <div data-qa="visually-similar-grid" data-schema={schema} data-grid-columns={gridColumns}>
        VisuallySimilarGrid
      </div>
    )
  }
})

jest.mock('toro/components/product/RecommendedProductSection', () => {
  return {
    __esModule: true,
    default: function MockRecommendedProductSection(props: any) {
      return (
        <div
          data-qa="recommended-product-section"
          data-visually-similar-variant={props.visuallySimilarVariant}
        >
          RecommendedProductSection
        </div>
      )
    },
  }
})

const mockUseExperiment = jest.mocked(useExperiment)
const mockUsePreference = jest.mocked(usePreference)
const mockUseAtomValue = jest.mocked(useAtomValue)

describe('YouMayAlsoLikeContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockUseExperiment.mockReturnValue(false)
    mockUsePreference.mockReturnValue({
      recommendations: { disabledSchemes: [] },
    } as any)
    mockUseAtomValue.mockReturnValue({ recommendations: false })
  })

  describe('when type is "ymal" (default)', () => {
    it('renders RecommendedProductSection when no experiments are active', () => {
      render(<YouMayAlsoLikeContainer />)

      const section = screen.getByText('RecommendedProductSection')
      expect(section).toBeVisible()
      expect(section).toHaveAttribute('data-visually-similar-variant', 'visuallySimilarPDPv6')
      expect(screen.queryByText('VisuallySimilarGrid')).toBeNull()
    })

    it('forwards visuallySimilarVariant to RecommendedProductSection', () => {
      render(<YouMayAlsoLikeContainer variant="visuallySimilarPDPv7" />)

      const section = screen.getByText('RecommendedProductSection')
      expect(section).toHaveAttribute('data-visually-similar-variant', 'visuallySimilarPDPv7')
    })

    it('renders VisuallySimilarGrid with 2 columns when YMAL_GRID_2UP is active', () => {
      mockUseExperiment.mockImplementation((id) => id === 'abtest2947_b')
      mockUseAtomValue.mockReturnValue({ recommendations: true })

      render(<YouMayAlsoLikeContainer />)

      const grid = screen.getByText('VisuallySimilarGrid')
      expect(grid).toBeVisible()
      expect(grid).toHaveAttribute('data-grid-columns', '2')
      expect(grid).toHaveAttribute('data-schema', 'ymal')
      expect(screen.queryByText('RecommendedProductSection')).toBeNull()
    })

    it('renders VisuallySimilarGrid with 3 columns when YMAL_GRID_3UP is active', () => {
      mockUseExperiment.mockImplementation((id) => id === 'abtest2947_c')
      mockUseAtomValue.mockReturnValue({ recommendations: true })

      render(<YouMayAlsoLikeContainer />)

      const grid = screen.getByText('VisuallySimilarGrid')
      expect(grid).toBeVisible()
      expect(grid).toHaveAttribute('data-grid-columns', '3')
    })

    it('renders VisuallySimilarGrid with 3 columns when both grid experiments are active', () => {
      mockUseExperiment.mockImplementation((id) => id === 'abtest2947_b' || id === 'abtest2947_c')
      mockUseAtomValue.mockReturnValue({ recommendations: true })

      render(<YouMayAlsoLikeContainer />)

      const grid = screen.getByText('VisuallySimilarGrid')
      expect(grid).toBeVisible()
      expect(grid).toHaveAttribute('data-grid-columns', '3')
    })

    it('renders RecommendedProductSection when xgen recommendations are disabled', () => {
      mockUseExperiment.mockImplementation((id) => id === 'abtest2947_b' || id === 'abtest2947_c')
      mockUseAtomValue.mockReturnValue({ recommendations: false })

      render(<YouMayAlsoLikeContainer />)

      expect(screen.getByText('RecommendedProductSection')).toBeVisible()
      expect(screen.queryByText('VisuallySimilarGrid')).toBeNull()
    })

    it('renders RecommendedProductSection when ymal scheme is disabled', () => {
      mockUseExperiment.mockImplementation((id) => id === 'abtest2947_b' || id === 'abtest2947_c')
      mockUseAtomValue.mockReturnValue({ recommendations: true })
      mockUsePreference.mockReturnValue({
        recommendations: { disabledSchemes: [XgenContainerID.ymal] },
      } as any)

      render(<YouMayAlsoLikeContainer />)

      expect(screen.getByText('RecommendedProductSection')).toBeVisible()
      expect(screen.queryByText('VisuallySimilarGrid')).toBeNull()
    })

    it('renders RecommendedProductSection when only grid experiment is active but xgen is off', () => {
      mockUseExperiment.mockImplementation((id) => id === 'abtest2947_b')
      mockUseAtomValue.mockReturnValue({ recommendations: false })

      render(<YouMayAlsoLikeContainer />)

      expect(screen.getByText('RecommendedProductSection')).toBeVisible()
      expect(screen.queryByText('VisuallySimilarGrid')).toBeNull()
    })
  })

  describe('when type is not "ymal"', () => {
    it('renders RecommendedProductSection regardless of experiment flags', () => {
      mockUseExperiment.mockImplementation((id) => id === 'abtest2947_b' || id === 'abtest2947_c')
      mockUseAtomValue.mockReturnValue({ recommendations: true })

      render(<YouMayAlsoLikeContainer type="other" />)

      expect(screen.getByText('RecommendedProductSection')).toBeVisible()
      expect(screen.queryByText('VisuallySimilarGrid')).toBeNull()
    })
  })
})
