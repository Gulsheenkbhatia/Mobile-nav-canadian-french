import { useCallback } from 'react'
import { NAV_DRILL_MS } from '../navDrillMotion'

type UseDrillBackOptions = {
  depth: number
  exitingIndex: number | null
  setExitingIndex: (index: number | null) => void
  setDepth: (update: (current: number) => number) => void
  onComplete?: () => void
}

/** Slide the top drill panel right, then pop stack depth after the transition. */
export function useDrillBack({
  depth,
  exitingIndex,
  setExitingIndex,
  setDepth,
  onComplete,
}: UseDrillBackOptions) {
  return useCallback(() => {
    if (depth === 0 || exitingIndex !== null) return

    const exitingLayer = depth - 1
    setExitingIndex(exitingLayer)

    window.setTimeout(() => {
      setDepth((current) => Math.max(0, current - 1))
      setExitingIndex(null)
      onComplete?.()
    }, NAV_DRILL_MS)
  }, [depth, exitingIndex, onComplete, setDepth, setExitingIndex])
}
