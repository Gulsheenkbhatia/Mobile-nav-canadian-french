import usePreference from 'toro/hooks/usePreference_new'
import { useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import { isTabbedAdaptivePDPEligibleAtom, metaProductsAtom } from 'store/pdp.atom'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

interface useActiveTabIndexProps {
  orderable: boolean
  isHideReview?: boolean
  isReviewExists?: boolean
}

const useActiveTabIndex = ({ orderable, isHideReview, isReviewExists }: useActiveTabIndexProps) => {
  const {
    toggleSiteFeatures: { enableOOSExperience },
    powerReviews: { enableEmplifi = false },
  } = usePreference({
    ToggleSiteFeatures: ['enableOOSExperience'],
    powerReviews: ['enableEmplifi'],
  })
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const metaProducts = useAtomValue(metaProductsAtom)
  const isCompareToolEnable = useExperiment(EXPERIMENTS.TAB_COMPARISON_TOOL_EXPERIENCE)

  const shouldDisplayReviews = enableEmplifi && !isHideReview && isReviewExists

  return useMemo(() => {
    const activeTabIndex =
      (enableOOSExperience && !orderable) ||
      ((isCompareToolEnable || metaProducts?.enabled) && isTabbedAdaptivePDPEligible)
        ? 2
        : shouldDisplayReviews && !isTabbedAdaptivePDPEligible
        ? 1
        : 0
    return activeTabIndex
  }, [enableOOSExperience, orderable, shouldDisplayReviews, isTabbedAdaptivePDPEligible])
}

export default useActiveTabIndex
