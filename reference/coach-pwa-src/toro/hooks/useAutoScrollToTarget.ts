import { useEffect, useMemo } from 'react'
import prefersReducedMotion from 'toro/helpers/prefersReducedMotion'

type UseAutoScrollToTargetParams = {
  containerRef?: React.RefObject<HTMLElement | null>
  targetSelector?: string
  activeSwatchTrigger?: unknown
}

const useAutoScrollToTarget = ({
  containerRef,
  targetSelector,
  activeSwatchTrigger,
}: UseAutoScrollToTargetParams) => {
  const shouldReduceMotion = useMemo(() => prefersReducedMotion(), [])

  useEffect(() => {
    const container = containerRef?.current
    if (!container) {
      return
    }

    const node = container.querySelector(targetSelector) as HTMLElement | null
    if (!node) {
      return
    }

    const nodeRect = node.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const currentLeft = container.scrollLeft
    const nodeLeft = nodeRect.left - containerRect.left + currentLeft
    const nodeRight = nodeLeft + nodeRect.width
    const viewLeft = currentLeft
    const viewRight = currentLeft + container.clientWidth
    const isFullyVisible = nodeLeft >= viewLeft && nodeRight <= viewRight
    if (isFullyVisible) {
      return
    }

    const targetLeft = nodeLeft < viewLeft ? nodeLeft : nodeRight - container.clientWidth
    container.scrollTo({
      left: targetLeft,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    })
  }, [containerRef, targetSelector, shouldReduceMotion, activeSwatchTrigger])
}

export default useAutoScrollToTarget
