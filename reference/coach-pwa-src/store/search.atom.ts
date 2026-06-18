import { PrimitiveAtom, atom } from 'jotai'
import { ListingProduct, RecommendationProduct } from 'toro/types/productTypes'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
import isBoolean from 'lodash/isBoolean'
import Cookies from 'js-cookie'
import parseCookieString from 'toro/helpers/parseCookieString'
import { LAST_SEEN_PRODUCT_IDS, RECENT_SEARCHES } from 'toro/constants/cookies'
import getRawSearches from 'toro/helpers/getRawSearches'
import { RecommendedSearch } from 'toro/helpers/types/recommendedSearch'
import { EXPERIMENTS } from 'toro/constants/experiments'
import get from 'lodash/get'
import { atomWithReset, loadable, selectAtom } from 'jotai/utils'
import { minQueryLengthNum } from 'toro/constants/appConstants'
import { VendorPreferences } from 'toro/lib/vendorProductsAdapter/shared/types/preferences'
import { preferencesAtom } from 'store/preferences.atom'
import isMobileDevice from 'toro/helpers/isMobileDevice'
import { xgenClientAtom } from 'store/xgen.atom'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'

export const searchTermAtom = atom<string>('')
export const setSearchTermAtom = atom(null, (_, set, term: string) => {
  if (!isString(term)) {
    return
  }
  set(searchTermAtom, term)
})

export const isSearchInDrawerActiveAtom = atomWithReset<boolean>(false)
export const withPillSuggestionsAtom = atom<boolean>((_get) => {
  const isInitial = _get(isInitialSuggestionsAtom)
  const searchTerm = _get(searchTermAtom)
  const minQueryLengthNumFromAtom = _get(minQueryLengthNumAtom)
  return searchTerm?.length <= minQueryLengthNumFromAtom || isInitial
})
export const inlineSearchTermAtom = atom<string>('')
export const setInlineSearchTermAtom = atom(null, (_, set, term: string) => {
  if (!isString(term)) {
    return
  }
  set(inlineSearchTermAtom, term)
})

export const searchesByTermAtom = atom<string>('')
export const setSearchesByTermAtom = atom(null, (_, set, term: string) => {
  if (!isString(term)) {
    return
  }
  set(searchesByTermAtom, term)
})

export const searchTotalProductCountAtom = atom<number>(0)
export const setSearchTotalProductCountAtom = atom(null, (_, set, count: number) => {
  if (!isNumber(count)) {
    return
  }
  set(searchTotalProductCountAtom, count)
})

export const searchRecentItemsAvailableAtom = atom<boolean>(false)
searchRecentItemsAvailableAtom.onMount = (setSearchRecentItemsAvailable) => {
  const searchCookie = parseCookieString(Cookies.get(LAST_SEEN_PRODUCT_IDS))
  setSearchRecentItemsAvailable(Boolean(searchCookie.length))
}

export const searchRecentItemsFromCookieAtom = atom<string[] | null>(null) as PrimitiveAtom<
  string[] | null
>
searchRecentItemsFromCookieAtom.onMount = (setRecentItems) => {
  const searchCookie = parseCookieString(Cookies.get(LAST_SEEN_PRODUCT_IDS))
  setRecentItems(searchCookie)
}

export const setSearchRecentItemsFromCookieAtom = atom(null, (get, set, productId: string) => {
  const searchRecentItems = get(searchRecentItemsFromCookieAtom)
  if (!productId || !searchRecentItems) {
    return
  }
  if (!searchRecentItems.includes(productId)) {
    const updatedRecentSearch = [productId, ...searchRecentItems].slice(0, 4)
    set(searchRecentItemsAvailableAtom, true)
    set(searchRecentItemsFromCookieAtom, updatedRecentSearch)
  }
})

export const initialSearchStateAtom = atom<{
  products: (ListingProduct | RecommendationProduct)[]
  searches: RecommendedSearch[]
  initial: boolean
  initialized: boolean
  activeTabWhenInitialized?: string | null
}>({
  products: [],
  searches: [],
  initial: true,
  initialized: false,
  activeTabWhenInitialized: null,
})

