import { useMemo } from 'react'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import useHeaderPositionPref from './useHeaderPositionPref'

const useStickyElementTopPosition = () => {
  const { stickyHeaderHeight, isStickyOrSlidingHeader } = useHeaderPositionPref()
  const { isHeaderHeight: headerHeight } = useHeadroomAtom()

  return useMemo(() => {
    let stickyTopPosition = 0
    if (isStickyOrSlidingHeader) {
      stickyTopPosition = stickyHeaderHeight
    }
    return { stickyTopPosition, headerHeight }
  }, [stickyHeaderHeight, headerHeight, isStickyOrSlidingHeader])
}

export default useStickyElementTopPosition
