import { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react'
import Box from 'toro/components/Box'
import ProductMedia from 'toro/components/product/ProductMediaArea/ProductMedia'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import CarouselVideo from 'toro/components/product/CarouselVideo'
import SplideSlider from 'toro/components/SplideSlider'
import { getFileBaseName } from 'toro/components/product/ProductMediaArea/helpers'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import { useAtomValue } from 'jotai/utils'
import { pdpReviewsAtom } from 'store/pdp.atom'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import dynamic from 'next/dynamic'
import useReviewOverlayImageSrc from 'toro/hooks/useReviewOverlayImageSrc'
import ReviewOverlayOnImage from 'toro/components/ReviewOverlayOnImage'
import ProductMediaTangibleeControls from 'toro/components/product/ProductMediaArea/ProductMediaTangibleeControls'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { firstPDPViewAtom } from 'store/plp.atom'
import { getProductImageSrc } from 'toro/helpers/productImages'
import { useAtomSetter } from 'toro/helpers/jotai/useAtomSetter'

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

const getFullMedias = (rawFullMedias = [], isLandingWithFirstVideo = false) => {
  const medias = rawFullMedias.map((media) => ({
    ...media,
    poster:
      media.type === 'video'
        ? getProductImageSrc(get(media, 'poster.src'), 'mobile', 'pdp')
        : undefined,
  }))

  if (isLandingWithFirstVideo) {
    const firstVideoIndex = medias.findIndex((item) => item.type === 'video')

    if (firstVideoIndex !== -1) {
      // remove video from current array
      const [firstVideo] = medias.splice(firstVideoIndex, 1)

      // set video as the first item and add poster image
      medias.unshift(firstVideo)
      return medias
    }
  }

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
function ProductCarouselMobile({
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
  isSwatchChanged,
  reviewsAvgRating,
}) {
  const isPDPTemplateV3 = useExperiment(EXPERIMENTS.PDP_V3)
  const isPdpLandingWithVideoFirstAltImage = useExperiment(
    EXPERIMENTS.PDP_LANDING_WITH_VIDEO_FIRST_ALT_IMAGE
  )
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

  const pdpReviewsData = !isEmpty(pdpReviews) ? pdpReviews : reviewsData

  const getCurrentTransform = () => {
    const splideEl = get(sliderRef, 'current.splideRef.current')
    const trackEl = splideEl?.querySelector('.splide__list')
    return trackEl?.style?.transform
  }

  const {
    tangiblee: { enableStrategicTangiblee },
  } = usePreference({
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

  const fullMedias = useMemo(() => {
    const productMedias = getFullMedias(
      rawFullMedias,
      !isSwatchChanged && isPdpLandingWithVideoFirstAltImage
    )
    if (productMedias.length === 0) {
      return []
    }
    if (isSimilarOptionOnPDP) {
      const firstProductImage = productMedias.find((i) => i.type !== 'video')

      productMedias.push(firstProductImage)
    }

    return productMedias
  }, [rawFullMedias, isSimilarOptionOnPDP, isPdpLandingWithVideoFirstAltImage, isSwatchChanged])

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
            />
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
                <LastSlideWithSimilarOptions selectedVariantId={selectedVariant?.id} />
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
      sliderRef.current.splide?.Components.Drag.disable(isZoomed || mediaGallery?.length === 1)
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

  const pdpMobileSplideClassnames = useMemo(() => {
    let classes = 'pdp_mobile_splide-slider'

    if (isPDPTemplateV3) {
      classes += ' pagination-v3-mobile'
    }

    return classes
  }, [isPDPTemplateV3])

  const styles = useMultiStyleConfig('ProductCarouselMobile')

  return (
    <Box className={pdpMobileSplideClassnames} w="100vw" bg="#f0f0f0" position="relative">
      <SplideSlider
        options={options}
        innerRef={sliderRef}
        onIndexChange={setActiveIdx}
        onPaginationMounted={customizeVideoBullets}
        onMoved={onMoved}
        styles={styles}
      >
        {mediaGallery}
      </SplideSlider>
      {isZoomed && <style>{getHoldTransitionCss()}</style>}
      {enableStrategicTangiblee && (
        <ProductMediaTangibleeControls
          {...tangiblee}
          imageUrl={get(fullMedias, [activeIdx, 'src'], '').replace(/\?\$.+$/, '')}
          variant={isPDPTemplateV3 ? 'pdpV3Redesign' : undefined}
        />
      )}
    </Box>
  )
}

export default memo(withErrorBoundaryWrapper(ProductCarouselMobile))

ProductCarouselMobile.propTypes = {
  label: PropTypes.string,
  media: PropTypes.object,
  canZoom: PropTypes.bool,
  hasZoomedImage: PropTypes.bool,
  onMediaClick: PropTypes.func,
  initialIdx: PropTypes.number,
  onSwatchInteraction: PropTypes.func,
  brand: PropTypes.string,
  selectedVariant: PropTypes.object,
}

ProductCarouselMobile.defaultProps = {
  onMediaClick: () => {},
  onSwatchInteraction: () => {},
  initialIdx: 0,
}
