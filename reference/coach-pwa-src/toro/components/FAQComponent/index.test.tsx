import React from 'react'
import { render, screen, fireEvent, waitFor } from 'test-utils/react'
import FAQComponent from './index'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import useTemplate from 'toro/hooks/useTemplate'
import useViewportType from 'toro/hooks/useViewportType'
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils'

// Mock dependencies
jest.mock('react-intl', () => {
  const original = jest.requireActual('react-intl')
  return {
    ...original,
    useIntl: () => ({
      formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
    }),
    createIntl: jest.fn(),
    createIntlCache: jest.fn(),
  }
})

jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useProductData')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useTemplate')

// We need to mock useViewportType because it's used by HtmlContent which is used by FAQComponent
jest.mock('toro/hooks/useViewportType', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ isDesktop: true, viewport: 'desktop' }),
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}))

describe('FAQComponent', () => {
  beforeAll(() => {
    // Mock window.scrollTo to avoid JSDOM "Not implemented" error from framer-motion/Chakra
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true })
  })

  const mockAnalytics = {
    send: jest.fn(),
  }

  const mockFaqData = [
    { title: 'Question 1', html: '<p>Answer 1</p>' },
    { title: 'Question 2', html: '<p>Answer 2</p>' },
  ]

  const renderOptions = {
    contexts: {
      PWAContext: {
        injectJquery: jest.fn(),
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAnalytics as jest.Mock).mockReturnValue(mockAnalytics)
    ;(useProductData as jest.Mock).mockReturnValue(mockFaqData)
    ;(usePreferenceNew as jest.Mock).mockReturnValue({
      toggleSiteFeatures: { enableFaqAccordions: true },
      coachtopia: { coachtopiaHomeURL: '/shop/coachtopia' },
      storefrontConfigs: { headerScrollingUpTo: 100 },
    })
    ;(useTemplate as jest.Mock).mockReturnValue(false)
    // Reset viewport to desktop default
    ;(useViewportType as jest.Mock).mockReturnValue({ isDesktop: true, viewport: 'desktop' })
  })

  it('should render correctly when enabled and data is present', async () => {
    render(<FAQComponent />, renderOptions)
    mockAllIsIntersecting(true)
    expect(await screen.findByText('Customer FAQs')).toBeInTheDocument()
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    // Content is initially hidden in accordion
    expect(screen.queryByText('Answer 1')).not.toBeVisible()
  })

  it('should return null if enableFaqAccordions is false', () => {
    ;(usePreferenceNew as jest.Mock).mockReturnValue({
      toggleSiteFeatures: { enableFaqAccordions: false },
    })
    render(<FAQComponent />, renderOptions)
    mockAllIsIntersecting(true)
    expect(screen.queryByText('Customer FAQs')).not.toBeInTheDocument()
  })

  it('should return null if faqItemsWithContent is null', () => {
    ;(useProductData as jest.Mock).mockReturnValue(null)
    render(<FAQComponent />, renderOptions)
    mockAllIsIntersecting(true)
    expect(screen.queryByText('Customer FAQs')).not.toBeInTheDocument()
  })

  it('should return null if faqItemsWithContent is empty', () => {
    ;(useProductData as jest.Mock).mockReturnValue([])
    render(<FAQComponent />, renderOptions)
    mockAllIsIntersecting(true)
    expect(screen.queryByText('Customer FAQs')).not.toBeInTheDocument()
  })

  it('should trigger analytics on visibility', async () => {
    render(<FAQComponent />, renderOptions)

    // Simulate visibility
    mockAllIsIntersecting(true)

    await waitFor(() => {
      expect(mockAnalytics.send).toHaveBeenCalledWith('productInteraction', {
        eventAction: 'faq module impression',
        eventLabel: 'customer faqs',
        eventLocation: 'product',
      })
    })
  })

  it('should trigger analytics on accordion expand', async () => {
    render(<FAQComponent />, renderOptions)
    mockAllIsIntersecting(true)
    const itemButton = await screen.findByText('Question 1')
    fireEvent.click(itemButton)
    expect(mockAnalytics.send).toHaveBeenCalledWith('productInteraction', {
      eventAction: 'faq module click',
      eventLabel: 'customer faqs:question 1',
      eventLocation: 'product',
    })
  })

  it('should NOT trigger analytics on accordion collapse (no new item)', async () => {
    render(<FAQComponent />, renderOptions)
    mockAllIsIntersecting(true)
    // First expand to set previousItemsRef
    const itemButton = await screen.findByText('Question 1')
    fireEvent.click(itemButton)
    mockAnalytics.send.mockClear()

    // Then collapse (click again)
    fireEvent.click(itemButton)

    expect(mockAnalytics.send).not.toHaveBeenCalled()
  })

  it('should handle undefined item in faq items', async () => {
    const incompleteData = [undefined]
    ;(useProductData as jest.Mock).mockReturnValue(incompleteData)
    render(<FAQComponent />, renderOptions)
    mockAllIsIntersecting(true)
    expect(await screen.findByText('Customer FAQs')).toBeInTheDocument()
  })

  it('should render correctly on mobile', async () => {
    ;(useViewportType as jest.Mock).mockReturnValue({ isDesktop: false, viewport: 'mobile' })
    render(<FAQComponent />, renderOptions)
    mockAllIsIntersecting(true)
    expect(await screen.findByText('Customer FAQs')).toBeInTheDocument()
    expect(screen.getByText('Question 1')).toBeInTheDocument()
  })
})
