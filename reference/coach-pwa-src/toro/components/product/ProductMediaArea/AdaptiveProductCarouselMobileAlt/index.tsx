import { Fragment, memo, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Box from 'toro/components/Box'
import ProductMedia from 'toro/components/product/ProductMediaArea/ProductMedia'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import CarouselVideo from 'toro/components/product/CarouselVideo'
import SplideSlider from 'toro/components/SplideSlider'
import {
  getFileBaseName,
  isSpecificAssetTypeSrc,
} from 'toro/components/product/ProductMediaArea/helpers'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useAtomValue } from 'jotai/utils'
import { getProductImageSrc } from 'toro/helpers/productImages'
import { pdpReviewsAtom, isFirstViewedAtom } from 'store/pdp.atom'
import { EXPERIMENTS } from 'toro/constants/experiments'
import dynamic from 'next/dynamic'
import Experiment from 'toro/components/Experiment'
import useReviewOverlayImageSrc from 'toro/hooks/useReviewOverlayImageSrc'
import ReviewOverlayOnImage from 'toro/components/ReviewOverlayOnImage'
import { firstPDPViewAtom } from 'store/plp.atom'
import { useAtomSetter } from 'toro/helpers/jotai/useAtomSetter'
import usePreference from 'toro/hooks/usePreference_new'
import ProductMediaTangibleeControls from 'toro/components/product/ProductMediaArea/ProductMediaTangibleeControls'
import AccessorizeItButton from 'toro/components/product/AccessorizeIt/AccessorizeItButton'
import { useAccessorizeItCtaTarget } from 'toro/components/product/AccessorizeIt/hooks'
import { Splide, Options } from '@splidejs/react-splide'
import {
  AdaptiveProductCarouselMobileAltProps,
  MediaImage,
} from 'toro/components/product/ProductMediaArea/AdaptiveProductCarouselMobileAlt/types'
import SeeMorePhotos from 'toro/components/product/ProductMediaArea/AdaptiveProductCarouselMobileAlt/SeeMorePhotos/index'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import useAnalytics from 'toro/analytics/useAnalytics'
import NumericSliderPagination from 'toro/components/product/NumericSliderPagination'
import CustomSliderPagination from 'toro/components/product/CustomSliderPagination'
import useExperiment from 'toro/hooks/useExperiment'

const sliderOptions: Options = {
  perPage: 1,
  perMove: 1,
  start: 0,
  arrows: false,
  rewind: true,
  rewindByDrag: true,
  width: '100vw',
  heightRatio: 1.25,
  height: '125vw',
}

const LastSlideWithSimilarOptions = dynamic(
  () => import('toro/components/LastSlideWithSimilarOptions'),
  {
    ssr: false,
  }
)

