import Script from 'next/script'
import { useCallback, useEffect, useState } from 'react'

import { scleanUpSGW } from 'toro/components/product/ShoppingGivesWidget/helpers/scleanUpSGW'
import { getSGWScriptURL } from 'toro/components/product/ShoppingGivesWidget/helpers/getSGWScriptURL'

export function SGWScript({
  // app state
  masterId,
  configMode,
  isLoggedIn,
  shoppingGivesStoreId,
  // product
  promotionPrice,
  // plugin
  isSGWReady,
  onSGWLoadError,
  onSGScriptReady,
  onSGWStartLoading,
  isSGWScriptLoading,
}) {
  const [pluginID, setPluginID] = useState<string | null>(null)
  const [scriptUrl, setScriptUrl] = useState<string | null>(null)

  const loadPluginScript = useCallback(() => {
    const widgetScriptUrl = getSGWScriptURL({
      masterId,
      configMode,
      promotionPrice,
      shoppingGivesStoreId,
    })

    if (!widgetScriptUrl) return

    setScriptUrl(widgetScriptUrl)
    onSGWStartLoading()
  }, [configMode, masterId, configMode, promotionPrice, shoppingGivesStoreId])

  const onSGWScriptInjected = useCallback((script) => {
    if (!script?.target?.id) return

    setPluginID(script?.target?.id)
  }, [])

  const handleLoadError = useCallback((e) => {
    setPluginID(null)
    setScriptUrl(null)

    onSGWLoadError()

    console.error('Shopping Gives Widget: load script error', e)
  }, [])

  /*
   * Load script automatically if a user is logged in
   * If we move the load to the click event, the user will have to click twice to see the widget
   * */
  useEffect(() => {
    if (isLoggedIn && !isSGWReady && !isSGWScriptLoading) {
      loadPluginScript()
    }

    return () => {
      if (pluginID) {
        /*
         * Remove from DOM injected HTML (widget modal and learn more modal), and the SGW script
         * Even for the same product, the SGW generates new HTML
         * */
        scleanUpSGW(pluginID)
      }
    }
  }, [
    isLoggedIn,
    isSGWReady,
    isSGWScriptLoading,
    // Script URL parameters
    configMode,
    masterId,
    promotionPrice,
    shoppingGivesStoreId,
  ])

  if (!scriptUrl) return null

  return (
    <Script
      src={scriptUrl}
      strategy="lazyOnload"
      type="text/javascript"
      onLoad={onSGWScriptInjected} // to get the HTML element
      onReady={onSGScriptReady} // to handle the script ready
      onError={handleLoadError}
    />
  )
}
