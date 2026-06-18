import getClient from 'lib/sales-force-connector/client'
import { parseJsonField } from 'toro/helpers/plp'
import getLocaleFromReq from 'helpers/getLocaleFromReq'
import get from 'lodash/get'
import type { NextApiRequest } from 'next'
import type { MatchingExperienceConfig } from 'store/matching-experience'

/**
 * Fetches the matchingExperience config from the SFCC homePageConfigs custom object.
 * Used on the retail HP (api/index.js) and CLP sub-brand HPs (shop/[...slug].ts).
 * Returns null on SFCC error or when the custom object is not yet configured.
 */
function fetchMatchingExperienceConfig(
  req: NextApiRequest
): Promise<Record<string, MatchingExperienceConfig> | MatchingExperienceConfig | null> {
  const locale = getLocaleFromReq(req, false)
  return Promise.resolve()
    .then(() => getClient(req))
    .then((client) => client.getMatchingExperienceConfig({ locale }))
    .then((data) => parseJsonField(get(data, 'c_matchingExperience'), null))
    .catch((e) => {
      console.error('[homePageConfigs] Error fetching matchingExperience config:', e)
      return null
    })
}

export default fetchMatchingExperienceConfig
