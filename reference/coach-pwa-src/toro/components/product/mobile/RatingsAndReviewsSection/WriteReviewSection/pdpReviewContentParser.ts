import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import { WriteReviewSectionData } from 'toro/types/productTypes'

export default function pdpReviewContentParser(html): WriteReviewSectionData | null {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  if (!sanitizedHtml) {
    return null
  }

  let $ = cheerio.load(sanitizedHtml, undefined, false)
  const title = $('h1').text()
  if (!title) {
    return null
  }

  const body = $('p').text()
  const imageSrc = $('img').attr('src')

  return {
    title,
    body,
    imageSrc,
  }
}
