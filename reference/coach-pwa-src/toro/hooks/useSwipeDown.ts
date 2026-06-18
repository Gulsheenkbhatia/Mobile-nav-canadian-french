import { TouchEvent, useCallback, useRef } from 'react'

export type UseSwipeDownOptions = {
  onSwipeDown: () => void
  thresholdPx?: number
}

export type UseSwipeDownReturn = {
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: () => void
}

const useSwipeDown = ({
  onSwipeDown,
  thresholdPx = 40,
}: UseSwipeDownOptions): UseSwipeDownReturn => {
  const startY = useRef(0)
  const isSwiping = useRef(false)

  const onTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    startY.current = touch.clientY
    isSwiping.current = true
  }, [])

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isSwiping.current) return
      const touch = e.touches[0]
      if (!touch) return

      const delta = touch.clientY - startY.current
      if (delta > thresholdPx) {
        isSwiping.current = false
        onSwipeDown()
      }
    },
    [onSwipeDown, thresholdPx]
  )

  const onTouchEnd = useCallback(() => {
    isSwiping.current = false
  }, [])

  return { onTouchStart, onTouchMove, onTouchEnd }
}

export default useSwipeDown
