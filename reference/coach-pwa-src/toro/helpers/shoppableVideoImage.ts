import { useState, useEffect, useCallback } from 'react'

type HTMLElementOrNull = HTMLElement | null

export const toggleProductContainer = (e: Event): void => {
  const target = e.target as HTMLElementOrNull
  const drawerHandle = target?.closest('.drawer-text') as HTMLElementOrNull
  if (!drawerHandle) return

  const drawerContainer = drawerHandle.closest('.drawer-container') as HTMLElementOrNull
  if (!drawerContainer) return

  const productContainer = drawerContainer.querySelector('.product-container') as HTMLElementOrNull
  const drawerIcon = drawerHandle.querySelector('use') as SVGUseElement | null
  const mediaNode = drawerContainer
    .closest('.video-container')
    ?.querySelector('.at-media-asset') as HTMLElementOrNull

  const isClosed = productContainer?.classList.toggle('drawer-close') ?? false
  mediaNode?.classList.toggle('products-hidden', isClosed)

  if (drawerIcon) {
    drawerIcon.setAttribute(
      'xlink:href',
      isClosed ? '#icon-nav-chevron-up' : '#icon-nav-chevron-down'
    )
  }
}

export const togglePlayPause = (e: Event): void => {
  const target = e.target as HTMLElementOrNull
  const playPauseArea = target?.closest('.mobile-video-play-wrapper') as HTMLElementOrNull
  if (!playPauseArea) return

  const videoElement = playPauseArea
    .closest('.video-container')
    ?.querySelector('video') as HTMLVideoElement | null
  if (!videoElement) return

  const playIcon = playPauseArea.querySelector('.video-play-btn') as HTMLElementOrNull
  playIcon?.classList.toggle('show-icon')

  if (videoElement.paused) {
    videoElement.play()
    videoElement.removeAttribute('videoPausedByUser')
  } else {
    videoElement.pause()
    videoElement.setAttribute('videoPausedByUser', 'true')
  }
}

export const initDrawerHandleEventListeners = (node: HTMLElementOrNull): (() => void) => {
  if (!node) return () => {}

  const videoContainers = node.querySelectorAll('.mol-shoppable-video-image .video-container')
  const cleanupFunctions: (() => void)[] = []

  videoContainers.forEach((container) => {
    const drawerHandle = container.querySelector('.drawer-text') as HTMLElementOrNull
    const playPauseArea = container.querySelector('.mobile-video-play-wrapper') as HTMLElementOrNull

    if (drawerHandle) {
      drawerHandle.addEventListener('click', toggleProductContainer)
      cleanupFunctions.push(() => {
        drawerHandle.removeEventListener('click', toggleProductContainer)
      })
    }

    if (playPauseArea) {
      playPauseArea.addEventListener('click', togglePlayPause)
      cleanupFunctions.push(() => {
        playPauseArea.removeEventListener('click', togglePlayPause)
      })
    }
  })

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup())
  }
}

export const initProgressBar = (node: HTMLElementOrNull): (() => void) => {
  if (!node) return () => {}

  const shoppableVideos = node.querySelectorAll('.mol-shoppable-video-image')
  const cleanupFunctions: (() => void)[] = []

  shoppableVideos.forEach((videoContainer) => {
    const videoElement = videoContainer.querySelector('video') as HTMLVideoElement | null
    const videoProgressBar = videoContainer.querySelector(
      '.video-progress-filled'
    ) as HTMLElementOrNull
    if (!videoElement || !videoProgressBar) return

    const setProgressBar = () => {
      if (videoElement.duration === 0) return
      const progress = (videoElement.currentTime / videoElement.duration) * 100
      const translateXValue = -100 + progress
      videoProgressBar.style.transform = `translateX(${translateXValue}%)`
    }

    videoElement.addEventListener('timeupdate', setProgressBar)

    cleanupFunctions.push(() => {
      videoElement.removeEventListener('timeupdate', setProgressBar)
    })
  })

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup())
  }
}

export const useShoppableVideoImage = (): ((node: HTMLElementOrNull) => void) => {
  const [node, setNode] = useState<HTMLElementOrNull>(null)

  const handleNodeEvents = useCallback(() => {
    if (!node) return

    const cleanupDrawerEvents = initDrawerHandleEventListeners(node)
    const cleanupProgressBarEvents = initProgressBar(node)

    return () => {
      cleanupDrawerEvents?.()
      cleanupProgressBarEvents?.()
    }
  }, [node])

  useEffect(() => {
    const cleanup = handleNodeEvents()
    return () => {
      cleanup?.()
    }
  }, [handleNodeEvents])

  const setNodeCallback = useCallback((newNode: HTMLElementOrNull) => {
    setNode(newNode)
  }, [])

  return setNodeCallback
}
