import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Button from 'toro/components/Button'
import { NavChevronLeftIcon, NavChevronRightIcon } from 'toro/icons'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'

const ARROW_DEFAULTS = {
  variant: 'icon-only',
  size: 'content',
}

function NumericSliderPagination({ activeSlideIdx, lengthOfSlides, goToSlide, setActiveIdx }) {
  const isPDPV5Enabled = useTemplate([TemplateName.pdpv5])
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)

  const styles = useMultiStyleConfig('NumericSliderPagination', {
    variant: isPdpV42Enabled ? 'pdpV42' : null,
  })

  const handlePrevArrowClick = () => {
    if (activeSlideIdx === 0) {
      setActiveIdx(lengthOfSlides - 1)
    }
    goToSlide(activeSlideIdx - 1)
  }

  const handleNextArrowClick = () => {
    if (activeSlideIdx === lengthOfSlides - 1) {
      setActiveIdx(0)
    }
    goToSlide(activeSlideIdx + 1)
  }

  return (
    <Flex
      sx={styles.paginationWrapper}
      {...(isPDPV5Enabled && { 'data-qa': 'pdp_btn_pagination' })}
    >
      <Flex sx={styles.paginationContainer}>
        <Button
          {...ARROW_DEFAULTS}
          sx={styles.arrow}
          onClick={handlePrevArrowClick}
          data-qa="btn_chevron_left"
        >
          <NavChevronLeftIcon width="22" height="22" viewBox="0 0 22 22" />
        </Button>
        <Flex sx={styles.numbers} data-qa="pdp_asset_count">
          <Box>{activeSlideIdx + 1}</Box>
          <Box>/</Box>
          <Box>{lengthOfSlides}</Box>
        </Flex>
        <Button
          {...ARROW_DEFAULTS}
          sx={styles.arrow}
          onClick={handleNextArrowClick}
          data-qa="btn_chevron_right"
        >
          <NavChevronRightIcon width="22" height="22" viewBox="0 0 22 22" />
        </Button>
      </Flex>
    </Flex>
  )
}

export default withErrorBoundaryWrapper(NumericSliderPagination)
