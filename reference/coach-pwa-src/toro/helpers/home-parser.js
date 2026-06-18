import { transformNativeCssScrollOnServer, addLazyLoadForSlides } from 'toro/cms/server/utils'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import restoreAtbPids from 'toro/helpers/restoreAtbPids'
import cheerio from 'toro/lib/cheerio'
import isEmpty from 'lodash/isEmpty'
import { DATA_ATB_SELECTOR } from 'toro/cms/constants'

function fillPictureTagsWithImg($, ignoreLazy = false) {
  const selector = ignoreLazy ? 'picture' : 'picture:not([data-loading="lazy"])'
  $(selector).each((idx, el) => {
    const $el = $(el)
    if ($el.find('img').length) {
      return
    }
    const $img = $('<img>')
    $img.attr('class', $el.data('class'))
    $img.attr('alt', $el.data('alt'))
    $el.append($img)
  })
}

function populateVideoSrc($, viewport = 'desktop', ignoreLazy = false) {
  $('video').each((idx, el) => {
    const $el = $(el)
    const isLazy = $el.is('[data-loading="lazy"]') && !ignoreLazy
    const isResponsive = $el.attr('data-desktop-video-src') && $el.attr('data-mobile-video-src')

    const poster = $el.attr(`data-${viewport}-poster-src`)
    if (poster) {
      $el.attr('poster', poster)
    }

    if (isLazy || isResponsive) {
      $el.attr('src', null)
      $el.find('source').attr('src', null)
      return
    }

    const src = $el.attr(`data-${viewport}-video-src`)

    if (src) {
      $el.attr('src', src)
      $el.find('source').attr('src', src)
    }
  })
}

function populateImageSrc($, ignoreLazy = false) {
  $('img[data-src]').each((idx, el) => {
    const $el = $(el)
    const isLazyLoading = $el.is('[data-loading="lazy"]')
    const currentSrc = $el.attr('src')

    if (isLazyLoading && !ignoreLazy) {
      currentSrc && $el.removeAttr('src')
    } else if (!currentSrc) {
      $el.attr('src', $el.data('src'))
    }
  })

  $('img[mi-src]').each((idx, el) => {
    const $el = $(el)
    $el.attr('src', $el.attr('mi-src'))
    $el.removeAttr('mi-src')
    $el.removeAttr('style')
  })
}

function lazyLoadCarouselAboveFold($, viewport) {
  const carousel = $(
    `.splide__list.non-lazy-carousel-${viewport}, .splide__list.non-lazy-carousel`
  ).first()

  $(`.splide__list.non-lazy-carousel-${viewport === 'mobile' ? 'desktop' : 'mobile'}`).remove()

  try {
    if (!carousel.length) {
      return
    }

    const cardsToShow = carousel.attr(`data-${viewport}-card-limit`)
    const slides = carousel.find('.splide__slide')

    if (cardsToShow) {
      slides.slice(cardsToShow).each((_, slide) => {
        addLazyLoadForSlides($(slide))
      })
      return
    }
    const nonLazySlides = carousel.attr(`data-slides-${viewport}`)
    const nonLazyIndexes = nonLazySlides && JSON.parse(nonLazySlides)
    if (!nonLazyIndexes?.length) {
      return
    }
    slides
      .filter((index) => !nonLazyIndexes.includes(index.toString()))
      .each((_, slide) => {
        addLazyLoadForSlides($(slide))
      })
  } catch (err) {
    console.log(err)
  }
}

function preparePanels($) {
  // TM-10110
  $('a[data-parent="#accordion"]').removeAttr('href')
  $('.panel-collapse').attr('style', 'display: none;')
}

export function hotspotsImage($, viewport) {
  const configAttr = viewport === 'desktop' ? 'data-desktop-config' : 'data-mobile-config'

  $('.mol-hotspots-image').each((idx, el) => {
    const $el = $(el)
    const hotspotsData = $el.find('.hotspots-data')
    if (!hotspotsData.length) return

    let hotspotsConfig = {}
    try {
      hotspotsConfig = JSON.parse(hotspotsData.attr(configAttr) || '{}')
    } catch (error) {
      console.error('JSON data not found for Hotspots:', error)
    }
    if (isEmpty(hotspotsConfig)) return

    const hotspotWrapper = $el.find('.hotspots-wrapper')

    hotspotsConfig.hotspots?.forEach((hotspot, index) => {
      // Hotspot Element
      const hotspotElement = $(
        `<div id="${hotspot?.id}" class="hotspot-icon" style="left: ${
          hotspot?.points?.x * 100
        }%; top: ${
          hotspot?.points?.y * 100
        }%" data-event="internal_promotion" data-creative-name="NO_IMAGE" data-location-id="hotspot" data-creative-slot="${
          index + 1
        }" ><svg class="icon" role="presentation"><use xlink:href="#icon-plus"></use></svg></div>`
      )
      hotspotWrapper.append(hotspotElement)
    })
  })
}

function injectAddToBagButtons($) {
  try {
    $(DATA_ATB_SELECTOR).each((idx, el) => {
      const $el = $(el)
      const productId = $el.attr('data-atb-pid')
      if (productId) {
        const addToBagButtonHtml = '<button data-server-portal="true">Add to Bag</button>'
        $el.html(addToBagButtonHtml)
      }
    })
  } catch (error) {
    console.error('Error in injectAddToBagButtons:', error)
  }
}

export const manageDealModuleSlots = (contentSlotData = '', isDealsModuleEnabled = false) => {
  if (!contentSlotData) return
  const $ = cheerio.load(contentSlotData)
  const dealsModule = $('div[data-offer-module="true"]')

  if (dealsModule?.length && !isDealsModuleEnabled) {
    dealsModule.each((_i, module) => {
      if (!!module) {
        const parent = $(module).parent()
        $(parent).remove()
      }
    })
  }
  return $.html()
}

export function transformLandingHtml(html = '', options = {}) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const sanitizedHtmlWithAtbPids = restoreAtbPids(html, sanitizedHtml)
  let $ = cheerio.load(sanitizedHtmlWithAtbPids)

  const { cut, viewport, ignoreLazy } = options
  if (cut) {
    const $cutEl = $(cut)
    $ = cheerio.load($.html($cutEl))
  }

  fillPictureTagsWithImg($, ignoreLazy)
  lazyLoadCarouselAboveFold($, viewport)
  populateImageSrc($, ignoreLazy)
  populateVideoSrc($, viewport, ignoreLazy)
  preparePanels($)
  transformNativeCssScrollOnServer($, viewport)
  hotspotsImage($, viewport)
  injectAddToBagButtons($)

  return $.html()
}

export function extractPromoSlots(html = '', options = {}) {
  let $ = cheerio.load(html)
  const { cut } = options
  const slotDataArr = []
  cut?.forEach((index) => {
    if (index) {
      const $cutEl = $(`#inline-promo-slot${index}`)
      const divSlot = $cutEl.html()
      slotDataArr.push(divSlot)
    }
  })

  return slotDataArr
}

export function extractSlotById(html = '', id = '') {
  let $ = cheerio.load(html)
  const slot = $.html(id)
  return slot
}
