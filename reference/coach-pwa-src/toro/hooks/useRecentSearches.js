import { useEffect, useCallback } from 'react'
import get from 'lodash/get'
import size from 'lodash/size'
import { RECENT_SEARCHES } from 'toro/constants/cookies'
import usePreference from 'toro/hooks/usePreference'
import { useUpdateAtom } from 'jotai/utils'
import { setRecentSearchesFromCookieAtom } from 'store/search.atom'

const RECENTLY_SEARCH_LIMIT = 5
const RECENT_SEARCH_MOBILE_LIMIT = 3

const addRecentSearch = (searchQuery, currentLimit, updateRecentSearchesAtom) => {
  const recentSearchData = localStorage.getItem(RECENT_SEARCHES)
  const parsedRecentSearchData = recentSearchData ? JSON.parse(recentSearchData) : {}
  const alreadyExists = Object.values(parsedRecentSearchData).some(
    (s) => searchQuery.toLowerCase() === s.toLowerCase()
  )
  if (alreadyExists) {
    return
  }

  if (size(Object.keys(parsedRecentSearchData)) >= currentLimit) {
    const keys = Object.keys(parsedRecentSearchData)
    delete parsedRecentSearchData[keys[0]]
  }

  const recentSearchUrls = {
    ...parsedRecentSearchData,
    [`${new Date()}`]: searchQuery,
  }
  localStorage.setItem(RECENT_SEARCHES, JSON.stringify(recentSearchUrls))
  updateRecentSearchesAtom(Object.values(recentSearchUrls))
}

export const useAddRecentSearch = (isDesktop) => {
  const currentLimit = isDesktop ? RECENTLY_SEARCH_LIMIT : RECENT_SEARCH_MOBILE_LIMIT
  const updateRecentSearchesAtom = useUpdateAtom(setRecentSearchesFromCookieAtom)

  return useCallback(
    (searchQuery) => {
      addRecentSearch(searchQuery, currentLimit, updateRecentSearchesAtom)
    },
    [currentLimit, updateRecentSearchesAtom]
  )
}

export default function useRecentSearches(query, isDesktop, loading, total) {
  const searchQuery = query
  const searchSuggestionsPreference = usePreference({
    groupId: 'SearchSuggestions',
    preferenceId: 'lastSeenpidsCookieMaxAge',
  })
  const lastSeenpidsCookieMaxAge = get(searchSuggestionsPreference, 'value', 0)
  const addRecentSearch = useAddRecentSearch(isDesktop)

  useEffect(() => {
    const emptyList = loading || !total
    if (searchQuery && lastSeenpidsCookieMaxAge && !emptyList) {
      addRecentSearch(searchQuery)
    }
  }, [searchQuery, lastSeenpidsCookieMaxAge, loading])
}
