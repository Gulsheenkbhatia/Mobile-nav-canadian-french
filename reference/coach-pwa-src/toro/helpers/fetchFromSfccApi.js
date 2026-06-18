import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'
import { whitelistedSfccRoutes } from 'toro/constants/whitelistedSfccRoutes'
import getSourceCodeParam from 'toro/helpers/getSourceCodeParam'
import authToken from 'toro/helpers/getBase64AuthToken'
import getLocaleFromReq from 'helpers/getLocaleFromReq'
import { DW_ANONYMOUS } from 'toro/constants/cookies'
import { getSitePreviewConfigFromReq, appendPreviewParams } from 'toro/helpers/sitePreview'
import withCorrId from 'helpers/traceability'
import { responseLogger } from 'helpers/logger'

export function getSfccApiUrl(pathSuffix, req, sitePreviewConfig, resetSitePreview) {
  const siteId = process.env.SITE_ID_US
  const locale = getLocaleFromReq(req, true)
  const domain = process.env.SFCC_BACKEND_DOMAIN_US || 'development.coach.com'

  const src = getSourceCodeParam(req)
  const url = appendPreviewParams(
    `https://${domain}/on/demandware.store/Sites-${siteId}-Site/${locale}/${pathSuffix}`,
    sitePreviewConfig,
    src,
    resetSitePreview
  )

  return url
}

export default async function fetchFromSfccApi(
  pathSuffix,
  req,
  { body = undefined, headers = {}, resetSitePreview = false, isHtml = false, ...options },
  isText = false,
  isRawBody = false,
  res
) {
  let urlSearchParams
  let formBody = []

  const sitePreviewConfig = getSitePreviewConfigFromReq(req)

  if (pathSuffix === 'Cart-AddProduct') {
    for (let property in body) {
      let encodedKey = encodeURIComponent(property)
      let encodedValue = encodeURIComponent(body[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    formBody = formBody.join('&')
  }
  if (isRawBody) {
    headers['Content-Type'] = 'application/json'
  } else if (body && !isRawBody) {
    if (pathSuffix !== 'Cart-AddProduct') {
      urlSearchParams = new URLSearchParams()
      Object.keys(body).forEach((key) => {
        urlSearchParams?.append(key, body[key])
      })
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
  }

  if (isHtml) {
    headers['Content-Type'] = 'text/plain'
  }

  headers.host = process.env.SFCC_BACKEND_DOMAIN_US
  headers.origin = `https://${headers.host}`

  if (headers.referer) {
    const url = new URL(headers.referer)
    headers.referer = `${headers.origin}${url.pathname}`
  }

  applyUpstreamIPToHeaders(req, headers)

  const getBody = () => {
    if (isHtml) {
      return body
    }

    if (urlSearchParams) {
      return urlSearchParams.toString()
    }

    if (pathSuffix === 'Cart-AddProduct') {
      return formBody
    }

    return body
  }
  const fetchWithCorrId = withCorrId(req)
  const sfccRes = await fetchWithCorrId(
    getSfccApiUrl(pathSuffix, req, sitePreviewConfig, resetSitePreview),
    {
      ...options,
      headers: {
        Authorization: `Basic ${authToken}`,
        redirect: 'follow',
        ...headers,
      },
      body: getBody(),
    }
  )
  responseLogger(sfccRes)
  if (sfccRes.status === 200 || sfccRes.status === 201) {
    const contentType = sfccRes.headers.get('content-type')
    const isTextInResponse = contentType && contentType.indexOf('application/json') === -1

    if (res) {
      const rawArrayCookies =
        (sfccRes.headers.get('set-cookie') || '').split('SameSite=None,') || []
      res.setHeader(
        'Set-Cookie',
        rawArrayCookies
          .filter((item) => {
            if (
              item.includes('dwsid') &&
              !whitelistedSfccRoutes.some((route) => pathSuffix.includes(route))
            ) {
              if (pathSuffix === 'Cart-Get') {
                console.log('Cart-Get returned a new session id', item)
              }
              return false
            }

            if (
              item.includes('dwsourcecode') &&
              isPlainObject(sitePreviewConfig) &&
              !isEmpty(sitePreviewConfig)
            ) {
              return false
            }

            return true
          })
          .map((item, index) => {
            if (index < rawArrayCookies?.length - 1) {
              if (item.includes(DW_ANONYMOUS)) {
                return item?.concat('Secure; SameSite=None')
              }
              return item?.concat('Secure; HttpOnly; SameSite=None')
            }
            return item?.concat('; Secure; HttpOnly')
          })
      )
    }

    // If we're getting a text/html response without requesting or expecting one, it's most likely
    // an SFCC error being thrown.
    if (isTextInResponse && !isText) {
      const errMsg = `Unexpected Content-Type received from SFCC for endpoint /${pathSuffix}. An 'application/json' response was expected, but '${contentType}' was received.`
      console.error({
        error: errMsg,
        context: {
          caller: 'fetchFromSfccApi()',
          detail: `SFCC responded with status ${sfccRes.status} and Content-Type '${contentType}' while fetching from endpoint /${pathSuffix}.`,
          response: {
            server: sfccRes.headers.get('server'),
          },
        },
      })
    }

    // To avoid crashed app because of unavailable Custom API
    return isText || isTextInResponse ? sfccRes.text() : sfccRes.json()
  } else {
    const errMsg = `Error fetching from SFCC for endpoint /${pathSuffix}.`
    console.error({
      error: errMsg,
      context: {
        request: req,
        sfccRes: sfccRes,
        caller: 'fetchFromSfccApi()',
        detail: `SFCC responded with status ${sfccRes.status} while fetching from endpoint /${pathSuffix}.`,
        response: {
          server: sfccRes.headers.get('server'),
        },
      },
    })
    return isText ? '' : {}
  }
}

export function applyUpstreamIPToHeaders(req, headers) {
  if (req.headers['true_client_insta']) {
    headers['UpstreamIP'] = req.headers['true_client_insta']
  }
}
