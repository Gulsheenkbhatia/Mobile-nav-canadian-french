import { COOKIE_SITE_PREVIEW } from 'toro/constants/cookies'
import { derivePreviewConfig } from 'toro/helpers/sitePreview'
import get from 'lodash/get'

export default function getSitePreview(req) {
  try {
    const previewCookie = JSON.parse(get(req, `cookies.${COOKIE_SITE_PREVIEW}`, '{}'))
    return derivePreviewConfig(get(req, 'query', {}), previewCookie) || {}
  } catch (_) {
    return {}
  }
}
