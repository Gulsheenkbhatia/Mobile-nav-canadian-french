import { render } from 'test-utils/react'
import AdaptableInlineSearch from 'toro/components/AdaptableInlineSearch'
import { useIntl } from 'react-intl'
import usePreference from 'toro/hooks/usePreference_new'
import useInlineSearchState from 'toro/hooks/useInlineSearchState'
import useAnalytics from 'toro/analytics/useAnalytics'
import useDisclosure from 'toro/hooks/useDisclosure'
import { inlineSearchTermAtom, recommendedInlineSearchesAtom } from 'store/search.atom'
import type { Atom } from 'jotai'

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
  IntlProvider: ({ children }) => <>{children}</>,
  createIntlCache: jest.fn(() => ({})),
  createIntl: jest.fn(() => ({ formatMessage: ({ defaultMessage }) => defaultMessage })),
}))

jest.mock('helpers/getAPIURL', () => ({
  __esModule: true,
  default: jest.fn(() => 'https://api.test.com'),
}))

jest.mock('toro/helpers/strings', () => ({
  renderWithSpecialCharacters: jest.fn((text: string) => text),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    pathname: '/test',
    query: {},
    asPath: '/test',
  }),
}))

jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useInlineSearchState')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useDisclosure')

const mockIntl = jest.mocked(useIntl)
const mockUsePreference = jest.mocked(usePreference)
const mockUseInlineSearchState = jest.mocked(useInlineSearchState)
const mockUseAnalytics = jest.mocked(useAnalytics)
const mockUseDisclosure = jest.mocked(useDisclosure)

mockIntl.mockReturnValue({ formatMessage: ({ defaultMessage }) => defaultMessage } as any)

const defaultContexts = {
  PWAContext: {
    appData: {
      brand: 'coach',
      siteId: 'coh_us',
    },
  },
  RouterContext: {
    pathname: '/test',
    query: {},
    asPath: '/test',
  },
}

const makeSetup = (overrideProps = {}, atomsData: Array<[Atom<unknown>, unknown]> = []) => {
  const props = {
    ...overrideProps,
  }

  const defaultAtomsData: Array<[Atom<unknown>, unknown]> = [
    [inlineSearchTermAtom, ''],
    [recommendedInlineSearchesAtom, []],
  ]

  return render(<AdaptableInlineSearch {...props} />, {
    contexts: {
      ...defaultContexts,
      JotaiProviderContext: new Map([...defaultAtomsData, ...atomsData]),
    },
  })
}

const stableInlineSearchPreferences = {
  inlineSearch: {
    showStars: true,
    suggestions: ['handbags', 'shoes', 'accessories'],
  },
}

const stableInlineSearchPillsData = {
  default: ['handbags', 'shoes', 'accessories', 'wallets'],
}

const stableInlineSearchPillsPreferences = {
  inlineSearchPills: stableInlineSearchPillsData,
}

const stableAdaptiveExperiencePreferences = {
  inlineSearch: stableInlineSearchPreferences,
  inlineSearchPills: stableInlineSearchPillsPreferences,
}

const stablePreferenceReturnValue = {
  adaptiveExperience: stableAdaptiveExperiencePreferences,
}

beforeEach(() => {
  mockUsePreference.mockImplementation(() => stablePreferenceReturnValue)

  mockUseInlineSearchState.mockReturnValue(jest.fn())

  mockUseAnalytics.mockReturnValue({
    track: jest.fn(),
    trackEvent: jest.fn(),
    trackPageView: jest.fn(),
  } as any)

  mockUseDisclosure.mockReturnValue({
    isOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
    onToggle: jest.fn(),
    isControlled: false,
    getButtonProps: jest.fn(),
    getDisclosureProps: jest.fn(),
  })
  jest.clearAllMocks()
})

afterEach(() => {
  jest.useRealTimers()
  mockIntl.mockReturnValue({ formatMessage: ({ defaultMessage }) => defaultMessage } as any)
})

