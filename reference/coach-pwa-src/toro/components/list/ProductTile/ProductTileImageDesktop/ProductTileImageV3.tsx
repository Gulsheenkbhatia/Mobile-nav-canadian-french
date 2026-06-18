import { useState, useCallback, memo, useRef } from 'react'
import Image from 'toro/components/Image'
import get from 'lodash/get'
import ImageSlider from 'toro/components/ImageSlider'
import ProductTileVideo from 'toro/components/list/ProductTile/ProductTileVideo'

const INITIAL_SLIDE_INDEX = 0

const containerProps = {
  height: '100%',
  width: '100%',
}

const arrowsDataQa = { leftArrow: 'leftArrowAltImage', rightArrow: 'rightArrowAltImage' }

const ProductTileImageV3 = ({
  id,
  name,
  thumbnails,
  lazyLoadImage,
  onImageLoad,
  aspectRatio = 1.249,
  preloadImageSrc,
  styles,
  onCarouselArrowClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(INITIAL_SLIDE_INDEX)
  const imageLoadTriggeredRef = useRef(false)
  const sliderRef = useRef(null)

  const handleImageLoad = useCallback(() => {
    if (!imageLoadTriggeredRef.current) {
      imageLoadTriggeredRef.current = true
      onImageLoad?.()
    }
  }, [onImageLoad])

  return (
    <ImageSlider
      id={id}
      styles={styles}
      ref={sliderRef}
      isDesktop
      onArrowClick={onCarouselArrowClick}
      arrows={thumbnails.length > 1}
      isInfinite={thumbnails.length > 1}
      arrowsDataQa={arrowsDataQa}
      onSlideChange={setActiveIndex}
    >
      {thumbnails.map((item, index) => {
        const src = get(item, 'src')
        const alt = get(item, 'alt', name)

        return (
          <ImageSlider.Slide key={`${name}-${src}`}>
            {item.type === 'video' ? (
              <ProductTileVideo
                poster={get(item, 'poster.src')}
                videoSrc={src}
                onVideoEnd={() => null}
                {...(index === activeIndex ? { 'data-centered': 'true' } : {})}
              />
            ) : (
              <Image
                lazy={lazyLoadImage || index > 0}
                alt={alt}
                src={src}
                minHeight="var(--max-mobile-image-tile-height, var(--min-mobile-tile-height))"
                width="100%"
                height="100%"
                objectFit="cover"
                aspectRatio={aspectRatio}
                onImageLoad={index === 0 ? handleImageLoad : null}
                fetchpriority={src === preloadImageSrc ? 'high' : 'low'}
                containerProps={containerProps}
                {...(index === activeIndex ? { 'data-centered': 'true' } : {})}
              />
            )}
          </ImageSlider.Slide>
        )
      })}
    </ImageSlider>
  )
}

export default memo(ProductTileImageV3)
