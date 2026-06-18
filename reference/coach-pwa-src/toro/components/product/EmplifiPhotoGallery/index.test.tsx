import React from 'react'
import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import { mockIntersectionObserver } from 'test-utils/mock-utils'

import EmplifiPhotoGallery from './index'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false }))
jest.mock('toro/hooks/useMultiStyleConfig', () => () => ({
  container: {},
  divider: {},
  header: {},
  title: {},
  viewAllButton: {},
  photoContainer: {},
  arrows: {},
}))
jest.mock('toro/hooks/useTemplate', () => () => false)
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useSelectedVariantData')
jest.mock('toro/components/SplideSlider', () => {
  return function MockSplideSlider({ children, onMove }: any) {
    return (
      <div data-qa="mock-splide" onClick={() => onMove?.(null, 1)}>
        {children}
      </div>
    )
  }
})
jest.mock('toro/components/product/EmplifiPhotoGallery/PhotoGalleryModal', () => (props: any) => (
  <div data-qa="mock-photo-gallery-modal" data-is-open={props.isOpen} />
))
jest.mock('toro/components/product/EmplifiPhotoGallery/ReviewCarouselModal', () => (props: any) => (
  <div
    data-qa="mock-review-carousel-modal"
    data-is-open={props.isOpen}
    data-initial-index={props.initialIndex}
  />
))
jest.mock('toro/components/Image', () => {
  return function MockImage(props: any) {
    return <img data-qa={props['data-qa']} alt={props.alt} src={props.src} />
  }
})

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl')
  const intl = actual.createIntl({ locale: 'en' })

  return {
    ...actual,
    useIntl: () => intl,
  }
})

mockIntersectionObserver()

const mockUseAnalytics = jest.mocked(useAnalytics)
const mockUseSelectedVariantData = jest.mocked(useSelectedVariantData)

describe('EmplifiPhotoGallery', () => {
  const send = jest.fn()

  const photos = [
    {
      id: 'review-1',
      photos: [
        {
          id: 'photo-1',
          thumbnailUrl: 'thumb-1.jpg',
          caption: 'Customer photo 1',
        },
      ],
    },
    {
      id: 'review-2',
      photos: [
        {
          id: 'photo-2',
          thumbnailUrl: 'thumb-2.jpg',
          caption: 'Customer photo 2',
        },
      ],
    },
  ] as any

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAnalytics.mockReturnValue({ send } as any)
    mockUseSelectedVariantData.mockReturnValue('variant-1' as any)
  })

  it('returns null when no photos are provided', () => {
    render(<EmplifiPhotoGallery photos={[]} />)

    expect(screen.queryByText('Customer photos')).not.toBeInTheDocument()
  })

  it('renders thumbnails and heading when photos exist', () => {
    render(<EmplifiPhotoGallery photos={photos} />)

    expect(screen.getByText('Customer photos')).toBeInTheDocument()
    expect(screen.getAllByTestId('review_image_thumbnail')).toHaveLength(photos.length)
  })

  it('opens view all modal and sends analytics event when CTA clicked', async () => {
    render(<EmplifiPhotoGallery photos={photos} />)

    const viewAllCta = screen.getByTestId('view_all_cta')
    await userEvent.click(viewAllCta)

    expect(send).toHaveBeenCalledWith(
      'reviewInteraction',
      expect.objectContaining({ eventAction: 'view all click' })
    )
    expect(screen.getByTestId('mock-photo-gallery-modal')).toHaveAttribute('data-is-open', 'true')
  })

  it('opens review carousel modal with selected index and sends click event when thumbnail clicked', async () => {
    render(<EmplifiPhotoGallery photos={photos} />)

    const secondThumbnail = screen.getAllByTestId('review_image_thumbnail')[1]
    await userEvent.click(secondThumbnail)

    expect(send).toHaveBeenCalledWith(
      'reviewInteraction',
      expect.objectContaining({ eventAction: 'image click' })
    )
    expect(screen.getByTestId('mock-review-carousel-modal')).toHaveAttribute('data-is-open', 'true')
    expect(screen.getByTestId('mock-review-carousel-modal')).toHaveAttribute(
      'data-initial-index',
      '1'
    )
  })

  it('sends scroll analytics when gallery is moved on desktop', async () => {
    render(<EmplifiPhotoGallery photos={photos} />)

    const sliders = screen.getAllByTestId('mock-splide')
    const slider = sliders[0]
    await userEvent.click(slider)

    expect(send).toHaveBeenCalledWith(
      'reviewInteraction',
      expect.objectContaining({ eventAction: 'image scroll' })
    )
  })
})
