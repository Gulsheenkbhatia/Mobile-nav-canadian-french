import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import { useAtomValue } from 'jotai/utils'
import { isHeaderHeightAtom } from 'store/headroom.atom'

const useStickyHeaderHeight = () => {
  const isHeaderHeight = useAtomValue(isHeaderHeightAtom)
  const { isStickyHeader } = useHeaderPositionPref()

  return isStickyHeader ? isHeaderHeight : 0
}

export default useStickyHeaderHeight
