import Router from 'next/router'

export const COACH_DOMAIN = 'coach.com'
export const COACH_OUTLET_DOMAIN = 'coachoutlet.com'

export const oneCoachTabHeaderRedirectHandler = (
  index: number,
  sameDomain: boolean,
  utmLink: string,
  params: {
    QMSession?: string
    QMUser?: string
  } = {},
  isSubBrandActive: boolean
) => {
  const newDomain = index === 0 ? COACH_DOMAIN : COACH_OUTLET_DOMAIN
  const currentUrl = window.location.href
  const url = new URL(currentUrl)
  let newUrl = ''
  // Change the domain while keeping the same subdomain ONLY if IS_OUTLET_SUBCATEGORY is false
  const subdomain = url.hostname.split('.')[0]
  url.hostname = subdomain + '.' + newDomain
  newUrl = url.origin
  if (!sameDomain) {
    if (utmLink) {
      newUrl += utmLink
    }

    const newUrlWithParams = new URL(newUrl)
    Object.keys(params).forEach((key) => {
      const value = params[key]
      if (value) {
        newUrlWithParams.searchParams.set(key, value)
      }
    })
    newUrl = newUrlWithParams.toString()
  }

  // Perform client-side navigation if domains match and user is not on sub brand;
  // otherwise, trigger a full page reload.
  if (sameDomain && !isSubBrandActive) {
    Router.push('/')
  } else {
    window.location.href = newUrl
  }
}

export const getOutletTabRedirectData = ({
  index,
  currentUrl,
  utmLink,
  isSubBrandActive,
}: {
  index: number
  currentUrl: string
  utmLink: string
  isSubBrandActive: boolean
}) => {
  let baseUrl = ''
  let shouldReload = true

  try {
    baseUrl = new URL(currentUrl).origin
  } catch {
    baseUrl = '/'
  }
  let url = baseUrl
  if (index === 0 && !isSubBrandActive) {
    url = '/'
    shouldReload = false
  } else if (index !== 0 && utmLink) {
    url += utmLink
    shouldReload = isSubBrandActive
  }

  return {
    url,
    shouldReload,
  }
}

export const getTabIndexByClickEvent = (event) => {
  const target = event.target
  const buttonEl = target.tagName === 'button' ? target : target.closest('button')
  return buttonEl ? Number(buttonEl.dataset.index) : 0
}
