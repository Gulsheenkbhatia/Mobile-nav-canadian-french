import { useMemo, useState, useEffect, memo, useCallback } from 'react'
import Box from 'toro/components/Box'
import ProductMedia from 'toro/components/product/ProductMediaArea/ProductMedia'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isFunction from 'lodash/isFunction'
import ProductCarouselThumbnails from 'toro/components/product/ProductMediaArea/ProductCarouselThumbnails'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useViewportType from 'toro/hooks/useViewportType'
import CarouselVideo from 'toro/components/product/CarouselVideo'
import useTheme from 'toro/hooks/useTheme'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import ConditionalDelayWrapper from 'toro/components/ConditionalDelayWrapper'
import PropTypes from 'prop-types'
import ProductHeroBottomWidgets from 'toro/components/product/ProductMediaArea/ProductHeroBottomWidgets'
import useReviewOverlayImageSrc from 'toro/hooks/useReviewOverlayImageSrc'
import ReviewOverlayOnImage from 'toro/components/ReviewOverlayOnImage'
import { useAtomValue } from 'jotai/utils'
import { pdpReviewsAtom } from 'store/pdp.atom'

const containerProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
/**
 * PDP media carousel for desktop devices with thumbnails and large media
 *
 * @param  {Object} productData normalized product data
 * @param  {Boolean} canZoom main image is scaleable
 * @param  {Function} onMediaClick main image click handler
 * @param  {Function} onChange active thumbnail selection change handler
 * @param  {Number} initialIdx initially selected thumbnail index
 */
