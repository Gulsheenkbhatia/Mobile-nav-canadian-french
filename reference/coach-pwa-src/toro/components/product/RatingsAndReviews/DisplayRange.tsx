import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import { FormControl, FormLabel } from '@chakra-ui/react'
import useTheme from 'toro/hooks/useTheme'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

interface DisplayRangeProps {
  label?: string
  starCount?: number
  leftLabel?: string
  rightLabel?: string
  centerLabel?: string
  variant?: string
}

const DisplayRange: React.FC<DisplayRangeProps> = ({
  label = '',
  starCount,
  leftLabel = '',
  rightLabel = '',
  centerLabel = '',
  variant,
}) => {
  const styles = useMultiStyleConfig('RatingsAndReviews', { variant })
  const theme = useTheme()

  const { space } = theme

  return (
    <FormControl
      sx={styles.reviewRatingRange}
      mt={space.l}
      className="review-rating-range"
      id="size"
      data-qa="power_reviews_size"
    >
      <FormLabel
        sx={styles.displayRangeLabel}
        className="review-rating-range-label"
        fontFamily={'Helvetica Now Var'}
      >
        {label}
      </FormLabel>
      <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
        <Box sx={styles.displayRangeContentBlock}>
          <Flex sx={styles.displayRangeContainer} justify="space-between">
            <Box sx={styles.displayRangeContainerSize} textAlign="left">
              {leftLabel}
            </Box>
            <Box sx={styles.displayRangeContainerSize} textAlign="center">
              {centerLabel}
            </Box>
            <Box sx={styles.displayRangeContainerSize} textAlign="right">
              {rightLabel}
            </Box>
          </Flex>
          <input
            className="review-rating-slider"
            type="range"
            min="1"
            max="5"
            value={starCount}
            disabled
          />
        </Box>
      </Experiment>
      <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
        <Box className="review-rating-range-content">
          <input
            className="review-rating-slider"
            type="range"
            min="1"
            max="5"
            value={starCount}
            disabled
          />
          <Flex sx={styles.displayRangeContainer} justify="space-between">
            <Box sx={styles.displayRangeContainerSize} textAlign="left">
              {leftLabel}
            </Box>
            <Box sx={styles.displayRangeContainerSize} textAlign="center">
              {centerLabel}
            </Box>
            <Box sx={styles.displayRangeContainerSize} textAlign="right">
              {rightLabel}
            </Box>
          </Flex>
        </Box>
      </Experiment>
    </FormControl>
  )
}

export default DisplayRange
