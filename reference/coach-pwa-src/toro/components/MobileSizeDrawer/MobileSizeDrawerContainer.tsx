import { useAtomValue } from 'jotai/utils'
import { sizeDrawerMobileAtom } from 'store/global.atom'
import MobileSizeDrawer from 'toro/components/MobileSizeDrawer/MobileSizeDrawer'

const MobileSizeDrawerContainer = () => {
  const isMobileSizeDrawerOpen = useAtomValue(sizeDrawerMobileAtom)

  if (!isMobileSizeDrawerOpen) return null

  return <MobileSizeDrawer />
}

export default MobileSizeDrawerContainer
