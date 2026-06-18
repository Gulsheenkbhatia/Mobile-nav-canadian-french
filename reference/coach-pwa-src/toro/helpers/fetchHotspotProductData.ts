import getAPIURL from 'helpers/getAPIURL'
import { requestLogger } from 'helpers/logger'

export const fetchHotspotProductData = (ids, authToken, signal) => {
  const params = new URLSearchParams({
    ids,
  })
  const options = {
    credentials: 'include' as RequestCredentials,
    headers: {
      'Ccapi-Authorization': authToken,
    },
    signal,
  }
  const url = getAPIURL(`/get-cms-products-data?${params.toString()}`)
  requestLogger(url, options)
  return fetch(url, options)
}
