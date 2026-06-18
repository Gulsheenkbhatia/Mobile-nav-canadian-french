import { useCallback, useEffect, useRef, useState } from 'react'
import { splideControllers } from 'toro/helpers/home'
import { Splide } from '@splidejs/splide'

interface SliderState {
  slides: number
  countNode: HTMLElement
  splideInstance: Splide | null
}

const SLIDER_SELECTOR = '.slider-container'

const getSplide = (sliderId: string): Splide | null => {
  const entry = (splideControllers as Record<string, any>)[sliderId]
  const inst = entry?.splide
  return inst && typeof inst.on === 'function' ? inst : null
}

export const useSliderPaginateValue = () => {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const sliderStatesRef = useRef<Map<string, SliderState>>(new Map())

  const updatePaginationCount = useCallback(
    (countNode: HTMLElement, slideIndex: number, totalSlides: number) => {
      countNode.textContent = `${slideIndex + 1} of ${totalSlides}`
    },
    []
  )

  useEffect(() => {
    if (!node) return

    const cleanupFunctions: Array<() => void> = []
    const sliderStates = sliderStatesRef.current
    sliderStates.clear()

    const sliderComponents = node.querySelectorAll<HTMLElement>(SLIDER_SELECTOR)
    if (!sliderComponents.length) return

    const setupMoveListener = (
      splideInstance: Splide,
      countNode: HTMLElement,
      totalSlides: number
    ) => {
      const handleMove = (newIndex: number) => {
        updatePaginationCount(countNode, newIndex, totalSlides)
      }

      splideInstance.on('moved', handleMove)
      cleanupFunctions.push(() => {
        splideInstance.off('moved')
      })
    }

    sliderComponents.forEach((slider) => {
      const sliderId = slider.id
      if (!sliderId) return

      const totalSlidesAttr = slider.getAttribute('data-total-slides')
      const totalSlides = totalSlidesAttr ? parseInt(totalSlidesAttr, 10) : 0
      const countNode = slider.querySelector<HTMLElement>(
        '.pagination-arrows .splide__pagination-count'
      )

      if (!totalSlides || totalSlides <= 0 || !countNode) return

      const splideInstance = getSplide(sliderId)
      const state: SliderState = {
        slides: totalSlides,
        countNode,
        splideInstance,
      }

      sliderStates.set(sliderId, state)
      updatePaginationCount(countNode, 0, totalSlides)

      if (splideInstance) {
        setupMoveListener(splideInstance, countNode, totalSlides)
      }
    })

    const handleSplideRegistered = (event: CustomEvent) => {
      const detail = event.detail
      if (!detail || !detail.id) return

      const id = detail.id
      const state = sliderStates.get(id)
      if (!state || state.splideInstance) return

      const splideInstance = getSplide(id)
      if (splideInstance) {
        state.splideInstance = splideInstance
        setupMoveListener(splideInstance, state.countNode, state.slides)
      }
    }

    document.addEventListener('splide:registered', handleSplideRegistered)
    cleanupFunctions.push(() => {
      document.removeEventListener('splide:registered', handleSplideRegistered)
    })

    return () => {
      cleanupFunctions.forEach((fn) => fn())
      sliderStates.clear()
    }
  }, [node, updatePaginationCount])

  return setNode
}
