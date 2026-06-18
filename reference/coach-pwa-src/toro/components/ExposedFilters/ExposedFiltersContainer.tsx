import { useMemo } from 'react'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'
import useViewportType from 'toro/hooks/useViewportType'
import usePageType from 'toro/hooks/usePageType'
import dynamic from 'next/dynamic'
import get from 'lodash/get'
import { visibleRefinementsAtom } from 'store/search-results.atom'
import { parseCategoryFilterPriceToRefinement } from 'toro/components/ExposedFilters/helpers'
import { useAtomValue } from 'jotai/utils'
import useExposedFilters from 'toro/hooks/useExposedFilters'
import { REFINEMENT_TYPE } from 'toro/helpers/refinements'
import { isShopByBrowseAllEnabledAtom } from 'store/plp.atom'

const ExposedFilters = dynamic(() => import('toro/components/ExposedFilters'), {
  ssr: false,
})

const ExposedFiltersContainer = () => {
  const { isMobile } = useViewportType()
  const { isPLP } = usePageType()
  const visibleRefinements = useAtomValue(visibleRefinementsAtom)
  const { exposedFilters } = useExposedFilters()
  const isShopByBrowseAllEnabled = useAtomValue(isShopByBrowseAllEnabledAtom)
  const categoryFilterMinPrice = useMemo(() => {
    const minPrice = visibleRefinements.find((filter) => filter.type === REFINEMENT_TYPE.PRICE)
    if (!minPrice) {
      return 1
    }

    return get(minPrice, 'options[0]', 1) as number
  }, [visibleRefinements])

  const refinement = useMemo(() => {
    return parseCategoryFilterPriceToRefinement(exposedFilters, categoryFilterMinPrice)
  }, [exposedFilters, categoryFilterMinPrice])

  const filters = refinement?.options

  if (isShopByBrowseAllEnabled || !isMobile || !isPLP || !filters?.length) {
    return null
  }

  return (
    <Experiment forIDs={EXPERIMENTS.EXPOSED_FILTERS}>
      <ExposedFilters refinement={refinement} />
    </Experiment>
  )
}

export default ExposedFiltersContainer
