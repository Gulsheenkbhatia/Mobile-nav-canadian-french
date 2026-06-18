import { MutableRefObject, useEffect, useRef, useState } from 'react'

type UseMarquee = () => {
  wrapperRef: MutableRefObject<HTMLDivElement>
  trackRef: MutableRefObject<HTMLDivElement>
  enableAnimation: boolean
}

interface State {
  wrapperWidth: number
  trackWidth: number
  hydrated: boolean
}

const GLASS_EFFECT_WIDTH = 60

const useMarquee: UseMarquee = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [{ wrapperWidth, trackWidth, hydrated }, setState] = useState<State>({
    wrapperWidth: 0,
    trackWidth: 0,
    hydrated: false,
  })

  useEffect(() => {
    if (!wrapperRef.current || !trackRef.current) return

    const handler = () => {
      const wrapperWidth = wrapperRef.current.clientWidth
      const trackWidth = trackRef.current.clientWidth
      setState({ wrapperWidth, trackWidth, hydrated: true })
    }

    const observer = new MutationObserver(() => {
      requestAnimationFrame(handler)
    })
    observer.observe(trackRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    })

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(handler)
    })
    resizeObserver.observe(wrapperRef.current)
    resizeObserver.observe(trackRef.current)
    requestAnimationFrame(handler)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [])

  return {
    wrapperRef,
    trackRef,
    enableAnimation: hydrated && trackWidth >= wrapperWidth - GLASS_EFFECT_WIDTH,
  }
}

export default useMarquee
