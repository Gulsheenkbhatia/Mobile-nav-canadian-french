import { useState, useEffect } from 'react'

import { applySplideSlidersForNode } from 'toro/helpers/home'
import useViewportType from 'toro/hooks/useViewportType'

const VIEW_MORE_SELECTORS: string[] = [
  '.mol-product-4up-grid',
  '.mol-product-automation',
  '.mol-content-card-container',
  '.rmol-content-card-container',
]

const DYNAMIC_VIEW_MORE_GRIDS: string[] = [
  'mol-content-card-container',
  'rmol-content-card-container',
]
const DATA_ELEMENT_SELECTOR = '.content-container,.rcontent-container'

const DEFAULTS = {
  MOBILE_CARDS: 2,
  DESKTOP_CARDS: 4,
  COLLAPSE_AFTER_MOBILE: 2,
  COLLAPSE_AFTER_DESKTOP: 4,
} as const

type HTMLElementOrNull = HTMLElement | null
type CleanupFunction = () => void

const parseDatasetNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value)
  return !isNaN(parsed) && parsed >= 0 ? parsed : fallback
}

const scrollToTarget = (gridElement: HTMLElement, target?: HTMLElement | null): void => {
  const scrollTarget = target ?? gridElement
  scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const setupListener = (button: HTMLElement | null, handler: () => void): CleanupFunction | null => {
  if (!button) return null
  button.addEventListener('click', handler)
  return () => {
    button.removeEventListener('click', handler)
  }
}

const setupDynamicViewMore = (gridElement: HTMLElement, isMobile: boolean): CleanupFunction[] => {
  const cleanupFunctions: CleanupFunction[] = []

  const suffix = isMobile ? '-mob' : '-desk'
  const viewMoreButton = gridElement.querySelector<HTMLElement>(`.view-more${suffix}`)
  const viewLessButton = gridElement.querySelector<HTMLElement>(`.view-less${suffix}`)
  const stackContainer = gridElement.querySelector<HTMLElement>(`.view-more-stack${suffix}`)
  if (!viewMoreButton || !stackContainer) {
    return cleanupFunctions
  }

  const stackCards = Array.from(stackContainer.children) as HTMLElement[]
  const dataElement = stackContainer.closest(DATA_ELEMENT_SELECTOR) as HTMLElement

  const nextVisibleCount = isMobile
    ? parseDatasetNumber(dataElement?.dataset?.mobileCard, DEFAULTS.MOBILE_CARDS)
    : parseDatasetNumber(dataElement?.dataset?.desktopCard, DEFAULTS.DESKTOP_CARDS)

  const initialVisibleCount = isMobile
    ? parseDatasetNumber(dataElement?.dataset?.collapseAfterMob, DEFAULTS.COLLAPSE_AFTER_MOBILE)
    : parseDatasetNumber(dataElement?.dataset?.collapseAfterDesk, DEFAULTS.COLLAPSE_AFTER_DESKTOP)

  let visibleCount = initialVisibleCount

  const updateVisibility = () => {
    const showMore = visibleCount < stackCards.length
    stackCards.forEach((item, index) => {
      const shouldHide = index >= visibleCount
      if (item.classList.contains('d-none') !== shouldHide) {
        item.classList.toggle('d-none', shouldHide)
      }
    })
    viewMoreButton?.classList.toggle('d-none', !showMore)
    viewLessButton?.classList.toggle('d-none', showMore)
  }

  const handleViewMore = () => {
    visibleCount = Math.min(visibleCount + nextVisibleCount, stackCards.length)
    updateVisibility()
  }

  const handleViewLess = () => {
    visibleCount = initialVisibleCount
    updateVisibility()
    scrollToTarget(gridElement, viewMoreButton)
  }

  const cleanupMore = setupListener(viewMoreButton, handleViewMore)
  const cleanupLess = setupListener(viewLessButton, handleViewLess)

  if (cleanupMore) cleanupFunctions.push(cleanupMore)
  if (cleanupLess) cleanupFunctions.push(cleanupLess)

  updateVisibility()

  return cleanupFunctions
}

const setupRegularViewMore = (gridElement: HTMLElement): CleanupFunction[] => {
  const cleanupFunctions: CleanupFunction[] = []

  const viewMoreButton = gridElement.querySelector<HTMLElement>('.view-more')
  const viewLessButton = gridElement.querySelector<HTMLElement>('.view-less')
  const viewMoreItems = gridElement.querySelectorAll<HTMLElement>('.view-more-item')

  let visibleCount = 0

  const updateVisibility = () => {
    viewMoreItems.forEach((item, index) => {
      item.classList.toggle('d-none', index >= visibleCount)
    })
    viewMoreButton?.classList.toggle('d-none', visibleCount >= viewMoreItems.length)
    viewLessButton?.classList.toggle('d-none', visibleCount < viewMoreItems.length)
  }

  const handleViewMore = () => {
    visibleCount += 4
    updateVisibility()
    applySplideSlidersForNode(gridElement)
  }

  const handleViewLess = () => {
    visibleCount = 0
    updateVisibility()
    scrollToTarget(gridElement, viewMoreButton)
  }

  const cleanupMore = setupListener(viewMoreButton, handleViewMore)
  const cleanupLess = setupListener(viewLessButton, handleViewLess)

  if (cleanupMore) cleanupFunctions.push(cleanupMore)
  if (cleanupLess) cleanupFunctions.push(cleanupLess)

  return cleanupFunctions
}

const setupViewMore = (node: HTMLElementOrNull, isMobile: boolean): CleanupFunction[] => {
  const cleanupFunctions: CleanupFunction[] = []

  if (!node) {
    return cleanupFunctions
  }
  const grids = node.querySelectorAll(VIEW_MORE_SELECTORS.join(', ')) as NodeListOf<HTMLElement>
  if (!grids.length) {
    return cleanupFunctions
  }

  grids.forEach((gridElement) => {
    const isDynamicGrid = DYNAMIC_VIEW_MORE_GRIDS.some((selector) =>
      gridElement.classList.contains(selector)
    )

    const cleanups = isDynamicGrid
      ? setupDynamicViewMore(gridElement, isMobile)
      : setupRegularViewMore(gridElement)

    cleanupFunctions.push(...cleanups)
  })

  return cleanupFunctions
}

export const useViewMore = (): ((node: HTMLElementOrNull) => void) => {
  const [node, setNode] = useState<HTMLElementOrNull>(null)
  const { isMobile } = useViewportType()
  useEffect(() => {
    const cleanupEvents = setupViewMore(node, isMobile)
    return () => {
      cleanupEvents.forEach((cleanup) => cleanup())
    }
  }, [node, isMobile])
  return setNode
}
