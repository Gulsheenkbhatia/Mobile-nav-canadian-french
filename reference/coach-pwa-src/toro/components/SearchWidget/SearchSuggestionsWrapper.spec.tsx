import { render, CustomRenderOptions, waitFor } from 'test-utils/react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import SearchSuggestionsWrapper from 'toro/components/SearchWidget/SearchSuggestionsWrapper'
import {
  isSearchSuggestionsChunkLoadedAtom,
  recommendedSearchesAtom,
  setIsSearchSuggestionsChunkLoadedAtom,
  suggestedItemsAtom,
  invalidSearchTermErrorAtom,
} from 'store/search.atom'

jest.mock('jotai/utils')

const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockeduseUpdateAtom = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>

jest.mock('toro/components/SearchWidget/SearchSuggestions', () => () => (
  <div data-qa="search-suggestions">Search Suggestions Component</div>
))

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

const setIsSearchSuggestionsChunkLoadedMock = jest.fn()

const defaultProps = {
  onClose: jest.fn(),
  styleVariant: 'desktop' as const,
  styles: {},
  isSearchActive: false,
}

const makeSetup = (props = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<SearchSuggestionsWrapper {...combinedProps} />, renderOptions)
}

describe('SearchSuggestionsWrapper', () => {
  beforeEach(() => {
    mockeduseUpdateAtom.mockImplementation((atom) => {
      switch (atom) {
        case setIsSearchSuggestionsChunkLoadedAtom:
          return setIsSearchSuggestionsChunkLoadedMock
        default:
          return undefined
      }
    })
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case recommendedSearchesAtom:
          return []
        case suggestedItemsAtom:
          return []
        case isSearchSuggestionsChunkLoadedAtom:
          return false
        case invalidSearchTermErrorAtom:
          return false
        default:
          return undefined
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render SearchSuggestions component when suggestion chunk is already loaded', async () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isSearchSuggestionsChunkLoadedAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    await waitFor(() => {
      expect(getByTestId('search-suggestions')).toBeVisible()
    })
  })

  it('should not render SearchSuggestions component when suggestions chunk is not loaded and no suggested items or searches are active', () => {
    const { queryByTestId } = makeSetup()
    expect(setIsSearchSuggestionsChunkLoadedMock).not.toHaveBeenCalled()
    expect(queryByTestId('search-suggestions')).not.toBeInTheDocument()
  })

  it('should trigger loading the suggestions chunk and not render SearchSuggestions when suggestions chunk is not loaded and recommended searches, products, or isSearchActive is true', () => {
    const { queryByTestId } = makeSetup({ isSearchActive: true })
    expect(setIsSearchSuggestionsChunkLoadedMock).toHaveBeenCalledWith(true)
    expect(queryByTestId('search-suggestions')).not.toBeInTheDocument()
  })
})
