import get from 'lodash/get'

import getAPIURL from 'helpers/getAPIURL'
import fetch from 'helpers/fetch'
import localStorage from 'toro/helpers/localStorage'
import { createBasket, getBaskets } from 'lib/salesforce-ocapi/ocapi-helpers'
import Cookies from 'js-cookie'
import {
  SLAS_GUEST_USER,
  SLAS_SIGNED_IN_USER,
  SLAS_PASSWORD_LESS_USER,
} from 'toro/constants/SlasCookiesUsers'
import getUsidHeader from 'toro/helpers/getUsidHeader'

export const getPayload = (bearerToken) => {
  if (!bearerToken) {
    return null
  }
  const token = bearerToken.replace('Bearer ', '')
  const payloadB64 = token.split('.')[1]

  let payload = null
  try {
    payload = JSON.parse(window.atob(payloadB64))
  } catch (e) {
    console.error(`Error while parsing token ${e.message}`)
  }

  return payload
}

export const checkExpired = (token) => {
  if (token) {
    const payload = getPayload(token)
    return payload ? payload.exp : null
  }
  return null
}

export const isExpired = (token) => {
  if (token && checkExpired(token)) {
    const expiration = checkExpired(token)
    const now = new Date().getTime() / 1000
    return expiration - now < 600
  }
  return true
}

export const isGuestSession = (token) => {
  if (!token) {
    return true
  }
  try {
    const payload = getPayload(token)
    const sub = JSON.parse(payload.sub)
    return get(sub, 'customer_info.guest', true)
  } catch (e) {
    console.error(e.message)
    return true
  }
}

const generateAuthToken = async () => {
  const apiUrl = getAPIURL(`/get-new-auth-token`)
  const refreshed = await fetch(apiUrl, {
    credentials: 'include',
    headers: getUsidHeader(),
  })

  if (!refreshed?.fault) {
    const data = await refreshed.json()
    return get(data, 'bearerToken')
  }

  return null
}

const generateSlasAuthToken = async (refreshTokenCookie, isPasswordless) => {
  let refreshedSlas = null
  const apiUrl = getAPIURL(
    `/get-slas-refresh-access-token?refresh_token=${refreshTokenCookie}${
      isPasswordless ? '&passwordless=true' : ''
    }`
  )
  refreshedSlas = await fetch(apiUrl, {
    credentials: 'include',
    headers: getUsidHeader(),
  }).then((res) => res.json())
  if (refreshedSlas?.error) {
    const { error, status, message } = refreshedSlas
    if (status === 400) {
      refreshedSlas = await generateAuthToken()
    } else {
      throw new RequestError({
        message: message || 'Error occurred when attempting to create new guest session',
        error,
        status,
      })
    }
  }

  return refreshedSlas
}

export const getSlasCookie = () => {
  if (Cookies.get(SLAS_GUEST_USER)) {
    return {
      slasCookieValue: Cookies.get(SLAS_GUEST_USER),
      slasCookieName: SLAS_GUEST_USER,
      isPasswordless: false,
    }
  } else if (Cookies.get(SLAS_SIGNED_IN_USER)) {
    return {
      slasCookieValue: Cookies.get(SLAS_SIGNED_IN_USER),
      slasCookieName: SLAS_SIGNED_IN_USER,
      isPasswordless: false,
    }
  } else if (Cookies.get(SLAS_PASSWORD_LESS_USER)) {
    return {
      slasCookieValue: Cookies.get(SLAS_PASSWORD_LESS_USER),
      slasCookieName: SLAS_PASSWORD_LESS_USER,
      isPasswordless: true,
    }
  }

  return {
    slasCookieValue: null,
    slasCookieName: null,
    isPasswordless: false,
  }
}

export const getSlasToken = async () => {
  let token = window && window.sessionStorage && window.sessionStorage.getItem('token')
  const { slasCookieValue, slasCookieName, isPasswordless } = getSlasCookie()

  if (isTokenValid(token)) {
    if (isExpired(token) || needsRefresh(token)) {
      if (slasCookieValue) {
        const refreshedSlas = await generateSlasAuthToken(slasCookieValue, isPasswordless)
        if (refreshedSlas.refresh_token) {
          Cookies.set(slasCookieName, refreshedSlas.refresh_token, { expires: 7776000 })
        }

        token = get(refreshedSlas, 'token', refreshedSlas)
        setToken(token)
        return { token }
      } else {
        const fetchOpts = {
          method: 'POST',
        }

        const { cart, bearerToken, ...newSessionData } = await fetch(
          getAPIURL(`/session?force=true`),
          fetchOpts
        ).then((res) => res.json())

        setToken(bearerToken)

        return {
          token: bearerToken,
          newBasket: get(cart, 'baskets.0', {}),
          newSessionData: {
            cart,
            bearerToken,
            ...newSessionData,
          },
        }
      }
    } else {
      return { token }
    }
  } else {
    // Generate new token
    if (slasCookieValue) {
      const refreshedSlas = await generateSlasAuthToken(slasCookieValue, isPasswordless)
      if (slasCookieName && refreshedSlas.refresh_token) {
        Cookies.set(slasCookieName, refreshedSlas.refresh_token, { expires: 7776000 })
      }
      token = get(refreshedSlas, 'token', refreshedSlas)
      setToken(token)
      return { token }
    } else {
      token = await generateAuthToken()
      setToken(token)
      return { token }
    }
  }
}

