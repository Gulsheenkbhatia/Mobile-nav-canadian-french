import { API_GET_GLOBAL_CONTENT } from 'toro/constants/Urls'
import { fetchFromServerSideWithCorrId } from 'helpers/fetchFromServerSide'

export default async function fetchGlobalContent(req, ids, options = {}, locale) {
  if (!req || !ids?.length) {
    return ''
  }
  const localeObj = locale ? { locale } : {}
  const queryParams = { ids, ...localeObj }
  const { src, brand, isCachingDisabled } = options
  if (src) {
    queryParams.src = src
  }
  if (brand) {
    queryParams.brand = brand
  }
  if (isCachingDisabled) {
    queryParams.cache = 'false'
  }
  const query = new URLSearchParams(queryParams).toString()
  try {
    const result = await fetchFromServerSideWithCorrId(req, `${API_GET_GLOBAL_CONTENT}?${query}`, {
      headers: { cookie: req.headers.cookie },
    }).then((res) => res?.text())
    return result
  } catch (e) {
    console.error(e)
    return ''
  }
}
