import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import cheerio from 'lib/cheerio'

export default function getCsrfTokenParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)

  if (!sanitizedHtml) {
    return {}
  }

  const $ = cheerio.load(sanitizedHtml)

  const csrfToken = $('input[type="hidden"][name="csrf_token"]').attr('value')
  return {
    csrfToken,
  }
}
