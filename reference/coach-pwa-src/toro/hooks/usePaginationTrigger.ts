import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useMemo } from 'react'
import { isGoingBackAtom } from 'store/going-back.atom'
import {
  searchResultPageAtom,
  searchResultsReloadingAtom,
  setSearchResultPageAtom,
  setSearchResultsReloadingAtom,
  totalPagesAtom,
} from 'store/search-results.atom'

const usePaginationTrigger = () => {
  const page = useAtomValue(searchResultPageAtom)
  const reloading = useAtomValue(searchResultsReloadingAtom)
  const isGoingBack = useAtomValue(isGoingBackAtom)
  const totalPages = useAtomValue(totalPagesAtom)
  const setPage = useUpdateAtom(setSearchResultPageAtom)
  const setReloading = useUpdateAtom(setSearchResultsReloadingAtom)

  return useMemo(() => {
    const isPaginationDisabled = !Number.isSafeInteger(page) || reloading || isGoingBack

    const triggerPagination = () => {
      if (isPaginationDisabled || page >= totalPages) {
        return
      }
      setReloading(true)
      setPage(page + 1)
    }

    return { isPaginationDisabled, triggerPagination }
  }, [page, totalPages, reloading, isGoingBack])
}

export default usePaginationTrigger
