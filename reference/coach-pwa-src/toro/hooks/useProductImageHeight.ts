import {
  IPHONE_PRO_SCREEN_WIDTH,
  V41_UPL_SLOT_MIN_HEIGHT,
  V41_UPL_SLOT_MIN_HEIGHT_LARGE_DEVICES,
} from 'toro/constants/adaptiveExperience'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { useAtomValue } from 'jotai/utils'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'

const HEIGHT_OF_ONE_COACH_TAB = 48

const useProductImageHeight = (): number => {
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const baseHeight =
    typeof window !== 'undefined' ? window.innerWidth * 1.25 - HEIGHT_OF_ONE_COACH_TAB : 0

  if (isTabbedAdaptivePDPEligible && (isPdpV41Enabled || isPdpV42Enabled)) {
    return typeof window !== 'undefined' && window.innerWidth < IPHONE_PRO_SCREEN_WIDTH
      ? baseHeight - V41_UPL_SLOT_MIN_HEIGHT
      : baseHeight - V41_UPL_SLOT_MIN_HEIGHT_LARGE_DEVICES
  }

  return baseHeight
}

export default useProductImageHeight
