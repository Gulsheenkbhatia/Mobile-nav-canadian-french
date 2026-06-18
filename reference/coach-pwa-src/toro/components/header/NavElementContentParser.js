import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function navElementContentParser(html) {
  if (!html) {
    return {}
  }

  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  const label = $('label[data-qa="m_hdr_cs_label_active"]').text() || ''
  const selectedFlagHref = $('.dropdown-item-locale.active svg > use').attr('href') || ''
  const selectedFlag = selectedFlagHref.trim().slice(1)
  const link = $('.dropdown-item-locale.active').attr('href') || ''

  return {
    label: label.trim(),
    selectedFlag,
    link: link.trim(),
  }
}
