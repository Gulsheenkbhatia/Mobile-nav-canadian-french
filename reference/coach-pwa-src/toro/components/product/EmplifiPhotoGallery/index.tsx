import React, { useState, useCallback, useMemo, useRef } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Image from 'toro/components/Image'
import SplideSlider from 'toro/components/SplideSlider'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import type { NormalizedPhotoReview } from 'toro/helpers/emplifiNormalizers'
import { BopisArrowRightIcon } from 'toro/icons'
import PhotoGalleryModal from 'toro/components/product/EmplifiPhotoGallery/PhotoGalleryModal'
import ReviewCarouselModal from 'toro/components/product/EmplifiPhotoGallery/ReviewCarouselModal'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import { useDisclosure } from '@chakra-ui/react'
import Text from 'toro/components/Text'
import { TemplateName } from 'toro/constants/templates'
import useTemplate from 'toro/hooks/useTemplate'
import { REVIEWS_IMAGE_CAROUSEL } from 'toro/constants/googleAnalytics'

const MOBILE_VISIBLE_PHOTOS = 1
const DESKTOP_VISIBLE_PHOTOS = 4

type EmplifiPhotoGalleryProps = {
  photos: NormalizedPhotoReview[]
  productId?: string
}

const EmplifiPhotoGallery = ({ photos = [], productId }: EmplifiPhotoGalleryProps) => {
  const { formatMessage } = useIntl()
  const { isMobile } = useViewportType()
  const isPDPv5_1 = useTemplate([TemplateName.pdpv5_1])
  const styles = useMultiStyleConfig('EmplifiPhotoGallery', {
    variant: isPDPv5_1 ? 'pdpv5_1' : undefined,
  })
  const [selectedReviewIndex, setSelectedReviewIndex] = useState(0)

  const {
    isOpen: isViewAllModalOpen,
    onClose: onCloseViewAllModal,
    onOpen: onOpenViewAllModal,
  } = useDisclosure()
  const {
    isOpen: isReviewCarouselOpen,
    onClose: onCloseReviewCarousel,
    onOpen: onOpenReviewCarousel,
  } = useDisclosure()
  const analytics = useAnalytics()
  const selectedVariantId = useSelectedVariantData('id')
  const fromViewAllModalRef = useRef(false)
  const maxSlideIndexRef = useRef(0)

  const sendCarouselEvent = useCallback(
    (eventAction) => {
      analytics.send('reviewInteraction', {
        eventLocationForced: REVIEWS_IMAGE_CAROUSEL,
        eventAction,
        eventLabel: selectedVariantId,
      })
    },
    [analytics, selectedVariantId]
  )

  const handleSlideMove = useCallback(
    (_slider: unknown, newIndex: number) => {
      if (isMobile) {
        if (newIndex <= maxSlideIndexRef.current) return
        maxSlideIndexRef.current = newIndex
        sendCarouselEvent('image swipe')
      } else {
        sendCarouselEvent('image scroll')
      }
    },
    [sendCarouselEvent, isMobile]
  )

  const handleOpenGallery = useCallback(() => {
    sendCarouselEvent('view all click')
    onOpenViewAllModal()
  }, [sendCarouselEvent, onOpenViewAllModal])

  const handleThumbnailClick = useCallback(
    (index: number, fromViewAllModal: boolean = false) => {
      fromViewAllModalRef.current = fromViewAllModal
      setSelectedReviewIndex(index)
      onOpenReviewCarousel()
      sendCarouselEvent('image click')
    },
    [sendCarouselEvent, onOpenReviewCarousel]
  )

  const onReviewCarouselModalClose = useCallback(() => {
    onCloseReviewCarousel()
    if (fromViewAllModalRef.current) {
      onOpenViewAllModal()
    }
    fromViewAllModalRef.current = false
  }, [onCloseReviewCarousel, onOpenViewAllModal])

  const flatPhotos = useMemo(() => {
    return photos.flatMap((review, index) => review.photos.map((photo) => ({ ...photo, index })))
  }, [photos])

  if (!flatPhotos.length) {
    return null
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.divider} />
      <Flex sx={styles.header}>
        <Text as="h3" sx={styles.title}>
          {formatMessage({
            id: 'pdp.reviews.customerPhotos',
            defaultMessage: 'Customer photos',
          })}
        </Text>
        <Box
          as="button"
          data-qa="view_all_cta"
          onClick={handleOpenGallery}
          sx={styles.viewAllButton}
        >
          {formatMessage({
            id: 'pdp.reviews.viewAllPhotos',
            defaultMessage: 'View all',
          })}
          <BopisArrowRightIcon />
        </Box>
      </Flex>
      <SplideSlider
        options={{
          type: 'slide',
          gap: 'var(--spacing-2)',
          arrows: !isMobile && photos.length > DESKTOP_VISIBLE_PHOTOS,
          pagination: false,
          autoWidth: isMobile,
          rewind: false,
          perMove: 1,
          perPage: isMobile ? MOBILE_VISIBLE_PHOTOS : DESKTOP_VISIBLE_PHOTOS,
        }}
        styles={{
          arrows: styles.arrows,
        }}
        arrowProps={{
          next: { 'data-qa': 'next_arrow_customer_review_image' },
          prev: { 'data-qa': 'prev_arrow_customer_review_image' },
        }}
        onMove={handleSlideMove}
      >
        {flatPhotos.map(({ id, thumbnailUrl, caption, index }) => (
          <Box
            key={id}
            as="button"
            onClick={() => handleThumbnailClick(index)}
            sx={styles.photoContainer}
          >
            <Image
              src={thumbnailUrl}
              data-qa="review_image_thumbnail"
              alt={
                caption ||
                formatMessage({
                  id: 'pdp.reviews.customerPhoto',
                  defaultMessage: 'Customer photo',
                })
              }
              lazy
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        ))}
      </SplideSlider>

      <PhotoGalleryModal
        isOpen={isViewAllModalOpen}
        onClose={onCloseViewAllModal}
        photos={flatPhotos}
        styles={styles}
        onThumbnailClick={handleThumbnailClick}
      />

      <ReviewCarouselModal
        isOpen={isReviewCarouselOpen}
        onClose={onReviewCarouselModalClose}
        reviews={photos}
        initialIndex={selectedReviewIndex}
        styles={styles}
        productDataId={selectedVariantId}
      />
    </Box>
  )
}

export default EmplifiPhotoGallery
