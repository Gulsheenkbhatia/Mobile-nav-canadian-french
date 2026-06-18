import getAPIURL from 'helpers/getAPIURL'
import withCorrId from 'helpers/traceability'
import { NextApiRequest } from 'next'
import { stringifyQueryParams } from 'toro/helpers/url'
import { fetchFromServerSideWithCorrId } from 'helpers/fetchFromServerSide'
import authToken from 'toro/helpers/getBase64AuthToken'

type FetchPreferencesPayload = {
  req: NextApiRequest
  groupId?: string
  id?: string
  ids?: string[]
  all?: boolean
  grouped?: boolean
}

export default async function fetchPreferences({
  req,
  groupId,
  id,
  all,
  ids = [],
  grouped,
}: FetchPreferencesPayload) {
  try {
    const params = {
      groupId,
      preferenceId: id,
      all,
      ids: ids?.join('|'),
      grouped,
    }
    const fetchWithCorrId = withCorrId(req)
    const queryParams = stringifyQueryParams(params, { skipNulls: true, addQueryPrefix: false })
    const url = getAPIURL(`/get-site-preferences?${queryParams}`)
    const headers = {
      HeadlessHeader: authToken,
    }
    if (req) {
      return await fetchFromServerSideWithCorrId(req, url, { headers }).then((res) => res.json())
    }

    return await fetchWithCorrId(url, { headers }).then((res) => res.json())
  } catch (err) {
    console.log(err)
  }
}
