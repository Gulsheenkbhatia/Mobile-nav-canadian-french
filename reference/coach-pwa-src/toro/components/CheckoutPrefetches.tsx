import fetch from 'toro/helpers/fetch'
import { GET_CHECKOUT_RESOURCES_URLS } from 'toro/constants/Urls'
import React, { useEffect, useMemo, useState, ReactElement } from 'react'
import Head from 'next/head'

declare module 'react' {
  // eslint-disable-next-line no-undef
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    fetchpriority?: string
  }
}

const UI_DEFERRED_EVENT_NAME = 'ui_deferred'
const UI_DEFERRED_EVENT_DELAY = 15000

let uiDeferredWasTriggered = false

export function emitUiDeferred() {
  if (!uiDeferredWasTriggered) {
    const timeoutId = setTimeout(() => {
      if (!uiDeferredWasTriggered) {
        uiDeferredWasTriggered = true
        document.dispatchEvent(new CustomEvent(UI_DEFERRED_EVENT_NAME))
      }
    }, UI_DEFERRED_EVENT_DELAY)
    return () => {
      clearTimeout(timeoutId)
    }
  }
}

async function fetchResourcesUrls(): Promise<string[]> {
  const responseObj = await fetch(GET_CHECKOUT_RESOURCES_URLS)
  try {
    return await responseObj.json()
  } catch (error) {
    console.error('/api/get-checkout-resources not a valid json', error)
    return []
  }
}

function CheckoutPrefetches(): ReactElement {
  const [urls, setUrls] = useState([])

  useEffect(() => {
    const handleUiDeferred = () => {
      fetchResourcesUrls()
        .then((_urls) => {
          setUrls(_urls)
        })
        .catch(() => {
          setUrls([])
        })
    }
    document.addEventListener(UI_DEFERRED_EVENT_NAME, handleUiDeferred)
    return () => {
      document.removeEventListener(UI_DEFERRED_EVENT_NAME, handleUiDeferred)
    }
  }, [])

  const prefetches = useMemo(() => {
    return (
      <Head>
        {urls.map((url) => (
          <link key={url} rel="prefetch" href={url} fetchpriority="low" as="script" />
        ))}
      </Head>
    )
  }, [urls])

  return prefetches
}

export default CheckoutPrefetches
