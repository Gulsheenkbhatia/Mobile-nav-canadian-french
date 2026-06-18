import React from 'react'
import { render } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import EmailSignupText from './index'
import useAnalytics from 'toro/analytics/useAnalytics'
import useViewportType from 'toro/hooks/useViewportType'

jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
    }),
  }
})
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/analytics/useCmsAnalytics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onClick: jest.fn(),
  })),
}))
jest.mock('toro/components/HtmlContent', () => ({
  __esModule: true,
  default: ({ content }) => <div dangerouslySetInnerHTML={{ __html: content }} />,
}))

const mockSendAnalyticsEvent = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  useAnalytics.mockReturnValue({ send: mockSendAnalyticsEvent })
  useViewportType.mockReturnValue({ isDesktop: true })
})

describe('EmailSignupText Component', () => {
  test('renders HTML content when html prop is provided', () => {
    const { getByText } = render(
      <EmailSignupText html="<a href='#' data-text='Test'>Test Link</a>" />
    )
    expect(getByText('Test Link')).toBeVisible()
  })

  test('does not render when html prop is not provided', () => {
    const { queryByText } = render(<EmailSignupText html={null} />)
    expect(queryByText('Test Link')).not.toBeInTheDocument()
  })

  test('adds and removes event listeners for links', async () => {
    const user = userEvent.setup()
    const { getByText } = render(
      <EmailSignupText html="<a href='#' data-text='Test'>Test Link</a>" />
    )

    const link = getByText('Test Link')
    await user.click(link)

    expect(mockSendAnalyticsEvent).toHaveBeenCalledWith('navClick', {
      eventLocation: 'footer',
      text: 'Test',
    })
  })
})
