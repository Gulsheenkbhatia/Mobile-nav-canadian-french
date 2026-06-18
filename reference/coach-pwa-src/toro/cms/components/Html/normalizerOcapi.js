import get from 'lodash/get'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

const normalizerOcapi = (content, language = 'default') => {
  const defaultHtml = get(content, `content.c_body.default.markup`)
  const html = get(content, `content.c_body.${language}.markup`, defaultHtml)
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  return {
    content: sanitizedHtml,
  }
}

export default normalizerOcapi
