import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import get from 'lodash/get'
import {
  ONCLICK_INLINE_FN_PATTERN_START,
  removePatternFromString,
} from 'toro/helpers/removePatternFromString'

type BannerItem = { content: string; isPromoModal: boolean }

export type PromoBannerData = {
  items: BannerItem[]
  styles?: string[]
  scriptContents?: string[]
}

const injectModalProps = (content = '') => {
  const isPromoModal = content.includes(ONCLICK_INLINE_FN_PATTERN_START)
  return {
    isPromoModal,
    content: isPromoModal ? removePatternFromString(content) : content,
  }
}

export default function promoBannerParser(html): PromoBannerData {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  if (!sanitizedHtml) {
    return {
      items: [],
    }
  }

  const $ = cheerio.load(sanitizedHtml)
  const $scripts = $('script')
    .get()
    .filter((script) => {
      return !script.attribs.src
    })
    .map((script) => {
      return $(script).html().trim()
    })

  const data = {
    items: Array.from($('.promo-item').map((_, el) => injectModalProps($.html(el)))),
    styles: $('style')
      ?.get()
      ?.map((el) => get(el, 'children[0].data')),
    scriptContents: $scripts,
    popupContent: $('.promo-popup-content')?.html(),
    promoModalContent: $('.coach-light-box-affiliate .column-right-float')?.html(),
  }
  return data
}
