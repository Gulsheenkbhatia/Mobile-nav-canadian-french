import React, { memo } from 'react'
import Box from 'toro/components/Box'
import { useAtomValue } from 'jotai/utils'
import { busyFilterIdAtom } from 'store/search-results.atom'

function FilterBusyOverlay({ refinement, children, styles }) {
  const busyFilterId = useAtomValue(busyFilterIdAtom)

  return (
    <Box position="relative">
      {busyFilterId && busyFilterId !== refinement.id && <Box sx={styles.filterBusyOverlay} />}
      {children}
    </Box>
  )
}

export default memo(FilterBusyOverlay)
