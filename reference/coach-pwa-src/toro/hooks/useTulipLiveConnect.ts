import { useState, useEffect, useContext, useMemo } from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import usePreference from 'toro/hooks/usePreference_new'
import { useRouter } from 'next/router'

type TulipContent = {
  devices?: {
    [key: string]: boolean
  }
}

type CountryConfig = {
  countryCode?: string
  tulipChatEnabledLocale?: string
}

type TulipPreferences = {
  tulipCDNFileURL?: string
  excludeTulipChatOnPages?: string[]
  countriesConfigJSONTulip?: CountryConfig[]
  enableTulipChat?: boolean
  customCSSForTulip?: string
}

type TulipConfigData = {
  tulipConfig: any
  siteLevelTulipToggle?: boolean
  tulipPref: TulipPreferences
  countryLevelTulipToggle?: CountryConfig[]
  tulipChatEnabledLocale?: boolean | string
  excludeTulipChatOnPages?: string[]
  customCSSForTulip?: string
  isTulipLiveChatScriptLoaded?: boolean
  globalTulipLiveChat?: boolean
}

type UseTulipLiveConnectReturn = {
  tulipEnabled: boolean
  tulipConfigData: TulipConfigData
}

const useTulipLiveConnect = (
  page?: string,
  tulipContent: TulipContent | null = null
): UseTulipLiveConnectReturn => {
  const [tulipEnabled, setTulipEnabled] = useState<boolean>(false)
  const { viewport } = useViewportType()
  const { appData, injectScriptOnce } = useContext(PWAContext)
  const { tulipChatConfigs: tulipPref } = usePreference({ tulipChatConfigs: '*' })

  const router = useRouter()
  const { locale, defaultLocale } = router

  const tulipConfig = useMemo(() => {
    if (!appData) {
      return false
    }
    return get(appData, 'tulipData')
  }, [appData])

  let siteCountryLocale = locale || defaultLocale
  siteCountryLocale = siteCountryLocale?.toLocaleLowerCase()

  const {
    tulipCDNFileURL,
    excludeTulipChatOnPages,
    countriesConfigJSONTulip,
    enableTulipChat,
    customCSSForTulip,
  } = tulipPref

  const siteLevelTulipToggle = enableTulipChat
  const countryLevelTulipToggle = countriesConfigJSONTulip?.filter((obj) =>
    defaultLocale?.includes('en-CA')
      ? defaultLocale.toLocaleLowerCase().includes(obj?.countryCode?.toLocaleLowerCase())
      : siteCountryLocale?.includes(obj?.countryCode?.toLocaleLowerCase())
  )

  const tulipChatEnabledLocale =
    siteCountryLocale?.includes(countryLevelTulipToggle?.[0]?.tulipChatEnabledLocale) ||
    countryLevelTulipToggle?.[0]?.tulipChatEnabledLocale?.includes(siteCountryLocale)

  const tulipConfigData: TulipConfigData = {
    tulipConfig,
    siteLevelTulipToggle,
    tulipPref,
    countryLevelTulipToggle,
    tulipChatEnabledLocale,
    excludeTulipChatOnPages,
    customCSSForTulip,
  }

  const tulipDeviceCheck = useMemo((): boolean => {
    if (tulipContent && !isEmpty(tulipContent) && viewport) {
      return tulipContent.devices?.[viewport] || false
    }
    return false
  }, [tulipContent, viewport])

  useEffect(() => {
    if (tulipCDNFileURL && siteLevelTulipToggle) {
      injectScriptOnce(tulipCDNFileURL)
    }
  }, [tulipCDNFileURL, siteLevelTulipToggle])

  useEffect(() => {
    if (tulipConfigData) {
      const {
        siteLevelTulipToggle,
        countryLevelTulipToggle,
        tulipChatEnabledLocale,
        isTulipLiveChatScriptLoaded,
        excludeTulipChatOnPages,
        customCSSForTulip,
      } = tulipConfigData

      let pageLevelEnable = true
      if (page && excludeTulipChatOnPages && Array.isArray(excludeTulipChatOnPages)) {
        for (let i = 0; i < excludeTulipChatOnPages.length; i++) {
          const check = excludeTulipChatOnPages[i]?.toLowerCase().indexOf(page.toLowerCase()) > -1
          if (check) {
            pageLevelEnable = false
            break
          }
        }
      }
      const shouldTulipChatEnable =
        isTulipLiveChatScriptLoaded &&
        siteLevelTulipToggle &&
        countryLevelTulipToggle &&
        countryLevelTulipToggle.length > 0 &&
        !!tulipChatEnabledLocale &&
        customCSSForTulip &&
        pageLevelEnable &&
        (!isEmpty(tulipContent) ? !!tulipDeviceCheck : true)

      setTulipEnabled(shouldTulipChatEnable || false)
    }
  }, [page, tulipConfigData, tulipDeviceCheck, tulipContent])

  return { tulipEnabled, tulipConfigData }
}

export default useTulipLiveConnect
