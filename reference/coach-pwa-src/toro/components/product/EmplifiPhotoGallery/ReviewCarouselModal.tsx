import { Box, ModalCloseButton, SystemStyleObject } from '@chakra-ui/react'
import Modal from 'toro/components/Modal'
import ModalContent from 'toro/components/ModalContent'
import { NormalizedPhotoReview } from 'toro/helpers/emplifiNormalizers'
import SplideSlider from 'toro/components/SplideSlider'
import Text from 'toro/components/Text'
import { useCallback } from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import { useIntl } from 'react-intl'
import useReviewsImageContainerAnalytics, {
  REVIEWS_IMAGE_CONTAINER_EVENTS,
} from 'toro/analytics/useReviewsImageContainerAnalytics'
import { DESKTOP_SLIDE_WIDTH } from 'toro/components/product/EmplifiPhotoGallery/theme'
import ReviewContent from 'toro/components/product/EmplifiPhotoGallery/ReviewContent'

export type ReviewCarouselModalProps = {
  isOpen: boolean
  onClose: () => void
  reviews: NormalizedPhotoReview[]
  initialIndex: number
  styles: Record<string, SystemStyleObject>
  productDataId?: string
}

const ReviewCarouselModal: React.FC<ReviewCarouselModalProps> = ({
  isOpen,
  onClose,
  reviews,
  initialIndex,
  styles,
  productDataId,
}) => {
  const { formatMessage } = useIntl()
  const { sendEvent } = useReviewsImageContainerAnalytics(productDataId)
  const textClose = formatMessage({
    id: 'pdp.product.reviewsGallery.close',
    defaultMessage: 'Close',
  })
  const { isMobile } = useViewportType()
  const handleReviewsCarouselMove = useCallback(
    (_slider: unknown, _idx: number, prev: number, dest: number) => {
      if (dest > prev) sendEvent(REVIEWS_IMAGE_CONTAINER_EVENTS.REVIEWS_SCROLL)
    },
    [sendEvent]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" motionPreset="none">
      <ModalContent sx={styles.carouselModal}>
        <Box sx={styles.carouselCloseButton} data-qa="review_close_gallery">
          <ModalCloseButton />
          <Text>{textClose}</Text>
        </Box>
        <SplideSlider
          options={{
            type: 'slide',
            pagination: false,
            arrows: reviews.length > 1,
            focus: 'center',
            trimSpace: false,
            perPage: 1,
            gap: '1rem',
            start: initialIndex,
            fixedWidth: isMobile ? '85vw' : DESKTOP_SLIDE_WIDTH,
            fixedHeight: isMobile ? '85vh' : 'min(calc(100vh - 204px), 700px)',
            noDrag: '.carouselThumbnails *',
          }}
          arrowProps={{
            next: {
              'data-qa': 'review_image_right_arrow',
            },
            prev: {
              'data-qa': 'review_image_left_arrow',
            },
          }}
          styles={{
            ...styles,
            arrows: { ...styles.carouselArrows, ...styles.arrows },
            container: styles.carouselContainer,
          }}
          initialIndex={initialIndex}
          dataQa="customer_review_image_container"
          onMove={handleReviewsCarouselMove}
        >
          {reviews.map((review) => (
            <Box key={review.id} sx={styles.carouselItem}>
              <ReviewContent review={review} styles={styles} productDataId={productDataId} />
            </Box>
          ))}
        </SplideSlider>
      </ModalContent>
    </Modal>
  )
}

export default ReviewCarouselModal
