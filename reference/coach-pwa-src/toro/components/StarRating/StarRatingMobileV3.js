import { memo } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Skeleton from 'toro/components/Skeleton'
import useAnalytics from 'toro/analytics/useAnalytics'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import FullStar from 'design-tokens/icon/review/star.svg'
import useReviewSectionHandle from 'toro/hooks/useReviewSectionHandle'
import { reviewSectionNodeAtom, metaProductsAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'

function StarRatingMobileV3({
  rating,
  loading,
  pdpQaTag,
  variant,
  cursor,
  masterId,
  bundleCardRedirect,
  showViewMore = true,
  isPdpV42Enabled = false,
  svgWidth = 13,
  svgHeight = 13,
}) {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('StarRating', { variant: 'pdpV3' })
  const reviewSectionNode = useAtomValue(reviewSectionNodeAtom)
  const metaProducts = useAtomValue(metaProductsAtom)
  const reviews = useReviewSectionHandle({
    isEnabled: !bundleCardRedirect,
    onClick: () => {
      analytics.send('reviewInteraction', {
        eventLocation: 'product',
        eventAction: 'product rating click',
        eventLabel: masterId,
      })
    },
    shouldOpenTab: isPdpV42Enabled && metaProducts?.enabled,
  })
  const onClick = () => {
    reviewSectionNode?.scrollIntoView()
    analytics.send('reviewInteraction', {
      eventLocation: 'product',
      eventAction: 'product rating click',
      eventLabel: masterId,
    })
  }
  return (
    <Skeleton isLoaded={!loading}>
      <Flex
        sx={styles.tileRatingsWrapper}
        data-qa={
          pdpQaTag ? 'd_head-review-wrapper' : variant === 'mobile' ? 'm_head-review-wrapper' : ''
        }
        className="ratings-container"
        onClick={metaProducts?.enabled ? reviews.onClick : onClick}
      >
        <Box
          position="relative"
          style={{ cursor: cursor ?? 'pointer' }}
          data-qa="qv_txt_pdt_cr"
          sx={styles.startRatingIconWrapper}
          className="star-icon-wrapper"
        >
          <FullStar width={`${svgWidth}px`} height={`${svgHeight}px`} />
        </Box>
        <Text
          variant="body-primary"
          size="sm"
          as="span"
          cursor="pointer"
          letterSpacing="0.8px"
          sx={styles.starRatingNumberLabel}
          data-qa="cm_icon_pdt_rc"
        >
          {rating ? Number(rating).toFixed(1) : null}
        </Text>
        {showViewMore && (
          <Text
            className="view-reviews"
            variant="body-primary"
            size="sm"
            as="span"
            sx={styles.starRatingReviewsLabel}
          >
            {formatMessage({
              id: 'pdp.product.starRatingReviewsLabel',
              defaultMessage: 'View Reviews',
            })}
          </Text>
        )}
      </Flex>
    </Skeleton>
  )
}

export default withErrorBoundaryWrapper(memo(StarRatingMobileV3))
