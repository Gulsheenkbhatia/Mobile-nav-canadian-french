// Data attributes:
// data-horizontal-accordion - marks the accordion container
// data-accordion-collapsed-width - width of collapsed items in pixels (default: 100)
// data-accordion-gap - gap between items in pixels (default: 8)
// data-accordion-transition-duration - transition duration in seconds (default: 1.2)
// data-accordion-autoplay - autoplay videos when slide becomes active (default: true)

interface AccordionConfig {
  collapsedWidth: number
  gap: number
  transitionDuration: number
  autoplay: boolean
}

interface AccordionState {
  container: HTMLElement
  slides: HTMLElement[]
  config: AccordionConfig
}

const DEFAULT_CONFIG: AccordionConfig = {
  collapsedWidth: 100,
  gap: 8,
  transitionDuration: 1.2,
  autoplay: true,
}

let accordionStates: AccordionState[] = []

function parseConfig(element: HTMLElement): AccordionConfig {
  return {
    collapsedWidth: parseFloat(
      element.getAttribute('data-accordion-collapsed-width') ||
        String(DEFAULT_CONFIG.collapsedWidth)
    ),
    gap: parseFloat(element.getAttribute('data-accordion-gap') || String(DEFAULT_CONFIG.gap)),
    transitionDuration: parseFloat(
      element.getAttribute('data-accordion-transition-duration') ||
        String(DEFAULT_CONFIG.transitionDuration)
    ),
    autoplay: element.getAttribute('data-accordion-autoplay') !== 'false',
  }
}

function findStateBySlide(slide: HTMLElement): AccordionState | undefined {
  return accordionStates.find((state) => state.slides.includes(slide))
}

function getAccordionLabelConfig(slide: HTMLElement) {
  const container = slide.closest('[data-horizontal-accordion]') as HTMLElement | null
  return {
    playLabel: container?.getAttribute('data-accordion-play-label') || 'Play',
    pauseLabel: container?.getAttribute('data-accordion-pause-label') || 'Pause',
    fallbackVideoLabel:
      container?.getAttribute('data-accordion-video-label') || 'Promotional video',
  }
}

function getAccordionVideoLabel(
  slide: HTMLElement,
  video: HTMLVideoElement,
  fallbackVideoLabel: string
): string {
  const slideImage = slide.querySelector('.accordion-slide-image') as HTMLImageElement | null
  return (
    video.getAttribute('aria-label') ||
    video.getAttribute('title') ||
    video.getAttribute('data-video-title') ||
    video.getAttribute('data-title') ||
    slideImage?.alt ||
    fallbackVideoLabel
  )
}

function updatePlayPauseIcon(slide: HTMLElement, video: HTMLVideoElement): void {
  const playIcon = slide.querySelector('.play-icon') as HTMLElement | null
  const pauseIcon = slide.querySelector('.pause-icon') as HTMLElement | null
  const playPauseButton = slide.querySelector('.accordion-play-pause-btn') as HTMLElement | null
  if (!playIcon || !pauseIcon) return

  playIcon.style.display = video.paused ? 'block' : 'none'
  pauseIcon.style.display = video.paused ? 'none' : 'block'

  if (playPauseButton) {
    const { playLabel, pauseLabel, fallbackVideoLabel } = getAccordionLabelConfig(slide)
    const label = getAccordionVideoLabel(slide, video, fallbackVideoLabel)
    const actionLabel = video.paused ? `${playLabel} ${label}` : `${pauseLabel} ${label}`
    playPauseButton.setAttribute('aria-label', actionLabel)
    playPauseButton.setAttribute('aria-pressed', (!video.paused).toString())
  }
}

function handlePlayPause(e: Event): void {
  const btn = (e.target as HTMLElement).closest('.accordion-play-pause-btn')
  if (!btn) return

  e.stopPropagation()
  const slide = btn.closest('.accordion-slide') as HTMLElement
  const video = slide?.querySelector('.accordion-slide-video') as HTMLVideoElement | null
  if (!video) return

  video.paused ? video.play() : video.pause()
  updatePlayPauseIcon(slide, video)
}

function handleSlideClick(e: Event): void {
  if ((e.target as HTMLElement).closest('.accordion-play-pause-btn')) return

  const slide = (e.target as HTMLElement).closest('.accordion-slide') as HTMLElement
  if (!slide || slide.classList.contains('active')) return

  const state = findStateBySlide(slide)
  if (!state) return

  state.slides.forEach((s) => {
    const v = s.querySelector('.accordion-slide-video') as HTMLVideoElement | null
    if (v) {
      v.pause()
      v.currentTime = 0
      updatePlayPauseIcon(s, v)
    }
    s.classList.remove('active')
  })

  slide.classList.add('active')

  const video = slide.querySelector('.accordion-slide-video') as HTMLVideoElement | null
  if (video && state.config.autoplay) {
    video.play()
    updatePlayPauseIcon(slide, video)
  }
}

function updateLayout(state: AccordionState): void {
  const { container, config } = state

  container.style.setProperty('--accordion-collapsed-width', `${config.collapsedWidth}px`)
  container.style.setProperty('--accordion-gap', `${config.gap}px`)
  container.style.setProperty('--accordion-transition-duration', `${config.transitionDuration}s`)
}

function initAccordion(container: HTMLElement): void {
  if (container.hasAttribute('data-horizontal-accordion-initialized')) return

  container.setAttribute('data-horizontal-accordion-initialized', 'true')
  container.classList.add('horizontal-accordion')

  const slides = Array.from(container.querySelectorAll('.accordion-slide')) as HTMLElement[]
  if (slides.length === 0) return

  const config = parseConfig(container)
  const state: AccordionState = { container, slides, config }

  const activeSlide = slides.find((s) => s.classList.contains('active')) || slides[0]
  activeSlide.classList.add('active')

  updateLayout(state)

  slides.forEach((slide) => {
    const video = slide.querySelector('.accordion-slide-video') as HTMLVideoElement | null
    if (video) {
      updatePlayPauseIcon(slide, video)
    }
  })

  const activeVideo = activeSlide.querySelector('.accordion-slide-video') as HTMLVideoElement | null
  if (activeVideo && config.autoplay) {
    activeVideo.play()
    updatePlayPauseIcon(activeSlide, activeVideo)
  }

  accordionStates.push(state)
}

function cleanup(): void {
  document.removeEventListener('click', handleSlideClick)
  document.removeEventListener('click', handlePlayPause)
  accordionStates = []
}

export function initAllHorizontalAccordions(
  container: HTMLElement = document.body
): (() => void) | undefined {
  const accordions = container.querySelectorAll(
    '[data-horizontal-accordion]'
  ) as NodeListOf<HTMLElement>

  if (accordions.length === 0) return

  accordions.forEach(initAccordion)

  if (accordionStates.length > 0) {
    document.addEventListener('click', handleSlideClick)
    document.addEventListener('click', handlePlayPause)
  }

  return cleanup
}
