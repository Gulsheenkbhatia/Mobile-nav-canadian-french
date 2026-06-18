import { isJapan } from 'toro/helpers/localization'
import withCorrId from 'helpers/traceability'

export const LIMIT = 5

const fetchWithCorrId = withCorrId()

export const getStores = (productId) =>
  fetchWithCorrId(`/api/stores/get-stores?products=${productId}`).then((res) => res.json())

export const getSearchResults = (productId, zipCode, page = 0) =>
  fetchWithCorrId(
    `/api/stores/get-stores?products=${productId}&zipCode=${zipCode}&startFrom=${page * LIMIT}`
  ).then((res) => res.json())

export const getZipCode = (siteId) => {
  if (typeof localStorage === 'undefined') {
    return null
  }
  try {
    let storedZipCode = localStorage.getItem('bopis_last_zipCode')
    //this condition is for zipcode format
    //In japan zipcode format is 000-0000 and in NA its 00000
    if (!isJapan(siteId) && !siteId.includes('_ca_')) {
      const startsWithZero = storedZipCode?.[0] === '0'
      if (!startsWithZero && storedZipCode) {
        return JSON.parse(storedZipCode)
      }
    }
    return storedZipCode
  } catch (e) {
    console.error(e)
  }
}

export const getAnalyticsOnClickAddToCart = () => {}
