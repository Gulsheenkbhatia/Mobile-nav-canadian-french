import { type RefObject, useContext, useEffect, useRef, useState } from 'react'
import PWAContext from 'components/common/PWAContext'
import usePreference from 'toro/hooks/usePreference_new'

export type TangibleeScriptOptions = {
  /** Called with `true` when iframe is found; `false` from injection effect cleanup only. */
  onIsContentReadyChange?: (isContentReady: boolean) => void
}

declare global {
  interface Window {
    globalTangiblee?: { run?: () => void }
  }
}

const FALLBACK_SCRIPT_SRC =
  'https://cdn.tangiblee.com/integration/5.0/managed/www.katespade.com/revision_1/variation_original/tangiblee-bundle.min.js'
const MAX_CONTAINER_RESOLVE_ATTEMPTS = 10

export const useTangibleeScript = (
  containerRef: RefObject<HTMLDivElement | null>,
  options?: TangibleeScriptOptions
) => {
  const onIsContentReadyChange = options?.onIsContentReadyChange
  const onIsContentReadyChangeRef = useRef(onIsContentReadyChange)
  onIsContentReadyChangeRef.current = onIsContentReadyChange

  const { injectScriptOnce } = useContext(PWAContext)
  const {
    tangiblee: {
      TANGIBLEE_INTEGRATION_SCRIPT_PDPV7: scriptSrc = FALLBACK_SCRIPT_SRC,
      IS_TANGIBLEE_ENABLED: isTangibleeEnabled,
    },
  } = usePreference({
    Tangiblee: ['TANGIBLEE_INTEGRATION_SCRIPT_PDPV7', 'IS_TANGIBLEE_ENABLED'],
  })

  const [isContentReady, setIsContentReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !isTangibleeEnabled || !scriptSrc || !injectScriptOnce) {
      return undefined
    }

    let cancelled = false
    let observer: MutationObserver | null = null

    const disconnect = () => {
      observer?.disconnect()
      observer = null
    }

    const watchForIframe = (resolveAttempt = 0) => {
      const root = containerRef.current
      if (!root) {
        if (!cancelled && resolveAttempt < MAX_CONTAINER_RESOLVE_ATTEMPTS) {
          queueMicrotask(() => watchForIframe(resolveAttempt + 1))
        }
        return
      }

      const syncIframePresent = () => {
        if (cancelled) {
          return
        }
        if (root.querySelector('iframe')) {
          setIsContentReady(true)
          onIsContentReadyChangeRef.current?.(true)
          disconnect()
        }
      }

      syncIframePresent()
      observer = new MutationObserver(() => {
        syncIframePresent()
      })
      observer.observe(root, { childList: true, subtree: true })
    }

    const injectAndWatch = async () => {
      const loadPromise = injectScriptOnce(scriptSrc)
      if (!loadPromise) {
        return
      }
      try {
        await loadPromise
        if (cancelled) {
          return
        }
        window.globalTangiblee?.run?.()
        if (cancelled) {
          return
        }
        watchForIframe()
      } catch (error) {
        console.error('Error injecting Tangiblee script', error)
      }
    }

    void injectAndWatch()

    return () => {
      cancelled = true
      disconnect()
      setIsContentReady(false)
      onIsContentReadyChangeRef.current?.(false)
    }
  }, [containerRef, injectScriptOnce, isTangibleeEnabled, scriptSrc])

  return isContentReady
}
