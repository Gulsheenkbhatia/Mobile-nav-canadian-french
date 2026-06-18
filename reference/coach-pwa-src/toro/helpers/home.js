import get from 'lodash/get'
import { CONTAINER_ID } from 'toro/constants/appConstants'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import { nextVideoMuted, playSuspendedVideo } from 'toro/helpers/mediaAssets'
import lazyLoadImages from 'toro/helpers/lazyLoadImages'
import lazyLoadVideos from 'toro/helpers/lazyLoadVideos'
import isMobileDevice from 'toro/helpers/isMobileDevice'

export const INIT_CALLBACK_NAME = 'mw_onHomePageInit'
export const INIT_CALLBACK_NAME_TOP_SLOT = 'mw_onPLPInit'
export const INIT_CALLBACK_NAME_PASSPORT = 'mw_onPassportPageInit'

export function getCarouselArrowSvg(direction) {
  return `
    <div class="arrow__${direction}">
      <svg viewBox="0 0 24 24">
        <use href="#icon-nav-chevron-${direction}" />
      </svg>
    </div>
  `
}

export function getStarSvg(id) {
  if (id === 'cm_icon_pt_rs_filled') {
    return `<use href="#icon-review-star-filled" />`
  } else if (id === 'cm_icon_pt_rs_blank') {
    return `<use href="#icon-nav-chevron-blank" />`
  } else if (id === 'cm_icon_pt_rs_half') {
    return `<use href="#icon-review-star-half" />`
  } else {
    return null
  }
}

export function getChevronIcon(direction) {
  return `
    <svg class="icon">
      <use href="#icon-nav-chevron-${direction}" />
    </svg>
  `
}

export function findResourceUrlInHtml(html, filename = '') {
  if (!html) {
    return null
  }

  filename = filename.replace('.', '\\.')
  const regex = new RegExp(`\/(.*?)${filename}`, 'g')
  const match = html.match(regex)
  return get(match, '0')
}

const loaderTemplate = `<div class="loader"><div class="underlay"></div><div class="spinner"><div></div><div></div><div></div><div></div></div></div>`
export const splideControllers = {}
const toggleLoader = (loaderContainerElement, stopLoader) => {
  if (stopLoader) {
    loaderContainerElement.removeClass('position-relative')
    const loader = loaderContainerElement.find('.loader')
    loader.remove()
  } else {
    loaderContainerElement.addClass('position-relative')
    loaderContainerElement.append(loaderTemplate)
  }
}

const updateProductLinks = (titleElement, ratingsElement, linkUrl) => {
  if (!linkUrl) return
  if (titleElement.length) {
    titleElement[0].href = linkUrl
  }
  if (ratingsElement.length) {
    try {
      const url = new URL(linkUrl, window.location.origin)
      url.searchParams.set('scrollToReview', 'true')
      ratingsElement[0].href = url.href
    } catch (error) {
      console.log('Invalid ratings link URL:', error)
    }
  }
}

