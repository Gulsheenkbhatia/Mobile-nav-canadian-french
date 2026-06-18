import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Splide } from '@splidejs/react-splide'
import { useAtom } from 'jotai'
import { productCarouselActiveIndexAtom, productCarouselGoToSlideRequestAtom } from 'store/pdp.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getHeroSwatchInteractionEvent } from 'toro/helpers/pdpGaEvents'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useProductData from 'toro/hooks/useProductData'
import Box from 'toro/components/Box'
import ProductMedia from 'toro/components/product/ProductMediaArea/ProductMedia'
import CarouselVideo from 'toro/components/product/CarouselVideo'
import SplideSlider from 'toro/components/SplideSlider'
import useFullProductMedia from 'toro/components/product/mobile/v7/hooks/useFullProductMedia'
import {
  getHeroGalleryMediaIndices,
  useHeroGalleryEntries,
} from 'toro/components/product/mobile/v7/helpers/heroGallery'
import { useDiscoverHeroGallerySwipe } from 'toro/components/product/mobile/v7/hooks/useDiscoverHeroGallerySwipe'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Arrow from 'toro/icons/arrow.svg'
import Button from 'toro/components/Button'

function trySplideGo(sliderRef: RefObject<Splide | null>, slideIndex: number): boolean {
  const root = sliderRef.current as
    | { go?: (n: number) => void; splide?: { go: (n: number) => void } }
    | null
    | undefined
  if (!root) return false
  const api = root.splide ?? root
  if (typeof api.go !== 'function') return false
  api.go(slideIndex)
  return true
}

