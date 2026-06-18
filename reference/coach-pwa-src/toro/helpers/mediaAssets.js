import { utilityStyles } from 'toro/theme'
import { useState, useEffect } from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import {
  triggerSplideCalculation,
  goToNextSplideSlide,
  splideVideoHandler,
} from 'toro/helpers/home'
import debounce from 'lodash/debounce'
import { observe } from 'react-intersection-observer'
import get from 'lodash/get'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'

const BREAKPOINT_MD = parseInt(utilityStyles.breakpoints.md)

const ICON_PLAY = '#icon-video-play'
const ICON_PAUSE = '#icon-video-pause'
const ICON_UNMUTE = '#icon-video-volume'
const ICON_MUTE = '#icon-video-volume-mute'
const PLAY_MUTE_ICONS = `<svg width="0" height="0" style="position:absolute" data-name="play-mute-icons">
        <symbol viewBox="0 0 24 24" id="icon-video-pause" xmlns="http://www.w3.org/2000/svg"><path d="M4 3h6v18H4zm10 0h6v18h-6z" fill="#FFF" fill-rule="evenodd"></path></symbol>
        <symbol viewBox="0 0 24 24" id="icon-video-play" xmlns="http://www.w3.org/2000/svg"><path d="M19 12L5 21V3z" fill="#FFF" fill-rule="evenodd"></path></symbol>
        <symbol viewBox="0 0 24 24" id="icon-video-volume" xmlns="http://www.w3.org/2000/svg"><path d="M12.007 19.955a1.085 1.085 0 01-1.09 1.086c-.25 0-.496-.085-.695-.25l-5.959-4.92H1.09c-.602 0-1.09-.486-1.09-1.086v-4.327c0-.6.488-1.086 1.09-1.086h3.174l5.958-4.92a1.088 1.088 0 011.785.836v14.667zm4.189-1.697a1.088 1.088 0 01-.849-.315l-.146-.146a1.083 1.083 0 01-.105-1.415 6.251 6.251 0 001.247-3.76c0-1.467-.49-2.843-1.415-3.979a1.082 1.082 0 01.075-1.452l.146-.146a1.096 1.096 0 011.615.081 8.576 8.576 0 011.962 5.496c0 1.89-.6 3.69-1.735 5.203-.19.252-.48.41-.795.433zm4.506 3.357a1.093 1.093 0 01-.788.384L19.87 22c-.289 0-.566-.114-.771-.318l-.143-.143a1.084 1.084 0 01-.064-1.467 11.568 11.568 0 002.726-7.45c0-2.83-1.036-5.556-2.918-7.673a1.082 1.082 0 01.044-1.486l.143-.143c.212-.212.487-.33.803-.32.3.01.584.141.783.365A13.9 13.9 0 0124 12.622c0 3.288-1.17 6.481-3.298 8.993z" fill="#FFF" fill-rule="evenodd"></path></symbol>
        <symbol viewBox="0 0 24 24" id="icon-video-volume-mute" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF" fill-rule="evenodd"><path d="M16.007 19.955a1.085 1.085 0 01-1.09 1.086c-.25 0-.496-.085-.695-.25l-5.959-4.92H5.09c-.602 0-1.09-.486-1.09-1.086v-4.327c0-.6.488-1.086 1.09-1.086h3.174l5.958-4.92a1.088 1.088 0 011.785.836v14.667z"></path><path d="M3.293 3.293a1 1 0 011.32-.083l.094.083 16.97 16.97a1 1 0 01-1.32 1.498l-.094-.083-16.97-16.97a1.002 1.002 0 010-1.415z"></path></g></symbol>
        <symbol viewBox="0 0 25 25" id="icon-coachtopia-video-play" xmlns="http://www.w3.org/2000/svg"><g opacity="0.4"><circle cx="12" cy="12" r="12" fill="black"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M9.2998 7.2002L16.4998 12.0002L9.2998 16.8002V7.2002Z" fill="white"></path></g></symbol></svg>`

const eventTypes = {
  click: 'click',
  scroll: 'scroll',
  timeupdate: 'timeupdate',
  mouseover: 'mouseover',
  mouseout: 'mouseout',
}

const shortsVideoControllerListeners = []
let modalShortVideoIsReadyToPlay = false
let videoRetentionToPlay = true
const shortsContainerList = {}

const initializeVideoMuteState = (video, muteIconUse) => {
  if (!video || video.dataset.muteInitialized === 'true') return
  video.muted = true
  video.setAttribute('muted', true)
  video.dataset.muteInitialized = 'true'
  muteIconUse?.setAttribute('xlink:href', ICON_MUTE)
}

const handleVideoPlayerClick = (e) => {
  if (
    (e.type === 'click' || e.keyCode === 32) &&
    !e.currentTarget.classList.contains('video-paused')
  ) {
    e.currentTarget.classList.add('video-paused')
  } else {
    e.currentTarget.classList.remove('video-paused')
  }
}
const videoModalViewOptions = {
  threshold: [0, 0.1, 0.15, 0.85, 1],
}
function handleVideoModalView(inView, entry) {
  if (inView) {
    let video = entry?.target.querySelector('video')
    const playIconUse = entry?.target.querySelector('.ac-video-controls .ac-toggle-playback use')
    const muteIconUse = entry?.target.querySelector('.ac-video-controls .ac-toggle-sound use')

    if (entry?.intersectionRatio >= 0.85 && videoRetentionToPlay) {
      video?.play()
      const aspectRatioBox = entry?.target.querySelector('.amps-aspect-ratio-box-video')
      aspectRatioBox?.classList?.add('aspect-ratio-auto')
      initializeVideoMuteState(video, muteIconUse)
      playIconUse?.setAttribute('xlink:href', ICON_PAUSE)
    } else if (!video?.paused) {
      video?.pause()
      playIconUse?.setAttribute('xlink:href', ICON_PLAY)
    }
  }
}

const stopPropagationOnClick = (event) => event.stopPropagation()

export function playSuspendedVideo(video, playVideo) {
  video.onsuspend = () => {
    if (video.paused) {
      playVideo()
    } else {
      video.oncanplay = () => {
        playVideo()
      }
    }
  }
}

