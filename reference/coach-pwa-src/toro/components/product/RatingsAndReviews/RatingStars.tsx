import { useMemo, memo } from 'react'
import range from 'lodash/range'
import Flex from 'toro/components/Flex'
import HStack from 'toro/components/Hstack'
import StarComponent from './StarComponent'
import useTheme from 'toro/hooks/useTheme'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import type { FlexProps } from '@chakra-ui/react'

type RatingStarsProps = {
  starCount: string | number
  variant?: 'large' | 'small' | 'xs'
  justify?: FlexProps['justify']
  isQuickView?: boolean
  starWrapper?: FlexProps['sx']
  reviewImgOverlay?: boolean
  containerMarginLeft?: string
}

const range5 = range(5)

function RatingStars({
  starCount,
  variant = 'large',
  justify = 'flex-start',
  isQuickView = false,
  starWrapper,
  reviewImgOverlay = false,
  containerMarginLeft = '1.5px',
}: RatingStarsProps) {
  const theme = useTheme()
  const styles = useMultiStyleConfig('RatingsAndReviews', undefined)

  const starCountNum = useMemo(() => Number(Number(starCount).toFixed(1)), [starCount])
  const starSize = {
    width:
      ((variant === 'xs' && styles?.starSizesReviewItem?.width) || styles?.starSizes?.width) ??
      '16',
    height:
      ((variant === 'xs' && styles?.starSizesReviewItem?.height) || styles?.starSizes?.height) ??
      '16',
  }
  const stars = range5.map((idx) => {
    const diff = Math.max(starCountNum - idx, 0)
    const starVariant = reviewImgOverlay
      ? diff > 0
        ? 'full'
        : 'empty'
      : diff >= 1
      ? 'full'
      : diff === 0
      ? 'empty'
      : 'half'
    return (
      <StarComponent
        key={idx}
        variant={starVariant}
        width={variant === 'large' ? '24px' : (starSize.width as 'string')}
        height={variant === 'large' ? '22px' : (starSize.height as 'string')}
        isQuickView={isQuickView}
        reviewImgOverlay={reviewImgOverlay}
      />
    )
  })

  if (variant === 'large') {
    return (
      <Flex
        justify={justify}
        sx={starWrapper}
        data-qa="pdp_overall_rating_scores"
        className="rating-starts-wrapper-large"
      >
        <HStack sx={styles.starSapcing}>{stars}</HStack>
      </Flex>
    )
  }

  return (
    <HStack spacing={theme.space.xs} ml={containerMarginLeft} data-qa="pdp_overall_rating_scores">
      {stars}
    </HStack>
  )
}

export default memo(RatingStars)
