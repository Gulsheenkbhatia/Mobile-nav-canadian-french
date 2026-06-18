import type { Keyframes } from '@emotion/react'
import type { SystemStyleObject } from '@chakra-ui/react'
import mergeWith from 'lodash/mergeWith'
import type { PdpV7EntrancePhase } from 'store/pdpv7.atom'

export const pdpV7EntranceAnimationTheme = {
  motion: {
    durationMs: 1000,
    staggerMs: 70,
    easingCss: 'cubic-bezier(0.56, 0.02, 0.17, 0.97)',
    sequenceEndBufferMs: 400,
  },
  overlay: {
    zIndex: 11000,
    backgroundColor: 'var(--color-neutral-light-2)',
  },
  distances: {
    translateFromTop: 'calc(-1 * var(--spacing-8))',
    translateFromBottom: 'var(--spacing-10)',
  },
  delaySteps: {
    header: 0,
    titleAndPrice: 1,
    gallery: 2,
    swatches: 3,
    lowerActions: 4,
  },
} as const

export type PdpV7EntranceTheme = typeof pdpV7EntranceAnimationTheme

const kateSpadeOverrides = {
  overlay: {
    backgroundColor: 'var(--color-neutral-light-1)',
  },
}

export const pdpV7EntranceAnimationThemeKateSpade = mergeWith(
  {},
  pdpV7EntranceAnimationTheme,
  kateSpadeOverrides
) as typeof pdpV7EntranceAnimationTheme

function getEntranceSequenceMs(theme: PdpV7EntranceTheme): number {
  const maxDelayStep = Math.max(0, ...Object.values(theme.delaySteps))
  const { staggerMs, durationMs, sequenceEndBufferMs } = theme.motion
  return staggerMs * maxDelayStep + durationMs + sequenceEndBufferMs
}

export const PDP_V7_ENTRANCE_SEQUENCE_MS = getEntranceSequenceMs(pdpV7EntranceAnimationTheme)

export const PDP_V7_ENTRANCE_SEQUENCE_MS_KATE_SPADE = getEntranceSequenceMs(
  pdpV7EntranceAnimationThemeKateSpade
)

export const PDP_V7_ENTRANCE_DELAY = pdpV7EntranceAnimationTheme.delaySteps

export const LAYER_WILL_CHANGE = 'opacity, transform'
export const LAYER_WILL_CHANGE_OPACITY_ONLY = 'opacity'

export type PdpV7EntranceLayerVariant = 'fromTop' | 'fromBottom' | 'fromCenter'

export const entranceLayerFromCenterSx: SystemStyleObject = {
  alignSelf: 'stretch',
  width: '100%',
  minWidth: 0,
}

export const layerReducedMotionSx: SystemStyleObject = {
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
    opacity: 1,
    transform: 'none',
  },
}

export const entranceLayerDoneLayoutStableSx: SystemStyleObject = {
  transform: 'none',
  willChange: 'auto',
  alignSelf: 'stretch',
  width: '100%',
  minWidth: 0,
}

export const overlayReducedMotionSx: SystemStyleObject = {
  '@media (prefers-reduced-motion: reduce)': {
    display: 'none',
    opacity: 0,
    pointerEvents: 'none',
  },
}

export const headerHoldSx: SystemStyleObject = { opacity: 0 }

export function getOverlayBaseSx(theme: PdpV7EntranceTheme): SystemStyleObject {
  return {
    position: 'fixed',
    inset: 0,
    zIndex: theme.overlay.zIndex,
    bg: theme.overlay.backgroundColor,
  }
}

export function getOverlayTransitionCss(theme: PdpV7EntranceTheme): string {
  const { durationMs, easingCss } = theme.motion
  return `opacity ${durationMs}ms ${easingCss}`
}

export function getOverlayOpacityForPhase(phase: PdpV7EntrancePhase): number {
  if (phase === 'done') {
    return 0
  }
  if (phase === 'off' || phase === 'hold') {
    return 1
  }
  return 0
}

export function getOverlayPointerEvents(phase: PdpV7EntrancePhase): 'none' | 'auto' {
  return getOverlayOpacityForPhase(phase) === 0 ? 'none' : 'auto'
}

export function getLayerAnimationCss(
  theme: PdpV7EntranceTheme,
  keyframe: Keyframes,
  staggerDelayMs: number
): string {
  const { durationMs, easingCss } = theme.motion
  return `${keyframe} ${durationMs}ms ${easingCss} ${staggerDelayMs}ms both`
}

export function getEntranceLayerOpacity(
  shouldReduceMotion: boolean,
  isFinished: boolean,
  hideUntilPlay: boolean
): number | undefined {
  if (shouldReduceMotion || isFinished) {
    return 1
  }
  if (hideUntilPlay) {
    return 0
  }
  return undefined
}

export function getEntranceLayerWillChange(
  variant: PdpV7EntranceLayerVariant,
  shouldAnimate: boolean,
  hideUntilPlay: boolean
): string | undefined {
  if (!shouldAnimate && !hideUntilPlay) {
    return undefined
  }
  if (variant === 'fromCenter') {
    return LAYER_WILL_CHANGE_OPACITY_ONLY
  }
  return LAYER_WILL_CHANGE
}
