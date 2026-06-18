import React, { memo } from 'react'
import { useIntl } from 'react-intl'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { InteractivityProps, type SystemStyleObject } from '@chakra-ui/react'

const textQaData = 'cm_link_pt_rc'

const iconProps = {
  width: '11px',
  height: '11px',
  viewBox: '0 0 24 24',
}

interface StarRatingV2Props {
  rating: number | string
  count: number
  cursor?: InteractivityProps['cursor']
  styles: Record<string, SystemStyleObject>
}

function StarRatingV2({ rating, count, cursor = 'pointer', styles }: StarRatingV2Props) {
  const starCountNum = Number(rating).toFixed(1)
  const { formatMessage } = useIntl()
  if (!Boolean(rating) && !Boolean(count)) {
    return null
  }
  return (
    <Flex
      justifyContent="flex-start"
      className="ratings-container"
      alignItems="center"
      sx={styles?.ratingWrapper}
    >
      {Boolean(rating) && (
        <Flex
          cursor={cursor}
          pr="var(--spacing-1)"
          mr="var(--spacing-1)"
          data-qa="qv_txt_pdt_cr"
          alignItems="center"
          position="relative"
          _after={{
            content: '""',
            position: 'absolute',
            right: 0,
            height: '80%',
            width: '1px',
            backgroundColor: 'var(--border-color-neutral-base)',
          }}
          sx={styles?.ratingIconWrapper}
        >
          <svg {...iconProps}>
            <use href="#icon-star" />
          </svg>
          <Text
            textDecoration="none"
            variant="body-primary"
            size="sm"
            color="var(--color-primary)"
            cursor="pointer"
            ml="2px"
            lineHeight="var(--line-height-xl)"
            position="relative"
            sx={styles?.ratingStarCount}
          >
            {starCountNum}
          </Text>
        </Flex>
      )}
      {Boolean(count) && (
        <Flex>
          <Text
            textDecoration="underline"
            variant="body-primary"
            size="sm"
            color="var(--color-primary)"
            cursor="pointer"
            lineHeight="var(--line-height-xl)"
            position="relative"
            data-qa={textQaData}
            sx={styles?.ratingReviewCount}
          >
            {formatMessage(
              { id: 'plp.product.reviewsRatingLabel', defaultMessage: '{count} Reviews' },
              { count }
            )}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

export default withErrorBoundaryWrapper(memo(StarRatingV2))
