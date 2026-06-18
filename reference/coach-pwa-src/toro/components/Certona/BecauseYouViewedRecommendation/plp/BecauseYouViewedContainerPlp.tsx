import usePreferenceNew from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePageType from 'toro/hooks/usePageType'
import Experiment from 'toro/components/Experiment'

const BecauseYouViewedRecommendationPlp = dynamic(
  () => import('toro/components/Certona/BecauseYouViewedRecommendation/plp'),
  { ssr: false }
)

const BecauseYouViewedContainerPlp = () => {
  const {
    adaptiveExperience: { becauseYouViewed },
  } = usePreferenceNew({
    adaptiveExperience: ['becauseYouViewed'],
  })

  const { isPLP } = usePageType()

  if (!isPLP || !becauseYouViewed?.plp) {
    return null
  }

  return (
    <Experiment forIDs={EXPERIMENTS.BECAUSE_YOU_VIEWED_PLP} forMobile>
      <BecauseYouViewedRecommendationPlp />
    </Experiment>
  )
}

export default BecauseYouViewedContainerPlp
