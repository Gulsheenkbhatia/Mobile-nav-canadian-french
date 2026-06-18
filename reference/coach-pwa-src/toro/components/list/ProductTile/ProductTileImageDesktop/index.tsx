import { memo, useRef, useEffect, useMemo, useState, type ComponentProps } from 'react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import get from 'lodash/get'
import pick from 'lodash/pick'
import addImgSizesForPrerender from 'helpers/addImgSizesForPrerender'
import Tooltip from 'toro/components/Tooltip'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'
import type { MediaImage } from 'toro/types/productTypes'

export type ProductTileImageDesktopProps = {
  isParentFocused?: boolean
  isParentHovered?: boolean
  colorName?: string
  onImageLoad?: () => void
  displayedThumbnails?: MediaImage[]
  lazyLoadImage?: boolean
  preloadImageSrc?: string
  alt?: string
} & Omit<ComponentProps<typeof Image>, 'alt' | 'onImageLoad'>

const ProductTileImageDesktop = ({
  isParentFocused,
  isParentHovered: isHovered,
  colorName,
  onImageLoad,
  displayedThumbnails,
  lazyLoadImage,
  preloadImageSrc,
  alt,
  ...props
}: ProductTileImageDesktopProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { isDesktop } = useViewportType()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const {
    toggleSiteFeatures: { showAnimation = false, tileImageAnimationDelay = 0 },
  } = usePreference({ ToggleSiteFeatures: ['showAnimation', 'tileImageAnimationDelay'] })

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef?.current) {
        clearTimeout(timeoutRef.current)
      }
    }
    if (isHovered && displayedThumbnails?.length > 1) {
      resetTimeout()
      timeoutRef.current = setTimeout(
        () =>
          setCurrentSlide((prevIndex) => {
            if (prevIndex === displayedThumbnails?.length - 1) {
              resetTimeout()
              return 0
            } else {
              return prevIndex + 1
            }
          }),
        tileImageAnimationDelay
      )
      return () => {
        resetTimeout()
      }
    } else if (!isParentFocused) {
      resetTimeout()
      setCurrentSlide(0)
    }
  }, [currentSlide, isHovered, displayedThumbnails, tileImageAnimationDelay, isParentFocused])

  useEffect(() => {
    if (isParentFocused)
      setCurrentSlide((prevIndex) => {
        const nextIndex = prevIndex + 1
        return nextIndex <= displayedThumbnails?.length ? nextIndex : prevIndex
      })
    else setCurrentSlide(0)
  }, [isParentFocused])

  const { src: imageSrc, alt: imageAlt = alt } = useMemo(() => {
    const idx = isHovered && displayedThumbnails?.length > 1 ? 1 : 0
    return pick(get(displayedThumbnails, idx), ['src', 'alt'])
  }, [displayedThumbnails, isHovered])

  const imageProps = addImgSizesForPrerender(
    {
      maxHeight: '296px',
      aspectRatio: 1.25,
      maxWidth: '100%',
      objectFit: 'cover',
      sx: {
        height: '100%',
      },
    },
    237,
    296
  )

  const Wrapper = !isDesktop ? Box : Tooltip

  return (
    <Wrapper variant="productTile" placement="bottom" fontSize="xs">
      <Box>
        {(isHovered || isParentFocused) && showAnimation && displayedThumbnails?.length > 1 ? (
          <Image
            style={{
              transform: `translate3d(${-currentSlide * 100}%)`,
              transition: '0.2s transform ease',
            }}
            src={displayedThumbnails[currentSlide]?.src}
            lazy={lazyLoadImage}
            {...imageProps}
            {...props}
            title={colorName}
          />
        ) : (
          <Image
            lazy={lazyLoadImage}
            fetchpriority={preloadImageSrc === imageSrc ? 'high' : 'low'}
            src={imageSrc}
            alt={imageAlt}
            title={colorName}
            onImageLoad={onImageLoad}
            {...imageProps}
            {...props}
            data-qa="cm_tile_link_pt_img"
          />
        )}
      </Box>
    </Wrapper>
  )
}

export default memo(ProductTileImageDesktop)
