import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useUpdateAtom } from 'jotai/utils'
import { useAtomSetter } from 'toro/helpers/jotai/useAtomSetter'
import Cookies from 'js-cookie'
import {
  OPTIMIZELY_ENABLED_FEATURES,
  OPTIMIZELY_ENABLED,
  OPTIMIZELY_USER_ID,
} from 'toro/constants/cookies'
import { setOptimizelyEnabledFeaturesAtom } from 'store/global.atom'
import getAPIURL from 'helpers/getAPIURL'
import { useInterval } from '@chakra-ui/hooks'
import { setIncomingExperimentsAtom } from 'store/experiments.atom'
import fetch from 'helpers/fetch'

const DEFAULT_EXPIRY_TIME = 900 * 1000

const refreshOptimizelySession = async () => {
  const url = getAPIURL('/optimizely/get-enabled-features')
  const { features } = await fetch(url).then((res) => res.json())
  return features
}

/**
 * Handles Optimizely session refresh by re-fetching enabled features
 * for current user on navigation when features cookie expires.
 * @param {string} optSDKKey Optimizely SDK key.
 */
const useOptimizelySession = (optSDKKey: string, expiryTime: number) => {
  const { asPath } = useRouter()
  const [cookieExpired, setCookieExpired] = useState(false)
  const setEnabledFeatures = useAtomSetter(setOptimizelyEnabledFeaturesAtom)

  const setIncomingExperiments = useUpdateAtom(setIncomingExperimentsAtom)

  useInterval(() => {
    setCookieExpired(true)
  }, expiryTime || DEFAULT_EXPIRY_TIME)

  useEffect(() => {
    const optimizelyFeaturesCookie = Cookies.get(OPTIMIZELY_ENABLED_FEATURES)
    const optimizelyUserCookie = Cookies.get(OPTIMIZELY_USER_ID)
    const isOptimizelyEnabled = Cookies.get(OPTIMIZELY_ENABLED) === 'true'
    if (
      optSDKKey &&
      isOptimizelyEnabled &&
      optimizelyUserCookie &&
      cookieExpired &&
      !optimizelyFeaturesCookie
    ) {
      refreshOptimizelySession().then((features = '') => {
        setIncomingExperiments(features)
        setEnabledFeatures(features)
        setCookieExpired(false)
      })
    }
  }, [asPath])
}

export default useOptimizelySession
