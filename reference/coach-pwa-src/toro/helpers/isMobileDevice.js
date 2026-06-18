import isBrowser from 'toro/helpers/isBrowser'

export const isMobileRegExp = (userAgent = '') =>
  userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)

const isMobileDevice = () => {
  if (isBrowser()) {
    return Boolean(
      isMobileRegExp(navigator.userAgent) ||
        (navigator.maxTouchPoints &&
          navigator.maxTouchPoints > 2 &&
          /MacIntel/.test(navigator.platform))
    )
  }

  return false
}

export const isMobileDeviceServer = (userAgent = '') => {
  if (!userAgent) return false

  return Boolean(isMobileRegExp(userAgent))
}
export const isAppleDevice = () => {
  if (isBrowser()) {
    const userAgent = navigator.userAgent
    return /iPhone|iPad|iPod|Macintosh/i.test(userAgent)
  }
  return false
}

export const isAndroidDevice = () => {
  if (isBrowser()) {
    return /Android/i.test(navigator.userAgent)
  }
  return false
}

export default isMobileDevice
