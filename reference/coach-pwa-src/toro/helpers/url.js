import isNil from 'lodash/isNil'
import omitBy from 'lodash/omitBy'
import get from 'lodash/get'

const apiHost = process.env.API_HOST || ''

export const deriveUrlBase = (req) => {
  const hostHeader = get(req, 'headers.host', '')
  const host = apiHost || hostHeader
  const protocol = /localhost|127.0.0.1/.test(host) ? 'http://' : 'https://'

  return `${protocol}${host}`
}

export function getInternalApiUrl(req, path = '') {
  const urlBase = deriveUrlBase(req)
  const url = new URL(path, urlBase)
  const localeParam = get(req, `query.locale`, '')
  const cacheParam = get(req, `query.cache`, '')
  if (localeParam && !url.searchParams.has('locale')) {
    url.searchParams.set('locale', localeParam)
  }
  if (cacheParam === 'false') {
    url.searchParams.set('cache', cacheParam)
  }
  return url.toString()
}

export function getSfccApiPath(options = {}) {
  const locale = options.locale || 'en_US'
  const siteId = options.siteId || ''
  const sitePath = `Sites-${siteId}-Site`
  return `/on/demandware.store/${sitePath}/${locale}/`
}

export function getSfccHomepagePath(options = {}) {
  return getSfccApiPath(options)
}

export function getAssetsVersion(stylesLink = '') {
  // TODO add more options for CA sites
  const regExpFirstPart = new RegExp(`.*(en_)?(v\\d+).*`, 'g')
  return stylesLink.replace(regExpFirstPart, '$1$2')
}

export const getBrandForPreconnect = (brand) => {
  return brand === 'coach-outlet' ? 'coach' : brand
}

export const isSwPreconnect = (brand) => {
  return brand === 'stuart-weitzman'
}

export const parseQueryString = (queryStr = '') => {
  const urlSearch = new URLSearchParams(queryStr)
  return Object.fromEntries(urlSearch.entries())
}

export const stringifyQueryParams = (
  params = {},
  options = { skipNulls: false, addQueryPrefix: false }
) => {
  const urlSearch = new URLSearchParams(options.skipNulls ? omitBy(params, isNil) : params)
  const queryString = urlSearch.toString()
  return options.addQueryPrefix ? `?${queryString}` : queryString
}

export const isEncodedURL = (url = '') => {
  try {
    return url !== decodeURI(url)
  } catch {
    return false
  }
}

/**
 * Splits a URL into its path and query string parts.
 *
 * @param url - The URL string to split.
 * @returns A tuple: [path, query], where:
 *   - `path` is the portion of the URL before the '?' character.
 *   - `query` is the portion after the '?' character.
 *
 * @example
 * // Basic example
 * const [path, query] = getUrlParts('https://example.com/page?name=JohnDoe&age=30');
 * console.log(path)  // "https://example.com/page"
 * console.log(query) // "name=JohnDoe&age=30"
 *
 * // Example with no query string
 * const [path, query] = getUrlParts('https://example.com/page');
 * console.log(path)  // "https://example.com/page"
 * console.log(query) // ""
 *
 */
export function getUrlParts(url) {
  const parts = url?.split('?') ?? []
  return [parts[0] || '', parts[1] || '']
}
