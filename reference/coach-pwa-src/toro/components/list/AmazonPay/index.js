import React, { useContext, useEffect, memo } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import PWAContext from 'components/common/PWAContext'

const AmazonPayButton = ({ amazonCredentials, ...props }) => {
  const {
    amazonPayV2: { amazonPayScript },
  } = usePreference({
    AmazonPay_v2: ['amazonPayScript'],
  })
  const { injectScriptOnce } = useContext(PWAContext)
  function handleScriptError() {
    console.log('error loading amazon sdk')
  }

  async function handleLoadScript() {
    if (window?.amazon) {
      window.amazon.Pay.renderButton('#amazon-button-container', amazonCredentials)
    }
  }

  useEffect(() => {
    async function init() {
      await injectScriptOnce(amazonPayScript, {
        onLoad: handleLoadScript,
        onError: handleScriptError,
      })
    }
    init()
  }, [amazonPayScript])

  return <div id="amazon-button-container" {...props} />
}

export default memo(AmazonPayButton)
