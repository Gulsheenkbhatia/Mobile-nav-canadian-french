import { useMemo } from 'react'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

interface ReviewTitleProps {
  title?: string
  isModalContent?: boolean
  variant?: string
}

function ReviewTitle({ title = '', isModalContent = false, variant }: ReviewTitleProps) {
  const styles = useMultiStyleConfig('RatingsAndReviews', { variant })
  const { isDesktop } = useViewportType()
  const isReviewSectionUnderProductImage = useExperiment(EXPERIMENTS.REVIEW_UNDER_PRODUCT_IMAGE)

  const reviewHeaderWrapperStyles = useMemo(
    () => styles.reviewHeaderContainer(isModalContent, isReviewSectionUnderProductImage),
    [isModalContent]
  )
  const reviewHeaderStyles = useMemo(
    () => styles.reviewHeader({ isModalContent, isDesktop, isReviewSectionUnderProductImage }),
    [isModalContent, isDesktop]
  )

  return (
    <Box
      sx={reviewHeaderWrapperStyles}
      position={isModalContent && 'sticky'}
      className="reviews__heading-wrapper"
    >
      <Box
        className="reviews__heading"
        as="h2"
        sx={reviewHeaderStyles}
        data-qa={isModalContent ? 'rnr_txt_allrev_hdng' : 'rnr_txt_hdng'}
      >
        {title}
      </Box>
    </Box>
  )
}

export default ReviewTitle
