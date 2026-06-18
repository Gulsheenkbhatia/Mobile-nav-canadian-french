import dynamic from 'next/dynamic'

import usePreferenceNew from 'toro/hooks/usePreference_new'
import usePageType from 'toro/hooks/usePageType'
import Experiment from 'toro/components/Experiment'
import withVendorSwitch, { noop } from 'toro/hocs/withVendorSwitch'
import { XgenContainerID } from 'toro/lib/xgen/types'
import { EXPERIMENTS } from 'toro/constants/experiments'

const BecauseYouViewedRecommendationXgenPlp = dynamic(
  () =>
    import(
      'toro/components/BecauseYouViewedRecommendation/plp/BecauseYouViewedRecommendationXgenPlp'
    ),
  { ssr: false }
)

const BecauseYouViewedXgenGated = withVendorSwitch(noop, BecauseYouViewedRecommendationXgenPlp)

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
      <BecauseYouViewedXgenGated type={XgenContainerID.sm_el_sitevisit1} />
    </Experiment>
  )
}

export default BecauseYouViewedContainerPlp
