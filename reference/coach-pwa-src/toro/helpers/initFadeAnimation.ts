// Data attributes used to configure the fade animation
// data-fade-delay - animation delay in seconds
// data-fade-blur - blur applied to animation appearance (in pixels)
// data-fade-direction - direction from where animation is coming from
// data-fade-distance - distance of animation being moved from end position to initial position (in pixels)

type FadeDirection = 'top' | 'bottom' | 'left' | 'right' | 'none'

interface FadeConfig {
  delay: number
  blur: number
  direction: FadeDirection
  distance: number
}

const DEFAULT_CONFIG: FadeConfig = {
  delay: 0,
  blur: 0,
  direction: 'none',
  distance: 10,
}

function getTransformValue(direction: FadeDirection, distance: number): string {
  const transforms: Record<FadeDirection, string> = {
    top: `translateY(-${distance}px)`,
    bottom: `translateY(${distance}px)`,
    left: `translateX(-${distance}px)`,
    right: `translateX(${distance}px)`,
    none: 'translate(0, 0)',
  }
  return transforms[direction]
}

function parseConfig(element: HTMLElement): FadeConfig {
  return {
    delay: parseFloat(element.getAttribute('data-fade-delay') || String(DEFAULT_CONFIG.delay)),
    blur: parseFloat(element.getAttribute('data-fade-blur') || String(DEFAULT_CONFIG.blur)),
    direction: (element.getAttribute('data-fade-direction') ||
      DEFAULT_CONFIG.direction) as FadeDirection,
    distance: parseFloat(
      element.getAttribute('data-fade-distance') || String(DEFAULT_CONFIG.distance)
    ),
  }
}

function setupElementStyles(element: HTMLElement, config: FadeConfig): void {
  const transformValue = getTransformValue(config.direction, config.distance)

  element.style.setProperty('--fade-delay', `${config.delay}s`)
  element.style.setProperty('--fade-blur', `${config.blur}px`)
  element.style.setProperty('--fade-transform', transformValue)

  element.classList.add('fade-animate')
}

function createObserver(): IntersectionObserver {
  const handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement
        element.classList.add('fade-animate--visible')
      }
    })
  }

  return new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  })
}

export function initAllFadeAnimations(
  container: HTMLElement = document.body
): (() => void) | undefined {
  const elements = container.querySelectorAll('[data-fade]') as NodeListOf<HTMLElement>

  if (elements.length === 0) {
    return
  }

  const observer = createObserver()

  elements.forEach((element) => {
    if (element.hasAttribute('data-fade-initialized')) return

    element.setAttribute('data-fade-initialized', 'true')

    const config = parseConfig(element)
    setupElementStyles(element, config)

    observer.observe(element)
  })

  return () => {
    observer.disconnect()
  }
}
