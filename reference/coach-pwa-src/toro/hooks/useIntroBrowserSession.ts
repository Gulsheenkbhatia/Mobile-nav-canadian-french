import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import isBrowser from 'toro/helpers/isBrowser'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import { introBrowserSessionCompleteAtom } from 'store/pdp.atom'

export type IntroBrowserSession = {
  isFirstIntroBrowserSessionActive: boolean
}

/**
 * PDP first intro vs subsequent browser session (specs, navs, etc. on PDP).
 * Persists via `introBrowserSessionCompleteAtom` in `pdp.atom` / localStorage (JSON).
 */
export const useIntroBrowserSession = (): IntroBrowserSession => {
  const isPdpV7 = useTemplate([TemplateName.pdpv7])
  const [introComplete, setIntroComplete] = useAtom(introBrowserSessionCompleteAtom)
  const snapshotRef = useRef<boolean | null>(null)

  if (snapshotRef.current === null) {
    snapshotRef.current = introComplete
  }

  const isFirstIntroBrowserSessionActive = isPdpV7 && isBrowser() && snapshotRef.current !== true

  useEffect(() => {
    if (!isPdpV7 || !isBrowser() || !isFirstIntroBrowserSessionActive) return

    const onPageHide = (e: PageTransitionEvent) => {
      if (e.persisted) return
      setIntroComplete(true)
    }

    window.addEventListener('pagehide', onPageHide)
    return () => window.removeEventListener('pagehide', onPageHide)
  }, [isPdpV7, isFirstIntroBrowserSessionActive, setIntroComplete])

  return { isFirstIntroBrowserSessionActive }
}