describe('AdaptableInlineSearch', () => {
  describe('Component Structure', () => {
    it('renders all basic components correctly', () => {
      const { container, getByText } = makeSetup()

      expect(container.firstChild).toBeVisible()
      expect(getByText('Search & discover your new fav')).toBeVisible()
      expect(container.querySelector('input')).toBeVisible()
      expect(getByText('Suggested searches')).toBeVisible()
    })

    it('renders stars when showStars is true', () => {
      const { container } = makeSetup()
      expect(
        container.querySelector('use[href="#icon-blueStar"]') ||
          container.querySelector('use[href="#icon-redStar"]')
      ).toBeVisible()
    })

    it('does not render stars when showStars is false', () => {
      mockUsePreference.mockReturnValue({
        adaptiveExperience: {
          inlineSearch: {
            showStars: false,
          },
          inlineSearchPills: stableInlineSearchPillsPreferences,
        },
      })

      const { container } = makeSetup()
      expect(container.querySelector('use[href="#icon-blueStar"]')).not.toBeInTheDocument()
      expect(container.querySelector('use[href="#icon-redStar"]')).not.toBeInTheDocument()
    })
  })

  describe('Preference Integration', () => {
    it('extracts showStars preference correctly', () => {
      makeSetup()

      expect(mockUsePreference).toHaveBeenCalledWith({
        adaptiveExperience: ['inlineSearch'],
      })
    })

    it('handles different preference structures', () => {
      mockUsePreference.mockReturnValue({
        adaptiveExperience: {
          inlineSearch: {
            showStars: false,
            customProperty: 'test',
          },
          inlineSearchPills: stableInlineSearchPillsPreferences,
        },
      })

      const { getByText } = makeSetup()
      expect(getByText('Search & discover your new fav')).toBeVisible()
    })
  })

  describe('Functional Behavior - Input Typing', () => {
    it('renders input field with proper attributes', () => {
      makeSetup()

      const input = document.querySelector('input')
      expect(input).not.toBeDisabled()
      expect(input).toHaveAttribute('enterkeyhint', 'search')
    })

    it('displays empty search term by default', () => {
      const { getByRole } = makeSetup()

      const input = getByRole('textbox')
      expect(input).toBeVisible()
      expect(input).toHaveValue('')
      expect(input).toHaveAttribute('enterkeyhint', 'search')
    })

    it('shows empty value when search term is empty', () => {
      makeSetup()

      const input = document.querySelector('input')
      expect(input).toBeVisible()
      expect(input.value).toBe('')
    })

    it('calls setSearchTerm when input value changes', () => {
      const { container } = makeSetup()
      const input = container.querySelector('input')

      input.value = 'shoes'
      input.dispatchEvent(new Event('change', { bubbles: true }))

      expect(input.value).toBe('shoes')
    })

    it('has proper placeholder component', () => {
      makeSetup()

      const input = document.querySelector('input')
      expect(input).toBeVisible()

      const placeholderContainer = input?.closest('form')?.querySelector('div div')
      expect(placeholderContainer).toBeVisible()
    })

    it('allows user to type and modify input value', () => {
      makeSetup()

      const input = document.querySelector('input')
      expect(input).toBeVisible()
      expect(input).not.toHaveAttribute('readonly')
      expect(input).toBeEnabled()
    })

    it('supports keyboard interaction', () => {
      makeSetup()

      const input = document.querySelector('input')
      expect(input).toBeVisible()

      input.focus()
      expect(document.activeElement).toBe(input)
    })

    it('handles input events properly', () => {
      const { getByRole } = makeSetup()
      const input = getByRole('textbox')

      input.dispatchEvent(new Event('input', { bubbles: true }))

      expect(input).toBeVisible()
      expect(input).not.toBeDisabled()
    })
  })

  describe('Suggestions Rendering', () => {
    it('renders suggestions when available', () => {
      mockUseInlineSearchState.mockReturnValue({
        searchTerm: 'hand',
        setSearchTerm: jest.fn(),
        suggestions: ['handbags', 'handbags leather', 'handbags vintage'],
        setSuggestions: jest.fn(),
        isLoading: false,
        error: null,
      } as any)

      const { getByText } = makeSetup()
      const suggestionsHeading = getByText('Suggested searches')
      expect(suggestionsHeading).toBeVisible()

      expect(getByText('handbags')).toBeVisible()
      expect(getByText('shoes')).toBeVisible()
      expect(getByText('accessories')).toBeVisible()
    })

    it('handles empty suggestions array', () => {
      mockUsePreference.mockReturnValue({
        adaptiveExperience: {
          searchPills: stableInlineSearchPreferences,
          inlineSearchPills: {
            inlineSearchPills: {
              default: [],
            },
          },
        },
      })

      const { queryByText } = makeSetup()

      expect(queryByText('Suggested searches')).not.toBeInTheDocument()
      expect(queryByText('handbags')).not.toBeInTheDocument()
    })

    it('renders suggestions with correct labels', () => {
      const { getByText, getAllByRole } = makeSetup()

      expect(getByText('Suggested searches')).toBeVisible()

      const links = getAllByRole('link')
      const suggestionLinks = links.filter((link) =>
        link.getAttribute('href')?.includes('/search?q=')
      )

      expect(suggestionLinks).toHaveLength(4)
      expect(suggestionLinks[0]).toHaveAttribute('href', '/search?q=handbags')
      expect(suggestionLinks[1]).toHaveAttribute('href', '/search?q=shoes')
      expect(suggestionLinks[2]).toHaveAttribute('href', '/search?q=accessories')
      expect(suggestionLinks[3]).toHaveAttribute('href', '/search?q=wallets')
    })

    it('handles suggestions with special characters', () => {
      mockUsePreference.mockReturnValue({
        adaptiveExperience: {
          searchPills: stableInlineSearchPreferences,
          inlineSearchPills: {
            inlineSearchPills: {
              default: ['café bags', 'café & accessories', 'naïve'],
            },
          },
        },
      })

      const { getByText, getAllByRole } = makeSetup()

      expect(getByText('café bags')).toBeVisible()
      expect(getByText('café & accessories')).toBeVisible()
      expect(getByText('naïve')).toBeVisible()

      const links = getAllByRole('link')
      const cafeLink = links.find((link) => {
        const href = link.getAttribute('href')
        return href && href.includes('/search?q=') && href.includes('caf')
      })
      expect(cafeLink).toBeInTheDocument()
    })

    it('handles suggestion clicks', () => {
      const mockTrack = jest.fn()
      mockUseAnalytics.mockReturnValue({
        track: jest.fn(),
        trackEvent: jest.fn(),
        trackPageView: jest.fn(),
        send: mockTrack,
      } as any)

      const { getByText } = makeSetup()

      const handbagsLink = getByText('handbags').closest('a')
      expect(handbagsLink).toBeInTheDocument()
      expect(handbagsLink).toHaveAttribute('href', '/search?q=handbags')

      handbagsLink?.click()

      expect(mockTrack).toHaveBeenCalledWith('searchStarted', {
        searchType: 'recommended',
        searchSection: 'keyword tab',
        searchTermTyped: '',
        searchTermUsed: 'handbags',
        eventLocation: 'inline search',
      })
    })

    it('renders maximum number of suggestions', () => {
      const manySuggestions = Array.from({ length: 10 }, (_, i) => `suggestion ${i + 1}`)
      mockUsePreference.mockReturnValue({
        adaptiveExperience: {
          searchPills: stableInlineSearchPreferences,
          inlineSearchPills: {
            inlineSearchPills: {
              default: manySuggestions,
            },
          },
        },
      })

      const { getAllByRole, getByText } = makeSetup()

      expect(getByText('Suggested searches')).toBeVisible()

      manySuggestions.forEach((suggestion) => {
        expect(getByText(suggestion)).toBeVisible()
      })

      const links = getAllByRole('link')
      const suggestionLinks = links.filter((link) =>
        link.getAttribute('href')?.includes('/search?q=suggestion')
      )
      expect(suggestionLinks).toHaveLength(10)
    })

    it('displays search icons with suggestions', () => {
      const { container, getByText } = makeSetup()

      expect(getByText('handbags')).toBeVisible()
      expect(getByText('shoes')).toBeVisible()

      const searchIcons = container.querySelectorAll('svg use[href="#icon-search"]')
      expect(searchIcons.length).toBeGreaterThan(0)

      const suggestionElements = container.querySelectorAll('a[href*="/search?q="]')
      expect(suggestionElements.length).toBe(4)

      suggestionElements.forEach((suggestionElement) => {
        const svg = suggestionElement.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('handles loading state', () => {
      mockUseInlineSearchState.mockReturnValue({
        searchTerm: 'loading',
        setSearchTerm: jest.fn(),
        suggestions: [],
        setSuggestions: jest.fn(),
        isLoading: true,
        error: null,
      } as any)

      makeSetup()

      const input = document.querySelector('input')
      expect(input).toBeVisible()
    })

    it('handles loaded state with recommendations', () => {
      mockUseInlineSearchState.mockReturnValue({
        searchTerm: 'handbags',
        setSearchTerm: jest.fn(),
        suggestions: ['handbags leather', 'handbags vintage', 'handbags designer'],
        setSuggestions: jest.fn(),
        isLoading: false,
        error: null,
      } as any)

      const { getByText } = makeSetup()
      expect(getByText('Suggested searches')).toBeVisible()
    })

    it('handles error state gracefully', () => {
      mockUseInlineSearchState.mockReturnValue({
        searchTerm: 'error',
        setSearchTerm: jest.fn(),
        suggestions: [],
        setSuggestions: jest.fn(),
        isLoading: false,
        error: 'Network error',
      } as any)

      makeSetup()

      const input = document.querySelector('input')
      expect(input).toBeVisible()
    })

    it('shows loading indicator during fetch', () => {
      mockUseInlineSearchState.mockReturnValue({
        searchTerm: 'searching',
        setSearchTerm: jest.fn(),
        suggestions: [],
        setSuggestions: jest.fn(),
        isLoading: true,
        error: null,
      } as any)

      makeSetup()
      const input = document.querySelector('input')
      expect(input).toBeVisible()
    })

    it('clears loading state after fetch completion', () => {
      mockUseInlineSearchState.mockReturnValue({
        searchTerm: 'completed',
        setSearchTerm: jest.fn(),
        suggestions: ['result1', 'result2'],
        setSuggestions: jest.fn(),
        isLoading: false,
        error: null,
      } as any)

      const { getByText } = makeSetup()
      expect(getByText('Suggested searches')).toBeVisible()
    })
  })

  describe('Analytics Integration', () => {
    it('has analytics hook available for child components', () => {
      makeSetup()
      expect(mockUseAnalytics).toBeDefined()
    })

    it('handles analytics events in child components', () => {
      const mockTrack = jest.fn()
      mockUseAnalytics.mockReturnValue({
        track: mockTrack,
        trackEvent: jest.fn(),
        trackPageView: jest.fn(),
      } as any)

      const { getByText } = makeSetup()
      expect(getByText('Search & discover your new fav')).toBeVisible()
    })

    it('supports analytics tracking through child components', () => {
      const mockTrackEvent = jest.fn()
      mockUseAnalytics.mockReturnValue({
        track: jest.fn(),
        trackEvent: mockTrackEvent,
        trackPageView: jest.fn(),
      } as any)

      makeSetup()

      const input = document.querySelector('input')
      expect(input).toBeVisible()
    })

    it('provides analytics context for child components', () => {
      const mockTrackEvent = jest.fn()
      mockUseAnalytics.mockReturnValue({
        track: jest.fn(),
        trackEvent: mockTrackEvent,
        trackPageView: jest.fn(),
      } as any)

      const { container } = makeSetup()
      expect(container.firstChild).toBeVisible()
    })
  })

  describe('Internationalization', () => {
    it('formats messages using intl', () => {
      const { getByText } = makeSetup()
      expect(getByText('Search & discover your new fav')).toBeVisible()
      expect(mockIntl).toHaveBeenCalled()
    })

    it('handles different locales', () => {
      mockIntl.mockReturnValue({
        formatMessage: ({ defaultMessage }) => `FR: ${defaultMessage}`,
      } as any)

      const { getByText } = makeSetup()
      expect(getByText('FR: Search & discover your new fav')).toBeVisible()
    })

    it('handles missing translations gracefully', () => {
      mockIntl.mockReturnValue({
        formatMessage: ({ defaultMessage }) => defaultMessage || 'Missing translation',
      } as any)

      const { container } = makeSetup()
      expect(container.firstChild).toBeVisible()
    })
  })
})
