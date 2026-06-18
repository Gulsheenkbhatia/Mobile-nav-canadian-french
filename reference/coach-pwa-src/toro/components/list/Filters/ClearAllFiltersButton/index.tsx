import { useAtomValue } from 'jotai/utils'
import Button from 'toro/components/Button'
import { isAnyFilterActiveAtom } from 'store/search-results.atom'

export function ClearAllFiltersButton({
  styles,
  isMobile,
  formatMessage,
  handleClearFiltersClick,
}) {
  const isAnyFilterActive = useAtomValue(isAnyFilterActiveAtom)

  return (
    <Button
      size="xs"
      ml="auto"
      variant="clearAll"
      disabled={!isAnyFilterActive}
      onClick={handleClearFiltersClick}
      data-qa={isMobile ? 'm_plpfltr_btn_clearall' : 'plpfltr_btn_clearall'}
      width="80px"
      height="30px"
      sx={styles}
    >
      {formatMessage({ id: 'plp.activeFilters.clearAll', defaultMessage: 'Clear all' })}
    </Button>
  )
}
