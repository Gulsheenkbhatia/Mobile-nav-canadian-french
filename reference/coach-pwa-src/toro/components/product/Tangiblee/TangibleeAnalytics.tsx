import { useUpdateAtom } from 'jotai/utils'
import Script from 'next/script'
import { useCallback, useContext } from 'react'
import { isTangibleeInitializedAtom } from 'store/pdp.atom'
import { initializeAnalytics } from 'toro/helpers/tangibleeHelper'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import usePreference from 'toro/hooks/usePreference_new'
import isCA from 'toro/helpers/isCA'
import isObject from 'lodash/isObject'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'

const TangibleeAnalytics = () => {
  const setTangibleeInitialized = useUpdateAtom(isTangibleeInitializedAtom)
  const {
    tangiblee: {
      BRAND_URL,
      TANGIBLEE_ANALYTICS_SCRIPT: analyticsScriptSrc,
      TANGIBLEE_ANALYTICS_TRACKING_ID: tangibleeAnalyticTrackingId,
    },
  } = usePreference({
    Tangiblee: ['BRAND_URL', 'TANGIBLEE_ANALYTICS_SCRIPT', 'TANGIBLEE_ANALYTICS_TRACKING_ID'],
  })
  const { appData } = useContext(PWAContext)

  const locale = get(appData, 'locale')
  const { locale: currentLocale } = getCurrentLocale(locale.replace(/_/g, '-'))
  const isCanada = isCA()
  const domain = isObject(BRAND_URL)
    ? BRAND_URL[currentLocale]
    : isCanada
    ? `${BRAND_URL}/${locale}`
    : BRAND_URL

  const initialize = useCallback(() => {
    initializeAnalytics(tangibleeAnalyticTrackingId, domain)
    setTangibleeInitialized(true)
  }, [tangibleeAnalyticTrackingId, domain])

  if (!analyticsScriptSrc) {
    return null
  }

  return <Script src={analyticsScriptSrc} strategy="lazyOnload" onLoad={initialize} />
}

export default withFeatureFlag(TangibleeAnalytics, { Tangiblee: ['IS_TANGIBLEE_ENABLED'] })