export const getToken = async () => {
  let token = window && window.sessionStorage && window.sessionStorage.getItem('token')

  if (isTokenValid(token)) {
    const isGuest = isGuestSession(token)

    if (isExpired(token)) {
      // Get new session and restore basket for only guest users
      const fetchOpts = {
        method: 'POST',
      }

      const localBasket = localStorage.getItem('sfcc_basket')
      if (isGuest && localBasket) {
        try {
          const basket = JSON.parse(localBasket)
          fetchOpts.body = JSON.stringify({
            sfccBasket: basket,
          })
        } catch (error) {
          console.warn('Error parsing local basket')
        }
      }

      const { cart, bearerToken, ...newSessionData } = await fetch(
        getAPIURL(`/session?force=true`),
        fetchOpts
      ).then((res) => res.json())

      localStorage.removeItem('sfcc_basket')

      setToken(bearerToken)

      return {
        token: bearerToken,
        newBasket: get(cart, 'baskets.0', {}),
        newSessionData: {
          cart,
          bearerToken,
          ...newSessionData,
        },
      }
    } else if (!isGuest && needsRefresh(token)) {
      // Refresh customer's session with bearerToken
      const apiUrl = getAPIURL(`/refresh-auth-token?token=${token}`)
      const refreshed = await fetch(apiUrl, {
        credentials: 'include',
        headers: getUsidHeader(),
      }).then((res) => res.json())
      token = get(refreshed, 'bearerToken')
      setToken(token)
      return { token }
    } else {
      return { token }
    }
  } else {
    token = await generateAuthToken()
    setToken(token)
    return { token }
  }
}

export const setToken = (token) => {
  if (isTokenValid(token)) {
    window && window.sessionStorage.setItem('token', token)
  }
}

const isTokenValid = (token) => {
  return !(typeof token === 'undefined' || token === null || token === 'undefined' || token === '')
}

export const needsRefresh = (token) => {
  if (token) {
    const expiration = checkExpired(token)
    const now = new Date().getTime() / 1000
    // Refresh when JWT has 15 minutes to expire
    return expiration - now < 900
  }
  return true
}

export function RequestError(error) {
  const { status, message, fault, context = {} } = error

  return {
    status,
    message,
    context,
    error: fault,
  }
}

export const getUserBaskets = async ({ customerId, token, sfccBasket }) => {
  const handleError = (baskets, { message, context }) => {
    throw new RequestError({
      message: message || 'Error occurred when attempting to fetch user existing basket',
      fault: baskets?.fault,
      status: baskets?.status,
      context,
    })
  }

  let baskets
  try {
    baskets = await getBaskets(customerId, token)

    if (baskets?.fault) {
      handleError(baskets, {
        context: { customerId },
      })
    }

    const isNewBasketNeeded = !get(baskets, 'baskets')
    if (isNewBasketNeeded || sfccBasket) {
      baskets = await createBasket(token, sfccBasket)

      if (baskets?.fault) {
        handleError(baskets, {
          message: 'Error occurred when attempting to create a new basket for the session',
          context: { customerId },
        })

        // If basket creation off of local basket fails, simply create a new basket
        baskets = await createBasket(token)
      }

      baskets = await getBaskets(customerId, token)
      if (baskets?.fault) {
        handleError(baskets, {
          context: { customerId },
        })
      }
    }
  } catch (e) {
    console.error({
      error: e,
      context: {
        error: e,
        url: '/getUserBasketsHelper',
        section: 'Get user baskets attempt',
        response: baskets,
        ...e?.context,
      },
    })
  }
  return baskets
}

export const getProductFromCart = (productId, session) => {
  const cartItems = get(session, 'cart.product_items', [])
  const mappedCartItemByQty = cartItems.reduce(
    (m, item) =>
      m?.set(item?.product_id, {
        ...item,
        quantity: (m?.get(item?.product_id)?.quantity || 0) + item?.quantity,
      }),
    new Map()
  )

  const filterCartItem = Array.from(mappedCartItemByQty, ([, item]) => ({
    ...item,
  }))
  const productInCart = filterCartItem.find(
    (productInCart) =>
      productInCart?.product_id === productId &&
      !productInCart?.storeName &&
      !productInCart?.c_customizerId &&
      !productInCart?.c_hasEmbellishments &&
      !productInCart?.c_customizerParentId &&
      !productInCart?.c_monogrammedItem
  )

  return productInCart
}
