import { render, screen, fireEvent, waitFor, act } from 'test-utils/react'
import ReviewIncentivizedDetail from './ReviewIncentivizedDetail'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useSelectedVariantData')

const mockUsePreference = jest.mocked(usePreference)
const mockedUseViewportType = jest.mocked(useViewportType)
const mockedUseAnalytics = jest.mocked(useAnalytics)
const mockedUseSelectedVariantData = jest.mocked(useSelectedVariantData)

jest.mock('toro/icons/Info.svg', () => {
  const MockInfoIcon = (props) => <svg {...props} data-qa="info-icon" />
  return MockInfoIcon
})

describe('ReviewIncentivizedDetail', () => {
  const styles = { color: 'red' }
  const mockSend = jest.fn()
  const renderOptions = {
    userSetupOptions: {
      advanceTimers: jest.advanceTimersByTime,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockedUseViewportType.mockReturnValue({ isMobile: false })
    mockedUseAnalytics.mockReturnValue({ send: mockSend })
    mockedUseSelectedVariantData.mockReturnValue('test-variant-123')
    mockUsePreference.mockReturnValue({
      toggleSiteFeatures: { enableIncentivizedBadge: true },
    })
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  test('renders the incentivized label and icon', () => {
    render(<ReviewIncentivizedDetail styles={styles} />)

    expect(screen.getByText('Incentivized')).toBeVisible()
    expect(screen.getByTestId('incentivized-review-icon')).toBeVisible()
  })

  test('renders nothing when enableIncentivizedBadge is false', () => {
    mockUsePreference.mockReturnValue({
      toggleSiteFeatures: { enableIncentivizedBadge: false },
    })

    render(<ReviewIncentivizedDetail styles={styles} />)

    expect(screen.queryByText('Incentivized')).not.toBeInTheDocument()
    expect(screen.queryByTestId('incentivized-review-icon')).not.toBeInTheDocument()
  })

  test('opens popover on hover on desktop', async () => {
    const { user } = render(<ReviewIncentivizedDetail styles={styles} />, renderOptions)
    const icon = screen.getByTestId('incentivized-review-icon')

    await user.hover(icon)

    await waitFor(() => {
      expect(screen.getByTestId('incentivized-review-content')).toBeVisible()
    })
    expect(screen.getByTestId('incentivized-review-body-text')).toHaveTextContent(
      'This reviewer received promo considerations or sweepstakes entry for writing a review.'
    )
  })

  test('does not open popover on hover on mobile', async () => {
    mockedUseViewportType.mockReturnValue({ isMobile: true })
    const { user } = render(<ReviewIncentivizedDetail styles={styles} />, renderOptions)
    const icon = screen.getByTestId('incentivized-review-icon')

    await user.hover(icon)

    const content = screen.queryByTestId('incentivized-review-content')
    if (content) {
      expect(content).not.toBeVisible()
    } else {
      expect(content).not.toBeInTheDocument()
    }
  })

  test('toggles popover on click on mobile', async () => {
    mockedUseViewportType.mockReturnValue({ isMobile: true })
    const { user } = render(<ReviewIncentivizedDetail styles={styles} />, renderOptions)
    const icon = screen.getByTestId('incentivized-review-icon')

    await user.click(icon)
    await waitFor(() => {
      expect(screen.getByTestId('incentivized-review-content')).toBeInTheDocument()
    })
    expect(icon).toHaveAttribute('aria-expanded', 'true')

    await user.click(icon)
    await waitFor(() => {
      expect(icon).toHaveAttribute('aria-expanded', 'false')
    })
  })

  test('closes popover when clicking the "Got it!" button', async () => {
    const { user } = render(<ReviewIncentivizedDetail styles={styles} />, renderOptions)
    const icon = screen.getByTestId('incentivized-review-icon')

    await user.hover(icon)

    await waitFor(() => {
      expect(screen.getByTestId('incentivized-review-content')).toBeInTheDocument()
    })

    const closeButton = screen.getByTestId('incentivized-review-body-button')
    await user.click(closeButton)

    await waitFor(() => {
      expect(icon).toHaveAttribute('aria-expanded', 'false')
    })
  })

  test('handles keyboard interactions on the icon', async () => {
    mockedUseViewportType.mockReturnValue({ isMobile: true })
    const { user } = render(<ReviewIncentivizedDetail styles={styles} />, renderOptions)
    const icon = screen.getByTestId('incentivized-review-icon')

    icon.focus()
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByTestId('incentivized-review-content')).toBeInTheDocument()
    })

    await user.keyboard(' ')

    await waitFor(() => {
      expect(icon).toHaveAttribute('aria-expanded', 'false')
    })
  })

  test('closes popover on scroll', async () => {
    render(<ReviewIncentivizedDetail styles={styles} />)
    const icon = screen.getByTestId('incentivized-review-icon')

    fireEvent.mouseEnter(icon)

    await waitFor(() => {
      expect(screen.getByTestId('incentivized-review-content')).toBeInTheDocument()
    })

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(icon).toHaveAttribute('aria-expanded', 'false')
    })
  })

  test('sends analytics event after 1 second delay on desktop hover', async () => {
    const { user } = render(<ReviewIncentivizedDetail styles={styles} />, renderOptions)
    const icon = screen.getByTestId('incentivized-review-icon')

    await user.hover(icon)

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledWith('reviewInteraction', {
      eventLocation: 'product',
      eventAction: 'incentivized badge click',
      eventLabel: 'test-variant-123',
    })
  })

  test('sends analytics event on mobile click', async () => {
    mockedUseViewportType.mockReturnValue({ isMobile: true })
    const { user } = render(<ReviewIncentivizedDetail styles={styles} />, renderOptions)
    const icon = screen.getByTestId('incentivized-review-icon')

    await user.click(icon)

    await waitFor(() => {
      expect(screen.getByTestId('incentivized-review-content')).toBeInTheDocument()
    })

    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledWith('reviewInteraction', {
      eventLocation: 'product',
      eventAction: 'incentivized badge click',
      eventLabel: 'test-variant-123',
    })
  })

  test('does not send analytics event when panel is already open', async () => {
    const { user } = render(<ReviewIncentivizedDetail styles={styles} />, renderOptions)
    const icon = screen.getByTestId('incentivized-review-icon')

    await user.hover(icon)

    await waitFor(() => {
      expect(screen.getByTestId('incentivized-review-content')).toBeInTheDocument()
    })

    act(() => {
      jest.advanceTimersByTime(1500)
    })

    expect(mockSend).toHaveBeenCalledTimes(1)
    mockSend.mockClear()
    await user.hover(icon)

    expect(mockSend).not.toHaveBeenCalled()
  })

  test('cancels analytics event if mouse leaves before delay completes', async () => {
    const { user } = render(<ReviewIncentivizedDetail styles={styles} />, renderOptions)
    const icon = screen.getByTestId('incentivized-review-icon')

    await user.hover(icon)

    await waitFor(() => {
      expect(screen.getByTestId('incentivized-review-content')).toBeInTheDocument()
    })

    expect(mockSend).not.toHaveBeenCalled()

    fireEvent.mouseLeave(icon)

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(mockSend).not.toHaveBeenCalled()
  })
})
