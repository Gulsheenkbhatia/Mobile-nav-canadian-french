import find from 'lodash/find'
import { getSitePreviewConfigFromReq } from './sitePreview'

export default function getSourceCodeParam(req) {
  const { src } = req.query || {}
  if (src) {
    return src
  }

  const cookies = req.cookies
  const dwSourceCodeCookieValue = find(cookies, (value, key) => key.includes('dwsourcecode_'))
  if (dwSourceCodeCookieValue?.split('|')?.[0]) {
    return dwSourceCodeCookieValue?.split('|')?.[0]
  }

  const sitePreviewConfig = getSitePreviewConfigFromReq(req)
  return sitePreviewConfig?.['source-code']
}
