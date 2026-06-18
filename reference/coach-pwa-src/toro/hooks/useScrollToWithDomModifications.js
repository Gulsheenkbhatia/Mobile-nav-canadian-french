import { useCallback, useRef } from 'react'

const scrollInto = (el, { adjustForHeader = true, headroom = 0 }) => {
  if (el) {
    const headerOffsetHeader = adjustForHeader
      ? (document?.querySelector('.headroom-wrapper')?.offsetHeight || 0) + headroom
      : 0
    let topOfElement = el.offsetTop - headerOffsetHeader
    topOfElement = topOfElement >= 0 ? topOfElement : 0
    if (topOfElement) {
      window.scroll({ top: topOfElement, behavior: 'smooth' })
    }
  }
}

const defaultOptions = {
  adjustForHeader: true,
  headroom: 32,
  domSettleTime: 3000,
  modificationDetectionDelay: 125,
}

export const useScrollToWithDomModifications = (options = defaultOptions) => {
  const loopRef = useRef(0)
  const scrollTo = useCallback(
    (anchorElement) => {
      const { domSettleTime = 3000, modificationDetectionDelay = 125 } = options
      if (anchorElement) {
        clearInterval(loopRef.current)
        scrollInto(anchorElement, options)
        const timestamp = Date.now()
        let last = { offset: anchorElement.offsetTop, timestamp }
        const newLoop = setInterval(() => {
          const now = Date.now()
          if (now - timestamp > domSettleTime) {
            clearInterval(loopRef.current)
          } else if (last.offset !== anchorElement.offsetTop) {
            scrollInto(anchorElement, options)
            last.timestamp = now
            last.offset = anchorElement.offsetTop
          }
        }, modificationDetectionDelay)
        loopRef.current = newLoop
      }
    },
    [loopRef.current]
  )
  const clearTimer = useCallback(() => clearInterval(loopRef.current), [loopRef.current])

  return { scrollTo, clearTimer }
}
