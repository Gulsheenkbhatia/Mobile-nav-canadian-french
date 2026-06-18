// Data attributes used to configure video modal trigger
// data-video-modal="<video-url>" - single video URL for all viewports
// data-desktop-video-modal="<video-url>" - video URL for desktop
// data-mobile-video-modal="<video-url>" - video URL for mobile

import { utilityStyles } from 'toro/theme'

type VideoModalCallback = (videoSrc: string) => void
type VideoElementWithFullscreen = HTMLVideoElement & { webkitEnterFullscreen?: () => void }

let onVideoModalOpen: VideoModalCallback | null = null
let activeMobileVideo: HTMLVideoElement | null = null

const BREAKPOINT_MD = parseInt(utilityStyles.breakpoints.md, 10)

function isDesktop(): boolean {
  return window.innerWidth >= BREAKPOINT_MD
}

function removeMobileVideo(): void {
  if (!activeMobileVideo) {
    return
  }
  activeMobileVideo.pause()
  activeMobileVideo.remove()
  activeMobileVideo = null
}

function openMobileFullscreenVideo(videoSrc: string): void {
  removeMobileVideo()

  const video = document.createElement('video') as VideoElementWithFullscreen
  video.src = videoSrc
  video.controls = true
  video.setAttribute('playsinline', 'true')
  video.setAttribute('controlsList', 'nodownload')

  const cleanup = () => {
    document.removeEventListener('fullscreenchange', handleFullscreenExit)
    video.removeEventListener('webkitendfullscreen', cleanup)
    if (activeMobileVideo === video) {
      activeMobileVideo = null
    }
    video.pause()
    video.remove()
  }

  const handleFullscreenExit = () => {
    if (!document.fullscreenElement) {
      cleanup()
    }
  }

  video.addEventListener('webkitendfullscreen', cleanup)
  document.body.appendChild(video)
  activeMobileVideo = video

  video
    .play()
    .then(() => video.requestFullscreen?.() ?? video.webkitEnterFullscreen?.())
    .then(() => document.addEventListener('fullscreenchange', handleFullscreenExit))
    .catch(() => {})
}

export function setVideoModalCallback(callback: VideoModalCallback | null): void {
  onVideoModalOpen = callback
}

function getVideoSrc(element: HTMLElement): string | null {
  const desktop = isDesktop()
  const desktopSrc = element.getAttribute('data-desktop-video-modal')
  const mobileSrc = element.getAttribute('data-mobile-video-modal')
  const fallbackSrc = element.getAttribute('data-video-modal')

  if (desktop && desktopSrc) {
    return desktopSrc
  }

  if (!desktop && mobileSrc) {
    return mobileSrc
  }

  return fallbackSrc || desktopSrc || mobileSrc || null
}

function handleTriggerClick(element: HTMLElement): void {
  const videoSrc = getVideoSrc(element)

  if (!videoSrc) {
    console.warn('Video modal trigger has no video URL', element)
    return
  }

  if (!isDesktop()) {
    openMobileFullscreenVideo(videoSrc)
    return
  }

  if (onVideoModalOpen) {
    onVideoModalOpen(videoSrc)
  } else {
    console.warn('Video modal callback not set')
  }
}

export function initAllVideoModals(container: HTMLElement = document.body): () => void {
  const triggerElements = container.querySelectorAll(
    '[data-video-modal], [data-desktop-video-modal], [data-mobile-video-modal]'
  ) as NodeListOf<HTMLElement>

  const clickHandlers = new Map<HTMLElement, () => void>()

  triggerElements.forEach((element) => {
    if (element.hasAttribute('data-video-modal-initialized')) {
      return
    }

    element.setAttribute('data-video-modal-initialized', 'true')

    const handler = () => handleTriggerClick(element)
    element.addEventListener('click', handler)
    clickHandlers.set(element, handler)
  })

  return () => {
    clickHandlers.forEach((handler, element) => {
      element.removeEventListener('click', handler)
      element.removeAttribute('data-video-modal-initialized')
    })
    clickHandlers.clear()
  }
}
