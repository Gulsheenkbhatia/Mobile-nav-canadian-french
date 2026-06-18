import get from 'lodash/get'
import throttle from 'lodash/throttle'
import { useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react'

import usePageType from 'toro/hooks/usePageType'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import PWAContext from 'components/common/PWAContext'

const DEFAULT_HEADER_SCROLLING_UP_TO = 280
const TOP_SCROLL_POSITION = 0
const CALLBACK_THROTTLE = 150

type UseVerticalScrollDirectionReturn = {
  hasTopDirectionScroll: boolean | null
  showBanner: boolean
  scrollPosition: number
  isOnTop: boolean
}

function useVerticalScrollDirection(): UseVerticalScrollDirectionReturn {
  const { appData } = useContext(PWAContext)
  const { isDesktop } = useViewportType()

  const { isHP, isPDP, isPLP, isProductPassport } = usePageType()

  const [direction, setDirection] = useState(!isProductPassport)
  const [showBanner, setShowBanner] = useState(!isProductPassport)
  const [isOnTop, setIsOnTop] = useState(true)

  const prevScrollY = useRef(TOP_SCROLL_POSITION)

  const {
    storefrontConfigs: { headerScrollingUpTo = DEFAULT_HEADER_SCROLLING_UP_TO },
  } = usePreference({ 'Storefront Configs': ['headerScrollingUpTo'] })

  const onScroll = useCallback(
    throttle(() => {
      const { scrollY } = window
      const direction = prevScrollY.current >= scrollY
      prevScrollY.current = scrollY

      setIsOnTop(scrollY === TOP_SCROLL_POSITION)
      setDirection(direction)
      setShowBanner(direction && scrollY < headerScrollingUpTo)
    }, CALLBACK_THROTTLE),
    []
  )

  useEffect(() => {
    if (isPDP) {
      prevScrollY.current = TOP_SCROLL_POSITION
    }
  }, [isPDP])

  const hasTopDirectionScroll = useMemo((): boolean => {
    const brand = get(appData, 'brand', 'coach')

    const shouldTrackScrollDirection = isPLP || isPDP || isHP || isProductPassport

    const doesPageHaveTopDirectionScroll = shouldTrackScrollDirection
      ? isDesktop && !isProductPassport
        ? true
        : direction
      : null

    const subBrandHasTopDirectionScroll = shouldTrackScrollDirection ? direction : null

    return brand === 'coach' ? subBrandHasTopDirectionScroll : doesPageHaveTopDirectionScroll
  }, [appData?.brand, direction, isDesktop, isHP, isPDP, isPLP, isProductPassport])

  useEffect(() => {
    if (hasTopDirectionScroll === null) return

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [hasTopDirectionScroll])

  return {
    hasTopDirectionScroll,
    showBanner,
    /* The 'scrollPosition' will not update when scrolling because the 'scroll' callback handler
        'onScroll' does not trigger a state update unless 1) the scroll direction changes or 2) the
        scroll reaches the top of the page or 3) the banner visibility changes.
           Currently we cannot rely on 'scrollPosition' being updated in realtime.
         */
    scrollPosition: prevScrollY.current,
    isOnTop,
  }
}

export default useVerticalScrollDirection
