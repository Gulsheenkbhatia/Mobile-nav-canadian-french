import { useAtomValue } from 'jotai/utils'
import Box from 'toro/components/Box'
import { pdpV7EntrancePhaseAtom } from 'store/pdpv7.atom'
import {
  getOverlayBaseSx,
  getOverlayOpacityForPhase,
  getOverlayPointerEvents,
  getOverlayTransitionCss,
  overlayReducedMotionSx,
  pdpV7EntranceAnimationTheme,
} from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation/theme/theme-kate-spade'

const PdpV7EntranceOverlay = () => {
  const phase = useAtomValue(pdpV7EntrancePhaseAtom)

  if (phase === 'done' || phase === 'off') {
    return null
  }

  return (
    <Box
      aria-hidden
      data-qa="pdpv7-entrance-overlay"
      sx={{
        ...getOverlayBaseSx(pdpV7EntranceAnimationTheme),
        opacity: getOverlayOpacityForPhase(phase),
        transition: getOverlayTransitionCss(pdpV7EntranceAnimationTheme),
        pointerEvents: getOverlayPointerEvents(phase),
        ...overlayReducedMotionSx,
      }}
    />
  )
}

export default PdpV7EntranceOverlay
