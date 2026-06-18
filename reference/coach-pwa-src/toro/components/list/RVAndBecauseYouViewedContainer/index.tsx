import React, { forwardRef, memo, Ref } from 'react'
import RVRecommendationsCarouselContainer from 'toro/components/RecentlyViewedCarousel/RVRecommendationsCarouselContainer'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { Box, useStyleConfig } from '@chakra-ui/react'
import usePreference from 'toro/hooks/usePreference_new'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePageType from 'toro/hooks/usePageType'
import useExperiment from 'toro/hooks/useExperiment'
import BYVRecommendationsCarouselContainer from 'toro/components/BecauseYouViewedRecommendation/plp/BYVRecommendationsCarouselContainer'

const RVAndBecauseYouViewedContainer = forwardRef(
  (props: any, ref: Ref<{ getHeight: () => number }>) => {
    const styles: any = useStyleConfig('RVAndBecauseYouViewedContainer')

    const {
      adaptiveExperience: { becauseYouViewed },
    } = usePreference({
      adaptiveExperience: ['becauseYouViewed'],
    })

    const { isPLP } = usePageType()

    const isBecauseYouViewedVariant2Enabled = useExperiment(
      EXPERIMENTS.BECAUSE_YOU_VIEWED_PLP_VARIANT_2
    )

    const renderBecauseYouViewedInPLP = becauseYouViewed?.plp && isBecauseYouViewedVariant2Enabled

    const shouldPreventTitleToScroll = isPLP && !renderBecauseYouViewedInPLP

    const mergedStyles = {
      ...styles.rVAndBecauseYouViewedContainer,
      ...(shouldPreventTitleToScroll
        ? styles.containerTitleNonScrollable
        : styles.containerTitleScrollable),
    }

    return (
      <Box sx={styles.recommendationsWrapper}>
        <Box sx={mergedStyles}>
          <Box sx={styles.recentlyViewedWrapper}>
            <RVRecommendationsCarouselContainer ref={ref} currentPage="PLP" />
          </Box>
        </Box>
        <BYVRecommendationsCarouselContainer />
      </Box>
    )
  }
)

export default withErrorBoundaryWrapper(memo(RVAndBecauseYouViewedContainer))
