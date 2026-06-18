import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function memberExclusiveParser(html: string): { title?: string } {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  if (!sanitizedHtml) {
    return {}
  }

  const $ = cheerio.load(sanitizedHtml)

  const title = $('button').first().attr('data-original-title')

  return {
    title,
  }
}
