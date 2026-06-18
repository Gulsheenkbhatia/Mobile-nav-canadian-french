import React from 'react'
import { render, screen, fireEvent, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'react-intl'
import { Provider as JotaiProvider } from 'jotai'
import ChatInput from 'toro/components/ShopAssistChat/ChatInput'
import useAnalytics from 'toro/analytics/useAnalytics'

jest.mock('toro/hooks/useStyles', () => ({
  __esModule: true,
  default: () => ({
    chatInputContainer: {},
    chatInputWrapper: {},
    chatInput: {},
    chatSendButtonWrapper: {},
    chatSendButton: {},
  }),
}))

jest.mock('toro/hooks/useMultiStyleConfig', () => ({
  __esModule: true,
  default: () => ({
    SendIcon: () => <span data-qa="send-icon">Send</span>,
  }),
}))

jest.mock('jotai/utils', () => ({
  useAtomValue: () => jest.fn(),
  useUpdateAtom: () => jest.fn(),
  atomWithReset: () => jest.fn(),
  atomWithStorage: () => jest.fn(),
  createJSONStorage: jest.fn(() => jest.fn()),
}))

jest.mock('store/shop-assist-chat.atom', () => ({
  setActiveMessageIdAtom: {},
}))

jest.mock('toro/analytics/useAnalytics')

const mockUseAnalytics = jest.mocked(useAnalytics)

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <IntlProvider locale="en" messages={{}}>
    <JotaiProvider>{children}</JotaiProvider>
  </IntlProvider>
)

const mockAnalyticsSend = jest.fn()

describe('ChatInput', () => {
  const defaultProps = {
    onSend: jest.fn(),
    placeholder: 'Type your message...',
    disabled: false,
    clearInput: false,
  }
  const defaultUserAgent = window.navigator.userAgent

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAnalytics.mockReturnValue({ send: mockAnalyticsSend } as any)
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: defaultUserAgent,
    })
  })

  it('should render ChatInput component with default props', () => {
    render(
      <TestWrapper>
        <ChatInput {...defaultProps} />
      </TestWrapper>
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument()
    expect(screen.getByTestId('send-icon')).toBeInTheDocument()
  })

  it('should auto focus input on non-Android devices when enabled', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    })

    render(
      <TestWrapper>
        <ChatInput {...defaultProps} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveFocus()
    })
  })

  it('should not auto focus input on Android when loading completes', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)',
    })

    const { rerender } = render(
      <TestWrapper>
        <ChatInput {...defaultProps} disabled={true} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')

    rerender(
      <TestWrapper>
        <ChatInput {...defaultProps} disabled={false} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(input).not.toHaveFocus()
    })
  })

  it('should update input value when user types', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <ChatInput {...defaultProps} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello world')

    expect(input).toHaveValue('Hello world')
  })

  it('should call onSend and clear input when send button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnSend = jest.fn()

    render(
      <TestWrapper>
        <ChatInput {...defaultProps} onSend={mockOnSend} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')

    await user.type(input, 'Test message')
    await user.click(sendButton)

    expect(mockOnSend).toHaveBeenCalledWith('Test message')
    expect(input).toHaveValue('')
  })

  it('should not call onSend when input is empty', async () => {
    const user = userEvent.setup()
    const mockOnSend = jest.fn()

    render(
      <TestWrapper>
        <ChatInput {...defaultProps} onSend={mockOnSend} />
      </TestWrapper>
    )

    const sendButton = screen.getByRole('button')
    await user.click(sendButton)

    expect(mockOnSend).not.toHaveBeenCalled()
  })

  it('should not call onSend when input contains only whitespace', async () => {
    const user = userEvent.setup()
    const mockOnSend = jest.fn()

    render(
      <TestWrapper>
        <ChatInput {...defaultProps} onSend={mockOnSend} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')

    await user.type(input, '   ')
    await user.click(sendButton)

    expect(mockOnSend).not.toHaveBeenCalled()
  })

  it('should call onSend when Enter key is pressed', async () => {
    const user = userEvent.setup()
    const mockOnSend = jest.fn()

    render(
      <TestWrapper>
        <ChatInput {...defaultProps} onSend={mockOnSend} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'Test message')
    await user.keyboard('{Enter}')

    expect(mockOnSend).toHaveBeenCalledWith('Test message')
    expect(input).toHaveValue('')
  })

  it('should not call onSend when Shift+Enter is pressed', async () => {
    const user = userEvent.setup()
    const mockOnSend = jest.fn()

    render(
      <TestWrapper>
        <ChatInput {...defaultProps} onSend={mockOnSend} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'Test message')
    await user.keyboard('{Shift>}{Enter}{/Shift}')

    expect(mockOnSend).not.toHaveBeenCalled()
    expect(input).toHaveValue('Test message')
  })

  it('should disable input and button when disabled prop is true', () => {
    render(
      <TestWrapper>
        <ChatInput {...defaultProps} disabled={true} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')

    expect(input).toBeDisabled()
    expect(sendButton).toBeDisabled()
  })

  it('should clear input when clearInput prop changes', () => {
    const { rerender } = render(
      <TestWrapper>
        <ChatInput {...defaultProps} clearInput={false} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Test message' } })
    expect(input).toHaveValue('Test message')

    rerender(
      <TestWrapper>
        <ChatInput {...defaultProps} clearInput={true} />
      </TestWrapper>
    )

    expect(input).toHaveValue('')
  })

  it('should have proper accessibility attributes', () => {
    const { container } = render(
      <TestWrapper>
        <ChatInput {...defaultProps} />
      </TestWrapper>
    )

    const chatInputContainer = container.querySelector('.chat-input')
    const input = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')

    expect(chatInputContainer).toHaveAttribute('aria-label')
    expect(input).toHaveAttribute('aria-label')
    expect(input).toHaveAttribute('aria-describedby')
    expect(sendButton).toHaveAttribute('aria-label')
  })

  it('should handle async onSend function', async () => {
    const user = userEvent.setup()
    const mockOnSend = jest.fn().mockResolvedValue(undefined)

    render(
      <TestWrapper>
        <ChatInput {...defaultProps} onSend={mockOnSend} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')

    await user.type(input, 'Async message')
    await user.click(sendButton)

    await waitFor(() => {
      expect(mockOnSend).toHaveBeenCalledWith('Async message')
    })
    expect(input).toHaveValue('')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <ChatInput {...defaultProps} className="custom-chat-input" />
      </TestWrapper>
    )

    const chatInputContainer = container.querySelector('.chat-input.custom-chat-input')
    expect(chatInputContainer).toBeInTheDocument()
    expect(chatInputContainer).toHaveClass('chat-input', 'custom-chat-input')
  })

  it('should handle input change events correctly', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <ChatInput {...defaultProps} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')

    await user.type(input, 'a')
    expect(input).toHaveValue('a')

    await user.type(input, 'bc')
    expect(input).toHaveValue('abc')

    await user.clear(input)
    expect(input).toHaveValue('')
  })

  it('should prevent default behavior on Enter key press', async () => {
    const user = userEvent.setup()
    const mockOnSend = jest.fn()

    render(
      <TestWrapper>
        <ChatInput {...defaultProps} onSend={mockOnSend} />
      </TestWrapper>
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'Test message')
    await user.keyboard('{Enter}')

    expect(mockOnSend).toHaveBeenCalledWith('Test message')
    expect(input).toHaveValue('')
  })
})
