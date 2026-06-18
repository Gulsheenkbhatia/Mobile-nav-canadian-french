import { Splide } from '@splidejs/splide'
import { splideControllers } from 'toro/helpers/home'
import isMobileDevice from 'toro/helpers/isMobileDevice'
import { useCallback, useEffect, useRef } from 'react'
import { cmsObserverManager } from 'toro/cms/services/observerManager'

const SLIDER_SELECTORS = {
  ROOT: '.mol-tabbed-slider',
  NAV: '.nav-tabs',
  NAV_LINKS: '.nav-tabs .nav-link',
  TAB_PANES: '.tab-content > .tab-pane',
  NAV_ITEM: '.nav-item',
  SPLIDE_TRACK: '.splide__track',
  TAB_CONTENT: '.tab-content',
  DESKTOP_WRAPPER: '.tab-content-wrapper-desktop',
  MOBILE_WRAPPER: '.tab-content-wrapper-mobile',
  VIDEO: 'video',
  VIDEO_STOPPED_CLASS: 'video-stopped',
  USER_PAUSED_ATTR: 'videopausedbyuser',
  SLIDE_BLOCK_PREFIX: '.component-block-slide-',
  CLICKABLE_AREAS: ['.tab-content', '.nav-tabs', '.mol-tabbed-slider__right'],
}
interface SliderConfig {
  timeInterval: number
  isProgressEnabled: boolean
}

interface SliderControl {
  currentIndex: number
  isInView: boolean
  splide: Splide | null
}

type NavLinkEl = HTMLButtonElement | HTMLAnchorElement

function getConfig(rootEl: HTMLElement): SliderConfig {
  return {
    timeInterval: Number(rootEl.dataset.timeInterval) || 0,
    isProgressEnabled: rootEl.dataset.progressbar === 'true',
  }
}

function getTabs(rootEl: HTMLElement) {
  const navLinks = Array.from(rootEl.querySelectorAll<NavLinkEl>(SLIDER_SELECTORS.NAV_LINKS))
  const panes = Array.from(rootEl.querySelectorAll<HTMLElement>(SLIDER_SELECTORS.TAB_PANES))
  return { navLinks, panes }
}

function ensureDefaultActive(rootEl: HTMLElement, navLinks: NavLinkEl[]): number {
  let currentIndex = navLinks.findIndex((l) => l.classList.contains('active'))
  if (currentIndex < 0) currentIndex = 0

  const defaultLink = navLinks[currentIndex]
  const defaultPaneId = defaultLink?.getAttribute('data-target')

  if (defaultPaneId) {
    rootEl.querySelector<HTMLElement>(defaultPaneId)?.classList.add('active', 'show')
  }
  if (defaultLink) {
    defaultLink.classList.add('active')
    defaultLink.setAttribute('aria-selected', 'true')
    defaultLink.closest(SLIDER_SELECTORS.NAV_ITEM)?.classList.add('active')
  }
  return currentIndex
}

function clearActive(rootEl: HTMLElement, panes: HTMLElement[], navLinks: NavLinkEl[]) {
  panes.forEach((p) => p.classList.remove('active', 'show'))
  navLinks.forEach((l) => {
    l.classList.remove('active')
    l.setAttribute('aria-selected', 'false')
    l.closest(SLIDER_SELECTORS.NAV_ITEM)?.classList.remove('active')
  })

  const allVideos = rootEl.querySelectorAll<HTMLVideoElement>(SLIDER_SELECTORS.VIDEO)
  allVideos.forEach((video) => {
    if (!video.paused) {
      video.classList.add(SLIDER_SELECTORS.VIDEO_STOPPED_CLASS)
      video.pause()
    }
  })
}

function handleVideoPlayback(video: HTMLVideoElement) {
  const wasScriptStopped = video.classList.contains(SLIDER_SELECTORS.VIDEO_STOPPED_CLASS)
  const hasAutoplay = video.hasAttribute('autoplay')
  const isUserPaused = video.getAttribute(SLIDER_SELECTORS.USER_PAUSED_ATTR) === 'true'
  if ((wasScriptStopped || hasAutoplay) && !isUserPaused) {
    video.classList.remove(SLIDER_SELECTORS.VIDEO_STOPPED_CLASS)
    video.play()
  }
}

