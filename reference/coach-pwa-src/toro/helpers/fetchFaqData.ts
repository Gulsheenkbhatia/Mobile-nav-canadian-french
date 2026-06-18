import get from 'lodash/get'
import cheerio from 'toro/lib/cheerio'
import { ContentAsset } from 'toro/types/productTypes'
import { FAQItemWithContent } from 'toro/types/productTypes/common'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import fetchContentAssets from 'toro/helpers/fetchContentAssets'
import { NextApiRequest } from 'next'
import parseContentAssetsToFaqSlot from 'toro/helpers/parseContentAssetsToFaqSlots'

const MAX_QUESTIONS_COUNT = 10

interface FAQItem {
  title: string | Record<string, string>
  contentAssetId: string
}

/**
 * Parses HTML with cheerio and returns plain text (all tags stripped).
 * @param html - HTML string to parse
 * @returns Trimmed plain text, or empty string if input is falsy
 */
const htmlToPlainText = (html: string | null | undefined): string => {
  if (html == null || html === '') {
    return ''
  }
  const $ = cheerio.load(html)
  return $.root().children().text().trim()
}

/**
 * Helper function to get localized title from title object
 * @param title - Object with locale keys (e.g., { 'en-US': 'Title', 'fr_CA': 'Titre' })
 * @param locale - Current locale (e.g., 'en-US', 'fr-CA')
 * @returns Localized title string
 */
const getLocalizedTitle = (title: string | Record<string, string>, locale: string): string => {
  if (typeof title === 'string') {
    return title
  }
  const defaultLocale = 'en_US'
  const normalizeLocale = (loc: string) => loc.replace(/-/g, '_')
  const normalizedCurrentLocale = normalizeLocale(locale)

  const titleKeys = Object.keys(title)

  const exactMatch = titleKeys.find((key) => normalizeLocale(key) === normalizedCurrentLocale)
  if (exactMatch) {
    return title[exactMatch]
  }

  return title[defaultLocale] || title[normalizeLocale(defaultLocale)] || ''
}

/**
 * Helper function to merge FAQ data with assets and normalize with localization
 * @param assets - Array of content assets fetched from API
 * @param faqData - Array of FAQ items with content asset IDs
 * @param locale - Current locale for title localization
 * @returns Array of FAQ items with normalized localized content assets (only online assets)
 */
const normaliseFAQSlotWithLocalisation = (
  assets: ContentAsset[],
  faqData: FAQItem[],
  locale: string
): FAQItemWithContent[] => {
  const onlineAssets = assets.filter((asset) => get(asset, 'online.default'))
  // Create a map of online content assets by their ID for easy lookup
  const assetsMap = new Map<string, ContentAsset>()
  onlineAssets.forEach((asset) => {
    assetsMap.set(asset.id, asset)
  })

  // Merge FAQ data
  return faqData
    .map((faqItem) => {
      const contentAsset = assetsMap.get(faqItem.contentAssetId)

      if (!contentAsset) {
        return null
      }

      const localizedTitle = getLocalizedTitle(faqItem.title, locale)
      const localizedContent = sanitizeHtmlMarkup(
        get(contentAsset, `c_body.${locale}.markup`, get(contentAsset, 'c_body.default.markup', ''))
      )

      return {
        title: localizedTitle,
        html: localizedContent,
        text: htmlToPlainText(localizedContent),
      }
    })
    .filter((item): item is FAQItemWithContent => item !== null && item.html !== '')
    .slice(0, MAX_QUESTIONS_COUNT)
}

export const fetchFaqDataWithConfig = async (
  req: NextApiRequest,
  faqDataString: string,
  locale: string
) => {
  let faqData: FAQItem[] = []
  try {
    const parsedFAQData = JSON.parse(faqDataString)
    faqData = get(parsedFAQData, 'accordions') || []
  } catch (error) {
    console.error('Error parsing FAQ data JSON:', error)
    return undefined
  }
  if (!faqData.length) {
    return undefined
  }
  const contentAssetIds = faqData
    .map((item) => item.contentAssetId)
    .filter((id) => id && id.trim() !== '')

  const contentAssetsResponse = await fetchContentAssets(req, contentAssetIds)
  const contentAssetsResponseData = get(contentAssetsResponse, 'data', {})
  const contentAssets = Object.values(contentAssetsResponseData) as ContentAsset[]
  const normalizedFaqData = normaliseFAQSlotWithLocalisation(
    contentAssets,
    faqData,
    locale.replace(/-/g, '_')
  )
  return normalizedFaqData
}

export const fetchFaqDataWithContentAssetIDs = async (
  req: NextApiRequest,
  faqData: string,
  locale: string
) => {
  if (!faqData.length) {
    return undefined
  }
  const contentAssetIds = faqData
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id !== '')

  if (!contentAssetIds.length) {
    return undefined
  }

  const contentAssetsResponse = await fetchContentAssets(req, contentAssetIds)
  const contentAssetsResponseData = get(contentAssetsResponse, 'data', {})
  const contentAssets = Object.values(contentAssetsResponseData) as ContentAsset[]

  const faqSlots = parseContentAssetsToFaqSlot(contentAssets, locale)
  return faqSlots?.slice(0, MAX_QUESTIONS_COUNT)
}
