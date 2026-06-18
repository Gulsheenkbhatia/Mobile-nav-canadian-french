import { type RefObject, useEffect, useRef } from 'react'
import { getHeroGalleryTabPosition } from 'toro/components/product/mobile/v7/helpers/heroGallery'

const MIN_SWIPE_PX = 40

type Args = {
  enabled: boolean
  tabMediaIndices: readonly number[]
  activeIndex: number
  rootRef: RefObject<HTMLDivElement | null>
  onNavigateToIndex: (mediaIndex: number) => void
}

type SwipeStart = { x: number; y: number; pointerId: number }

function getNextTabMediaIndex(
  tabMediaIndices: readonly number[],
  activeIndex: number,
  deltaX: number
): number | undefined {
  const currentTabPosition = getHeroGalleryTabPosition(tabMediaIndices, activeIndex)
  const nextTabPosition = deltaX < 0 ? currentTabPosition + 1 : currentTabPosition - 1
  return tabMediaIndices[nextTabPosition]
}

/** Discover-mode horizontal swipe between hero angle tabs (no Splide). */
export function useDiscoverHeroGallerySwipe({
  enabled,
  tabMediaIndices,
  activeIndex,
  rootRef,
  onNavigateToIndex,
}: Args) {
  const swipeStartRef = useRef<SwipeStart | null>(null)

  useEffect(() => {
    if (!enabled || tabMediaIndices.length <= 1) return
    const rootElement = rootRef.current
    if (!rootElement) return

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      swipeStartRef.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId }
    }

    const onPointerUp = (e: PointerEvent) => {
      const swipeStart = swipeStartRef.current
      swipeStartRef.current = null
      if (!swipeStart || swipeStart.pointerId !== e.pointerId) return

      const deltaX = e.clientX - swipeStart.x
      const deltaY = e.clientY - swipeStart.y
      if (Math.abs(deltaX) < MIN_SWIPE_PX || Math.abs(deltaX) < Math.abs(deltaY)) return

      const nextTabMediaIndex = getNextTabMediaIndex(tabMediaIndices, activeIndex, deltaX)
      if (nextTabMediaIndex !== undefined && nextTabMediaIndex !== activeIndex) {
        onNavigateToIndex(nextTabMediaIndex)
      }
    }

    const onPointerCancel = () => {
      swipeStartRef.current = null
    }

    rootElement.addEventListener('pointerdown', onPointerDown, true)
    rootElement.addEventListener('pointerup', onPointerUp, true)
    rootElement.addEventListener('pointercancel', onPointerCancel, true)

    return () => {
      swipeStartRef.current = null
      rootElement.removeEventListener('pointerdown', onPointerDown, true)
      rootElement.removeEventListener('pointerup', onPointerUp, true)
      rootElement.removeEventListener('pointercancel', onPointerCancel, true)
    }
  }, [enabled, tabMediaIndices, activeIndex, onNavigateToIndex, rootRef])
}
