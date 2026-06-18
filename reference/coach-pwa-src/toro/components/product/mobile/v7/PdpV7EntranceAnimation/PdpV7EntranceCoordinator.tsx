import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  clearPdpV7SuppressEntranceIfPathMismatchAtom,
  isPdpV7SuppressEntranceForPath,
  pdpV7EntrancePhaseAtom,
  pdpV7SuppressEntranceForPathKeyAtom,
  type PdpV7EntrancePhase,
} from 'store/pdpv7.atom'
import { appLoadingAtom, isQuickViewAtom } from 'store/pdp.atom'
import { fullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import useProductData from 'toro/hooks/useProductData'
import prefersReducedMotion from 'toro/helpers/prefersReducedMotion'
import { PDP_V7_ENTRANCE_SEQUENCE_MS } from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation/theme/theme-kate-spade'

// Stored outside React to avoid re-renders and prevent duplicate execution during remounts
const pdpV7EntranceSequenceDedupe = {
  lastEntrancePathKeyPlayed: null as string | null,
}

const PdpV7EntranceCoordinator = () => {
  const router = useRouter()
  const masterId = useProductData('masterId') as string | undefined
  const appLoading = useAtomValue(appLoadingAtom)
  const fullscreenLoading = useAtomValue(fullscreenLoadingAtom)
  const isQuickView = useAtomValue(isQuickViewAtom)
  const shouldReduceMotion = useMemo(() => prefersReducedMotion(), [])
  const [, setPhase] = useAtom(pdpV7EntrancePhaseAtom)
  const [suppressEntranceForPathKey, setSuppressEntranceForPathKey] = useAtom(
    pdpV7SuppressEntranceForPathKeyAtom
  )
  const clearSuppressIfPathMismatch = useUpdateAtom(clearPdpV7SuppressEntranceIfPathMismatchAtom)
  const completionGenerationRef = useRef(0)
  const lastCommittedPathKeyRef = useRef<string | undefined>(undefined)
  const lastCommittedMasterIdRef = useRef<string | undefined>(undefined)

  useLayoutEffect(() => {
    setPhase('hold')
    return () => {
      setPhase('off')
    }
  }, [setPhase])

  useEffect(() => {
    const onRouteChangeComplete = (url: string) => {
      const completedPathKey = url.split(/[?#]/)[0]
      clearSuppressIfPathMismatch(completedPathKey)
    }
    router.events.on('routeChangeComplete', onRouteChangeComplete)
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router, clearSuppressIfPathMismatch])

  useEffect(() => {
    if (!masterId || appLoading || fullscreenLoading) {
      return
    }

    const finish = (next: PdpV7EntrancePhase) => {
      setPhase(next)
    }

    const pathKey = router.asPath.split(/[?#]/)[0]

    const sampledBefore =
      lastCommittedPathKeyRef.current !== undefined &&
      lastCommittedMasterIdRef.current !== undefined

    const pathAdvancedSinceLastCommit = sampledBefore && pathKey !== lastCommittedPathKeyRef.current
    const masterUnchangedSinceLastCommit =
      sampledBefore && masterId === lastCommittedMasterIdRef.current

    if (pathAdvancedSinceLastCommit && masterUnchangedSinceLastCommit) {
      return
    }

    if (isPdpV7SuppressEntranceForPath(suppressEntranceForPathKey, pathKey)) {
      setSuppressEntranceForPathKey(null)
      pdpV7EntranceSequenceDedupe.lastEntrancePathKeyPlayed = pathKey
      lastCommittedPathKeyRef.current = pathKey
      lastCommittedMasterIdRef.current = masterId
      finish('done')
      return
    }

    if (isQuickView || shouldReduceMotion) {
      pdpV7EntranceSequenceDedupe.lastEntrancePathKeyPlayed = pathKey
      lastCommittedPathKeyRef.current = pathKey
      lastCommittedMasterIdRef.current = masterId
      finish('done')
      return
    }

    if (pdpV7EntranceSequenceDedupe.lastEntrancePathKeyPlayed === pathKey) {
      lastCommittedPathKeyRef.current = pathKey
      lastCommittedMasterIdRef.current = masterId
      finish('done')
      return
    }

    lastCommittedPathKeyRef.current = pathKey
    lastCommittedMasterIdRef.current = masterId

    finish('play')
    completionGenerationRef.current += 1
    const generation = completionGenerationRef.current

    const timer = window.setTimeout(() => {
      if (completionGenerationRef.current !== generation) {
        return
      }
      pdpV7EntranceSequenceDedupe.lastEntrancePathKeyPlayed = pathKey
      finish('done')
    }, PDP_V7_ENTRANCE_SEQUENCE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    appLoading,
    fullscreenLoading,
    masterId,
    isQuickView,
    shouldReduceMotion,
    setPhase,
    setSuppressEntranceForPathKey,
    suppressEntranceForPathKey,
    router.asPath,
  ])

  return null
}

export function resetPdpV7EntranceSequenceDedupe() {
  pdpV7EntranceSequenceDedupe.lastEntrancePathKeyPlayed = null
}

export default PdpV7EntranceCoordinator
