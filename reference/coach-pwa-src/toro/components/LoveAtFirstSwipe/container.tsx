import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'
import dynamic from 'next/dynamic'
import usePageType from 'toro/hooks/usePageType'
import { useAtomValue } from 'jotai/utils'
import { isPlpV3Atom } from 'store/plp.atom'
import usePreference from 'toro/hooks/usePreference_new'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import { XgenContainerID } from 'lib/xgen'
import { useMemo } from 'react'

const LoveAtFirstSwipe = dynamic(() => import('toro/components/LoveAtFirstSwipe/index'), {
  ssr: true,
})

type GetExperimentId = (args: {
  isHP: boolean
  isPLP: boolean
  isPDP: boolean
}) =>
  | typeof EXPERIMENTS.LOVE_AT_FIRST_SWIPE_PLP
  | typeof EXPERIMENTS.LOVE_AT_FIRST_SWIPE_PDP
  | typeof EXPERIMENTS.LOVE_AT_FIRST_SWIPE_HP
  | void

const getExperimentId: GetExperimentId = ({ isHP, isPLP, isPDP }) => {
  if (isHP) return EXPERIMENTS.LOVE_AT_FIRST_SWIPE_HP
  if (isPLP) return EXPERIMENTS.LOVE_AT_FIRST_SWIPE_PLP
  if (isPDP) return EXPERIMENTS.LOVE_AT_FIRST_SWIPE_PDP
}

export default function LoveAtFirstSwipeContainer() {
  const { isPLP, isPDP, isHP } = usePageType()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const isPDPv6 = useTemplate([TemplateName.pdpv6])
  const {
    recommendations: { disabledSchemes = [] },
    adaptiveExperience: { loveAtFirstSwipe },
  } = usePreference({
    adaptiveExperience: ['loveAtFirstSwipe'],
    recommendations: ['disabledSchemes'],
  })

  const isExperienceDisabled = useMemo(() => {
    const isXGENSchemaDisabled = disabledSchemes.includes(XgenContainerID.sm_el_sitewide2)
    const isExperienceDisabledOnPLP = isPLP && (!isPlpV3 || !loveAtFirstSwipe?.plp)
    const isExperienceDisabledOnPDP = isPDP && (!isPDPv6 || !loveAtFirstSwipe?.pdp)
    const isExperienceDisabledOnHP = isHP && !loveAtFirstSwipe?.hp

    return (
      isXGENSchemaDisabled ||
      isExperienceDisabledOnPLP ||
      isExperienceDisabledOnPDP ||
      isExperienceDisabledOnHP
    )
  }, [disabledSchemes, isPLP, isPlpV3, isHP, loveAtFirstSwipe, isPDP, isPDPv6])

  if (isExperienceDisabled) {
    return null
  }

  const experimentIDs = getExperimentId({ isPDP, isPLP, isHP }) || ''

  return (
    <Experiment forIDs={experimentIDs} forMobile>
      <LoveAtFirstSwipe />
    </Experiment>
  )
}
