import React from 'react'
import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'

import ReviewCarouselModal from './ReviewCarouselModal'
import useReviewsImageContainerAnalytics, {
  REVIEWS_IMAGE_CONTAINER_EVENTS,
} from 'toro/analytics/useReviewsImageContainerAnalytics'

jest.mock('toro/analytics/useReviewsImageContainerAnalytics')
jest.mock('./ReviewContent', () => () => <div data-qa="mock-review-content" />)
jest.mock('toro/components/SplideSlider', () => {
  return function MockSplideSlider({ children, onMove }: any) {
    return (
      <div data-qa="mock-splide" onClick={() => onMove?.(null, 1, 0, 1)}>
        {children}
      </div>
    )
  }
})

jest.mock('toro/components/product/EmplifiPhotoGallery/theme', () => ({
  COLLAPSED_REVIEW_TEXT_HEIGHT: 0,
  DESKTOP_SLIDE_WIDTH: '500px',
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

const mockUseReviewsImageContainerAnalytics = jest.mocked(useReviewsImageContainerAnalytics)

describe('ReviewCarouselModal', () => {
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

  const styles = {
    carouselModal: {},
    carouselCloseButton: {},
    carouselContainer: {},
    carouselItem: {},
    arrows: {},
    carouselArrows: {},
  } as any

  const renderComponent = (
    overrideProps: Partial<React.ComponentProps<typeof ReviewCarouselModal>> = {}
  ) => {
    mockUseReviewsImageContainerAnalytics.mockReturnValue({ sendEvent } as any)

    return render(
      <ReviewCarouselModal
        isOpen
        onClose={jest.fn()}
        reviews={[baseReview]}
        initialIndex={0}
        styles={styles}
        productDataId="product-123"
        {...overrideProps}
      />
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal when open', () => {
    renderComponent()

    expect(screen.getByTestId('review_close_gallery')).toBeInTheDocument()
  })

  it('emits scroll analytics when carousel slides forward', async () => {
    const { getAllByTestId } = renderComponent()
    const sliders = getAllByTestId('mock-splide')
    const mainCarousel = sliders[0]

    await userEvent.click(mainCarousel)

    expect(sendEvent).toHaveBeenCalledWith(REVIEWS_IMAGE_CONTAINER_EVENTS.REVIEWS_SCROLL)
  })

  it('passes initial index to carousel', () => {
    renderComponent({ initialIndex: 2 })

    expect(screen.getByTestId('mock-splide')).toBeInTheDocument()
  })
})
