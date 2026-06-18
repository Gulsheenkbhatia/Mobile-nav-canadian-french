import React, { useState, useEffect, useContext, memo } from 'react'
import { useRouter } from 'next/router'
import SessionContext from 'toro/components/SessionContext'
import getAPIURL from 'helpers/getAPIURL'
import Head from 'next/head'
import isBrowser from 'toro/helpers/isBrowser'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePageType from 'toro/hooks/usePageType'
import useLiveChatConnect from 'toro/components/LiveChat/useLiveChatConnect'

function LiveChatScript() {
  const { session } = useContext(SessionContext)
  const [liveChatHTML, setliveChatHTML] = useState([])
  const [jqueryLoaded, setJqueryLoaded] = useState(false)
  const router = useRouter()
  const { defaultLocale } = router
  const { isHP } = usePageType()
  const analytics = useAnalytics()
  const { appData, injectJquery, injectScriptOnce } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')
  const backendDomain = get(appData, 'backendDomain')
  const liveChatESW = get(appData, 'liveChatESW')

  const { shouldLiveChatEnabled } = useLiveChatConnect()

  const getLiveChat = async () => {
    const locale = `locale=${session?.user?.locale || defaultLocale}`
    const isLiveChatEnabled = 'isLiveChatEnabled=true'
    const urlAction = `urlAction=${isHP ? 'Home-Show' : false}`
    const requestedUrl = `requestedUrl=${window.location.href}`
    const params = `${locale}&${isLiveChatEnabled}&${urlAction}&${requestedUrl}`

    try {
      const url = getAPIURL(`/get-live-chat?${params}`)
      const scripts = await fetch(url, { credentials: 'include' }).then((res) => res.json())
      setliveChatHTML(scripts)
    } catch (e) {
      console.log('Failed to load Live Chat', e)
    }
  }

  const toggleLiveChatDisplay = () => {
    if (window?.embedded_svc) {
      shouldLiveChatEnabled
        ? window.embedded_svc.showHelpButton()
        : window.embedded_svc.hideHelpButton()
    }
  }

  const handlePDPStyles = () => {
    const isPDPStickyContainerVisible = document.querySelector('#pdp-sticky-container')
    const helpButtons = document.querySelectorAll('.helpButton')
    if (isPDPStickyContainerVisible) {
      helpButtons.forEach((helpButton) => helpButton?.classList?.add('helpButtonPDP'))
    } else {
      helpButtons.forEach((helpButton) => helpButton?.classList?.remove('helpButtonPDP'))
    }
  }

  const fireReadyStateChange = () => {
    if (jqueryLoaded) {
      const eswServiceLivechat = document.querySelector('.esw-service-livechat')
      if (window && typeof window.jQuery !== 'undefined' && !eswServiceLivechat) {
        window.$ = window.jQuery
        const script = document.createElement('script')
        script.className = 'esw-service-livechat'
        script.defer = true
        script.setAttribute('src', liveChatESW)
        document.body.appendChild(script)
        script.onload = () => {
          if (!window.embedded_svc) {
            typeof window.initESW === 'function' && window.initESW(null, analytics, backendDomain)
          } else {
            typeof window.initESW === 'function' &&
              window.initESW('https://service.force.com', analytics, backendDomain)
          }
        }
      }
    }
  }

  const onMount = async () => {
    try {
      await injectJquery()
      await injectScriptOnce('/scripts/pre-chat-menu-script.js')
      getLiveChat()
      setJqueryLoaded(true)
    } catch (e) {
      console.log('Error when init live chat script', e)
    }
  }

  useEffect(() => {
    if (shouldLiveChatEnabled) {
      onMount()
    }
  }, [shouldLiveChatEnabled])

  useEffect(() => {
    if (jqueryLoaded) {
      handlePDPStyles()
      toggleLiveChatDisplay()
    }
  }, [jqueryLoaded, liveChatHTML, router, shouldLiveChatEnabled])

  return shouldLiveChatEnabled ? (
    <>
      <div
        className="js-livechat-url d-none"
        data-live-chat-cookie-url={`/on/demandware.store/Sites-${siteId}-Site/en_US/LiveChat-LiveChatCookie`}
        data-live-chat-service-url={`/on/demandware.store/Sites-${siteId}-Site/en_US/LiveChat-LiveChatService`}
      />
      <Head>
        {/* {isBrowser() && (
          <script defer type="text/javascript" src="/scripts/pre-chat-menu-script.js" />
        )} */}
        {isBrowser() &&
          !!jqueryLoaded &&
          liveChatHTML?.map((item, index) => {
            if (liveChatHTML?.length - 1 === index) {
              fireReadyStateChange()
            }
            return (
              <script
                defer={true}
                key={`${index}`}
                dangerouslySetInnerHTML={{
                  __html: item,
                }}
              />
            )
          })}
      </Head>
    </>
  ) : null
}

export default memo(LiveChatScript)
