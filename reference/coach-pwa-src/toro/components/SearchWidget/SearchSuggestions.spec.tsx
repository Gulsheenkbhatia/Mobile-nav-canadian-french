import { render, CustomRenderOptions } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import { useAtomValue } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference_new'
import SearchSuggestions from 'toro/components/SearchWidget/SearchSuggestions'
import {
  initialSearchStateAtom,
  isEmptySearchResultsAtom,
  isInitialSuggestionsAtom,
  isSearchInDrawerActiveAtom,
  recommendedSearchesAtom,
  searchesByTermAtom,
  searchRecentItemsAvailableAtom,
  searchTermAtom,
  searchTotalProductCountAtom,
  suggestedItemsAtom,
  invalidSearchTermErrorAtom,
} from 'store/search.atom'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import certonaSchemesAtoms from 'store/certona-schemes.atoms'
import useExperiment from 'toro/hooks/useExperiment'

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

jest.mock('jotai/utils')
const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>

jest.mock('toro/hooks/useViewportType')
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>

jest.mock('toro/hooks/useExperiment', () => jest.fn())
const mockUseExperiment = useExperiment as jest.Mock

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
    messages: {
      'search.searchSuggestions.topProducts': 'Top Products',
      'search.searchSuggestions.defaultRecommenderTitle': 'Default Recommender Title',
      'search.recentlyViewedProducts': 'RECENTLY VIEWED PRODUCTS',
      'search.bestSellingProducts': 'Best Selling Products',
      'search.searchSuggestions.viewAll': 'View All',
      'search.topSearches': 'Top Searches',
      'search.recentSearchesTitle': 'Recent Searches Title',
      'search.popularSearches': 'Popular Searches',
      'search.searchSuggestions.topSuggestions': 'Top Suggestions',
      'search.searchSuggestions.NoResultsFound': 'No Results Found',
    },
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

jest.mock('toro/analytics/useAnalytics')
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>

jest.mock('toro/analytics/useRecommAnalytics', () =>
  jest.fn(() => ({
    addImpression: jest.fn(),
    selectRecommItem: jest.fn(),
  }))
)

jest.mock('toro/hooks/usePreference_new')
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>

const mockOnSuggestionItemClick = jest.fn()
jest.mock('toro/components/SearchWidget/SearchSuggestionItem', () => () => (
  <div data-qa="mocked-search-suggestion-item" onClick={mockOnSuggestionItemClick}>
    Rendered Producs
  </div>
))

const onClose = jest.fn()
const mockSendAnalytics = jest.fn()

const defaultProps = {
  onClose,
  styleVariant: 'desktop' as const,
  styles: {
    suggestions: {},
    suggestionsContainer: {},
    suggestionsItemsContainer: {},
    searchSuggestionWrapper: {},
    searchSuggestionHeader: {},
    searchSuggestionProductLink: {},
    suggestionsItems: {},
    suggestionsCategories: {},
    noResultsCont: {},
  },
}
const makeSetup = (props = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<SearchSuggestions {...combinedProps} />, renderOptions)
}

