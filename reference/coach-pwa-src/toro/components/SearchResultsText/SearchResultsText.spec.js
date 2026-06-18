import { render } from 'test-utils/react'
import SearchResultsText from 'toro/components/SearchResultsText'
import useViewportType from 'toro/hooks/useViewportType'
import usePageType from 'toro/hooks/usePageType'
import { totalProductsAtom } from 'store/search-results.atom'
import { isPlpV3Atom } from 'store/plp.atom'
import { useAtomValue } from 'jotai/utils'
import { useRouter } from 'next/router'

jest.mock('jotai/utils')
jest.mock('toro/hooks/useViewportType')
jest.mocked(useViewportType).mockImplementation(() => ({ isMobile: true }))
jest.mock('toro/hooks/usePageType')
jest.mocked(usePageType).mockImplementation(() => ({ isSRP: true }))
const mockedUseAtomValue = jest.mocked(useAtomValue)

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))
const mockedUseRouter = jest.mocked(useRouter)

const mockUseAtomValues = (total = 0, isPlpV3 = true) => {
  mockedUseAtomValue.mockImplementation((atom) => {
    switch (atom) {
      case totalProductsAtom:
        return total
      case isPlpV3Atom:
        return isPlpV3
      default:
        return ''
    }
  })
}

describe('SearchResultsText', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseRouter.mockImplementation(() => ({
      query: { discontinued: false },
    }))
  })

  const renderComponent = (props) => {
    return render(
      <SearchResultsText
        loading={false}
        pageData={{ oosCategoryNameDisplay: 'the product C5147' }}
        {...props}
      />
    )
  }

  it('renders no search result component when total count it 0', () => {
    mockUseAtomValues()
    const { getByText } = renderComponent()

    expect(getByText('No Results Found for')).toBeInTheDocument()
    expect(getByText('0 Products')).toBeInTheDocument()
  })

  it('renders search results when total is greater than 0', () => {
    mockUseAtomValues(5)
    const { getByText } = renderComponent({
      pageData: { searchTerm: 'bag', isFeatured: false },
    })

    expect(getByText('5 results for "bag"')).toBeInTheDocument()
    expect(getByText('5 Products')).toBeInTheDocument()
  })

  it('renders suggestion phrase correctly', () => {
    mockUseAtomValues(10)
    const { getByText, getByTestId } = renderComponent({
      suggestionPhrase: 'bags',
      pageData: { searchTerm: 'beg', isFeatured: true },
    })

    expect(getByTestId('hs_invsearch_txt_didyoumean')).toBeInTheDocument()
    expect(getByText('10 Products')).toBeInTheDocument()
  })

  it('renders alternate products text correctly', () => {
    const { getByText } = renderComponent({
      isAlternateProducts: true,
      pageData: { searchTerm: 'beg', isFeatured: true },
    })

    expect(getByText('No Match Found For “beg”')).toBeInTheDocument()
  })

  it('renders if the product is discontinued', () => {
    mockUseAtomValues(10)
    mockedUseRouter.mockImplementation(() => ({
      query: { discontinued: 'tabbyshoulderbag' },
    }))
    const { getByTestId } = renderComponent({
      isAlternateProducts: true,
      pageData: { searchTerm: 'beg', isFeatured: true },
    })

    expect(getByTestId('cm_plp_txt_we_think_youll_love_alternate_pdt')).toBeInTheDocument()
  })
})