function AdaptiveProductCarouselMobileAlt({
  media: mediaFromProps,
  canZoom,
  hasZoomedImage,
  onMediaClick = () => {},
  initialIdx = 0,
  selectedVariant,
  onSwatchInteraction = () => {},
  brand,
  selectedColor,
  imageEditorialCopy,
  tangiblee,
  isSimilarOptionOnPDP,
  reviewsData,
  setCarouselIndex,
  isScrolled,
  productId,
  isEnabledColorAdaptive,
  dynamicAssetImage,
  reviewsAvgRating,
  isTabbedAdaptivePDP = false,
}: AdaptiveProductCarouselMobileAltProps) {
  const analytics = useAnalytics()
  const isFirstPDPView = useAtomValue(isFirstViewedAtom)
  const [activeIdx, setActiveIdx] = useState(initialIdx)
  const [media, setMedia] = useState(mediaFromProps || {})
  const [isReviewClosed, setIsReviewClosed] = useState(false)
  const videoIdx = useRef([])
  const sliderRef = useRef<Splide>()
  const firstUpdateRef = useRef(true)
  const [isZoomed, setIsZoomed] = useState(false)
  const transformRef = useRef('translateX(0px)')
  const setFirstPDPViewedTime = useAtomSetter(firstPDPViewAtom)
  const firstPDPViewedTime = useAtomValue(firstPDPViewAtom)
  const pdpReviews = useAtomValue(pdpReviewsAtom)
  const [shouldShowAllImages, setShouldShowAllImages] = useState(false)
  const isSimilarOption = isSimilarOptionOnPDP && (!isFirstPDPView || shouldShowAllImages)
  const { adaptiveCarouselAltMedia } = useContext(ProductMainSectionBreakpointContext)
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const isAccessorizeItEnabled = useExperiment(EXPERIMENTS.ACCESSORIZE_IT)

  const pdpReviewsData = !isEmpty(pdpReviews) ? pdpReviews : reviewsData

  const {
    tangiblee: { enableStrategicTangiblee, strategicTangibleePlacement },
    fullBleed: { dynamicAssetConfig },
  } = usePreference({
    Tangiblee: ['enableStrategicTangiblee', 'strategicTangibleePlacement'],
    'Full-Bleed': ['dynamicAssetConfig'],
  })

  const firstVisitMedia = shouldShowAllImages
    ? get(adaptiveCarouselAltMedia, 'firstVisitAllItems')
    : get(adaptiveCarouselAltMedia, 'firstVisitItems')

  const secondVisitMedia = get(adaptiveCarouselAltMedia, 'secondVisitItems')

  const isCollapsedView = !!firstVisitMedia

  const rawFullMedias = firstVisitMedia || secondVisitMedia || get(media, 'full', [])

  const fullMedias = useMemo(() => {
    const colorAdaptiveMedias = isEnabledColorAdaptive
      ? rawFullMedias.map((mediaItem, index) => {
          const isFirstImage = index === 0
          if (
            isFirstImage &&
            dynamicAssetImage &&
            isSpecificAssetTypeSrc(mediaItem?.src, dynamicAssetConfig?.assetType)
          ) {
            return {
              ...mediaItem,
              ...dynamicAssetImage,
              isDynamicAsset: true,
            }
          }
          return mediaItem
        })
      : rawFullMedias
    if (isSimilarOption) {
      const firstProductImage = colorAdaptiveMedias.find((i) => i.type !== 'video')
      if (firstProductImage) return [...colorAdaptiveMedias, firstProductImage]
    }
    return colorAdaptiveMedias
  }, [
    rawFullMedias,
    isSimilarOption,
    isEnabledColorAdaptive,
    dynamicAssetImage,
    dynamicAssetConfig,
  ])

  videoIdx.current = fullMedias
    ?.map?.((media, index) => media?.type === 'video' && index)
    .filter((videoIndex) => Boolean(videoIndex) !== false)

  const onPaginationMounted = (_, data) => {
    videoIdx.current.forEach((videoIndex) =>
      data.items?.[videoIndex]?.button?.classList?.add('video-bullet')
    )
  }

  const onClickSeeMorePhotos = () => {
    setShouldShowAllImages(true)
    analytics.send('productInteraction', {
      eventAction: 'see more photos click',
      eventLabel: productId,
      eventLocationForced: 'product image',
    })
  }

  // Move carousel to next slide only after shouldShowAllImages state is updated
  useEffect(() => {
    if (isFirstPDPView && shouldShowAllImages) {
      sliderRef.current.go('+1')
    }
  }, [shouldShowAllImages, isFirstPDPView])

  const editorialCopyArray = useMemo(() => {
    if (!imageEditorialCopy) {
      return null
    }
    const editorialCopy = imageEditorialCopy.editorialCopy
    return fullMedias.map((fullMedia) =>
      editorialCopy.find((copy) => {
        const mediaMatch = fullMedia?.src?.match(new RegExp(`${copy.imageType}$`, 'g'))
        return mediaMatch ? copy.imageType === mediaMatch[0] : null
      })
    )
  }, [imageEditorialCopy, fullMedias])

  const accessorizeItTargetIdx = useAccessorizeItCtaTarget(fullMedias)
  const reviewOverlayImageSrc = useReviewOverlayImageSrc(fullMedias)

  const isLastSlide = fullMedias.length - 1 === activeIdx

  const isLastSlideWithSimilarOptions = useMemo(() => {
    return isSimilarOption && fullMedias.length - 1 === activeIdx
  }, [activeIdx])

  const lastSlideIndex = !!fullMedias?.length ? fullMedias.length - 1 : 0

  const mediaGallery = useMemo(() => {
    if (fullMedias?.length === 0) {
      return [
        <ProductMedia
          isActive
          alt={`${brand} Brand Image`}
          idx={0}
          onClick={onMediaClick}
          key="fallback"
          canZoom={false}
          hasZoomedImage={false}
          onSwatchInteraction={onSwatchInteraction}
        />,
      ]
    }

    return fullMedias?.map?.((fullMedia: MediaImage, idx) => {
      if (fullMedia.type === 'video') {
        return (
          <CarouselVideo
            key={`${fullMedia?.src}+${idx}+${selectedColor}`}
            objectFit={'contain'}
            videoSrc={fullMedia?.src}
            poster={getProductImageSrc(
              get(fullMedia, 'poster.src', get(fullMedia, 'poster')),
              'mobile',
              'pdp'
            )}
            isActive={activeIdx === idx}
            idx={`${activeIdx}`}
            isPlay
            muted
            isGallery={true}
            variant="adaptiveTabbedPDP"
            classes={null}
          />
        )
      }

      const fragmentKey = `${fullMedia?.src}+${idx}+${selectedColor}`

      const firstProductMediaProps =
        idx === 0
          ? {
              isTabbedAdaptivePDP: true,
              isDynamicAsset: fullMedia?.isDynamicAsset,
            }
          : {}

      return (
        <Fragment key={fragmentKey}>
          <ProductMedia
            src={fullMedia?.src}
            type={fullMedia?.type}
            alt={fullMedia?.alt}
            idx={idx}
            lastIdx={lastSlideIndex}
            setIsZoomed={setIsZoomed}
            slideChanged={activeIdx}
            canZoom={canZoom}
            hasZoomedImage={hasZoomedImage}
            loading={idx ? 'lazy' : 'eager'}
            onClick={onMediaClick}
            onSwatchInteraction={onSwatchInteraction}
            imageEditorialCopy={editorialCopyArray ? editorialCopyArray[idx] : null}
            {...firstProductMediaProps}
          />
          {fullMedia?.src === reviewOverlayImageSrc &&
            pdpReviewsData?.length > 0 &&
            idx === activeIdx &&
            !isReviewClosed && (
              <ReviewOverlayOnImage
                setIsReviewClosed={setIsReviewClosed}
                selectedVariantId={selectedVariant?.id}
                pdpReviewsData={pdpReviewsData}
                reviewsAvgRating={reviewsAvgRating}
              />
            )}
          {isLastSlideWithSimilarOptions && idx === activeIdx && (
            <LastSlideWithSimilarOptions
              selectedVariantId={selectedVariant?.id}
              variant="adaptiveTabbedPDP"
            />
          )}
        </Fragment>
      )
    })
  }, [
    activeIdx,
    fullMedias,
    get(media, 'full.0.src'),
    canZoom,
    hasZoomedImage,
    brand,
    onMediaClick,
  ])

  useEffect(() => {
    if (mediaFromProps) {
      setMedia(mediaFromProps)
    }
  }, [mediaFromProps])

  useEffect(() => {
    //restore slider if user clicked on another color variant
    if (sliderRef.current && activeIdx !== initialIdx) {
      sliderRef.current?.go(0)
    }
  }, [rawFullMedias?.[0]?.src])

  useEffect(() => {
    setCarouselIndex(activeIdx)
    if (firstUpdateRef.current) {
      firstUpdateRef.current = false
      return
    }
    const imageSrc = getFileBaseName(rawFullMedias?.[activeIdx]?.src)
    if (editorialCopyArray?.[activeIdx]) {
      onSwatchInteraction?.(imageSrc, 'swipe', activeIdx, true)
    } else {
      onSwatchInteraction?.(imageSrc, 'swipe', activeIdx)
    }
  }, [activeIdx])

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.splide?.Components.Drag.disable(
        isZoomed || isScrolled || mediaGallery?.length === 1
      )
    }
  }, [isZoomed, mediaGallery])

  useEffect(() => {
    const firstMediaSrc = get(fullMedias, '[0].src')

    if (firstMediaSrc) {
      if (!firstPDPViewedTime) {
        setFirstPDPViewedTime(new Date().getTime())
      }
    }
  }, [])

  const onMoved = () => {
    if (!isZoomed) {
      const splideEl = get(sliderRef, 'current.splideRef.current')
      const trackEl = splideEl?.querySelector('.splide__list')
      transformRef.current = trackEl?.style?.transform
    }
  }

  // blocks any slider moves when zoom is active
  const getHoldTransitionCss = () => `
    .pdp_mobile_splide-slider .splide__list {
      transform: ${transformRef.current}!important;
    }
  `

  const activeImageSrc = get(fullMedias, [activeIdx, 'src'], '').replace(/\?\$.+$/, '')

  const isTangibleeControlVisible = useMemo(() => {
    if (!enableStrategicTangiblee) return false
    const tangibleeKeys = Object.values(strategicTangibleePlacement).flat().join(',').split(',')
    for (const tangibleeKey of tangibleeKeys) {
      if (activeImageSrc.endsWith(tangibleeKey)) {
        return true
      }
    }
    return false
  }, [tangiblee, activeImageSrc, fullMedias, enableStrategicTangiblee, strategicTangibleePlacement])

  return (
    <Box
      className="pdp_mobile_splide-slider pdp_mobile_adaptive_tabbed_splide_slider"
      id="adaptive_media_carousel"
      w="100vw"
      position="relative"
    >
      <SplideSlider
        options={{ ...sliderOptions, pagination: !(isPdpV41Enabled || isPdpV42Enabled) }}
        innerRef={sliderRef}
        onIndexChange={setActiveIdx}
        onPaginationMounted={onPaginationMounted}
        onMoved={onMoved}
        styles={{}}
        dataQa="slide_crossover_charcoal_active"
      >
        {mediaGallery}
      </SplideSlider>
      <Experiment forIDs={EXPERIMENTS.PDP_V4_2}>
        <NumericSliderPagination
          activeSlideIdx={activeIdx}
          lengthOfSlides={mediaGallery.length}
          goToSlide={get(sliderRef, 'current.go')?.bind(sliderRef.current)}
          setActiveIdx={setActiveIdx}
        />
      </Experiment>
      <Experiment forIDs={EXPERIMENTS.PDP_V4_1}>
        <CustomSliderPagination
          activeSlideIdx={activeIdx}
          lengthOfSlides={mediaGallery.length}
          goToSlide={get(sliderRef, 'current.go')?.bind(sliderRef.current)}
          variant="pdpV41"
        />
      </Experiment>
      {isZoomed && <style>{getHoldTransitionCss()}</style>}
      {isCollapsedView && !shouldShowAllImages && isLastSlide && (
        <SeeMorePhotos onClick={onClickSeeMorePhotos} isBottomMost={!isTangibleeControlVisible} />
      )}
      {enableStrategicTangiblee && (
        <ProductMediaTangibleeControls
          {...tangiblee}
          imageUrl={activeImageSrc}
          variant={isPdpV42Enabled ? 'adaptiveTabbedPDPNumericPagination' : 'adaptiveTabbedPDP'}
        />
      )}
      {isAccessorizeItEnabled &&
        isTabbedAdaptivePDP &&
        accessorizeItTargetIdx !== null &&
        activeIdx === accessorizeItTargetIdx &&
        !isScrolled && <AccessorizeItButton />}
    </Box>
  )
}

export default memo(withErrorBoundaryWrapper(AdaptiveProductCarouselMobileAlt))
