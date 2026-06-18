import { VERSION_PARAM } from 'helpers/addVersion'
import insertScript from 'toro/helpers/scriptLoader'
import insertStyle from 'toro/helpers/styleLoader'
import isBrowser from 'toro/helpers/isBrowser'

const promises = {}

export function getInjectScriptOnce(buildId) {
  return (url, options = {}) => {
    if (!isBrowser()) {
      return
    }

    if (!promises[url]) {
      const versionedUrl = `${url}${url.includes('?') ? '&' : '?'}${VERSION_PARAM}=${buildId}`
      promises[url] = insertScript(versionedUrl, options).catch((error) => {
        promises[url] = null
        throw error
      })
    }
    return promises[url]
  }
}

export function getInjectStyleOnce(buildId) {
  return (url) => {
    if (!isBrowser()) {
      return
    }

    if (!promises[url]) {
      const versionedUrl = `${url}${url.includes('?') ? '&' : '?'}${VERSION_PARAM}=${buildId}`
      promises[url] = insertStyle(versionedUrl).catch((error) => {
        promises[url] = null
        throw error
      })
    }
    return promises[url]
  }
}
