import usePreferenceNew from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePageType from 'toro/hooks/usePageType'
import useExperiment from 'toro/hooks/useExperiment'

const BecauseYouViewedRecommendation = dynamic(
  () => import('toro/components/Certona/BecauseYouViewedRecommendation/pdp'),
  { ssr: false }
)

const CERTONA_PAGE_TYPE = 'sitevisit'

const CERTONA_RECOMMENDER_SCHEME_PDP = 'sitevisit1_rr'
const CERTONA_RECOMMENDER_SCHEME_PLP_V2 = 'sitevisit2_rr'

const BecauseYouViewedContainer = () => {
  const {
    hideRecommendationPrice: hideYmalPrice,
    adaptiveExperience: { becauseYouViewed },
  } = usePreferenceNew({
    adaptiveExperience: ['becauseYouViewed'],
    recommendations: ['hideRecommendationPrice'],
  })

  const { isPDP, isPLP } = usePageType()

  const isBecauseYouViewedPDPEnabled = useExperiment(EXPERIMENTS.BECAUSE_YOU_VIEWED_PDP)

  const isBecauseYouViewedVariant2Enabled = useExperiment(
    EXPERIMENTS.BECAUSE_YOU_VIEWED_PLP_VARIANT_2
  )

  const shouldRenderPDP = becauseYouViewed?.pdp && isBecauseYouViewedPDPEnabled
  const shouldRenderPLP = becauseYouViewed?.plp && isBecauseYouViewedVariant2Enabled

  if (isPDP && !shouldRenderPDP) {
    return null
  }

  if (isPLP && !shouldRenderPLP) {
    return null
  }

  const certonaScheme = isPDP ? CERTONA_RECOMMENDER_SCHEME_PDP : CERTONA_RECOMMENDER_SCHEME_PLP_V2

  return (
    <BecauseYouViewedRecommendation
      hidePrice={!!hideYmalPrice}
      certonaScheme={certonaScheme}
      pageType={CERTONA_PAGE_TYPE}
      variant={isPLP ? 'becauseYouViewedPLPV2' : 'BecauseYouViewedPDPRecommendation'}
      isBecauseYouViewedVariant2Enabled={isBecauseYouViewedVariant2Enabled}
    />
  )
}

export default BecauseYouViewedContainer
