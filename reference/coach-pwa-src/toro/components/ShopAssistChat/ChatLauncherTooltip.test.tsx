import React from 'react'
import { render, screen, fireEvent } from 'test-utils/react'
import { IntlProvider } from 'react-intl'
import ChatLauncherTooltip from 'toro/components/ShopAssistChat/ChatLauncherTooltip'
import useStyles from 'toro/hooks/useStyles'

jest.mock('toro/hooks/useStyles')

const mockUseStyles = useStyles as jest.MockedFunction<typeof useStyles>

const mockStyles = {
  chatLauncherTooltip: {},
  chatLauncherTooltipBody: {},
  chatLauncherTooltipText: {},
  chatLauncherTooltipCta: {},
}

const TOOLTIP_AUTO_DISMISS_MS = 5000

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
)

describe('ChatLauncherTooltip', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockUseStyles.mockReturnValue(mockStyles)
    render(
      <TestWrapper>
        <ChatLauncherTooltip isOpen onClose={mockOnClose}>
          <button type="button">Trigger</button>
        </ChatLauncherTooltip>
      </TestWrapper>
    )
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('autodismiss behavior', () => {
    it('should call onClose after TOOLTIP_AUTO_DISMISS_MS when isOpen is true', () => {
      expect(mockOnClose).not.toHaveBeenCalled()
      jest.advanceTimersByTime(TOOLTIP_AUTO_DISMISS_MS)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should not call onClose before the delay elapses', () => {
      jest.advanceTimersByTime(TOOLTIP_AUTO_DISMISS_MS - 1)
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should dismiss when the cta is clicked', () => {
      fireEvent.click(screen.getByTestId('chat-launcher-tooltip-cta'))
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })
})
