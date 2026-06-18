import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import cheerio from 'toro/lib/cheerio'

export default function footerEmailConsentParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  if (!sanitizedHtml) {
    return {}
  }
  const $ = cheerio.load(sanitizedHtml)
  const isSignupTextWithCheckbox = Boolean($('.checkbox').length)
  $('input[type=checkbox]').remove()
  return {
    html: isSignupTextWithCheckbox ? $('.checkbox label').html() : $.html(),
    isSignupTextWithCheckbox,
  }
}
