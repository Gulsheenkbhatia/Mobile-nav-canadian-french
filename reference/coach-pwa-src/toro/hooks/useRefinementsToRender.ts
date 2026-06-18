import { useAtomValue } from 'jotai/utils'
import { useMemo } from 'react'
import { filtersAtom, visibleRefinementsAtom } from 'store/search-results.atom'
import { getFilterHref } from 'toro/helpers/filterPath'
import { REFINEMENT_TYPE } from 'toro/helpers/refinements'

export function useRefinementsToRender({ routerAsPath, routerQuery, allowedRefinements = null }) {
  const filters = useAtomValue(filtersAtom)
  const visibleRefinements = useAtomValue(visibleRefinementsAtom)

  return useMemo(() => {
    const refinements = visibleRefinements.map((refinement) => {
      const options = refinement.options.map((option) => {
        if (refinement.type === REFINEMENT_TYPE.PRICE) {
          return option
        }

        const href = getFilterHref({
          filters,
          asPath: routerAsPath,
          query: routerQuery,
          optionValue: option.refvalue,
          refinementId: refinement.id,
        })

        const isSelected = filters.some(
          (filter) => filter.id === refinement.id && filter.values.includes(option.refvalue)
        )

        return { ...option, href, isSelected }
      })

      return { ...refinement, options }
    })

    if (Array.isArray(allowedRefinements)) {
      return allowedRefinements
        .map((allowedRefinement) => {
          return refinements.find((refinement) => refinement.id === allowedRefinement)
        })
        .filter(Boolean)
    }

    return refinements
  }, [visibleRefinements, filters, routerAsPath])
}