function activateIndex(
  rootEl: HTMLElement,
  index: number,
  navLinks: NavLinkEl[],
  panes: HTMLElement[],
  control: SliderControl,
  shouldScroll = false
) {
  const link = navLinks[index]
  const paneId = link?.getAttribute('data-target')
  if (!link || !paneId) return

  const pane = rootEl.querySelector<HTMLElement>(paneId)
  if (!pane) return

  clearActive(rootEl, panes, navLinks)

  pane.classList.add('active', 'show')
  link.classList.add('active')
  link.setAttribute('aria-selected', 'true')
  link.closest(SLIDER_SELECTORS.NAV_ITEM)?.classList.add('active')

  if (shouldScroll && control.isInView) {
    link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  const targetSlide = rootEl.querySelector<HTMLElement>(
    `${SLIDER_SELECTORS.SLIDE_BLOCK_PREFIX}${index}`
  )
  const videoToPlay = targetSlide?.querySelector<HTMLVideoElement>(SLIDER_SELECTORS.VIDEO)
  if (videoToPlay) {
    handleVideoPlayback(videoToPlay)
  }
}

function getSplide(rootEl: HTMLElement): Splide | null {
  const scope = rootEl.id
  const entry = (splideControllers as Record<string, any>)[scope]
  const inst = entry?.splide as Splide
  const ok = inst && typeof inst.go === 'function' && typeof inst.on === 'function'
  return ok ? inst : null
}

function createAutoAdvancer(
  rootEl: HTMLElement,
  control: SliderControl,
  config: SliderConfig,
  onTick: () => void
) {
  let timer: ReturnType<typeof setInterval> | undefined
  let isPermanentlyDisabled = false

  const watchTarget = rootEl

  const start = () => {
    if (!config.timeInterval || !control.isInView || isPermanentlyDisabled || document.hidden) {
      return
    }
    stop()
    if (config.isProgressEnabled) {
      rootEl.classList.remove('auto-progress-stopped')
      rootEl.classList.add('auto-progress-active')
    }
    timer = setInterval(onTick, config.timeInterval)
  }

  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = undefined
    }
    if (config.isProgressEnabled && rootEl.classList.contains('auto-progress-active')) {
      rootEl.classList.remove('auto-progress-active')
      rootEl.classList.add('auto-progress-stopped')
    }
  }

  const handleIntersection = (isIntersecting: boolean) => {
    control.isInView = isIntersecting
    if (control.isInView) {
      start()
    } else {
      stop()
    }
  }

  const handleVisibilityChange = (isHidden: boolean) => {
    if (isHidden) {
      stop()
    } else {
      start()
    }
  }

  const stopPermanently = () => {
    isPermanentlyDisabled = true
    stop()
    if (watchTarget) {
      cmsObserverManager.unobserve(watchTarget)
    }
    cmsObserverManager.removeVisibilityListener(handleVisibilityChange)
  }

  const attach = () => {
    if (!config.timeInterval || !watchTarget) return
    cmsObserverManager.observe(watchTarget, handleIntersection)
    cmsObserverManager.addVisibilityListener(handleVisibilityChange)
  }

  const detach = () => {
    stop()
    if (watchTarget) {
      cmsObserverManager.unobserve(watchTarget)
    }
    cmsObserverManager.removeVisibilityListener(handleVisibilityChange)
  }

  return { attach, detach, stopPermanently }
}

