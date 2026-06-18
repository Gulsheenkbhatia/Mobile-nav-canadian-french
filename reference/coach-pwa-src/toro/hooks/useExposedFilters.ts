import { useAtomValue } from 'jotai/utils'
import { useMemo } from 'react'
import { exposedFiltersAtom } from 'store/search-results.atom'
import useExperiment from './useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useViewportType from 'toro/hooks/useViewportType'

const useExposedFilters = () => {
  const exposedFilters = useAtomValue(exposedFiltersAtom)
  const isExposedFiltersExperiment = useExperiment(EXPERIMENTS.EXPOSED_FILTERS)
  const { isMobile } = useViewportType()

  return useMemo(() => {
    return {
      isExposedFiltersEnabled: isExposedFiltersExperiment && !!exposedFilters?.length && isMobile,
      exposedFilters,
    }
  }, [isExposedFiltersExperiment, exposedFilters, isMobile])
}

export default useExposedFilters
