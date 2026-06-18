import omitBy from 'lodash/omitBy'
import isEmpty from 'lodash/isEmpty'
import { fetchFromServerSideWithCorrId } from 'helpers/fetchFromServerSide'

export default function fetchInternalApi(req, path, query) {
  const queryStr = new URLSearchParams(omitBy(query, isEmpty)).toString()
  const fullPath = `/api/${path}${queryStr ? '?' + queryStr : ''}`
  return fetchFromServerSideWithCorrId(req, fullPath, {
    headers: { cookie: req.headers.cookie },
  })
}
