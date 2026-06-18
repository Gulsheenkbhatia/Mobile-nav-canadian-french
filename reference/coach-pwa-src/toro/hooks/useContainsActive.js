import { useRef, useState, useEffect } from 'react'
import useViewportType from 'toro/hooks/useViewportType'

const useContainsActive = (callback, ref) => {
  const { isMobile, isTouchDevice } = useViewportType()
  const defaultRef = useRef()
  const containerRef = ref || defaultRef
  const [contains, setContains] = useState(false)

  const onFocusIn = () => {
    const containsActiveElement = containerRef?.current?.contains(document?.activeElement)
    setContains(containsActiveElement)
    if (callback) callback(containsActiveElement)
  }

  useEffect(() => {
    if (isMobile !== undefined && !isMobile && isTouchDevice !== undefined && !isTouchDevice) {
      document?.addEventListener('focusin', onFocusIn)
      return () => {
        document?.removeEventListener('focusin', onFocusIn)
      }
    }
  }, [])

  return [contains, containerRef]
}

export default useContainsActive
