import { NextApiRequest } from 'next'
import isString from 'lodash/isString'
import { fetchFromServerSideWithCorrId } from 'helpers/fetchFromServerSide'

/**
 * Checks for valid asset ids and fetches from internal API.
 * Returns empty object for invalid ids.
 * @param req - route request
 * @param ids - array of asset ids
 */
const fetchContentAssets = async (req: NextApiRequest, ids: string[]): Promise<any> => {
  if (Array.isArray(ids) && ids.length) {
    const filteredIds = ids.filter((id) => {
      if (!isString(id)) {
        return false
      }
      const trimmed = id.trim()
      return trimmed !== 'undefined' && trimmed.length > 0
    })
    if (filteredIds.length) {
      return await fetchFromServerSideWithCorrId(
        req,
        `/api/get-content-assets?ids=${encodeURIComponent(`${filteredIds}`)}`
      ).then((contentRes) => contentRes.json())
    }
  }
  return {}
}

export default fetchContentAssets
