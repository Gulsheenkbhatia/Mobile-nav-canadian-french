import type { SystemStyleObject } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import usePageType from 'toro/hooks/usePageType'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import { pdpV7EntrancePhaseAtom } from 'store/pdpv7.atom'
import prefersReducedMotion from 'toro/helpers/prefersReducedMotion'
import {
  getLayerAnimationCss,
  headerHoldSx,
  pdpV7EntranceAnimationTheme,
} from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation/theme/theme-kate-spade'
import { pdpV7EntranceFromTop } from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation/keyframes'

const headerDelayStep = pdpV7EntranceAnimationTheme.delaySteps.header

export default function usePdpV7EntranceHeaderAnimation(): SystemStyleObject {
  const isPdpv7 = useTemplate([TemplateName.pdpv7])
  const { isPDP } = usePageType()
  const phase = useAtomValue(pdpV7EntrancePhaseAtom)
  const shouldReduceMotion = useMemo(() => prefersReducedMotion(), [])

  if (!isPdpv7 || !isPDP) {
    return {}
  }

  if (phase === 'off') {
    return {}
  }

  if (shouldReduceMotion || phase === 'done') {
    return {}
  }

  if (phase === 'hold') {
    return headerHoldSx
  }

  if (phase === 'play') {
    const staggerMs = pdpV7EntranceAnimationTheme.motion.staggerMs
    const delayMs = headerDelayStep * staggerMs
    return {
      animation: getLayerAnimationCss(pdpV7EntranceAnimationTheme, pdpV7EntranceFromTop, delayMs),
    }
  }

  return {}
}
