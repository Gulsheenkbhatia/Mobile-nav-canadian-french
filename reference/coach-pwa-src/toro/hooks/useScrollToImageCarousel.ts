import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import useStickyHeaderHeight from 'toro/hooks/useStickyHeaderHeight'
import useScrollWithHeadroomDisabled from 'toro/hooks/useScrollWithHeadroomDisabled'
import { useCallback } from 'react'
import { useAtomValue } from 'jotai/utils'
import { bannerHeightAtom, isHeaderHeightAtom } from 'store/headroom.atom'
import useIsInitialRoute from 'toro/hooks/useIsInitialRoute'

const useScrollToImageCarousel = () => {
  const {
    isStickyHeader,
    isTransparentStickyHeader,
    isSlidingCarouselHeader,
    isStaticHeader,
    isSlidingNavHeader,
  } = useHeaderPositionPref()
  const stickyHeaderHeight = useStickyHeaderHeight()
  const isInitialRoute = useIsInitialRoute()
  const scrollTo = useScrollWithHeadroomDisabled()
  const isHeaderHeight = useAtomValue(isHeaderHeightAtom)
  const bannerHeight = useAtomValue(bannerHeightAtom)

  return useCallback(() => {
    if (isHeaderHeight) {
      scrollTo({
        top: isStickyHeader
          ? isHeaderHeight + bannerHeight - stickyHeaderHeight
          : isSlidingCarouselHeader || isStaticHeader
          ? isHeaderHeight + bannerHeight
          : isSlidingNavHeader || isTransparentStickyHeader
          ? bannerHeight
          : 0,
        left: 0,
        behavior: isInitialRoute ? 'smooth' : 'auto',
      })
    }
  }, [
    stickyHeaderHeight,
    isHeaderHeight,
    bannerHeight,
    isStickyHeader,
    isTransparentStickyHeader,
    isInitialRoute,
  ])
}

export default useScrollToImageCarousel
