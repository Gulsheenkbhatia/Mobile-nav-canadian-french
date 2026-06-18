import { render, screen } from 'test-utils/react'
import ReviewSummary from './ReviewSummary'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference_new'
import { useInView } from 'react-intersection-observer'

jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useSelectedVariantData', () => jest.fn(() => 'test-product-123'))
jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(() => ({ ref: jest.fn() })),
}))

const mockUseAnalytics = jest.mocked(useAnalytics)
const mockUsePreference = jest.mocked(usePreference)
const mockUseInView = jest.mocked(useInView)

const mockStyles = {
  reviewSummaryContainer: {},
  reviewSummaryTitle: {},
  reviewSummaryContent: {},
  reviewSummaryHintContainer: {},
  reviewSummaryHintIcon: {},
  reviewSummaryHintText: {},
}

describe('ReviewSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAnalytics.mockReturnValue({ send: jest.fn() })
    mockUsePreference.mockReturnValue({
      toggleSiteFeatures: { enableAiSummaryReview: true },
    })
  })

  it('renders summary text when provided', () => {
    const summaryText = 'This product is highly rated by customers for its quality and comfort.'

    render(<ReviewSummary styles={mockStyles} summary={summaryText} />)

    expect(screen.getByText('What our customers think:')).toBeVisible()
    expect(screen.getByText(summaryText)).toBeVisible()
    expect(screen.getByText('Buyer highlights, summarized by AI')).toBeVisible()
  })

  it.each([undefined, ''])('renders nothing when summary is %s', (summary) => {
    render(<ReviewSummary styles={mockStyles} summary={summary} />)

    expect(screen.queryByText('What our customers think:')).not.toBeInTheDocument()
  })

  it('renders nothing when enableAiSummaryReview is false', () => {
    mockUsePreference.mockReturnValue({
      toggleSiteFeatures: { enableAiSummaryReview: false },
    })

    render(<ReviewSummary styles={mockStyles} summary="Test summary" />)

    expect(screen.queryByText('What our customers think:')).not.toBeInTheDocument()
  })

  it('sends analytics impression when summary comes into viewport', () => {
    const mockSend = jest.fn()
    let onChangeCallback: (inView: boolean, entry: IntersectionObserverEntry) => void = () => {}

    mockUseAnalytics.mockReturnValue({ send: mockSend })
    mockUseInView.mockImplementation((options: Parameters<typeof useInView>[0]) => {
      if (options && options.onChange) {
        onChangeCallback = options.onChange
      }
      return { ref: jest.fn() } as unknown as ReturnType<typeof useInView>
    })

    render(<ReviewSummary styles={mockStyles} summary="Test summary" />)

    onChangeCallback(true, {} as IntersectionObserverEntry)

    expect(mockSend).toHaveBeenCalledWith('reviewInteraction', {
      eventLocation: 'product',
      eventAction: 'ai summary impression',
      eventLabel: 'test-product-123',
    })
  })
})
