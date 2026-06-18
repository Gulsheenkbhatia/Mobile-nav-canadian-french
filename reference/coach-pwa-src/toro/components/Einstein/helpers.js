import Cookies from 'js-cookie'
import { DW_ANONYMOUS } from 'toro/constants/cookies'
import { requestLogger, responseLogger } from 'helpers/logger'

const getDWCookie = () => {
  const allCookies = Cookies.get()
  const cookies = Object.keys(allCookies)
  let dwCookie = ''
  cookies?.forEach((c) => {
    if (!dwCookie && c.includes(DW_ANONYMOUS)) {
      dwCookie = allCookies[c]
    }
  })
  return dwCookie
}

export const sendViewProduct = async ({ url, einsteinSiteId, einsteinClientId, productId }) => {
  try {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        product: {
          id: productId,
        },
        cookieId: getDWCookie(),
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-cq-client-id': einsteinClientId,
      },
    }
    url = `${url}/activities/${einsteinSiteId}/viewProduct`
    requestLogger(url, options)
    const response = await fetch(url, options)
    responseLogger(response)
    const res = await response?.json()
    if (res) return true
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const fetchRecommendations = async ({
  url,
  einsteinSiteId,
  einsteinClientId,
  products = [],
  categories = [],
  recommender,
}) => {
  try {
    const body = {
      ...(products?.length ? { products } : {}),
      ...(categories?.length ? { categories } : {}),
      cookieId: getDWCookie(),
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-cq-client-id': einsteinClientId,
      },
    }
    url = `${url}/personalization/recs/${einsteinSiteId}/${recommender}`
    requestLogger(url, options)
    const response = await fetch(url, options)
    responseLogger(response)
    return await response?.json()
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const sendViewReco = async ({
  url,
  einsteinSiteId,
  einsteinClientId,
  products,
  recommenderName,
  recoUUID,
}) => {
  try {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        products,
        recommenderName,
        recoUUID,
        cookieId: getDWCookie(),
      }),
      headers: {
        'x-cq-client-id': einsteinClientId,
        'Content-Type': 'application/json',
      },
    }
    url = `${url}/activities/${einsteinSiteId}/viewReco`
    requestLogger(url, options)
    const response = await fetch(url, options)
    responseLogger(response)
    const res = await response?.json()
    if (res) return true
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const sendClickReco = async ({
  url,
  einsteinSiteId,
  einsteinClientId,
  id,
  recommenderName,
  recoUUID,
}) => {
  try {
    const response = await fetch(`${url}/activities/${einsteinSiteId}/clickReco`, {
      method: 'POST',
      body: JSON.stringify({
        product: {
          id,
        },
        recommenderName,
        __recoUUID: recoUUID ? recoUUID : '',
        cookieId: getDWCookie(),
      }),
      headers: {
        'x-cq-client-id': einsteinClientId,
        'Content-Type': 'application/json',
      },
    })
    const res = await response?.json()
    if (res) return true
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const sendAddToCart = async ({ url, einsteinSiteId, einsteinClientId, product }) => {
  try {
    const response = await fetch(`${url}/activities/${einsteinSiteId}/addToCart`, {
      method: 'POST',
      body: JSON.stringify({
        products: [product],
        cookieId: getDWCookie(),
      }),
      headers: {
        'x-cq-client-id': einsteinClientId,
        'Content-Type': 'application/json',
      },
    })
    const res = await response?.json()
    if (res) return true
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const appendRrecParam = (url) => {
  if (!url) return url

  const parsedUrl = new URL(url)
  parsedUrl.searchParams.set('rrec', 'true')

  return parsedUrl.toString()
}
