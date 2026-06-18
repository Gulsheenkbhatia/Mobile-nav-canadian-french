import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Img as ChakraUIImage, PropsOf } from '@chakra-ui/react'
import Box from 'toro/components/Box'
import { InView } from 'react-intersection-observer'
import { useAtomValue } from 'jotai/utils'
import { imagePlaceholderUrlAtom } from 'store/image-placeholder.atom'

interface ImageProps {
  src?: string
  lazy?: 'ssr' | boolean
  lazyOffset?: number
  fetchpriority?: 'high' | 'low' | 'auto'
  className?: string
  aspectRatio?: number
  aspectImgRatio?: string
  pdp?: boolean
  onImageLoad?: () => void
  showAs?: React.ElementType
  noMinH?: boolean
  noMinW?: boolean
  slideChanged?: number
  containerProps?: PropsOf<typeof Box>
  title?: string
  imgResponsive?: React.CSSProperties
  [key: string]: any
  children?: React.ReactNode
}

const applyMinHeight = (aspectImgRatio) => ({
  position: 'relative',
  paddingTop: `calc(100% / ${aspectImgRatio || '0.8'})`,
  '& img': {
    position: 'absolute',
    left: 0,
    top: 0,
  },
})

export default function Image({
  lazy,
  lazyOffset,
  className,
  aspectRatio,
  aspectImgRatio,
  pdp,
  src,
  onImageLoad,
  showAs,
  noMinH,
  noMinW,
  slideChanged,
  containerProps = {},
  title,
  alt,
  children,
  customFallbackImageUrl,
  ...props
}: ImageProps) {
  const [imageSizeProps, setImageSizeProps] = useState({})
  const isLoadedInitially = useMemo(() => lazy === false || lazy === 'ssr', [lazy])
  const fallbackImageUrl = useAtomValue(imagePlaceholderUrlAtom)
  const [imageSrc, setImageSrc] = useState(src ?? fallbackImageUrl)

  useEffect(() => {
    if (src) {
      setImageSrc(src)
    }
  }, [src])

  useEffect(() => {
    if (Number.isInteger(slideChanged) && Boolean(slideChanged)) {
      const htmlHeight = null
      const htmlWidth = null
      setImageSizeProps({ htmlWidth, htmlHeight })
    }
  }, [slideChanged])

  const setImgSizes = useCallback((event) => {
    const target = event.target
    if (
      target &&
      (target.clientWidth || target.getBoundingClientRect()) &&
      target.naturalHeight &&
      target.naturalWidth
    ) {
      const ratio = +(target.naturalWidth / target.naturalHeight).toFixed(4)
      const htmlHeight = target.clientHeight
      const width = +(htmlHeight * ratio).toFixed(2)
      const htmlWidth = Number.isFinite(+width) ? +width : null
      setImageSizeProps({ htmlWidth, htmlHeight })
    }
  }, [])

  const handleImageLoad = useCallback(
    (e) => {
      onImageLoad?.()
      setImgSizes(e)
    },
    [onImageLoad]
  )

  const handleError = useCallback(() => {
    if (customFallbackImageUrl) {
      return setImageSrc(customFallbackImageUrl)
    }
    if (fallbackImageUrl) {
      setImageSrc(fallbackImageUrl)
    }
  }, [fallbackImageUrl, customFallbackImageUrl])

  const backgroundStyles = {
    paddingTop: `${aspectRatio * 100}%`,
    minHeight: props.minHeight,
  }

  return (
    <InView
      skip={isLoadedInitially}
      initialInView={isLoadedInitially}
      rootMargin={`0px 0px ${lazyOffset}px 0px`}
      triggerOnce
    >
      {({ inView, ref }) => (
        <Box
          as={showAs}
          ref={ref}
          className={className}
          minHeight={!noMinH && '1px'}
          minWidth={!noMinW && '1px'}
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            ...(pdp ? applyMinHeight(aspectImgRatio) : {}),
            ...props.sx,
          }}
          {...containerProps}
        >
          {children}
          {aspectRatio && <div className="aspect-ratio" tabIndex={-1} style={backgroundStyles} />}
          {(inView || isLoadedInitially) && (
            <ChakraUIImage
              sx={props.imgResponsive}
              src={imageSrc}
              title={title}
              onLoad={handleImageLoad}
              onError={handleError}
              alt={alt}
              {...props}
              {...imageSizeProps}
            />
          )}
        </Box>
      )}
    </InView>
  )
}

Image.propTypes = {
  /**
   * The URL for the image.
   */
  src: PropTypes.string,

  /**
   * Set to `true` to wait until the image enters the viewport before loading it. Set to `"ssr"` to
   * only lazy load images during server side rendering.
   */
  lazy: PropTypes.oneOf(['ssr', true, false]),

  /**
   * Sets the minimum amount of pixels the image can be scrolled out of view before it
   * is lazy loaded.  You must set `lazy` in order for this setting to take effect.
   */
  lazyOffset: PropTypes.number,
}

Image.defaultProps = {
  contain: 'none',
  fill: false,
  lazy: false,
  lazyOffset: 100,
}
