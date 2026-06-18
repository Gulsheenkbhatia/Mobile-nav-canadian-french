import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function footerCopyParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  return {
    html: sanitizedHtml,
  }
}
