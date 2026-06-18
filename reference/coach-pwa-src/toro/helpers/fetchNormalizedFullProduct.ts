import uniq from 'lodash/uniq'
import get from 'lodash/get'
import { API_GET_PRODUCTS } from 'toro/constants/Urls'
import { NextApiRequest } from 'next'
import { fetchFromServerSideWithCorrId } from 'helpers/fetchFromServerSide'
import getLocaleFromReq from 'helpers/getLocaleFromReq'
import { getTraceabilityConfig } from 'helpers/traceability'

interface FetchProductsOptions {
  includeInventory?: boolean
}

export async function fetchNormalizedFullProductsData(
  req: NextApiRequest,
  ids: string[],
  options?: FetchProductsOptions
) {
  const locale = getLocaleFromReq(req)
  const correlationId = getTraceabilityConfig(req)
  const { includeInventory = false } = options || {}

  const fetchIds = [...ids]
  const filteredFetchIds = uniq(fetchIds.filter(Boolean).sort())
  if (!filteredFetchIds.length) {
    return []
  }
  const localeQuery = `&locale=${locale}`
  let url = `/api${API_GET_PRODUCTS}?ids=${filteredFetchIds.join(',')}${
    includeInventory ? '&includeInventory=true' : ''
  }${localeQuery}`

  const response = await fetchFromServerSideWithCorrId(req, url, { correlationId })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(`Error in fetching Normalized Full Product Data`, err))
  const productsData = get(response, 'productsData', [])

  return productsData
}
