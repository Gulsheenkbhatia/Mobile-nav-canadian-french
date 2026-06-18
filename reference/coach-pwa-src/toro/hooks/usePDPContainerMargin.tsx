import { useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'

const usePDPContainerMargin = () => {
  const headerHeight = useHeaderHeight()
  const { isTransparentStickyHeader } = useHeaderPositionPref()
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)

  return useMemo(
    () => (isTransparentStickyHeader || isTabbedAdaptivePDPEligible ? `${-headerHeight}px` : '0px'),
    [headerHeight, isTransparentStickyHeader, isTabbedAdaptivePDPEligible]
  )
}

export default usePDPContainerMargin
