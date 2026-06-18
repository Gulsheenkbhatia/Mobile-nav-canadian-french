import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function thredUpModalContentParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  if (!sanitizedHtml) {
    return
  }
  const extractElem = (tag) => {
    const elem = []
    for (let i = 0; i < tag?.length; i++) {
      elem.push(tag[i])
    }
    return elem
  }
  const $ = cheerio.load(sanitizedHtml)
  const pTag = $('body')
    ?.find('p')
    ?.map((i, e) => e?.children[0]?.data)
  const hTag = $('body')
    ?.find('h2')
    ?.map((i, e) => e?.children?.map((k) => k.data).filter(Boolean))
  const pElem = extractElem(pTag)
  const hElem = extractElem(hTag)
  const styles = $('body')?.find('style')?.[0]?.children?.[0]?.data

  return {
    html: sanitizedHtml,
    pElem,
    hElem,
    styles,
  }
}
