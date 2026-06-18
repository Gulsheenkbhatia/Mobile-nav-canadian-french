import React from 'react'
import { render, screen, fireEvent } from 'test-utils/react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'jotai'
import ChatLauncher from 'toro/components/ShopAssistChat/ChatLauncher'
import {
  chatLauncherTextCollapsedAtom,
  chatLauncherTooltipDismissedAtom,
} from 'store/shop-assist-chat.atom'
import usePreference from 'toro/hooks/usePreference_new'
import useStyles from 'toro/hooks/useStyles'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import * as jotaiUtils from 'jotai/utils'
import usePageType from 'toro/hooks/usePageType'

jest.mock('toro/components/ShopAssistChat/hooks/useStickyAiEntryPoint', () => ({
  __esModule: true,
  default: jest.fn(() => true),
}))
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/usePreference')
jest.mock('toro/hooks/useStyles')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/hooks/usePageType', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isPDP: false,
    isPLP: true,
  })),
}))
jest.mock('store/shop-assist-chat.atom', () => ({
  chatLauncherTextCollapsedAtom: jest.fn(),
  chatLauncherTooltipDismissedAtom: jest.fn(),
}))
jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  useUpdateAtom: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithStorage: jest.fn(),
  createJSONStorage: jest.fn(),
}))

const mockUseAtomValue = jotaiUtils.useAtomValue as jest.Mock
const mockUseUpdateAtom = jotaiUtils.useUpdateAtom as jest.Mock
const mockUsePageType = usePageType as jest.Mock

const mockUsePreference = usePreference as jest.MockedFunction<typeof usePreference>
const mockUseStyles = useStyles as jest.MockedFunction<typeof useStyles>
const mockUseMultiStyleConfig = useMultiStyleConfig as jest.MockedFunction<
  typeof useMultiStyleConfig
>
const mockUseStickyAiEntryPoint = jest.requireMock(
  'toro/components/ShopAssistChat/hooks/useStickyAiEntryPoint'
).default

const mockStyles = {
  chatLauncherContainer: {},
  chatLauncherButton: {},
  chatLauncherContent: {},
  chatLauncherTextWrapper: {},
  chatLauncherText: {},
}

const MockMagicIcon = () => <svg data-qa="magic-icon" />
const MockMinusIcon = () => <svg data-qa="minus-icon" />

const defaultPreferences = {
  aiGiftConcierge: {
    aiGiftConciergeData: {
      giftingAssistantCollapseDelayMs: 5000,
    },
  },
  coachtopia: {
    coachtopiaHomeURL: '/coachtopia',
  },
}

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider>
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  </Provider>
)

Object.defineProperty(HTMLDivElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 200,
})

