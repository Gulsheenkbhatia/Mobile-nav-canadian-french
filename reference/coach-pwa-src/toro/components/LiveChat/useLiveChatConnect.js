import { useContext, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import get from 'lodash/get'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import PWAContext from 'components/common/PWAContext'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import useStickyAiEntryPoint from 'toro/components/ShopAssistChat/hooks/useStickyAiEntryPoint'

const useLiveChatConnect = () => {
  const { appData } = useContext(PWAContext)
  const { isTablet, isDesktop, isMobile } = useViewportType()
  const { subBrand, isSubBrandEnabled, liveChatESW } = appData
  const pathname = usePathname()
  const { locale, region } = getCurrentLocale(get(appData, 'locale', ''))

  const {
    sfscChatConfigs: {
      enableLiveChat,
      countriesConfigJSON,
      enableLiveChatOnDevices,
      excludeLiveChatOnPages,
    },
    coachtopia: { coachtopiaHomeURL: subBrandHomeURL = subBrand ? `/shop/${subBrand}` : '/' },
  } = usePreference({
    sfscChatConfigs: [
      'enableLiveChat',
      'countriesConfigJSON',
      'enableLiveChatOnDevices',
      'excludeLiveChatOnPages',
    ],
    coachtopia: ['coachtopiaHomeURL'],
  })
  const isStickyAiChatAllowed = useStickyAiEntryPoint()

  const hideLiveChatOnPage = useMemo(
    () =>
      excludeLiveChatOnPages?.some((page) => {
        if (page === '/') {
          return pathname === '/'
        } else if (isSubBrandEnabled && page === subBrandHomeURL) {
          return pathname === subBrandHomeURL
        } else {
          return pathname?.includes(page)
        }
      }),
    [pathname, isSubBrandEnabled]
  )

  const viewportTypes = useMemo(
    () => ({
      desktop: isDesktop,
      tablet: isTablet,
      mobile: isMobile,
    }),
    [isDesktop, isTablet, isMobile]
  )

  const displayLiveChatOnDevice = useMemo(
    () => enableLiveChatOnDevices?.some((type) => viewportTypes[type]),
    [viewportTypes]
  )

  const isChatEnabledOnLocale = useMemo(
    () =>
      countriesConfigJSON?.some(
        (item) =>
          item.countryCode === region && item.liveChatEnabledLocale === locale.replace('-', '_')
      ),
    [region, locale]
  )

  const shouldLiveChatEnabled = useMemo(
    () =>
      liveChatESW &&
      enableLiveChat &&
      !hideLiveChatOnPage &&
      displayLiveChatOnDevice &&
      !!isChatEnabledOnLocale &&
      !isStickyAiChatAllowed,
    [
      liveChatESW,
      enableLiveChat,
      hideLiveChatOnPage,
      displayLiveChatOnDevice,
      isChatEnabledOnLocale,
      isStickyAiChatAllowed,
    ]
  )
  return { shouldLiveChatEnabled }
}

export default useLiveChatConnect
