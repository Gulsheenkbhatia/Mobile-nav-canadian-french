import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import { processLazyLoadingElements } from 'toro/cms/utils'
import { getClpRecommendationsConfig } from 'toro/helpers/recommendations'

export default function clpBodyParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)

  if (!sanitizedHtml) {
    return {
      slots: [],
    }
  }

  const $ = cheerio.load(sanitizedHtml)
  const slots = []

  $('div[id*=clp-]').each((i, el) => {
    const $el = $(el)

    processLazyLoadingElements(
      $,
      $el,
      'img[data-loading=lazy], picture[data-loading=lazy] source, video[data-loading=lazy] source'
    )

    slots.push({
      id: $el.attr('class')?.replace(/\s+/, '_'),
      html: $.html($el),
      isRecommendationsSlot: !!$el.find('[id=certona-recommendations]').length,
      hasVideo: !!$el.find('.content-video').length,
      hasRecommendedCategories: !!$el.find('[id=rec-categories]').length,
      clpRecommendations: getClpRecommendationsConfig($el),
    })
  })
  const hasVideoContent = slots.some((slot) => slot.hasVideo)
  return {
    slots,
    hasVideoContent,
  }
}
