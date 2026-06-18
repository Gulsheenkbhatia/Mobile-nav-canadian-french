import { useCallback, useEffect, useState } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import EnhancedCarousel from 'toro/components/EnhancedRecommendation/EnhancedCarousel'
import Lazy from 'toro/components/Lazy'
import CertonaSkeleton from 'toro/components/Certona/CertonaSkeleton'
import get from 'lodash/get'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import type { EnhancedRecommendationProps } from 'toro/components/EnhancedRecommendation/types'

const RECOMMENDATION_START_MARGIN = 50

const EnhancedRecommendation = ({
  recommendationData,
  skeletonVisible = true,
  variant,
  label,
}: EnhancedRecommendationProps) => {
  const styles = useMultiStyleConfig('EnhancedPDPRecommendation', { variant })

  const [showSkeleton, setShowSkeleton] = useState(true)
  const [recommendationInViewport, setRecommendationInViewport] = useState(false)

  const {
    recommendations: {
      disableRecommendationOnPages,
      hideRecentlyViewedOnPages,
      hideRecommendations,
    },
  } = usePreference({
    recommendations: [
      'disableRecommendationOnPages',
      'hideRecentlyViewedOnPages',
      'hideRecommendations',
    ],
  })

  const hideYmalOnPDP = disableRecommendationOnPages?.includes('PDP')
  const hideRecentlyViewedPDP = hideRecentlyViewedOnPages?.includes('PDP')

  const products = get(recommendationData, 'items', [])

  const manageVisibility = useCallback((visible) => {
    if (visible) {
      setRecommendationInViewport(true)
    }
    if (visible && recommendationData) {
      setShowSkeleton(false)
    }
  }, [])

  useEffect(() => {
    if (recommendationData && recommendationInViewport) {
      setShowSkeleton(false)
    }
  }, [recommendationInViewport, recommendationData])

  return (
    <div id="recommendations-section" className="certona_wrapper">
      <Box sx={styles.enhancedRecommendationWrapper}>
        <Lazy
          rootMargin={`${RECOMMENDATION_START_MARGIN}px 0px 0px 0px`}
          onVisible={manageVisibility}
        >
          {recommendationData &&
            !hideRecommendations &&
            (!hideRecentlyViewedPDP || !hideYmalOnPDP) && (
              <>
                {products?.length > 0 && Object.keys(products[0])?.length > 0 && (
                  <Flex sx={styles.recommendationWrapper} className="certona_wrapper">
                    {label && (
                      <Box
                        as="h2"
                        className="certona_title"
                        sx={styles.certonaTitle}
                        data-qa="certona-title"
                      >
                        {label}
                      </Box>
                    )}
                    <EnhancedCarousel
                      recommendationData={recommendationData}
                      label={label}
                      variant={variant}
                    />{' '}
                  </Flex>
                )}
              </>
            )}
        </Lazy>
        {skeletonVisible && showSkeleton && (
          <CertonaSkeleton
            variant={'EnhancedPDPRecommendation'}
            manageVisibility={manageVisibility}
          />
        )}
      </Box>
    </div>
  )
}

export default EnhancedRecommendation
