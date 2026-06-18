import { useContext, useCallback, useEffect, useMemo } from 'react'
import PWAContext from 'components/common/PWAContext'
import RatingStars from 'toro/components/product/RatingsAndReviews/RatingStars'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import {
  subBrandSuffixAtom,
  setReviewModalOpenedAtom,
  isTabbedAdaptivePDPEligibleAtom,
  isFirstViewedAtom,
  productDataAtom,
} from 'store/pdp.atom'
import CloseIcon from 'toro/components/ReviewOverlayOnImage/icon/close-icon-white.svg'
import formatDate from 'toro/helpers/formatDate'
import useDisclosure from 'toro/hooks/useDisclosure'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import { FullStarIcon } from 'toro/icons'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { getTotalReviews } from 'toro/helpers/getReviewData'

const ReviewOverlayOnImage = ({
  setIsReviewClosed,
  selectedVariantId,
  pdpReviewsData,
  reviewsAvgRating,
}) => {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const { appData } = useContext(PWAContext)
  const locale = get(appData, 'locale')
  const setReviewModalOpened = useUpdateAtom(setReviewModalOpenedAtom)
  const subBrandSuffix = useAtomValue(subBrandSuffixAtom)
  const isFirstPDPView = useAtomValue(isFirstViewedAtom)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isMobile } = useViewportType()
  const isReviewsImageOverlayExperimentUpper =
    useExperiment(EXPERIMENTS.PDP_REVIEWS_OVERLAY_IMAGE_UPPER) && isMobile
  const { details: { nickname, headline, comments, created_date } = {}, metrics: { rating } = {} } =
    get(pdpReviewsData, '[0]', {})
  const styles = useMultiStyleConfig('ReviewOverlayOnImageStyles', {
    variant: isReviewsImageOverlayExperimentUpper && 'reviewOverlayOnImageUpper',
  })
  const { isTransparentStickyHeader } = useHeaderPositionPref()
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)

  const productData = useAtomValue(productDataAtom)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  const {
    adaptiveExperience: { reviewOverlayStyle },
  } = usePreferenceNew({
    adaptiveExperience: ['reviewOverlayStyle'],
  })

  function handleAnalyticsEvent(eventAction) {
    analytics.send('reviewInteraction', {
      eventAction: `view all reviews alt image ${eventAction}`,
      eventLocation: 'product image',
      eventPageLocation: 'product',
      eventLabel: selectedVariantId,
    })
  }

  const handleClick = useCallback(() => {
    handleAnalyticsEvent('click')
    setReviewModalOpened(true)
  }, [])
  useEffect(() => {
    onOpen()
  }, [])

  function handleCloseClick(event) {
    event.stopPropagation()
    handleAnalyticsEvent('close')
    onClose()
    setIsReviewClosed?.(true)
  }

  useEffect(() => {
    handleAnalyticsEvent('impression')
  }, [])

  const headerHeight = useHeaderHeight()

  const topPosition = useMemo(
    () => (isTransparentStickyHeader || isTabbedAdaptivePDPEligible ? headerHeight : 0),
    [isTransparentStickyHeader, isTabbedAdaptivePDPEligible, headerHeight]
  )

  const showNumberOfReviews = get(
    reviewOverlayStyle,
    `${isSubBrandActive ? 'subBrand' : 'brand'}.show_number_of_reviews`,
    false
  )

  const suppressSecondVisit = get(
    reviewOverlayStyle,
    `${isSubBrandActive ? 'subBrand' : 'brand'}.suppressSecondVisit`,
    false
  )

  const totalReviews = getTotalReviews(productData)
  const hasReviews = pdpReviewsData?.length > 1

  if (suppressSecondVisit && !isFirstPDPView) {
    return
  }

  if (isReviewsImageOverlayExperimentUpper) {
    return (
      <Flex
        display={isOpen ? 'flex' : 'none'}
        sx={styles.reviewOverlayContainer(topPosition)}
        data-qa="review-overlay-container-upper"
        onClick={handleClick}
      >
        <Text sx={styles.reviewOverlayTitle}>
          {formatMessage({
            id: 'pdp.reviewsOverlay.title',
            defaultMessage: 'in your words...',
          })}
        </Text>
        <Text sx={styles.reviewOverlayComment}>“{comments}”</Text>
        <Flex sx={styles.reviewOverlayRatingContainer}>
          <Flex sx={styles.reviewOverlayAverageRating}>
            <FullStarIcon viewBox="0 0 16 16" />
            <Text sx={styles.reviewOverlayRating}>{reviewsAvgRating?.toFixed(1)}</Text>
          </Flex>
          {hasReviews && (
            <Button variant="link" sx={styles.reviewOverlayViewAllLink}>
              {showNumberOfReviews && totalReviews ? `${totalReviews} reviews` : 'View Reviews'}
            </Button>
          )}
        </Flex>
        <Button
          variant="icon-only"
          size="content"
          sx={styles.reviewOverlayCloseButton}
          onClick={handleCloseClick}
        >
          <CloseIcon viewBox="0 0 16 16" />
        </Button>
      </Flex>
    )
  }

  return (
    <Flex
      display={isOpen ? 'flex' : 'none'}
      sx={styles.reviewOverlayContainer()}
      data-qa="review-overlay-container-lower"
    >
      <Flex sx={styles.reviewOverlayTitleContainer}>
        <Text sx={styles.reviewOverlayTitle}>
          {formatMessage({
            id: `pdp.navlink.reviews${subBrandSuffix}`,
            defaultMessage: 'Reviews',
          }).toLowerCase()}
        </Text>
        <Button variant="icon-only" size="content">
          <CloseIcon height="32px" width="32px" viewBox="0 -2 26 26" onClick={handleCloseClick} />
        </Button>
      </Flex>
      <Flex sx={styles.reviewOverlayNameAndRatingContainer}>
        <Box sx={styles.reviewOverlayNameText}>
          {nickname
            ? `${nickname}, ${formatDate(created_date, locale)}`
            : formatDate(created_date, locale)}
        </Box>
        <RatingStars
          justify="flex-start"
          variant="small"
          starCount={rating}
          reviewImgOverlay
          containerMarginLeft="0"
        />
      </Flex>
      <Box sx={styles.reviewOverlayHeadline}>{headline}</Box>
      <Box sx={styles.reviewOverlayComment}>{comments}</Box>
      {hasReviews && (
        <Button variant={'secondary'} onClick={handleClick} sx={styles.reviewOverlayButton}>
          {formatMessage({
            id: 'pdp.product.viewAllReview',
            defaultMessage: 'View All Reviews',
          })}
        </Button>
      )}
    </Flex>
  )
}

export default ReviewOverlayOnImage
