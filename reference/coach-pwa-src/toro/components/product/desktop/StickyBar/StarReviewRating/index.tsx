import useStyleConfig from 'toro/hooks/useStyleConfig'
import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import FullStar from 'design-tokens/icon/review/star.svg'
import { reviewSectionNodeAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import useAnalytics from 'toro/analytics/useAnalytics'
import { EXPERIMENTS } from 'toro/constants/experiments'

interface StarReviewRatingProps {
  iconWidth?: string
  iconHeight?: string
}

const StarReviewRating = ({ iconWidth = '12px', iconHeight = '12px' }: StarReviewRatingProps) => {
  const styles = useStyleConfig('StarReviewRatingStyles')
  const reviewSectionNode = useAtomValue(reviewSectionNodeAtom)
  const analytics = useAnalytics()
  const { isMobile } = useViewportType()
  const isPdpV6Enabled = useExperiment(EXPERIMENTS.PDP_V6)
  const {
    powerReviews: { enableEmplifi = true },
    toggleSiteFeatures: { hideReviewsCountOnPDP = true },
  } = usePreference({
    powerReviews: ['enableEmplifi'],
    ToggleSiteFeatures: ['hideReviewsCountOnPDP'],
  })
  const [
    isHideReview,
    avgRatingEmplifi,
    averageRatingValue,
    totalReviewsValue,
    revCountEmplifi,
    masterId,
  ] = useProductData([
    'custom.c_hideReview',
    'custom.c_avgRatingEmplifi',
    'reviewsData.results[0].rollup.average_rating',
    'reviewsData.results[0].rollup.review_count',
    'custom.c_revCountEmplifi',
    'masterId',
  ])

  const onClick = () => {
    analytics.send('reviewInteraction', {
      eventLocation: 'product',
      eventAction: 'product rating click',
      eventLabel: masterId,
    })
    reviewSectionNode.scrollIntoView()
  }

  const averageRating = averageRatingValue || avgRatingEmplifi
  const totalReviews = totalReviewsValue || revCountEmplifi

  const showStarRating = enableEmplifi && (totalReviews > 0 || averageRating > 0) && !isHideReview
  const showReviewCount = isMobile && isPdpV6Enabled && !hideReviewsCountOnPDP && totalReviews > 0

  if (!showStarRating) {
    return null
  }

  return (
    <Flex
      sx={styles.starReviewRatingWrapper}
      onClick={onClick}
      className="star-rating-review"
      data-qa="d_head-review-wrapper"
    >
      <Box sx={styles.starReviewRatingIcon}>
        <FullStar width={iconWidth} height={iconHeight} />
      </Box>
      <Text sx={styles.starReviewRatingValue}>{averageRating}</Text>
      {showReviewCount && (
        <Text sx={styles.starReviewRatingCount} className="review-count">
          ({totalReviews})
        </Text>
      )}
    </Flex>
  )
}

export default StarReviewRating
