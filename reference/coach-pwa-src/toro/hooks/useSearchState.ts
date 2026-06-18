import { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react'
import { useAtomValue, useUpdateAtom, useAtomCallback } from 'jotai/utils'
import { useAtom } from 'jotai'
import {
  minQueryLengthNumAtom,
  searchRecentItemsAvailableAtom,
  searchTermAtom,
  setSearchesByTermAtom,
  setIsInitialSuggestionsAtom,
  setRecommendedSearchesAtom,
  trendingSearchesAtom,
  setSearchTotalProductCountAtom,
  setSuggestedItemsAtom,
  setSearchSuggestionsLoadingAtom,
  searchRecentItemsFromCookieAtom,
  recentSearchesFromCookieAtom,
  initialSearchStateAtom,
  isSearchInDrawerActiveAtom,
  hasRecentSearchesFromCookieAtom,
} from 'store/search.atom'
import PWAContext from 'components/common/PWAContext'
import Cookies from 'js-cookie'
import { BRAND } from 'toro/constants/cookies'
import { searchDebounceDelay } from 'toro/constants/appConstants'
import get from 'lodash/get'
import uniqWith from 'lodash/uniqWith'
import isString from 'lodash/isString'
import useDebounce from 'toro/helpers/useDebounce'
import getAPIURL from 'helpers/getAPIURL'
import useViewportType from 'toro/hooks/useViewportType'
import abortableFetch from 'helpers/abortableFetch'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import useEinsteinRecommendations from 'toro/components/Einstein/useEinsteinRecommendations'
import usePreference from 'toro/hooks/usePreference_new'
import withCorrId from 'helpers/traceability'
import { fetchLatest } from 'toro/helpers/fetchLatest'
import { xgenClientAtom, retrieveXgenSearchSuggestionsAtom } from 'store/xgen.atom'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { updateXgenOneSiteContextAtom } from 'store/xgen-recommendations.atom'
import { activeMobileMenuTabAtom } from 'store/menu-data.atom'
import type { ListingProduct, RecommendationProduct } from 'toro/types/productTypes'
import type { RecommendedSearch } from 'toro/helpers/types/recommendedSearch'
import type XgenClient from 'toro/lib/xgen/client'
import type { CertonaProduct } from 'store/certona-schemes.atoms'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import { usePathname } from 'next/navigation'

const fetchWithCorrId = withCorrId()
const fetch = fetchLatest(fetchWithCorrId)

type InitialSearchStateFromSfcc = {
  suggestionProductIds: string[]
  popularSearches: RecommendedSearch[]
}

type InitialSearchStateFromXgen = {
  products: (ListingProduct | RecommendationProduct)[]
  popularSearches: RecommendedSearch[]
}

type UpdateSearchSuggestionsFunction = (
  idsOrProducts: string[] | (ListingProduct | RecommendationProduct)[],
  searches: RecommendedSearch[],
  isProducts?: boolean
) => void

const historySearchState = async (
  updateSearchSuggestions: UpdateSearchSuggestionsFunction,
  isXgenSearch: boolean,
  xgenClient: XgenClient,
  lastSeenFromCookie: string[],
  recentSearchesFromCookie: RecommendedSearch[]
): Promise<void> => {
  const recentSearches = isXgenSearch
    ? await xgenClient.getSearchHistory()
    : recentSearchesFromCookie
  updateSearchSuggestions(lastSeenFromCookie, recentSearches)
}

const useSearchState = () => {
  const { isMobile } = useViewportType()
  const [slotIds, setSlotIds] = useState<string[]>([])
  const [initialState, setInitialState] = useAtom(initialSearchStateAtom)
  const searchTerm = useAtomValue(searchTermAtom)
  const recentItemsAvailable = useAtomValue(searchRecentItemsAvailableAtom)
  const setSuggestedItems = useUpdateAtom(setSuggestedItemsAtom)
  const setRecommendedSearches = useUpdateAtom(setRecommendedSearchesAtom)
  const setTotalProductCount = useUpdateAtom(setSearchTotalProductCountAtom)
  const setSearchesByTerm = useUpdateAtom(setSearchesByTermAtom)
  const setIsInitial = useUpdateAtom(setIsInitialSuggestionsAtom)
  const setSearchSuggestionsLoading = useUpdateAtom(setSearchSuggestionsLoadingAtom)
  const setUpdateXgenOneSiteContext = useUpdateAtom(updateXgenOneSiteContextAtom)
  const currentActiveTab = useAtomValue(activeMobileMenuTabAtom)
  const initialStateRef = useRef(initialState)
  // Add deduplication for concurrent initialization calls
  const initializationPromiseRef = useRef<Promise<void> | null>(null)
  initialStateRef.current = initialState
  const { appData } = useContext(PWAContext)
  const showCertonaBestSelling = get(appData, 'showCertonaBestSelling')
  const localeInPath = get(appData, 'localeInPath')
  const xgenClient = useAtomValue(xgenClientAtom)
  const retrieveSearchSuggestions = useUpdateAtom(retrieveXgenSearchSuggestionsAtom)
  const lastSeenFromCookie = useAtomValue(searchRecentItemsFromCookieAtom)
  const recentSearchesFromCookie = useAtomValue(recentSearchesFromCookieAtom)
  const { search: isXgenSearch } = useAtomValue(xgenFeaturesAtom)
  const hasRecentSearches = useAtomValue(hasRecentSearchesFromCookieAtom)
  const minQueryLengthNum = useAtomValue(minQueryLengthNumAtom)
  const pathname = usePathname()
  const vgId = useSelectedColorData('vgId')

  const currentProductId = pathname?.includes('/product') ? vgId : undefined

  const certonaScheme = useCertonaScheme('searchrv1_rr', {
    pagetype: 'searchrv',
    enabled: showCertonaBestSelling,
  })

  const certonaIds = useMemo((): string[] => {
    const products = get(certonaScheme, 'items', [])
    return products.map(({ ID }: CertonaProduct) => ID)
  }, [certonaScheme])

  const updateSearchSuggestions: UpdateSearchSuggestionsFunction = (
    idsOrProducts,
    searches,
    isProducts = false
  ) => {
    const activeTab = currentActiveTab || null

    if (isProducts) {
      // XGEN: directly set products without fetching
      setSuggestedItems(idsOrProducts as (ListingProduct | RecommendationProduct)[])
      setInitialState((prev) => ({
        ...prev,
        searches,
        initial: true,
        products: idsOrProducts as (ListingProduct | RecommendationProduct)[],
        initialized: true,
        activeTabWhenInitialized: activeTab,
      }))
    } else {
      // Legacy: set IDs for later fetching
      setSlotIds(idsOrProducts as string[])
      setInitialState((prev) => ({
        ...prev,
        searches,
        initial: true,
        initialized: true,
        activeTabWhenInitialized: activeTab,
      }))
    }
    setRecommendedSearches(searches)
  }

  const {
    einsteinRecommendation: {
      isEinsteinRecomEnabled = false,
      isEinsteinRecomEnabledSearchSuggestion = false,
      recommendorsList = {},
    },
    xgenPreferences: { searchV2Features },
  } = usePreference({
    EinsteinRecommendation: [
      'isEinsteinRecomEnabled',
      'isEinsteinRecomEnabledSearchSuggestion',
      'recommendorsList',
    ],
    xgenPreferences: ['searchV2Features'],
  })

  const isSearchInDrawerActive = useAtomValue(isSearchInDrawerActiveAtom)
  const searchOverlayRedesign = get(searchV2Features, 'SearchOverlayRedesign', false)
  const isSearchOverlayRedesign = searchOverlayRedesign && isMobile

  const isEinsteinEnabled = isEinsteinRecomEnabled && isEinsteinRecomEnabledSearchSuggestion

  const searchSuggestionRecommenders = recommendorsList?.['SEARCH_SUGGESTION']?.map(
    (recommenders: { recommender: string }) => recommenders?.recommender
  )

  const suggestionRecommender = searchSuggestionRecommenders?.[0]
  const { recommendations = {} } = useEinsteinRecommendations({
    pageType: 'searchSuggestion',
    recommender: suggestionRecommender,
    isEinsteinEnabled,
    isInView: false,
  })

  const einsteinIds = useMemo((): string[] | undefined => {
    const einsteinRecommendations = (recommendations as any)?.recs
    return einsteinRecommendations?.map(({ id }: { id: string }) => id)?.slice(0, 4)
  }, [(recommendations as any)?.recs])

  const productIdsString = useMemo((): string => {
    const ids =
      showCertonaBestSelling && !recentItemsAvailable && Boolean(certonaIds?.length)
        ? certonaIds
        : !recentItemsAvailable && isEinsteinEnabled && Boolean(einsteinIds?.length)
        ? einsteinIds
        : slotIds
    return uniqWith(
      ids,
      (firstId, secondId) => firstId.split(' ')[0] === secondId.split(' ')[0]
    ).join(',')
  }, [
    showCertonaBestSelling,
    certonaIds,
    slotIds,
    recentItemsAvailable,
    einsteinIds,
    isEinsteinEnabled,
  ])

  useEffect(() => {
    if (isString(productIdsString) && Boolean(productIdsString.length)) {
      fetchSuggestedProductsByIds(productIdsString, localeInPath).then((products) => {
        setSuggestedItems(products)
        setInitialState((prev) => ({ ...prev, products }))
      })
    }
  }, [productIdsString, localeInPath])

  const debouncedSearchTerm = useDebounce(searchTerm.trim(), searchDebounceDelay)

  const fetchSuggestionsFromSFCC = (): AbortController | undefined => {
    const { controller, fetchLatest } = fetchSuggestionsByTerm(
      debouncedSearchTerm,
      localeInPath,
      appData?.subBrand,
      appData?.isSubBrandEnabled
    )
    fetchLatest
      .then((res) => res?.json())
      .then((suggestions) => {
        if (suggestions) {
          if (suggestions?.error) {
            console.error(suggestions?.error)
            return
          }
          const { totalProducts, sfccSuggestions, sfccSearchSuggestions, searchQuery } = suggestions
          setIsInitial(false)
          setSearchesByTerm(searchQuery)
          setTotalProductCount(totalProducts)
          setSuggestedItems(sfccSuggestions)
          setRecommendedSearches(
            isMobile ? sfccSearchSuggestions.slice(0, 3) : sfccSearchSuggestions
          )
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error(error)
        }
      })
    return controller
  }

  const setSuggestedItemsFromXgen = async (): Promise<void> => {
    setSearchSuggestionsLoading(true)
    const result = await retrieveSearchSuggestions({
      searchTerm: debouncedSearchTerm,
      pageSize: isSearchOverlayRedesign && isSearchInDrawerActive ? 12 : 4,
    })

    const { products, totalNumResults, searchQuery, topSearches, isAborted } = result as any

    setIsInitial(false)
    setSuggestedItems(products as (ListingProduct | RecommendationProduct)[])
    setTotalProductCount(totalNumResults)
    setSearchesByTerm(searchQuery)
    setRecommendedSearches(topSearches as RecommendedSearch[])
    if (!isAborted) setSearchSuggestionsLoading(false)
  }

  const fetchTrendingSearchesFromXgen = useAtomCallback((get) => {
    return get(trendingSearchesAtom)
  })

  const populateWasSearched = (
    searchesFromXgen: RecommendedSearch[],
    recentSearchesFromCookie: RecommendedSearch[]
  ): RecommendedSearch[] => {
    return searchesFromXgen.map((search) => {
      const isInRecentSearches = recentSearchesFromCookie.find(
        (recentSearch) => recentSearch.name?.toLowerCase() === search.name?.toLowerCase()
      )
      if (isInRecentSearches) {
        return { ...search, wasSearched: true }
      }
      return search
    })
  }

  const fetchInitialSearchStateFromXgen = async (): Promise<InitialSearchStateFromXgen> => {
    try {
      await setUpdateXgenOneSiteContext()

      const popularSearches = hasRecentSearches
        ? populateWasSearched(
            await xgenClient.getSearchHistory(),
            recentSearchesFromCookie as RecommendedSearch[]
          )
        : await fetchTrendingSearchesFromXgen()

      const initialSearchData = await xgenClient.initialSearchState(currentProductId)

      const products = initialSearchData?.products || []
      return { products, popularSearches: popularSearches || [] }
    } catch (error) {
      console.error('Error fetching initial search state from XGEN:', error)
      return { products: [], popularSearches: [] }
    }
  }

  const initializeSearchState = async (locale?: string): Promise<void> => {
    // Prevent multiple concurrent initialization calls
    if (initializationPromiseRef.current !== null) {
      console.log('[XGEN logs]: Deduplicating concurrent initializeSearchState call')
      return await initializationPromiseRef.current
    }

    const activeTab = currentActiveTab
    const cachedState = initialStateRef.current

    const tabChanged = activeTab !== cachedState.activeTabWhenInitialized

    // If already initialized for the same tab, use cached results
    const shouldRefetch = (() => {
      if (!cachedState.initialized || tabChanged) return true

      const currentSearches = Array.isArray(recentSearchesFromCookie)
        ? recentSearchesFromCookie
        : []
      const cachedSearches = cachedState.searches ?? []

      if (currentSearches.length !== cachedSearches.length) return true

      return currentSearches.some((search, i) => search !== cachedSearches[i])
    })()

    if (!shouldRefetch) {
      setSuggestedItems(cachedState.products)
      setRecommendedSearches(cachedState.searches)
      setIsInitial(cachedState.initial)
      return
    }

    const isXgenSearchRedesign = isXgenSearch && isSearchOverlayRedesign

    // In XGEN flow, products arrive directly — safe to clear before refetch.
    // In legacy flow, products are fetched via slotIds → productIdsString → useEffect chain.
    // Clearing them here would leave them empty when the same IDs come back (useEffect won't re-trigger).
    if (tabChanged && isXgenSearchRedesign && cachedState.initialized) {
      const clearedState = { ...cachedState, products: [] }
      setSuggestedItems([])
      setInitialState(clearedState)
      initialStateRef.current = clearedState
    }

    // Create and store the initialization promise
    const initializationPromise = (async () => {
      try {
        console.log('[XGEN logs]: Starting search state initialization')
        if (isXgenSearchRedesign) {
          // Use XGEN recommendations for initial search state (Best sellers)
          const { products, popularSearches } = await fetchInitialSearchStateFromXgen()
          updateSearchSuggestions(products, popularSearches, true)
        } else {
          // Fallback to legacy API
          const { suggestionProductIds, popularSearches } = await fetchInitialSearchStateFromSfcc(
            locale
          )
          updateSearchSuggestions(suggestionProductIds, popularSearches, false)
        }
      } catch (error) {
        console.error('Error fetching initial search state:', error)
      } finally {
        // Clear the promise reference after completion
        initializationPromiseRef.current = null
        console.log('[XGEN logs]: Search state initialization completed')
      }
    })()

    // Assign the ref immediately after promise creation to prevent race conditions
    initializationPromiseRef.current = initializationPromise
    return await initializationPromise
  }

  useEffect(() => {
    let abortController: AbortController | undefined
    if (debouncedSearchTerm.length > minQueryLengthNum) {
      if (!isXgenSearch) {
        abortController = fetchSuggestionsFromSFCC()
      }
      if (isXgenSearch) {
        setSuggestedItemsFromXgen()
      }
    } else {
      fetchTrendingSearchesFromXgen()
      setTotalProductCount(0)
      setSearchesByTerm('')
      setSuggestedItems(initialState.products)
      setRecommendedSearches(initialState.searches)
      setIsInitial(initialState.initial)
    }
    return () => {
      abortController?.abort()
    }
  }, [debouncedSearchTerm, localeInPath, initialState?.searches, isXgenSearch, minQueryLengthNum])

  return useCallback(() => {
    const cookieIsNotInitialized = lastSeenFromCookie === null && recentSearchesFromCookie === null
    if (cookieIsNotInitialized) return
    lastSeenFromCookie?.length && !isSearchOverlayRedesign
      ? historySearchState(
          updateSearchSuggestions,
          isXgenSearch,
          xgenClient,
          lastSeenFromCookie,
          recentSearchesFromCookie as RecommendedSearch[]
        )
      : initializeSearchState(localeInPath)
  }, [
    lastSeenFromCookie,
    recentSearchesFromCookie,
    isSearchOverlayRedesign,
    initializeSearchState,
    localeInPath,
    isXgenSearch,
    xgenClient,
    currentActiveTab,
    currentProductId,
  ])
}

export const fetchInitialSearchStateFromSfcc = async (
  localeInPath?: string
): Promise<Partial<InitialSearchStateFromSfcc>> => {
  try {
    const localeParam = localeInPath ? `&locale=${localeInPath}` : ''
    const initUrl = getAPIURL(`/get-initial-suggestions?${localeParam}`)
    const response = await fetch(initUrl, { credentials: 'include' })

    if (response.ok) {
      const parsedData = await response.json()
      const popularSearches = get(parsedData, 'popularSearches', [])
      const suggestionProductIds = get(parsedData, 'productsData', [])
        .map(({ id }: { id: string }) => id)
        .reverse()
      return { suggestionProductIds, popularSearches }
    } else {
      return {}
    }
  } catch (e) {
    console.error(e)
    return {}
  }
}

const fetchSuggestedProductsByIds = async (
  productIdsString: string,
  localeInPath?: string
): Promise<ListingProduct[]> => {
  const localeParam = localeInPath ? `&locale=${localeInPath}` : ''
  const url = getAPIURL(`/get-suggestions-products?ids=${productIdsString}${localeParam}`)
  const data = await fetch(url).then((res) => (res ? res.json() : {}))
  return get(data, 'productsData', [])
}

export const fetchSuggestionsByTerm = (
  term: string,
  localeInPath?: string,
  subBrand = '',
  isSubBrandEnabled?: boolean
) => {
  const localeParam = localeInPath ? `&locale=${localeInPath}` : ''
  let subBrandQuery = ''
  if (isSubBrandEnabled) {
    const currentBrandCookie = Cookies.get(BRAND)
    if (currentBrandCookie === subBrand) {
      subBrandQuery = '&isCoachtopia=true'
    }
  }
  const url = getAPIURL(`/suggestions?q=${term}${localeParam}${subBrandQuery}`)
  return abortableFetch(url, { credentials: 'include' })
}

export default useSearchState
