import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import cheerio from 'toro/lib/cheerio'

export const parseUgcMarkupFromHeadless = (html) => {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)
  const container = $('#ugc-category-slot')
  if (container?.text()?.trim()) {
    return container.toString()
  }
  return ''
}

export const insertContentIntoMarkupPDP = (html) => {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)
  const container = $('#product_body_slot_ugc').append(`
      <div class="ugc_box__slider justify-content-center mb-3">
        <div class="w-100" id="pr-reviewimagedisplay">
          <div class="p-w-r"></div>
        </div>
      </div>
    `)
  return container.html()
}
