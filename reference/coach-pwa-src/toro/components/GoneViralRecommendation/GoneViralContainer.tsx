import usePreferenceNew from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePageType from 'toro/hooks/usePageType'
import { useAtomValue } from 'jotai/utils'
import { isPlpV3Atom } from 'store/plp.atom'
import { XgenContainerID } from 'toro/lib/xgen'

const GoneViralRecommendation = dynamic(() => import('toro/components/GoneViralRecommendation'), {
  ssr: false,
})

const GoneViralContainer = () => {
  const {
    adaptiveExperience: { goneViral },
    recommendations: { disabledSchemes = [] },
  } = usePreferenceNew({
    adaptiveExperience: ['goneViral'],
    recommendations: ['disabledSchemes'],
  })
  const { isPDP, isPLP } = usePageType()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const isSchemaDisabled = disabledSchemes.includes(XgenContainerID.sm_el_sitewide1)

  if (
    (isPDP && !goneViral?.pdp) ||
    (isPLP && !goneViral?.plp) ||
    (isPLP && !isPlpV3) ||
    isSchemaDisabled
  ) {
    return null
  }

  return (
    <Experiment
      forIDs={
        isPDP ? EXPERIMENTS.GONE_VIRAL_RECOMMENDATION : EXPERIMENTS.GONE_VIRAL_RECOMMENDATION_ON_PLP
      }
      forMobile
    >
      <GoneViralRecommendation />
    </Experiment>
  )
}

export default GoneViralContainer
