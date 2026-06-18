import QuickPinchZoom, { make2dTransformValue } from 'react-quick-pinch-zoom'
import {
  memo,
  MouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { Img } from '@chakra-ui/react'
import throttle from 'lodash/throttle'
import { ScaleToOptions, UpdateAction } from 'react-quick-pinch-zoom/esm/PinchZoom/types'
import { getProductImageSrc } from 'toro/helpers/productImages'
import {
  ANIM_DURATION_MOBILE,
  DEFAULT_MOBILE_IMAGE_HEIGHT,
  DEFAULT_MOBILE_IMAGE_WIDTH,
  getClickPosScaleOnElement,
  MAX_ZOOM,
  wheelInterceptHandler,
  ZOOM_SCALE,
  ZOOM_STEP_MOBILE,
} from 'toro/helpers/imageZoom'
import useHasMounted from 'toro/hooks/useHasMounted'
import { getFileBaseName } from 'toro/components/product/ProductMediaArea/helpers'
import AspectRatio from 'toro/components/AspectRatio'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import useImage1To1AspectRatio from 'toro/hooks/useImage1to1AspectRatio'
import getDynamicAssetSrc from 'toro/helpers/getDynamicAssetSrc'
import getPdpV7PngTemplateHeroSrc from 'toro/helpers/getPdpV7PngTemplateHeroSrc'
import usePreference from 'toro/hooks/usePreference_new'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import {
  IPHONE_PRO_SCREEN_WIDTH,
  V41_UPL_SLOT_MIN_HEIGHT,
  V41_UPL_SLOT_MIN_HEIGHT_LARGE_DEVICES,
} from 'toro/constants/adaptiveExperience'

type ImageZoomMobileProps = {
  setIsZoomed: (isZoomed: boolean) => void
  onSwatchInteraction: (
    imageSrc: string,
    event: string,
    idx: number,
    swatchOverlay?: boolean
  ) => void
  src: string
  alt: string
  slideChanged: number
  isLazy: boolean
  dataQa: string
  editorialCopy: string
  editorialPosition: string
  idx: number
  isDynamicAsset?: boolean
  isPdpV7PngHero?: boolean
  pdpV7RawScene7Src?: string
  isFullScreen?: boolean
  is2xZoom?: boolean
}

const v4EnhancedImageStyles = {
  height: `calc(125vw - ${V41_UPL_SLOT_MIN_HEIGHT}px)`,
  [`@media (min-width: ${IPHONE_PRO_SCREEN_WIDTH}px)`]: {
    height: `calc(125vw - ${V41_UPL_SLOT_MIN_HEIGHT_LARGE_DEVICES}px)`,
  },
}

const ImageZoomMobile = ({
  setIsZoomed,
  onSwatchInteraction,
  src,
  alt,
  slideChanged,
  dataQa,
  editorialCopy,
  editorialPosition,
  idx,
  isDynamicAsset,
  isPdpV7PngHero = false,
  pdpV7RawScene7Src,
  isFullScreen = false,
  is2xZoom = false,
}: ImageZoomMobileProps) => {
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const { imageStylesMobile, mobileContainerStyles, aspectRatioForPdpV6 }: any =
    useMultiStyleConfig('ImageZoomTheme')
  const [imageSrc, setImageSrc] = useState(src)
  const canLoadRef = useRef(idx === slideChanged)
  const [canLoad, setCanLoad] = useState(() => canLoadRef.current)
  const is1to1AspectRatioImage = useImage1To1AspectRatio(src)
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const isPdpV6Enabled = useExperiment(EXPERIMENTS.PDP_V6)
  const ratio = isPdpV6Enabled ? aspectRatioForPdpV6 : 0.8

  const {
    fullBleed: { dynamicAssetConfig },
  } = usePreference({
    'Full-Bleed': ['dynamicAssetConfig'],
  })

  const highResSrc = useMemo(() => {
    if (isPdpV7PngHero && pdpV7RawScene7Src) {
      const pdpV7Zoom = getPdpV7PngTemplateHeroSrc(pdpV7RawScene7Src, true, dynamicAssetConfig)
      if (pdpV7Zoom) return pdpV7Zoom
    }
    return isDynamicAsset
      ? getDynamicAssetSrc(src, true, dynamicAssetConfig)
      : getProductImageSrc(src, 'mobile', 'pdp', {
          isZoom: true,
          is1to1AspectRatioImage,
          isPdpV6: isPdpV6Enabled,
        } as any)
  }, [src, isDynamicAsset, isPdpV6Enabled, isPdpV7PngHero, pdpV7RawScene7Src])
  const qpzRef = useRef<QuickPinchZoom>()
  const imgContainerRef = useRef<HTMLDivElement>()
  const zoomClickCountRef = useRef(0)
  const isZoomedRef = useRef(false)
  const hasMounted = useHasMounted()

  const handleQpzUpdate = useCallback(
    ({ scale, x, y }: UpdateAction) => {
      const { current: el } = imgContainerRef

      // We only scale the image if the component was mounted, otherwise the image will shift
      // upwards slightly on hydration.
      if (el && hasMounted) {
        const clampedTransformProps = {
          scale: scale < 1 ? 1 : scale,
          x: scale < 1 ? 0 : x,
          y: scale < 1 ? 0 : y,
        }
        el.style.transform = make2dTransformValue(clampedTransformProps)
        isZoomedRef.current = Math.round(clampedTransformProps.scale * 100) / 100 > 1
        setIsZoomed(isZoomedRef.current)
      }
    },
    [hasMounted]
  )

  const resetZoom = useCallback((noAnimation = false) => {
    const { current: el } = imgContainerRef
    const { current: qpz } = qpzRef

    if (!el || !qpz) {
      return
    }

    const qpzOptions: ScaleToOptions = { x: 0, y: 0, scale: 1, duration: ANIM_DURATION_MOBILE }
    if (noAnimation) {
      qpzOptions.animated = false
      qpzOptions.duration = 0
    }

    qpz.scaleTo(qpzOptions)
    isZoomedRef.current = false
    zoomClickCountRef.current = 0
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
      duration: ANIM_DURATION_MOBILE,
    })
  }, [])

  // On mobile the 'click' event fires when the element is pressed and released.
  // Since we use the 'click' event to also zoom in we will set the high-res image in here.
  const handleImgClick = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      if (!e.target) {
        return
      }

      if (!isZoomedRef.current) {
        // Check for editorial image
        if (editorialCopy && editorialPosition) {
          onSwatchInteraction?.(getFileBaseName(imageSrc), 'click', slideChanged, true)
        } else {
          onSwatchInteraction?.(getFileBaseName(imageSrc), 'zoom click', slideChanged)
        }
      }

      if (isZoomedRef.current) {
        resetZoom()
        return
      }

      // It's important that we continue scaling the image even after we switch to the high-res one,
      // because we want to avoid the high-res image shift when it loads in.
      if (imageSrc !== highResSrc) {
        setImageSrc(highResSrc)
      }

      zoomClickCountRef.current =
        zoomClickCountRef.current === ZOOM_SCALE.ONE ? ZOOM_SCALE.ZERO : ZOOM_SCALE.ONE

      if (zoomClickCountRef.current > ZOOM_SCALE.ZERO) {
        const options = getClickPosScaleOnElement(e, zoomClickCountRef.current, ZOOM_STEP_MOBILE)
        zoomIn(options)
      } else {
        resetZoom()
      }
    },
    [imageSrc, zoomIn, resetZoom, slideChanged]
  )

  const handle2xZoomImgClick = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      if (!e.target) {
        return
      }

      // Tap zoom advances zoomClickCountRef before zoomIn; pinch never touches it, so count stays 0.
      if (isZoomedRef.current && zoomClickCountRef.current === ZOOM_SCALE.ZERO) {
        resetZoom()
        return
      }

      zoomClickCountRef.current =
        zoomClickCountRef.current === ZOOM_SCALE.TWO
          ? ZOOM_SCALE.ZERO
          : zoomClickCountRef.current + 1

      if (zoomClickCountRef.current > ZOOM_SCALE.ZERO) {
        const options = getClickPosScaleOnElement(e, zoomClickCountRef.current, ZOOM_SCALE.TWO)
        zoomIn(options)
      } else {
        resetZoom()
      }
    },
    [zoomIn, resetZoom]
  )

  const throttledImgClick = useCallback(
    throttle((e: MouseEvent<HTMLImageElement>) => handleImgClick(e), ANIM_DURATION_MOBILE, {
      leading: true,
      trailing: false,
    }),
    [handleImgClick]
  )

  const throttled2xImgClick = useCallback(
    throttle((e: MouseEvent<HTMLImageElement>) => handle2xZoomImgClick(e), ANIM_DURATION_MOBILE, {
      leading: true,
      trailing: false,
    }),
    [handle2xZoomImgClick]
  )

  // The user can zoom in or out on the image by using two fingers, therefore we need to set the
  // high-res image in here too, since this handler will fire earlier than the 'click' handler.
  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLImageElement>) => {
      if (e?.touches.length > 1 && imageSrc !== highResSrc && !is2xZoom) {
        setImageSrc(highResSrc)
      }
    },
    [imageSrc]
  )

  const renderedImage = useMemo(
    () => (
      <Img
        src={canLoad ? imageSrc : null}
        alt={alt}
        width={DEFAULT_MOBILE_IMAGE_WIDTH}
        height={DEFAULT_MOBILE_IMAGE_HEIGHT}
        htmlWidth={DEFAULT_MOBILE_IMAGE_WIDTH}
        htmlHeight={DEFAULT_MOBILE_IMAGE_HEIGHT}
        sx={imageStylesMobile}
        decoding="sync"
        onClick={is2xZoom ? throttled2xImgClick : throttledImgClick}
        onTouchStart={handleTouchStart}
        data-qa={dataQa}
        fetchpriority={idx === 0 ? 'high' : 'low'}
      />
    ),
    [
      canLoad,
      imageSrc,
      alt,
      imageStylesMobile,
      throttledImgClick,
      is2xZoom,
      handleTouchStart,
      dataQa,
      idx,
    ]
  )

  useEffect(() => {
    const { current: qpz } = qpzRef
    if (!qpz) {
      return
    }

    // @ts-expect-error _detectDoubleTap() is private.
    qpz._detectDoubleTap = () => {}
  }, [])

  useEffect(() => {
    resetZoom(true)

    if (!canLoadRef.current) {
      canLoadRef.current = idx === slideChanged

      if (canLoadRef.current) {
        setCanLoad(true)
      }
    }
  }, [slideChanged])

  return (
    <QuickPinchZoom
      ref={qpzRef}
      draggableUnZoomed={false}
      inertia={false}
      minZoom={1}
      tapZoomFactor={0} // disable double tapping
      maxZoom={is2xZoom ? MAX_ZOOM['2xZoom'] : MAX_ZOOM['1xZoom']}
      containerProps={{
        style: mobileContainerStyles,
      }}
      setOffsetsOnce={true} // we set the offsets only once to avoid the image jumping around when we switch to the high-res version
      shouldInterceptWheel={wheelInterceptHandler}
      onUpdate={handleQpzUpdate}
    >
      <AspectRatio
        ref={imgContainerRef}
        ratio={ratio}
        maxWidth="100%"
        {...(isFullScreen && { height: '100%' })}
        sx={{
          '& .splide__spinner': { display: 'none' },
          '&>img': {
            objectFit: is1to1AspectRatioImage || ratio === 1 || is2xZoom ? 'contain' : 'cover',
          },
          ...(isTabbedAdaptivePDPEligible && (isPdpV41Enabled || isPdpV42Enabled) && !isPdpV6Enabled
            ? v4EnhancedImageStyles
            : {}),
        }}
      >
        {renderedImage}
      </AspectRatio>
    </QuickPinchZoom>
  )
}

export default memo(ImageZoomMobile)
