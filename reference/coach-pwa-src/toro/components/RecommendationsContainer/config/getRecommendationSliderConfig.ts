import get from 'lodash/get'
import { RecommendationsBlockProps } from '../types'

type Variant = RecommendationsBlockProps['variant']
type RecommendationSliderConfig = {
  slideSpacing: number
  maxProductsPerSlide: number
  sliderGap: string
}

const SPLIDE_MARGIN_RIGHT = 12
const SPLIDE_MAX_PRODUCTS_PER_SLIDE = 4
const SPLIDE_MARGIN_RIGHT_AE_DRAWER = 4
const SPLIDE_MAX_PRODUCTS_PER_SLIDE_AE_DRAWER = 3
const SPLIDE_MAX_PRODUCTS_PER_SLIDE_RECOM_CAROUSEL_THINK = 6

const config = {
  aeDrawer: {
    slideSpacing: SPLIDE_MARGIN_RIGHT_AE_DRAWER,
    maxProductsPerSlide: SPLIDE_MAX_PRODUCTS_PER_SLIDE_AE_DRAWER,
    sliderGap: 'gap',
  },
  recomCarouselThink: {
    slideSpacing: SPLIDE_MARGIN_RIGHT,
    maxProductsPerSlide: SPLIDE_MAX_PRODUCTS_PER_SLIDE_RECOM_CAROUSEL_THINK,
    sliderGap: 'var(--spacing-3)',
  },
}

const defaultConfig = {
  slideSpacing: SPLIDE_MARGIN_RIGHT,
  maxProductsPerSlide: SPLIDE_MAX_PRODUCTS_PER_SLIDE,
  sliderGap: 'var(--spacing-3)',
}

export const getRecommendationSliderConfig = ({
  variant,
}: {
  variant: Variant
}): RecommendationSliderConfig => {
  return get(config, variant, defaultConfig)
}
