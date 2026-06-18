import {
  isHeadroomActiveAtom,
  isMobileDrawerActiveAtom,
  isHeaderHeightAtom,
  bannerHeightAtom,
  isHeaderHiddenAtom,
} from 'store/headroom.atom'
import { useCallback, useMemo } from 'react'
import { useAtom } from 'jotai'

interface HeadroomState {
  isHeadroomActive: boolean
  isMobileDrawerActive: boolean
  isHeaderHeight: number
  bannerHeight: number
  isHeaderHidden: boolean
  toggleHeadroom: (update: boolean | undefined) => void
  toggleMobileDrawer: (update: boolean | undefined) => void
  setHeaderHeight: (height: number) => void
  setBannerHeight: (height: number) => void
  setIsHeaderHidden: (update: boolean | undefined) => void
}

type UseHeadroomAtomOptions = {
  onMobileDrawerOpen?: () => void
  onMobileDrawerClose?: () => void
}

export default function useHeadroomAtom(options: UseHeadroomAtomOptions = {}): HeadroomState {
  const { onMobileDrawerOpen, onMobileDrawerClose } = options
  const [isHeadroomActive, setIsHeadroomActive] = useAtom(isHeadroomActiveAtom)
  const [isMobileDrawerActive, setIsMobileDrawerActive] = useAtom(isMobileDrawerActiveAtom)
  const [isHeaderHeight, setHeaderHeight] = useAtom(isHeaderHeightAtom)
  const [bannerHeight, setBannerHeight] = useAtom(bannerHeightAtom)
  const [isHeaderHidden, setIsHeaderHidden] = useAtom(isHeaderHiddenAtom)

  const toggleHeadroom = useCallback(
    (update: boolean | undefined) => {
      setIsHeadroomActive((prev) => (typeof update !== 'undefined' ? update : !prev))
    },
    [setIsHeadroomActive]
  )

  const toggleMobileDrawer = useCallback(
    (update: boolean | undefined) => {
      const drawerState = typeof update !== 'undefined' ? update : !isMobileDrawerActive
      drawerState ? onMobileDrawerOpen?.() : onMobileDrawerClose?.()

      setIsMobileDrawerActive(drawerState)
    },
    [
      isMobileDrawerActive,
      setIsMobileDrawerActive,
      setIsHeadroomActive,
      onMobileDrawerOpen,
      onMobileDrawerClose,
    ]
  )

  return useMemo(
    () => ({
      isHeadroomActive,
      isMobileDrawerActive,
      isHeaderHeight,
      bannerHeight,
      toggleHeadroom,
      toggleMobileDrawer,
      isHeaderHidden,
      setIsHeaderHidden,
      setHeaderHeight,
      setBannerHeight,
    }),
    [
      isHeaderHeight,
      isHeadroomActive,
      isMobileDrawerActive,
      bannerHeight,
      toggleHeadroom,
      toggleMobileDrawer,
      isHeaderHidden,
      setIsHeaderHidden,
      setHeaderHeight,
      setBannerHeight,
    ]
  )
}
