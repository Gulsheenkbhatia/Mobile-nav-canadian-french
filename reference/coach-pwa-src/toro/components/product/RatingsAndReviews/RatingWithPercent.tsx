import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { FullStarIcon } from 'toro/icons'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

interface RatingWithPercentProps {
  star?: number
  percent?: string
  ratingsFilter?: Record<string, any>
  setRatingsFilter?: (filter: Record<string, any>) => void
  variant?: string
}

function RatingWithPercent({
  star,
  percent = '',
  ratingsFilter = {},
  setRatingsFilter = () => {},
  variant,
}: RatingWithPercentProps) {
  const styles = useMultiStyleConfig('RatingsAndReviews', { variant })

  function ScrollInto() {
    document?.getElementById('reviewstart')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function handleOnClick() {
    setRatingsFilter({ ...ratingsFilter, filterBy: `rating:${star}` })
    ScrollInto()
  }

  return (
    <Flex
      sx={styles.ratingWithPercentContainer}
      align="center"
      onClick={handleOnClick}
      cursor="pointer"
    >
      <Box sx={styles.fullStarContainer}>
        <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
          <FullStarIcon width="24" height="24" />
        </Experiment>
        <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
          <FullStarIcon width="24" height="24" />
          <Box sx={styles.ratingStarCount}>{star}</Box>
        </Experiment>
      </Box>
      <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
        <Box sx={styles.ratingStarCount}>{star}</Box>
      </Experiment>
      <Box sx={styles.ratingStarProgressBarSuperContainer} width="100%">
        <Box sx={styles.ratingStarProgressBarContainer}>
          <Box sx={styles.ratingStarProgressBar} width={percent} height="8px"></Box>
        </Box>
      </Box>
      <Box sx={styles.ratingStarPercent}>{percent}</Box>
    </Flex>
  )
}

export default RatingWithPercent
