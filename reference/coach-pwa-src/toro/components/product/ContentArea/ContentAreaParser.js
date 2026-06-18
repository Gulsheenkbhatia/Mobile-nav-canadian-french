import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import cheerio from 'toro/lib/cheerio'
import { transformNativeCssScrollOnServer } from 'toro/cms/server/utils'
import { hotspotsImage } from 'toro/helpers/home-parser'

export default function contentAreaParser(html, viewport) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  let $ = cheerio.load(sanitizedHtml)
  transformNativeCssScrollOnServer($, viewport)
  hotspotsImage($, viewport)
  const isSplideCarouselExists = $('.splide__list').length > 0
  const hasVideo = !!$('.content-video').length
  return {
    html: $.html(),
    isSplideCarouselExists,
    hasVideo,
  }
}
