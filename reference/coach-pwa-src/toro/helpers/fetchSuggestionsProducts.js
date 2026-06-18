import getAPIURL from 'helpers/getAPIURL'
import _fetch from 'helpers/fetch'
import { fetchLatest } from 'toro/helpers/fetchLatest'
import { API_GET_SUGGESTIONS_PRODUCTS } from 'toro/constants/Urls'

const fetch = fetchLatest(_fetch)

export default async function fetchSuggestionsProducts(ids = [], requestOptions = {}) {
  if (!ids?.length) {
    return []
  }

  try {
    const url = getAPIURL(`${API_GET_SUGGESTIONS_PRODUCTS}?ids=${ids.join(',')}`)
    return fetch(url, requestOptions).then((res) => (res ? res.json() : {}))
  } catch (err) {
    console.log(err)
  }
}
