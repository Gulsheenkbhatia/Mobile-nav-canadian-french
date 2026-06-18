import getClient from 'lib/sales-force-connector/client'
import getLocaleFromReq from 'helpers/getLocaleFromReq'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'

/**
 * Encodes an object into a query string parameter value
 * Accepts both formats:
 * - { charms: ["CX180-B4/B4", "CE745-BRS"], straps: ["77840-B4P1Y", "77840-LHP1Y"] }
 * - { charms: "CX180-B4/B4,CE745-BRS", straps: "77840-B4P1Y,77840-LHP1Y" }
 * Transforms into "charms:CX180-B4/B4,CE745-BRS;straps:77840-B4P1Y,77840-LHP1Y"
 * and then URI encodes it
 */
export const encodeAccessorizeItParam = (obj: Record<string, string[] | string>): string => {
  if (!isObject(obj)) {
    return ''
  }

  const encodedParts = Object.entries(obj)
    .reduce((acc, [key, value]) => {
      const idsString = isArray(value) ? value.join(',') : value
      return idsString ? [...acc, `${key}:${idsString}`] : acc
    }, [])
    .join(';')

  return encodeURIComponent(encodedParts)
}

/**
 * Decodes a query string parameter value back into an object
 * Transforms "charms:CX180-B4/B4,CE745-BRS;straps:77840-B4P1Y,77840-LHP1Y"
 * into { charms: ["CX180-B4/B4", "CE745-BRS"], straps: ["77840-B4P1Y", "77840-LHP1Y"] }
 * Always returns arrays for consistency
 */
export const decodeAccessorizeItQueryParam = (encodedValue: string): Record<string, string[]> => {
  if (!isString(encodedValue)) {
    return {}
  }

  try {
    const decodedValue = decodeURIComponent(encodedValue)

    if (!decodedValue) {
      return {}
    }

    const parts = decodedValue.split(';')

    const result = parts.reduce((acc, part) => {
      const [key, value] = part.split(':')
      if (key && value) {
        const ids = value.split(',')
        if (ids.length) {
          return {
            ...acc,
            [key]: ids,
          }
        }
      }
      return acc
    }, {})

    return result
  } catch (error) {
    console.warn('Failed to decode query parameter:', error)
    return {}
  }
}

export async function fetchMinProductsFromCCApi(ids, req) {
  const locale = getLocaleFromReq(req)
  const ccapiClient = await getClient(req)
  const minProductsData = await ccapiClient.getMinProducts({
    c_productIDs: ids,
    locale,
  })
  return minProductsData
}
