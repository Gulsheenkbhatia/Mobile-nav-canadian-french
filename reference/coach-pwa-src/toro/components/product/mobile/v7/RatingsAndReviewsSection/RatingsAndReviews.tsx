import React, { useEffect } from 'react'
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
import { isReviewModalOpenedAtom, reviewSectionNodeAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import ReviewList from 'toro/components/product/mobile/v7/RatingsAndReviewsSection/ReviewList'
import useReviewSectionHandle from 'toro/hooks/useReviewSectionHandle'
import useRatingsAndReviews from 'toro/hooks/useRatingsAndReviews'

type RatingsAndReviewsProps = {
  modelID?: string
  productId?: string
  siteId?: string
  sizingRange?: number
  setSizingRange?: (range: number) => void
  widthRange?: number
  setWidthRange?: (range: number) => void
  productData?: any
  reviewsData?: any
  variant?: string
  hideWriteReviewCta?: boolean
}

function RatingsAndReviews({
  modelID = '',
  productId = '',
  siteId,
  sizingRange,
  setSizingRange,
  widthRange,
  setWidthRange,
  productData = {},
  reviewsData,
  variant,
  hideWriteReviewCta = false,
}: RatingsAndReviewsProps): JSX.Element {
  const isReviewModalOpened = useAtomValue(isReviewModalOpenedAtom)
  const styles = useMultiStyleConfig('RatingsAndReviews')
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
    ratingsAndReviewsData,
  }

  return (
    <>
      <ReviewList
        isModalContent={false}
        variant={variant}
        {...reviewListProps}
        hideWriteReviewCta={hideWriteReviewCta}
      />
      <Modal
        autoFocus={false}
        scrollBehavior="inside"
        isOpen={isReviewModalOpened}
        onClose={reviews.closeModal}
      >
        <ModalOverlay sx={styles.modalReviewOverlay} />
        <ModalContent sx={styles.reviewModalContent}>
          <ModalBody sx={styles.reviewModalBody}>
            <ModalHeader zIndex={zIndex?.toast} sx={styles.reviewModalHeader}>
              <ModalCloseButton size="md" sx={styles.reviewModalCloseButton} />
            </ModalHeader>
            <ReviewList isModalContent={true} {...reviewListProps} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default RatingsAndReviews
