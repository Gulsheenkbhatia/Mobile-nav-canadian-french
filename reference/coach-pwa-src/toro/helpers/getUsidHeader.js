import { USID } from 'toro/constants/cookies'
import Cookies from 'js-cookie'
import isBrowser from 'toro/helpers/isBrowser'
import get from 'lodash/get'
import { getSessionCookies } from 'toro/lib/salesforce-ocapi/ocapi-helpers'

export const getUsidHeader = (req = {}) => {
  let currentSessionId = ''
  if (isBrowser()) {
    currentSessionId = Cookies.get(USID)
  } else {
    const sessionCookies = getSessionCookies(req?.cookie || req?.headers?.cookie)
    currentSessionId = get(sessionCookies, 'usid')?.split('=')[1]
  }
  return !!currentSessionId ? { 'x-sid': currentSessionId } : {}
}

export default getUsidHeader
