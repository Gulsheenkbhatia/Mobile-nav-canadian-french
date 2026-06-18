import size from 'lodash/size'
import { getAvailableRefinementsFromQueryParams } from 'toro/helpers/refinements'

/**
 * Builds the filters object, which looks like this:
 * [
 *  {
 *    id: 'colorVal',
 *    values: ['Red', 'Green', 'Blue']
 *  },
 *  {
 *    id: 'gender',
 *    values: ['Woman']
 *  }
 * ]
 * @param params {object} Query params object.
 * @returns {{id: string, values: string}[]}
 */
export default function getFiltersFromQueryParams(params) {
  const filteredParams = getAvailableRefinementsFromQueryParams(params)
  if (!size(filteredParams)) {
    return []
  }

  const out = []
  const entries = Object.entries<string>(filteredParams)
  for (const [key, value] of entries) {
    if (key.includes('prefv')) {
      continue
    }
    if (key.includes('prefn')) {
      const prefIndex = key.substring(5)
      const prefValue = filteredParams[`prefv${prefIndex}`]
      if (prefValue) {
        out.push({
          id: value,
          values: prefValue.split('|'),
        })
      }
    } else {
      out.push({
        id: key,
        values: value.split('|'),
      })
    }
  }
  return out
}
