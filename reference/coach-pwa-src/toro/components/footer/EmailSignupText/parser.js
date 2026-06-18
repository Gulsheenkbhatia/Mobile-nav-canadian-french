import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function emailSignupTextParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  if (!$('body').html()) {
    return {
      html: '',
    }
  }
  return {
    html: sanitizedHtml,
  }
}
