import { render, screen, waitFor } from 'test-utils/react'
import { SocialRecommendations } from './index'
import useProductData from 'toro/hooks/useProductData'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { visuallySimilarDataAtom } from 'store/global.atom'
import certonaSchemesAtom from 'store/certona-schemes.atoms'
import { experimentsAtom } from 'store/experiments.atom'
import { EXPERIMENTS } from 'toro/constants/experiments'

jest.mock('toro/hooks/useProductData')
jest.mock('toro/hooks/useLLMRecommendations')
jest.mock('toro/hooks/useMultiStyleConfig')

jest.mock('react-intl', () => {
  const actual = jest.requireActual<typeof import('react-intl')>('react-intl')
  return {
    ...actual,
    useIntl: () => ({
      formatMessage: ({ defaultMessage }: any) => defaultMessage,
    }),
  }
})

jest.mock(
  'toro/components/Text',
  () =>
    ({ children, as, variant, sx, dangerouslySetInnerHTML }: any) => {
      if (dangerouslySetInnerHTML) {
        return (
          <div
            data-qa="text"
            data-as={as}
            data-variant={variant}
            style={sx}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          />
        )
      }
      return (
        <div data-qa="text" data-as={as} data-variant={variant} style={sx}>
          {children}
        </div>
      )
    }
)

jest.mock('toro/components/RecommendationsContainer', () => ({ type, variant, hideLabel }: any) => (
  <div
    data-qa="recommendations-container"
    data-type={type}
    data-variant={variant}
    data-hide-label={hideLabel ? 'true' : undefined}
  >
    RecommendationsContainer
  </div>
))

jest.mock(
  'toro/components/LLMRecommendations',
  () =>
    ({ products, scheme, variant, isGrid, hideLabel, hideLLMPromo }: any) =>
      (
        <div
          data-qa="llm-recommendations"
          data-scheme={scheme}
          data-variant={variant}
          data-is-grid={isGrid ? 'true' : undefined}
          data-hide-label={hideLabel ? 'true' : undefined}
          data-hide-llm-promo={hideLLMPromo ? 'true' : undefined}
          data-products-count={products?.length || 0}
        >
          LLMRecommendations
        </div>
      )
)

jest.mock('toro/components/Certona/Recommendation/BaseCertonaContainer', () => ({
  CertonaRecommendation: ({
    certonaData,
    hidePrice,
    type,
    variant,
    productId,
    label,
    onItemClick,
    onClickATCDrawerRecommendationLink,
    recommendationViewMoreUrl,
    limit,
    isMatchingExperience,
  }: any) => (
    <div
      data-qa="certona-recommendation"
      data-type={type}
      data-variant={variant}
      data-product-id={productId}
      data-hide-price={hidePrice ? 'true' : 'false'}
      data-has-data={certonaData ? 'true' : 'false'}
    >
      CertonaRecommendation
    </div>
  ),
}))

jest.mock('toro/components/Experiment', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const jotaiUtils = require('jotai/utils')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const experimentStore = require('store/experiments.atom')

  return function Experiment({ children, forIDs }: any) {
    const { useAtomValue } = jotaiUtils
    const { experimentsAtom } = experimentStore
    const experiments = useAtomValue(experimentsAtom)

    if (typeof forIDs !== 'string') {
      return null
    }

    const splitIds = forIDs.split('-')
    const splitExperiments = experiments.split('-')
    const isEnabled = splitExperiments.some((experimentId: string) =>
      splitIds.includes(experimentId)
    )

    if (!isEnabled) {
      return null
    }

    return (
      <div data-qa="experiment" data-for-ids={forIDs}>
        {children}
      </div>
    )
  }
})

const mockedUseProductData = jest.mocked(useProductData)
const mockedUseLLMRecommendations = jest.mocked(useLLMRecommendations)
const mockedUseMultiStyleConfig = jest.mocked(useMultiStyleConfig)

