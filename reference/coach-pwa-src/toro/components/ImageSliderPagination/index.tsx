import React, { memo } from 'react'
import Box from 'toro/components/Box'
import range from 'lodash/range'

export type ImageSliderPaginationProps = {
  activeSlideIndex: number
  totalSlidesNum: number
  variant?: string
  styles?: any
}

const dotsContainerQa = 'm_plp_btn_img_slickdots'

const ImageSliderPagination = ({
  activeSlideIndex,
  totalSlidesNum,
  variant,
  styles,
}: ImageSliderPaginationProps): JSX.Element => {
  return (
    <Box sx={styles.dotsContainer} data-qa={dotsContainerQa}>
      {!variant &&
        range(totalSlidesNum).map((index) => (
          <Box
            key={`slide-dot-${index}`}
            sx={styles.dot}
            className={index === activeSlideIndex ? 'active' : null}
          />
        ))}
      {variant === 'slide' && (
        <Box sx={styles.sliderLine}>
          <Box
            sx={styles.slider}
            w={`calc(100% / ${totalSlidesNum})`}
            ml={`calc((100% / ${totalSlidesNum}) * ${activeSlideIndex})`}
          />
        </Box>
      )}
    </Box>
  )
}

export default memo(ImageSliderPagination)