const applyNewData = (newData, productContainer) => {
  try {
    if (!newData || !productContainer) return
    const { context } = newData
    if (!context) return
    const imageElement = productContainer.find('.product-tile__img-wrapper')
    const priceElement = productContainer.find('.product-tile__price')
    const atbElement = productContainer.find('[data-show-atb="true"]')[0]
    const titleLinkElement = productContainer.find('.product-tile__title a')
    const ratingsLinkElement = productContainer.find('.product-tile__ratings a')
    const promoCalloutElement = productContainer.find('.product-tile__price-promo-callout')

    const imageComponentHtml = get(context, 'imageComponentHtml', '')
    const priceComponentHtml = get(context, 'priceComponentHtml', '')
    const productUrl = get(context, 'urls.product', '')
    const medium = get(context, 'product.images.medium', [])
    const small = get(context, 'product.images.small', [])
    const LowerPlacement = get(context, 'product.badges.LowerPlacement', [])

    const sanitizedImageHtml = sanitizeHtmlMarkup(imageComponentHtml)
    const sanitizedPriceHtml = sanitizeHtmlMarkup(priceComponentHtml)
    const sanitizedLinkUrl = sanitizeHtmlMarkup(productUrl)
    const sanitizedPromoCallout = sanitizeHtmlMarkup(get(LowerPlacement, '[0].badgeDisplay[0]', ''))
    const imageContainer = window.$(sanitizedImageHtml)[0]
    if (!imageContainer) return
    const isImgInImageElement = Boolean(imageContainer.querySelector('img'))

    let image
    if (!isImgInImageElement) {
      const imageExtenstionData = medium[0] || small[0] || {}
      image = document.createElement('img')
      image.setAttribute('src', imageExtenstionData.url)
      image.setAttribute('alt', imageExtenstionData.alt)
      image.setAttribute('title', imageExtenstionData.title)
      imageContainer.querySelector('picture').appendChild(image)
    }
    image.onload = function () {
      imageElement.replaceWith(imageContainer || sanitizedImageHtml)
      priceElement.html(sanitizedPriceHtml)
      promoCalloutElement.html(sanitizedPromoCallout)
      updateProductLinks(titleLinkElement, ratingsLinkElement, sanitizedLinkUrl)
    }
    if (atbElement) {
      const { pdpProdId: productId, product: productData } = context
      const { available, id: vgId } = productData || {}
      const productProps = { productId, available }
      productContainer.attr('data-wishlist-pid', vgId)
      atbElement.dispatchEvent(new CustomEvent('swatch-change', { detail: productProps }))
    }
  } catch (err) {
    console.log('error swatch change cms product tile', err)
  }
}

const handleSwatchClick = async (event) => {
  event.preventDefault()
  const $swatchesWrapper = window.$(event.currentTarget)
  const $swatch = window.$(event.target)
  const parentLinkElement = $swatch.parents('a')
  const url = parentLinkElement.attr('rel')
  if (!url) return
  const productContainer = $swatch.parents('.product-info')
  const additionalUrlParams = new URLSearchParams({
    swatchComponent: 'PLP_SWATCH',
    isComparablePriceValue: true,
    displayImg: false,
    imageComponent: 'AMPLIENCE_PLP_TILE',
  })
  const newProductDetailsUrl = `${url}&${additionalUrlParams.toString()}`
  try {
    $swatchesWrapper
      .find('.product-tile__swatch--selected')
      .removeClass('product-tile__swatch--selected')
    toggleLoader(productContainer)
    const result = await fetch(newProductDetailsUrl)
    const newProductData = await result.json()
    parentLinkElement.addClass('product-tile__swatch--selected')
    applyNewData(newProductData, productContainer)
  } catch (e) {
    console.error(e)
  } finally {
    toggleLoader(productContainer, true)
  }
}

const SPLIDE_CONTAINERS = ['short-video-modal', 'tab-pane', 'slider-container', 'mol-tabbed-slider']
const SPLIDE_EVENT_CONTAINERS = new Set(['mol-tabbed-slider', 'slider-container'])
export const addToSplideController = (SplideCarousel, mainSplide) => {
  SPLIDE_CONTAINERS.forEach((containerClass) => {
    const containerElement = mainSplide.closest(`.${containerClass}`)
    if (containerElement) {
      const id = containerElement.id || containerClass
      splideControllers[id] = {
        id,
        splide: SplideCarousel,
      }
      if (SPLIDE_EVENT_CONTAINERS.has(containerClass)) {
        document.dispatchEvent(new CustomEvent('splide:registered', { detail: { id } }))
      }
    }
  })
}

export const refreshSplideSlider = (containerId) => {
  const splideCarousel = splideControllers[containerId]?.splide
  splideCarousel?.refresh?.()
}

export function getIsConfigRequired(item, filterUsedInLink) {
  if (!item || !filterUsedInLink) {
    return false
  }
  const hasURLFilter = location.search.includes(filterUsedInLink)
  const allLinks = item?.querySelectorAll('.media-asset-wrapper a.at-media-asset') || []
  const tabContent = item.closest('.tab-pane')
  const isConfigEnabled = filterUsedInLink && hasURLFilter && allLinks.length && isMobileDevice()
  if (tabContent) {
    return tabContent.classList.contains('active') && isConfigEnabled
  }
  return isConfigEnabled
}

