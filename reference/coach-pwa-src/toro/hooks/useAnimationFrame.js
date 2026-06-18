import { useEffect, useRef } from 'react'
import noop from 'lodash/noop'

/**
 * Helper hook that calls the specified function on every animation frame when enabled.
 * @param callback {Function} The function to call on every animation frame. Defaults to noop.
 * @param duration {number=0} The duration in ms. Defaults to 0, which is infinite.
 */
const useAnimationFrame = (callback = noop, duration = 0) => {
  const requestRef = useRef()
  const previousTimeRef = useRef(null)
  const durationRef = useRef(0)

  const animate = (time) => {
    if (previousTimeRef.current !== null) {
      const deltaTime = time - previousTimeRef.current
      durationRef.current += deltaTime
      if (durationRef.current > duration && duration > 0) {
        return
      }
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  const start = () => {
    durationRef.current = 0
    previousTimeRef.current = null
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current)
  }, [duration])

  return start
}

export default useAnimationFrame
