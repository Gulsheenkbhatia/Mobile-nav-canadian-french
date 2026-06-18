import { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react'
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
import PropTypes from 'prop-types'
import { useAtomValue } from 'jotai/utils'
import { pdpReviewsAtom } from 'store/pdp.atom'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import dynamic from 'next/dynamic'
import Experiment from 'toro/components/Experiment'
import useReviewOverlayImageSrc from 'toro/hooks/useReviewOverlayImageSrc'
import ReviewOverlayOnImage from 'toro/components/ReviewOverlayOnImage'
import { firstPDPViewAtom } from 'store/plp.atom'
import { getProductImageSrc } from 'toro/helpers/productImages'
import { useAtomSetter } from 'toro/helpers/jotai/useAtomSetter'
import usePreference from 'toro/hooks/usePreference_new'
import ProductMediaTangibleeControls from 'toro/components/product/ProductMediaArea/ProductMediaTangibleeControls'
import AccessorizeItButton from 'toro/components/product/AccessorizeIt/AccessorizeItButton'
import { useAccessorizeItCtaTarget } from 'toro/components/product/AccessorizeIt/hooks'
import NumericSliderPagination from 'toro/components/product/NumericSliderPagination'
import CustomSliderPagination from 'toro/components/product/CustomSliderPagination'
import {
  IPHONE_PRO_SCREEN_WIDTH,
  V41_UPL_SLOT_MIN_HEIGHT,
  V41_UPL_SLOT_MIN_HEIGHT_LARGE_DEVICES,
} from 'toro/constants/adaptiveExperience'

const LastSlideWithSimilarOptions = dynamic(
  () => import('toro/components/LastSlideWithSimilarOptions'),
  {
    ssr: false,
  }
)

const options = {
  perPage: 1,
  perMove: 1,
  start: 0,
  arrows: false,
  rewind: true,
  rewindByDrag: true,
  width: '100vw',
  heightRatio: 1.25,
}

const getFullMedias = (rawFullMedias = []) => {
  const medias = rawFullMedias.map((media) => ({
    ...media,
    poster:
      media.type === 'video'
        ? getProductImageSrc(get(media, 'poster.src'), 'mobile', 'pdp')
        : undefined,
  }))

  if (medias?.length > 3) {
    return medias
  }

  return medias.sort((a, b) => (a.type === 'video') - (b.type === 'video'))
}

/**
 * PDP media carousel for mobile devices with swipable items
 *
 * @param  {Object} productData normalized product data
 * @param  {Function} onMediaClick main image click handler
 * @param  {Number} initialIdx initially selected thumbnail index
 */
function AdaptiveProductCarouselMobile({
  media: mediaFromProps,
  canZoom,
  hasZoomedImage,
  onMediaClick,
  initialIdx = 0,
  selectedVariant,
  onSwatchInteraction,
  brand,
  selectedColor,
  imageEditorialCopy,
  tangiblee,
  isSimilarOptionOnPDP,
  reviewsData,
  setCarouselIndex,
  isScrolled,
  isDynamicAssetPresent,
  dynamicAssetImage,
  isEnabledColorAdaptive,
  reviewsAvgRating,
}) {
  const isPdpLandingWithVideoFirstAltImage = useExperiment(
    EXPERIMENTS.PDP_LANDING_WITH_VIDEO_FIRST_ALT_IMAGE
  )
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const isAccessorizeItEnabled = useExperiment(EXPERIMENTS.ACCESSORIZE_IT)
  const [activeIdx, setActiveIdx] = useState(initialIdx)
  const [media, setMedia] = useState(mediaFromProps || {})
  const [isReviewClosed, setIsReviewClosed] = useState(false)
  const videoIdx = useRef([])
  const rawFullMedias = get(media, 'full', [])
  const sliderRef = useRef()
  const firstUpdateRef = useRef(true)
  const [isZoomed, setIsZoomed] = useState(false)
  const transformRef = useRef('translateX(0px)')
  const setFirstPDPViewedTime = useAtomSetter(firstPDPViewAtom)
  const firstPDPViewedTime = useAtomValue(firstPDPViewAtom)
  const pdpReviews = useAtomValue(pdpReviewsAtom)

  const isLookBookMainStagePDPEnabled = useExperiment(
    `${EXPERIMENTS.LOOKBOOK_MAIN_STAGE_PDP}-${EXPERIMENTS.LOOKBOOK_VIDEO_WAYS_TO_WEAR}-${EXPERIMENTS.LOOKBOOK_VIDEO_WHAT_FITS_INSIDE}`
  )

  const pdpReviewsData = !isEmpty(pdpReviews) ? pdpReviews : reviewsData

  const getCurrentTransform = () => {
    const splideEl = get(sliderRef, 'current.splideRef.current')
    const trackEl = splideEl?.querySelector('.splide__list')
    return trackEl?.style?.transform
  }

  const {
    fullBleed: { dynamicAssetConfig },
    tangiblee: { enableStrategicTangiblee },
  } = usePreference({
    'Full-Bleed': ['dynamicAssetConfig'],
    Tangiblee: ['enableStrategicTangiblee'],
  })

  const onMoved = () => {
    if (!isZoomed) {
      transformRef.current = getCurrentTransform()
    }
  }

  // blocks any slider moves when zoom is active
  const getHoldTransitionCss = () => `
    .pdp_mobile_splide-slider .splide__list {
      transform: ${transformRef.current}!important;
    }
  `

  useEffect(() => {
    if (mediaFromProps) {
      setMedia(mediaFromProps)
    }
  }, [mediaFromProps])

  const fullMediasWithoutLookBook = useMemo(() => {
    let productMedias = getFullMedias(rawFullMedias, isPdpLandingWithVideoFirstAltImage)
    if (productMedias.length === 0) {
      return []
    }
    if (isSimilarOptionOnPDP) {
      const firstProductImage = productMedias.find(
        (i) => i.type !== 'video' && i.isLookBook !== true
      )

      productMedias.push(firstProductImage)
    }

    if (isEnabledColorAdaptive) {
      if (dynamicAssetImage) {
        const dynamicAssetImageIndex = productMedias.findIndex((image) =>
          isSpecificAssetTypeSrc(image?.src, dynamicAssetConfig?.assetType)
        )

        if (dynamicAssetImageIndex !== -1) {
          const [replacedImage] = productMedias.splice(dynamicAssetImageIndex, 1)
          productMedias.unshift({ ...replacedImage, ...dynamicAssetImage, isDynamicAsset: true })
        }
      }

      if (isDynamicAssetPresent) {
        productMedias = productMedias.filter((item) => !isSpecificAssetTypeSrc(item?.src, '_a0'))
      }
    } else {
      const a0AssetIndex = productMedias.findIndex((item) =>
        isSpecificAssetTypeSrc(item?.src, '_a0')
      )
      if (a0AssetIndex !== -1) {
        productMedias.unshift(productMedias.splice(a0AssetIndex, 1)[0])
      }
    }

    return productMedias
  }, [
    rawFullMedias,
    isSimilarOptionOnPDP,
    isPdpLandingWithVideoFirstAltImage,
    isDynamicAssetPresent,
    dynamicAssetImage,
    dynamicAssetConfig?.assetType,
    isEnabledColorAdaptive,
  ])

  const fullMedias = useMemo(() => {
    if (isLookBookMainStagePDPEnabled) {
      return fullMediasWithoutLookBook.sort((mediaItemA, mediaItemB) => {
        if (mediaItemA.isLookBook) return -1
        if (mediaItemB.isLookBook) return 1
        return 0
      })
    }
    return fullMediasWithoutLookBook
  }, [fullMediasWithoutLookBook, isLookBookMainStagePDPEnabled])

  videoIdx.current = fullMedias
    ?.map?.((media, index) => media?.type === 'video' && index)
    .filter((videoIndex) => videoIndex !== false)

  const customizeVideoBullets = (_, data) => {
    const indexArr = videoIdx.current
    if (indexArr.length >= 0) {
      indexArr.forEach((videoIndex) =>
        data.items?.[videoIndex]?.button?.classList?.add('video-bullet')
      )
    }
  }

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

  useEffect(() => {
    //restore slider if user clicked on another color variant
    if (sliderRef.current && activeIdx !== initialIdx) {
      sliderRef.current?.go(0)
    }
  }, [rawFullMedias?.[0]?.src])

  useEffect(() => {
    if (firstUpdateRef.current) {
      firstUpdateRef.current = false
      return
    }
    const imageSrc = getFileBaseName(rawFullMedias?.[activeIdx]?.src)
    // Check for editorial image
    if (editorialCopyArray?.[activeIdx]) {
      onSwatchInteraction?.(imageSrc, 'swipe', activeIdx, true)
    } else {
      onSwatchInteraction?.(imageSrc, 'swipe', activeIdx)
    }
  }, [activeIdx])

  const isLastSlideWithSimilarOptions = useMemo(() => {
    return isSimilarOptionOnPDP && fullMedias.length - 1 === activeIdx
  }, [activeIdx])

  useEffect(() => {
    setCarouselIndex(activeIdx)
  }, [activeIdx])

  const lastSlideIndex = !!fullMedias?.length ? fullMedias.length - 1 : 0

  const mediaGallery = useMemo(() => {
    return fullMedias?.length === 0
      ? [
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
      : fullMedias?.map?.((fullMedia, idx) =>
          fullMedia?.type === 'video' ? (
            <CarouselVideo
              key={`${fullMedia?.src}+${idx}+${selectedColor}`}
              objectFit={'contain'}
              videoSrc={fullMedia?.src}
              poster={fullMedia?.poster}
              isActive={activeIdx === idx}
              idx={activeIdx}
              isPlay
              muted
              isGallery={true}
              variant="adaptiveTabbedPDP"
            />
          ) : idx === 0 ? (
            <Fragment key={`${fullMedia?.src}+${idx}+${selectedColor}`}>
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
                isTabbedAdaptivePDP
                isDynamicAsset={fullMedia?.isDynamicAsset}
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
          ) : (
            <Fragment key={`${fullMedia?.src}+${idx}+${selectedColor}`}>
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
        )
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
    if (sliderRef.current) {
      sliderRef.current.splide?.Components.Drag.disable(
        isZoomed || isScrolled || mediaGallery?.length === 1
      )
    }
  }, [isZoomed, mediaGallery])

  useEffect(() => {
    const firstMediaSrc = fullMedias.find(({ type }) => type !== 'video')?.src

    if (firstMediaSrc) {
      if (!firstPDPViewedTime) {
        setFirstPDPViewedTime(new Date().getTime())
      }
    }
  }, [])

  return (
    <Box
      className="pdp_mobile_splide-slider pdp_mobile_adaptive_tabbed_splide_slider"
      id="adaptive_media_carousel"
      w="100vw"
      position="relative"
    >
      <SplideSlider
        options={{
          ...options,
          pagination: !(isPdpV41Enabled || isPdpV42Enabled),
          height:
            isPdpV41Enabled || isPdpV42Enabled
              ? `calc(125vw - ${V41_UPL_SLOT_MIN_HEIGHT}px)`
              : '125vw',
          mediaQuery: 'min',
          breakpoints: {
            [IPHONE_PRO_SCREEN_WIDTH]: {
              height:
                isPdpV41Enabled || isPdpV42Enabled
                  ? `calc(125vw - ${V41_UPL_SLOT_MIN_HEIGHT_LARGE_DEVICES}px)`
                  : '125vw',
            },
          },
        }}
        innerRef={sliderRef}
        onIndexChange={setActiveIdx}
        onPaginationMounted={customizeVideoBullets}
        onMoved={onMoved}
        dataQa="slide_crossover_charcoal_active"
      >
        {mediaGallery}
      </SplideSlider>
      <Experiment forIDs={EXPERIMENTS.PDP_V4_2}>
        <NumericSliderPagination
          activeSlideIdx={activeIdx}
          lengthOfSlides={mediaGallery.length}
          goToSlide={get(sliderRef, 'current.go')?.bind(sliderRef.current)}
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
      {!isLastSlideWithSimilarOptions && enableStrategicTangiblee && (
        <ProductMediaTangibleeControls
          {...tangiblee}
          imageUrl={get(fullMedias, [activeIdx, 'src'], '').replace(/\?\$.+$/, '')}
          variant={isPdpV42Enabled ? 'adaptiveTabbedPDPNumericPagination' : 'adaptiveTabbedPDP'}
        />
      )}
      {isAccessorizeItEnabled &&
        accessorizeItTargetIdx != null &&
        activeIdx === accessorizeItTargetIdx &&
        !isScrolled && <AccessorizeItButton />}
    </Box>
  )
}

export default memo(withErrorBoundaryWrapper(AdaptiveProductCarouselMobile))

AdaptiveProductCarouselMobile.propTypes = {
  label: PropTypes.string,
  media: PropTypes.object,
  canZoom: PropTypes.bool,
  hasZoomedImage: PropTypes.bool,
  onMediaClick: PropTypes.func,
  initialIdx: PropTypes.number,
  onSwatchInteraction: PropTypes.func,
  brand: PropTypes.string,
  selectedVariant: PropTypes.object,
  isScrolled: PropTypes.bool,
}

AdaptiveProductCarouselMobile.defaultProps = {
  onMediaClick: () => {},
  onSwatchInteraction: () => {},
  initialIdx: 0,
}
