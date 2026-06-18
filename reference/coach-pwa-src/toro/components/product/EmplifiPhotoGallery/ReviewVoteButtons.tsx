import { useState } from 'react'
import { useIntl } from 'react-intl'
import Flex from 'toro/components/Flex'
import HStack from 'toro/components/Hstack'
import Text from 'toro/components/Text'
import { ThumbDownFilledIcon, ThumbDownIcon, ThumbUpFilledIcon, ThumbUpIcon } from 'toro/icons'
import { VOTE_TYPE } from 'toro/helpers/emplifiNormalizers'
import { voteEmplifiReview } from 'toro/helpers/fetchEmplifiReviews'
import type { NormalizedPhotoReview } from 'toro/helpers/emplifiNormalizers'
import type { SystemStyleObject } from '@chakra-ui/react'
import useReviewsImageContainerAnalytics, {
  REVIEWS_IMAGE_CONTAINER_EVENTS,
} from 'toro/analytics/useReviewsImageContainerAnalytics'

type ReviewVoteButtonsProps = {
  review: Pick<NormalizedPhotoReview, 'id' | 'upVotes' | 'downVotes'>
  productDataId?: string
  styles: Record<string, SystemStyleObject>
}

const ReviewVoteButtons = ({ review, productDataId = '', styles }: ReviewVoteButtonsProps) => {
  const { formatMessage } = useIntl()
  const textWasThisReviewHelpful = formatMessage({
    id: 'pdp.product.reviewsGallery.wasThisReviewHelpful',
    defaultMessage: 'Was this review helpful?',
  })
  const { sendEvent } = useReviewsImageContainerAnalytics(productDataId)
  const [upVote, setUpVote] = useState(review.upVotes)
  const [downVote, setDownVote] = useState(review.downVotes)
  const [upVoteToggle, setUpVoteToggle] = useState(true)
  const [downVoteToggle, setDownVoteToggle] = useState(true)
  const [voted, setVoted] = useState(false)

  const handleVote = async (type: VOTE_TYPE) => {
    if (voted) {
      return
    }
    sendEvent(
      type === VOTE_TYPE.helpful
        ? REVIEWS_IMAGE_CONTAINER_EVENTS.LIKE_REVIEW
        : REVIEWS_IMAGE_CONTAINER_EVENTS.DISLIKE_REVIEW
    )

    const reviewId = String(review.id)
    try {
      const voteReviewResult = await voteEmplifiReview(reviewId, type)
      if (voteReviewResult?.result && voteReviewResult.result === 'SUCCESS') {
        if (type === VOTE_TYPE.helpful) {
          setUpVoteToggle(false)
          setUpVote(upVote + 1)
        } else if (type === VOTE_TYPE.unhelpful) {
          setDownVoteToggle(false)
          setDownVote(downVote + 1)
        }
        setVoted(true)
      }
    } catch {
      if (type === VOTE_TYPE.helpful) {
        setUpVoteToggle(true)
      } else if (type === VOTE_TYPE.unhelpful) {
        setDownVoteToggle(true)
      }
      setVoted(false)
    }
  }

  const handleThumbUpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (upVoteToggle) {
        handleVote(VOTE_TYPE.helpful)
      }
    }
  }

  const handleThumbDownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (downVoteToggle) {
        handleVote(VOTE_TYPE.unhelpful)
      }
    }
  }

  return (
    <Flex sx={styles.helpfulVotes}>
      <Text>{textWasThisReviewHelpful}</Text>
      <HStack sx={styles.thumbsContainer}>
        <HStack
          cursor={upVoteToggle ? 'pointer' : 'default'}
          role="button"
          data-qa="review_image_thumbs_up"
          tabIndex={upVoteToggle ? 0 : -1}
          aria-label={`Helpful, ${upVote} votes`}
          onClick={upVoteToggle ? () => handleVote(VOTE_TYPE.helpful) : undefined}
          onKeyDown={handleThumbUpKeyDown}
        >
          {!upVoteToggle ? (
            <ThumbUpFilledIcon width="16px" height="16px" />
          ) : (
            <ThumbUpIcon width="16px" height="16px" />
          )}
          <Text>{upVote}</Text>
        </HStack>
        <HStack
          cursor={downVoteToggle ? 'pointer' : 'default'}
          role="button"
          data-qa="review_image_thumbs_down"
          tabIndex={downVoteToggle ? 0 : -1}
          aria-label={`Not helpful, ${downVote} votes`}
          onClick={downVoteToggle ? () => handleVote(VOTE_TYPE.unhelpful) : undefined}
          onKeyDown={handleThumbDownKeyDown}
        >
          {!downVoteToggle ? (
            <ThumbDownFilledIcon width="16px" height="16px" />
          ) : (
            <ThumbDownIcon width="16px" height="16px" />
          )}
          <Text>{downVote}</Text>
        </HStack>
      </HStack>
    </Flex>
  )
}

export default ReviewVoteButtons
