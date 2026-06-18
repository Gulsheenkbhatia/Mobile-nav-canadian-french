import { type FC, memo, useCallback } from 'react'
import { setAccessorizeItNodeAtom } from 'store/pdp.atom'
import { useUpdateAtom } from 'jotai/utils'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import DesktopSkeleton from 'toro/components/product/AccessorizeIt/AccessorizeItSkeleton/DesktopSkeleton'
import MobileSkeleton from 'toro/components/product/AccessorizeIt/AccessorizeItSkeleton/MobileSkeleton'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useViewportType from 'toro/hooks/useViewportType'

const AccessorizeItSkeleton: FC = () => {
  const setAccessorizeItNode = useUpdateAtom(setAccessorizeItNodeAtom)
  const isPdpV6 = useTemplate([TemplateName.pdpv6])
  const isPdpV5_1 = useTemplate([TemplateName.pdpv5_1])
  const isAccessorizeItDesktopEnabled = useExperiment(EXPERIMENTS.ACCESSORIZE_IT_DESKTOP)
  const isAccessorizeItMobileEnabled = useExperiment(EXPERIMENTS.ACCESSORIZE_IT)
  const { isMobile } = useViewportType()
  const accessorizeItRef = useCallback((node) => {
    node && setAccessorizeItNode(node)
  }, [])

  if (isAccessorizeItDesktopEnabled && isPdpV5_1) {
    return <DesktopSkeleton accessorizeItRef={accessorizeItRef} />
  }

  if (isMobile && isAccessorizeItMobileEnabled) {
    return <MobileSkeleton accessorizeItRef={accessorizeItRef} isPdpV6={isPdpV6} />
  }

  return null
}

export default memo(AccessorizeItSkeleton)
