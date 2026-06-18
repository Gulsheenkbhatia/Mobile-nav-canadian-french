import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import {
  ONCLICK_INLINE_FN_PATTERN_START,
  removePatternFromString,
} from 'toro/helpers/removePatternFromString'

export default function callOutParser(html, promoType = null) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  if (!sanitizedHtml) {
    return {}
  }
  const $ = cheerio.load(sanitizedHtml)
  const [text] = $('body').html()?.split('Learn More') || []
  const promoStyle = $('body').find('span').attr('style') || $('body').find('div').attr('style')
  const mainHtml = $.html()
  let btnTxt = $('body').find('button').text() || ''
  const spanElem = $('body').find('span')
  const isSpan = spanElem?.length
  let spanText = null
  if (isSpan) {
    if (!btnTxt) {
      spanText = spanElem
    }
    const spanWrapper = spanElem.closest('a')
    if (spanWrapper?.length) {
      spanText = spanWrapper
    }
  }

  const shouldInjectJquery = $('.pdp-learn-more-link-promo-popup')?.html()

  const isPromoModal = $.html(spanText)?.includes(ONCLICK_INLINE_FN_PATTERN_START)
  if (isPromoModal) {
    return { isPromoModal, spanText: removePatternFromString($.html('body')) }
  }
  const link = $('button').attr('data-url')

  if (typeof spanText?.text === 'function' && spanText?.text() === text) {
    return {
      link,
      spanText: $.html(spanText), // span tag may contain style attribute
    }
  }
  let scriptContent = ''
  if ($('script')?.length > 0) {
    scriptContent = $('script').html()
  }

  let drawerScheme = $('a[data-drawer-scheme]').attr('data-drawer-scheme')
  if (drawerScheme) {
    try {
      drawerScheme = JSON.parse(drawerScheme)
    } catch (e) {
      drawerScheme = { PDP: { recommenders: [] } }
      console.error('error parsing callout drawer data-drawer-scheme attribute:', e)
    }
  }

  const OTD = $('span[data-otd="true"]')
  const isOTD = !!OTD.length
  const OTDPrice = OTD.text()

  // Detection of style tag needed for when we recive html with fully styled promo banner so then we don't need to parse anything
  if ($('style')?.length > 0) {
    spanText = $.html()
    return {
      scriptContent,
      spanText,
      shouldInjectJquery,
      isOTD,
    }
  }

  // Promo Placements
  const type = promoType
  let promo = {}

  if (type) {
    const $promoContent = $('body')

    promo = {
      type,
      content: $promoContent.html(),
      hasOTDPrice: !!$promoContent.find('span[data-otd="true"]').length,
      template: $promoContent.find('span').attr('data-template')?.toUpperCase(),
    }
  }

  return {
    text,
    link,
    spanText: spanText ? $.html(spanText) : '',
    promoStyle,
    scriptContent,
    mainHtml,
    isPromoModal,
    shouldInjectJquery,
    drawerScheme,
    isOTD,
    ...(isOTD ? { OTDPrice } : {}),
    promo,
  }
}
