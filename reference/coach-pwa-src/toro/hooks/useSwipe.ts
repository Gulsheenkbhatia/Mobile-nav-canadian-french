/*
  Inspired from:
    https://stackoverflow.com/questions/70612769/how-do-i-recognize-swipe-events-in-react
    https://phuoc.ng/collection/react-drag-drop/drag-an-element-along-a-circle/
    https://github.com/gajus/swing?tab=readme-ov-file
    https://codepen.io/brightsparks/pen/EygggL
*/

import { TouchEvent, useCallback, useRef } from 'react'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'

export type SwipeDirection = 'left' | 'right'

type UseSwipeProps = {
  onSwipeBegin?: () => void
  onSwiping?: (dx: number) => void
  onSwipeEnd?: (direction: SwipeDirection) => void
  onSwipeRebound?: () => void
  swipeThreshold?: number
}

type UseSwipeReturn = {
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: () => void
  swipeDirection: SwipeDirection
}

const useSwipe = ({
  onSwipeBegin,
  onSwipeEnd,
  onSwiping,
  onSwipeRebound,
  swipeThreshold = 0.5,
}: UseSwipeProps): UseSwipeReturn => {
  const touchStartRef = useRef(0)
  const touchEndRef = useRef(0)
  const didSwipeFinish = useRef(false)
  const swipeDirection = useRef<SwipeDirection>(null)

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (didSwipeFinish.current) {
        return
      }

      toggleBodyScroll(false)

      touchEndRef.current = 0 // otherwise the swipe is fired even with usual touch events
      touchStartRef.current = e.targetTouches[0]?.clientX

      onSwipeBegin?.()
    },
    [onSwipeBegin]
  )

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (didSwipeFinish.current) {
        return
      }

      touchEndRef.current = e.targetTouches[0].clientX
      const distance = touchStartRef.current - touchEndRef.current
      onSwiping?.(distance)
      swipeDirection.current = distance > 0 ? 'left' : 'right'
    },
    [onSwiping]
  )

  const onTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current || didSwipeFinish.current) {
      return
    }

    toggleBodyScroll(true)

    const swipeDistance = touchStartRef.current - touchEndRef.current
    const didSwipeLeft = swipeDistance >= window.innerWidth * swipeThreshold
    const didSwipeRight = swipeDistance <= -(window.innerWidth * swipeThreshold)

    didSwipeFinish.current = didSwipeLeft || didSwipeRight

    if (didSwipeLeft) {
      onSwipeEnd?.('left')
      return
    }

    if (didSwipeRight) {
      onSwipeEnd?.('right')
      return
    }

    if (!didSwipeFinish.current) {
      onSwipeRebound?.()
    }
  }, [onSwipeEnd, onSwipeRebound])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    swipeDirection: swipeDirection.current,
  }
}

export default useSwipe
