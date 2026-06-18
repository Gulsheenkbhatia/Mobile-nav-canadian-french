import React from 'react'
import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/router'
import SearchExpose from 'toro/components/product/mobile/SearchExpose'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import { getSearchUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import { useAtomValue } from 'jotai/utils'
import { mockIntersectionObserver } from 'test-utils/mock-utils'

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('toro/hooks/useStyleConfig', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/hooks/usePreference_new', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/lib/sales-force-connector/utils/getUrl', () => ({
  getSearchUrl: jest.fn(),
}))

jest.mock('toro/analytics/useAnalytics', () => ({
  __esModule: true,
  default: () => ({
    send: jest.fn(),
  }),
}))

mockIntersectionObserver()

jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  useUpdateAtom: jest.fn(),
  atomWithReset: jest.fn(() => jest.fn()),
  atomWithStorage: jest.fn(() => jest.fn()),
  selectAtom: jest.fn(() => jest.fn()),
  createJSONStorage: jest.fn(() => jest.fn()),
  loadable: jest.fn(),
}))

jest.mock('jotai', () => ({
  atom: jest.fn(() => jest.fn()),
  atomWithReset: jest.fn(() => jest.fn()),
  useAtom: jest.fn(),
  useAtomValue: jest.fn(),
  useSetAtom: jest.fn(),
}))

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
  IntlProvider: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('store/search.atom', () => ({
  trendingSearchesLoadableAtom: 'mockTrendingSearchesAtom',
}))

jest.mock('toro/components/Box', () => ({
  __esModule: true,
  default: ({ children, as = 'div', sx, className, ...props }: any) => {
    const Component = as
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    )
  },
}))

