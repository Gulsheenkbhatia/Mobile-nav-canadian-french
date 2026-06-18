import { useEffect, useState } from 'react'

interface UseScrollToSelectedColorSwatchTypes {
  activeIndex: number
  isDisabled?: boolean
  selectedColorSwatchClassSelector?: string
  pageSpacingBorder: number
  isDesktop?: boolean
  gap?: number
}

export default function useScrollToSelectedColorSwatch({
  activeIndex,
  isDisabled = false,
  selectedColorSwatchClassSelector = 'activeColorSwatch',
  pageSpacingBorder = 0,
  isDesktop = false,
  gap,
}: UseScrollToSelectedColorSwatchTypes) {
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null)
  useEffect(() => {
    if (isDisabled || !containerRef) {
      return
    }

    const selectedColorSwatchEl = containerRef.querySelector(`.${selectedColorSwatchClassSelector}`)

    if (!selectedColorSwatchEl) {
      return
    }

    const { scrollLeft, clientWidth } = containerRef
    const { left, right, width } = selectedColorSwatchEl.getBoundingClientRect()
    const gapDistance = gap ? activeIndex * gap : 0
    const targetScrollLeft = width * activeIndex + gapDistance
    let timeoutId: number

    if (right > clientWidth || left < pageSpacingBorder) {
      let scrollPosition = targetScrollLeft
      if (!isDesktop && scrollLeft <= targetScrollLeft) {
        scrollPosition = Math.max(right - clientWidth, scrollLeft + width)
      }
      timeoutId = setTimeout(() => {
        containerRef.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        })
      }) as unknown as number
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [containerRef, activeIndex, isDisabled, selectedColorSwatchClassSelector, pageSpacingBorder])

  return { containerRef, setContainerRef }
}
