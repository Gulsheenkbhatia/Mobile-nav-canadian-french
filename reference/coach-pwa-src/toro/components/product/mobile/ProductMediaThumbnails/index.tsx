import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import Thumbnail from 'toro/components/product/mobile/ProductMediaThumbnails/Thumbnail'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import SplideSlider from 'toro/components/SplideSlider'
import StylesProvider from 'toro/components/StylesProvider'
import debounce from 'lodash/debounce'

type SplideSliderRef = React.ElementRef<typeof SplideSlider>

export interface CarouselMediaItem {
  alt?: string
  poster?: string | undefined
  src?: string
  title?: string
  position?: number
  type?: string
}

interface ProductMediaThumbnailsProps {
  thumbnailImages: CarouselMediaItem[]
  activeIdx: number
  onThumbnailClick: (index: number) => void
}

const THUMB_WIDTH = 48
const THUMB_GAP = 6
const PADDING = 24

const carouselOptions = {
  fixedWidth: THUMB_WIDTH,
  fixedHeight: 53,
  gap: 6,
  perMove: 1,
  pagination: false,
  arrows: false,
  drag: true,
  rewind: true,
  border: 'none',
}

const ProductMediaThumbnails = forwardRef<SplideSliderRef | null, ProductMediaThumbnailsProps>(
  ({ thumbnailImages, activeIdx, onThumbnailClick }, thumbsRef) => {
    const thumbWrapperRef = useRef(null)
    const [shouldCenter, setShouldCenter] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const styles = useMultiStyleConfig('ProductMediaThumbnails', { shouldCenter })

    const calculateLayout = () => {
      if (!thumbWrapperRef?.current) return

      const containerWidth = thumbWrapperRef.current.offsetWidth
      const totalThumbWidth =
        thumbnailImages.length * THUMB_WIDTH + (thumbnailImages.length - 1) * THUMB_GAP + PADDING

      setShouldCenter(totalThumbWidth <= containerWidth)
      setIsLoaded(true)
    }

    const debouncedCalculateLayout = useMemo(
      () => debounce(calculateLayout, 150),
      [calculateLayout]
    )

    useEffect(() => {
      calculateLayout()
      window.addEventListener('resize', debouncedCalculateLayout)
      return () => {
        window.removeEventListener('resize', debouncedCalculateLayout)
        debouncedCalculateLayout.cancel()
      }
    }, [thumbnailImages.length])

    return (
      <Box ref={thumbWrapperRef} sx={styles.carouselContainer}>
        {isLoaded && (
          <SplideSlider
            innerRef={thumbsRef}
            options={carouselOptions}
            aria-label="Product thumbnails"
            styles={styles}
          >
            {thumbnailImages.map((item, index) => (
              <StylesProvider value={styles} key={`thumbnail-${index}`}>
                <Thumbnail
                  item={item}
                  onClick={() => onThumbnailClick(index)}
                  isVideo={item.type === 'video'}
                  isActive={activeIdx === index}
                />
              </StylesProvider>
            ))}
          </SplideSlider>
        )}
      </Box>
    )
  }
)

export default ProductMediaThumbnails
