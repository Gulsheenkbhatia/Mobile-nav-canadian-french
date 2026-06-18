import { useCallback, memo, useMemo, useRef, useEffect } from 'react'
import Image from 'toro/components/Image'
import get from 'lodash/get'
import ImageSlider from 'toro/components/ImageSlider'
import Box from 'toro/components/Box'
import ProductTileVideo from 'toro/components/list/ProductTile/ProductTileVideo'
import { useAtomValue } from 'jotai/utils'
import { isPlpV3Atom } from 'store/plp.atom'
import { getAssetTypeFromSrc } from 'toro/components/product/ProductMediaArea/helpers'
import { usePLPAutoscrollToVideoAsset } from 'toro/hooks/usePLPAutoscrollToVideoAsset'
import usePreference from 'toro/hooks/usePreference_new'
import type { SystemStyleObject } from '@chakra-ui/react'
import type { Color, MediaItem } from 'toro/types/productTypes'

const imageDataQa = 'cm_tile_link_pt_img'
const containerProps = {
  height: '100%',
  width: '100%',
}

type ImageSliderHandle = {
  slideForward: () => void
  scrollToSlide: (slideIndex: number, halfScrollRequired?: boolean) => void
}

export interface ProductTileCarouselProps {
  id: string
  name: string
  thumbnails: MediaItem[]
  lazyLoadImage: boolean
  onImageLoad?: () => void
  onSlide: (index: number, isForcedScroll: boolean) => void
  aspectRatio?: number
  isTileVisible: boolean
  preloadImageSrc: string
  video?: string
  styles: Record<string, SystemStyleObject>
  color?: Color
}

function ProductTileCarousel({
  id,
  name,
  thumbnails,
  lazyLoadImage,
  onImageLoad,
  onSlide,
  aspectRatio = 1.249,
  isTileVisible,
  preloadImageSrc,
  video,
  styles,
  color = {},
}: ProductTileCarouselProps) {
  const {
    plpTemplateConfigurations: { enableVideoInCarousel },
  } = usePreference({
    plpTemplateConfigurations: ['enableVideoInCarousel'],
  })
  const { autoscrollToVideoEnabled, videoAssetIndex, halfScrollRequired } =
    usePLPAutoscrollToVideoAsset(color, thumbnails)

  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const canRenderCarousel = useMemo(
    () => isTileVisible && thumbnails?.length > 1,
    [isTileVisible, thumbnails]
  )
  const imageLoadTriggeredRef = useRef(false)
  const sliderRef = useRef<ImageSliderHandle | null>(null)
  const isVideoPlaying = useRef(true)
  const isVideoVisible = video && isPlpV3

  // Because we switch between rendering a carousel or just an image, the image load event will
  // trigger every time the image is loaded in. We need to make sure we're only triggering the event
  // once.
  const handleImageLoad = useCallback(() => {
    if (!imageLoadTriggeredRef.current) {
      imageLoadTriggeredRef.current = true
      onImageLoad?.()
    }
  }, [onImageLoad])

  const firstThumbnailSrc = get(thumbnails, '[0].src')

  const renderedImage = useMemo(() => {
    return (
      <>
        <Image
          alt={name}
          src={firstThumbnailSrc}
          minHeight="var(--max-mobile-image-tile-height, var(--min-mobile-tile-height))"
          width="100%"
          height="100%"
          objectFit="cover"
          aspectRatio={aspectRatio}
          data-qa={imageDataQa}
          containerProps={containerProps}
          onImageLoad={handleImageLoad}
          lazy={lazyLoadImage}
          fetchpriority={preloadImageSrc === firstThumbnailSrc ? 'high' : 'low'}
          sx={styles.carouselImage}
        />
        {/*This hack was implemented to align ProductTiles on the PLP when the product doesn't have
        more than 1 image. So it will add additional body of the image to be aligned with the
        product which has dots functionality. But for PLP_V2 instead of dots we have slider
        functionality which overlaps the image, so we don't need that anymore*/}
        {!isPlpV3 && <Box h="15.5px" />}
      </>
    )
  }, [firstThumbnailSrc, name, aspectRatio, handleImageLoad])

  const onSlideChange = (index: number, isForcedScroll: boolean) => {
    if (index === 0 && isVideoVisible) {
      isVideoPlaying.current = true
    } else {
      isVideoPlaying.current = false
    }
    onSlide(index, isForcedScroll)
  }
  const onVideoEnd = () => {
    if (sliderRef && sliderRef.current) {
      isVideoPlaying.current = false
      const slideForward = enableVideoInCarousel ? () => null : sliderRef.current.slideForward
      slideForward()
    }
  }

  useEffect(() => {
    if (sliderRef?.current && enableVideoInCarousel && autoscrollToVideoEnabled) {
      sliderRef.current.scrollToSlide(0)
    }
  }, [color?.id, enableVideoInCarousel, autoscrollToVideoEnabled])

  useEffect(() => {
    if (sliderRef?.current && enableVideoInCarousel && autoscrollToVideoEnabled) {
      sliderRef.current.scrollToSlide(videoAssetIndex, halfScrollRequired)
    }
    // videoAssetIndex and halfScrollRequired should be omitted from the dependency array,
    // as they are only needed once on mount
    // canRenderCarousel is included so this effect runs when the carousel mounts.
  }, [canRenderCarousel, enableVideoInCarousel, autoscrollToVideoEnabled])

  useEffect(() => {
    if (isVideoVisible && sliderRef && sliderRef.current && isVideoPlaying.current) {
      const slideForward = enableVideoInCarousel ? () => null : sliderRef.current.slideForward
      slideForward()
    }
  }, [id, enableVideoInCarousel])

  const renderedCarousel = useMemo(() => {
    return (
      <ImageSlider
        id={id}
        onSlideChange={onSlideChange}
        swipeable
        dots
        styles={styles}
        ref={sliderRef}
      >
        {isVideoVisible && (
          <ImageSlider.Slide mx="1px" key={`${name}-${video}`} sx={styles.imagesSliderItem}>
            <ProductTileVideo
              poster={firstThumbnailSrc}
              videoSrc={video}
              key={video}
              onVideoEnd={onVideoEnd}
            />
          </ImageSlider.Slide>
        )}

        {thumbnails.map((item, index) => {
          const src = get(item, 'src')
          const alt = get(item, 'alt', name)

          return (
            <ImageSlider.Slide
              mx="1px"
              key={`${getAssetTypeFromSrc(src)}-${index}`}
              sx={styles.imagesSliderItem}
            >
              {'type' in item && item.type === 'video' ? (
                <ProductTileVideo
                  poster={get(item, 'poster.src')}
                  videoSrc={src}
                  onVideoEnd={onVideoEnd}
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
                  data-qa={imageDataQa}
                  onImageLoad={index === 0 ? handleImageLoad : null}
                  fetchpriority={src === preloadImageSrc ? 'high' : 'low'}
                  containerProps={containerProps}
                />
              )}
            </ImageSlider.Slide>
          )
        })}
      </ImageSlider>
    )
  }, [
    id,
    name,
    thumbnails,
    lazyLoadImage,
    aspectRatio,
    handleImageLoad,
    onSlide,
    firstThumbnailSrc,
  ])

  // TODO: Split the components because of conditional rendering
  return canRenderCarousel ? renderedCarousel : renderedImage
}

export default memo(ProductTileCarousel)
