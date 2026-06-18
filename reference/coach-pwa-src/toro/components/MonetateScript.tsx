import Script from 'next/script'
import { TemplateName } from 'toro/constants/templates'
import usePageType from 'toro/hooks/usePageType'
import usePreference from 'toro/hooks/usePreference_new'
import useTemplate from 'toro/hooks/useTemplate'

declare global {
  interface Window {
    monetateQ: any
    monetateT: any
  }
}

const MonetateScript = () => {
  const { isPDP } = usePageType()
  const isPdpV7 = useTemplate([TemplateName.pdpv7])
  const suppressMonetateForPdpV7 = isPDP && isPdpV7
  const {
    monetate: { monetateScriptUrl },
    toggleSiteFeatures: { enableMonetate },
  } = usePreference({
    Monetate: ['monetateScriptUrl'],
    ToggleSiteFeatures: ['enableMonetate'],
  })

  return enableMonetate && monetateScriptUrl && !suppressMonetateForPdpV7 ? (
    <Script
      src={monetateScriptUrl}
      onLoad={() => {
        window.monetateT = new Date().getTime()
      }}
    />
  ) : null
}

export default MonetateScript
