import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  isSearchSuggestionsChunkLoadedAtom,
  recommendedSearchesAtom,
  setIsSearchSuggestionsChunkLoadedAtom,
  suggestedItemsAtom,
} from 'store/search.atom'
import type { SearchWidgetVariant } from 'toro/components/SearchWidget'

const SearchSuggestions = dynamic(() => import('toro/components/SearchWidget/SearchSuggestions'), {
  ssr: false,
})

interface Props {
  onClose: () => void
  styleVariant: SearchWidgetVariant
  styles: any
  isSearchActive: boolean
}

function SearchSuggestionsWrapper({ isSearchActive, ...props }: Props) {
  const recommendedSearches = useAtomValue(recommendedSearchesAtom)
  const products = useAtomValue(suggestedItemsAtom)
  const isSearchSuggestionsChunkLoaded = useAtomValue(isSearchSuggestionsChunkLoadedAtom)
  const setSuggestionsChunkLoading = useUpdateAtom(setIsSearchSuggestionsChunkLoadedAtom)

  useEffect(() => {
    if (isSearchSuggestionsChunkLoaded) return

    if (recommendedSearches.length || products.length || isSearchActive) {
      setSuggestionsChunkLoading(true)
    }
  }, [recommendedSearches.length, products.length, isSearchActive, isSearchSuggestionsChunkLoaded])

  return isSearchSuggestionsChunkLoaded ? <SearchSuggestions {...props} /> : null
}

export default SearchSuggestionsWrapper