export function getLinkIndexWithMatchedFilterId(
  filterValue = '',
  filterUsedInLink = '',
  allLinks = []
) {
  let activeIndex = 0
  Array.from(allLinks).every((link, index) => {
    const filterValueToMatch = new URL(link?.href).searchParams.get(filterUsedInLink)
    if (filterValueToMatch?.toLowerCase() === filterValue?.toLowerCase()) {
      activeIndex = index
      return false
    }
    return true
  })
  return activeIndex
}

export function getClientSplideConfig(item) {
  let splideConfig = {}
  try {
    const filterUsedInLink = item.closest('.amp-page-acc .page-section')?.dataset?.linkQuery
    const isConfigRequired = getIsConfigRequired(item, filterUsedInLink)
    if (isConfigRequired) {
      const filterValue = new URLSearchParams(location.search)?.get(filterUsedInLink)
      const allLinksInCards = item?.querySelectorAll('.media-asset-wrapper a.at-media-asset') || []
      const activeIndex = getLinkIndexWithMatchedFilterId(
        filterValue,
        filterUsedInLink,
        allLinksInCards
      )
      splideConfig = { start: activeIndex }
    }
  } catch (err) {
    console.log(`Error in Init Client Splide Config ${err}`)
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return splideConfig
  }
}

export const initSplideSlider = (item, options = {}) => {
  const mainSplide = item.closest('.splide')
  try {
    const config = JSON.parse(item.dataset['config'])
    item.removeAttribute('data-config')
    const overrideSplideConfig = getClientSplideConfig(item)
    // eslint-disable-next-line no-undef
    const SplideCarousel = new Splide(mainSplide, { ...config, ...overrideSplideConfig }).mount()
    addToSplideController(SplideCarousel, mainSplide)
    lazyLoadImages(item, { showImmediately: !options.lazyLoadImages })
    if (options.lazyLoadVideos) {
      const viewport = isMobileDevice() ? 'mobile' : 'desktop'
      lazyLoadVideos(item, { viewport })
    }
    if (options.onSliderMove) {
      SplideCarousel.on('move', options.onSliderMove)
    }
  } catch (err) {
    mainSplide?.classList.add('splide-error')
    console.log(`Error in Init Splide Slider ${err}`)
  }
}

export const initSplideForSwatches = (item) => {
  const $item = window.$(item)
  const mainSplide = item.closest('.splide')
  const isCMSv3Tile = item.closest('.cms-product-tile-3')
  const isMobilePeekaboo = item.closest('.mobile-peekaboo')
  const MAX_SWATCH_LENGTH = 5
  try {
    const swatchData = item.dataset
    const mobileMaxSwatches = isCMSv3Tile ? MAX_SWATCH_LENGTH : +swatchData['mobileSliderLimit']
    const desktopMaxSwatches = isCMSv3Tile ? MAX_SWATCH_LENGTH : +swatchData['desktopSliderLimit']
    const totalSwatches = $item.find('.js-tile-swatch')?.length
    const isCarouselForDesktop = totalSwatches > desktopMaxSwatches
    const isCarouselForMobile = totalSwatches > mobileMaxSwatches
    const config = {
      arrows: isCarouselForDesktop,
      pagination: false,
      perPage: isCarouselForDesktop ? desktopMaxSwatches : totalSwatches,
      perMove: desktopMaxSwatches,
      start: 0,
      autoPlay: false,
      type: 'slide',
      drag: false,
      destroy: !isCarouselForDesktop,
      breakpoints: {
        769: {
          arrows: isCMSv3Tile && !isMobilePeekaboo ? false : isCarouselForMobile,
          destroy: !isCarouselForMobile,
          perPage: isCarouselForMobile ? mobileMaxSwatches : totalSwatches,
          perMove: mobileMaxSwatches,
          drag: isCMSv3Tile && !isMobilePeekaboo ? true : false,
        },
      },
    }
    // eslint-disable-next-line no-undef
    const splide = new Splide(mainSplide, config).mount()
    const checkNavigation = () => {
      const isNextAvailable = splide.index < splide.length - splide.options.perPage
      const isPrevAvailable = splide.index > 0

      if (isNextAvailable) {
        mainSplide.classList.add('right-fade')
      } else {
        mainSplide.classList.remove('right-fade')
      }

      if (isPrevAvailable) {
        mainSplide.classList.add('left-fade')
      } else {
        mainSplide.classList.remove('left-fade')
      }
      const visibleSlides = mainSplide.querySelectorAll('.splide__slide.is-visible')
      visibleSlides.forEach((slide) => {
        slide.classList.remove('last-visible-before-next')
        slide.classList.remove('first-visible-after-previous')
      })

      const lastVisibleSlide = visibleSlides[visibleSlides.length - 1]
      const firstVisibleSlide = visibleSlides[0]

      if (isNextAvailable) {
        lastVisibleSlide.classList.add('last-visible-before-next')
      }
      if (isPrevAvailable) {
        firstVisibleSlide.classList.add('first-visible-after-previous')
      }
    }

    checkNavigation()
    splide.on('moved', checkNavigation)
  } catch (err) {
    mainSplide?.classList?.add('splide-error')
    console.log(`Error in Init Splide Slider Swatches ${err}`)
  }
}

