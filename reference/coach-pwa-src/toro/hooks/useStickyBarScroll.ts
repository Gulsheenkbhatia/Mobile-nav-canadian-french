import { useEffect, useState } from 'react'
import throttle from 'lodash/throttle'

export const useStickyBarScroll = (threshold: number): boolean => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > threshold)
    }, 150)

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      handleScroll.cancel()
    }
  }, [threshold])

  return isScrolled
}
