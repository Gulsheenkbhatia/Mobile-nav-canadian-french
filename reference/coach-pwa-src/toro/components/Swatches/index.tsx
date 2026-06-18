import { memo, useMemo } from 'react'
import type { SystemStyleObject } from '@chakra-ui/react'
import chunk from 'lodash/chunk'
import get from 'lodash/get'
import Swatch from 'toro/components/Swatches/Swatch'
import ImageSlider from 'toro/components/ImageSlider'
import type { ImageSliderProps } from 'toro/components/ImageSlider'
import useViewportType from 'toro/hooks/useViewportType'

const SWATCHES_PER_SLIDE = 4

type Image = {
  alt: string
  src: string
}

// TODO: move to the global types
export type Color = {
  displayifOOS: boolean
  id: string
  image: Image
  isOnSale: boolean | null
  masterId: string
  media: {
    full: Image[]
    sequence: Image[]
    thumbnail: Image
    thumbnails: Image[]
  }
  orderable: boolean
  text: string
  url: string
  vgId: string
  isActiveColor?: boolean
  shouldNavigateToAnotherProduct?: boolean
}

type SwatchesProps = {
  colors: Color[]
  minHeight: string
  onChange: (color: Color) => void
  activeColorId: string | undefined
  styles: Record<string, SystemStyleObject>
  onArrowClick: ImageSliderProps['onArrowClick']
  sx?: SystemStyleObject
  className?: string
}

const Swatches = ({
  colors,
  styles,
  onChange,
  onArrowClick,
  activeColorId,
  ...rest
}: SwatchesProps) => {
  const { isDesktop } = useViewportType()
  const slides = useMemo(() => chunk(colors, SWATCHES_PER_SLIDE), [colors])

  return (
    <ImageSlider
      arrows
      dots={false}
      id="swatches-slider"
      onArrowClick={onArrowClick}
      isDesktop={isDesktop as boolean}
      swipeable={!isDesktop as boolean}
      {...rest}
    >
      {slides.map((colors, index) => (
        <ImageSlider.Slide
          sx={get(styles, 'swatchSlider')}
          key={`color-group-${index}`}
          data-testid="swatches_slide"
          pl={slides.length > 0 && Boolean(index) ? 'var(--spacing-4)' : 0}
        >
          {colors.map((color) => (
            <Swatch
              color={color}
              styles={styles}
              key={`color-${color.id}`}
              onChange={() => onChange(color)}
              isActive={get(color, 'id', null) === activeColorId}
            />
          ))}
        </ImageSlider.Slide>
      ))}
    </ImageSlider>
  )
}

export default memo(Swatches)
