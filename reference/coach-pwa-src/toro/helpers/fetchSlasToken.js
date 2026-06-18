import fetch from 'node-fetch'
import createUrl from 'toro/lib/sales-force-connector/utils/createUrl'
import handleAuthResponse from 'toro/lib/sales-force-connector/utils/handleAuthResponse'
import { requestLogger, responseLogger } from 'helpers/logger'

const client_id = process.env.SLAS_PUBLIC_CLIENT_ID
const slasPrivateClientId = process.env.SLAS_PRIVATE_CLIENT_ID
const slasPrivateClientSecret = process.env.SLAS_PRIVATE_CLIENT_SECRET
const authToken = Buffer.from(
  `${slasPrivateClientId}:${slasPrivateClientSecret}`,
  'binary'
).toString('base64')

export const SLAS_URL_TOKEN = createUrl('shopper/auth', 'oauth2/token')

// This need to be change to amazon endpoint when it will be ready
const redirectedUri = process.env.SLAS_REDIRECT_URI

//Block for do unique code_challenge value
const CryptoJS = require('crypto-js')

function generateCodeVerifier() {
  return generateRandomString(96)
}

function generateRandomString(length) {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

function generateCodeChallenge(code_verifier) {
  return CryptoJS.SHA256(code_verifier)
}

function base64URL(string) {
  return string
    .toString(CryptoJS.enc.Base64)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

// End of block

export function getCodeFromLocationHeader(slasResponse) {
  const regExp = /(?<=code=)(.*)(?=&|)/g
  const location = slasResponse?.headers?.get('location')
  return location?.length ? location?.match(regExp)[0] : null
}

export async function fetchSlasAccessTokenWithRefreshToken(
  slasRefreshToken,
  isPasswordless = false
) {
  const refresh_token = slasRefreshToken

  const objParam = {
    grant_type: 'refresh_token',
    client_id,
    refresh_token,
  }

  const headersParam = isPasswordless
    ? {
        Authorization: `Basic ${authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    : {
        'Content-Type': 'application/x-www-form-urlencoded',
      }

  const urlSearchParams = new URLSearchParams()

  Object.keys(objParam).forEach((key) => {
    urlSearchParams?.append(key, objParam[key])
  })

  try {
    const options = {
      method: 'post',
      body: urlSearchParams.toString(),
      headers: {
        ...headersParam,
      },
    }
    requestLogger(SLAS_URL_TOKEN, options)
    const slasResponseToken = await fetch(SLAS_URL_TOKEN, options)
    responseLogger(slasResponseToken)
    const dataToken = await handleAuthResponse(slasResponseToken)

    return {
      usid: dataToken.usid,
      refresh_token: dataToken.refresh_token,
      customerIdSlas: dataToken.customer_id,
      token: `Bearer ${dataToken.access_token}`,
      expires_in: dataToken.expires_in,
      access_token: dataToken.access_token,
    }
  } catch (e) {
    const error = e.message ? `${e.status_code} ${e.message}` : 'Error fetching SLAS access token.'
    console.error(error, e)
    return { error, message: e.message, status: e.status }
  }
}

export async function fetchSlasAccessToken(req, res) {
  const verifier = base64URL(generateCodeVerifier())
  const code_challenge = base64URL(generateCodeChallenge(verifier))
  const channel_id = process.env.SITE_ID_US
  const url = createUrl('shopper/auth', 'oauth2/authorize', {
    client_id,
    redirect_uri: redirectedUri,
    hint: 'guest',
    code_challenge,
    channel_id,
  })

  try {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'manual',
    }
    requestLogger(url, options)
    const slasResponse = await fetch(url, options)
    responseLogger(slasResponse)
    const code = getCodeFromLocationHeader(slasResponse)

    if (slasResponse.status === 303 && code) {
      const urlSearchParams = new URLSearchParams({
        code,
        grant_type: 'authorization_code_pkce',
        redirect_uri: redirectedUri,
        code_verifier: verifier,
        channel_id,
        client_id,
      }).toString()

      try {
        const options = {
          method: 'post',
          body: urlSearchParams,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
        requestLogger(SLAS_URL_TOKEN, options)
        const slasResponseToken = await fetch(SLAS_URL_TOKEN, options)
        responseLogger(slasResponse)
        const dataToken = await handleAuthResponse(slasResponseToken)

        return {
          usid: dataToken.usid,
          refresh_token: dataToken.refresh_token,
          customerIdSlas: dataToken.customer_id,
          token: `Bearer ${dataToken.access_token}`,
          expires_in: dataToken.expires_in,
          access_token: dataToken.access_token,
        }
      } catch (e) {
        const error = e.message
          ? `${e.status_code} ${e.message}`
          : 'Error fetching SLAS access token.'
        console.error(error, e)
        return { error }
      }
    } else {
      const contentType = slasResponse.headers.get('content-type')
      const isJsonResponse = contentType.indexOf('application/json') !== -1
      let error
      if (isJsonResponse) {
        error = await slasResponse.json()
      } else {
        error = { message: await slasResponse.text() }
      }
      return { ...error, status: slasResponse.status }
    }
  } catch (e) {
    const error = e.message ? `${e.status_code} ${e.message}` : 'Error fetching SLAS access code.'
    console.error(error, e)
    return res.status(e.status).json({ error })
  }
}
