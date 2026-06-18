import { Box, Image, SystemStyleObject } from '@chakra-ui/react'
import SplideSlider from 'toro/components/SplideSlider'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import { NavChevronDownIcon } from 'toro/icons'
import ReviewVoteButtons from 'toro/components/product/EmplifiPhotoGallery/ReviewVoteButtons'
import ReviewIncentivizedDetail from 'toro/components/product/RatingsAndReviews/ReviewIncentivizedDetail'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import RatingStars from 'toro/components/product/RatingsAndReviews/RatingStars'
import useViewportType from 'toro/hooks/useViewportType'
import { useIntl } from 'react-intl'
import useReviewsImageContainerAnalytics, {
  REVIEWS_IMAGE_CONTAINER_EVENTS,
} from 'toro/analytics/useReviewsImageContainerAnalytics'
import { COLLAPSED_REVIEW_TEXT_HEIGHT } from 'toro/components/product/EmplifiPhotoGallery/theme'
import type { NormalizedPhotoReview } from 'toro/helpers/emplifiNormalizers'

export type ReviewContentProps = {
  review: NormalizedPhotoReview
  styles: Record<string, SystemStyleObject>
  productDataId?: string
}

const ReviewContent: React.FC<ReviewContentProps> = ({ review, styles, productDataId }) => {
  const { sendEvent } = useReviewsImageContainerAnalytics(productDataId)
  const [activePhoto, setActivePhoto] = useState(0)
  const { isMobile } = useViewportType()

  const formattedDate = useMemo(() => {
    const date = new Date(review.reviewedDate)
    return date.toLocaleDateString('en-US', {
      month: isMobile ? 'short' : 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [review.reviewedDate, isMobile])
  const ageRange = review.user.ageRange
  const { formatMessage } = useIntl()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isClamped, setIsClamped] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (el) {
      setIsClamped(el.scrollHeight >= COLLAPSED_REVIEW_TEXT_HEIGHT)
    }
  }, [review.text])

  const textAge = formatMessage(
    {
      id: 'pdp.product.reviewsGallery.ageRange',
      defaultMessage: 'Age: {ageRange}',
    },
    { ageRange }
  )
  const textRecommendToFriend = formatMessage(
    {
      id: 'pdp.product.reviewsGallery.recommendToFriend',
      defaultMessage: 'Recommend to Friends: {recommendToFriend}',
    },
    { recommendToFriend: review.recommendToFriend }
  )
  const textReadLess = formatMessage({
    id: 'pdp.product.reviewsGallery.readLess',
    defaultMessage: 'Read Less',
  })
  const textReadMore = formatMessage({
    id: 'pdp.product.reviewsGallery.readMore',
    defaultMessage: 'Read More',
  })

  const handleThumbnailClick = useCallback(
    (idx: number, eventType: string) => {
      sendEvent(eventType)
      setActivePhoto(idx)
    },
    [sendEvent]
  )

  const handleReadMoreClick = useCallback(() => {
    setIsExpanded((v) => {
      if (!v) sendEvent(REVIEWS_IMAGE_CONTAINER_EVENTS.READ_MORE_CLICK)
      return !v
    })
  }, [sendEvent])

  const response = review?.responses?.[0]

  return (
    <Box sx={styles.reviewGrid}>
      <Box sx={styles.reviewPhoto}>
        <Image
          src={review.photos[activePhoto].originalUrl}
          alt={review.photos[activePhoto].caption}
        />
        {review.photos.length > 1 && (
          <Flex sx={styles.photoIndicators} aria-label="Photo position">
            {review.photos.map((_, idx) => (
              <Box
                key={idx}
                data-qa="review_image_swipe"
                sx={idx === activePhoto ? styles.photoIndicatorDotActive : styles.photoIndicatorDot}
                aria-current={idx === activePhoto ? 'true' : undefined}
                onClick={() =>
                  handleThumbnailClick(idx, REVIEWS_IMAGE_CONTAINER_EVENTS.IMAGE_SCROLL)
                }
                role="button"
              />
            ))}
          </Flex>
        )}
      </Box>
      <Box sx={styles.reviewContent}>
        <Box sx={styles.reviewContentInner}>
          <Box sx={styles.reviewTopSection}>
            <Box sx={styles.ratingStars}>
              <RatingStars starCount={review.rating} variant="small" />
            </Box>

            <Box sx={styles.userInfo}>
              <Text sx={styles.userName}>
                {review.user.nickName || `${review.user.firstName} ${review.user.lastName}`}
              </Text>
              <Text>{formattedDate}</Text>
              {ageRange && <Text sx={styles.userAge}>{textAge}</Text>}
            </Box>
          </Box>

          <Text sx={styles.reviewTitle}>{review.title}</Text>

          {review.incentivized && <ReviewIncentivizedDetail styles={styles.incentivizedBadge} />}

          <Text
            ref={textRef}
            sx={{
              ...styles.reviewText,
              ...(!isExpanded && isMobile && styles.reviewTextCollapsed),
            }}
          >
            {review.text}
          </Text>

          {response && (
            <Box sx={styles.responseContainer}>
              <Text sx={styles.responseUserInfo}>
                {response?.user.nickName ||
                  (response?.user.firstName
                    ? `${response?.user.firstName} ${response?.user.lastName || ''}`
                    : '')}
              </Text>
              <Text sx={styles.responseText}>{response.text}</Text>
            </Box>
          )}

          {review.recommendToFriend && (!isMobile || !isClamped || isExpanded) && (
            <Text sx={styles.recommendToFriend}>{textRecommendToFriend}</Text>
          )}

          {(!isMobile || isExpanded || !isClamped) && (
            <ReviewVoteButtons review={review} productDataId={productDataId} styles={styles} />
          )}
          {isClamped && (
            <Text
              as="button"
              data-qa="read_more_cta"
              sx={styles.readMoreButton}
              onClick={handleReadMoreClick}
            >
              {isExpanded ? textReadLess : textReadMore}{' '}
              <NavChevronDownIcon
                width="16px"
                height="16px"
                style={isExpanded ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' }}
              />
            </Text>
          )}
        </Box>

        <SplideSlider
          options={{
            gap: 'var(--spacing-2)',
            pagination: false,
            arrows: false,
            drag: 'free',
            snap: false,
            autoWidth: true,
            autoHeight: true,
          }}
          className="carouselThumbnails"
          styles={{ container: styles.carouselThumbnails }}
          onMove={() => sendEvent(REVIEWS_IMAGE_CONTAINER_EVENTS.IMAGE_SCROLL)}
        >
          {review.photos.map((photo, idx) => (
            <Box
              key={`thumb-${idx}`}
              data-qa="review_image_conatiner"
              sx={{
                ...styles.carouselThumbnail,
                ...(idx === activePhoto ? styles.activeCarouselThumbnail : {}),
              }}
              onClick={() => handleThumbnailClick(idx, REVIEWS_IMAGE_CONTAINER_EVENTS.IMAGE_CLICK)}
            >
              <Image
                src={photo.thumbnailUrl}
                alt={photo.caption}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
          ))}
        </SplideSlider>
      </Box>
    </Box>
  )
}

export default ReviewContent
