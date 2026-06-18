import { useCallback, useEffect, useRef } from 'react'
import noop from 'lodash/noop'

const useTimeout = (callback = noop, delay = 0, clearPrevious = true) => {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef()

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const start = useCallback(
    (...args) => {
      if (clearPrevious) {
        clear()
      }
      timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay)
    },
    [callback, delay, clearPrevious]
  )

  const clear = useCallback(() => {
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [callback, delay])

  useEffect(() => {
    return () => clear()
  }, [])

  return { start, clear }
}

export default useTimeout
