import dynamic from 'next/dynamic'
import { useStyles } from '@chakra-ui/react'
import { Splide } from '@splidejs/react-splide'
import { Children, FC, useEffect, useMemo, useRef } from 'react'

import Box from 'toro/components/Box'
import { SLIDE_WIDTH, SLIDER_WIDTH } from 'toro/constants/appConstants'
import { RecommendationsBlockProps } from 'toro/components/RecommendationsContainer/types'
import { getRecommendationSliderConfig } from './config/getRecommendationSliderConfig'

const SplideSlider = dynamic(() => import('toro/components/SplideSlider'), {
  ssr: false,
})

const PADDINGS_VALUE = 24 * 2

const DesktopRecommendations: FC<RecommendationsBlockProps> = ({
  children,
  variant = 'baseStyle',
}) => {
  const styles: any = useStyles()
  const sliderRef = useRef<Splide | null>(null)
  const childCount = Children.count(children)

  const { maxProductsPerSlide, slideSpacing, sliderGap } = useMemo(
    () => getRecommendationSliderConfig({ variant }),
    [variant]
  )

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current?.go(0)
    }
  }, [])

  const isTabbed = variant.startsWith('tabbed')
  const customSliderWidth = childCount * SLIDE_WIDTH
  const carouselWidth =
    customSliderWidth > SLIDER_WIDTH
      ? SLIDER_WIDTH
      : customSliderWidth + PADDINGS_VALUE + slideSpacing * childCount

  // if the number of products less than max per slide (means not enough to apply arrows),
  // then we need to set perPage to be childCount
  const perPageProducts = childCount < maxProductsPerSlide ? childCount : maxProductsPerSlide

  return (
    <Box
      className="recommendSlider"
      maxWidth={isTabbed ? undefined : `${carouselWidth}px`}
      sx={styles.baseRecommendationDesktopSliderWrapper}
    >
      <SplideSlider
        innerRef={sliderRef}
        options={{
          pagination: false,
          drag: true,
          lazyLoad: 'nearby',
          perPage: perPageProducts,
          perMove: 1,
          arrows: childCount > maxProductsPerSlide,
          gap: isTabbed ? undefined : sliderGap,
        }}
        styles={{
          arrows: styles?.baseRecommendationArrowStyles,
          arrowPrev: styles?.baseRecommendationArrowPrev,
          arrowNext: styles?.baseRecommendationArrowNext,
          splidePadding: styles?.baseRecommendationSplidePadding,
          container: styles.baseRecommendationSliderContainer,
        }}
        arrowsBold={isTabbed}
      >
        {children}
      </SplideSlider>
    </Box>
  )
}

export default DesktopRecommendations
