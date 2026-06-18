import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import { getClpRecommendationsConfig } from 'toro/helpers/recommendations'

export default function giftCLPParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  if (!sanitizedHtml) {
    return {
      slots: [],
    }
  }
  const $ = cheerio.load(sanitizedHtml)

  const slots = [
    ...$('body > div').map((i, el) => {
      const $el = $(el)
      return {
        id: $el.attr('id'),
        html: $.html($el),
        hasVideo: !!$el.find('.content-video').length,
        clpRecommendations: getClpRecommendationsConfig($el),
      }
    }),
  ]
  const hasVideoContent = slots.some((slot) => slot.hasVideo)
  return {
    slots,
    hasVideoContent,
  }
}
