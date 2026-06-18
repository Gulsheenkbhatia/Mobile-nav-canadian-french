// Data attributes used to configure forced scroll effects
// data-forced-scroll - effect type: "horizontal" or "zoom"
// data-scroll-speed - scroll speed multiplier (0.1 to 2.0, default varies by effect)
// data-scroll-start - scale start value for zoom (0.5 to 1.5, default 1)
// data-scroll-end - scale end value for zoom (1.0 to 3.0, default 2.5)
// data-scroll-height - section height multiplier (1 to 5, default: 3 for horizontal, 2 for zoom)
// data-zoom-direction - zoom direction: "in" (default) or "out"

type ForcedScrollEffect = 'horizontal' | 'zoom'
type ZoomDirection = 'in' | 'out'

interface ForcedScrollConfig {
  effect: ForcedScrollEffect
  speed: number
  start: number
  end: number
  height: number
  zoomDirection?: ZoomDirection
}

interface ScrollState {
  element: HTMLElement
  config: ForcedScrollConfig
  wrapper: HTMLElement
  container: HTMLElement
}

const DEFAULT_CONFIG: Record<ForcedScrollEffect, Omit<ForcedScrollConfig, 'effect'>> = {
  horizontal: {
    speed: 1,
    start: 0,
    end: 1,
    height: 3,
  },
  zoom: {
    speed: 1,
    start: 1,
    end: 2.5,
    height: 2,
    zoomDirection: 'in',
  },
}

let scrollStates: ScrollState[] = []

function getZoomDefaults(direction: ZoomDirection): { start: number; end: number } {
  return direction === 'out' ? { start: 2.5, end: 1 } : { start: 1, end: 2.5 }
}

function parseConfig(element: HTMLElement): ForcedScrollConfig {
  const effect = (element.getAttribute('data-forced-scroll') || 'horizontal') as ForcedScrollEffect
  const defaults = DEFAULT_CONFIG[effect] || DEFAULT_CONFIG.horizontal

  const zoomDirection =
    effect === 'zoom'
      ? ((element.getAttribute('data-zoom-direction') || 'in') as ZoomDirection)
      : undefined

  const { start: startValue, end: endValue } =
    effect === 'zoom' && zoomDirection ? getZoomDefaults(zoomDirection) : defaults

  return {
    effect,
    speed: parseFloat(element.getAttribute('data-scroll-speed') || String(defaults.speed)),
    start: parseFloat(element.getAttribute('data-scroll-start') || String(startValue)),
    end: parseFloat(element.getAttribute('data-scroll-end') || String(endValue)),
    height: parseFloat(element.getAttribute('data-scroll-height') || String(defaults.height)),
    ...(zoomDirection && { zoomDirection }),
  }
}

function calculateScrollProgress(element: HTMLElement, scrollY: number): number | null {
  const sectionTop = element.offsetTop
  const sectionHeight = element.offsetHeight

  if (scrollY < sectionTop || scrollY > sectionTop + sectionHeight) {
    return null
  }

  return (scrollY - sectionTop) / sectionHeight
}

function applyHorizontalScroll(
  container: HTMLElement,
  wrapper: HTMLElement,
  scrollProgress: number,
  speed: number
): void {
  const containerWidth = container.scrollWidth
  const viewportWidth = wrapper.offsetWidth
  const maxScroll = containerWidth - viewportWidth + 150

  if (maxScroll > 0) {
    const translateX = -scrollProgress * maxScroll * speed
    container.style.transform = `translateX(${translateX}px)`
  }
}

function applyZoomEffect(
  container: HTMLElement,
  scrollProgress: number,
  config: ForcedScrollConfig
): void {
  const scale = config.start + scrollProgress * (config.end - config.start) * config.speed
  container.style.transform = `scale(${scale})`
}

function handleScroll(): void {
  const scrollY = window.scrollY

  scrollStates.forEach(({ element, config, wrapper, container }) => {
    const scrollProgress = calculateScrollProgress(element, scrollY)

    if (scrollProgress === null) return

    if (config.effect === 'horizontal') {
      applyHorizontalScroll(container, wrapper, scrollProgress, config.speed)
    } else if (config.effect === 'zoom') {
      applyZoomEffect(container, scrollProgress, config)
    }
  })
}

function initScrollListener(): void {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll, { passive: true })
}

function removeScrollListener(): void {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
}

function cleanup(): void {
  removeScrollListener()
  scrollStates = []
}

export function initAllForcedScrolls(container: HTMLElement = document.body): () => void {
  const elements = container.querySelectorAll('[data-forced-scroll]') as NodeListOf<HTMLElement>

  elements.forEach((element) => {
    if (element.hasAttribute('data-forced-scroll-initialized')) {
      return
    }

    element.setAttribute('data-forced-scroll-initialized', 'true')

    const config = parseConfig(element)

    const wrapper = element.querySelector('.forced-scroll-wrapper') as HTMLElement
    const container = element.querySelector('.forced-scroll-container') as HTMLElement

    if (!wrapper || !container) {
      return
    }

    element.classList.add('forced-scroll-section')
    element.style.height = `${config.height * 100}vh`

    scrollStates.push({
      element,
      config,
      wrapper,
      container,
    })
  })

  if (scrollStates.length > 0) {
    initScrollListener()
  }

  return cleanup
}
