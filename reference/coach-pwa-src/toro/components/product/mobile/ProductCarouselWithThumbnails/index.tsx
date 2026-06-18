import { useState, useMemo, useEffect, useRef, useCallback, FC } from 'react'
import Box from 'toro/components/Box'
import ProductMedia from 'toro/components/product/ProductMediaArea/ProductMedia'
import CarouselVideo from 'toro/components/product/CarouselVideo'
import SplideSlider from 'toro/components/SplideSlider'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import Arrow from 'toro/icons/arrow.svg' // TODO: change to design token after sub task DIGIT-31095 will be done
import { getProductImageSrc } from 'toro/helpers/productImages'
import get from 'lodash/get'
import { useAtomValue } from 'jotai/utils'
import { useAtom } from 'jotai'
import { brandAtom } from 'store/global.atom'
import { productCarouselActiveIndexAtom } from 'store/pdp.atom'
import Button from 'toro/components/Button'
import ProductTangibleeControl, {
  TangibleeControlType,
} from 'toro/components/product/desktop/ProductTangibleeControl'
import removeUrlQueryParameters from 'toro/helpers/removeUrlQueryParameters'
import AccessorizeItButton from 'toro/components/product/AccessorizeIt/AccessorizeItButton'
import { useAccessorizeItCtaTarget } from 'toro/components/product/AccessorizeIt/hooks'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getHeroSwatchInteractionEvent } from 'toro/helpers/pdpGaEvents'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import isNumber from 'lodash/isNumber'
import useSimilarOptionsOnPDP from 'toro/hooks/useSimilarOptionsOnPDP'
import dynamic from 'next/dynamic'
import ProductMediaThumbnails from 'toro/components/product/mobile/ProductMediaThumbnails'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useIsKS from 'toro/helpers/isKS'
import { Flex } from '@chakra-ui/react'
import ProductZoomModal from 'toro/components/product/ProductMediaArea/ProductZoomModal'

const LastSlideWithSimilarOptions = dynamic(
  () => import('toro/components/LastSlideWithSimilarOptions'),
  {
    ssr: false,
  }
)

const options = {
  type: 'loop',
  perPage: 1,
  perMove: 1,
  start: 0,
  arrows: true,
  width: '100vw',
  height: 'auto',
  gap: '0px',
  pagination: false,
}

interface ProductMediaCarouselProps {
  initialIndex?: number
  enableThumbnails: boolean
  enableZoomModal: boolean
}

