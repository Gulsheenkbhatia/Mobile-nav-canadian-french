import { isMobileDeviceServer } from 'toro/helpers/isMobileDevice'

export default function getViewportByReq(req) {
  const currentUserAgent = req?.headers['pwa-user-agent'] || req?.headers['user-agent']
  const isDesktop = req?.headers['x-0-is-desktop']
    ? req.headers['x-0-is-desktop'] === 'true'
    : !isMobileDeviceServer(currentUserAgent)
  return isDesktop ? 'desktop' : 'mobile'
}
