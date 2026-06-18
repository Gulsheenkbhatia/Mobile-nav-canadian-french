import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import { NavChevronUpIcon as ChevronUp, NavChevronDownIcon as ChevronDown } from 'toro/icons'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import ReviewIncentivizedDetail from 'toro/components/product/RatingsAndReviews/ReviewIncentivizedDetail'

interface ReviewListItemResponseProps {
  title?: string
  description?: string
  variant?: string
  isModalContent?: boolean
  incentivized?: boolean
}

const PDPV5_COMMENT_MAX_HEIGHT = 48

function ReviewListItemResponse({
  title = '',
  description = '',
  variant = null,
  isModalContent = false,
  incentivized = false,
}: ReviewListItemResponseProps) {
  const styles = useMultiStyleConfig('RatingsAndReviews', { variant })
  const { isDesktop, isMobile } = useViewportType()
  const { formatMessage } = useIntl()
  const isPDPV3Mobile = useExperiment(EXPERIMENTS.PDP_V3_BELOW_THE_FOLD) && isMobile
  const [isShowMoreShowLessVisible, setShowMoreShowLessVisible] = useState(false)
  const isReviewSectionUnderProductImage = useExperiment(EXPERIMENTS.REVIEW_UNDER_PRODUCT_IMAGE)
  const [isReadMore, setIsReadMore] = useState(true)
  const isPDPV5Enabled = useTemplate([TemplateName.pdpv5])
  const isPDPv5Variant = isPDPV5Enabled && !isModalContent

  const {
    powerReviews: { commentHeight = 64 },
  } = usePreference({
    powerReviews: ['commentHeight'],
  })

  const ref = useRef(null)
  useEffect(() => {
    setShowMoreShowLessVisible(
      isPDPV3Mobile
        ? ref?.current?.scrollHeight > ref?.current?.clientHeight
        : ref?.current?.scrollHeight > (isPDPv5Variant ? PDPV5_COMMENT_MAX_HEIGHT : commentHeight)
    )
  }, [])

  const pdpReviewsDetailsDescStyles = useMemo(
    () => styles.pdpReviewsDetailsDesc({ isDesktop }),
    [isDesktop]
  )

  const toggleReadMore = useCallback(() => setIsReadMore((prev) => !prev), [])

  const prefCommentMaxHeight = commentHeight ? `${commentHeight}px` : '64px'
  const commentMaxHeight = isPDPv5Variant ? PDPV5_COMMENT_MAX_HEIGHT : prefCommentMaxHeight

  return (
    <Box
      name="pdpReviewsDetailsWrapper"
      sx={styles.pdpReviewsDetailsWrapper}
      className="review-response-details-wrapper"
    >
      <Box
        sx={styles.pdpReviewsDetailsTitle}
        as="h3"
        data-qa="rnr_txt_revdetails"
        className="review-response-details-title"
      >
        {title}
      </Box>
      {incentivized && <ReviewIncentivizedDetail styles={styles.incentivizedReview} />}
      <Box
        sx={{
          ...pdpReviewsDetailsDescStyles,
          ...(isReadMore
            ? styles?.pdpReviewsDetailsDescV3Closed
            : styles?.pdpReviewsDetailsDescV3Opened),
        }}
        maxHeight={isReadMore ? commentMaxHeight : 'auto'}
        ref={ref}
        data-qa="rnr_txt_revdesc"
        className={`review-response-details-description ${isReadMore ? 'show-less' : 'show-all'}`}
      >
        {description}
      </Box>

      {isShowMoreShowLessVisible && (
        <Flex
          sx={styles.readMoreWrapper}
          onClick={toggleReadMore}
          align="center"
          className="review-response-details-toggle-btn"
        >
          <Box
            sx={styles.readMore}
            textTransform={isReviewSectionUnderProductImage && 'uppercase'}
            cursor="pointer"
            as="span"
            data-qa={isReadMore ? 'rnr_btn_allrev_readmore' : 'rnr_btn_allrev_readless'}
          >
            {isReadMore
              ? formatMessage({
                  id: 'pdp.product.readMoreRatingReview',
                  defaultMessage: 'Read More',
                })
              : formatMessage({
                  id: 'pdp.product.readLessRatingReview',
                  defaultMessage: 'Read Less',
                })}
          </Box>

          {!isPDPv5Variant && (
            <Box as="span" cursor="pointer">
              {!isReadMore ? (
                <ChevronUp width="16px" height="16px" viewBox="0 0 24 24" />
              ) : (
                <ChevronDown width="16px" height="16px" viewBox="0 0 24 24" />
              )}
            </Box>
          )}
        </Flex>
      )}
    </Box>
  )
}

export default ReviewListItemResponse
