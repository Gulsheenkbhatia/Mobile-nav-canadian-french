import { useLayoutEffect, useRef } from 'react'

const getBody = () => (typeof document !== 'undefined' ? document.body : null)

export const useLockBodyScroll = (shouldLock: boolean = true) => {
  const scrollYRef = useRef(0)
  const isLockedRef = useRef(false)

  useLayoutEffect(() => {
    const body = getBody()
    if (!body || !shouldLock) return

    if (isLockedRef.current) return

    scrollYRef.current = window.scrollY

    body.style.position = 'fixed'
    body.style.top = `-${scrollYRef.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    isLockedRef.current = true

    return () => {
      if (!isLockedRef.current) return

      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      body.style.overflow = ''

      window.scrollTo(0, scrollYRef.current)

      isLockedRef.current = false
    }
  }, [shouldLock])
}