const videoPlayerEventsInit = (element) => {
  if (!element) {
    return
  }

  const elements = [...element.querySelectorAll(`.amps-video video:not([data-listener])`)]
  const cleanups = elements.map((el) => {
    el.addEventListener('click', handleVideoPlayerClick)
    el.addEventListener('keydown', handleVideoPlayerClick)
    el.dataset.listener = ''
    return () => {
      el.removeEventListener('click', handleVideoPlayerClick)
      el.removeEventListener('keydown', handleVideoPlayerClick)
    }
  })
  return () => cleanups.forEach((f) => f())
}

const playVideoOnOrientationChange = function (videoElement) {
  if (!videoElement) {
    return
  }

  videoElement.load()

  try {
    const playPromise = videoElement.play()
    playPromise
      .then(() => {
        videoElement.nextElementSibling
          .querySelector('#ac-toggle-playback use, .ac-toggle-playback use')
          ?.setAttribute('xlink:href', ICON_PAUSE)
      })
      .catch(() => {})
  } catch (e) {
    console.error(e)
  }
}

function getVideoBlockId(videoBlock) {
  let id
  videoBlock.classList.forEach((className) => {
    if (className.includes('shorts-video-')) id = className
  })
  return id
}

export function nextVideoMuted(nextSlideVideo, nextSlideDom) {
  const nextSlideIconVolume = nextSlideDom?.querySelector('.icon-volumn > use')
  initializeVideoMuteState(nextSlideVideo, nextSlideIconVolume)
}

export function windowResizeVideo(isDesktop) {
  const videos = document.querySelectorAll('.content-video')

  if (!videos.length) {
    return
  }

  let needsAutoplayCheck = false
  const viewportType = isDesktop ? 'desktop' : 'mobile'

  videos.forEach(function (el) {
    const isShortsVideo = el.closest('.mol-shorts-video, .mol-cloud-animation')
    if (isShortsVideo) return

    const isLazy = el.getAttribute('data-loading')
    const hasLoadedSrc = el.getAttribute('src')

    if (isLazy && !hasLoadedSrc) return

    const videoSrcEl = el.querySelector('source')
    const currentSrc = el.getAttribute('src') || videoSrcEl?.getAttribute('src')
    const currentPoster = el.getAttribute('poster')
    const viewportTypeVideoSrc = el.getAttribute(`data-${viewportType}-video-src`)
    const viewportTypePoster = el.getAttribute(`data-${viewportType}-poster-src`)
    if (viewportTypeVideoSrc && currentSrc !== viewportTypeVideoSrc) {
      el.setAttribute('src', viewportTypeVideoSrc)
      videoSrcEl?.setAttribute('src', viewportTypeVideoSrc)
      playVideoOnOrientationChange(el)
    }
    if (viewportTypePoster && currentPoster !== viewportTypePoster) {
      el.setAttribute('poster', viewportTypePoster)
    }
    needsAutoplayCheck = true
  })

  if (needsAutoplayCheck) {
    autoplayVideoOnViewFold(isDesktop)
  }
}

function autoplayVideoOnViewFold(isDesktop) {
  const videos = document.querySelectorAll('.ac-video')
  if (!videos.length) {
    return
  }
  const fraction = 0.3 // Play when 30% of the player is visible.
  const viewportType = isDesktop ? 'desktop' : 'mobile'
  const componentBlocks = document.querySelectorAll(
    `.stacked-scroll-animation-${viewportType} .component-block,
     .stacked-scroll-animation-${viewportType} .card-tiles,
     .stacked-scroll-animation-${viewportType} .product-slide`
  )
  let visibleBlock = null
  let videosInVisibleBlock = []

  componentBlocks.forEach((block) => {
    const rect = block.getBoundingClientRect()
    const blockHeight = rect.height
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
    const visibleArea = visibleHeight > 0 ? visibleHeight / blockHeight : 0

    if (visibleArea > fraction) {
      visibleBlock = block
    }
  })

  if (visibleBlock) {
    videosInVisibleBlock = visibleBlock.querySelectorAll('video')
  }

  videos.forEach((video) => {
    const isShortsVideo = video.closest('.mol-shorts-video, .mol-cloud-animation')
    if (isShortsVideo) return

    const w = video.offsetWidth
    const h = video.offsetHeight
    if (!w || !h) return

    const mediaAsset = video.closest('.at-media-asset')
    const isStackedPageAccVideo = video.closest(`.stacked-scroll-animation-${viewportType}`)
    const isInVisibleBlock = [...videosInVisibleBlock].includes(video)

    const viewportOffset = video.getBoundingClientRect()
    const x = viewportOffset.left + window.scrollX
    const y = viewportOffset.top + window.scrollY
    const r = x + w //right
    const b = y + h //bottom
    const visibleX = Math.max(
      0,
      Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset)
    )
    const visibleY = Math.max(
      0,
      Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset)
    )
    const visible = (visibleX * visibleY) / (w * h)

    const videoControls = mediaAsset?.querySelector('.ac-video-controls')
    const videoControlButtons = videoControls?.querySelector(
      '#ac-toggle-playback, .ac-toggle-playback'
    )
    const videoPlayButton = mediaAsset?.querySelector('.video-play-button, .short-video-play-btn')
    const icon = videoControls?.querySelector('#ac-toggle-playback use, .ac-toggle-playback use')

    const shouldPlayVideo =
      (isStackedPageAccVideo && isInVisibleBlock && visible > fraction) ||
      (!isStackedPageAccVideo && visible > fraction)

    if (shouldPlayVideo) {
      const isPlaying =
        video.currentTime > 0 &&
        !video.paused &&
        !video.ended &&
        video.readyState > video.HAVE_CURRENT_DATA

      let buttonStatus
      if (videoControls) {
        buttonStatus = videoControlButtons?.getAttribute('aria-pressed')
      }

      if (!isPlaying) {
        if (!videoPlayButton && buttonStatus === 'true') {
          return
        } else if (
          (!video.classList.contains('video-paused') && video.classList.contains('autoplay')) ||
          video.classList.contains('inline-video')
        ) {
          if (video.getAttribute('videoPausedByUser')) {
            return
          }
          video.play().catch(() => {
            video.closest('a')?.classList?.add('low-power-anchor')
          })
          icon?.setAttribute('xlink:href', ICON_PAUSE)
        }
      }

      video.loop = video.classList.contains('loop')
    } else {
      video.pause()
      // On pause, reset the aria-pressed attribute for all paused videos to false
      videoControlButtons.setAttribute('aria-pressed', 'false')
      icon?.setAttribute('xlink:href', ICON_PLAY)
    }
  })
}

