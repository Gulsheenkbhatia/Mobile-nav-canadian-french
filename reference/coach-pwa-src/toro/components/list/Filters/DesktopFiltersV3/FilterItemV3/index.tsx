import { useAtomValue } from 'jotai/utils'
import { memo, useCallback, useRef, useState } from 'react'
import { activeFiltersCountAtom } from 'store/search-results.atom'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import { NavChevronDownIcon, NavChevronUpIcon } from 'toro/icons'
import camelCase from 'lodash/camelCase'
import dynamic from 'next/dynamic'

const FilterPopup = dynamic(
  () => import('toro/components/list/Filters/DesktopFiltersV3/FilterPopup'),
  {
    ssr: false,
  }
)

interface FilterItemV3Props {
  refinement: { options: any[]; name: string; type: string; id: string }
  styles: any
  isSelected: boolean
  onClick: (refinementId: any) => void
}

const FilterItemV3 = ({ refinement, styles, isSelected, onClick }: FilterItemV3Props) => {
  const refinementId = refinement.id
  const activeFiltersMap = useAtomValue(activeFiltersCountAtom)
  const activeFilterCount = activeFiltersMap?.[refinementId]
  const buttonRef = useRef(null)
  const [positionLeft, setPositionLeft] = useState(0)

  const handleFilterPopup = useCallback(() => {
    if (isSelected) {
      onClick('')
    } else {
      const currentElement = buttonRef.current
      const parent = currentElement.closest('.scrollableContent')
      const position = currentElement.offsetLeft - parent.scrollLeft
      if (positionLeft !== position) setPositionLeft(position)
      onClick(refinementId)
    }
  }, [isSelected])

  return (
    <Box>
      <Button
        sx={{
          ...styles.horizontalFilterButton,
          ...(isSelected ? styles.activeFilterButton : {}),
        }}
        onClick={handleFilterPopup}
        ref={buttonRef}
        data-qa="plpfltr_body_fltr_acord"
      >
        <Box
          data-qa={'plpfltr_txt_fltr_acord_title_' + camelCase(refinement.name)}
          sx={styles.filterItemText}
        >
          {refinement.name?.toLowerCase()}
        </Box>
        {isSelected ? (
          <NavChevronUpIcon {...styles.iconSize} data-qa="plpfltr_icon_fltr_acord_up_arrow" />
        ) : (
          <NavChevronDownIcon {...styles.iconSize} data-qa="plpfltr_icon_fltr_acord_down_arrow" />
        )}
        {activeFilterCount ? <Box sx={styles.activeFilterCount}>{activeFilterCount}</Box> : null}
      </Button>
      {isSelected && (
        <FilterPopup
          refinement={refinement}
          styles={styles}
          onClose={handleFilterPopup}
          positionLeft={positionLeft}
        />
      )}
    </Box>
  )
}

export default memo(FilterItemV3)
