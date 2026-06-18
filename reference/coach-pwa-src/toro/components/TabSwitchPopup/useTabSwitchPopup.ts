import { useCallback, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import get from 'lodash/get'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { usePrevious, useToast } from '@chakra-ui/react'
import { oneSiteActiveTabAtom } from 'store/menu-data.atom'
import { tabSwitchPopupShownAtom } from 'store/tab-switch-popup.atom'
import { isPdpAtom, isNavigatingAtom } from 'store/navigation.atom'
import usePreference from 'toro/hooks/usePreference_new'
import useAnalytics from 'toro/analytics/useAnalytics'
import renderToast from './TabSwitchToast'

export default function useTabSwitchPopup() {
  const activeTab = useAtomValue(oneSiteActiveTabAtom)
  const popupShown = useAtomValue(tabSwitchPopupShownAtom)
  const setPopupShown = useUpdateAtom(tabSwitchPopupShownAtom)
  const isPDP = useAtomValue(isPdpAtom)
  const isNavigating = useAtomValue(isNavigatingAtom)
  const { send: analyticsSend } = useAnalytics()
  const { formatMessage } = useIntl()
  const message = formatMessage({
    id: 'header.oneSite.tabSwitchPopup.message',
    defaultMessage: 'Welcome! You’re now shopping',
  })
  const preferences = usePreference({
    OneSite: ['oneSitePDPConfig'],
  })
  const duration = Number(
    get(preferences, 'oneSite.oneSitePDPConfig.brandSwitchToastDuration', '5000')
  )

  // Configure toast with custom position: 52px desktop and tablet, 60px mobile
  const toast = useToast({
    position: 'top',
    status: 'success',
    duration,
    containerStyle: {
      marginTop: ['-46px', '-46px', '-119px'],
    },
  })

  const prevTab = usePrevious(activeTab)

  const eventLabel = useMemo(
    () => `${message} coach ${activeTab}`.toLowerCase(),
    [message, activeTab]
  )

  const sendCloseEvent = useCallback(() => {
    analyticsSend('tabSwitchPopupInteraction', {
      eventAction: 'welcome pop-up close',
      eventLabel,
    })
  }, [analyticsSend, eventLabel])

  useEffect(() => {
    // Block popup while navigation is in progress
    if (isNavigating) {
      return
    }

    // Do not show popup if the tab hasn't changed
    const isTabChanged = prevTab !== undefined && activeTab && activeTab !== prevTab
    if (!isTabChanged) {
      return
    }

    // Do not show popup if it was already shown for this tab
    const wasPopupShownForTab = popupShown?.[activeTab] === true
    if (wasPopupShownForTab) {
      return
    }

    // Show popup if the tab has changed AND it's a PDP
    if (!isPDP) {
      return
    }

    analyticsSend('tabSwitchPopupInteraction', {
      eventAction: 'welcome pop-up impression',
      eventLabel,
    })

    toast({
      render: renderToast(activeTab, message, sendCloseEvent),
    })

    setPopupShown((prev) => ({
      ...prev,
      [activeTab]: true,
    }))
  }, [
    activeTab,
    prevTab,
    popupShown,
    setPopupShown,
    toast,
    eventLabel,
    sendCloseEvent,
    isPDP,
    isNavigating,
  ])
}
