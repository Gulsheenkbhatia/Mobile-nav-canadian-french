import { useState, useEffect } from 'react'
import throttle from 'lodash/throttle'

const RESIZE_THROTTLE_MS = 250

const CLASS_TICKER_WRAP = 'ticker-wrap'
const CLASS_TICKER_GROUP = 'ticker'
const CLASS_TICKER_ITEM_CLONE = 'ticker-item-clone'
const MAX_TICKER_CLONE_COUNT = 100

function createTickerClone(originalItem: HTMLElement): HTMLElement {
  const clone = originalItem.cloneNode(true) as HTMLElement
  clone.classList.add(CLASS_TICKER_ITEM_CLONE)
  clone.setAttribute('aria-hidden', 'true')

  return clone
}

/**
 * Fills `.ticker` (the group) with enough clones of its first child
 * so the group is wider than 2× the viewport.
 * No JS-driven frame loop needed.
 */
function setupMarquee(wrap: HTMLElement): (() => void) | undefined {
  const group = wrap.querySelector<HTMLElement>(`:scope > .${CLASS_TICKER_GROUP}`)
  if (!group) return

  // Remove item-level clones added by a previous setup call.
  group.querySelectorAll<HTMLElement>(`.${CLASS_TICKER_ITEM_CLONE}`).forEach((el) => el.remove())

  // The original single item is the first direct child of the group
  // (the CMS-rendered headline element).
  const originalItem = group.querySelector<HTMLElement>(':scope > *')
  if (!originalItem) return

  // Fill the group until it is wider than 2× the viewport. Estimate from the
  // current rendered width so all clones can be inserted in one DOM operation.
  const targetWidth = window.innerWidth * 2
  const currentWidth = group.scrollWidth
  const estimatedItemWidth = group.scrollWidth
  let cloneCount =
    currentWidth < targetWidth && estimatedItemWidth > 0
      ? Math.min(
          Math.ceil((targetWidth - currentWidth) / estimatedItemWidth),
          MAX_TICKER_CLONE_COUNT
        )
      : 0

  // Ensure total item count is even (1 original + N clones).
  if ((1 + cloneCount) % 2 !== 0) {
    cloneCount += 1
  }

  if (cloneCount > 0) {
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < cloneCount; i++) {
      fragment.appendChild(createTickerClone(originalItem))
    }
    group.appendChild(fragment)
  }

  return () => {
    const group = wrap.querySelector(`.${CLASS_TICKER_GROUP}`)
    if (group) group.querySelectorAll(`.${CLASS_TICKER_ITEM_CLONE}`).forEach((el) => el.remove())
  }
}

function initMarqueeOnWrap(wrap: HTMLElement): () => void {
  let destroyMarquee: () => void = () => {}
  let rafId: number
  // Double rAF ensures CSS custom properties (--ticker-gap via --spacing-8)
  // are resolved and applied before scrollWidth is measured.
  // Single rAF is sometimes still within the same paint frame in Chrome.
  rafId = requestAnimationFrame(() => {
    rafId = requestAnimationFrame(() => {
      destroyMarquee = setupMarquee(wrap) ?? destroyMarquee
    })
  })

  // Throttle (leading + trailing) so clone count updates immediately on the
  // first resize event and again at most once per RESIZE_THROTTLE_MS while
  // the user is actively dragging the window — more responsive than debounce.
  const resizeHandler = throttle(() => {
    destroyMarquee = setupMarquee(wrap) ?? destroyMarquee
  }, RESIZE_THROTTLE_MS)
  window.addEventListener('resize', resizeHandler)

  return () => {
    cancelAnimationFrame(rafId)
    resizeHandler.cancel()
    window.removeEventListener('resize', resizeHandler)
    destroyMarquee()
  }
}

export function initMarqueeTicker(container: HTMLElement): (() => void) | void {
  const tickerWraps = Array.from(container.querySelectorAll<HTMLElement>(`.${CLASS_TICKER_WRAP}`))
  if (!tickerWraps.length) return

  const cleanups = tickerWraps.map((wrap) => initMarqueeOnWrap(wrap))

  return () => cleanups.forEach((cleanup) => cleanup())
}

/**
 * Returns a node setter; pass the rendered CMS node to kick off the marquee.
 */
export const useMarqueeTicker = (): ((node: HTMLElement) => void) => {
  const [node, setNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!node) return
    const cleanup = initMarqueeTicker(node)
    return () => {
      typeof cleanup === 'function' && cleanup()
    }
  }, [node])

  return setNode
}
