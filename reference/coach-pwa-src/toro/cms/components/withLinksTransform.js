import cheerio from 'toro/lib/cheerio'
import { transformSfccUrl } from 'toro/cms/utils'

const withLinksTransform = (html = '', { siteId, skipLazy = false }) => {
  const ocapiDomain = process.env.OCAPI_BASE_URL
  if (!ocapiDomain || !siteId) {
    return html
  }

  const $ = cheerio.load(html)
  $('a[target="_blank"]').each((index, link) => {
    const $link = $(link)
    $link.attr('rel', 'noopener noreferrer')
  })

  $(`a[href*="${ocapiDomain}"]`).each((idx, item) => {
    const $item = $(item)
    try {
      const url = new URL($item.attr('href'))
      if (url.hostname === ocapiDomain) {
        $item.attr('href', transformSfccUrl(url, siteId))
      }
    } catch (e) {
      console.warn('Transform link error', e)
    }
  })

  if (skipLazy) {
    return $.html()
  }

  // make all images lazy loaded by default
  // on SSR we will eagerly load them when needed
  $(
    'img[data-loading=lazy], picture[data-loading=lazy] source, video[data-loading=lazy] source'
  ).each((idx, el) => {
    const $el = $(el)
    const src = $el.attr('src')
    const dataSrc = $el.attr('data-src')
    const srcset = $el.attr('srcset')
    const isImage = $el.prop('tagName')?.toLowerCase() === 'img'

    if (src && !dataSrc) {
      $el.attr('data-src', src)
      $el.removeAttr('src')
    }

    if (dataSrc && !src && !isImage) {
      $el.attr('src', dataSrc)
      $el.removeAttr('data-src')
    }

    if (srcset) {
      $el.attr('data-srcset', srcset)
      $el.removeAttr('srcset')
    }
  })

  return $.html()
}

export default withLinksTransform
