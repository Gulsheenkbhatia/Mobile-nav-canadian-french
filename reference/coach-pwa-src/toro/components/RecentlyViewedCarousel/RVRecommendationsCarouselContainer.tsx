import React, { Ref, forwardRef } from 'react'
import dynamic from 'next/dynamic'
import get from 'lodash/get'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'
import { isFirstVisitAtom, isSubBrandActiveAtom } from 'store/global.atom'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtomValue } from 'jotai/utils'
import useExperiment from 'toro/hooks/useExperiment'
import {
  disableRVRecommendationsAtom,
  defaultRVRecommendationsClosedAtom,
} from 'store/search-results.atom'

const RVRecommendationsCarousel = dynamic(
  () => import('toro/components/RecentlyViewedCarousel/RVRecommendationsCarousel'),
  {
    ssr: false,
  }
)

const CollapsibleRVRecommendationsCarousel = dynamic(
  () =>
    import(
      'toro/components/CollapsibleRVRecommendationsCarousel/RVCollapsibleRecommendationsCarousel'
    ),
  {
    ssr: false,
  }
)

const RVRecommendationsCarouselAlt = dynamic(
  () => import('toro/components/RecentlyViewedCarouselAlt/RVRecommendationsCarouselAlt'),
  {
    ssr: false,
  }
)

const COLLAPSIBLE_RV_EXPERIMENTS = [
  EXPERIMENTS.COLLAPSIBLE_RV_EXPANDED,
  EXPERIMENTS.COLLAPSIBLE_RV_COLLAPSED,
].join('-')

type Props = {
  currentPage: 'HP' | 'PLP' | 'ShopByPage'
}

function withRVRecommendationsCheck<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WrapperComponent(props: P) {
    const disableRVRecommendations = useAtomValue(disableRVRecommendationsAtom)
    const {
      toggleSiteFeatures: { recentlyViewConfiguration },
    } = usePreference({
      ToggleSiteFeatures: ['recentlyViewConfiguration'],
    })

    const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
    const { currentPage } = props as Props

    const getConfigValue = (path: string, defaultValue: boolean = false) =>
      get(
        recentlyViewConfiguration,
        isSubBrandActive ? `subBrand.${path}` : `brand.${path}`,
        defaultValue
      )

    const isHP = currentPage === 'HP'
    const isPLP = currentPage === 'PLP' || currentPage === 'ShopByPage'

    const isRecentlyViewedEnabledFromConfig = getConfigValue(
      `${isHP ? 'home' : isPLP ? 'plp' : ''}.enable`
    )

    if (!isRecentlyViewedEnabledFromConfig || disableRVRecommendations) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

const RVRecommendationsCarouselContainer = withRVRecommendationsCheck(
  forwardRef(({ currentPage }: Props, ref: Ref<{ getHeight: () => number }>) => {
    const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
    const isFirstVisit = useAtomValue(isFirstVisitAtom)
    const isHP = currentPage === 'HP'
    const isPLP = currentPage === 'PLP' || currentPage === 'ShopByPage'

    const {
      toggleSiteFeatures: { recentlyViewConfiguration },
    } = usePreference({
      ToggleSiteFeatures: ['recentlyViewConfiguration'],
    })

    const isBecauseYouViewedVariant2Enabled = useExperiment(
      EXPERIMENTS.BECAUSE_YOU_VIEWED_PLP_VARIANT_2
    )

    const isCollapsibleRVExpanded = useExperiment(EXPERIMENTS.COLLAPSIBLE_RV_EXPANDED)
    const defaultRVRecommendationsClosed = useAtomValue(defaultRVRecommendationsClosedAtom)

    const getConfigValue = (path: string, defaultValue: boolean = false) =>
      get(
        recentlyViewConfiguration,
        isSubBrandActive ? `subBrand.${path}` : `brand.${path}`,
        defaultValue
      )

    const isRecentlyViewedBadgingEnabledFromConfig = getConfigValue('enableBadging')
    const certonaRVScheme = getConfigValue(`${isHP ? 'home' : isPLP ? 'plp' : ''}.recommender`)

    const defaultExpanded =
      defaultRVRecommendationsClosed == null
        ? isCollapsibleRVExpanded
        : !defaultRVRecommendationsClosed

    return (
      <Experiment forIDs={EXPERIMENTS.XGEN_RECOMMENDATIONS} forMobile>
        {isHP && (
          <>
            <Experiment notForIDs={EXPERIMENTS.RV_HP_ALT}>
              <RVRecommendationsCarousel
                forwardedRef={ref}
                limit={isBecauseYouViewedVariant2Enabled && 3}
                location="HP"
                certonaScheme={certonaRVScheme}
                enableBadging={isRecentlyViewedBadgingEnabledFromConfig}
              />
            </Experiment>

            {!isFirstVisit ? (
              <Experiment forIDs={EXPERIMENTS.RV_HP_ALT}>
                <RVRecommendationsCarouselAlt
                  forwardedRef={ref}
                  limit={isBecauseYouViewedVariant2Enabled && 3}
                  location="HP"
                  certonaScheme={certonaRVScheme}
                  enableBadging={isRecentlyViewedBadgingEnabledFromConfig}
                />
              </Experiment>
            ) : null}
          </>
        )}

        {isPLP && (
          <>
            <Experiment notForIDs={COLLAPSIBLE_RV_EXPERIMENTS}>
              <RVRecommendationsCarousel
                forwardedRef={ref}
                limit={isBecauseYouViewedVariant2Enabled && 3}
                location="PLP"
                certonaScheme={certonaRVScheme}
                enableBadging={isRecentlyViewedBadgingEnabledFromConfig}
              />
            </Experiment>

            <Experiment forIDs={COLLAPSIBLE_RV_EXPERIMENTS}>
              <CollapsibleRVRecommendationsCarousel
                ref={ref}
                limit={isBecauseYouViewedVariant2Enabled && 3}
                location="PLP"
                certonaScheme={certonaRVScheme}
                enableBadging={isRecentlyViewedBadgingEnabledFromConfig}
                defaultExpanded={defaultExpanded}
              />
            </Experiment>
          </>
        )}
      </Experiment>
    )
  })
)

export default RVRecommendationsCarouselContainer
