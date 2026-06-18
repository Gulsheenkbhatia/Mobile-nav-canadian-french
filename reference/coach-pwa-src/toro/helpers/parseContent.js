import cheerio from 'toro/lib/cheerio'
import { GLOBAL_CONTENT_SLOTS_IDS } from 'toro/constants/globalContentSlotIds'
import { CONTENT_SLOT_PARSER } from 'toro/cms/server/contentSlotsParser'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import uniqBy from 'lodash/uniqWith'
import { transformNativeCssScrollOnServer } from 'toro/cms/server/utils'
import { getClpRecommendationsConfig } from 'toro/helpers/recommendations'

const DEFAULT_VISIBLE_IMAGES = 4
const MAX_SEARCH_SUGGESTION_COUNT = 5

function topContentSetLazyImages($topContentSlot, $) {
  const $categories = $topContentSlot.find('.at-plp-filter-card')

  if ($categories?.length > DEFAULT_VISIBLE_IMAGES) {
    $categories.slice(DEFAULT_VISIBLE_IMAGES).map((i, categoryCard) => {
      const $categoryCard = $(categoryCard)
      const $imageSources = $categoryCard.find('source')

      $categoryCard.find('picture').attr('data-loading', 'lazy')
      $categoryCard.find('img').removeAttr('src')

      if ($imageSources?.length) {
        $imageSources.each((_index, source) => {
          const $source = $(source)
          const lazySrc = $source.attr('srcset')

          $source.attr('data-src', lazySrc)
          $source.attr('data-srcset', lazySrc)

          $source.removeAttr('srcset')
        })
      }
      return undefined
    })
  }
}

function topContentSetFetchPriority($topContentSlot, viewport) {
  $topContentSlot.find('img').attr('fetchpriority', 'low')
  $topContentSlot.find(`[data-${viewport}-lcp-image]`).find('img').attr('fetchpriority', 'high')
}

function removeViewportSpecificContent($, viewport) {
  if (viewport === 'mobile') {
    $('.for-desktop').remove()
  } else {
    $('.for-mobile').remove()
  }
}

export function topContentParser(html, { viewport = 'mobile' }) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)

  if (!sanitizedHtml) {
    return {}
  }

  const $ = cheerio.load(sanitizedHtml)

  removeViewportSpecificContent($, viewport)

  const $topContentSlot = $('#category_top_content_slot')

  if (viewport === 'mobile') {
    topContentSetLazyImages($topContentSlot, $)
  }
  topContentSetFetchPriority($topContentSlot, viewport)
  transformNativeCssScrollOnServer($, viewport)

  if (!$topContentSlot.html()?.trim()) {
    return {
      content: '',
      rawHtml: sanitizedHtml,
    }
  }

  $('#search-result-recommendation-block').remove()
  const content = cheerio.html($topContentSlot).trim()
  const containsCarousel = !!$topContentSlot.find('.product-tile-slider')?.length
  const hasVideo = !!$topContentSlot.find('.content-video').length

  return {
    content,
    containsCarousel,
    hasVideo,
    rawHtml: sanitizedHtml, // this is for the inline promos extraction
    clpRecommendations: getClpRecommendationsConfig($topContentSlot),
  }
}

export function bottomContentParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)

  if (!sanitizedHtml) {
    return {}
  }

  const $ = cheerio.load(sanitizedHtml)

  const $bottomContentSlot = $('#category-bottom-content-slot')

  const content = cheerio.html($bottomContentSlot).trim()
  if (!content) {
    return {
      content: '',
    }
  }
  const containsCarousel = !!$bottomContentSlot.find('.product-tile-slider')?.length
  const hasVideo = !!$bottomContentSlot.find('.content-video').length

  return {
    content,
    containsCarousel,
    hasVideo,
    clpRecommendations: getClpRecommendationsConfig($bottomContentSlot),
  }
}

export function globalSlotDataParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  let globalSlot = {}

  for (const id of GLOBAL_CONTENT_SLOTS_IDS) {
    const parser = CONTENT_SLOT_PARSER[id]
    if (parser) {
      const elId = `#${id}`
      const styles = $(`${elId} style`).html()
      globalSlot[id] = parser($.html(elId))
      globalSlot[id].styles = styles
    }
  }

  return globalSlot
}

export function parsePopularSearchesProductIds(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  return [
    ...$('div#nosearch-result-popular-searches .product-tile-slider .product-slide .product').map(
      (i, el) => {
        const $el = $(el)
        return {
          productId: $el.attr('data-masterpid'),
          isPriceExists: $el.find('.product-tile__price').text().length > 0,
          chosenVariant: $el.attr('data-wishlist-fallback-id'),
        }
      }
    ),
  ]
}

export function parseSuggestionContent(html) {
  if (!html) {
    return {}
  }

  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  const data = {
    productsData: uniqBy(
      [
        ...$('body .product').map((i, el) => {
          const $el = $(el)
          return {
            id: $el.attr('data-pid'),
          }
        }),
      ],
      (a, b) => a.id === b.id
    ),
    popularSearches: uniqBy(
      [
        ...$('body .suggestions-list__item a').map((i, el) => {
          const $el = $(el)
          return {
            id: i,
            link: $el.attr('href'),
            name: $el.text(),
          }
        }),
      ],
      (a, b) => a.link === b.link
    ).slice(0, MAX_SEARCH_SUGGESTION_COUNT),
  }

  return data
}

export function isContentEmpty(html, selector) {
  if (!html) {
    return null
  }
  const $ = cheerio.load(html)

  return Boolean($(selector).html()?.innerHTML?.trim())
}
