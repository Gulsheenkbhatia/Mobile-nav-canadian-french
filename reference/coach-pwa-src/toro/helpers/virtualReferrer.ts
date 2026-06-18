export function storeVirtualReferrer(url: string): void {
  if (!window?.localStorage) {
    return
  }
  localStorage.setItem('mw_virtual_referrer', url)
}

export function storeLastVisitedUrl(url: string): void {
  if (!window?.localStorage) {
    return
  }
  localStorage.setItem('mw_last_visited_url', url)
}

export function getIsPaginatedPlpReload(prevUrlStr, currentUrlStr): boolean {
  if (
    !prevUrlStr ||
    !currentUrlStr ||
    !prevUrlStr.includes('/shop/') ||
    !prevUrlStr.includes('page=')
  ) {
    return false
  }
  const prevUrl = new URL(prevUrlStr)
  const currentUrl = new URL(currentUrlStr)
  if (prevUrl.pathname !== currentUrl.pathname) {
    return false
  }
  const prevParams = Object.fromEntries(prevUrl.searchParams)
  const currentParams = Object.fromEntries(currentUrl.searchParams)
  const missingParam = Object.keys(prevParams)
    .filter((key) => key !== 'page')
    .find((key) => prevParams[key] !== currentParams[key])
  return !missingParam
}

export function getCurrentReferrer(): string {
  const referrerFromStorage = localStorage.getItem('mw_virtual_referrer')
  const lastVisitedUrl = localStorage.getItem('mw_last_visited_url')
  const isPaginatedPlpReload = getIsPaginatedPlpReload(lastVisitedUrl, window.location.href)
  const isPreviousPageSpa = !!window?.history?.state

  if (!isPreviousPageSpa && isPaginatedPlpReload && lastVisitedUrl) {
    localStorage.setItem('mw_virtual_referrer', lastVisitedUrl)
    return lastVisitedUrl
  }

  // use virtual referrer from storage if previous page was SPA
  if (isPreviousPageSpa && referrerFromStorage) {
    return referrerFromStorage
  }
  // otherwise use default document.referrer and store it's value as a virtual referrer
  localStorage.setItem('mw_virtual_referrer', window.document.referrer)
  return window.document.referrer
}
