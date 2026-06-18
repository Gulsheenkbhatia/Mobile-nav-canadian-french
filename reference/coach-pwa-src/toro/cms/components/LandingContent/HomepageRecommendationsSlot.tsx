import dynamic from 'next/dynamic'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'
import { XgenContainerID } from 'toro/lib/xgen/types'
import RecommendationSlot from './RecommendationSlot'
import { isFirstVisitAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'
import { isOneCoachNAEnabledAtom, oneSiteActiveBrandAtom } from 'store/menu-data.atom'
import { homepageMatchingExperienceAtom } from 'store/matching-experience'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

const RecommendationsTabbedContainer = dynamic(
  () => import('toro/components/RecommendationsTabbedContainer'),
  { ssr: false }
)

const LoveAtFirstSwipeContainer = dynamic(
  () => import('toro/components/LoveAtFirstSwipe/container'),
  { ssr: false }
)

const HomepageRecommendationsSlot = ({ siteId, brand }: { siteId: string; brand: string }) => {
  const { isMobile } = useViewportType()
  const isFirstVisit = useAtomValue(isFirstVisitAtom)
  const isOneCoachNAEnabled = useAtomValue(isOneCoachNAEnabledAtom)
  const activeBrand = useAtomValue(oneSiteActiveBrandAtom)
  const loveAtFirstSwipeHPExperimentEnabled = useExperiment(EXPERIMENTS.LOVE_AT_FIRST_SWIPE_HP)
  const matchingExperienceFromCustomObject = useAtomValue(homepageMatchingExperienceAtom)

  const {
    recommendations: { disabledSchemes = [] },
    adaptiveExperience: { matchingExperience: matchingExperienceFromPreference, loveAtFirstSwipe },
  } = usePreference({
    recommendations: ['disabledSchemes'],
    adaptiveExperience: ['matchingExperience', 'loveAtFirstSwipe'],
  })

  // TODO: Remove preference fallback once all brands have migrated to the custom object (DIGIT-41184)
  const rawMatchingExperience =
    matchingExperienceFromCustomObject ?? matchingExperienceFromPreference

  const matchingExperience =
    isOneCoachNAEnabled && activeBrand
      ? rawMatchingExperience?.[activeBrand]
      : rawMatchingExperience

  const isRecommendationsEnabled = !disabledSchemes.includes(XgenContainerID.home1_rr)
  const isMatchingEnabled =
    !!matchingExperience?.recommender &&
    !disabledSchemes.includes(matchingExperience.recommender) &&
    isFirstVisit

  // show matching if it is enabled or if recommendations are disabled and on mobile
  const showMatching = isMatchingEnabled || !isRecommendationsEnabled

  const showLoveAtFirstSwipe =
    isMobile && loveAtFirstSwipeHPExperimentEnabled && loveAtFirstSwipe?.hp

  if (showLoveAtFirstSwipe) {
    return <LoveAtFirstSwipeContainer />
  }

  if (showMatching) {
    return (
      <RecommendationsTabbedContainer
        type={matchingExperience?.recommender}
        pageType="home"
        matchExperienceConfig={matchingExperience}
      />
    )
  }

  return (
    <RecommendationSlot
      siteId={siteId}
      brand={brand}
      type={'home1_rr'}
      variant="recommendationsOnHP"
      hideWishlist
      emitHomeFeaturedProductsJsonLd
    />
  )
}

export default HomepageRecommendationsSlot
