export const scrollInto = (el, headroom = 0) => {
  let topOfElement = el.offsetTop - headroom
  topOfElement = topOfElement >= 0 ? topOfElement : 0
  if (topOfElement) {
    window.scroll({ top: topOfElement, behavior: 'smooth' })
  }
}

const getScrollTop = () => document.body.scrollTop || document.documentElement.scrollTop

const getElementOffset = (elementId, headroom = 0) => {
  const element = document.getElementById(elementId)
  if (element) {
    const scrollTop = getScrollTop()
    const { top, bottom } = element.getBoundingClientRect()
    let newTop = Math.floor(top + scrollTop) - headroom
    newTop = newTop > 0 ? newTop : 0
    let newBottom = Math.floor(bottom + scrollTop) - headroom
    newBottom = newBottom > 0 ? newBottom : 0
    return {
      top: newTop,
      bottom: newBottom,
    }
  }
  return null
}

export const getCurrentActiveElement = (filteredNavlinks = [], headroom = 0) => {
  const elementsRanges = filteredNavlinks.map(({ elementId }, i) => {
    const nextElement = filteredNavlinks.length > i ? filteredNavlinks[i + 1] : null
    const currentElementOffset = getElementOffset(elementId, headroom)
    if (nextElement) {
      const nextElementOffset = getElementOffset(nextElement.elementId, headroom)
      return [currentElementOffset?.top, nextElementOffset?.top - 1]
    } else {
      return [currentElementOffset?.top, document.body?.scrollHeight]
    }
  })
  const activeIndex = elementsRanges.findIndex(([top, bottom]) => {
    const scrollY = window.scrollY
    return top <= scrollY && scrollY <= bottom
  })
  return activeIndex
}

export const scrollNavLinkIntoView = (container, activeNav = 0) => {
  if (container) {
    const navs = container.querySelectorAll(':scope > [role="tab"]')
    const navElement = navs?.[activeNav]
    if (navElement) {
      const rect = navElement.getBoundingClientRect()
      const rightEdge = window?.innerWidth || document?.documentElement?.clientWidth
      const inInlineViewport = rect.left >= 0 && rect.right <= rightEdge
      if (!inInlineViewport) {
        const scrollDistance = rect.right > rightEdge ? rect.right - rightEdge : rect.left
        container.scrollTo({
          left: container.scrollLeft + scrollDistance,
          behavior: 'smooth',
        })
      }
    }
  }
}