export const initialRecommendedSearchesAtom = selectAtom(initialSearchStateAtom, (state) =>
  state.initialized ? state.searches : undefined
)

export const isInitialSuggestionsAtom = atom<boolean>(true)
export const setIsInitialSuggestionsAtom = atom(null, (_, set, isInitial: boolean) => {
  if (!isBoolean(isInitial)) {
    return
  }
  set(isInitialSuggestionsAtom, isInitial)
})

export const suggestedItemsAtom = atom<(ListingProduct | RecommendationProduct)[]>([])
export const setSuggestedItemsAtom = atom(
  null,
  (_, set, items: (ListingProduct | RecommendationProduct)[]) => {
    if (!Array.isArray(items)) {
      return
    }
    set(suggestedItemsAtom, items)
  }
)

export const recentSearchesFromCookieAtom = atom<RecommendedSearch[] | null>(null) as PrimitiveAtom<
  string | RecommendedSearch[] | null
>
recentSearchesFromCookieAtom.onMount = (setSearches) => {
  const storedSearches = localStorage.getItem(RECENT_SEARCHES)
  const recentSearchesFromCookie = getRawSearches(parseCookieString(storedSearches))
  setSearches(recentSearchesFromCookie)
}

export const setRecentSearchesFromCookieAtom = atom(
  null,
  (_, set, updatedRecentSearches: string[]) => {
    if (updatedRecentSearches.length) {
      set(recentSearchesFromCookieAtom, getRawSearches(updatedRecentSearches))
    }
  }
)
export const hasRecentSearchesFromCookieAtom = atom(
  (get) => get(recentSearchesFromCookieAtom)?.length > 0
)

export const recommendedSearchesAtom = atom<RecommendedSearch[]>([])
export const setRecommendedSearchesAtom = atom(null, (_, set, searches: RecommendedSearch[]) => {
  if (!Array.isArray(searches)) {
    return
  }
  set(recommendedSearchesAtom, searches)
})

export const trendingSearchesAtom = atom<Promise<RecommendedSearch[]>>(async (get) => {
  const xgenClient = get(xgenClientAtom)
  const { search: isXgenSearch } = get(xgenFeaturesAtom)
  try {
    if (!isXgenSearch) return []
    const trendingSearches = await xgenClient.getTrendingSearches()
    return trendingSearches
  } catch (error) {
    console.error('Error fetching trending searches:', error)
    return []
  }
})
export const trendingSearchesLoadableAtom = loadable(trendingSearchesAtom)

export const recommendedInlineSearchesAtom = atom<RecommendedSearch[]>([])
export const setRecommendedInlineSearchesAtom = atom(
  null,
  (_, set, searches: RecommendedSearch[]) => {
    if (!Array.isArray(searches)) {
      return
    }
    set(recommendedInlineSearchesAtom, searches)
  }
)

export const exposedSearchStatusAtom = atom<boolean>(false)
export const setExposedSearchStatusAtom = atom(null, (_, set, status: boolean) => {
  if (!isBoolean(status)) {
    return
  }
  set(exposedSearchStatusAtom, status)
})

export const exposeMobileSearchBarAtom = atom<boolean>(false)

export const getExposeMobileSearchBar = (experiments: string, preferences, pageProps) => {
  const splitExperiments = experiments.split('-')
  const isExposeMobileSearchBar = splitExperiments.includes(EXPERIMENTS.EXPOSED_MOBILE_SEARCHBAR)
  const deviceType = get(pageProps, 'deviceType')
  const isDesktop = deviceType === 'desktop'

  const enableExposedSearchHeader = get(
    preferences,
    'generalConfiguration.enableExposedSearchHeader',
    false
  )

  return !isDesktop && isExposeMobileSearchBar && enableExposedSearchHeader
}