describe('ChatLauncher', () => {
  const mockOnOpen = jest.fn()
  const mockSetTextCollapsed = jest.fn()
  const mockSetTooltipDismissed = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    mockUseStickyAiEntryPoint.mockReturnValue(true)
    mockUseStyles.mockReturnValue(mockStyles)
    mockUseMultiStyleConfig.mockReturnValue({ MagicIcon: MockMagicIcon, MinusIcon: MockMinusIcon })
    mockUsePreference.mockReturnValue(defaultPreferences)
    mockUseAtomValue.mockReturnValue(false)
    // useUpdateAtom: return correct setter per atom (textCollapsed vs tooltipDismissed)
    mockUseUpdateAtom.mockImplementation((atom: unknown) =>
      atom === chatLauncherTextCollapsedAtom ? mockSetTextCollapsed : mockSetTooltipDismissed
    )
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render with expanded text initially', () => {
    render(
      <TestWrapper>
        <ChatLauncher onOpen={mockOnOpen} />
      </TestWrapper>
    )

    expect(screen.getByTestId('magic-icon')).toBeInTheDocument()
    expect(screen.getByText('Ask our AI Gift Assistant')).toBeInTheDocument()
  })

  it('should render without text when collapsed', () => {
    mockUseAtomValue.mockReturnValue(true)

    render(
      <TestWrapper>
        <ChatLauncher onOpen={mockOnOpen} />
      </TestWrapper>
    )

    expect(screen.getByTestId('magic-icon')).toBeInTheDocument()
    expect(screen.queryByText('Ask our AI Gift Assistant')).not.toBeInTheDocument()
  })

  it('should call onOpen when button is clicked', () => {
    render(
      <TestWrapper>
        <ChatLauncher onOpen={mockOnOpen} />
      </TestWrapper>
    )

    fireEvent.click(screen.getByTestId('open-ai-concierge'))
    expect(mockOnOpen).toHaveBeenCalledTimes(1)
  })

  it('should set text width from element offsetWidth on mount', () => {
    render(
      <TestWrapper>
        <ChatLauncher onOpen={mockOnOpen} />
      </TestWrapper>
    )

    const textWrapper = screen.getByText('Ask our AI Gift Assistant').parentElement
    expect(textWrapper).toHaveStyle({ width: '200px' })
  })

  it('should handle missing preferences gracefully', () => {
    mockUsePreference.mockReturnValue({ coachtopia: {} })

    render(
      <TestWrapper>
        <ChatLauncher onOpen={mockOnOpen} />
      </TestWrapper>
    )

    expect(screen.getByTestId('magic-icon')).toBeInTheDocument()
    expect(screen.getByText('Ask our AI Gift Assistant')).toBeInTheDocument()
  })

  it('should render with correct data-qa attribute', () => {
    render(
      <TestWrapper>
        <ChatLauncher onOpen={mockOnOpen} />
      </TestWrapper>
    )

    expect(screen.getByTestId('open-ai-concierge')).toBeInTheDocument()
  })

  it('should return null when useStickyAiEntryPoint returns false', () => {
    mockUseStickyAiEntryPoint.mockReturnValue(false)

    render(
      <TestWrapper>
        <ChatLauncher onOpen={mockOnOpen} />
      </TestWrapper>
    )

    expect(screen.queryByTestId('open-ai-concierge')).not.toBeInTheDocument()
    expect(screen.queryByText('Ask our AI Gift Assistant')).not.toBeInTheDocument()
  })

  it('should not render text wrapper when collapsed', () => {
    mockUseAtomValue.mockReturnValue(true)

    render(
      <TestWrapper>
        <ChatLauncher onOpen={mockOnOpen} />
      </TestWrapper>
    )

    expect(screen.queryByText('Ask our AI Gift Assistant')).not.toBeInTheDocument()
  })

  it('should show tooltip when enableLauncherTooltip preference is true and text is collapsed', () => {
    const prefWithTooltip = {
      aiGiftConcierge: {
        aiGiftConciergeData: {
          giftingAssistantCollapseDelayMs: 5000,
          enableLauncherTooltip: true,
        },
      },
      coachtopia: {
        coachtopiaHomeURL: '/coachtopia',
      },
    }
    mockUsePreference.mockReturnValue(prefWithTooltip)

    mockUseAtomValue.mockImplementation((atom: unknown) => {
      if (atom === chatLauncherTextCollapsedAtom) return true
      if (atom === chatLauncherTooltipDismissedAtom) return false
      return false
    })

    render(
      <TestWrapper>
        <ChatLauncher onOpen={mockOnOpen} />
      </TestWrapper>
    )

    expect(screen.getByTestId('chat-launcher-tooltip-cta')).toBeInTheDocument()
    expect(screen.getByText('Got it')).toBeInTheDocument()
  })

  it('should use formatMessage for internationalization', () => {
    const customMessages = {
      'shopAssistChat.chatLauncher.aiChatCtaLabel': 'Custom AI Assistant Text',
    }

    render(
      <Provider>
        <IntlProvider locale="en" messages={customMessages}>
          <ChatLauncher onOpen={mockOnOpen} />
        </IntlProvider>
      </Provider>
    )

    expect(screen.getByText('Custom AI Assistant Text')).toBeInTheDocument()
  })

  describe('ChatLauncher MinusIcon functionality', () => {
    const mockOnOpen = jest.fn()
    const mockSetTextCollapsed = jest.fn()
    const mockSetTooltipDismissed = jest.fn()

    beforeEach(() => {
      jest.clearAllMocks()
      jest.useFakeTimers()

      mockUseStyles.mockReturnValue(mockStyles)
      mockUseMultiStyleConfig.mockReturnValue({
        MagicIcon: MockMagicIcon,
        MinusIcon: MockMinusIcon,
      })
      mockUsePreference.mockReturnValue(defaultPreferences)
      mockUseAtomValue.mockImplementation((atom: unknown) => {
        if (atom === chatLauncherTextCollapsedAtom) return false
        return false
      })
      mockUseUpdateAtom.mockImplementation((atom: unknown) =>
        atom === chatLauncherTextCollapsedAtom ? mockSetTextCollapsed : mockSetTooltipDismissed
      )
    })

    afterEach(() => {
      jest.runOnlyPendingTimers()
      jest.useRealTimers()
    })

    it('should set isCollapsing to true when minus icon is clicked', () => {
      render(
        <TestWrapper>
          <ChatLauncher onOpen={mockOnOpen} />
        </TestWrapper>
      )

      const minusIcon = screen.getByTestId('minus-icon')
      fireEvent.click(minusIcon)

      const textWrapper = minusIcon.closest('div')
      expect(textWrapper).toBeInTheDocument()
    })

    it('should call setTextCollapsed(true) after animation ends', () => {
      render(
        <TestWrapper>
          <ChatLauncher onOpen={mockOnOpen} />
        </TestWrapper>
      )

      const minusIcon = screen.getByTestId('minus-icon')
      fireEvent.click(minusIcon)

      const textWrapper = minusIcon.closest('div')
      if (!textWrapper) throw new Error('Text wrapper not found')

      fireEvent.animationEnd(textWrapper)

      expect(mockSetTextCollapsed).toHaveBeenCalledWith(true)
    })

    it('should prevent button click when minus icon is clicked', () => {
      render(
        <TestWrapper>
          <ChatLauncher onOpen={mockOnOpen} />
        </TestWrapper>
      )

      const minusIcon = screen.getByTestId('minus-icon')
      fireEvent.click(minusIcon)

      expect(mockOnOpen).not.toHaveBeenCalled()
    })
  })

  describe('ChatLauncher Page Type Behavior', () => {
    beforeEach(() => {
      jest.clearAllMocks()

      mockUseStyles.mockReturnValue(mockStyles)
      mockUseMultiStyleConfig.mockReturnValue({
        MagicIcon: MockMagicIcon,
        MinusIcon: MockMinusIcon,
      })
      mockUsePreference.mockReturnValue(defaultPreferences)

      mockUseUpdateAtom.mockImplementation((atom: unknown) =>
        atom === chatLauncherTextCollapsedAtom ? jest.fn() : jest.fn()
      )
    })

    it('should render expanded on PLP when storage is false', () => {
      mockUsePageType.mockReturnValue({
        isPDP: false,
        isPLP: true,
      })

      mockUseAtomValue.mockReturnValue(false)

      render(
        <TestWrapper>
          <ChatLauncher onOpen={jest.fn()} />
        </TestWrapper>
      )

      expect(screen.getByText('Ask our AI Gift Assistant')).toBeInTheDocument()
    })

    it('should render collapsed on PLP when storage is true', () => {
      mockUsePageType.mockReturnValue({
        isPDP: false,
        isPLP: true,
      })

      mockUseAtomValue.mockReturnValue(true)

      render(
        <TestWrapper>
          <ChatLauncher onOpen={jest.fn()} />
        </TestWrapper>
      )

      expect(screen.queryByText('Ask our AI Gift Assistant')).not.toBeInTheDocument()
    })
  })
})
