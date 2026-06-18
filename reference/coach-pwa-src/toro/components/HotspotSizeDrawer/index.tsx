import { useAtomValue } from 'jotai/utils'
import { createPortal } from 'react-dom'
import { hotspotSizeDrawerAtom } from 'store/global.atom'
import Box from 'toro/components/Box'
import HotspotSizeDrawerContainer from 'toro/components/list/HotspotSizeDrawerContainer'

const HotspotSizeDrawer = () => {
  const drawerState = useAtomValue(hotspotSizeDrawerAtom)

  if (!drawerState.isOpen || !drawerState.sizeDrawerParentElement) {
    return null
  }

  return createPortal(
    <Box className="hotspot-size-drawer" {...drawerState.sizeDrawerStyles}>
      <HotspotSizeDrawerContainer />
    </Box>,
    drawerState.sizeDrawerParentElement
  )
}

export default HotspotSizeDrawer
