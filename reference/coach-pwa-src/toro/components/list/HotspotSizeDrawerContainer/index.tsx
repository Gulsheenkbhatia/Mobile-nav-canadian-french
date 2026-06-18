import React from 'react'
import Box from 'toro/components/Box'
import HotspotSizeDrawerContent from 'toro/components/list/HotspotSizeDrawerContainer/HotspotSizeDrawerContent'
import { NavChevronLeftBoldIcon } from 'toro/icons'
import { useUpdateAtom } from 'jotai/utils'
import { closeHotspotSizeDrawerAtom } from 'store/global.atom'

const HotspotSizeDrawerContainer = (): JSX.Element => {
  const closeSizeDrawer = useUpdateAtom(closeHotspotSizeDrawerAtom)

  return (
    <Box
      padding="var(--spacing-4)"
      data-qa="Size_drawer"
      className="size-drawer"
      position="relative"
    >
      <NavChevronLeftBoldIcon
        className="hotspot-size-back"
        height="16px"
        width="16px"
        onClick={closeSizeDrawer}
      />
      <HotspotSizeDrawerContent />
    </Box>
  )
}

export default HotspotSizeDrawerContainer