const mockProductData = {
  id: 'test-product-123',
  variationGroup: 'test-variation-group',
  category_id: 'test-category-123',
}

const mockCertonaSchemes = [
  { scheme: 'product3_rr', data: 'mock-certona-data', items: [{ id: 'item-1' }, { id: 'item-2' }] },
  { scheme: 'other_scheme', data: 'other-data', items: [] },
]

const mockVisuallySimilarData = [
  { id: 'similar-1', name: 'Similar Product 1' },
  { id: 'similar-2', name: 'Similar Product 2' },
]

const mockStyles = {
  baseRecommendationTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
}

const createAtomContexts = (experiments = ''): Map<any, any> => {
  return new Map([
    [visuallySimilarDataAtom, mockVisuallySimilarData],
    [certonaSchemesAtom, mockCertonaSchemes],
    [experimentsAtom, experiments],
  ] as [any, any][])
}

describe('SocialRecommendations', () => {
  let mockSetVisuallySimilarProp: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockSetVisuallySimilarProp = jest.fn()

    mockedUseProductData.mockImplementation((key: any) => {
      if (Array.isArray(key)) {
        return key.map((k) => mockProductData[k as keyof typeof mockProductData])
      }
      return mockProductData[key as keyof typeof mockProductData]
    })

    mockedUseLLMRecommendations.mockReturnValue({
      llmApiVersion: 'v2',
      setVisuallySimilarProp: mockSetVisuallySimilarProp,
      visuallySimilarProp: 'test-similar-product-ids',
    } as any)

    mockedUseMultiStyleConfig.mockReturnValue(mockStyles as any)
  })

  describe('Component Structure', () => {
    it('should render the main title when VIEW_SIMILAR experiment is active with data', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.VIEW_SIMILAR_RECOMMENDATIONS_PDP),
        },
      })

      const title = screen.getByText('Perfect Matches For You')
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-variant', 'secondary')
    })

    it('should apply correct styles to the title when CERTONA experiment is active with data', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.CERTONA_RECOMMENDATIONS_PDP),
        },
      })

      const title = screen.getByText('Perfect Matches For You')
      expect(title).toHaveStyle({
        fontSize: '24px',
        fontWeight: 'bold',
        display: 'block',
        marginTop: 'var(--spacing-8)',
      })
    })

    it('should call useMultiStyleConfig with correct parameters when recommendation data is available', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.VIEW_SIMILAR_RECOMMENDATIONS_PDP),
        },
      })

      expect(mockedUseMultiStyleConfig).toHaveBeenCalledWith('RecommendationsContainer', {
        variant: 'similarProductRecommendationAdaptivePDP',
      })
    })
  })

  describe('XGEN Recommendations', () => {
    it('should render RecommendationsContainer when XGEN experiment is active', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.XGEN_RECOMMENDATIONS_PDP),
        },
      })

      const container = screen.getByTestId('recommendations-container')
      expect(container).toBeInTheDocument()
      expect(container).toHaveAttribute('data-type', 'product3_rr')
      expect(container).toHaveAttribute('data-variant', 'aeDrawerGridSocial')
      expect(container).toHaveAttribute('data-hide-label', 'true')
    })

    it('should not render RecommendationsContainer when XGEN experiment is not active', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(''),
        },
      })

      const container = screen.queryByTestId('recommendations-container')
      expect(container).not.toBeInTheDocument()
    })

    it('should wrap RecommendationsContainer in Experiment component', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.XGEN_RECOMMENDATIONS_PDP),
        },
      })

      const experiments = screen.getAllByTestId('experiment')
      const xgenExperiment = experiments.find(
        (el) => el.getAttribute('data-for-ids') === EXPERIMENTS.XGEN_RECOMMENDATIONS_PDP
      )
      expect(xgenExperiment).toBeTruthy()
    })
  })

  describe('Visually Similar Recommendations', () => {
    it('should render LLMRecommendations when VIEW_SIMILAR experiment is active', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.VIEW_SIMILAR_RECOMMENDATIONS_PDP),
        },
      })

      const llmRecs = screen.getByTestId('llm-recommendations')
      expect(llmRecs).toBeInTheDocument()
      expect(llmRecs).toHaveAttribute('data-scheme', 'product3_rr')
      expect(llmRecs).toHaveAttribute('data-variant', 'aeDrawerGridSocial')
      expect(llmRecs).toHaveAttribute('data-is-grid', 'true')
      expect(llmRecs).toHaveAttribute('data-hide-label', 'true')
      expect(llmRecs).toHaveAttribute('data-hide-llm-promo', 'true')
    })

    it('should pass visuallySimilarData to LLMRecommendations', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.VIEW_SIMILAR_RECOMMENDATIONS_PDP),
        },
      })

      const llmRecs = screen.getByTestId('llm-recommendations')
      expect(llmRecs).toHaveAttribute('data-products-count', '2')
    })

    it('should not render LLMRecommendations when VIEW_SIMILAR experiment is not active', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(''),
        },
      })

      const llmRecs = screen.queryByTestId('llm-recommendations')
      expect(llmRecs).not.toBeInTheDocument()
    })

    it('should use visuallySimilarProp from useLLMRecommendations hook', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.VIEW_SIMILAR_RECOMMENDATIONS_PDP),
        },
      })

      expect(mockedUseLLMRecommendations).toHaveBeenCalled()
    })

    it('should call setVisuallySimilarProp with visuallySimilarProp from hook', async () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.VIEW_SIMILAR_RECOMMENDATIONS_PDP),
        },
      })

      await waitFor(() => {
        expect(mockSetVisuallySimilarProp).toHaveBeenCalledWith('test-similar-product-ids')
      })
    })

    it('should recalculate when visuallySimilarProp changes', async () => {
      const { rerender } = render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.VIEW_SIMILAR_RECOMMENDATIONS_PDP),
        },
      })

      const initialCallCount = mockSetVisuallySimilarProp.mock.calls.length

      // Update visuallySimilarProp (triggers useEffect)
      mockedUseLLMRecommendations.mockReturnValue({
        llmApiVersion: 'v2',
        setVisuallySimilarProp: mockSetVisuallySimilarProp,
        visuallySimilarProp: 'new-similar-product-ids',
      } as any)

      rerender(<SocialRecommendations />)

      await waitFor(() => {
        expect(mockSetVisuallySimilarProp.mock.calls.length).toBeGreaterThan(initialCallCount)
      })
    })
  })

  describe('Certona Recommendations', () => {
    it('should render CertonaRecommendation when CERTONA experiment is active', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.CERTONA_RECOMMENDATIONS_PDP),
        },
      })

      const certonaRec = screen.getByTestId('certona-recommendation')
      expect(certonaRec).toBeInTheDocument()
      expect(certonaRec).toHaveAttribute('data-type', 'product3_rr')
      expect(certonaRec).toHaveAttribute('data-variant', 'aeDrawerGridSocial')
      expect(certonaRec).toHaveAttribute('data-hide-price', 'false')
    })

    it('should pass product ID to CertonaRecommendation', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.CERTONA_RECOMMENDATIONS_PDP),
        },
      })

      const certonaRec = screen.getByTestId('certona-recommendation')
      expect(certonaRec).toHaveAttribute('data-product-id', 'test-product-123')
    })

    it('should use product3_rr scheme from certonaSchemesAtom', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.CERTONA_RECOMMENDATIONS_PDP),
        },
      })

      const certonaRec = screen.getByTestId('certona-recommendation')
      expect(certonaRec).toHaveAttribute('data-has-data', 'true')
    })

    it('should not render CertonaRecommendation when CERTONA experiment is not active', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(''),
        },
      })

      const certonaRec = screen.queryByTestId('certona-recommendation')
      expect(certonaRec).not.toBeInTheDocument()
    })

    it('should fetch product ID from useProductData', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(EXPERIMENTS.CERTONA_RECOMMENDATIONS_PDP),
        },
      })

      expect(mockedUseProductData).toHaveBeenCalledWith('id')
    })
  })

  describe('Multiple Active Experiments', () => {
    it('should render multiple recommendation types when multiple experiments are active', () => {
      const multipleExperiments = `${EXPERIMENTS.XGEN_RECOMMENDATIONS_PDP}-${EXPERIMENTS.VIEW_SIMILAR_RECOMMENDATIONS_PDP}-${EXPERIMENTS.CERTONA_RECOMMENDATIONS_PDP}`

      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(multipleExperiments),
        },
      })

      expect(screen.getByTestId('recommendations-container')).toBeInTheDocument()
      expect(screen.getByTestId('llm-recommendations')).toBeInTheDocument()
      expect(screen.getByTestId('certona-recommendation')).toBeInTheDocument()
    })

    it('should render only active experiments', () => {
      const partialExperiments = `${EXPERIMENTS.XGEN_RECOMMENDATIONS_PDP}-${EXPERIMENTS.CERTONA_RECOMMENDATIONS_PDP}`

      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(partialExperiments),
        },
      })

      expect(screen.getByTestId('recommendations-container')).toBeInTheDocument()
      expect(screen.queryByTestId('llm-recommendations')).not.toBeInTheDocument()
      expect(screen.getByTestId('certona-recommendation')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should not render LLMRecommendations when visuallySimilarData is empty', () => {
      const emptyDataContexts = new Map<any, any>([
        [visuallySimilarDataAtom, []],
        [certonaSchemesAtom, mockCertonaSchemes],
        [experimentsAtom, EXPERIMENTS.VIEW_SIMILAR_RECOMMENDATIONS_PDP],
      ] as [any, any][])

      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: emptyDataContexts,
        },
      })

      expect(screen.queryByTestId('llm-recommendations')).not.toBeInTheDocument()
      expect(screen.queryByText('Perfect Matches For You')).not.toBeInTheDocument()
    })

    it('should not render CertonaRecommendation when scheme is missing', () => {
      const noSchemeContexts = new Map<any, any>([
        [visuallySimilarDataAtom, mockVisuallySimilarData],
        [certonaSchemesAtom, [{ scheme: 'other_scheme', data: 'other-data', items: [] }]],
        [experimentsAtom, EXPERIMENTS.CERTONA_RECOMMENDATIONS_PDP],
      ] as [any, any][])

      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: noSchemeContexts,
        },
      })

      expect(screen.queryByTestId('certona-recommendation')).not.toBeInTheDocument()
      expect(screen.queryByText('Perfect Matches For You')).not.toBeInTheDocument()
    })

    it('should not crash with null/undefined certonaSchemesAtom', () => {
      const nullSchemeContexts = new Map<any, any>([
        [visuallySimilarDataAtom, mockVisuallySimilarData],
        [certonaSchemesAtom, null],
        [experimentsAtom, EXPERIMENTS.CERTONA_RECOMMENDATIONS_PDP],
      ] as [any, any][])

      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: nullSchemeContexts,
        },
      })

      // Should not crash and should not render anything
      expect(screen.queryByTestId('certona-recommendation')).not.toBeInTheDocument()
      expect(screen.queryByText('Perfect Matches For You')).not.toBeInTheDocument()
    })

    it('should render nothing when no experiments are active', () => {
      render(<SocialRecommendations />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(''),
        },
      })

      expect(screen.queryByText('Perfect Matches For You')).not.toBeInTheDocument()
      expect(screen.queryByTestId('recommendations-container')).not.toBeInTheDocument()
      expect(screen.queryByTestId('llm-recommendations')).not.toBeInTheDocument()
      expect(screen.queryByTestId('certona-recommendation')).not.toBeInTheDocument()
    })
  })
})
