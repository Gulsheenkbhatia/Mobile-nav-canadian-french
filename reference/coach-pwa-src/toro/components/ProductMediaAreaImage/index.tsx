import { memo, useEffect, useMemo, useRef, useState } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import { DEFAULT_MOBILE_IMAGE_HEIGHT, DEFAULT_MOBILE_IMAGE_WIDTH } from 'toro/helpers/imageZoom'
import AspectRatio from 'toro/components/AspectRatio'
import useImage1To1AspectRatio from 'toro/hooks/useImage1to1AspectRatio'
import Img from 'toro/components/Img'

type ProductMediaAreaImageProps = {
  src: string
  alt: string
  slideChanged: number
  isLazy: boolean
  dataQa: string
  idx: number
  zoomLocked?: boolean
}

const ProductMediaAreaImage = ({
  src,
  alt,
  slideChanged,
  dataQa,
  idx,
  zoomLocked = false,
  ...props
}: ProductMediaAreaImageProps) => {
  const { imageStylesMobile, mobileContainerStyles, aspectRatioForPdpV6 } =
    useMultiStyleConfig('ImageZoomTheme')
  const canLoadRef = useRef(idx === slideChanged)
  const [canLoad, setCanLoad] = useState(() => canLoadRef.current)
  const is1to1AspectRatioImage = useImage1To1AspectRatio(src)
  const ratio = aspectRatioForPdpV6

  const imgContainerRef = useRef<HTMLDivElement>()

  const renderedImage = useMemo(
    () => (
      <Img
        src={canLoad ? src : null}
        alt={alt}
        width={DEFAULT_MOBILE_IMAGE_WIDTH}
        height={DEFAULT_MOBILE_IMAGE_HEIGHT}
        htmlWidth={DEFAULT_MOBILE_IMAGE_WIDTH}
        htmlHeight={DEFAULT_MOBILE_IMAGE_HEIGHT}
        sx={imageStylesMobile}
        decoding="sync"
        data-qa={dataQa}
        fetchpriority={idx === 0 ? 'high' : 'low'}
      />
    ),
    [canLoad, src, alt, imageStylesMobile, dataQa, idx]
  )

  useEffect(() => {
    if (!canLoadRef.current) {
      canLoadRef.current = idx === slideChanged

      if (canLoadRef.current) {
        setCanLoad(true)
      }
    }
  }, [slideChanged])

  return (
    <Box style={mobileContainerStyles} {...props}>
      <AspectRatio
        ref={imgContainerRef}
        ratio={ratio}
        maxWidth="100%"
        sx={{
          '&>img': { objectFit: is1to1AspectRatioImage || ratio === 1 ? 'contain' : 'cover' },
        }}
      >
        {renderedImage}
      </AspectRatio>
    </Box>
  )
}

export default memo(ProductMediaAreaImage)
