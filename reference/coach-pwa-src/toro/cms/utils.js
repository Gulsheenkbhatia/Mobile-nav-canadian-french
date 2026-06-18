export const transformSfccUrl = (url, siteId) => {
  if (!url) return null
  const pathname = url.pathname.replace(/Sites-Site\/.*\/(.*)$/, `Sites-${siteId}-Site/en_US/$1`)
  return `${pathname}${url.search}`
}

export function processLazyLoadingElements($, context, selector) {
  const $context = context?.find ? context : $(context)

  $context?.find(selector).each((idx, element) => {
    const $item = $(element)
    const lazySrc = $item.attr('src') || $item.attr('srcset')
    if (lazySrc) {
      $item.attr('data-src', lazySrc)
      $item.attr('data-srcset', lazySrc)
      $item.removeAttr('src')
      $item.removeAttr('srcset')
    }
  })
}

export function closeHotspotATBTooltip() {
  const hotspotIconActive = document.querySelector('.hotspot-icon.active')
  if (hotspotIconActive) {
    hotspotIconActive.classList.remove('active')
  }
  const globalTooltip = document.querySelector('.global-tooltip.active')
  if (globalTooltip) {
    globalTooltip.classList.remove('active')
    globalTooltip.innerHTML = ''
  }
}

export function isSafeUrl(url) {
  if (!url) return false
  if (/^(https?:\/\/|mailto:|tel:|\/)/.test(url)) return true
  if (/^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(url) && !url.includes(':')) return true
  return false
}

export function sanitizeUrl(url) {
  if (!url) return undefined
  return isSafeUrl(url) ? url : undefined
}