const initProductSwatchesClick = (item) => {
  const $item = window.$(item)
  const swatches = $item.find('.js-tile-swatch')

  swatches.each((_idx, swatchItem) => {
    if (swatchItem.href) {
      swatchItem.setAttribute('rel', swatchItem.href)
      swatchItem.removeAttribute('href')
    }
  })

  $item.on('click', handleSwatchClick)

  return () => {
    $item.off('click', handleSwatchClick)
  }
}

export const applyProductSwatchesClick = (id = CONTAINER_ID) => {
  if (!window.$) {
    return () => {}
  }
  const cleanups = []
  window.$(`#${id} .js-tile-swatch-wrapper`).each((_idx, item) => {
    const cleanup = initProductSwatchesClick(item)
    cleanups.push(cleanup)
  })
  return () => {
    cleanups.forEach((cleanup) => cleanup())
  }
}

const HIDDEN_CONTAINERS = ['.tab-pane']
const isElementLayoutVisible = (el) => {
  if (!el) return false
  const selector = HIDDEN_CONTAINERS.join(',')
  const container = el.closest(selector)
  if (
    container &&
    container.matches(HIDDEN_CONTAINERS[0]) &&
    !container.classList.contains('active')
  ) {
    return false
  }
  if (container && getComputedStyle(container).display === 'none') {
    return false
  }
  return true
}

export const applySplideSliders = (id = CONTAINER_ID) => {
  if (!window.Splide) {
    return
  }
  window.$(`#${id} div[data-config]`).each((_idx, item) => {
    if (item.classList.contains('splide__list')) {
      if (!isElementLayoutVisible(item)) return
      initSplideSlider(item, { lazyLoadImages: true })
    }
  })
  window.$(`.js-tile-swatch-wrapper`).each((_idx, item) => {
    initSplideForSwatches(item)
  })
}

export const applySplideSlidersForNode = (node, options) => {
  if (window?.Splide) {
    const $node = window.$(node)
    $node.find('div[data-config]').each((_idx, item) => {
      if (item.classList.contains('splide__list')) {
        if (!isElementLayoutVisible(item)) return
        initSplideSlider(item, options)
      }
    })
    $node.find(`.js-tile-swatch-wrapper`).each((_idx, item) => {
      if (item.classList.contains('splide__list')) {
        initSplideForSwatches(item, options)
      }
    })
  }
}

export const getNextSplideSlide = (containerIdName, nextSlideIndex) => {
  const splideContainer = document.querySelector(`#${containerIdName}`)?.querySelector('.lg-modal')
  const splideSlides = splideContainer?.querySelectorAll('.splide__slide')
  const nextSplideSlide = Array.from(splideSlides || [])?.find?.(
    (elem, index) => index === nextSlideIndex
  )

  return nextSplideSlide
}

