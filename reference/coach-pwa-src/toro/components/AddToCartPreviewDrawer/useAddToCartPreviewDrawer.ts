import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

type UseAddToCartPreviewDrawer = () => { isPostAddToCartDesktopEnabled: boolean }

export const useAddToCartPreviewDrawer: UseAddToCartPreviewDrawer = () => {
  const { isDesktop } = useViewportType()
  const isExperimentEnabled = useExperiment(EXPERIMENTS.POST_ATB_DESKTOP)

  return { isPostAddToCartDesktopEnabled: isDesktop && isExperimentEnabled }
}
