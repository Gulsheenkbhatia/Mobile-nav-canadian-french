import { memo } from 'react'
import Flex from 'toro/components/Flex'
import FilterColorButton from 'toro/components/list/Filters/FilterColors/FilterColorButton'
import withFilterControl from 'toro/components/list/Filters/withFilterControl'

function FilterColors({ refinement, handleFilterChange, styles }) {
  return (
    <Flex
      role="group"
      aria-label={refinement.name || 'Color filter options'}
      sx={styles.filterColorButtonWrapper}
      width="100%"
      justifyItems="center"
      flexWrap="wrap"
    >
      {refinement.options?.map((option) => (
        <FilterColorButton
          option={option}
          refinement={refinement}
          onChange={handleFilterChange}
          key={`${refinement.id}-${option.refvalue}`}
          colorText={option.displayName || option.refvalue}
        />
      ))}
    </Flex>
  )
}

export default withFilterControl(memo(FilterColors))
