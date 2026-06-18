import React from 'react'
import { render, screen, fireEvent } from 'test-utils/react'
import { IntlProvider } from 'react-intl'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import ChatError from 'toro/components/ShopAssistChat/ChatError'
import StylesProvider from 'toro/components/StylesProvider'
import useAnalytics from 'toro/analytics/useAnalytics'

jest.mock('jotai/utils')
jest.mock('toro/analytics/useAnalytics')
const mockUseAnalytics = jest.mocked(useAnalytics)
jest.mock('toro/icons', () => ({
  FormErrorOutlineIcon: () => <svg data-qa="error-icon" />,
}))

jest.mock('toro/hooks/useMultiStyleConfig', () =>
  jest.fn(() => ({
    ReloadIcon: () => <svg data-qa="reload-icon" />,
  }))
)

const messages = {
  'shopAssistChat.error.title': 'Oops, something didn’t load correctly.',
  'shopAssistChat.error.hint': 'Try entering your message again.',
}

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={messages}>
      <StylesProvider value={{}}>{ui}</StylesProvider>
    </IntlProvider>
  )

describe('ChatError', () => {
  const mockSetActiveMessageId = jest.fn()
  const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
  const mockedUseUpdateAtom = useUpdateAtom as jest.Mock
  const mockAnalyticsSend = jest.fn()

  const defaultProps = {
    messageId: '123',
    errorMessage: 'oops something went wrong!',
    buttonLabel: 'Retry',
    canRetry: true,
    onRetry: jest.fn(),
  }

  beforeEach(() => {
    mockedUseAtomValue.mockReturnValue(null)
    mockedUseUpdateAtom.mockReturnValue(mockSetActiveMessageId)
    mockUseAnalytics.mockReturnValue({ send: mockAnalyticsSend } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('does not render when activeMessageId does not match messageId', () => {
    mockedUseAtomValue.mockReturnValue('999')

    renderWithProviders(<ChatError {...defaultProps} />)

    expect(screen.queryByText(messages['shopAssistChat.error.title'])).toBeNull()
  })

  it('does not render when errorMessage is missing and canRetry is false', () => {
    mockedUseAtomValue.mockReturnValue('123')

    renderWithProviders(<ChatError messageId="123" canRetry={false} />)

    expect(screen.queryByText(messages['shopAssistChat.error.title'])).toBeNull()
  })

  it('renders error title and error message when active', () => {
    mockedUseAtomValue.mockReturnValue('123')

    renderWithProviders(<ChatError {...defaultProps} />)

    expect(screen.getByText(messages['shopAssistChat.error.title'])).toBeVisible()

    expect(screen.getByText('oops something went wrong!')).toBeVisible()

    expect(screen.getByTestId('error-icon')).toBeInTheDocument()
  })

  it('renders retry button when canRetry is true', () => {
    mockedUseAtomValue.mockReturnValue('123')

    renderWithProviders(<ChatError {...defaultProps} />)

    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible()

    expect(screen.getByTestId('reload-icon')).toBeInTheDocument()
  })

  it('does not render retry button when canRetry is false', () => {
    mockedUseAtomValue.mockReturnValue('123')

    renderWithProviders(<ChatError {...defaultProps} canRetry={false} />)

    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
  })

  it('clears activeMessageId and calls onRetry when retry button is clicked', () => {
    mockedUseAtomValue.mockReturnValue('123')

    renderWithProviders(<ChatError {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(mockSetActiveMessageId).toHaveBeenCalledWith('')
    expect(defaultProps.onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders default hint when errorMessage is not provided', () => {
    mockedUseAtomValue.mockReturnValue('123')

    renderWithProviders(<ChatError messageId="123" canRetry buttonLabel="Retry" />)

    expect(screen.getByText(messages['shopAssistChat.error.hint'])).toBeVisible()
  })

  it('has alert role for accessibility', () => {
    mockedUseAtomValue.mockReturnValue('123')

    renderWithProviders(<ChatError {...defaultProps} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
