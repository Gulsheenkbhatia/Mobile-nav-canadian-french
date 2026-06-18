import { memo } from 'react'
import { useAtomValue } from 'jotai/utils'
import Experiment from 'toro/components/Experiment'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import {
  defaultRVRecommendationsClosedAtom,
  disableRVRecommendationsAtom,
} from 'store/search-results.atom'
import usePageType from 'toro/hooks/usePageType'
import DesktopCollapsibleRVCarousel from '.'

const RV_HP_DESKTOP_EXPERIMENTS = [
  EXPERIMENTS.RV_HP_DESKTOP_OPEN,
  EXPERIMENTS.RV_HP_DESKTOP_CLOSED,
].join('-')

const RV_PLP_DESKTOP_EXPERIMENTS = [
  EXPERIMENTS.RV_PLP_DESKTOP_OPEN,
  EXPERIMENTS.RV_PLP_DESKTOP_CLOSED,
].join('-')

type Props = {
  headerHeight?: number
  isHidden?: boolean
}

const DesktopCollapsibleRVCarouselContainer = ({ headerHeight, isHidden }: Props) => {
  const { isHP, isPLP } = usePageType()
  const isHPRVOpenVariant = useExperiment(EXPERIMENTS.RV_HP_DESKTOP_OPEN)
  const isPLPRVOpenVariant = useExperiment(EXPERIMENTS.RV_PLP_DESKTOP_OPEN)
  const defaultRVRecommendationsClosedForPLP = useAtomValue(defaultRVRecommendationsClosedAtom)
  const disableRVRecommendationsForPLP = useAtomValue(disableRVRecommendationsAtom)

  if (!isHP && (!isPLP || disableRVRecommendationsForPLP)) return null

  const location = isPLP ? 'PLP' : 'HP'

  const experimentIds = isPLP ? RV_PLP_DESKTOP_EXPERIMENTS : RV_HP_DESKTOP_EXPERIMENTS
  const defaultExpanded = isPLP
    ? isPLPRVOpenVariant && !defaultRVRecommendationsClosedForPLP
    : isHPRVOpenVariant

  return (
    <Experiment forIDs={experimentIds} forDesktop>
      <DesktopCollapsibleRVCarousel
        location={location}
        headerHeight={headerHeight}
        isHidden={isHidden}
        defaultExpanded={defaultExpanded}
      />
    </Experiment>
  )
}

export default memo(DesktopCollapsibleRVCarouselContainer)
