import React, { memo } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import RatingStars from 'toro/components/product/RatingsAndReviews/RatingStars'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { InteractivityProps } from '@chakra-ui/react'

const textQaData = 'cm_link_pt_rc'

interface StarRatingProps {
  rating: number | string
  count: number
  cursor?: InteractivityProps['cursor']
}

function StarRating({ rating, count, cursor = 'pointer' }: StarRatingProps) {
  const styles = useMultiStyleConfig('StarRating', undefined)
  if (!Boolean(rating) && !Boolean(count)) {
    return null
  }
  return (
    <Flex sx={styles.tileRatingsWrapper} className="ratings-container">
      {Boolean(rating) && (
        <Box position="relative" width="83px" mx="6px" cursor={cursor} data-qa="qv_txt_pdt_cr">
          <RatingStars starCount={rating} variant="small" />
        </Box>
      )}
      {Boolean(count) && (
        <Text
          textDecoration="none"
          variant="body-primary"
          size="sm"
          cursor="pointer"
          lineHeight="s"
          data-qa={textQaData}
          sx={styles.reviewCount}
        >
          {`(${count})`}
        </Text>
      )}
    </Flex>
  )
}

export default withErrorBoundaryWrapper(memo(StarRating))
