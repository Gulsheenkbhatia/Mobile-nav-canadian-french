import isBrowser from 'toro/helpers/isBrowser'
import get from 'lodash/get'
import { getInjectScriptOnce, getInjectStyleOnce } from 'toro/cms/helpers/getInjectOnce'

export default function getInjectJquery(buildId) {
  const injectScriptOnce = getInjectScriptOnce(buildId)
  const injectStyleOnce = getInjectStyleOnce(buildId)

  return async ({ modal } = {}) => {
    if (!isBrowser()) {
      return
    }
    if (!window?.Splide) {
      injectScriptOnce('/scripts/splide.min.js?')
    }
    if (typeof window.$ === 'undefined') {
      await injectScriptOnce('/scripts/jquery.min.js?')
    }

    if (!get(window, '$.fn.modal') && modal) {
      // TM-10374
      await injectScriptOnce('/scripts/bootstrap.min.js')
      await injectStyleOnce('/styles/bootstrap.min.css')
    }
  }
}