function ProductCarouselDesktop({
  media,
  initialIdx = 0,
  onChange,
  canZoom,
  hasZoomedImage,
  onMediaClick,
  isQuickView,
  isModalOpened,
  onSwatchInteraction,
  label,
  customizedOrMonogrammed,
  brand,
  siteId,
  selectedVariant,
  isSimilarOptionOnPDP,
  reviewsData,
  reviewsAvgRating,
}) {
  const theme = useTheme()
  const { viewport } = useViewportType()
  const [activeIdx, setActiveIdx] = useState(initialIdx)
  const rawFullMedias = get(media, 'full', [])
  const isDelayed = isModalOpened || isQuickView
  const pdpReviews = useAtomValue(pdpReviewsAtom)

  const pdpReviewsData = !isEmpty(pdpReviews) ? pdpReviews : reviewsData

  const fullMedias = useMemo(() => {
    let mediaAssets =
      rawFullMedias?.map?.((media) => ({
        ...media,
        src: getProductImageSrc(media?.src, viewport, 'pdp', { isThumbnail: true, isQuickView }),
      })) || []

    if (isModalOpened) {
      return mediaAssets
    }

    if (mediaAssets?.length <= 3) {
      mediaAssets = [
        ...mediaAssets.filter((item) => item?.type !== 'video'),
        ...mediaAssets.filter((item) => item?.type === 'video'),
      ]
    }

    if (isSimilarOptionOnPDP && !isQuickView && !isModalOpened && mediaAssets.length > 1) {
      mediaAssets.push(mediaAssets[0])
    }

    return mediaAssets
  }, [rawFullMedias, viewport, isModalOpened, label, isSimilarOptionOnPDP])

  const currentImageData = useMemo(() => fullMedias[activeIdx], [activeIdx, fullMedias])

  const [productThumbnails, setProductThumbnails] = useState(fullMedias)
  const [isReviewClosed, setIsReviewClosed] = useState(false)

  const modalActiveIndex = useMemo(() => {
    const mainSrc = fullMedias[activeIdx]?.src?.split?.('?')[0]
    const findInd = rawFullMedias?.findIndex((m) => m?.src === mainSrc)
    return findInd > 0 ? findInd : 0
  }, [fullMedias, rawFullMedias, activeIdx])

  const reviewOverlayImageSrc = useReviewOverlayImageSrc(fullMedias)

  useEffect(() => {
    //restore slider if user clicked on another color variant
    if (activeIdx) {
      setActiveIdx(0)
      isFunction(onChange) && onChange(0)
    }
  }, [fullMedias])

  useEffect(() => {
    if (isModalOpened) {
      setActiveIdx(modalActiveIndex)
      setProductThumbnails(rawFullMedias)
    } else {
      setProductThumbnails(fullMedias)
    }
  }, [isModalOpened, fullMedias, modalActiveIndex])

  const onActiveIdxChange = useCallback(
    (idx) => {
      setActiveIdx(idx)
      onChange && onChange(idx)
    },
    [onChange]
  )
  const getFirstThumbnailSrc = () => {
    return get(productThumbnails, '[0].src')
  }
  const carouselThumbnails = useMemo(
    () => productThumbnails,
    [getFirstThumbnailSrc(), productThumbnails?.length]
  )

  const isLastSlideWithSimilarOptions = useMemo(() => {
    return (
      isSimilarOptionOnPDP &&
      productThumbnails.length - 1 === activeIdx &&
      !isModalOpened &&
      !isQuickView
    )
  }, [activeIdx])
  return (
    <>
      {productThumbnails ? (
        <>
          <ConditionalDelayWrapper condition={isDelayed}>
            <Box
              w={isQuickView ? '64px' : '101px'}
              ml={isQuickView && '0'}
              mr={isQuickView ? '16px' : '0'}
              h={isQuickView ? 'auto' : hasZoomedImage ? '100vh' : '495px'}
              alignItems={hasZoomedImage ? 'center' : 'flex-start'}
              className={'product-thumbails-slider'}
            >
              <ProductCarouselThumbnails
                modalActiveIndex={modalActiveIndex}
                thumbnails={carouselThumbnails}
                activeIdx={activeIdx}
                isQuickView={isQuickView}
                isModalOpened={isModalOpened}
                label={label}
                setActiveIdx={onActiveIdxChange}
                onSwatchInteraction={onSwatchInteraction}
                brand={brand}
                siteId={siteId}
              />
            </Box>
          </ConditionalDelayWrapper>
          <Box
            h={hasZoomedImage ? '100vh' : '495px'}
            pl={isQuickView ? 0 : 'var(--spacing-3)'}
            overflow="hidden"
            w={hasZoomedImage ? 'calc(83.33% - 3px)' : isQuickView ? '317px' : '88%'}
            position="relative"
          >
            {currentImageData?.type === 'video' ? (
              <CarouselVideo
                size={80}
                height="495px"
                objectFit="contain"
                videoSrc={currentImageData?.src}
                poster={currentImageData?.poster?.src}
                idx={activeIdx}
                isPlay
                isDesktop={true}
                isActive
                isQuickView={isQuickView}
                key={currentImageData?.src}
              />
            ) : (
              <ProductMedia
                src={currentImageData?.src}
                type={currentImageData?.type}
                isActive
                alt={currentImageData?.alt}
                muted
                slideChanged={activeIdx} // to trigger the zoom reset on ImageZoom component
                canZoom={currentImageData?.src ? canZoom : false}
                hasZoomedImage={hasZoomedImage}
                isQuickView={isQuickView}
                label={label}
                onClick={onMediaClick}
                cursor={
                  !isQuickView && (!currentImageData?.type || currentImageData?.type === 'image')
                    ? 'zoom-in'
                    : null
                }
                height={isQuickView ? 'auto' : hasZoomedImage ? '100vh' : '495px'}
                width={isQuickView ? '100%' : 'auto'}
                objectFit="contain"
                maxHeight={isQuickView ? '100%' : customizedOrMonogrammed ? '495px' : 'initial'}
                maxWidth="100%"
                containerProps={containerProps}
              />
            )}
            {!isQuickView &&
              (currentImageData?.src === reviewOverlayImageSrc &&
              pdpReviewsData?.length > 0 &&
              !isReviewClosed ? (
                <ReviewOverlayOnImage
                  setIsReviewClosed={setIsReviewClosed}
                  selectedVariantId={selectedVariant?.id}
                  pdpReviewsData={pdpReviewsData}
                  reviewsAvgRating={reviewsAvgRating}
                />
              ) : (
                <ProductHeroBottomWidgets
                  isLastSlideWithSimilarOptions={isLastSlideWithSimilarOptions}
                  selectedVariantId={selectedVariant?.id}
                />
              ))}
          </Box>
        </>
      ) : (
        <Box w="80px" h="95px" bg={theme.colors.main.inactive} />
      )}
    </>
  )
}

ProductCarouselDesktop.propTypes = {
  media: PropTypes.object,
  canZoom: PropTypes.bool,
  hasZoomedImage: PropTypes.bool,
  onMediaClick: PropTypes.func,
  onChange: PropTypes.func,
  initialIdx: PropTypes.number,
  isQuickView: PropTypes.bool,
  isModalOpened: PropTypes.bool,
  onSwatchInteraction: PropTypes.func,
  label: PropTypes.string,
  customizedOrMonogrammed: PropTypes.bool,
  brand: PropTypes.string,
  siteId: PropTypes.string,
  selectedVariant: PropTypes.object,
}

ProductCarouselDesktop.defaultProps = {
  onMediaClick: () => {},
  onSwatchInteraction: () => {},
  initialIdx: 0,
}

export default withErrorBoundaryWrapper(memo(ProductCarouselDesktop))
