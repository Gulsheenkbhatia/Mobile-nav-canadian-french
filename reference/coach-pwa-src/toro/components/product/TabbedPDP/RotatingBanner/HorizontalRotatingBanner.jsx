import React, { useCallback, useState, useRef } from 'react'
import RotatingBanner from 'toro/components/product/TabbedPDP/RotatingBanner'
import NavChevronLeft from 'design-tokens/icon/utility/chevron-bold-left.svg'
import NavChevronRight from 'design-tokens/icon/utility/chevron-bold-right.svg'
import PauseIcon from 'design-tokens/icon/video/pause.svg'
import Box from 'toro/components/Box'
import { useMultiStyleConfig } from '@chakra-ui/react'

const HorizontalRotatingBanner = ({ rotationMessages, isPaused, ...props }) => {
  const [isManuallyPaused, setIsManuallyPaused] = useState(false)
  const shiftSlideFn = useRef(null)
  const styles = useMultiStyleConfig('RotatingBanner', { variant: 'horizontal' })

  const handlePrevious = useCallback(() => {
    shiftSlideFn.current?.('left')
  }, [])

  const handleNext = useCallback(() => {
    shiftSlideFn.current?.('right')
  }, [])

  const handlePauseToggle = useCallback(() => {
    setIsManuallyPaused((playState) => !playState)
  }, [])

  const setShiftSlideMethod = useCallback((shiftSlide) => {
    shiftSlideFn.current = shiftSlide
  }, [])

  if (!rotationMessages?.length) {
    return null
  } else if (rotationMessages.length === 1) {
    return <RotatingBanner rotationMessages={rotationMessages} isPaused={isPaused} {...props} />
  }

  return (
    <Box sx={styles.rootContainer} className="horizontal-rotating-banner">
      <Box data-qa="rb_btnArrow_Prev" sx={styles.arrowLeft} onClick={handlePrevious}>
        <NavChevronLeft width="16" height="16" />
      </Box>
      <RotatingBanner
        rotationMessages={rotationMessages}
        isPaused={isPaused || isManuallyPaused}
        variant="horizontal"
        setShiftSlideMethod={setShiftSlideMethod}
        {...props}
      />
      <Box data-qa="rb_pauseBtn" sx={styles.pauseButton} onClick={handlePauseToggle}>
        <PauseIcon width="16" height="16" />
      </Box>
      <Box data-qa="rb_btnArrow_Next" sx={styles.arrowRight} onClick={handleNext}>
        <NavChevronRight width="16" height="16" />
      </Box>
    </Box>
  )
}

export default HorizontalRotatingBanner