export const triggerSplideCalculation = (container, index) => {
  const isSplideLoaded = !!get(window, 'Splide')
  if (!container || !isSplideLoaded) return
  const splideContainer = document.querySelector(`#${container}`)
  function changeSlideHandle(currentIndex, prevIndex) {
    if (currentIndex === prevIndex) return
    const splideMainContainer = splideContainer?.closest('.mol-shorts-video')
    const globalAutoPlayMode = splideMainContainer?.getAttribute('autoplay') === 'true'

    const currentSlideDom = getNextSplideSlide(container, prevIndex)
    const nextSlideDom = getNextSplideSlide(container, currentIndex)
    const currentSlideVideo = currentSlideDom.querySelector('video')
    const nextSlideVideo = nextSlideDom.querySelector('video')
    const nextSlidePlayControl = nextSlideDom.querySelector('.icon-play > use')
    nextSlidePlayControl?.setAttribute(
      'xlink:href',
      globalAutoPlayMode ? '#icon-video-pause' : '#icon-video-play'
    )
    currentSlideVideo.pause()
    const video = nextSlideVideo
    const playVideo = () => {
      if (globalAutoPlayMode) video.play()
      if (nextSlideVideo) nextVideoMuted(nextSlideVideo, nextSlideDom)
    }
    if (!video) {
      return
    }
    if (video.readyState === 4) {
      playVideo()
      playSuspendedVideo(video, playVideo)
    } else {
      if (video.paused) {
        playVideo()
      }
      video.oncanplay = () => {
        playVideo()
      }
    }
  }
  const splideController = splideControllers[container]
  const {
    Components: { Controller: splideSlideController = {} },
    event: splideEvent,
  } = splideController?.splide || {}
  splideSlideController?.go(index)
  splideEvent?.on('move', changeSlideHandle)
  return () => {
    splideEvent?.off('move')
    splideEvent?.destroy()
    delete splideControllers[container]
  }
}

export const goToNextSplideSlide = (container) => {
  const isSplideLoaded = !!get(window, 'Splide')
  if (!container || !isSplideLoaded) return
  const splideController = splideControllers[container]
  const { Controller: splideSlideController } = splideController?.splide?.Components || {}
  const nextSplideIndex = splideSlideController?.getNext()
  if (nextSplideIndex !== -1) {
    splideSlideController?.go(nextSplideIndex)
  }
}

export const splideVideoHandler = () => {
  const isSplideLoaded = !!get(window, 'Splide')
  const container = 'slider-container'
  if (!isSplideLoaded) return () => {}

  const getNextSlide = (nextSlideIndex) => {
    const splideContainer = document.querySelector(`.${container}`)
    const splideSlides = splideContainer?.querySelectorAll('.splide__slide')
    const nextSplideSlide = Array.from(splideSlides || [])?.find?.(
      (elem, index) => index === nextSlideIndex
    )

    return nextSplideSlide
  }

  function changeSlideHandle(currentIndex, prevIndex) {
    if (currentIndex === prevIndex) return

    const currentSlideDom = getNextSlide(prevIndex)
    const nextSlideDom = getNextSlide(currentIndex)
    const currentSlideVideo = currentSlideDom?.querySelector('video')
    const nextSlideVideo = nextSlideDom?.querySelector('video')

    // Pause the current video if it's playing
    if (currentSlideVideo && !currentSlideVideo.paused) {
      currentSlideVideo.pause()
      currentSlideVideo.dataset.userPaused = 'false'
    } else if (currentSlideVideo) {
      currentSlideVideo.dataset.userPaused = 'true'
    }

    // Play the next video if it has autoplay enabled and wasn't manually paused
    if (nextSlideVideo) {
      const wasAutoPaused = nextSlideVideo.dataset.userPaused === 'false'

      // Play if it was auto-paused or if it has the autoplay attribute/class
      if (
        wasAutoPaused ||
        nextSlideVideo.classList.contains('autoplay') ||
        nextSlideVideo.hasAttribute('autoplay')
      ) {
        nextSlideVideo.play()
      }
    }
  }

  const splideController = splideControllers[container]
  const { event: splideEvent } = splideController?.splide || {}
  splideEvent?.on('move', changeSlideHandle)

  return () => {
    splideEvent?.off('move')
    splideEvent?.destroy()
  }
}
