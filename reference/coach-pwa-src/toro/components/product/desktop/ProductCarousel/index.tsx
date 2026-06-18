import { Fragment, memo, useEffect, useMemo, useRef, useState, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import ProductMedia from 'toro/components/product/ProductMediaArea/ProductMedia'
import get from 'lodash/get'
import CarouselVideo from 'toro/components/product/desktop/CarouselVideo'
import SplideSlider from 'toro/components/SplideSlider'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { getProductImageSrc } from 'toro/helpers/productImages'
import NumericSliderPagination from 'toro/components/product/NumericSliderPagination'
import SwipeWrapper from 'toro/components/SwipeWrapper'

import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

import { useAtomValue } from 'jotai/utils'
import { brandAtom } from 'store/global.atom'
import { getHeroSwatchInteractionEvent } from 'toro/helpers/pdpGaEvents'

import ProductTangibleeControl, {
  TangibleeControlType,
} from 'toro/components/product/desktop/ProductTangibleeControl'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import AccessorizeItButton from 'toro/components/product/AccessorizeIt/AccessorizeItButton'
import { useAccessorizeItCtaTarget } from 'toro/components/product/AccessorizeIt/hooks'
import useSimilarOptionsOnPDP from 'toro/hooks/useSimilarOptionsOnPDP'
import dynamic from 'next/dynamic'

const LastSlideWithSimilarOptions = dynamic(
  () => import('toro/components/LastSlideWithSimilarOptions'),
  {
    ssr: false,
  }
)

const options = {
  start: 0,
  arrows: false,
  width: '100vw',
  fixedHeight: 'calc(100vh - 320px)',
  autoWidth: true,
  type: 'loop',
  gap: '50px',
  focus: 'center' as 'center',
  pagination: false,
  hideCustomPagination: false,
}

const twoSlidesOptions = {
  type: 'slide',
  drag: false,
}

const zoomOptions = {
  type: 'slide',
  perPage: 1,
  perMove: 1,
  arrows: true,
  width: '100vw',
  height: 'calc(100vh - 100px)',
  pagination: false,
  drag: false,
  focus: 'center' as 'center',
}

const getFullMedias = (rawFullMedias = []) => {
  const medias = rawFullMedias.map((media) => ({
    ...media,
    poster:
      media.type === 'video'
        ? getProductImageSrc(get(media, 'poster.src'), 'desktop', 'pdp', {
            isPdpV5: true,
          })
        : undefined,
  }))
  return medias
}

/**
 * PDP media carousel for desktop devices with swipable items
 */
function ProductCarousel({
  openZoomModal,
  isZoom,
  zoomedIdx = 0,
  customOptions,
  customSlidesOptions,
  customZoomOptions,
  modifiedThumbnailsArrows,
}: {
  openZoomModal?: (idx: number) => void
  isZoom?: boolean
  zoomedIdx?: number
  customOptions?: Record<string, any>
  customSlidesOptions?: Record<string, any>
  customZoomOptions?: Record<string, any>
  modifiedThumbnailsArrows?: {
    nextCustomArrow?: ReactNode
    prevCustomArrow?: ReactNode
  }
}) {
  const isPdpRedesignV5_1Enabled = useTemplate([TemplateName.pdpv5_1])
  const [activeIdx, setActiveIdx] = useState(zoomedIdx)
  const [hasClickedPlay, setHasClickedPlay] = useState(false)
  const [lastSlideInjectContainers, setLastSlideInjectContainers] = useState<Element[]>([])
  const [media, selectedColorId] = useSelectedColorData(['media', 'id'])
  const selectedVariantId = useSelectedVariantData('id')
  const rawFullMedias = get(media, 'full', [])
  const sliderRef = useRef<any>()
  const brand = useAtomValue(brandAtom)
  const styles = useMultiStyleConfig('ProductCarousel')
  const wasDragged = useRef(false)
  const headerHeight = useHeaderHeight()
  const isAccessorizeItEnabled = useExperiment(EXPERIMENTS.ACCESSORIZE_IT_DESKTOP)

  const { isSimilarOptionOnPDPEnabled, extendMediaForSimilarOption } = useSimilarOptionsOnPDP()

  const fullMedias = useMemo(() => {
    const productMedias = getFullMedias(rawFullMedias)
    if (productMedias.length === 0) {
      return []
    }

    if (isSimilarOptionOnPDPEnabled && !isZoom) {
      return extendMediaForSimilarOption(productMedias)
    }

    return productMedias
  }, [rawFullMedias, extendMediaForSimilarOption])

  const accessorizeItTargetIdx = useAccessorizeItCtaTarget(fullMedias)
  const analytics = useAnalytics()

  const onDragged = useCallback(() => {
    wasDragged.current = true
  }, [])

  const onIndexChange = useCallback(
    (idx) => {
      setActiveIdx(idx)
      const interactionName = wasDragged.current ? 'swipe' : 'scroll view'
      const eventsPayload = getHeroSwatchInteractionEvent({
        eventAction: `P${idx + 1}:product image ${interactionName}`,
        selectedVariantId,
        mediaSrc: fullMedias[idx]?.src,
      })
      analytics.send(...eventsPayload)
      wasDragged.current = false
    },
    [fullMedias, selectedVariantId, isZoom, activeIdx]
  )

  const onZoom = useCallback(
    (idx) => {
      openZoomModal?.(idx)
      const eventsPayload = getHeroSwatchInteractionEvent({
        eventAction: `P${idx + 1}:product image zoom`,
        selectedVariantId,
        mediaSrc: fullMedias[idx]?.src,
      })
      analytics.send(...eventsPayload)
    },
    [fullMedias, selectedVariantId]
  )

  useEffect(() => {
    //restore slider if user clicked on another color variant
    if (sliderRef.current && activeIdx !== 0) {
      sliderRef.current?.splide?.Components?.Controller?.go(zoomedIdx)
    }
  }, [selectedColorId])

  // Inject LastSlideSimilarOptionsContent into last slide and its clone(s) via sliderRef.
  // Splide creates clones for loop type; run after mount so placeholder nodes exist.
  // sliderRef.current is the Splide instance; .root is the DOM element for querySelectorAll.
  useEffect(() => {
    if (!isSimilarOptionOnPDPEnabled || isZoom) {
      setLastSlideInjectContainers([])
      return
    }
    const splide = sliderRef.current?.splide
    const root = splide?.root
    if (!root || typeof root.querySelectorAll !== 'function') return
    const containers = root.querySelectorAll('[data-last-slide-similar-options]')
    setLastSlideInjectContainers(Array.from(containers))
  }, [isSimilarOptionOnPDPEnabled, isZoom, fullMedias.length, selectedColorId])

  const onSwipeLeft = () => {
    sliderRef?.current?.splide?.Components?.Controller?.go('+1')
  }

  const onSwipeRight = () => {
    sliderRef?.current?.splide?.Components?.Controller?.go('-1')
  }

  const mediaGallery = useMemo(() => {
    return fullMedias?.length === 0
      ? [
          <ProductMedia
            isActive
            alt={`${brand} Brand Image`}
            idx={0}
            key="fallback"
            canZoom={false}
            hasZoomedImage={false}
          />,
        ]
      : fullMedias?.map?.((fullMedia, idx) => (
          <Box
            key={`${fullMedia?.src}+${idx}+${selectedColorId}`}
            sx={
              isZoom && fullMedia?.type !== 'video'
                ? styles.productMediaItemZoom
                : styles.productMediaItem
            }
            mx={isZoom ? 'auto' : undefined}
          >
            {fullMedia?.type === 'video' ? (
              <CarouselVideo
                objectFit={'contain'}
                videoSrc={fullMedia?.src}
                poster={fullMedia?.poster}
                isActive={activeIdx === idx}
                idx={idx}
                isPlay
                muted
                isGallery={true}
                hasClickedPlay={hasClickedPlay}
              />
            ) : (
              <Fragment>
                <ProductMedia
                  src={fullMedia?.src}
                  type={fullMedia?.type}
                  alt={fullMedia?.alt}
                  idx={idx}
                  slideChanged={activeIdx}
                  lazy={idx > 0}
                  loading={idx ? 'lazy' : 'eager'}
                  canZoom={isZoom}
                  hasZoomedImage={isZoom}
                  onClick={() => onZoom(idx)}
                />
              </Fragment>
            )}
            {!isZoom && (
              <ProductTangibleeControl
                type={TangibleeControlType.media}
                imageUrl={get(fullMedia, 'src', '').replace(/\?\$.+$/, '')}
              />
            )}
            {isAccessorizeItEnabled && !isZoom && idx === accessorizeItTargetIdx && (
              <AccessorizeItButton />
            )}
            {isSimilarOptionOnPDPEnabled && !isZoom && fullMedias.length - 1 === idx && (
              <div data-last-slide-similar-options />
            )}
          </Box>
        ))
  }, [
    fullMedias,
    get(media, 'full.0.src'),
    brand,
    selectedColorId,
    isZoom,
    isSimilarOptionOnPDPEnabled,
    isAccessorizeItEnabled,
    accessorizeItTargetIdx,
    isPdpRedesignV5_1Enabled,
    activeIdx,
  ])

  const lengthOfSlides = mediaGallery?.length

  const memoizedOptions = useMemo(
    () =>
      isZoom
        ? {
            ...zoomOptions,
            ...(isPdpRedesignV5_1Enabled && { height: '100vh' }),
            ...customZoomOptions,
            start: zoomedIdx,
          }
        : {
            ...options,
            ...customOptions,
            arrows: isPdpRedesignV5_1Enabled,
            start: zoomedIdx,
            width: lengthOfSlides === 2 ? 'fit-content' : '100vw',
            ...(lengthOfSlides < 3
              ? { ...twoSlidesOptions, ...customSlidesOptions, perPage: lengthOfSlides }
              : {}),
          },
    [
      isZoom,
      customZoomOptions,
      customOptions,
      customSlidesOptions,
      zoomedIdx,
      lengthOfSlides,
      isPdpRedesignV5_1Enabled,
    ]
  )

  const onClickHandler = (splide, slide, e) => {
    if (e.target instanceof HTMLDivElement && e.target.dataset.action === 'playVideo') {
      setHasClickedPlay(true)
      splide.Components.Controller.go?.(slide.index)
    }
    if (slide?.isClone) {
      const dataActionValue = e?.target?.closest('[data-action]')?.dataset?.action
      if (dataActionValue && dataActionValue !== 'playVideo') {
        const targetInOriginalSlide = splide?.root?.querySelector(
          `li[data-slide-index="${slide?.slideIndex}"]:not(.splide__slide--clone) [data-action="${dataActionValue}"]`
        )
        targetInOriginalSlide?.click()
      }
    }
  }

  return (
    <>
      <SwipeWrapper onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <Box
          className={!isZoom && lengthOfSlides === 2 ? 'two-slides' : ''}
          sx={isZoom ? styles.productCarouselWrapperZoom : styles.productCarouselWrapper}
          style={{ top: isPdpRedesignV5_1Enabled ? headerHeight : null }}
        >
          <SplideSlider
            options={memoizedOptions}
            innerRef={sliderRef}
            initialIndex={zoomedIdx}
            onIndexChange={onIndexChange}
            onClick={onClickHandler}
            styles={styles}
            key={`${selectedColorId}_product_carousel${isZoom ? '_zoomed' : ''}`}
            onDragged={onDragged}
            arrowProps={{
              next: {
                'data-qa': isZoom ? 'hdr_btn_Zoom_Slide_Arrow_Next' : 'right_arrow_heroGallery',
              },
              prev: {
                'data-qa': isZoom ? 'hdr_btn_Zoom_Slide_Arrow_Prev' : 'left_arrow_heroGallery',
              },
            }}
            modifiedThumbnailsArrows={modifiedThumbnailsArrows}
          >
            {mediaGallery}
          </SplideSlider>

          {!isPdpRedesignV5_1Enabled &&
            !isZoom &&
            !customOptions?.hideCustomPagination &&
            mediaGallery?.length > 2 && (
              <NumericSliderPagination
                activeSlideIdx={activeIdx}
                lengthOfSlides={mediaGallery.length}
                goToSlide={get(sliderRef, 'current.go')?.bind(sliderRef.current)}
                setActiveIdx={setActiveIdx}
              />
            )}
        </Box>
      </SwipeWrapper>
      {lastSlideInjectContainers.map((container) =>
        createPortal(
          <Flex sx={styles.lastSlideWithSimilarOptions}>
            <LastSlideWithSimilarOptions
              selectedVariantId={selectedVariantId}
              variant={isPdpRedesignV5_1Enabled ? 'similarOptionPDPv5_1' : null}
            />
          </Flex>,
          container
        )
      )}
    </>
  )
}

export default memo(withErrorBoundaryWrapper(ProductCarousel))
