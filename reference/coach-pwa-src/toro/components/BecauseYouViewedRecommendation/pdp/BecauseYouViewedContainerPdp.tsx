import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai/utils'

import usePreference from 'toro/hooks/usePreference_new'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { XgenContainerID } from 'toro/lib/xgen/types'

const BecauseYouViewedRecommendationXgenPdp = dynamic(
  () =>
    import(
      'toro/components/BecauseYouViewedRecommendation/pdp/BecauseYouViewedRecommendationXgenPdp'
    ),
  { ssr: false }
)

const BecauseYouViewedContainerPdp = () => {
  const {
    adaptiveExperience: { becauseYouViewed },
    recommendations: { disabledSchemes = [] },
  } = usePreference({
    adaptiveExperience: ['becauseYouViewed'],
    recommendations: ['disabledSchemes'],
  })

  const { recommendations: isXgenEnabled } = useAtomValue(xgenFeaturesAtom)

  const isSchemeDisabled = disabledSchemes.includes(XgenContainerID.sm_el_sitevisit2)

  if (!becauseYouViewed?.pdp || isSchemeDisabled || !isXgenEnabled) {
    return null
  }

  return (
    <Experiment forIDs={EXPERIMENTS.BECAUSE_YOU_VIEWED_PDP} forMobile>
      <BecauseYouViewedRecommendationXgenPdp />
    </Experiment>
  )
}

export default BecauseYouViewedContainerPdp