const ProductCarouselWithThumbnails: FC<ProductMediaCarouselProps> = ({
  initialIndex,
  enableThumbnails,
  enableZoomModal,
}) => {
  const [activeIdx, setActiveIdx] = useAtom(productCarouselActiveIndexAtom)
  const [isZoomed, setIsZoomed] = useState(false)
  const [media, selectedColorId] = useSelectedColorData(['media', 'id'])
  const [zoomedMediaIdx, setZoomedMediaIdx] = useState(null)
  const [zoomModalOpen, setZoomModalOpen] = useState(false)

  const brand = useAtomValue(brandAtom)
  const styles = useMultiStyleConfig('ProductCarousel')
  const wasDragged = useRef(false)
  const wasScrolled = useRef(false)
  const selectedVariantId = useSelectedVariantData('id')
  const isAccessorizeItEnabled = useExperiment(EXPERIMENTS.ACCESSORIZE_IT)
  const analytics = useAnalytics()

  const headerHeight = useHeaderHeight()
  const isKateSpade = useIsKS()
  const arrowsTopMargin = isKateSpade ? headerHeight / 2 : 0

  const sliderRef = useRef(null)
  const thumbsRef = useRef(null)

  const { isSimilarOptionOnPDPEnabled, extendMediaForSimilarOption } = useSimilarOptionsOnPDP()

  const goToSlide = (index: number) => {
    sliderRef.current?.splide?.go(index)
  }

  useEffect(() => {
    //restore slider if user clicked on another color variant
    if (sliderRef.current && activeIdx !== 0) {
      sliderRef.current?.splide?.Components?.Controller?.go(0)
      thumbsRef?.current?.splide?.go(0)
      setActiveIdx(0)
    }
  }, [selectedColorId])

  useEffect(() => {
    const splide = sliderRef.current?.splide
    if (!splide || !isNumber(initialIndex)) return

    setActiveIdx(initialIndex)
    const alignSlide = () => {
      splide.Components?.Controller?.go(initialIndex, true)
    }

    let timerId: ReturnType<typeof setTimeout>
    requestAnimationFrame(() => {
      timerId = setTimeout(() => alignSlide(), 200)
    })

    return () => {
      clearTimeout(timerId)
    }
  }, [initialIndex])

  const fullMedias = useMemo(() => {
    const rawFullMedias = get(media, 'full', [])
    const productMedias = rawFullMedias.map((media) => ({
      ...media,
      poster:
        media.type === 'video'
          ? getProductImageSrc(get(media, 'poster.src'), 'mobile', 'pdp', { isPdpV6: true })
          : undefined,
    }))
    return extendMediaForSimilarOption(productMedias)
  }, [media, extendMediaForSimilarOption])

  const accessorizeItTargetIdx = useAccessorizeItCtaTarget(fullMedias)

  const onMediaClick = (mediaIndex) => {
    setZoomModalOpen(true)
    setZoomedMediaIdx(mediaIndex)
  }

  const handleZoomModalClose = () => {
    setZoomModalOpen(false)
  }

  const mediaGallery = useMemo(() => {
    if (fullMedias?.length === 0) {
      return [
        <ProductMedia
          isActive
          alt={`${brand} Brand Image`}
          idx={0}
          key="fallback"
          canZoom={false}
          hasZoomedImage={false}
        />,
      ]
    }

    const isLastSlideWithSimilarOptions =
      isSimilarOptionOnPDPEnabled && fullMedias.length - 1 === activeIdx

    return fullMedias?.map?.((fullMedia, idx) => (
      <Box key={`${fullMedia?.src}+${idx}+${selectedColorId}`} sx={styles.productMediaItem}>
        {fullMedia?.type === 'video' ? (
          <CarouselVideo
            objectFit={'cover'}
            videoSrc={fullMedia?.src}
            poster={fullMedia?.poster}
            isActive={activeIdx === idx}
            idx={idx}
            isPlay
            muted
            isGallery={true}
            variant={'pdpv6'}
            classes=""
          />
        ) : (
          <ProductMedia
            src={fullMedia?.src}
            type={fullMedia?.type}
            alt={fullMedia?.alt}
            idx={idx}
            slideChanged={activeIdx}
            loading={idx ? 'lazy' : 'eager'}
            fetchPriority={idx === 0 ? 'high' : 'auto'}
            canZoom={!enableZoomModal}
            zoomDisabled={enableZoomModal}
            {...(enableZoomModal
              ? {
                  onClick: () => onMediaClick(idx),
                }
              : {
                  hasZoomedImage: isZoomed,
                  setIsZoomed,
                })}
          />
        )}
        {!isZoomed && activeIdx === idx && (
          <ProductTangibleeControl
            type={TangibleeControlType.media}
            imageUrl={removeUrlQueryParameters(get(fullMedia, 'src', ''))}
          />
        )}
        {isAccessorizeItEnabled && !isZoomed && idx === accessorizeItTargetIdx && (
          <AccessorizeItButton />
        )}
        {isLastSlideWithSimilarOptions && idx === activeIdx && (
          <Flex sx={styles.lastSlideWithSimilarOptions}>
            <LastSlideWithSimilarOptions selectedVariantId={selectedVariantId} variant="pdpv6" />
          </Flex>
        )}
      </Box>
    ))
  }, [
    activeIdx,
    fullMedias,
    brand,
    selectedColorId,
    styles,
    isZoomed,
    selectedVariantId,
    analytics,
    isSimilarOptionOnPDPEnabled,
    isAccessorizeItEnabled,
    accessorizeItTargetIdx,
  ])

  const wrapperStyles = useMemo(() => {
    const transitionStyles = isZoomed
      ? {
          '& .splide__list': {
            transition: 'none !important',
          },
        }
      : {}

    return {
      ...styles.productCarouselWrapper,
      ...transitionStyles,
    }
  }, [isZoomed, styles])

  const onDragged = useCallback(() => {
    wasDragged.current = true
  }, [])

  const onScrolled = useCallback(() => {
    wasScrolled.current = true
  }, [])

  const onIndexChange = useCallback(
    (idx) => {
      setActiveIdx(idx)
      thumbsRef?.current?.splide?.go(idx)

      const interactionName = wasDragged.current ? 'swipe' : 'scroll view'
      const eventsPayload = getHeroSwatchInteractionEvent({
        eventAction: `P${idx + 1}:product image ${interactionName}`,
        selectedVariantId,
        mediaSrc: fullMedias[idx]?.src,
      })
      analytics.send(...eventsPayload)

      wasDragged.current = false
      wasScrolled.current = false
    },
    [fullMedias, selectedVariantId, isZoomed, analytics]
  )

  return (
    <Box sx={wrapperStyles}>
      <SplideSlider
        key={`carousel-${selectedColorId}-${fullMedias?.length}`}
        options={{
          ...options,
          arrows: mediaGallery?.length > 1,
          drag: mediaGallery?.length > 1 && !isZoomed,
          start: initialIndex || options.start,
        }}
        onDragged={onDragged}
        onIndexChange={onIndexChange}
        innerRef={sliderRef}
        styles={styles}
        arrowsTopMargin={arrowsTopMargin}
        modifiedThumbnailsArrows={{
          nextCustomArrow: (
            <Button
              className="splide__arrow splide__arrow--next"
              variant="icon-only"
              data-qa="right_arrow_heroGallery"
              onClickCapture={onScrolled}
            >
              <Arrow />
            </Button>
          ),
          prevCustomArrow: (
            <Button
              className="splide__arrow splide__arrow--prev"
              variant="icon-only"
              data-qa="left_arrow_heroGallery"
              onClickCapture={onScrolled}
            >
              <Arrow />
            </Button>
          ),
        }}
        initialIndex={initialIndex}
      >
        {mediaGallery}
      </SplideSlider>
      {enableThumbnails && (
        <ProductMediaThumbnails
          ref={thumbsRef}
          thumbnailImages={fullMedias}
          activeIdx={activeIdx}
          onThumbnailClick={goToSlide}
        />
      )}
      {enableZoomModal && (
        <ProductZoomModal
          isOpen={zoomModalOpen}
          onClose={handleZoomModalClose}
          isCloseBtnSmall={true}
        >
          <Flex h="100vh">
            <ProductMedia
              src={fullMedias[zoomedMediaIdx]?.src}
              type={fullMedias[zoomedMediaIdx]?.type}
              alt={fullMedias[zoomedMediaIdx]?.alt}
              idx={zoomedMediaIdx}
              slideChanged={activeIdx}
              loading={'eager'}
              canZoom={true}
              hasZoomedImage={isZoomed}
              setIsZoomed={setIsZoomed}
              onClick={onMediaClick}
              height={'100vh'}
              isFullScreen={true}
              is2xZoom={true}
            />
          </Flex>
        </ProductZoomModal>
      )}
    </Box>
  )
}

export default ProductCarouselWithThumbnails
