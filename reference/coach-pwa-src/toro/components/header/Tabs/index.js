import { useCallback, useMemo, useRef, useContext, useState, useEffect } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Cookies from 'js-cookie'
import ImageCoachtopia from '@tapestry-inc/design-tokens/coachtopia/logo/primary-black.svg'

import Tabs from 'toro/components/Tabs'
import TabList from 'toro/components/TabList'
import Tab from 'toro/components/Tab'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import PWAContext from 'components/common/PWAContext'
import useViewportType from 'toro/hooks/useViewportType'
import { useRouter } from 'next/router'
import {
  reInitActiveMobileMenuItemsAtom,
  selectedMobileItemAtom,
  isOneCoachNAEnabledAtom,
  oneSiteActiveTabAtom,
} from 'store/menu-data.atom'
import { ONE_SITE_BRAND_TABS } from 'lib/oneSite/config'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  oneCoachTabHeaderRedirectHandler,
  getTabIndexByClickEvent,
  getOutletTabRedirectData,
} from 'toro/helpers/oneCoachTabbedHeader'
import {
  isOneCoachTabbedAtom,
  hslColorAdaptivePDPAtom,
  isOutletTabAtom,
  setIsOutletTabAtom,
} from 'store/global.atom'
import usePageType from 'toro/hooks/usePageType'
import useOneCoachTabConfig from 'toro/hooks/useOneCoachTabConfig'
import useProductImageHeight from 'toro/hooks/useProductImageHeight'
import { isTransparentHeaderAtom } from 'store/headroom.atom'
import { USID } from 'toro/constants/cookies'

