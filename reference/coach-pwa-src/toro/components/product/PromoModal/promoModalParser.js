import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import get from 'lodash/get'

export default function promoModalParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  if (!sanitizedHtml) {
    return {}
  }
  const $ = cheerio.load(sanitizedHtml)
  const text = get($('body').text()?.split(' Learn More'), '[1]', null)
  const mainHeading = $('.modal__sub-heading').text()?.split('Learn More')
  const img = $('img').attr('src')
  return {
    mainHeading,
    text,
    img,
  }
}
