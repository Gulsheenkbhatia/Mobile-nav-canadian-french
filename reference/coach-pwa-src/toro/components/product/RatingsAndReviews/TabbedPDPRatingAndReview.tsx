import { useEffect } from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalBody from 'toro/components/ModalBody'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import usePreference from 'toro/hooks/usePreference_new'
import ModalHeader from 'toro/components/ModalHeader'
import useTheme from 'toro/hooks/useTheme'
import { useRouter } from 'next/router'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PropTypes from 'prop-types'
import { isReviewModalOpenedAtom, reviewSectionNodeAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import ReviewList from 'toro/components/product/RatingsAndReviews/ReviewsList/ReviewList'
import TabbedReviewList from 'toro/components/product/RatingsAndReviews/ReviewsList/TabbedReviewList'
import useReviewSectionHandle from 'toro/hooks/useReviewSectionHandle'
import useRatingsAndReviews from 'toro/hooks/useRatingsAndReviews'

function TabbedPDPRatingAndReview({
  modelID,
  siteId,
  productId,
  sizingRange,
  setSizingRange,
  widthRange,
  setWidthRange,
  productData,
  reviewsData,
  variant,
  isActive = true,
}) {
  const isReviewModalOpened = useAtomValue(isReviewModalOpenedAtom)
  const styles = useMultiStyleConfig('RatingsAndReviews', { variant })
  const reviews = useReviewSectionHandle()
  const reviewSectionNode = useAtomValue(reviewSectionNodeAtom)
  const theme = useTheme()
  const { zIndex } = theme

  const {
    powerReviews: { enableEmplifi = false },
  } = usePreference({
    powerReviews: ['enableEmplifi'],
  })

  const router = useRouter()
  const scrollToReview = router.query?.scrollToReview

  useEffect(() => {
    if (reviewSectionNode && scrollToReview) {
      reviews.onMount()
    }
  }, [reviewSectionNode])

  const ratingsAndReviewsData = useRatingsAndReviews({
    sizingRange,
    widthRange,
    modelID,
    productData,
    reviewsData,
    setSizingRange,
    setWidthRange,
  })
  const reviewListProps = {
    isSiteParamsAvailable: enableEmplifi,
    sizingRange,
    widthRange,
    productId,
    siteId,
    modelID,
    productData,
    reviewsData,
    setSizingRange,
    setWidthRange,
    variant,
    ratingsAndReviewsData,
  }

  return (
    <>
      <TabbedReviewList {...reviewListProps} isActive={isActive} />
      <Modal
        autoFocus={false}
        scrollBehavior="inside"
        isOpen={isReviewModalOpened}
        onClose={reviews.closeModal}
      >
        <ModalOverlay sx={styles.modalReviewOverlay} />
        <ModalContent height="100vh" sx={styles.reviewModalContent} minWidth="100%">
          <ModalBody minHeight="100vh" sx={styles.reviewModalBody}>
            <ModalHeader zIndex={zIndex?.toast} sx={styles.reviewModalHeader}>
              <ModalCloseButton size="md" sx={styles.reviewModalCloseButton} />
            </ModalHeader>
            <ReviewList isModalContent={true} {...reviewListProps} isTabbedReview={true} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

TabbedPDPRatingAndReview.propTypes = {
  modelID: PropTypes.string,
  siteId: PropTypes.string,
  productId: PropTypes.string,
  sizingRange: PropTypes.number,
  setSizingRange: PropTypes.func,
  widthRange: PropTypes.number,
  setWidthRange: PropTypes.func,
  productData: PropTypes.object,
}

TabbedPDPRatingAndReview.defaultProps = {
  modelID: '',
  siteId: '',
  productId: '',
  productData: {},
}

export default TabbedPDPRatingAndReview
