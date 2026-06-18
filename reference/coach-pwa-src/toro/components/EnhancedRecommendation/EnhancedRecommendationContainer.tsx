import usePreferenceNew from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import type { CertonaScheme } from 'store/certona-schemes.atoms'

const EnhancedRecommendation = dynamic(() => import('toro/components/EnhancedRecommendation'), {
  ssr: false,
})

type EnhancedRecommendationProps = {
  recommendationData: CertonaScheme
  label: string
}

const EnhancedRecommendationContainer = ({
  recommendationData,
  label,
}: EnhancedRecommendationProps) => {
  const {
    adaptiveExperience: { enableEnhancedYMALLander },
  } = usePreferenceNew({
    adaptiveExperience: ['enableEnhancedYMALLander'],
  })

  const isEnhancedRecommendationEnabled = useExperiment(EXPERIMENTS.ENHANCED_RECOMMENDATION)

  if (!isEnhancedRecommendationEnabled || !enableEnhancedYMALLander) {
    return
  }

  return <EnhancedRecommendation recommendationData={recommendationData} label={label} />
}

export default EnhancedRecommendationContainer
