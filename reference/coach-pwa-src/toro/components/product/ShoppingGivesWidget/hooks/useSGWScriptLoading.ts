import { useCallback, useEffect, useMemo, useState } from 'react'

declare global {
  interface Window {
    sgProductControllers?: Array<{
      setSubitem?: (masterId: string, promotionPrice: number) => void
    }>
    is_logged_in_sg: string
  }
}

/*
 * SGW - Shopping Gives Widget
 * */
export function useSGWScriptLoading({ isLoggedIn, masterId, promotionPrice }) {
  const [isSGWScriptLoading, setSGWScriptLoading] = useState(false)
  const [isSGWReady, setSGWReady] = useState(false)
  const [isSGWLoadError, setSGWLoadError] = useState(false)

  const onSGWStartLoading = useCallback(() => {
    setSGWScriptLoading(true)
  }, [])

  const onSGScriptReady = useCallback(() => {
    setSGWReady(true)
    setSGWScriptLoading(false)
  }, [])

  const onSGWLoadError = useCallback(() => {
    setSGWReady(false)
    setSGWScriptLoading(false)
    setSGWLoadError(true)
  }, [])

  useEffect(() => {
    if (isSGWReady) {
      window?.sgProductControllers?.[0]?.setSubitem?.(masterId, promotionPrice)
    }
  }, [isSGWReady])

  useEffect(() => {
    window.is_logged_in_sg = isLoggedIn?.toString() || 'false'
  }, [isLoggedIn])

  return useMemo(
    () => ({
      // state
      isSGWReady,
      isSGWLoadError,
      isSGWScriptLoading,
      // handlers
      onSGWLoadError,
      onSGScriptReady,
      onSGWStartLoading,
    }),
    [
      // state
      isSGWReady,
      isSGWLoadError,
      isSGWScriptLoading,
      // handlers
      onSGWLoadError,
      onSGScriptReady,
      onSGWStartLoading,
    ]
  )
}
