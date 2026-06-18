import cheerio from 'toro/lib/cheerio'
import get from 'lodash/get'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import { ContentAsset } from 'toro/types/productTypes'

export interface FAQItemWithContent {
  title: string
  html: string
  text: string
}

function parseContentAssetToFaqSlot(
  contentAsset: ContentAsset,
  locale: string
): FAQItemWithContent {
  const sourceHtml =
    get(contentAsset, `c_body.${locale}.markup`) || // supports fr-CA
    get(contentAsset, `c_body.${locale.replace(/-/g, '_')}.markup`) || // supports en_US
    get(contentAsset, `c_body.default.markup`)

  const isAssetOnline =
    get(contentAsset, `online.${locale}`) ||
    get(contentAsset, `online.${locale.replace(/-/g, '_')}`) ||
    get(contentAsset, `online.default`, false) // asset is considered offline by default

  if (!sourceHtml || !isAssetOnline) {
    return null
  }

  const sanitizedHtml = sanitizeHtmlMarkup(sourceHtml)
  const $ = cheerio.load(sanitizedHtml)

  const $question = $('[data-faq="question"]')
  const title = $question.text().trim()

  const $answer = $('[data-faq="answer"]')
  const html = $answer.html()
  const text = $answer.text().trim()

  if (!title || !html) {
    return null
  }

  return {
    title,
    html,
    text,
  }
}

export default function parseContentAssetsToFaqSlots(contentAssets, locale): FAQItemWithContent[] {
  const faqSlots = contentAssets
    .map((contentAsset) => parseContentAssetToFaqSlot(contentAsset, locale))
    .filter(Boolean)

  if (faqSlots.length) {
    return faqSlots
  }
}
