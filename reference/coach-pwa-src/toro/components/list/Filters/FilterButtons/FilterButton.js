import { useAtomValue } from 'jotai/utils'
import { memo, useMemo } from 'react'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'
import Button from 'toro/components/Button'
import { getOptionQAAttribute } from 'toro/helpers/filters'
import { CheckmarkIcon } from 'toro/icons'
import Box from 'toro/components/Box'

function FilterButton({ option, onChange, refinement, styles }) {
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  function handleClick(e) {
    e?.preventDefault()
    const targetContent = e?.target?.textContent

    option?.selectable && onChange({ optionRefValue: option?.refvalue, refinement, targetContent })
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
    <Button
      href={option.href}
      onClick={handleClick}
      sx={styles.FilterButtons}
      variant="variation-option"
      data-qa={optionQAAttribute}
      selected={option.isSelected}
      disabled={!option?.selectable}
      as={option?.selectable ? 'a' : 'button'}
      className={option.isSelected ? 'selected' : ''}
    >
      {isCompletePlpV3Desktop && (
        <Box
          p="2px"
          border="1px solid var(--color-neutral-light-3)"
          borderRadius="var(--border-radius-full)"
        >
          <CheckmarkIcon width="10" height="10" />
        </Box>
      )}
      {option?.displayName || option?.refvalue}
    </Button>
  )
}

export default memo(FilterButton)
