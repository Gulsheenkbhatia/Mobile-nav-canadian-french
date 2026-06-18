import get from 'lodash/get'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

const normalizerAmplience = (content) => {
  const html = get(content, 'content.htmlEditor.HTMLEditorObj')
  const sanitizedHtml = sanitizeHtmlMarkup(html)

  return {
    content: sanitizedHtml,
  }
}

export default normalizerAmplience
