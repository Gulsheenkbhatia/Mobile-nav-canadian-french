import { useEffect, useContext } from 'react'
import Script from 'next/script'
import Cookies from 'js-cookie'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import SessionContext from 'toro/components/SessionContext'
import usePreference from 'toro/hooks/usePreference_new'
import { USID } from 'toro/constants/cookies'
import { sendStaffStartExternalTrackReq } from 'toro/helpers/staffStartHelper'
import { isStaffStartScriptAtom } from 'store/scripts.atom'
import get from 'lodash/get'
import { useRouter } from 'next/router'

const StaffStartScript = () => {
  const router = useRouter()
  const { session } = useContext(SessionContext)
  const sessionId = Cookies.get(USID)
  const userId = get(session, 'user.customerNumber', '')
  const staffStartScriptLoaded = useAtomValue(isStaffStartScriptAtom)
  const setStaffScriptLoaded = useUpdateAtom(isStaffStartScriptAtom)

  const {
    staffStartPreferences: { merchantId, scriptURL },
  } = usePreference({
    staffStartPreferences: ['merchantId', 'scriptURL'],
  })

  useEffect(() => {
    if (!staffStartScriptLoaded || !sessionId || !merchantId) return
    sendStaffStartExternalTrackReq({ sessionId, merchantId, userId })
  }, [sessionId, staffStartScriptLoaded, router.asPath, merchantId, userId])

  return (
    scriptURL &&
    merchantId && (
      <Script
        src={scriptURL}
        strategy="afterInteractive"
        onLoad={() => {
          setStaffScriptLoaded(true)
        }}
      />
    )
  )
}

export default StaffStartScript
