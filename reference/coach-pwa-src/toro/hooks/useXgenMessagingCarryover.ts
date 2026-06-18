import { XgenContainerID } from 'lib/xgen'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { useAtomValue } from 'jotai/utils'
import { whitelistedLastVisitedPlpAtom } from 'store/plp.atom'
import useViewportType from 'toro/hooks/useViewportType'

type UseXgenMessagingCarryover = (containerId: string) => {
  shouldSetXgenContext: boolean
  parentCategory: string
}

const useXgenMessagingCarryover: UseXgenMessagingCarryover = (containerId) => {
  const isMessagingCarryoverEnabled = useExperiment(EXPERIMENTS.MESSAGING_CARRYOVER)
  const parentCategory = useAtomValue(whitelistedLastVisitedPlpAtom) || ''
  const { isMobile } = useViewportType()

  const shouldSetXgenContext =
    isMobile &&
    isMessagingCarryoverEnabled &&
    XgenContainerID[containerId] === XgenContainerID.ymal &&
    !!parentCategory

  return {
    shouldSetXgenContext,
    parentCategory,
  }
}

export default useXgenMessagingCarryover