describe('SearchSuggestions', () => {
  beforeEach(() => {
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, viewport: 'desktop' }))
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    mockUseExperiment.mockReturnValue(false)
    mockedUsePreference.mockImplementation(() => ({
      xgenPreferences: { enableXgenSearch: false },
      einsteinRecommendation: {
        isEinsteinRecomEnabled: true,
        isEinsteinRecomEnabledSearchSuggestion: true,
        recommendorsList: {
          SEARCH_SUGGESTION: [
            {
              recommenderName: 'Recommender Name',
              otherProperty1: 'value1',
              otherProperty2: 'value2',
            },
          ],
        },
      },
      priceSitePreferences: { isComparablePriceValue: true, hideListPrice: false },
    }))
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case xgenFeaturesAtom:
          return { search: false }
        case searchesByTermAtom:
          return 'searchQuery'
        case suggestedItemsAtom:
          return [
            {
              id: '1',
              isAiDriven: true,
            },
            {
              id: '2',
              isAiDriven: true,
            },
            {
              id: '3',
              isAiDriven: true,
            },
          ]
        case searchTermAtom:
          return ''
        case recommendedSearchesAtom:
          return [
            {
              id: 1,
              term: 'Recommended Search Term 1',
              category: 'Category 1',
              relevance: 'High',
            },
            {
              id: 2,
              term: 'Recommended Search Term 2',
              category: 'Category 2',
              relevance: 'Medium',
            },
            {
              id: 3,
              term: 'Recommended Search Term 3',
              category: 'Category 3',
              relevance: 'Low',
            },
          ]
        case searchRecentItemsAvailableAtom:
          return false
        case isInitialSuggestionsAtom:
          return true
        case searchTotalProductCountAtom:
          return 5
        case initialSearchStateAtom:
          return {
            products: [
              {
                id: '1',
                isAiDriven: true,
              },
              {
                id: '2',
                isAiDriven: true,
              },
            ],
            searches: [
              {
                id: 1,
                name: 'Initial Search 1',
                link: '/search1',
                count: 10,
              },
              {
                id: 2,
                name: 'Initial Search 2',
                link: '/search2',
                count: 5,
              },
            ],
          }
        case isEmptySearchResultsAtom:
          return false
        case isSearchInDrawerActiveAtom:
          return false
        case invalidSearchTermErrorAtom:
          return false
        case certonaSchemesAtoms:
          return [
            {
              scheme: 'searchrv1_rr',
              explanation: 'This is the explanation for the searchrv1_rr scheme.',
            },
            {
              scheme: 'searchrv2_rr',
              explanation: 'This is the explanation for another scheme.',
            },
          ]
        default:
          return undefined
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders SearchSuggestions component with default props', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('d_hdr_search_drawer')).toBeVisible()
  })

  it('renders viewall link for mobile view correctly', () => {
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, viewport: 'mobile' }))
    const { getByText } = makeSetup()
    expect(getByText('View All')).toBeVisible()
  })

  it('renders the component correctly when XGEN search is not enabled', () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        xgenPreferences: { enableXgenSearch: false },
      }
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('d_hdr_search_drawer')).toBeVisible()
  })

  it('renders SearchSuggestions component correctly with no results found when there are no products and recommended searches with no initial suggestions', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isInitialSuggestionsAtom) {
        return false
      }
      if (atom === recommendedSearchesAtom) {
        return []
      }
      if (atom === suggestedItemsAtom) {
        return []
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByText } = makeSetup()
    expect(getByText('No Results Found')).toBeVisible()
  })

  it('renders the component correctly when XGEN search is not enabled and there is no initial suggestions', () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        xgenPreferences: { enableXgenSearch: false },
      }
    })
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isInitialSuggestionsAtom) {
        return false
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('d_hdr_search_drawer')).toBeVisible()
  })

  it('renders the component correctly when XGEN search is not enabled and recent search items are available', () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        xgenPreferences: { enableXgenSearch: false },
      }
    })
    const originalMockImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === searchRecentItemsAvailableAtom) {
        return true
      }
      return originalMockImplementation ? originalMockImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('d_hdr_search_drawer')).toBeVisible()
  })

  it('renders the component correctly when XGEN search is not enabled and recent search items are available with some search term', () => {
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, viewport: 'mobile' }))
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        xgenPreferences: { enableXgenSearch: false },
      }
    })
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === searchRecentItemsAvailableAtom) {
        return true
      }
      if (atom === searchTermAtom) {
        return 'tabby'
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup({ styleVariant: 'mobileV2' })
    expect(getByTestId('m_hdr_search_drawer')).toBeVisible()
  })

  it('renders the component correctly when style variant is footer and recent search items are available', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === searchRecentItemsAvailableAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup({ styleVariant: 'footer' })
    expect(getByTestId('hs_txt_bsp_title')).toBeVisible()
  })

  it('renders the component with title having einstein recommender name correctly', () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        xgenPreferences: { enableXgenSearch: false },
      }
    })
    const { getAllByRole } = makeSetup()
    const paragraphs = getAllByRole('paragraph')
    expect(paragraphs[0].innerHTML).toEqual('Default Recommender Title')
  })

  it('renders search suggestion category when total products are zero', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === searchTotalProductCountAtom) {
        return 0
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('cm_txt_popular_sugglist')).toBeVisible()
  })

  it('renders search suggestion category when total products are zero with no intial suggestions', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === searchTotalProductCountAtom) {
        return 0
      }
      if (atom === isInitialSuggestionsAtom) {
        return false
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('cm_txt_popular_sugglist')).toBeVisible()
  })

  it('renders search suggestion category when total products are zero and recent search items are available', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === searchTotalProductCountAtom) {
        return 0
      }
      if (atom === searchRecentItemsAvailableAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('cm_txt_recent_sugglist')).toBeVisible()
  })

  it('renders the title Best Selling Products when XGEN search is not enabled', () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        xgenPreferences: { enableXgenSearch: false },
        einsteinRecommendation: {
          ...originalPreferences.einsteinRecommendation,
          isEinsteinRecomEnabled: false,
        },
      }
    })
    const { getAllByRole } = makeSetup()
    const paragraphs = getAllByRole('paragraph')
    expect(paragraphs[0].innerHTML).toEqual('Best Selling Products')
  })

  it('handles suggestion category click event', async () => {
    const { getAllByRole } = makeSetup()
    const links = getAllByRole('link')
    await userEvent.click(links[1])
    expect(onClose).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('handles view all link click event', async () => {
    const { getAllByRole } = makeSetup()
    const links = getAllByRole('link')
    await userEvent.click(links[0])
    expect(onClose).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('renders SearchSuggestionCategory component and triggers send analytics function when XGEN search is not enabled', async () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        xgenPreferences: { enableXgenSearch: false },
      }
    })
    const { getAllByRole } = makeSetup()
    const links = getAllByRole('link')
    await userEvent.click(links[1])
    expect(onClose).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('renders SearchSuggestionCategory component and triggers send analytics function when XGEN search is not enabled and recent search is available', async () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        xgenPreferences: { enableXgenSearch: false },
      }
    })
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === searchRecentItemsAvailableAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getAllByRole } = makeSetup()
    const links = getAllByRole('link')
    await userEvent.click(links[1])
    expect(onClose).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('renders SearchSuggestionCategory component and triggers send analytics function when XGEN search is not enabled and search query is not available', async () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        xgenPreferences: { enableXgenSearch: false },
      }
    })
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === searchesByTermAtom) {
        return ''
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getAllByRole } = makeSetup()
    const links = getAllByRole('link')
    await userEvent.click(links[1])
    expect(onClose).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('renders correctly when invalidSearchTermError is false', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === invalidSearchTermErrorAtom) {
        return false
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('d_hdr_search_drawer')).toBeVisible()
  })

  it('renders correctly when invalidSearchTermError is true', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === invalidSearchTermErrorAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('d_hdr_search_drawer')).toBeVisible()
  })
})
