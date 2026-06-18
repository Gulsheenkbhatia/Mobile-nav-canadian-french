import get from 'lodash/get'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import restoreAtbPids from 'toro/helpers/restoreAtbPids'

const normalizerScraped = (content) => {
  const html = get(content, 'content.markup')
  const sanitizedHtml = sanitizeHtmlMarkup(html)

  return {
    content: restoreAtbPids(html, sanitizedHtml),
  }
}

export default normalizerScraped
