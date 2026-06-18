import { render, CustomRenderOptions } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import { useAtomValue } from 'jotai/utils'
import usePreference from 'toro/hooks/usePreference_new'
import SearchSuggestionCategories, {
  SearchSuggestionCategoriesProps,
} from 'toro/components/SearchWidget/SearchSuggestionCategories'
import {
  initialRecommendedSearchesAtom,
  isEmptySearchResultsAtom,
  isInitialSuggestionsAtom,
  isSearchInDrawerActiveAtom,
  recommendedSearchesAtom,
  searchRecentItemsAvailableAtom,
  searchesByTermAtom,
} from 'store/search.atom'

jest.mock('jotai/utils')
jest.mock('toro/hooks/usePreference_new')

const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

const mockStyles = {
  SearchSuggestionCategoriesWrapper: { color: 'blue' },
  SearchSuggestionCategoriesText: { fontSize: '16px' },
  SearchSuggestionCategoriesLink: { textDecoration: 'none' },
  SearchSuggestionCategoriesDetails: { display: 'flex' },
  SearchSuggestionCategoriesName: { fontWeight: 'bold' },
  SearchSuggestionCategoriesCount: { marginLeft: '8px' },
}

const mockOnClick = jest.fn()

const mockRecommendedSearches = [
  { name: 'Bags', link: '/bags', count: 10 },
  { name: 'Fashion', link: '/fashion', count: 5 },
]

const mockRecommendedSearchesWithoutCount = [
  { name: 'Bags', link: '/bags' },
  { name: 'Fashion', link: '/fashion' },
]

const defaultProps: SearchSuggestionCategoriesProps = {
  title: 'Top Searches',
  onClick: mockOnClick,
  variant: 'mobile',
  subBrandQuery: '?coachtopia',
  styles: mockStyles,
}

const makeSetup = (props: Partial<SearchSuggestionCategoriesProps> = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<SearchSuggestionCategories {...combinedProps} />, renderOptions)
}

describe('SearchSuggestionCategories', () => {
  beforeEach(() => {
    mockedUsePreference.mockImplementation(() => ({
      xgenPreferences: { searchV2Features: { SearchOverlayRedesign: false } },
    }))
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case searchesByTermAtom:
          return 'searchQuery'
        case searchRecentItemsAvailableAtom:
          return false
        case isInitialSuggestionsAtom:
          return true
        case recommendedSearchesAtom:
          return mockRecommendedSearches
        case initialRecommendedSearchesAtom:
          return [
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
          ]
        case isEmptySearchResultsAtom:
          return false
        case isSearchInDrawerActiveAtom:
          return false
        default:
          return undefined
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component properly', () => {
    const { getByText } = makeSetup()
    const titleElement = getByText('Top Searches')
    expect(titleElement).toBeVisible()
    expect(titleElement).toHaveAttribute('data-qa', 'cm_txt_popular_sugglist')
  })

  it('should render the component properly when variant is footer', () => {
    const { getByText } = makeSetup({ variant: 'footer' })
    const titleElement = getByText('Top Searches')
    expect(titleElement).toBeVisible()
  })

  it('should render category links with correct URLs and attributes', async () => {
    const { getAllByRole } = makeSetup()
    const links = getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/bags?coachtopia')
    expect(links[1]).toHaveAttribute('href', '/fashion?coachtopia')

    await userEvent.click(links[0])
    expect(mockOnClick).toHaveBeenCalledWith('Bags')

    await userEvent.click(links[1])
    expect(mockOnClick).toHaveBeenCalledWith('Fashion')
  })

  it('should render coategory links when initial suggestion is false', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isInitialSuggestionsAtom) {
        return false
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getAllByRole } = makeSetup()
    const links = getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/bags')
    expect(links[1]).toHaveAttribute('href', '/fashion')
  })

  it('should render category names with highlight if variant is mobileV2', () => {
    const { getByText } = makeSetup({ variant: 'mobileV2' })
    expect(getByText('Bags')).toBeVisible()
  })

  it('should render category count when available', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === searchRecentItemsAvailableAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByText } = makeSetup({ variant: 'footer' })
    expect(getByText('(10)')).toBeVisible()
  })

  it('should handle recent searches correctly', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === searchRecentItemsAvailableAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByText } = makeSetup({ title: 'Recent Searches' })
    const titleElement = getByText('Recent Searches')
    expect(titleElement).toBeVisible()
    expect(titleElement).toHaveAttribute('data-qa', 'cm_txt_recent_sugglist')
  })

  it('should not render count if not available', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === recommendedSearchesAtom) {
        return mockRecommendedSearchesWithoutCount
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { queryByText } = makeSetup()
    expect(queryByText('(10)')).toBeNull()
  })
})
