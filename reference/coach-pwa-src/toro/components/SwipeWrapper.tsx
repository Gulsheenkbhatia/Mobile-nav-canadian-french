import React, { useRef, useCallback, useEffect } from 'react'

interface SwipeWrapperProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  children: React.ReactNode
  threshold?: number // Minimum deltaX to trigger swipe
}

// Constants
const MAGNITUDE_INCREASE_THRESHOLD = 0.225
const MOVEMENT_THRESHOLD = 5
const RESET_TIMEOUT_MS = 100

/**
 * SwipeWrapper: Wraps children and enables left/right swipe detection (Magic Mouse/Trackpad)
 * Usage:
 * <SwipeWrapper onSwipeLeft={...} onSwipeRight={...}>...</SwipeWrapper>
 */
const SwipeWrapper: React.FC<SwipeWrapperProps> = ({
  onSwipeLeft,
  onSwipeRight,
  children,
  threshold = 100,
}) => {
  const wheelAccum = useRef(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasTriggered = useRef(false)
  const lastDeltaX = useRef(0)
  const gestureDirection = useRef(0) // -1 for left, 1 for right, 0 for none

  // Reset all gesture state
  const resetGestureState = useCallback(() => {
    wheelAccum.current = 0
    hasTriggered.current = false
    lastDeltaX.current = 0
    gestureDirection.current = 0
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // Only consider horizontal swipes
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        const currentDeltaX = e.deltaX
        const currentDirection = Math.sign(currentDeltaX)

        // Detect new gesture conditions:
        // 1. Direction change (positive to negative or vice versa)
        // 2. deltaX magnitude increasing after decreasing (new swipe in same direction)
        const directionChanged =
          gestureDirection.current !== 0 && currentDirection !== gestureDirection.current
        const magnitudeIncreasing =
          Math.abs(currentDeltaX) > Math.abs(lastDeltaX.current) &&
          Math.abs(lastDeltaX.current) < Math.abs(currentDeltaX) * MAGNITUDE_INCREASE_THRESHOLD

        const isNewGesture = directionChanged || (magnitudeIncreasing && hasTriggered.current)

        if (isNewGesture && hasTriggered.current) {
          // Reset for new gesture
          resetGestureState()
        }

        // Set gesture direction on first significant movement
        if (gestureDirection.current === 0 && Math.abs(currentDeltaX) > MOVEMENT_THRESHOLD) {
          gestureDirection.current = currentDirection
        }

        lastDeltaX.current = currentDeltaX

        // Skip accumulation if we already triggered in this gesture
        if (!hasTriggered.current) {
          wheelAccum.current += currentDeltaX

          // Trigger when threshold is reached
          if (wheelAccum.current > threshold && onSwipeLeft) {
            onSwipeLeft()
            hasTriggered.current = true
          } else if (wheelAccum.current < -threshold && onSwipeRight) {
            onSwipeRight()
            hasTriggered.current = true
          }
        }

        // Reset after gesture completion
        if (timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(resetGestureState, RESET_TIMEOUT_MS)
      }
    },
    [onSwipeLeft, onSwipeRight, threshold, resetGestureState]
  )

  return (
    <div onWheel={handleWheel} style={{ touchAction: 'pan-y' }}>
      {children}
    </div>
  )
}

export default SwipeWrapper
