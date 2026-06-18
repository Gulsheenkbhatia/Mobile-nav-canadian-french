import sitePreviewParams from 'toro/constants/sitePreview'
import pick from 'lodash/pick'
import get from 'lodash/get'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'
import { COOKIE_SITE_PREVIEW } from 'toro/constants/cookies'
import { NextApiRequest } from 'next'
import Cookies from 'js-cookie'
import getAPIURL from 'helpers/getAPIURL'

export type MappedSitePreviewParams = {
  [P in typeof sitePreviewParams[number]]?: string
}

export type SitePreviewConfig = {
  dateTime: string
  'source-code': string
  'customer-group': string
}

export const stopPreviewHandler = async (): Promise<void> => {
  Cookies.remove(COOKIE_SITE_PREVIEW)
  await fetch(getAPIURL(`/user?__resetSitePreview=true`))
  const url = dismissPreviewParams(window.location.href)
  window.location.assign(url)
}

// Derive the preview config object from either the URL query string or the COOKIE_SITE_PREVIEW cookie
export const derivePreviewConfig = (
  query: NodeJS.Dict<string | string[]> = {},
  previewCookie: Partial<SitePreviewConfig> = {}
): SitePreviewConfig | null => {
  const params = pick(query, sitePreviewParams) as MappedSitePreviewParams
  if (
    (isPlainObject(params) &&
      !isEmpty(params) &&
      Object.values(params).some((value) => Boolean(value?.length))) ||
    (isPlainObject(previewCookie) &&
      !isEmpty(previewCookie) &&
      Object.values(previewCookie).some((value) => Boolean(value?.length)))
  ) {
    return !isEmpty(params)
      ? {
          dateTime: get(params, '__siteDate', ''),
          'source-code': get(params, '__sourceCode', ''),
          'customer-group': get(params, '__customerGroup', ''),
        }
      : {
          dateTime: get(previewCookie, 'dateTime', ''),
          'source-code': get(previewCookie, 'source-code', ''),
          'customer-group': get(previewCookie, 'customer-group', ''),
        }
  }
  return null
}

export const dismissPreviewParams = (url: string): string => {
  try {
    const newUrl = new URL(url)
    sitePreviewParams.forEach((item) => {
      newUrl.searchParams.delete(item)
    })
    return newUrl.href
  } catch (_) {
    return url
  }
}

export const appendPreviewParams = (
  url: URL | string,
  config: SitePreviewConfig,
  src?: string,
  shouldResetSitePreview?: boolean
) => {
  if (isString(url)) {
    try {
      const newUrl = new URL(url)
      appendPreviewSearchParams(config, newUrl.searchParams, src, shouldResetSitePreview)
      return newUrl.href
    } catch (_) {
      return url
    }
  }
  appendPreviewSearchParams(config, url.searchParams, src, shouldResetSitePreview)
  return url.href
}

export const getSitePreviewConfigFromCookieValue = (cookieVal?: string): SitePreviewConfig => {
  if (!cookieVal || !isString(cookieVal)) {
    return null
  }

  try {
    return JSON.parse(decodeURIComponent(cookieVal))
  } catch (e) {
    return null
  }
}

const sitePreviewCookiePattern = new RegExp(`${COOKIE_SITE_PREVIEW}=(.*?(?=$| |;))`)

export const getSitePreviewConfigFromReq = (req: NextApiRequest): SitePreviewConfig | null => {
  if (!req) {
    return null
  }

  const cookieStr = get(req, 'headers.cookie')
  if (!cookieStr || !isString(cookieStr)) {
    return null
  }

  const cookieValue = cookieStr.match(sitePreviewCookiePattern)?.[1]

  if (cookieValue) {
    return getSitePreviewConfigFromCookieValue(cookieValue)
  }

  return null
}

export const getSitePreviewUrlParamsFromConfig = (
  config: SitePreviewConfig
): MappedSitePreviewParams => {
  const dateTime = get(config, 'dateTime') || ''
  const sourceCode = get(config, 'source-code') || ''
  const customerGroup = get(config, 'customer-group') || ''
  return {
    __siteDate: dateTime,
    __sourceCode: sourceCode,
    __customerGroup: customerGroup,
  }
}

export const splitDateTime = (dateTime: string = ''): { date?: string; time?: string } => {
  if (dateTime.length) {
    const date = [4, 6].reduce(
      (prev, curr, idx) => prev.slice(0, curr + idx) + '-' + prev.slice(curr + idx, prev.length),
      dateTime.substring(0, 8)
    )
    const time = dateTime.slice(8, 10) + ':' + dateTime.slice(10)

    return { date, time }
  }
  return {}
}

const appendPreviewSearchParams = (
  config: SitePreviewConfig,
  searchParams: URLSearchParams,
  src?: string,
  shouldResetSitePreview: boolean = false
): void => {
  const isSitePreviewActive = isPlainObject(config) && !isEmpty(config)
  const isSrcPresent = !isEmpty(src)

  if (shouldResetSitePreview) {
    searchParams.set('__siteDate', '')
    searchParams.set('__customerGroup', "''")
    if (isSrcPresent) {
      searchParams.set('__sourceCode', src)
    } else {
      searchParams.set('__sourceCode', '')
    }
  } else {
    if (isSitePreviewActive) {
      const sitePreviewParams = getSitePreviewUrlParamsFromConfig(config)
      for (const [key, value] of Object.entries(sitePreviewParams)) {
        searchParams.set(key, value)

        if (isSrcPresent) {
          searchParams.set('src', src)
          searchParams.set('__sourceCode', src)
        }
      }
    } else {
      if (isSrcPresent) {
        searchParams.set('src', src)
        searchParams.set('__sourceCode', src)
      }
    }
  }
}
