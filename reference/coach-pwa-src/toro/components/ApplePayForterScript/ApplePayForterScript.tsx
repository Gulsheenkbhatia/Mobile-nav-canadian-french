import scriptText from 'toro/components/ApplePayForterScript/applePayForterScriptText'
import { memo } from 'react'
import Script from 'next/script'

const ApplePayForterScript = ({ forterSiteID = '' }) => {
  return (
    <Script type="text/javascript" id={forterSiteID} strategy="lazyOnload">
      {scriptText.replace('{SITE_ID}', forterSiteID)}
    </Script>
  )
}
export default memo(ApplePayForterScript)
