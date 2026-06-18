import React from 'react'
import { render, screen, waitFor } from 'test-utils/react'

import ReviewVoteButtons from './ReviewVoteButtons'
import { VOTE_TYPE } from 'toro/helpers/emplifiNormalizers'
import { voteEmplifiReview } from 'toro/helpers/fetchEmplifiReviews'
import useReviewsImageContainerAnalytics, {
  REVIEWS_IMAGE_CONTAINER_EVENTS,
} from 'toro/analytics/useReviewsImageContainerAnalytics'

jest.mock('toro/helpers/fetchEmplifiReviews')
jest.mock('toro/analytics/useReviewsImageContainerAnalytics')

const mockVoteEmplifiReview = jest.mocked(voteEmplifiReview)
const mockUseReviewsImageContainerAnalytics = jest.mocked(useReviewsImageContainerAnalytics)

describe('ReviewVoteButtons', () => {
  const sendEvent = jest.fn()

  const defaultReview = {
    id: 1,
    upVotes: 3,
    downVotes: 1,
  }

  const defaultStyles = {
    helpfulVotes: {},
    thumbsContainer: {},
  } as any

  const renderComponent = (
    overrideProps: Partial<React.ComponentProps<typeof ReviewVoteButtons>> = {}
  ) => {
    return render(
      <ReviewVoteButtons
        review={defaultReview}
        productDataId="product-123"
        styles={defaultStyles}
        {...overrideProps}
      />
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseReviewsImageContainerAnalytics.mockReturnValue({
      sendEvent,
    } as any)
  })

  describe('rendering', () => {
    it('renders initial vote counts and question text', () => {
      renderComponent()

      expect(screen.getByText('Was this review helpful?')).toBeInTheDocument()
      expect(screen.getByLabelText('Helpful, 3 votes')).toBeInTheDocument()
      expect(screen.getByLabelText('Not helpful, 1 votes')).toBeInTheDocument()
    })
  })

  describe('voting interactions', () => {
    it('increments up vote count and disables further voting after successful helpful vote', async () => {
      mockVoteEmplifiReview.mockResolvedValue({ result: 'SUCCESS' } as any)

      const { user } = renderComponent()

      await user.click(screen.getByTestId('review_image_thumbs_up'))

      await waitFor(() => {
        expect(mockVoteEmplifiReview).toHaveBeenCalledWith(
          String(defaultReview.id),
          VOTE_TYPE.helpful
        )
      })

      expect(sendEvent).toHaveBeenCalledWith(REVIEWS_IMAGE_CONTAINER_EVENTS.LIKE_REVIEW)

      await waitFor(() => {
        expect(screen.getByLabelText('Helpful, 4 votes')).toBeInTheDocument()
      })

      expect(screen.getByTestId('review_image_thumbs_up')).toHaveAttribute('tabindex', '-1')

      await user.click(screen.getByTestId('review_image_thumbs_up'))
      expect(mockVoteEmplifiReview).toHaveBeenCalledTimes(1)
    })

    it('increments down vote count and disables further voting after successful unhelpful vote', async () => {
      mockVoteEmplifiReview.mockResolvedValue({ result: 'SUCCESS' } as any)

      const { user } = renderComponent()

      await user.click(screen.getByTestId('review_image_thumbs_down'))

      await waitFor(() => {
        expect(mockVoteEmplifiReview).toHaveBeenCalledWith(
          String(defaultReview.id),
          VOTE_TYPE.unhelpful
        )
      })

      expect(sendEvent).toHaveBeenCalledWith(REVIEWS_IMAGE_CONTAINER_EVENTS.DISLIKE_REVIEW)

      await waitFor(() => {
        expect(screen.getByLabelText('Not helpful, 2 votes')).toBeInTheDocument()
      })

      expect(screen.getByTestId('review_image_thumbs_down')).toHaveAttribute('tabindex', '-1')

      await user.click(screen.getByTestId('review_image_thumbs_down'))
      expect(mockVoteEmplifiReview).toHaveBeenCalledTimes(1)
    })

    it('does not update counts when vote API returns non-success and allows retry', async () => {
      mockVoteEmplifiReview.mockResolvedValue({} as any)

      const { user } = renderComponent()

      await user.click(screen.getByTestId('review_image_thumbs_up'))

      await waitFor(() => {
        expect(mockVoteEmplifiReview).toHaveBeenCalledTimes(1)
      })

      expect(screen.getByLabelText('Helpful, 3 votes')).toBeInTheDocument()
      expect(screen.getByTestId('review_image_thumbs_up')).toHaveAttribute('tabindex', '0')

      mockVoteEmplifiReview.mockResolvedValue({ result: 'SUCCESS' } as any)

      await user.click(screen.getByTestId('review_image_thumbs_up'))

      await waitFor(() => {
        expect(mockVoteEmplifiReview).toHaveBeenCalledTimes(2)
        expect(screen.getByLabelText('Helpful, 4 votes')).toBeInTheDocument()
      })
    })
  })

  describe('keyboard accessibility', () => {
    it('triggers helpful vote on Enter key when enabled', async () => {
      mockVoteEmplifiReview.mockResolvedValue({ result: 'SUCCESS' } as any)
      const { user } = renderComponent()

      const thumbsUp = screen.getByTestId('review_image_thumbs_up')
      thumbsUp.focus()
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockVoteEmplifiReview).toHaveBeenCalledWith(
          String(defaultReview.id),
          VOTE_TYPE.helpful
        )
      })
    })
  })
})