let productsDrawerInitListenersArr = []

export function productsDrawerInit() {
  if (productsDrawerInitListenersArr.length > 0) {
    productsDrawerInitListenersArr.forEach((fn) => fn())
    productsDrawerInitListenersArr = []
  }

  if (window.innerWidth >= BREAKPOINT_MD) {
    if (productsDrawerInitListenersArr.length === 0) {
      const shoppableVideos = [...document.querySelectorAll('.mol-shoppable-video')]
      productsDrawerInitListenersArr = shoppableVideos.map((el) => {
        const openHandler = () => {
          if (drawerContainer) {
            drawerContainer.style.right = 0
            drawerContainer.classList.add('show')
            el.querySelector('.container-close-btn')?.focus()
          }
        }

        const closeHandler = () => {
          if (drawerContainer) {
            const drawerWidth = drawerContainer?.offsetWidth
            drawerContainer.style.right = `${-drawerWidth}px`
            drawerContainer.classList.remove('show')
          }
        }
        // Open and close drawer container
        const drawerContainer = el.querySelector('.drawer-container')
        const drawerHandleElem = el.querySelector('.drawer-handle')
        const closeButtonElem = el.querySelector('.container-close-btn')

        drawerHandleElem?.addEventListener('click', openHandler)
        closeButtonElem?.addEventListener('click', closeHandler)

        return () => {
          drawerHandleElem?.removeEventListener('click', openHandler)
          closeButtonElem?.removeEventListener('click', closeHandler)
        }
      })
    }
  }
}

function videoDisableRightClick(element) {
  if (!element || !element.querySelector('video')) {
    return
  }

  const mediaAsset = [...document.querySelectorAll('.disable-video-click')]

  const cleanups = mediaAsset.map((item) => {
    item?.addEventListener('contextmenu', onContextMenu)
    return () => {
      item?.removeEventListener('contextmenu', onContextMenu)
    }
    function onContextMenu(event) {
      event.stopPropagation()
      event.preventDefault()
      return false
    }
  })
  return () => cleanups.forEach((f) => f())
}

function videoPlayMuteInit(element, isDesktop, onClickCmsAnalytics) {
  if (!element || !element.querySelector('video')) {
    return
  }
  const hasIcons = document.querySelector('[data-name="play-mute-icons"]')
  if (!hasIcons) {
    const divWithPlayMuteIcons = document.createElement('div')
    divWithPlayMuteIcons.innerHTML = PLAY_MUTE_ICONS
    document.body.appendChild(divWithPlayMuteIcons)
  }
  const slides = [...element.querySelectorAll('.splide__list .splide-slide')]
  const cleanups = []
  if (isDesktop && slides.length) {
    slides.forEach((slideElement) => {
      const mediaAsset = [...slideElement.querySelectorAll(`.at-media-asset`)]
      const cleanupsMedia = mediaAsset.map((item) =>
        addEventsForMediaAsset(item, true, onClickCmsAnalytics)
      )
      cleanups.push(...cleanupsMedia)
    })
  }
  const mediaAsset = [...element.querySelectorAll('.at-media-asset:not(.insideSplideSlide)')]
  const cleanupsMedia = mediaAsset.map((item) =>
    addEventsForMediaAsset(item, false, onClickCmsAnalytics)
  )
  cleanups.push(...cleanupsMedia)
  return () => cleanups.forEach((f) => f())
}

