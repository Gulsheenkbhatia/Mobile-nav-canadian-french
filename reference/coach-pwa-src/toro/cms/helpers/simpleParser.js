import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function simpleParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  if (!sanitizedHtml) {
    return {}
  }
  let $ = cheerio.load(sanitizedHtml, undefined, false)

  return {
    content: $.html(),
  }
}
