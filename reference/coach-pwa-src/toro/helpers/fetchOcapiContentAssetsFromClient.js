import isArray from 'lodash/isArray'
import get from 'lodash/get'
import getAPIURL from 'helpers/getAPIURL'
import extractLocaleFromUrl from 'helpers/extractLocaleFromUrl'
import fetch from 'helpers/fetch'
import { responseLogger } from 'helpers/logger'

/*
  Pull the locale path prefix (e.g. "fr", "ja") off the current browser URL.

  This is exported so opt-in callers (currently the content drawer) can forward
  the active locale to /api/get-content-assets. It is intentionally NOT applied
  by default in the helper below to avoid changing the locale that existing
  callers (PLP "new" badges via xgen.atom.ts and fetchNewBadgesContentSlotsFromClient.js)
  request from SFCC, which would be a global behavior change across all sites.
*/
export const getLocalePathPrefix = () => {
  if (typeof window === 'undefined') return ''
  const pathname = window.location.pathname?.replace(/\/$/, '') || ''
  const { locale } = extractLocaleFromUrl(pathname) || {}
  return locale ? `/${locale}` : ''
}

const fetchOcapiContentAssetsFromClient = async (ids, { localePathPrefix = '' } = {}) => {
  if (!isArray(ids) || ids.length === 0) {
    return []
  }

  try {
    const response = await fetch(
      getAPIURL(
        `${localePathPrefix}/get-content-assets?ids=${encodeURIComponent(`${ids.join(',')}`)}`
      )
    )
    responseLogger(response)
    const assetsResponse = await response.json()
    return Object.values(get(assetsResponse, 'data', []))
  } catch (e) {
    console.error(e)
    return []
  }
}

export default fetchOcapiContentAssetsFromClient
