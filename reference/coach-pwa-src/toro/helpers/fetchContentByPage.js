import { appendPreviewParams, getSitePreviewConfigFromReq } from 'toro/helpers/sitePreview'
import getSourceCodeParam from 'toro/helpers/getSourceCodeParam'
import authToken from 'toro/helpers/getBase64AuthToken'
import { requestLogger, responseLogger } from 'helpers/logger'

const fetchContentByPage = async (req, path, isHeadless = true, bypassPreference) => {
  if (!path) {
    return ''
  }

  try {
    const url = new URL(`https://${process.env.SFCC_BACKEND_DOMAIN_US}/${path}`)
    if (isHeadless) {
      url.searchParams.set('fmt', 'headless')
    } else {
      // force SFCC hit if 'headless' is missing
      url.searchParams.set('moov_rt', 'SFCC')
    }
    if (bypassPreference) {
      url.searchParams.set(bypassPreference, true)
    }
    const src = getSourceCodeParam(req)
    const sitePreviewConfig = getSitePreviewConfigFromReq(req)
    const urlStr = appendPreviewParams(url, sitePreviewConfig, src)
    console.log(`fetchContentByPage API Call ${urlStr}`)
    const opt = {
      headers: {
        Authorization: `Basic ${authToken}`,
        'Content-Type': 'application/json',
        Cookie: req.headers['cookie'],
      },
    }
    requestLogger(urlStr, opt)
    const res = await fetch(urlStr, opt)
    responseLogger(res)
    return await res.text()
  } catch (err) {
    console.log(err)
    return ''
  }
}

export default fetchContentByPage
