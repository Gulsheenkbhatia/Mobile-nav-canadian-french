import { useState, useMemo, useEffect, useRef, useCallback, FC } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
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
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getHeroSwatchInteractionEvent } from 'toro/helpers/pdpGaEvents'
import {
  getBentoBoxPopupSwipeEvent,
  getBentoBoxImageZoomEvent,
  getBentoBoxPopupScrollEvent,
} from 'toro/helpers/bentoBoxAnalytics'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import isNumber from 'lodash/isNumber'
import useSimilarOptionsOnPDP from 'toro/hooks/useSimilarOptionsOnPDP'
import dynamic from 'next/dynamic'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useIsKS from 'toro/helpers/isKS'

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

interface ProductCarouselWithZoomProps {
  variant?: 'bento'
  initialIndex?: number
}

const ProductCarouselWithZoom: FC<ProductCarouselWithZoomProps> = ({ variant, initialIndex }) => {
  const [activeIdx, setActiveIdx] = useAtom(productCarouselActiveIndexAtom)
  const sliderRef = useRef(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [media, selectedColorId] = useSelectedColorData(['media', 'id'])
  const brand = useAtomValue(brandAtom)
  const styles = useMultiStyleConfig('ProductCarousel', { variant })
  const isPdpV6 = useTemplate([TemplateName.pdpv6])
  const wasDragged = useRef(false)
  const wasScrolled = useRef(false)
  const selectedVariantId = useSelectedVariantData('id')
  const isAccessorizeItEnabled = useExperiment(EXPERIMENTS.ACCESSORIZE_IT)
  const analytics = useAnalytics()
  const headerHeight = useHeaderHeight()
  const isKateSpade = useIsKS()
  const arrowsTopMargin = isKateSpade && isPdpV6 ? headerHeight / 2 : 0

  const { isSimilarOptionOnPDPEnabled, extendMediaForSimilarOption } = useSimilarOptionsOnPDP()

  useEffect(() => {
    //restore slider if user clicked on another color variant
    if (sliderRef.current && activeIdx !== 0) {
      sliderRef.current?.splide?.Components?.Controller?.go(0)
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
          ? getProductImageSrc(get(media, 'poster.src'), 'mobile', 'pdp', { isPdpV6: isPdpV6 })
          : undefined,
    }))

    return extendMediaForSimilarOption(productMedias)
  }, [media, extendMediaForSimilarOption, isPdpV6])

  const accessorizeItTargetIdx = useAccessorizeItCtaTarget(fullMedias)

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

    const onImageZoom = (fullMedia: any, idx: number) => {
      if (variant === 'bento' && !isZoomed && fullMedia?.type !== 'video') {
        const zoomEventPayload = getBentoBoxImageZoomEvent({
          mediaIndex: idx,
          mediaSrc: fullMedia?.src || '',
          selectedVariantId: selectedVariantId || '',
        })
        analytics.send(...zoomEventPayload)
      }
    }

    const isLastSlideWithSimilarOptions =
      isSimilarOptionOnPDPEnabled && isPdpV6 && fullMedias.length - 1 === activeIdx

    return fullMedias?.map?.((fullMedia, idx) => (
      <Box key={`${fullMedia?.src}+${idx}+${selectedColorId}`} sx={styles.productMediaItem}>
        {fullMedia?.type === 'video' ? (
          <CarouselVideo
            objectFit={isPdpV6 ? 'cover' : 'contain'}
            videoSrc={fullMedia?.src}
            poster={fullMedia?.poster}
            isActive={activeIdx === idx}
            idx={idx}
            isPlay
            muted
            isGallery={true}
            variant={isPdpV6 ? 'pdpv6' : ''}
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
            canZoom={true}
            hasZoomedImage={isZoomed}
            setIsZoomed={setIsZoomed}
            onSwatchInteraction={() => onImageZoom(fullMedia, idx)}
          />
        )}
        {!isZoomed && activeIdx === idx && (
          <ProductTangibleeControl
            type={TangibleeControlType.media}
            imageUrl={removeUrlQueryParameters(get(fullMedia, 'src', ''))}
          />
        )}
        {isAccessorizeItEnabled && !isZoomed && idx === accessorizeItTargetIdx && (
          <AccessorizeItButton variant={variant} withIcon={variant !== 'bento'} />
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
    variant,
    selectedVariantId,
    analytics,
    isSimilarOptionOnPDPEnabled,
    isAccessorizeItEnabled,
    accessorizeItTargetIdx,
    isPdpV6,
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

      if (variant === 'bento') {
        if (wasDragged.current || wasScrolled.current) {
          const eventFunc = wasScrolled.current
            ? getBentoBoxPopupScrollEvent
            : getBentoBoxPopupSwipeEvent
          const eventPayload = eventFunc({
            mediaIndex: idx,
            mediaSrc: fullMedias[idx]?.src || '',
            selectedVariantId: selectedVariantId || '',
          })
          analytics.send(...eventPayload)
        }
      } else {
        const interactionName = wasDragged.current ? 'swipe' : 'scroll view'
        const eventsPayload = getHeroSwatchInteractionEvent({
          eventAction: `P${idx + 1}:product image ${interactionName}`,
          selectedVariantId,
          mediaSrc: fullMedias[idx]?.src,
        })
        analytics.send(...eventsPayload)
      }
      wasDragged.current = false
      wasScrolled.current = false
    },
    [fullMedias, selectedVariantId, isZoomed, variant, analytics]
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
    </Box>
  )
}

export default ProductCarouselWithZoom
