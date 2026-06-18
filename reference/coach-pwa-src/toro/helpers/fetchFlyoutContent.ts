import withCorrId from 'helpers/traceability'
import {
  API_FLYOUT_SHOW_FORGOT_PASSWORD,
  API_FLYOUT_SHOW_LOGIN,
  API_FLYOUT_SHOW_REGISTER,
} from 'toro/constants/Urls'

/**
 * Fetches the flyout content from SFCC through the internal API handler.
 * @param {string:'login'|'register'|'forgot-password'} type Content type to fetch, can be 'login', 'register' or 'forgot-password'.
 * @param {Object} options
 * @param {string} options.referrer URL path for referrer, usually a product path with or without query parameters.
 * @param {boolean} options.registerFlyout Whether to add this query parameter to the referrer path.
 * @param {boolean} options.resetPasswordFlyout Whether to add this query parameter to the referrer path.
 * @returns {Promise<*|{}>}
 */
const fetchFlyoutContent = async (type: string, options: object = {}) => {
  let url = ''
  switch (type) {
    case 'register':
      url = API_FLYOUT_SHOW_REGISTER
      break
    case 'forgot-password':
      url = API_FLYOUT_SHOW_FORGOT_PASSWORD
      break
    default:
      // and 'login'
      url = API_FLYOUT_SHOW_LOGIN
  }

  const urlSearchParams = new URLSearchParams()
  Object.keys(options).forEach((key) => {
    urlSearchParams.append(key, options[key])
  })
  const paramsStr = urlSearchParams.toString()
  if (paramsStr) {
    url += `?${paramsStr}`
  }
  const fetchWithCorrId = withCorrId()
  const response = await fetchWithCorrId(url)
  const result = await response.json()
  if (response.ok) {
    return result
  }
  return {}
}

export default fetchFlyoutContent
