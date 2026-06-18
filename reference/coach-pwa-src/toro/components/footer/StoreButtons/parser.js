import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function storeButtonsParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  return {
    html: sanitizedHtml,
  }
}
