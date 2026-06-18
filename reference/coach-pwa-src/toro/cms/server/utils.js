import get from 'lodash/get'
import cheerio from 'toro/lib/cheerio'
import { transformSfccUrl } from 'toro/cms/utils'

export const transformLinksOnServer = (html = '', state) => {
  const ocapiDomain = get(state, 'appData.ocapiDomain')
  const siteId = get(state, 'appData.siteId')
  if (!ocapiDomain || !siteId) {
    return html
  }

  const $ = cheerio.load(html)
  $(`a[href*="${ocapiDomain}"]`).each((idx, item) => {
    const $item = $(item)
    const url = new URL($item.attr('href'))
    if (url.hostname === ocapiDomain) {
      $item.attr('href', transformSfccUrl(url, siteId))
    }
  })

  $('img[data-loading=lazy], picture[data-loading=lazy] source').each((idx, item) => {
    const $item = $(item)
    const lazySrc = $item.attr('src') || $item.attr('srcset')
    if (lazySrc) {
      $item.attr('data-src', lazySrc)
      $item.attr('data-srcset', lazySrc)
      $item.removeAttr('src')
      $item.removeAttr('srcset')
    }
  })

  return $.html()
}

export const transformNativeCssScrollOnServer = ($) => {
  if (!$) return ''

  $('.product-tile-slider').each((_idx, el) => {
    let isCarousel = true
    const $el = $(el)

    try {
      const config = JSON.parse($el.attr('data-config'))
      const isMediaQuery = get(config, `mediaQuery`)
      const breakpoint = Object.keys(config?.breakpoints || {})[0]
      isCarousel = !(isMediaQuery
        ? get(config, `destroy`, false)
        : get(config, `breakpoints.${breakpoint}.destroy`, false))
    } catch (e) {
      console.error('Error parsing carousel config')
    }
    $el.addClass(isCarousel ? 'mob-carousel-items' : 'mob-grid-items')
  })

  return $.html()
}

export function addLazyLoadForSlides($slideEl) {
  const $picture = $slideEl.find('picture').first()

  if (!$picture.attr('data-loading')) {
    $picture.attr('data-loading', 'lazy')
    const $img = $picture.find('img').first()
    $picture.attr('data-class', $img.attr('class'))
    $picture.attr('data-alt', $img.attr('alt'))
    $picture.find('img').remove()
  }
}
