import { useCallback } from 'react'
import { useAtom } from 'jotai'
import useViewportType from 'toro/hooks/useViewportType'
import { isLoadMiniCartPopoverAtom } from 'store/miniCartPopover.atom'

/*
 * This hook is responsible for the MiniCartPopover's chunk Atom update from other components
 * The MiniCartPopover is a desktop container, so we need to load chunk only for the D devices
 * */
export function useLoadMiniCartPopover() {
  const { isDesktop } = useViewportType()
  const [isLoadMiniCartPopover, setLoadMiniCartPopoverAtom] = useAtom(isLoadMiniCartPopoverAtom)

  return useCallback(() => {
    if (isDesktop && !isLoadMiniCartPopover) {
      setLoadMiniCartPopoverAtom(true)
    }
  }, [isDesktop, isLoadMiniCartPopover, setLoadMiniCartPopoverAtom])
}
