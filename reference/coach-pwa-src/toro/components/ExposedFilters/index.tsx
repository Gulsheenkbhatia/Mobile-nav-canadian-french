import { memo, useMemo } from 'react'
import FilterButton from 'toro/components/list/Filters/FilterButtons/FilterButton'
import withFilterControl from 'toro/components/list/Filters/withFilterControl'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import ScrollableContent from 'toro/components/ScrollableContent'
import { useAtomValue } from 'jotai/utils'
import { filtersAtom } from 'store/search-results.atom'
import type { PriceRefinement } from 'toro/components/ExposedFilters/helpers'

type FilterProps = {
  optionRefValue: any
  refinement: any
  eventLocation?: string
  targetContent?: string
}

type ExposedFiltersProps = {
  refinement: PriceRefinement
  handleFilterChange?: (props: FilterProps) => void
}

function ExposedFilters({ refinement, handleFilterChange }: ExposedFiltersProps) {
  const styles = useStyleConfig('ExposedFilters')
  const currentFilters = useAtomValue(filtersAtom)

  const refValue = useMemo(() => {
    const pmin = currentFilters.find((filter) => filter.id === 'pmin')?.values?.[0]
    const pmax = currentFilters.find((filter) => filter.id === 'pmax')?.values?.[0]

    return `${pmin}-${pmax}`
  }, [currentFilters])

  const handleChange = (filterPayload: FilterProps) => {
    handleFilterChange({ ...filterPayload, eventLocation: 'filter bar' })
  }

  return (
    <ScrollableContent
      fadeColor={'var(--color-neutral-light-1)'}
      wrapperStyles={styles.buttonsContainer}
      id="exposed-filters"
    >
      {refinement.options?.map((option) => (
        <FilterButton
          key={`${refinement.id}-${option.refvalue}`}
          option={{ ...option, isSelected: refValue === option?.refvalue }}
          styles={styles}
          refinement={refinement}
          onChange={handleChange}
        />
      ))}
    </ScrollableContent>
  )
}

export default withFilterControl(memo(ExposedFilters))