const ProductGalleryV7 = ({
  isDiscoverMode,
  enableTapToDiscover,
  immersiveMediaLayout = false,
}: {
  isDiscoverMode: boolean
  enableTapToDiscover: boolean
  immersiveMediaLayout?: boolean
}) => {
  const fullMedias = useFullProductMedia()
  const heroGalleryEntries = useHeroGalleryEntries()
  const [activeIdx, setActiveIdx] = useAtom(productCarouselActiveIndexAtom)
  const [goSlideRequest, setGoSlideRequest] = useAtom(productCarouselGoToSlideRequestAtom)
  const [isZoomed, setIsZoomed] = useState(false)
  const sliderRef = useRef<Splide | null>(null)
  const wasDragged = useRef(false)
  const discoverSwipeRootRef = useRef<HTMLDivElement | null>(null)
  const analytics = useAnalytics()
  const variantId = useSelectedVariantData('id')
  const productId = useProductData('id')
  const selectedColorId = useSelectedColorData('id')

  const styles = useMultiStyleConfig('ProductGalleryV7')

  const galleryOuterSx = useMemo(
    () => ({
      ...styles.galleryOuter,
      ...(immersiveMediaLayout ? styles.galleryOuterImmersive : {}),
      ...(isDiscoverMode ? styles.galleryOuterDiscover : {}),
    }),
    [styles, immersiveMediaLayout, isDiscoverMode]
  )

  const galleryInnerSx = useMemo(
    () => ({
      ...styles.galleryInner,
      ...(immersiveMediaLayout ? styles.galleryInnerImmersive : {}),
      ...(isDiscoverMode ? styles.galleryInnerDiscoverNarrow : {}),
    }),
    [styles, immersiveMediaLayout, isDiscoverMode]
  )

  const isStaticHero = enableTapToDiscover && !isDiscoverMode

  const clampedActiveIdx =
    fullMedias.length === 0 ? 0 : Math.min(Math.max(0, activeIdx), fullMedias.length - 1)

  const heroTabMediaIndices = useMemo(
    () => getHeroGalleryMediaIndices(fullMedias, heroGalleryEntries),
    [fullMedias, heroGalleryEntries]
  )

  const tabIndicesForDiscoverSwipe = useMemo(() => {
    if (heroTabMediaIndices.length > 0) return heroTabMediaIndices
    return fullMedias.map((_, i) => i)
  }, [heroTabMediaIndices, fullMedias])

  useEffect(() => {
    if (isDiscoverMode) return
    setActiveIdx(0)
    const id = requestAnimationFrame(() => {
      trySplideGo(sliderRef, 0)
    })
    return () => cancelAnimationFrame(id)
  }, [productId, selectedColorId, setActiveIdx, isDiscoverMode])

  const renderMedia = useCallback(
    (item, idx) => {
      if (item.type === 'video') {
        return (
          <CarouselVideo
            key={`${item.src}-${idx}`}
            objectFit={immersiveMediaLayout ? 'cover' : 'contain'}
            videoSrc={item.src}
            poster={item.poster}
            isActive={isStaticHero || activeIdx === idx}
            idx={idx}
            isPlay
            muted
            isGallery
            fullHeight={immersiveMediaLayout}
            variant="pdpv7"
          />
        )
      }

      return (
        <ProductMedia
          key={`${item.src}-${idx}`}
          src={item.src}
          type={item.type}
          alt={item.alt}
          idx={idx}
          slideChanged={isStaticHero ? 0 : isDiscoverMode ? idx : activeIdx}
          canZoom={!isStaticHero && !isDiscoverMode}
          zoomDisabled={isDiscoverMode}
          hasZoomedImage={isZoomed}
          setIsZoomed={setIsZoomed}
          isPdpV7PngHero={Boolean(item.isPdpV7PngHero)}
        />
      )
    },
    [activeIdx, isZoomed, isDiscoverMode, isStaticHero, immersiveMediaLayout]
  )

  const sliderOptions = useMemo(
    () => ({
      type: 'loop',
      perPage: 1,
      arrows: fullMedias.length > 1,
      pagination: false,
      width: '100%',
      autoHeight: true,
      drag: fullMedias.length > 1 && !isDiscoverMode && !isZoomed,
    }),
    [fullMedias.length, isDiscoverMode, isZoomed]
  )

  useEffect(() => {
    if (isStaticHero && goSlideRequest !== null) {
      setGoSlideRequest(null)
    }
  }, [isStaticHero, goSlideRequest, setGoSlideRequest])

  useEffect(() => {
    if (goSlideRequest === null) return
    if (isStaticHero) return

    const targetSlide = goSlideRequest
    const clearGoToSlideRequest = () => setGoSlideRequest(null)

    if (isDiscoverMode) {
      setActiveIdx(targetSlide)
      clearGoToSlideRequest()
      return
    }

    const didGoToSlide = trySplideGo(sliderRef, targetSlide)
    if (didGoToSlide) {
      clearGoToSlideRequest()
      return
    }

    const timeoutId = window.setTimeout(() => {
      trySplideGo(sliderRef, targetSlide)
      clearGoToSlideRequest()
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [goSlideRequest, isStaticHero, isDiscoverMode, setGoSlideRequest, setActiveIdx])

  const sendHeroImageNavigation = useCallback(
    (targetIdx: number, interactionName: 'swipe' | 'scroll view') => {
      const item = fullMedias[targetIdx]
      if (!item?.src || !variantId) return

      analytics.send(
        ...getHeroSwatchInteractionEvent({
          eventAction: `P${targetIdx + 1}:product image ${interactionName}`,
          selectedVariantId: variantId,
          mediaSrc: item.src,
        })
      )
    },
    [analytics, fullMedias, variantId]
  )

  const onDragged = useCallback(() => {
    wasDragged.current = true
  }, [])

  const onSplideIndexChange = useCallback(
    (idx: number) => {
      setActiveIdx(idx)
      const interactionName = wasDragged.current ? 'swipe' : 'scroll view'
      sendHeroImageNavigation(idx, interactionName)
      wasDragged.current = false
    },
    [setActiveIdx, sendHeroImageNavigation]
  )

  const navigateDiscoverBySwipe = useCallback(
    (targetIdx: number) => {
      sendHeroImageNavigation(targetIdx, 'swipe')
      setActiveIdx(targetIdx)
    },
    [sendHeroImageNavigation, setActiveIdx]
  )

  useDiscoverHeroGallerySwipe({
    enabled: isDiscoverMode,
    tabMediaIndices: tabIndicesForDiscoverSwipe,
    activeIndex: activeIdx,
    rootRef: discoverSwipeRootRef,
    onNavigateToIndex: navigateDiscoverBySwipe,
  })

  const discoverActiveMedia = fullMedias.length > 0 ? fullMedias[clampedActiveIdx] : undefined

  if (isStaticHero) {
    const firstItem = fullMedias?.[0]
    if (!firstItem) return null

    return (
      <Box sx={galleryOuterSx}>
        <Box sx={galleryInnerSx}>{renderMedia(firstItem, 0)}</Box>
      </Box>
    )
  }

  if (isDiscoverMode) {
    if (!discoverActiveMedia) return null

    return (
      <Box ref={discoverSwipeRootRef} sx={galleryOuterSx}>
        <Box sx={galleryInnerSx} key={clampedActiveIdx}>
          {renderMedia(discoverActiveMedia, clampedActiveIdx)}
        </Box>
      </Box>
    )
  }

  if (fullMedias.length <= 1) {
    const only = fullMedias[0]
    if (!only) return null
    return (
      <Box sx={galleryOuterSx}>
        <Box sx={galleryInnerSx}>{renderMedia(only, 0)}</Box>
      </Box>
    )
  }

  return (
    <Box sx={galleryOuterSx}>
      <Box sx={galleryInnerSx}>
        <SplideSlider
          innerRef={sliderRef}
          options={sliderOptions}
          onDragged={onDragged}
          onIndexChange={onSplideIndexChange}
          styles={{}}
          modifiedThumbnailsArrows={{
            nextCustomArrow: (
              <Button
                className="splide__arrow splide__arrow--next"
                variant="icon-only"
                onClickCapture={() => {
                  wasDragged.current = false
                }}
              >
                <Arrow />
              </Button>
            ),
            prevCustomArrow: (
              <Button
                className="splide__arrow splide__arrow--prev"
                variant="icon-only"
                onClickCapture={() => {
                  wasDragged.current = false
                }}
              >
                <Arrow />
              </Button>
            ),
          }}
        >
          {fullMedias.map(renderMedia)}
        </SplideSlider>
      </Box>
    </Box>
  )
}

export default ProductGalleryV7