export function initTabbedSlider(rootEl: HTMLElement): () => void {
  if (!rootEl || rootEl.dataset.init === 'true') {
    return () => {}
  }

  const config = getConfig(rootEl)

  const isMobile = isMobileDevice()
  rootEl
    .querySelector(isMobile ? SLIDER_SELECTORS.DESKTOP_WRAPPER : SLIDER_SELECTORS.MOBILE_WRAPPER)
    ?.remove()

  const { navLinks, panes } = getTabs(rootEl)
  if (!navLinks.length || !panes.length) {
    return () => {}
  }

  const control: SliderControl = {
    currentIndex: ensureDefaultActive(rootEl, navLinks),
    isInView: false,
    splide: getSplide(rootEl),
  }

  const handleAdvance = () => {
    const next = (control.currentIndex + 1) % navLinks.length
    activateIndex(rootEl, next, navLinks, panes, control)
    control.currentIndex = next
    control.splide?.go(next)
  }

  const autoAdvancer = createAutoAdvancer(rootEl, control, config, handleAdvance)

  const handleTabClick = (ev: Event) => {
    const link = (ev.target as HTMLElement).closest<NavLinkEl>('.nav-link')
    if (!link) return

    autoAdvancer.stopPermanently()
    const idx = navLinks.indexOf(link)
    if (idx === -1 || idx === control.currentIndex) return

    activateIndex(rootEl, idx, navLinks, panes, control, true)
    control.currentIndex = idx
    control.splide?.go(idx)
  }

  const handleUserInteraction = (ev: Event) => {
    const target = ev.target as HTMLElement
    if (SLIDER_SELECTORS.CLICKABLE_AREAS.some((selector) => target.closest(selector))) {
      autoAdvancer.stopPermanently()
    }
  }

  const attachSplide = (inst: Splide) => {
    control.splide = inst
    inst.on('moved', (newIndex: number) => {
      if (newIndex === control.currentIndex) return
      activateIndex(rootEl, newIndex, navLinks, panes, control)
      control.currentIndex = newIndex
    })
    if (inst.index !== control.currentIndex) {
      inst.go(control.currentIndex)
    }
  }

  const handleSplideRegistered = (event: Event) => {
    const { id } = (event as CustomEvent).detail
    if (id === rootEl.id && !control.splide) {
      const splideInstance = getSplide(rootEl)
      if (splideInstance) {
        attachSplide(splideInstance)
      }
    }
  }

  const nav = rootEl.querySelector(SLIDER_SELECTORS.NAV)
  nav?.addEventListener('click', handleTabClick)
  // Use click (not pointerdown): touch scrolls begin with pointerdown on the carousel and
  // would call stopPermanently before any tap, killing auto-advance on mobile.
  rootEl.addEventListener('click', handleUserInteraction)
  rootEl.addEventListener('keydown', handleUserInteraction)
  document.addEventListener('splide:registered', handleSplideRegistered)
  autoAdvancer.attach()

  if (control.splide) {
    attachSplide(control.splide)
  }

  rootEl.dataset.init = 'true'

  return () => {
    autoAdvancer.detach()
    nav?.removeEventListener('click', handleTabClick)
    rootEl.removeEventListener('click', handleUserInteraction)
    rootEl.removeEventListener('keydown', handleUserInteraction)
    document.removeEventListener('splide:registered', handleSplideRegistered)
    rootEl.classList.remove('auto-progress-active', 'auto-progress-stopped')
    delete rootEl.dataset.init
  }
}

export const useTabbedSlider = () => {
  const cleanupsRef = useRef<Array<() => void>>([])

  const initializeNode = useCallback((node: HTMLElement) => {
    if (!node) return

    const selector = SLIDER_SELECTORS.ROOT
    const roots = Array.from(node.querySelectorAll<HTMLElement>(selector))
    if (node.matches(selector)) {
      roots.push(node)
    }

    const uniqueRoots = Array.from(new Set(roots))
    const newCleanups = uniqueRoots.map((el) => initTabbedSlider(el))
    cleanupsRef.current.push(...newCleanups)
  }, [])

  useEffect(() => {
    const allCleanups = cleanupsRef.current
    return () => {
      allCleanups.forEach((clean) => clean?.())
      cleanupsRef.current = []
    }
  }, [])

  return initializeNode
}
