import QuickPinchZoom, { make2dTransformValue } from 'react-quick-pinch-zoom'
import { memo, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { Img } from '@chakra-ui/react'
import throttle from 'lodash/throttle'
import { ScaleToOptions, UpdateAction } from 'react-quick-pinch-zoom/esm/PinchZoom/types'
import {
  ANIM_DURATION_DESKTOP,
  getClickPosScaleOnElement,
  wheelInterceptHandler,
  ZOOM_STEP_DESKTOP,
} from 'toro/helpers/imageZoom'

type ImageZoomDesktopProps = {
  onImageLoad: () => void
  src: string
  alt: string
  dataQa: string
  variant?: string
}

const ImageZoomDesktop = ({ onImageLoad, src, alt, dataQa, variant }: ImageZoomDesktopProps) => {
  const { imageStylesDesktop, desktopContainerStyles }: any = useMultiStyleConfig(
    'ImageZoomTheme',
    { variant }
  )
  const [zoomClickCount, setZoomClickCount] = useState(0) // used for cursor type
  const qpzRef = useRef<QuickPinchZoom>()
  const imgRef = useRef<HTMLImageElement>()
  const zoomClickCountRef = useRef(0)

  // When the component is mounted it cannot correctly calculate the image offsets, because the
  // initial image is not loaded yet. To fix this we have to allow the qpz library to recalculate
  // offsets on 'resize' by setting 'setOffsetsOnce={false}'. However, we must disable the offsets
  // recalculation once the the initial image is loaded, because we don't want the high-res image
  // jumping around when it's loaded. We disable the offsets recalculation via
  // 'setOffsetsOnce={true}`.
  const [offsetsUpdateDisabled, setOffsetsUpdateDisabled] = useState(false)

  const setImageSizes = useCallback((event) => {
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
      target.height = htmlHeight
      target.width = htmlWidth
      target.htmlHeight = htmlHeight
      target.htmlWidth = htmlWidth
    }
  }, [])

  const handleImageLoad = useCallback(
    (e) => {
      onImageLoad?.()
      setImageSizes(e)
      setOffsetsUpdateDisabled(true)
      resetZoom(true)
    },
    [onImageLoad, setImageSizes]
  )

  const handleQpzUpdate = useCallback((nextTransfProps) => {
    const { current: img } = imgRef
    if (img) {
      if (nextTransfProps.scale < 1) {
        nextTransfProps.scale = 1
      }

      img.style.transform = make2dTransformValue(nextTransfProps)
    }
  }, [])

  const resetZoom = useCallback((noAnimation = false) => {
    const { current: img } = imgRef
    const { current: qpz } = qpzRef

    if (!img || !qpz) {
      return
    }

    const qpzOptions: ScaleToOptions = { x: 0, y: 0, scale: 1, duration: ANIM_DURATION_DESKTOP }
    if (noAnimation) {
      qpzOptions.animated = false
      qpzOptions.duration = 0
    }

    qpz.scaleTo(qpzOptions)
    zoomClickCountRef.current = 0
    setZoomClickCount(zoomClickCountRef.current)
  }, [])

  const zoomIn = useCallback((options: UpdateAction) => {
    const { current: qpz } = qpzRef
    if (!qpz) {
      return
    }

    if (options.x === undefined || options.y === undefined || options.scale === undefined) {
      return
    }

    qpz.scaleTo({
      ...options,
      duration: ANIM_DURATION_DESKTOP,
    })
  }, [])

  const handleImgClick = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      if (!e.target) {
        return
      }

      zoomClickCountRef.current =
        zoomClickCountRef.current === 2 ? 0 : zoomClickCountRef.current + 1

      if (zoomClickCountRef.current > 0) {
        const options = getClickPosScaleOnElement(e, zoomClickCountRef.current, ZOOM_STEP_DESKTOP)
        zoomIn(options)
      } else {
        resetZoom()
      }

      setZoomClickCount(zoomClickCountRef.current)
    },
    [zoomIn, resetZoom]
  )

  const throttledImgClick = useCallback(
    throttle((e: MouseEvent<HTMLImageElement>) => handleImgClick(e), ANIM_DURATION_DESKTOP, {
      leading: true,
      trailing: false,
    }),
    [handleImgClick]
  )

  const renderedImage = useMemo(
    () => (
      <Img
        src={src}
        alt={alt}
        cursor={zoomClickCount === 2 ? 'zoom-out' : 'zoom-in'}
        ref={imgRef}
        style={imageStylesDesktop}
        decoding="sync"
        onClick={throttledImgClick}
        onLoad={handleImageLoad}
        data-qa={dataQa}
      />
    ),
    [src, alt, zoomClickCount, imageStylesDesktop, throttledImgClick, handleImageLoad, dataQa]
  )

  useEffect(() => {
    const { current: qpz } = qpzRef
    if (!qpz) {
      return
    }

    // @ts-expect-error _detectDoubleTap() is private.
    qpz._detectDoubleTap = () => {}
  }, [])

  return (
    <QuickPinchZoom
      ref={qpzRef}
      draggableUnZoomed={false}
      inertia={false}
      minZoom={1}
      tapZoomFactor={0} // disable double tapping
      maxZoom={4}
      containerProps={{
        style: desktopContainerStyles,
      }}
      setOffsetsOnce={offsetsUpdateDisabled}
      shouldInterceptWheel={wheelInterceptHandler}
      onUpdate={handleQpzUpdate}
    >
      {renderedImage}
    </QuickPinchZoom>
  )
}

export default memo(ImageZoomDesktop)
