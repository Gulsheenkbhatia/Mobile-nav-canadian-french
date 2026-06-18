import React from 'react'
import { render, screen } from 'test-utils/react'

import ReviewContent from './ReviewContent'
import useReviewsImageContainerAnalytics from 'toro/analytics/useReviewsImageContainerAnalytics'

jest.mock('toro/analytics/useReviewsImageContainerAnalytics')
jest.mock('toro/components/product/EmplifiPhotoGallery/ReviewVoteButtons', () => () => (
  <div data-qa="mock-review-vote-buttons" />
))
jest.mock('toro/components/product/RatingsAndReviews/ReviewIncentivizedDetail', () => () => (
  <div data-qa="mock-incentivized" />
))
jest.mock('toro/components/product/RatingsAndReviews/RatingStars', () => () => (
  <div data-qa="mock-rating-stars" />
))
jest.mock('toro/components/SplideSlider', () => {
  return function MockSplideSlider({ children, onMove }: any) {
    return (
      <div data-qa="mock-splide" onClick={() => onMove?.()}>
        {children}
      </div>
    )
  }
})

jest.mock('toro/components/product/EmplifiPhotoGallery/theme', () => ({
  COLLAPSED_REVIEW_TEXT_HEIGHT: 0,
}))

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl')
  const intl = actual.createIntl({ locale: 'en' })

  return {
    ...actual,
    useIntl: () => intl,
  }
})

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: true }))
jest.mock('toro/components/Image', () => {
  return function MockImage(props: any) {
    return <img alt={props.alt} src={props.src} data-qa={props['data-qa']} />
  }
})

const mockUseReviewsImageContainerAnalytics = jest.mocked(useReviewsImageContainerAnalytics)

describe('ReviewContent', () => {
  const sendEvent = jest.fn()

  const baseReview = {
    id: 'review-1',
    title: 'Great bag',
    text: 'Very nice bag',
    reviewedDate: '2024-01-01',
    recommendToFriend: true,
    incentivized: true,
    user: {
      firstName: 'John',
      lastName: 'Doe',
      nickName: '',
      ageRange: '25-34',
    },
    responses: [
      {
        user: { firstName: 'Coach', lastName: 'Team', nickName: '' },
        text: 'Thanks!',
      },
    ],
    photos: [
      { originalUrl: 'photo-1.jpg', thumbnailUrl: 'thumb-1.jpg', caption: 'Photo 1' },
      { originalUrl: 'photo-2.jpg', thumbnailUrl: 'thumb-2.jpg', caption: 'Photo 2' },
    ],
  } as any

  const renderComponent = (
    overrideProps: Partial<React.ComponentProps<typeof ReviewContent>> = {}
  ) => {
    mockUseReviewsImageContainerAnalytics.mockReturnValue({ sendEvent } as any)

    return render(
      <ReviewContent
        review={baseReview}
        styles={{}}
        productDataId="product-123"
        {...overrideProps}
      />
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders main review information and merchant response', () => {
    renderComponent()

    expect(screen.getByText('Great bag')).toBeInTheDocument()
    expect(screen.getByText('Very nice bag')).toBeInTheDocument()
    expect(screen.getByText('Age: 25-34')).toBeInTheDocument()
    expect(screen.getByText('Thanks!')).toBeInTheDocument()
  })
})