const addEventsForMediaAsset = (item, isSplideSlide = false, onClickCmsAnalytics) => {
  const video = item.querySelector('.ac-video')
  if (!video || video.closest('.mol-shorts-video, .mol-cloud-animation')) return () => {}
  const togglePlayback = item.querySelector('#ac-toggle-playback, .ac-toggle-playback')
  const toggleSound = item.querySelector('#ac-toggle-sound, .ac-toggle-sound')
  const videoPlayButton = item.querySelector('.video-play-button')

  const sanitizePromotionLabel = (value) => {
    if (!value) return value
    return value
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
      .replace(/\.media-[^{]+{[^}]*}/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const ensureAnchorA11y = (element) => {
    if (!element) return
    const anchors = element.tagName === 'A' ? [element] : Array.from(element.querySelectorAll('a'))
    anchors.forEach((anchor) => {
      if (anchor.getAttribute('aria-label')) return
      const promotionName =
        anchor.getAttribute('data-promotion-name') || anchor.getAttribute('title')
      const sanitizedPromotionName = sanitizePromotionLabel(promotionName)
      if (sanitizedPromotionName) {
        anchor.setAttribute('aria-label', sanitizedPromotionName)
      }
    })
  }

  const getSoundLabelConfig = () => ({
    muteLabel: item.getAttribute('data-mute-label') || 'Mute',
    unmuteLabel: item.getAttribute('data-unmute-label') || 'Unmute',
  })

  const getSoundLabel = (isMuted) => {
    const { muteLabel, unmuteLabel } = getSoundLabelConfig()
    return isMuted ? unmuteLabel : muteLabel
  }

  const getPlaybackLabelConfig = () => ({
    playLabel: item.getAttribute('data-play-label') || 'Play Promotional Video',
    pauseLabel: item.getAttribute('data-pause-label') || 'Pause Promotional Video',
  })

  const getPlaybackLabel = (isPaused) => {
    const { playLabel, pauseLabel } = getPlaybackLabelConfig()
    return isPaused ? playLabel : pauseLabel
  }

  ensureAnchorA11y(item)
  if (togglePlayback) {
    const isPlaying = !video.paused
    togglePlayback.setAttribute('aria-pressed', isPlaying ? 'true' : 'false')
    togglePlayback.setAttribute('aria-label', getPlaybackLabel(video.paused))
  }
  if (toggleSound) {
    const isMuted = Boolean(video.muted)
    toggleSound.setAttribute('aria-label', getSoundLabel(isMuted))
    toggleSound.setAttribute('aria-pressed', isMuted ? 'true' : 'false')
  }

  function onEnded() {
    const icon = togglePlayback.querySelector('use')
    togglePlayback.setAttribute('aria-pressed', 'false')
    togglePlayback.setAttribute('aria-label', getPlaybackLabel(true))
    icon.setAttribute('xlink:href', ICON_PLAY)
  }

  function onClick(event) {
    event.stopPropagation()
    event.preventDefault()
    onClickCmsAnalytics?.(event)
    toggleState(event.currentTarget, event)
  }

  function onKeyDown(event) {
    if (event.key === 32) {
      event.preventDefault()
    } else if (event.key === 13) {
      event.preventDefault()
      toggleState(event.currentTarget, event)
    }
  }

  function onKeyUp(event) {
    if (event.key === 32) {
      event.preventDefault()
      toggleState(event.currentTarget, event)
    }
  }

  function onVideoStateToggle(event) {
    const button = event.target.nextElementSibling?.querySelector(
      '#ac-toggle-playback, .ac-toggle-playback'
    )
    toggleButtonState(button, video.paused ? ICON_PLAY : ICON_PAUSE)
  }

  function toggleButtonState(button, attribute) {
    if (!button) {
      return
    }
    const icon = button.querySelector('use')
    const isPlaying = !video.paused
    button.setAttribute('aria-pressed', isPlaying ? 'true' : 'false')
    button.setAttribute('aria-label', getPlaybackLabel(video.paused))
    icon.setAttribute('xlink:href', attribute)
  }

  function toggleState(button, e) {
    e.preventDefault()
    const video = button.closest('.at-media-asset').querySelector('.ac-video')
    if (button.classList.contains('video-play-button')) {
      video.play()
      const videoControls = button.parentNode.querySelector('.ac-video-controls')
      button.removeEventListener('click', onClick)
      button.remove()
      video.classList.add('autoplay')
      videoControls.classList.remove('invisible')
      videoControls
        .querySelector('#ac-toggle-playback use, .ac-toggle-playback use')
        .setAttribute('xlink:href', ICON_PAUSE)
    } else {
      const icon = button.querySelector('use')
      if (
        button.classList.contains('ac-toggle-playback') ||
        button.matches('#ac-toggle-playback')
      ) {
        if (video.paused) {
          video.play()
          icon.setAttribute('xlink:href', ICON_PAUSE)
          video.removeAttribute('videoPausedByUser')
        } else {
          video.pause()
          icon.setAttribute('xlink:href', ICON_PLAY)
          video.setAttribute('videoPausedByUser', 'true')
        }
      }
      if (button.classList.contains('ac-toggle-sound') || button.matches('#ac-toggle-sound')) {
        video.muted = !video.muted
        icon.setAttribute('xlink:href', video.muted ? ICON_MUTE : ICON_UNMUTE)
        button.setAttribute('aria-pressed', video.muted ? 'true' : 'false')
        button.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute')
      }
    }
  }

  // Listeners
  video.classList.add('initialized')
  videoPlayButton?.addEventListener('click', onClick)
  video?.addEventListener('ended', onEnded)
  video?.addEventListener('play', onVideoStateToggle)
  video?.addEventListener('pause', onVideoStateToggle)
  togglePlayback?.addEventListener('click', onClick)
  togglePlayback?.addEventListener('keydown', onKeyDown)
  togglePlayback?.addEventListener('keyup', onKeyUp)
  toggleSound?.addEventListener('click', onClick)
  toggleSound?.addEventListener('keydown', onKeyDown)
  toggleSound?.addEventListener('keyup', onKeyUp)
  const cleanUpSplideVideos = splideVideoHandler()
  let cleanUp = () => {}
  if (isSplideSlide) {
    item.classList.add('insideSplideSlide')
    cleanUp = () => item.classList.remove('insideSplideSlide')
  }
  return () => {
    cleanUp()
    cleanUpSplideVideos()
    video.classList.remove('initialized')
    video?.removeEventListener('ended', onEnded)
    video?.removeEventListener('play', onVideoStateToggle)
    video?.removeEventListener('pause', onVideoStateToggle)
    togglePlayback?.removeEventListener('click', onClick)
    togglePlayback?.removeEventListener('keydown', onKeyDown)
    togglePlayback?.removeEventListener('keyup', onKeyUp)
    toggleSound?.removeEventListener('click', onClick)
    toggleSound?.removeEventListener('keydown', onKeyDown)
    toggleSound?.removeEventListener('keyup', onKeyUp)
    videoPlayButton?.removeEventListener('click', onClick)
  }
}

export const splideSliderValidateClonedSlides = (isDesktop = false) => {
  const slides = [...document.querySelectorAll('.splide__slide--clone')]
  slides.forEach((slide) => {
    const video = slide.querySelector('video:not([src]):not([data-loading])')
    if (video) {
      const videoSrcToPlay = isDesktop
        ? video.getAttribute('data-desktop-video-src')
        : video.getAttribute('data-mobile-video-src')
      const videoPosterToPlay =
        (isDesktop
          ? video.getAttribute('data-desktop-poster-src')
          : video.getAttribute('data-mobile-poster-src')) || video.getAttribute('data-poster')
      if (videoSrcToPlay) {
        video.src = videoSrcToPlay
      }
      if (videoPosterToPlay) {
        video.poster = videoPosterToPlay
      }
    }
  })
}

export const onViewportChangeHandler = (isDesktop) => {
  windowResizeVideo(isDesktop)
  productsDrawerInit()
}

let scrollMediaListener = null

export const addMediaAssetListeners = (isDesktop) => {
  productsDrawerInit()
  if (scrollMediaListener) {
    window.removeEventListener('scroll', scrollMediaListener)
  }
  scrollMediaListener = () => autoplayVideoOnViewFold(isDesktop)
  window.addEventListener('scroll', scrollMediaListener)
}

export const removeMediaAssetListeners = () => {
  window.removeEventListener('scroll', scrollMediaListener)
  scrollMediaListener = null
  productsDrawerInitListenersArr.forEach((fn) => fn())
  shortsVideoControllerListeners?.forEach(({ element, eventType, handler }) => {
    element?.removeEventListener(eventType, handler)
  })
  shortsVideoControllerListeners.length = 0
}

export const useMediaAssets = (onClickCmsAnalytics) => {
  const { isDesktop } = useViewportType()
  const [node, setNode] = useState(null)
  useEffect(() => {
    const cleanupVideoPlayerEvents = videoPlayerEventsInit(node)
    const cleanupVideoPlayMuteInit = videoPlayMuteInit(node, isDesktop, onClickCmsAnalytics)
    const cleanupVideoDisableRightClick = videoDisableRightClick(node)
    const cleanupSplideSliderClonedSlides = splideSliderValidateClonedSlides(isDesktop)
    return () => {
      cleanupVideoPlayerEvents?.()
      cleanupVideoPlayMuteInit?.()
      cleanupVideoDisableRightClick?.()
      cleanupSplideSliderClonedSlides?.()
    }
  }, [node?.getElementsByTagName('*')?.length])
  return setNode
}

export const infinityScroll = (node) => {
  const infinityCarouselContainers = node.querySelectorAll('.carousel-view-infinite')
  infinityCarouselContainers?.forEach((infinityCarouselContainer) =>
    infinityScrollHadler(infinityCarouselContainer, '.at-media-tile')
  )
  const carouselContainers = node.querySelectorAll('.product-tile-slider')
  carouselContainers?.forEach((carouselContainer) => {
    try {
      const config = JSON.parse(carouselContainer.getAttribute('data-config'))
      const isInfinite = get(config, 'responsive[0].settings.infinite', false)
      if (isInfinite) {
        infinityScrollHadler(carouselContainer, '.product-slide')
      }
    } catch (e) {
      console.error('Error parsing carousel config')
    }
  })

  const closeButtons = [...node.querySelectorAll('.media-tiles-container button.modal-close-btn')]
  closeButtons.forEach((button) => {
    button.setAttribute('tabindex', '-1')
  })
}

const infinityScrollHadler = (infinityCarouselContainer, tileClass) => {
  const carouselTiles = Array.from(infinityCarouselContainer.querySelectorAll(tileClass))
  const paddingLeft = parseInt(window.getComputedStyle(infinityCarouselContainer).paddingLeft)
  const paddingRight = parseInt(window.getComputedStyle(infinityCarouselContainer).paddingRight)
  const carouselTilesWidth =
    carouselTiles.reduce(
      (accumulator, currentValue) =>
        accumulator +
        currentValue.getBoundingClientRect().width +
        parseInt(window.getComputedStyle(currentValue).marginRight),
      0
    ) + (parseInt(window.getComputedStyle(carouselTiles[0]).marginLeft) || 0)
  const scrollDelta = parseInt(
    carouselTilesWidth - (infinityCarouselContainer.offsetWidth - paddingLeft - paddingRight)
  )
  infinityCarouselContainer.scrollLeft = 2
  const onCarouselScroll = () => {
    if (infinityCarouselContainer.scrollLeft === 0) {
      infinityCarouselContainer.scrollLeft = scrollDelta - 5
      return
    }
    if (infinityCarouselContainer.scrollLeft >= scrollDelta) {
      infinityCarouselContainer.scrollLeft = 1
      return
    }
  }
  infinityCarouselContainer.addEventListener(eventTypes.scroll, onCarouselScroll)
  shortsVideoControllerListeners.push({
    element: infinityCarouselContainer,
    eventType: eventTypes.scroll,
    handler: onCarouselScroll,
  })
}

const shortsVideoModalToInitialState = (shortVideoModal, videosListAssets) => {
  modalShortVideoIsReadyToPlay = false
  videosListAssets.forEach((videosListAsset) => {
    videosListAsset.classList.remove('hide-video')
  })
  shortVideoModal.classList.remove('show')
  toggleBodyScroll(true)
}

export const shortsVideoControl = (isDesktop) => {
  if (isDesktop) {
    document?.querySelector('.sm-modal')?.remove()
  } else {
    document.querySelector('.lg-modal')?.remove()
  }
  const molShortsVideos = document.querySelectorAll(
    '.mol-shorts-video:not(.shorts-initialized), .mol-cloud-animation:not(.shorts-initialized)'
  )
  if (!molShortsVideos.length) return

  let shortVideosCleanUpEvents = []
  const cleanUpEvents = () => {
    shortVideosCleanUpEvents.forEach((cleanUp) => cleanUp?.())
    shortVideosCleanUpEvents = []
    videoRetentionToPlay = true
    const allVideos = document.querySelectorAll(
      '.mol-shorts-video video, .mol-cloud-animation video'
    )
    allVideos.forEach((video) => {
      delete video.dataset.muteInitialized
    })
  }

  const getShortVideoControls = (shortVideoAsset) => {
    if (!shortVideoAsset) return {}

    const video = shortVideoAsset.querySelector('video')

    if (!video) return {}

    const togglePlayButton = shortVideoAsset.querySelector('.ac-video-controls .ac-toggle-playback')
    const playIconUse = togglePlayButton?.querySelector('use')
    const toggleSoundButton = shortVideoAsset.querySelector('.ac-video-controls .ac-toggle-sound')
    const muteIconUse = toggleSoundButton?.querySelector('use')
    const videoProgressBar = shortVideoAsset.querySelector('.video-progress-filled')
    shortVideosCleanUpEvents.push(
      observe(shortVideoAsset, debounce(handleVideoModalView, 300), videoModalViewOptions)
    )
    return {
      video,
      togglePlayButton,
      playIconUse,
      toggleSoundButton,
      muteIconUse,
      videoProgressBar,
    }
  }

  const onPlayVideo = (videoIndex, videosListAssets, skipScroll = false) => {
    videosListAssets.forEach((videoAsset, videoAssetIndex) => {
      const { video, playIconUse, muteIconUse } = getShortVideoControls(videoAsset)
      if (videoIndex === videoAssetIndex) {
        initializeVideoMuteState(video, muteIconUse)
        video.play()
        playSuspendedVideo(video, video.play)
        playIconUse?.setAttribute('xlink:href', ICON_PAUSE)
        if (!skipScroll) {
          video.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        video.pause()
        playIconUse?.setAttribute('xlink:href', ICON_PLAY)
      }
    })
  }

  const handleShortVideo = (videoIndex, videosListAssets, shortVideoModal, autoPlay = false) => {
    const {
      video,
      togglePlayButton,
      playIconUse,
      toggleSoundButton,
      muteIconUse,
      videoProgressBar,
    } = getShortVideoControls(videosListAssets?.[videoIndex])

    if (!video) return

    const togglePlay = (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (video.paused) {
        videoRetentionToPlay = true
        onPlayVideo(videoIndex, videosListAssets, true)
        video.removeAttribute('videoPausedByUser')
      } else {
        videoRetentionToPlay = false
        video.pause()
        playIconUse?.setAttribute('xlink:href', ICON_PLAY)
        video.setAttribute('videoPausedByUser', 'true')
      }
    }
    const toggleSound = (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (video.muted) {
        video.removeAttribute('muted')
        video.muted = false
        muteIconUse?.setAttribute('xlink:href', ICON_UNMUTE)
      } else {
        video.setAttribute('muted', true)
        video.muted = true
        muteIconUse?.setAttribute('xlink:href', ICON_MUTE)
      }
    }

    togglePlayButton?.addEventListener('click', togglePlay)
    toggleSoundButton?.addEventListener('click', toggleSound)

    if (!videoProgressBar) {
      return
    }
    videoProgressBar.style.width = 0
    const setProgress = (event) => {
      event.target.loop = false
      const progress = (event.target?.currentTime / event.target?.duration) * 100
      videoProgressBar.style.width = `${progress}%`
      if (!modalShortVideoIsReadyToPlay) {
        video.removeEventListener('timeupdate', setProgress)
        videoProgressBar.style.width = 0
        event.target?.pause()
        event.target.currentTime = 0
      }
    }
    video.addEventListener('timeupdate', setProgress)
    if (!autoPlay) {
      playIconUse?.setAttribute('xlink:href', ICON_PLAY)
    } else {
      initializeVideoMuteState(video, muteIconUse)
      playIconUse?.setAttribute('xlink:href', ICON_PAUSE)
      video.oncanplay = () => {
        if (shortVideoModal?.classList?.contains('show')) video.play()
      }
      video.scrollIntoView({ behavior: 'smooth' })
    }

    const videosLength = videosListAssets?.length
    if (!modalShortVideoIsReadyToPlay || !videosLength) {
      return
    }
    video.addEventListener(
      'ended',
      () => {
        video.removeEventListener('timeupdate', setProgress)
        const nextVideoIndex = videoIndex + 1
        if (nextVideoIndex === videosLength || !modalShortVideoIsReadyToPlay) {
          shortsVideoModalToInitialState(shortVideoModal, videosListAssets)
          cleanUpEvents()
        }
        if (nextVideoIndex < videosLength && modalShortVideoIsReadyToPlay) {
          onPlayVideo(nextVideoIndex, videosListAssets)
        }
      },
      { once: true }
    )
    return () => {
      togglePlayButton?.removeEventListener('click', togglePlay)
      toggleSoundButton?.removeEventListener('click', toggleSound)
    }
  }

  const setupShortsVideoStrip = (activeVideoIndex, shortVideoModal, videosListAssets) => {
    videosListAssets?.forEach((_videoAsset, videoAssetIndex) => {
      const cleanUpFn = handleShortVideo(
        videoAssetIndex,
        videosListAssets,
        shortVideoModal,
        videoAssetIndex === activeVideoIndex
      )
      shortVideosCleanUpEvents.push(cleanUpFn)
    })
  }

  const openShortsVideosModal = (activeVideoIndex, shortVideoModal, videosListAssets) => {
    if (!shortVideoModal) {
      return
    }
    cleanUpEvents()
    modalShortVideoIsReadyToPlay = true

    const isInitiallyHidden = shortVideoModal.style.display !== 'block'
    if (isInitiallyHidden) {
      shortVideoModal.style.display = 'block'
      requestAnimationFrame(() => {
        shortVideoModal.classList.add('show')
      })
    } else {
      shortVideoModal.classList.add('show')
    }

    toggleBodyScroll(false)
    setTimeout(
      () => setupShortsVideoStrip(activeVideoIndex, shortVideoModal, videosListAssets),
      100
    )
  }

  molShortsVideos?.forEach((shortsVideo) => {
    const shortVideoModal = shortsVideo?.querySelector('.amp-modal-wrapper')
    if (!shortsVideo) {
      return
    }
    const videosListAssets = shortVideoModal?.querySelectorAll('.at-media-asset')
    const shortVideoPlayWrapper = shortsVideo?.querySelectorAll('.short-video-play-wrapper')
    const modalCloseBtns = shortVideoModal?.querySelectorAll('.modal-close-btn.close')

    if (!isDesktop) {
      shortVideoPlayWrapper?.forEach((shortVideoPlayBtn, videoIndex) => {
        const videoSlide = shortVideoPlayBtn.closest('.splide__slide')
        let shortVideoIndex
        if (videoSlide) {
          const cardIndex = videoSlide.getAttribute('card')
          shortVideoIndex = cardIndex ? Number(cardIndex) : videoIndex
        }
        const onOpenShortsVideosModal = (e) => {
          e.preventDefault()
          e.stopPropagation()
          openShortsVideosModal(shortVideoIndex, shortVideoModal, videosListAssets)
        }
        shortVideoPlayBtn.addEventListener(eventTypes.click, onOpenShortsVideosModal)
        shortsVideoControllerListeners.push({
          element: shortVideoPlayBtn,
          eventType: eventTypes.click,
          handler: onOpenShortsVideosModal,
        })
      })
    }
    modalCloseBtns?.forEach((btn) => {
      const onCloseModalEvent = () => {
        shortsVideoModalToInitialState(shortVideoModal, videosListAssets)
        cleanUpEvents()
      }
      btn.addEventListener(eventTypes.click, onCloseModalEvent)
      shortsVideoControllerListeners.push({
        element: btn,
        eventType: eventTypes.click,
        handler: onCloseModalEvent,
      })
    })
    !isDesktop && shortsVideo?.classList.add('shorts-initialized')
  })
}

// ShortsDesktop Video handlers
const getShortsNodes = (shortsBlock) => {
  const video = shortsBlock.querySelector('.ac-video')
  const container = shortsBlock.closest('.mol-shorts-video, .mol-cloud-animation')
  const shortsVideoModal = container.querySelector('.amp-modal-wrapper')
  const bottomTextElement = shortsBlock.querySelector('.media-tile-text-block')
  const upperTextElement = shortsBlock.querySelector('.media-badge-text')
  const videoControls = shortsBlock.querySelector('.ac-video-controls')
  const videoStatus = video.getAttribute('videoPausedByUser')
  const shortsMainContainer = shortsBlock?.closest('.mol-shorts-video, .mol-cloud-animation')
  const globalAutoPlayMode = shortsMainContainer.getAttribute('autoplay') === 'true'

  return {
    video,
    shortsVideoModal,
    bottomTextElement,
    upperTextElement,
    videoControls,
    videoStatus,
    globalAutoPlayMode,
  }
}

export const mainDesktopShortsVideoHandler = (isDesktop, onClickCmsAnalytics) => {
  if (!isDesktop) return
  const molShortsVideos = document.querySelectorAll(
    '.mol-shorts-video:not(.shorts-initialized), .mol-cloud-animation:not(.shorts-initialized)'
  )
  if (!molShortsVideos.length) return

  let modalIsOpen = false
  const callbacks = []
  const playVideoOnHoverHandler = (event, deboucePlayVideoHandler, startWithDelay) => {
    const {
      video,
      shortsVideoModal,
      bottomTextElement,
      upperTextElement,
      videoControls,
      videoStatus,
      globalAutoPlayMode,
    } = getShortsNodes(event.currentTarget)
    const isShortsModalOpen = shortsVideoModal?.classList.contains('modal-open')
    if (!video || isShortsModalOpen) return
    if (startWithDelay) {
      deboucePlayVideoHandler({
        video,
        bottomTextElement,
        upperTextElement,
        videoControls,
        globalAutoPlayMode,
      })
      return
    }
    if (globalAutoPlayMode) {
      upperTextElement?.classList.add('d-none')
    }
    videoControls?.classList.add('d-block', 'controls-width')

    if (!videoStatus && globalAutoPlayMode) {
      video?.play()
      const soundIcon = videoControls?.querySelector('.ac-toggle-sound use')
      initializeVideoMuteState(video, soundIcon)
    }
  }

  const pauseVideoOnHoverHandler = (event, deboucePlayVideoHandler) => {
    const { video, shortsVideoModal, upperTextElement, videoControls } = getShortsNodes(
      event.currentTarget
    )
    const isShortsModalOpen = shortsVideoModal?.classList.contains('modal-open')
    if (!video || isShortsModalOpen) return
    upperTextElement?.classList.remove('d-none')
    videoControls?.classList.remove('d-block')
    video.pause?.()
    deboucePlayVideoHandler.cancel()
  }

  const addEventsForVideoControls = (item, onClickCmsAnalytics) => {
    const video = item.querySelector('.ac-video')
    if (!video || video.classList.contains('initialized')) return () => {}
    const togglePlayback = item.querySelector('#ac-toggle-playback, .ac-toggle-playback')
    const toggleSound = item.querySelector('#ac-toggle-sound, .ac-toggle-sound')
    const mainContainer = item.closest('.mol-shorts-video, .mol-cloud-animation')
    const allPlayControlsList = mainContainer.querySelectorAll('.ac-toggle-playback > svg > use')
    const allVideosList = mainContainer.querySelectorAll('.ac-video')
    const isShortsInModal = item.closest('.amp-modal-wrapper')
    const handleGlobalAutoPlayMode = (value) => {
      mainContainer.setAttribute('autoplay', value)
      allVideosList.forEach((video) => {
        video.removeAttribute('videoPausedByUser')
      })
      allPlayControlsList.forEach((control) => {
        control.setAttribute('xlink:href', value === 'true' ? ICON_PAUSE : ICON_PLAY)
      })
    }

    function onClick(event) {
      event.stopPropagation()
      event.preventDefault()
      onClickCmsAnalytics?.(event)
      isDesktop && toggleState(event.currentTarget, event)
    }

    function toggleState(button, e) {
      const isAriaPressed = button.getAttribute('aria-pressed') === 'true'
      e.preventDefault()
      button.setAttribute('aria-pressed', isAriaPressed ? false : true)
      const video = button.closest('.at-media-asset').querySelector('.ac-video')
      const icon = button.querySelector('use')
      const upperTextElement = button
        .closest('.amp-video-wrapper')
        .querySelector('.media-badge-text')
      if (
        button.classList.contains('ac-toggle-playback') ||
        button.matches('#ac-toggle-playback')
      ) {
        if (video.paused) {
          video.play()
          icon.setAttribute('xlink:href', ICON_PAUSE)
          handleGlobalAutoPlayMode('true')
          video.removeAttribute('videoPausedByUser')
        } else {
          video.pause()
          if (!isShortsInModal) {
            upperTextElement?.classList.remove('d-none')
          }
          icon.setAttribute('xlink:href', ICON_PLAY)
          handleGlobalAutoPlayMode('false')
          video.setAttribute('videoPausedByUser', 'true')
        }
      }
      if (button.classList.contains('ac-toggle-sound') || button.matches('#ac-toggle-sound')) {
        video.muted = !video.muted
        const videoBlockId = getVideoBlockId(
          video.closest('.mol-shorts-video, .mol-cloud-animation')
        )
        shortsContainerList[videoBlockId].muted = video.muted
        icon.setAttribute('xlink:href', video.muted ? ICON_MUTE : ICON_UNMUTE)
      }
    }

    video.classList.add('initialized')
    togglePlayback?.addEventListener('click', onClick)
    toggleSound?.addEventListener('click', onClick)

    return () => {
      video.classList.remove('initialized')
      togglePlayback?.removeEventListener('click', onClick)
      toggleSound?.removeEventListener('click', onClick)
    }
  }

  molShortsVideos?.forEach((shortsContainer) => {
    const videoBlockId = getVideoBlockId(shortsContainer)
    shortsContainerList[videoBlockId] = { muted: true }

    shortsContainer.setAttribute('autoplay', 'true')
    const delay = shortsContainer.getAttribute('delay') || 200
    const shorts = Array.from(shortsContainer?.querySelectorAll('.at-media-tile'))
    const shortsVideoModal = shortsContainer.querySelector('.amp-modal-wrapper')
    const splideContainerId = shortsVideoModal?.id || 'shortVideoModal'
    const isShortVideo = shortsContainer
      ?.closest('.amp-coachtopia')
      .classList?.contains('mol-shorts-video')

    const openModal = (video, itemIndex) => {
      modalIsOpen = true
      video?.pause()
      const isGlobalPlayMode = shortsContainer.getAttribute('autoplay') === 'true'
      const videoCurrentTime = video.currentTime
      shortsVideoModal?.classList.add('modal-open')
      shortsVideoModal.style.display = ''
      const desktopModal = shortsVideoModal?.querySelector('.lg-modal')
      const modalShorts = desktopModal?.querySelectorAll('.at-media-tile')
      const videoList = Array.from(desktopModal?.querySelectorAll('.ac-video'))

      modalShorts.forEach((shorts) => {
        const modalVideo = shorts.querySelector('.ac-video')
        const modalVideoControls = shorts.querySelector('.ac-video-controls')
        const modalCloseBtn = shorts.querySelector('.modal-close-btn')
        const handleModalControls = shorts.querySelector('.short-video-modal-btn')
        const controleElements = handleModalControls?.querySelectorAll('svg') || {}
        const modalIcons = Array.from(controleElements)
        const [openModalBtn, minimizeIcon] = modalIcons
        const isSplide = shortsVideoModal
          ?.querySelector('.splide__list')
          ?.hasAttribute('data-config')

        modalVideoControls?.classList.add('d-block')
        if (modalVideo && isShortVideo) {
          modalVideo.loop = false
        }
        if (!modalVideo?.hasAttribute('ended-listener')) {
          modalVideo?.addEventListener('ended', () => {
            goToNextSplideSlide(splideContainerId)
          })
          modalVideo.setAttribute('ended-listener', true)
        }
        openModalBtn?.classList.add('d-none')
        minimizeIcon?.classList.add('d-block')
        minimizeIcon?.querySelector('use').classList.add('d-block')
        if (!isSplide) {
          minimizeIcon?.addEventListener('click', () => closeModal(modalVideo, video))
          modalCloseBtn.addEventListener('click', () => closeModal(modalVideo, video))
        }
      })

      if (itemIndex >= modalShorts.length) itemIndex -= modalShorts.length
      const callbackFunction = triggerSplideCalculation(splideContainerId, itemIndex)
      if (callbackFunction) {
        callbacks.push(callbackFunction)
      }
      if (Array.isArray(videoList) && videoList[itemIndex]) {
        const video = videoList[itemIndex]
        videoList[itemIndex].currentTime = videoCurrentTime
        videoList[itemIndex].oncanplay = () => {
          if (isGlobalPlayMode) videoList[itemIndex]?.play?.()
        }
        const acVideoСontainer = video.closest('.ac-video-container')
        const soundIcon = acVideoСontainer?.querySelector('.icon-volumn > use')
        initializeVideoMuteState(video, soundIcon)
      }
    }

    const closeModal = (modalVideo, video) => {
      modalIsOpen = false
      const videoPause = video.getAttribute('videoPausedByUser')
      const modalVideoPause = modalVideo.getAttribute('videoPausedByUser')
      if (!isShortVideo && !videoPause && !modalVideoPause) video?.play()
      if (modalVideo) modalVideo.pause?.()
      shortsVideoModal.style.display = 'none'
      shortsVideoModal.classList.remove('modal-open')
    }

    shorts.map((controlItem) => addEventsForVideoControls(controlItem, onClickCmsAnalytics))
    shorts?.forEach((shortsBlock, index) => {
      let startWithDelay = true
      const video = shortsBlock.querySelector('.ac-video')
      const isShorts = video?.closest('.mol-shorts-video')
      const videoProgressBar = shortsBlock.querySelector('.video-progress-filled')
      const modalOpenIcon = shortsBlock.querySelector('.icon-modal-open')
      const headerLinks = Array.from(shortsBlock.querySelectorAll('.links-container a'))
      const deboucePlayVideoHandler = debounce(
        ({ video, upperTextElement, videoControls, globalAutoPlayMode }) => {
          videoControls?.classList.add('d-block', 'controls-width')
          if (globalAutoPlayMode) {
            upperTextElement?.classList.add('d-none')
            video.play()
          }
          const soundIcon = videoControls?.querySelector('.ac-toggle-sound use')
          initializeVideoMuteState(video, soundIcon)
          startWithDelay = false
        },
        delay
      )

      const onModalOpenIconListener = (event) => {
        event.preventDefault()
        event.stopPropagation()
        openModal(video, index)
      }
      modalOpenIcon?.addEventListener(eventTypes.click, onModalOpenIconListener)
      shortsVideoControllerListeners.push({
        element: modalOpenIcon,
        eventType: eventTypes.click,
        handler: onModalOpenIconListener,
      })

      if (!videoProgressBar) return
      videoProgressBar.style.width = 0

      const setProgressBar = (event) => {
        if (modalIsOpen && isShorts) event.target.loop = false
        setInterval(() => {
          const progress = (event.target?.currentTime / event.target?.duration) * 100
          videoProgressBar.style.width = `${progress}%`
        }, 50)
      }

      video.addEventListener(eventTypes.timeupdate, setProgressBar)
      shortsVideoControllerListeners.push({
        element: video,
        eventType: eventTypes.timeupdate,
        handler: setProgressBar,
      })

      if (isShortVideo) {
        const onShortsBlockMouseoverListener = (event) =>
          playVideoOnHoverHandler(event, deboucePlayVideoHandler, startWithDelay)
        shortsBlock?.addEventListener(eventTypes.mouseover, onShortsBlockMouseoverListener)
        shortsVideoControllerListeners.push({
          element: shortsBlock,
          eventType: eventTypes.mouseover,
          handler: onShortsBlockMouseoverListener,
        })

        const onShortsBlockMouseoutListener = (event) =>
          pauseVideoOnHoverHandler(event, deboucePlayVideoHandler)
        const shortsBlockMouseoutListener = shortsBlock?.addEventListener(
          eventTypes.mouseout,
          onShortsBlockMouseoutListener
        )
        shortsVideoControllerListeners.push({
          element: shortsBlock,
          eventType: eventTypes.mouseout,
          handler: shortsBlockMouseoutListener,
        })

        if (headerLinks.length) {
          headerLinks.forEach((headerLink) => {
            headerLink.addEventListener(eventTypes.click, stopPropagationOnClick)
            shortsVideoControllerListeners.push({
              element: headerLink,
              eventType: eventTypes.click,
              handler: stopPropagationOnClick,
            })
          })
        }
      }
    })
    shortsContainer?.classList.add('shorts-initialized')
  })
  return callbacks
}
