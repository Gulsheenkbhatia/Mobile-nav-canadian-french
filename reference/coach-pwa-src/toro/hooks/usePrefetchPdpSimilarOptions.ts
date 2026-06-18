import { useEffect } from 'react'
import get from 'lodash/get'
import usePreference from 'toro/hooks/usePreference_new'
import useRecommendations from 'toro/hooks/useRecommendations'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useViewportType from 'toro/hooks/useViewportType'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

const usePrefetchPdpSimilarOptions = () => {
  const { isMobile } = useViewportType()
  const isPDPv5_1Enabled = useTemplate([TemplateName.pdpv5_1])

  const {
    toggleSiteFeatures: { similarOptionsCTAConfig },
    adaptiveExperience: { enableAEDrawerExp },
  } = usePreference({
    ToggleSiteFeatures: ['similarOptionsCTAConfig'],
    adaptiveExperience: ['enableAEDrawerExp'],
  })
  const selectedVariantId = useVariantGroupData('id')
  const [recommender] = get(enableAEDrawerExp, 'PDP.recommenders', [])
  const { fetchRecommendations } = useRecommendations(recommender)

  const isSimilarOptionsEnabled =
    useExperiment(EXPERIMENTS.VIEW_MORE_SIMILAR_PRODUCTS_PDP) &&
    get(similarOptionsCTAConfig, 'PDP.enable', false) &&
    (isMobile || isPDPv5_1Enabled)

  useEffect(() => {
    if (!isSimilarOptionsEnabled || !selectedVariantId) return
    // Only trigger when VG ID is in normalized format (dashes, not spaces)
    if (selectedVariantId.includes(' ')) return
    void fetchRecommendations(selectedVariantId)
  }, [isSimilarOptionsEnabled, selectedVariantId, fetchRecommendations])
}

export default usePrefetchPdpSimilarOptions
