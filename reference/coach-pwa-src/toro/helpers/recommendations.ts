import type { CheerioAPI } from 'cheerio'
import cheerio from 'toro/lib/cheerio'

export type CheerioSelection = ReturnType<CheerioAPI['root']> | string | null | undefined

export type ClpRecommendationsConfig = {
  enabled: boolean
  schema: string | null
}

/**
 * Extracts CLP (Category Landing Page) recommendations configuration
 * from a given content slot.
 *
 * The function looks for an element with the `.page-rec` class and reads
 * its `data-schema` attribute to determine the recommendations schema.
 *
 * @param {CheerioSelection | string} contentSlot - A Cheerio selection or raw HTML string
 * representing the content slot to parse.
 *
 * @returns {ClpRecommendationsConfig} An object containing:
 * - `enabled` {boolean} Whether the recommendations element exists.
 * - `schema` {string | null} The value of the `data-schema` attribute if present, otherwise null.
 */
export const getClpRecommendationsConfig = (
  contentSlot: CheerioSelection
): ClpRecommendationsConfig => {
  if (!contentSlot) return { enabled: false, schema: null }
  const $content =
    typeof contentSlot === 'string' ? cheerio.load(contentSlot, null, false).root() : contentSlot
  const $recommendationsEl = $content.find('.page-rec')
  const schema = $recommendationsEl.attr('data-schema') || null

  return {
    enabled: $recommendationsEl.length > 0,
    schema,
  }
}
