import cheerio from 'toro/lib/cheerio'
import get from 'lodash/get'
import type { FetchedContentAsset } from 'toro/types/contentAsset'

/**
 * Checks if content markup has valid renderable HTML children.
 * Used to validate that a content asset's body contains actual content.
 *
 * @param content - HTML markup string to validate
 * @returns true if content has renderable children, false otherwise
 */
export const isValidContent = (content: string | null | undefined): boolean => {
  if (content) {
    const $ = cheerio.load(content)
    const children = $('body')?.children()?.length
    if (children) {
      return true
    }
  }
  return false
}

/**
 * Checks if a content asset is online/enabled.
 * Content assets have an `online.default` boolean property that indicates enablement.
 *
 * @param contentAsset - The content asset object to check
 * @returns true if the asset is online, false otherwise
 */
export const isOnlineContentAsset = (
  contentAsset: FetchedContentAsset | null | undefined
): boolean => {
  if (!contentAsset) {
    return false
  }
  return get(contentAsset, 'online.default', false) === true
}
