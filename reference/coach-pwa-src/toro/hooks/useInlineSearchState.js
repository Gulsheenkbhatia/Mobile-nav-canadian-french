import { useState, useEffect, useContext, useCallback } from 'react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  inlineSearchTermAtom,
  minQueryLengthNumAtom,
  setRecommendedInlineSearchesAtom,
  searchRecentItemsFromCookieAtom,
  recentSearchesFromCookieAtom,
} from 'store/search.atom'
import PWAContext from 'components/common/PWAContext'
import { searchDebounceDelay } from 'toro/constants/appConstants'
import get from 'lodash/get'
import useDebounce from 'toro/helpers/useDebounce'
import { fetchInitialSearchStateFromSfcc, fetchSuggestionsByTerm } from 'toro/hooks/useSearchState'

const defaultInitialState = { searches: [], initial: true }

const useInlineSearchState = () => {
  const [initialState, setInitialState] = useState(defaultInitialState)
  const inlineSearchTerm = useAtomValue(inlineSearchTermAtom)
  const setRecommendedInlineSearches = useUpdateAtom(setRecommendedInlineSearchesAtom)
  const { appData } = useContext(PWAContext)
  const localeInPath = get(appData, 'localeInPath')
  const minQueryLengthNum = useAtomValue(minQueryLengthNumAtom)
  const lastSeenFromCookie = useAtomValue(searchRecentItemsFromCookieAtom)
  const recentSearchesFromCookie = useAtomValue(recentSearchesFromCookieAtom)

  const updateSearchSuggestions = (searches) => {
    setInitialState((prev) => ({ ...prev, searches, initial: true }))
    setRecommendedInlineSearches(searches)
  }

  const debouncedInlineSearchTerm = useDebounce(inlineSearchTerm.trim(), searchDebounceDelay)

  useEffect(() => {
    let abortController
    if (debouncedInlineSearchTerm.length > minQueryLengthNum) {
      const { controller, fetchLatest } = fetchSuggestionsByTerm(
        debouncedInlineSearchTerm,
        localeInPath,
        appData?.subBrand,
        appData?.isSubBrandEnabled
      )
      abortController = controller
      fetchLatest
        .then((res) => res?.json())
        .then((suggestions) => {
          if (suggestions) {
            if (suggestions?.error) {
              console.error(suggestions?.error)
            }
            const { sfccSearchSuggestions } = suggestions
            setRecommendedInlineSearches(sfccSearchSuggestions.slice(0, 3))
          }
        })
    } else {
      setRecommendedInlineSearches(initialState.searches)
    }

    return () => {
      abortController?.abort()
    }
  }, [debouncedInlineSearchTerm, localeInPath, initialState?.searches, minQueryLengthNum])

  return useCallback(() => {
    const cookieIsNotInitialized = lastSeenFromCookie === null && recentSearchesFromCookie === null
    if (cookieIsNotInitialized) return

    if (!lastSeenFromCookie.length) {
      fetchInitialSearchStateFromSfcc(localeInPath).then(({ popularSearches }) => {
        updateSearchSuggestions(popularSearches)
      })
      return
    }
    updateSearchSuggestions(recentSearchesFromCookie)
  }, [lastSeenFromCookie, recentSearchesFromCookie, localeInPath])
}

export default useInlineSearchState
