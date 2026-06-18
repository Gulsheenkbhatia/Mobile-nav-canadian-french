import { memo, ChangeEvent, useMemo } from 'react'

import Flex from 'toro/components/Flex'
import Link from 'toro/components/Link'
import Checkbox from 'toro/components/Checkbox'
import withFilterControl from 'toro/components/list/Filters/withFilterControl'
import type { OptionWithURL } from 'toro/types/productTypes/common'
import { getOptionQAAttribute } from 'toro/helpers/filters'

function FilterCheckboxes({ refinement, handleFilterChange, styles }) {
  return (
    <Flex sx={styles.checkBoxWrapper} direction="column">
      {refinement.options?.map((option: OptionWithURL) => (
        <FilterCheckbox
          option={option}
          refinement={refinement}
          onChange={handleFilterChange}
          key={`${refinement.id}-${option.refvalue}`}
        />
      ))}
    </Flex>
  )
}

function FilterCheckbox({ onChange, refinement, option }) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const targetContent = e?.target?.value

    option.selectable && onChange({ optionRefValue: option.refvalue, refinement, targetContent })
  }

  const optionQAAttribute = useMemo(
    () =>
      getOptionQAAttribute({
        selected: option.isSelected,
        enabled: option?.selectable,
        refinementName: refinement.name,
      }),
    [option.isSelected, option?.selectable, refinement.name]
  )

  return (
    <>
      <Checkbox
        mb="4px"
        value={option.refvalue}
        onChange={handleChange}
        data-qa={optionQAAttribute}
        isChecked={option.isSelected}
        isDisabled={!option.selectable}
      >
        {option.refvalue}
      </Checkbox>
      <Link
        m="-1px"
        width="1px"
        height="1px"
        tabIndex="-1"
        overflow="hidden"
        href={option.href}
        aria-hidden="true"
        position="absolute"
      >
        {option.refvalue}
      </Link>
    </>
  )
}

export default withFilterControl(memo(FilterCheckboxes))