export const isSearchSuggestionsChunkLoadedAtom = atom<boolean>(false)
export const setIsSearchSuggestionsChunkLoadedAtom = atom(
  null,
  (_, set, isSearchSuggestionsChunkLoaded: boolean) => {
    if (!isBoolean(isSearchSuggestionsChunkLoaded)) {
      return
    }
    set(isSearchSuggestionsChunkLoadedAtom, isSearchSuggestionsChunkLoaded)
  }
)

// SearchV2 Atoms
const THRESHOLD_OVERLAY_REDESIGN_LIST = 4

export const isEmptySearchResultsAtom = atom<boolean>((_get) => {
  const searchTerm = _get(searchTermAtom)
  const suggestedItems = _get(suggestedItemsAtom)
  const minQueryLengthNumFromAtom = _get(minQueryLengthNumAtom)
  const isActivelySearching = searchTerm && searchTerm.trim().length >= minQueryLengthNumFromAtom
  const hasNoResults = suggestedItems.length === 0

  return isActivelySearching && hasNoResults
})

export const invalidSearchTermErrorAtom = atom<boolean>(false)

export const searchSuggestionsLoadingAtom = atom<boolean>(false)
export const setSearchSuggestionsLoadingAtom = atom(null, (_, set, loading: boolean) => {
  if (!isBoolean(loading)) return
  set(searchSuggestionsLoadingAtom, loading)
})

export const showAutocompleteSuggestionsAtom = atom<boolean>((_get) => {
  const searchTerm = _get(searchTermAtom)
  const isInitial = _get(isInitialSuggestionsAtom)
  const isEmptySearchResults = _get(isEmptySearchResultsAtom)
  const isSearchInDrawerActive = _get(isSearchInDrawerActiveAtom)
  const minQueryLengthNumFromAtom = _get(minQueryLengthNumAtom)
  const notEnoughSearchTerm = searchTerm?.length <= minQueryLengthNumFromAtom
  return isSearchInDrawerActive && !(isEmptySearchResults || notEnoughSearchTerm || isInitial)
})

export const searchAutocompleteSuggestionsAtom = atom<RecommendedSearch[]>((_get) => {
  return _get(recommendedSearchesAtom)?.slice(0, THRESHOLD_OVERLAY_REDESIGN_LIST)
})

export const isEmptyAutocompleteSuggestionsAtom = atom<boolean>((_get) => {
  const shouldShowAutocompleteSuggestions = _get(showAutocompleteSuggestionsAtom)
  const searchAutocompleteSuggestions = _get(searchAutocompleteSuggestionsAtom)
  return shouldShowAutocompleteSuggestions && searchAutocompleteSuggestions.length === 0
})

export const isSearchV2EnabledAtom = atom<boolean>(false)

export const getIsSearchV2Enabled = (preferences: VendorPreferences, isMobile: boolean) => {
  const searchOverlayRedesign = get(
    preferences,
    'xgenPreferences.searchV2Features.SearchOverlayRedesign',
    false
  )
  return searchOverlayRedesign && isMobile
}

export const isSearchV2InDrawerActiveAtom = atom<boolean>((_get) => {
  const isSearchInDrawerActive = _get(isSearchInDrawerActiveAtom)
  const searchOverlayRedesign = _get(isSearchV2EnabledAtom)
  return isSearchInDrawerActive && searchOverlayRedesign
})

export const minQueryLengthNumAtom = atom<number>((_get) => {
  const isSearchV2Enabled = _get(isSearchV2EnabledAtom)
  const isMobile = isMobileDevice()
  const preferences = _get(preferencesAtom)
  const characterThreshold = get(preferences, 'xgenPreferences.searchV2Features.characterThreshold')

  if (
    isSearchV2Enabled &&
    isMobile &&
    isNumber(characterThreshold) &&
    minQueryLengthNum <= characterThreshold
  ) {
    // - 1 need to stack with existing minQueryLengthNum logic that we are starting doing search when we ABOVE the threshold
    return characterThreshold - 1
  }

  return minQueryLengthNum
})
