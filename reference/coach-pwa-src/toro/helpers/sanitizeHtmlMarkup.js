/**
 *
 * @param {string} markup HTML content
 */
const sanitizeHtmlMarkup = (markup) => {
  if (!markup) {
    return ''
  }

  /*
    Replace all whitespaces and actual \r\n\t string values with a single space.
    Remove spaces between elements tags. (closing and opening angular brackets).
    Remove commments: single, multiline, nested and unterminated.
   */
  markup = markup
    .replace?.(
      /<script[^>]*>[\s\S]*<\/script>|(\s+|\\r+|\\n+|\\t+|<!--.*?-->|<!--[\S\s]+?-->|<!--[\S\s]*?$)/g,
      (match) => {
        if (match.includes('<script') && match.includes('</script>')) {
          return match
        }
        return ' '
      }
    )
    .replace(/(>)\s+(<)/g, '$1 $2')
    .trim()

  return markup || ''
}

export default sanitizeHtmlMarkup
