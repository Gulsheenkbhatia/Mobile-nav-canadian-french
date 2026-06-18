import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import FilterItemV3 from 'toro/components/list/Filters/DesktopFiltersV3/FilterItemV3'
import DesktopScrollableFilters from 'toro/components/DesktopScrollableFilters'
import { useRefinementsToRender } from 'toro/hooks/useRefinementsToRender'

function DesktopFiltersV3({ variant }: { variant?: string }) {
  const styles = useMultiStyleConfig('DesktopFiltersV3', { variant })
  const [selectedCategory, setSelectedCategory] = useState('')
  const router = useRouter()
  const refinementsToRender = useRefinementsToRender({
    routerAsPath: router.asPath,
    routerQuery: router.query,
  })
  const onFilterItemClick = useCallback((refinementId) => {
    setSelectedCategory(refinementId)
  }, [])

  return (
    <DesktopScrollableFilters data-qa="d_plpfltr_sctn_fltr_panel" isDisplayPaginationArrows>
      {refinementsToRender?.map((refinement) => (
        <FilterItemV3
          key={refinement.id}
          refinement={refinement}
          styles={styles}
          onClick={onFilterItemClick}
          isSelected={refinement.id === selectedCategory}
        />
      ))}
    </DesktopScrollableFilters>
  )
}

export default withErrorBoundaryWrapper(DesktopFiltersV3)
