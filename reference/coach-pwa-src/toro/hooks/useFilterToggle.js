import useAnalytics from 'toro/analytics/useAnalytics'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  setFiltersAtom,
  setSearchResultsReloadingAtom,
  toggleFiltersAtom,
} from 'store/search-results.atom'
import { FILTERS_NAME, scrollToHeader } from 'toro/helpers/filters'
import { useMemo, useCallback } from 'react'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import { useErrorHandler } from 'react-error-boundary'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'

export default function useFilterToggle() {
  const analytics = useAnalytics()
  const handleError = useErrorHandler()
  const { toggleHeadroom } = useHeadroomAtom()
  const setFilters = useUpdateAtom(setFiltersAtom)
  const setReloading = useUpdateAtom(setSearchResultsReloadingAtom)
  /** @type {(update?: any) => void} */
  const toggleFilters = useUpdateAtom(toggleFiltersAtom)
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)

  const onFilterUpdate = useCallback(
    ({
      filterName,
      optionIndex,
      refinementId,
      nextFilters,
      removeFilter,
      eventLocation,
      optionRefValue,
    }) => {
      window.preserveDataLayer = true

      analytics.send('filter', {
        action: optionIndex !== -1 || removeFilter[refinementId] ? 'remove' : 'apply',
        id: refinementId,
        eventLocation: eventLocation,
        filter: {
          name: optionRefValue,
          category: filterName || refinementId,
        },
        currentFilters: nextFilters
          .map((filter) => {
            return `${FILTERS_NAME[filter.id] || filter.id}=${filter.values.join(',')}`
          })
          .join('|'),
      })
    },
    [analytics.send]
  )

  const handleFilterChange = useCallback(
    ({ optionRefValue, refinement, eventLocation = '', targetContent = '' }) => {
      if (!beforeToggleSanityChecks({ optionRefValue, refinement, handleError, targetContent })) {
        return
      }

      const { id: refinementId, name: filterName } = refinement

      const filtersUpdateData = toggleFilters({
        refinementId,
        optionRefValue,
      })

      filtersUpdateData &&
        onFilterUpdate({
          filterName,
          refinementId,
          eventLocation,
          optionRefValue,
          ...filtersUpdateData,
        })

      setTimeout(
        () =>
          scrollToHeader(toggleHeadroom)(
            isCompletePlpV3Desktop ? '#horizontal-filters-bar-top-edge' : '#product-category-header'
          ),
        100
      )
    },
    [toggleFilters, toggleHeadroom, onFilterUpdate]
  )

  const clearFilters = useCallback(
    (props) => {
      window.preserveDataLayer = true
      analytics.send('filter', {
        action: 'reset',
        currentFilters: '',
        eventLocation: props?.eventLocation,
      })
      setReloading(true)
      setFilters([])
    },
    [analytics.send]
  )

  return useMemo(() => ({ clearFilters, handleFilterChange }), [clearFilters, handleFilterChange])
}

function beforeToggleSanityChecks({ optionRefValue, refinement, handleError, targetContent = '' }) {
  // option could be 0 (number)
  if (
    optionRefValue === undefined ||
    optionRefValue === null ||
    !refinement?.id ||
    !refinement?.name
  ) {
    handleError({
      error: `Could not handleFilterChange to ${
        targetContent || 'NO target content'
      }: invalid input params`,
      params: { optionRefValue, refinement },
    })

    return false
  }

  return true
}
