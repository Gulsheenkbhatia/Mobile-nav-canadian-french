import { useMemo } from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import isFunction from 'lodash/isFunction'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

const DEFAULT_NUMBER_OF_PAGINATION = 4
const FIRST_SLIDE = 0
const SECOND_SLIDE = 1
const THIRD_SLIDE = 2
const LAST_SLIDE = 3

function CustomSliderPagination({
  activeSlideIdx,
  lengthOfSlides,
  goToSlide,
  variant,
  isLastSlideVisible = false,
}) {
  const isPDPV5Enabled = useTemplate([TemplateName.pdpv5])
  const styles = useMultiStyleConfig('CustomSliderPagination', { variant })
  const lengthOfPaginationSlides = Math.min(4, lengthOfSlides)
  const middleSlide = Math.round(lengthOfSlides / 2)
  const activePaginationSlide = useMemo(() => {
    if (lengthOfSlides <= DEFAULT_NUMBER_OF_PAGINATION) {
      return activeSlideIdx
    }
    if (activeSlideIdx === FIRST_SLIDE) {
      return FIRST_SLIDE
    }
    if (activeSlideIdx === lengthOfSlides - 1 || isLastSlideVisible) {
      return LAST_SLIDE
    }
    return activeSlideIdx < middleSlide ? SECOND_SLIDE : THIRD_SLIDE
  }, [activeSlideIdx, lengthOfSlides])

  const clickOnPaginationSlide = (idx) => {
    if (!isFunction(goToSlide)) return

    switch (idx) {
      case FIRST_SLIDE:
        goToSlide(FIRST_SLIDE)
        break

      case LAST_SLIDE:
        goToSlide(lengthOfSlides - 1)
        break

      case SECOND_SLIDE:
        if (activeSlideIdx >= SECOND_SLIDE && activeSlideIdx < middleSlide) {
          goToSlide(activeSlideIdx + 1)
        } else {
          goToSlide(SECOND_SLIDE)
        }
        break

      case THIRD_SLIDE:
        if (activeSlideIdx >= middleSlide && activeSlideIdx < lengthOfSlides - 1) {
          goToSlide(activeSlideIdx + 1)
        } else {
          goToSlide(middleSlide)
        }
        break

      default:
        break
    }
  }

  if (lengthOfSlides <= 1) {
    return null
  }

  return (
    <Flex sx={styles.paginationWrapper}>
      <Flex
        sx={styles.paginationContainer}
        {...(isPDPV5Enabled && { 'data-qa': 'pdp_btn_pagination' })}
      >
        {Array(lengthOfPaginationSlides)
          .fill(lengthOfPaginationSlides)
          .map((_, idx) => (
            <Box
              key={`slide-pagination-${idx}`}
              sx={{
                ...(activePaginationSlide === idx ? styles.activeSlide : styles.inActiveSlide),
              }}
              onClick={() => clickOnPaginationSlide(idx)}
            />
          ))}
      </Flex>
    </Flex>
  )
}

export default withErrorBoundaryWrapper(CustomSliderPagination)
