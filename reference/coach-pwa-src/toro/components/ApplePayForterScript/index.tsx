import usePreference from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai/utils'
import { alterCtaToShowAtom, AlterCtaToShow } from 'store/pdp.atom'
import { isApplePayAvailable } from 'toro/components/PaymentWidget/helpers'

const ApplePayForterScript = dynamic(
  () => import('toro/components/ApplePayForterScript/ApplePayForterScript'),
  {
    ssr: false,
  }
)

const ApplePayForterScriptWrapper = () => {
  const {
    applePayConfigs: { forterSiteID = '' },
  } = usePreference({
    applePayConfigs: ['forterSiteID'],
  })
  const alterCtaToShow = useAtomValue(alterCtaToShowAtom)

  if (!forterSiteID || !isApplePayAvailable() || alterCtaToShow === AlterCtaToShow.BUYNOW)
    return null

  return <ApplePayForterScript forterSiteID={forterSiteID} />
}

export default ApplePayForterScriptWrapper
