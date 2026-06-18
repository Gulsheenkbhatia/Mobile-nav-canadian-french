import get from 'lodash/get'
import { transformSfccUrl } from 'toro/cms/utils'

export const transformLinksOnClient = (html = '', state) => {
  const ocapiDomain = get(state, 'appData.ocapiDomain')
  const siteId = get(state, 'appData.siteId')
  if (!ocapiDomain || !siteId) {
    return html
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  if (!doc) {
    return html
  }

  doc.querySelectorAll(`a[href*="${ocapiDomain}"]`).forEach((el) => {
    const url = new URL(el.getAttribute('href'))
    if (url.hostname === ocapiDomain) {
      el.setAttribute('href', transformSfccUrl(url, siteId))
    }
  })

  // preparing data of image to support lazy loading
  doc
    .querySelectorAll('img[data-loading=lazy], picture[data-loading=lazy] source')
    .forEach((el) => {
      const lazySrc = el.getAttribute('src') || el.getAttribute('srcset')
      if (lazySrc) {
        el.setAttribute('data-src', lazySrc)
        el.setAttribute('data-srcset', lazySrc)
        el.removeAttribute('src')
        el.removeAttribute('srcset')
      }
    })

  return doc.documentElement.outerHTML
}
