import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { Keyframes } from '@emotion/react'
import type { SystemStyleObject } from '@chakra-ui/react'
import { useAtomValue } from 'jotai/utils'
import Box from 'toro/components/Box'
import { pdpV7EntrancePhaseAtom } from 'store/pdpv7.atom'
import prefersReducedMotion from 'toro/helpers/prefersReducedMotion'
import {
  entranceLayerDoneLayoutStableSx,
  entranceLayerFromCenterSx,
  getEntranceLayerOpacity,
  getEntranceLayerWillChange,
  getLayerAnimationCss,
  layerReducedMotionSx,
  pdpV7EntranceAnimationTheme,
} from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation/theme/theme-kate-spade'
import {
  pdpV7EntranceFromBottom,
  pdpV7EntranceFromCenter,
  pdpV7EntranceFromTop,
} from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation/keyframes'

const { staggerMs } = pdpV7EntranceAnimationTheme.motion

type EntranceVariant = 'fromTop' | 'fromBottom' | 'fromCenter'

type PdpV7EntranceLayerProps = {
  children: ReactNode
  variant: EntranceVariant
  delayStep: number
  /** Merged onto the layer root (e.g. flex fill for discover hero). */
  sx?: SystemStyleObject
}

const keyframeByVariant: Record<EntranceVariant, Keyframes> = {
  fromTop: pdpV7EntranceFromTop,
  fromBottom: pdpV7EntranceFromBottom,
  fromCenter: pdpV7EntranceFromCenter,
}

const PdpV7EntranceLayer = ({ children, variant, delayStep, sx }: PdpV7EntranceLayerProps) => {
  const phase = useAtomValue(pdpV7EntrancePhaseAtom)
  const shouldReduceMotion = useMemo(() => prefersReducedMotion(), [])
  const staggerDelayMs = delayStep * staggerMs
  const keyframe = keyframeByVariant[variant]

  const isFinished = phase === 'done'
  const shouldAnimate = phase === 'play' && !shouldReduceMotion
  const hideUntilPlay = (phase === 'off' || phase === 'hold') && !shouldReduceMotion

  return (
    <Box
      sx={{
        opacity: getEntranceLayerOpacity(shouldReduceMotion, isFinished, hideUntilPlay),
        animation: shouldAnimate
          ? getLayerAnimationCss(pdpV7EntranceAnimationTheme, keyframe, staggerDelayMs)
          : undefined,
        ...sx,
        willChange: getEntranceLayerWillChange(variant, shouldAnimate, hideUntilPlay),
        ...(variant === 'fromCenter' ? entranceLayerFromCenterSx : {}),
        ...layerReducedMotionSx,
        ...(isFinished && !shouldReduceMotion ? entranceLayerDoneLayoutStableSx : {}),
      }}
    >
      {children}
    </Box>
  )
}

export default PdpV7EntranceLayer
