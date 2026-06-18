import { memo, useLayoutEffect, useRef } from 'react'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import { CloseIcon } from 'toro/icons'
import { REFINEMENT_TYPE } from 'toro/helpers/refinements'
import FilterColors from 'toro/components/list/Filters/FilterColors'
import FilterPrice from 'toro/components/list/Filters/FilterPrice'
import FilterButtons from 'toro/components/list/Filters/FilterButtons'

interface FilterPopupProps {
  refinement: { options: any[]; name: string; type: string; id: string }
  styles: any
  onClose: () => void
  positionLeft: number
}

const FILTERS_COMPONENTS = {
  [REFINEMENT_TYPE.DEFAULT]: (props) => <FilterButtons {...props} />,
  [REFINEMENT_TYPE.ATTRIBUTE]: (props) => <FilterButtons {...props} />,
  [REFINEMENT_TYPE.CHECKBOX]: (props) => <FilterButtons {...props} />,
  [REFINEMENT_TYPE.COLOR]: (props) => <FilterColors {...props} />,
  [REFINEMENT_TYPE.PRICE]: (props) => <FilterPrice {...props} />,
  [REFINEMENT_TYPE.HIDDEN]: () => null,
}

const FilterPopup = ({ refinement, styles, onClose, positionLeft }: FilterPopupProps) => {
  const popupRef = useRef(null)

  useLayoutEffect(() => {
    if (!popupRef?.current) return
    const { right } = popupRef.current.getBoundingClientRect()
    if (right >= window.innerWidth) {
      const deltaShift = right - window.innerWidth
      const marginRight = 16
      popupRef.current.style.left = `${positionLeft - deltaShift - marginRight}px`
    } else {
      popupRef.current.style.left = `${positionLeft}px`
    }
  }, [positionLeft])

  useOutsideClick({
    ref: popupRef,
    handler: onClose,
  })

  const Component = FILTERS_COMPONENTS[refinement.type]

  return (
    <Box sx={{ ...styles.filterPopup }} ref={popupRef}>
      <Box sx={styles.filterPopupContent}>
        <Component refinement={refinement} styles={styles} variant="desktopFilterV3" />
      </Box>
      <Button variant="icon-only" size="content" sx={styles.closePopupButton} onClick={onClose}>
        <CloseIcon width="24" height="24" viewBox="0 0 24 24" />
      </Button>
    </Box>
  )
}

export default memo(FilterPopup)
