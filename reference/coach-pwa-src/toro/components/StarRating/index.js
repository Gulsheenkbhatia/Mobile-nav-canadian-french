import React, { memo } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import RatingStars from 'toro/components/product/RatingsAndReviews/RatingStars'
import Skeleton from 'toro/components/Skeleton'
import useAnalytics from 'toro/analytics/useAnalytics'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import usePageType from 'toro/hooks/usePageType'
import useReviewSectionHandle from 'toro/hooks/useReviewSectionHandle'

function StarRating({
  rating,
  count,
  fitReview,
  loading,
  pdpQaTag,
  variant,
  cursor,
  productData,
  isQuickView,
  bundleCardRedirect,
}) {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const reviews = useReviewSectionHandle({
    isEnabled: !bundleCardRedirect,
    onClick: () => {
      analytics.send('reviewInteraction', {
        eventLocation: isQuickView ? 'quick view' : 'product',
        eventAction: 'product rating click',
        eventLabel: productData?.masterId,
      })
    },
  })
  const styles = useMultiStyleConfig('StarRating')
  const { isPDP } = usePageType

  return (
    <Skeleton isLoaded={!loading}>
      <Flex
        sx={styles.tileRatingsWrapper}
        data-qa={
          pdpQaTag ? 'd_head-review-wrapper' : variant === 'mobile' ? 'm_head-review-wrapper' : ''
        }
        className="ratings-container"
        onClick={reviews.onClick}
      >
        <Box
          position="relative"
          style={{ transform: 'scale(0.86)', cursor: cursor ?? 'pointer' }}
          className="rating-stars"
          sx={styles.ratingStars}
          data-qa="qv_txt_pdt_cr"
        >
          <RatingStars starCount={rating} variant="small" isQuickView={isQuickView} />
        </Box>
        <Text
          textDecoration="none"
          variant="body-primary"
          size="sm"
          cursor="pointer"
          lineHeight="16px"
          data-qa={
            isQuickView
              ? 'qv_icon_pdt_rc'
              : pdpQaTag || variant === 'mobile'
              ? 'cm_icon_pdt_rc'
              : ''
          }
          className="review-count"
          sx={styles?.reviewCount?.(isPDP)}
        >
          {count ? `(${count})` : null}
        </Text>
        {fitReview && (
          <Text
            variant="body-primary"
            as="u"
            size="sm"
            cursor="pointer"
            lineHeight="16px"
            sx={styles.starRatingReviewsLabel}
          >
            {formatMessage({ id: 'pdp.product.starRatingReviewsLabel', defaultMessage: 'Reviews' })}
          </Text>
        )}
      </Flex>
    </Skeleton>
  )
}

export default withErrorBoundaryWrapper(memo(StarRating))