const HeaderTabs = () => {
  const analytics = useAnalytics()
  const { appData = {} } = useContext(PWAContext)
  const { brand, subBrand, isSubBrandActive, localeInPath } = appData
  const { isMobile } = useViewportType()
  const router = useRouter()
  const prevIndexTab = useRef(isSubBrandActive ? 1 : 0)
  const setSelectedMobileItem = useUpdateAtom(selectedMobileItemAtom)
  const reInitActiveMobileMenuItems = useUpdateAtom(reInitActiveMobileMenuItemsAtom)
  const isOneCoachTabbedHeaderActive = useAtomValue(isOneCoachTabbedAtom)
  const isOutletTab = useAtomValue(isOutletTabAtom)
  const setIsOutletTab = useUpdateAtom(setIsOutletTabAtom)
  const isTransparentHeader = useAtomValue(isTransparentHeaderAtom)
  const hslColors = useAtomValue(hslColorAdaptivePDPAtom)
  const { isPDP, isSRP } = usePageType()
  const [isInactive, setIsInactive] = useState(false)
  const isOneCoachNAEnabled = useAtomValue(isOneCoachNAEnabledAtom)
  const oneSiteActiveTab = useAtomValue(oneSiteActiveTabAtom)

  const {
    toggleSiteFeatures: { enableCollapsiblePromoBar },
    generalConfiguration: { enableNewGlobalHeader },
    storefrontConfigs: { transparentHeader },
  } = usePreferenceNew({
    generalConfiguration: ['enableNewGlobalHeader'],
    ToggleSiteFeatures: ['enableCollapsiblePromoBar'],
    'Storefront Configs': ['transparentHeader'],
  })
  const { configuredTabColors, utmLink, isOutletSubCategory } = useOneCoachTabConfig()

  const isCoachTabActive = useMemo(() => {
    if (isOneCoachNAEnabled) {
      return oneSiteActiveTab === ONE_SITE_BRAND_TABS.COACH
    }
    return (
      isOneCoachTabbedHeaderActive &&
      (brand?.toLowerCase() === 'coach' || brand?.toLowerCase() === 'kate-spade') &&
      !isOutletTab
    )
  }, [isOneCoachNAEnabled, oneSiteActiveTab, isOneCoachTabbedHeaderActive, brand, isOutletTab])

  const isOutletTabActive = useMemo(() => {
    if (isOneCoachNAEnabled) {
      return oneSiteActiveTab === ONE_SITE_BRAND_TABS.OUTLET
    }
    return isOneCoachTabbedHeaderActive && (brand?.toLowerCase() === 'coach-outlet' || isOutletTab)
  }, [isOneCoachNAEnabled, oneSiteActiveTab, isOneCoachTabbedHeaderActive, brand, isOutletTab])

  const styles = useMultiStyleConfig('HeaderTabs', {
    variant:
      isMobile && enableNewGlobalHeader && !isOneCoachTabbedHeaderActive
        ? 'globalHeaderV2'
        : isOneCoachTabbedHeaderActive
        ? 'oneCoachTabbedHeader'
        : null,
    hslColors,
    configuredTabColors,
    isTransparentHeader,
    transparentHeaderEnabled: !!transparentHeader,
  })
  const { ImageRetail, ImageOutlet } = styles

  const container = useMemo(() => {
    const containerStyles = { ...styles.container }
    if (isMobile && !enableNewGlobalHeader && enableCollapsiblePromoBar) {
      containerStyles.height = '52px'
      containerStyles.paddingTop = '12px'
    }
    if (isMobile && isOneCoachTabbedHeaderActive) {
      containerStyles.backgroundColor = 'transparent'
    }
    if (!isMobile && isTransparentHeader) {
      containerStyles.backgroundColor = 'rgba(51, 51, 51, 0.30)'
    }

    return containerStyles
  }, [
    isMobile,
    enableCollapsiblePromoBar,
    configuredTabColors,
    isTransparentHeader,
    enableNewGlobalHeader,
    styles.container,
  ])

  const tabListStyle = useMemo(() => {
    return {
      ...(isMobile &&
        enableNewGlobalHeader && {
          borderColor: 'transparent',
        }),
      ...(isOneCoachTabbedHeaderActive && {
        borderColor: 'transparent',
      }),
    }
  }, [isMobile, enableNewGlobalHeader, isOneCoachTabbedHeaderActive])

  const subBrandHomeURL = usePreference({
    groupId: 'coachtopia',
    preferenceId: 'coachtopiaHomeURL',
    defaultValue: subBrand ? `/shop/${subBrand}` : '/',
  })?.value

  const actualSubBrandHomeURL = `${localeInPath ? `/${localeInPath}` : ''}${subBrandHomeURL}`

  const initialTabIndex = useMemo(() => {
    if (isOneCoachNAEnabled) {
      return oneSiteActiveTab === ONE_SITE_BRAND_TABS.OUTLET ? 1 : 0
    }

    if (isOneCoachTabbedHeaderActive) {
      if (isCoachTabActive) {
        return 0
      }
      return 1
    }

    if (isSubBrandActive) {
      return 1
    }

    return 0
  }, [
    isOneCoachNAEnabled,
    oneSiteActiveTab,
    isOneCoachTabbedHeaderActive,
    isCoachTabActive,
    isSubBrandActive,
  ])

  const [tabIndex, setTabIndex] = useState(initialTabIndex)

  const handleTabsChange = (index) => {
    if (isOneCoachTabbedHeaderActive) {
      return
    }

    setTabIndex(index)
    if (index === 0) {
      window?.open('/', '_self')
    }
    if (index === 1) {
      window?.open(actualSubBrandHomeURL, '_self')
    }
  }

  const getTextForAnalytics = (clickedIndex) => {
    const formattedBrandName = brand?.replace(/-/g, ' ')?.toLowerCase()

    if (clickedIndex === 1) {
      return isOutletSubCategory ? `${formattedBrandName} outlet` : 'coach outlet'
    }

    return isOutletSubCategory ? `${formattedBrandName}` : 'coach'
  }

  const handleOnTabClick = (event) => {
    if (isOneCoachTabbedHeaderActive) {
      const clickedIndex = getTabIndexByClickEvent(event)
      const isActiveTabClicked = clickedIndex === tabIndex
      analytics.send('navClick', {
        eventLocation: 'tabbed nav',
        text: getTextForAnalytics(clickedIndex),
      })
      if (isOutletSubCategory || isOneCoachNAEnabled) {
        let { url, shouldReload } = getOutletTabRedirectData({
          index: clickedIndex,
          currentUrl: window.location.href,
          utmLink,
          isSubBrandActive,
        })

        if (shouldReload) {
          window.location.href = url
        } else {
          router.push(url)
        }
      } else {
        oneCoachTabHeaderRedirectHandler(
          clickedIndex,
          isActiveTabClicked,
          utmLink,
          {
            usid_inherit: Cookies.get(USID),
            QMSession: window?.QuantumMetricAPI?.getSessionID(),
            QMUser: window?.QuantumMetricAPI?.getUserID(),
          },
          isSubBrandActive
        )
      }
      return
    }
    analytics.send('navClick', {
      eventLocation: 'utility',
      text: tabIndex === 1 ? 'coachtopia' : 'coach',
    })
    if (prevIndexTab.current !== tabIndex || (!isMobile && enableNewGlobalHeader)) {
      return
    }

    setSelectedMobileItem({ cgid: '', url: '' })
    reInitActiveMobileMenuItems()
    if (tabIndex === 0) {
      router.push('/')
    }
    if (tabIndex === 1) {
      router.push(actualSubBrandHomeURL)
    }
  }

  const isBrandTabActive = tabIndex === 0
  const isSubBrandTabActive = tabIndex === 1

  const updateSubLogoIdAttribute = useCallback((node) => {
    if (node) {
      const clipPathElement = node.querySelector('clipPath[id]')
      const clipPathConsumer = node.querySelector(`[clip-path="url(#${clipPathElement?.id})"]`)
      if (clipPathElement && clipPathConsumer && !clipPathElement?.id?.includes('_header_tabs')) {
        // overriding `id` for logo icon to avoid conflict with other usage of logo icon on the page.
        clipPathElement.id = `${clipPathElement.id}_header_tabs`
        clipPathConsumer.setAttribute('clip-path', `url(#${clipPathElement.id})`)
      }
    }
  }, [])

  const heightOfImage = useProductImageHeight()

  useEffect(() => {
    if (!isPDP || !isMobile || !isOneCoachTabbedHeaderActive) {
      setIsInactive(false)
      return
    }
    let timeout

    const resetTimer = () => {
      clearTimeout(timeout)
      if (window.scrollY <= heightOfImage) {
        if (window.scrollY === 0) {
          setIsInactive(false)
        }
        timeout = setTimeout(() => setIsInactive(true), 1000)
        return null
      }
      setIsInactive(false)
    }

    const cleanup = window.scrollListener.add(() => resetTimer())
    resetTimer()

    return () => {
      clearTimeout(timeout)
      cleanup()
    }
  }, [isPDP, isMobile, isOneCoachTabbedHeaderActive])

  useEffect(() => {
    if (!isPDP && !isSRP && isOneCoachTabbedHeaderActive && isOutletSubCategory) {
      setIsOutletTab({ url: router.asPath })
    }
  }, [isPDP, router.asPath, isOutletSubCategory, isOneCoachTabbedHeaderActive])

  const isOneCoachTabMobilePDP = isOneCoachTabbedHeaderActive && isPDP && isMobile

  const renderCoachtopiaTab = () => {
    return (
      <Tab
        sx={styles.buttonProps}
        data-qa="hrd_tab_coachtopia"
        className={`isSubBrand ${isTransparentHeader ? 'transparent-header' : ''} ${
          isSubBrandTabActive ? 'active' : ''
        }`}
        ref={updateSubLogoIdAttribute}
      >
        <ImageCoachtopia {...styles.logoPropsCoachtopia} />
      </Tab>
    )
  }

  const renderOutletTab = () => {
    return (
      <Tab
        sx={styles.buttonProps}
        data-qa="hrd_tab_outlet"
        className={`${isPDP ? (isMobile ? 'oneCoachColorAdaptive' : 'one-coach-color-tab') : ''} ${
          isTransparentHeader ? 'transparent-header' : ''
        } ${isOutletTabActive ? 'active' : ''} outletTab`}
      >
        <ImageOutlet {...styles.logoPropsOutlet} />
      </Tab>
    )
  }

  const coachTabClassName = `${
    (isBrandTabActive && !isOneCoachTabbedHeaderActive) ||
    (isOneCoachTabbedHeaderActive && isCoachTabActive)
      ? 'active'
      : ''
  } ${
    isOneCoachTabbedHeaderActive && isPDP
      ? isMobile
        ? 'oneCoachColorAdaptive'
        : 'one-coach-color-tab'
      : ''
  } ${isTransparentHeader ? 'transparent-header' : ''}`

  return (
    <Tabs
      index={tabIndex}
      align="center"
      style={container}
      sx={isOneCoachTabMobilePDP ? styles.containerTabs : {}}
      onClick={handleOnTabClick}
      onChange={handleTabsChange}
      className={`${
        isOneCoachTabMobilePDP ? (isInactive ? 'one-coach-fade-out' : 'one-coach-fade-in') : ''
      } ${isTransparentHeader ? 'transparent-header' : ''}`}
      data-qa="one_tab_header"
    >
      <TabList sx={tabListStyle}>
        <Tab sx={styles.buttonProps} data-qa="hrd_tab_retail" className={coachTabClassName}>
          <ImageRetail {...styles.logoPropsRetail} />
        </Tab>
        {isOneCoachTabbedHeaderActive ? renderOutletTab() : renderCoachtopiaTab()}
      </TabList>
    </Tabs>
  )
}

export default HeaderTabs
