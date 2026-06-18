import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import useTheme from 'toro/hooks/useTheme'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

interface StarAndReviewCountProps {
  ratingCount?: string
  reviewCount?: number
  isModalContent?: boolean
  isMobile?: boolean
  variant?: string | null
}

function StarAndReviewCount({
  ratingCount,
  reviewCount,
  isModalContent = false,
  isMobile,
  variant = null,
}: StarAndReviewCountProps) {
  const styles = useMultiStyleConfig('RatingsAndReviews', { variant })
  const { formatMessage } = useIntl()
  const theme = useTheme()

  return (
    <Flex
      justify="center"
      align="center"
      mt={isMobile && theme.space.m}
      sx={styles.starAndReviewCount}
    >
      <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
        <Box
          sx={styles.pdpRatingDetailsPoints}
          data-qa={isModalContent ? 'rnr_txt_allrev_ratstars' : 'rnr_txt_rat_hdng'}
        >
          {ratingCount}{' '}
          {formatMessage({ id: 'pdp.product.starsRatingReview', defaultMessage: 'Stars' })}
        </Box>
        <Box
          sx={styles.pdpRatingDetailsCount}
          data-qa={isModalContent ? 'rnr_txt_allrev_revcount' : null}
        >
          {reviewCount}{' '}
          {reviewCount > 1
            ? formatMessage({ id: 'pdp.product.reviewsRatingLabel', defaultMessage: 'Reviews' })
            : formatMessage({ id: 'pdp.product.reviewRatingLabel', defaultMessage: 'Review' })}
        </Box>
      </Experiment>
      <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
        <Box
          sx={styles.pdpRatingDetailsCount}
          data-qa={isModalContent ? 'rnr_txt_allrev_revcount' : null}
        >
          {`(${reviewCount})`}
        </Box>
      </Experiment>
    </Flex>
  )
}

export default StarAndReviewCount