jest.mock('toro/components/Link', () => ({
  __esModule: true,
  default: ({ children, href, sx, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

jest.mock('toro/components/Input', () => ({
  __esModule: true,
  default: ({ sx, variant, ...props }: any) => <input {...props} />,
}))

jest.mock('toro/icons/search.svg', () => ({
  __esModule: true,
  default: ({ width, height }: { width: string; height: string }) => (
    <svg data-qa="search-icon" width={width} height={height}>
      <title>Search</title>
    </svg>
  ),
}))

jest.mock('toro/icons', () => ({
  FormErrorOutlineIcon: ({ width, height }: { width?: number; height?: number }) => (
    <svg data-qa="form-error-icon" width={width} height={height}></svg>
  ),
}))

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseStyleConfig = useStyleConfig as jest.MockedFunction<typeof useStyleConfig>
const mockUsePreference = usePreference as jest.MockedFunction<typeof usePreference>
const mockUseAtomValue = useAtomValue as jest.MockedFunction<typeof useAtomValue>
const mockGetSearchUrl = getSearchUrl as jest.MockedFunction<typeof getSearchUrl>

const mockStyles = {
  container: {},
  mainTitle: {},
  searchInputContainer: {},
  searchIcon: {},
  searchInput: {},
  trendingSection: {},
  trendingSectionTitle: {},
  pillsWrapper: {},
  pillsContainer: {},
  pill: {},
}

const mockTrendingSearches = [
  { name: 'Bags', link: '/search?q=Bags' },
  { name: 'Wallets', link: '/search?q=Wallets' },
  { name: 'Clothing', link: '/search?q=Clothing' },
  { name: 'Shoes', link: '/search?q=Shoes' },
  { name: 'Accessories', link: '/search?q=Accessories' },
]

describe('SearchExpose Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console.log to avoid test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {})

    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any)

    mockUseStyleConfig.mockReturnValue(mockStyles)

    mockUsePreference.mockReturnValue({
      xgenPreferences: {
        searchV2Features: {
          PdpMobileSearchModule: true,
        },
      },
    })

    mockUseAtomValue.mockReturnValue({ state: 'hasData', data: mockTrendingSearches })
    mockGetSearchUrl.mockImplementation((query: string) => `/search?q=${encodeURIComponent(query)}`)
  })

  afterEach(() => {
    jest.clearAllMocks()
    // Restore console.log
    jest.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('should render the component with all elements when PdpMobileSearchModule is true', () => {
      render(<SearchExpose />)

      // Check structural elements exist (module title h2; trending h3 — product h1 lives elsewhere on PDP)
      expect(screen.getByRole('heading', { level: 2 })).toBeVisible()
      expect(screen.getByTestId('search-icon')).toBeVisible()
      expect(screen.getByPlaceholderText('What are you looking for?')).toBeVisible()
      expect(screen.getByRole('heading', { level: 3 })).toBeVisible()

      // Check that trending search pills are rendered
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)

      // Verify each link has text content
      links.forEach((link) => {
        expect(link.textContent).toBeTruthy()
        expect(link.textContent?.trim().length).toBeGreaterThan(0)
      })
    })

    it('should return null when PdpMobileSearchModule is false', () => {
      mockUsePreference.mockReturnValue({
        xgenPreferences: {
          searchV2Features: {
            PdpMobileSearchModule: false,
          },
        },
      })

      const { container } = render(<SearchExpose />)
      expect(container.firstChild?.firstChild).toBeNull()
    })

    it('should render search icon with correct dimensions', () => {
      render(<SearchExpose />)

      const searchIcon = screen.getByTestId('search-icon')
      expect(searchIcon).toHaveAttribute('width', '16px')
      expect(searchIcon).toHaveAttribute('height', '16px')
    })

    it('should render component structure consistently with trending searches', () => {
      render(<SearchExpose />)

      // Verify main container structure
      const mainTitle = screen.getByRole('heading', { level: 2 })
      const searchInput = screen.getByPlaceholderText('What are you looking for?')
      const trendingTitle = screen.getByRole('heading', { level: 3 })
      const links = screen.getAllByRole('link')

      // Verify elements are present and structured correctly
      expect(mainTitle).toBeVisible()
      expect(searchInput).toBeVisible()
      expect(trendingTitle).toBeVisible()
      expect(links.length).toBeGreaterThan(0)

      // Verify content is configurable (not empty)
      expect(mainTitle.textContent?.trim()).toBeTruthy()
      expect(trendingTitle.textContent?.trim()).toBeTruthy()
      links.forEach((link) => {
        expect(link.textContent?.trim()).toBeTruthy()
      })
    })

    it('should not render trending section when no trending searches available from atom', () => {
      mockUseAtomValue.mockReturnValue([])
      render(<SearchExpose />)

      // Verify main elements still exist
      expect(screen.getByRole('heading', { level: 2 })).toBeVisible()
      expect(screen.getByTestId('search-icon')).toBeVisible()
      expect(screen.getByPlaceholderText('What are you looking for?')).toBeVisible()

      // Verify trending section is not rendered
      expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
      expect(screen.queryAllByRole('link')).toHaveLength(0)
    })

    it('should render custom trending searches when provided from atom', () => {
      const customTrendingSearches = [
        { name: 'Custom Search 1', link: '/search?q=Custom%20Search%201' },
        { name: 'Custom Search 2', link: '/search?q=Custom%20Search%202' },
      ]
      mockUseAtomValue.mockReturnValue({ state: 'hasData', data: customTrendingSearches })
      render(<SearchExpose />)

      // Verify trending section is rendered
      expect(screen.getByRole('heading', { level: 3 })).toBeVisible()

      // Verify custom trending searches are rendered
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(customTrendingSearches.length)

      customTrendingSearches.forEach((search) => {
        expect(screen.getByRole('link', { name: search.name })).toBeVisible()
      })
    })
  })

  describe('Search Input Functionality', () => {
    it('should update input value when user types', async () => {
      const user = userEvent.setup()
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')

      await user.type(input, 'handbags')

      expect(input).toHaveValue('handbags')
    })

    it('should submit search on Enter key press with valid input', async () => {
      const user = userEvent.setup()
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')

      await user.type(input, 'handbags')
      await user.keyboard('{Enter}')

      expect(mockGetSearchUrl).toHaveBeenCalledWith('handbags')
      expect(mockPush).toHaveBeenCalledWith('/search?q=handbags')
      expect(input).toHaveValue('')
    })

    it('should not submit search on Enter key press with empty input', async () => {
      const user = userEvent.setup()
      render(<SearchExpose />)

      // Clear mocks after render since Links call getSearchUrl during render
      jest.clearAllMocks()

      screen.getByPlaceholderText('What are you looking for?')

      await user.keyboard('{Enter}')

      expect(mockGetSearchUrl).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should not submit search on Enter key press with only whitespace', async () => {
      const user = userEvent.setup()
      // Use component without trending searches to avoid getSearchUrl calls from Links
      mockUseAtomValue.mockReturnValue([])
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')

      await user.type(input, '   ')
      await user.keyboard('{Enter}')

      expect(mockGetSearchUrl).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should not submit search on other key presses', async () => {
      const user = userEvent.setup()
      // Use component without trending searches to avoid getSearchUrl calls from Links
      mockUseAtomValue.mockReturnValue([])
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')

      await user.type(input, 'handbags')
      await user.keyboard('{Tab}')
      await user.keyboard('{Escape}')

      expect(mockGetSearchUrl).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
      expect(input).toHaveValue('handbags')
    })

    it('should reset input value after successful submission', async () => {
      const user = userEvent.setup()
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')

      await user.type(input, 'handbags')
      expect(input).toHaveValue('handbags')

      await user.keyboard('{Enter}')

      expect(input).toHaveValue('')
    })
  })

  describe('Trending Search Pills', () => {
    it('should render trending search pills with content when provided', () => {
      render(<SearchExpose />)

      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)

      // Verify each link has meaningful text content and href
      links.forEach((link) => {
        expect(link).toBeVisible()
        expect(link.textContent).toBeTruthy()
        expect(link.textContent?.trim().length).toBeGreaterThan(0)
        expect(link).toHaveAttribute('href')
      })
    })

    it('should have correct href for trending pills', () => {
      render(<SearchExpose />)

      const links = screen.getAllByRole('link')
      const firstLink = links[0]
      const expectedLink = mockTrendingSearches[0].link

      expect(firstLink).toHaveAttribute('href', expectedLink)
      expect(firstLink.textContent).toBe(mockTrendingSearches[0].name)
    })

    it('should generate correct href for all trending search pills', () => {
      render(<SearchExpose />)

      const links = screen.getAllByRole('link')

      links.forEach((link, index) => {
        const expectedSearch = mockTrendingSearches[index]
        expect(link).toHaveAttribute('href', expectedSearch.link)
        expect(link.textContent).toBe(expectedSearch.name)
      })

      expect(links).toHaveLength(Math.min(mockTrendingSearches.length, 5))
    })

    it('should not render any pills when trending searches array is empty', () => {
      mockUseAtomValue.mockReturnValue([])
      render(<SearchExpose />)

      const links = screen.queryAllByRole('link')
      expect(links).toHaveLength(0)
    })

    it('should work with custom trending searches', () => {
      const customSearches = [
        { name: 'Test Search 1', link: '/search?q=Test%20Search%201' },
        { name: 'Test Search 2', link: '/search?q=Test%20Search%202' },
        { name: 'Test Search 3', link: '/search?q=Test%20Search%203' },
      ]
      mockUseAtomValue.mockReturnValue({ state: 'hasData', data: customSearches })
      render(<SearchExpose />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(customSearches.length)

      // Test href for custom search
      const firstLink = links[0]
      expect(firstLink).toHaveAttribute('href', '/search?q=Test%20Search%201')
      expect(firstLink.textContent).toBe('Test Search 1')
    })
  })

  describe('Hook Integration', () => {
    it('should call useStyleConfig with correct theme name', () => {
      render(<SearchExpose />)

      expect(mockUseStyleConfig).toHaveBeenCalledWith('SearchExposeTheme')
    })

    it('should call usePreference with correct preferences', () => {
      render(<SearchExpose />)

      expect(mockUsePreference).toHaveBeenCalledWith({
        xgenPreferences: ['searchV2Features'],
      })
    })

    it('should use router.push for navigation', async () => {
      const user = userEvent.setup()
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')

      await user.type(input, 'test search')
      await user.keyboard('{Enter}')

      expect(mockPush).toHaveBeenCalledTimes(1)
    })
  })

  describe('URL Generation', () => {
    it('should generate correct search URLs for different queries', async () => {
      const user = userEvent.setup()
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')

      // Test with regular query
      await user.clear(input)
      await user.type(input, 'leather bags')
      await user.keyboard('{Enter}')

      expect(mockGetSearchUrl).toHaveBeenCalledWith('leather bags')

      // Test with special characters
      await user.clear(input)
      await user.type(input, 'bags & wallets')
      await user.keyboard('{Enter}')

      expect(mockGetSearchUrl).toHaveBeenCalledWith('bags & wallets')
    })

    it('should handle empty and whitespace-only queries correctly', async () => {
      const user = userEvent.setup()
      // Use component without trending searches to avoid getSearchUrl calls from Links
      mockUseAtomValue.mockReturnValue({ state: 'hasData', data: [] })
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')

      // Test empty string
      await user.clear(input)
      await user.keyboard('{Enter}')

      expect(mockGetSearchUrl).not.toHaveBeenCalled()

      // Test whitespace only
      await user.clear(input)
      await user.type(input, '   ')
      await user.keyboard('{Tab}')
      await user.keyboard('{Enter}')

      expect(mockGetSearchUrl).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy when trending searches exist', () => {
      render(<SearchExpose />)

      const moduleTitle = screen.getByRole('heading', { level: 2 })
      const trendingTitle = screen.getByRole('heading', { level: 3 })

      // Verify headings exist and have content
      expect(moduleTitle).toBeVisible()
      expect(trendingTitle).toBeVisible()
      expect(moduleTitle.textContent).toBeTruthy()
      expect(trendingTitle.textContent).toBeTruthy()
      expect(moduleTitle.textContent?.trim().length).toBeGreaterThan(0)
      expect(trendingTitle.textContent?.trim().length).toBeGreaterThan(0)
    })

    it('should have proper heading hierarchy when no trending searches', () => {
      mockUseAtomValue.mockReturnValue({ state: 'hasData', data: [] })
      render(<SearchExpose />)

      const moduleTitle = screen.getByRole('heading', { level: 2 })
      const trendingTitle = screen.queryByRole('heading', { level: 3 })

      // Verify module heading exists but trending heading does not
      expect(moduleTitle).toBeVisible()
      expect(moduleTitle.textContent).toBeTruthy()
      expect(trendingTitle).not.toBeInTheDocument()
    })

    it('should have accessible input with placeholder and enterKeyHint', () => {
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')
      expect(input).toBeVisible()
      expect(input).toHaveAttribute('placeholder', 'What are you looking for?')
      expect(input).toHaveAttribute('enterKeyHint', 'search')
    })

    it('should have clickable links for trending searches when they exist', () => {
      render(<SearchExpose />)

      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)

      links.forEach((link) => {
        expect(link).toBeVisible()
        expect(link.textContent).toBeTruthy()
        expect(link).toHaveAttribute('href')
      })
    })

    it('should have no links when no trending searches provided', () => {
      mockUseAtomValue.mockReturnValue({ state: 'hasData', data: [] })
      render(<SearchExpose />)

      const links = screen.queryAllByRole('link')
      expect(links).toHaveLength(0)
    })
  })

  describe('Atom Integration', () => {
    it('should use trendingSearchesAtom to get trending searches', () => {
      render(<SearchExpose />)

      expect(mockUseAtomValue).toHaveBeenCalledWith('mockTrendingSearchesAtom')
    })

    it('should limit trending searches to 5 items', () => {
      const manyTrendingSearches = [
        { name: 'Search 1', link: '/search?q=Search%201' },
        { name: 'Search 2', link: '/search?q=Search%202' },
        { name: 'Search 3', link: '/search?q=Search%203' },
        { name: 'Search 4', link: '/search?q=Search%204' },
        { name: 'Search 5', link: '/search?q=Search%205' },
        { name: 'Search 6', link: '/search?q=Search%206' },
        { name: 'Search 7', link: '/search?q=Search%207' },
      ]
      mockUseAtomValue.mockReturnValue({ state: 'hasData', data: manyTrendingSearches })
      render(<SearchExpose />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(5) // Should be limited to 5
    })

    it('should handle empty atom state gracefully', () => {
      mockUseAtomValue.mockReturnValue([])
      render(<SearchExpose />)

      // Should still render main elements
      expect(screen.getByRole('heading', { level: 2 })).toBeVisible()
      expect(screen.getByPlaceholderText('What are you looking for?')).toBeVisible()

      // But no trending searches section
      expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
      expect(screen.queryAllByRole('link')).toHaveLength(0)
    })

    it('should handle malformed search objects gracefully', () => {
      const malformedSearches = [
        { name: 'Valid Search', link: '/search?q=Valid%20Search' },
        { name: '', link: '/search?q=' }, // Empty name
        { link: '/search?q=No%20Name' }, // Missing name
        { name: 'No Link' }, // Missing link
      ]
      mockUseAtomValue.mockReturnValue({ state: 'hasData', data: malformedSearches })
      render(<SearchExpose />)

      // Should only render valid searches
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)

      // Verify the valid search is rendered
      expect(screen.getByRole('link', { name: 'Valid Search' })).toBeVisible()
    })
  })

  describe('Component State', () => {
    it('should maintain input state correctly', async () => {
      const user = userEvent.setup()
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')

      // Type in input
      await user.type(input, 'test query')
      expect(input).toHaveValue('test query')

      // Submit and verify reset
      await user.keyboard('{Enter}')
      expect(input).toHaveValue('')
    })

    it('should not call navigation functions with invalid input', async () => {
      const user = userEvent.setup()
      // Use component without trending searches to avoid getSearchUrl calls from Links
      mockUseAtomValue.mockReturnValue([])
      render(<SearchExpose />)

      const input = screen.getByPlaceholderText('What are you looking for?')

      // Test with empty input
      await user.keyboard('{Enter}')
      expect(mockGetSearchUrl).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()

      // Test with whitespace only
      await user.type(input, '   ')
      await user.keyboard('{Enter}')
      expect(mockGetSearchUrl).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})
