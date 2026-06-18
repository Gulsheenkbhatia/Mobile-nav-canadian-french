import React from 'react'
import { render, screen, act } from 'test-utils/react'
import ShopAssistChatContent from 'toro/components/ShopAssistChat/ShopAssistChatContent'
import StylesProvider from 'toro/components/StylesProvider'
import {
  openShopAssistChatRequestAtom,
  shopAssistChatStateAtom,
  shopAssistAnimationSeenAtom,
} from 'store/shop-assist-chat.atom'
import type { Atom } from 'jotai'

const mockClearConversation = jest.fn()
const mockSendMessage = jest.fn()
const mockAnalyticsSend = jest.fn()

jest.mock('toro/components/ShopAssistChat/hooks/useShopAssistChat', () => ({
  __esModule: true,
  useShopAssistChat: jest.fn(() => ({
    messages: [],
    isLoading: false,
    sendMessage: mockSendMessage,
    clearConversation: mockClearConversation,
  })),
}))

const MockIcon = () => null
jest.mock('toro/hooks/useMultiStyleConfig', () => ({
  __esModule: true,
  default: jest.fn((key: string) =>
    key === 'Icons'
      ? {
          NewChatIcon: MockIcon,
          MagicIcon: MockIcon,
          SendIcon: MockIcon,
          ReloadIcon: MockIcon,
          LoadingIcon: MockIcon,
          ThumbUpFilled: MockIcon,
          ThumbUp: MockIcon,
          ThumbDownFilled: MockIcon,
          ThumbDown: MockIcon,
        }
      : {}
  ),
}))

const defaultSessionState = {
  activeSessionId: 'session-1',
  sessions: {
    'session-1': {
      messages: [{ id: 'm1', timestamp: '', type: 'user' as const, content: 'hi' }],
    },
  },
}

function mockUseShopAssistChat(overrides: {
  messages?: Array<{
    id: string
    type: string
    content?: string
    errorMessage?: string
    canRetry?: boolean
    timestamp?: Date
  }>
  isLoading?: boolean
  sendMessage?: jest.Mock
  clearConversation?: jest.Mock
}) {
  const useShopAssistChat = jest.requireMock(
    'toro/components/ShopAssistChat/hooks/useShopAssistChat'
  ).useShopAssistChat
  useShopAssistChat.mockReturnValue({
    messages: [],
    isLoading: false,
    sendMessage: mockSendMessage,
    clearConversation: mockClearConversation,
    ...overrides,
  })
}

const matchMediaMock = jest.fn()
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMediaMock,
  })
  Element.prototype.scrollTo = jest.fn()
})

const defaultDisclosure = {
  isOpen: true,
  onOpen: jest.fn(),
  onClose: jest.fn(),
}

function renderShopAssistChatContent(
  props: Partial<{
    disclosure: { isOpen: boolean; onOpen: (location?: string) => void; onClose: () => void }
    isClosing: boolean
    onCloseComplete: () => void
  }> = {},
  atomOverrides?: Map<Atom<unknown>, unknown>
) {
  const defaultProps = {
    disclosure: defaultDisclosure,
    isClosing: false,
    onCloseComplete: jest.fn(),
    ...props,
  }

  const initialValues = new Map<Atom<unknown>, unknown>([
    [shopAssistChatStateAtom as Atom<unknown>, defaultSessionState],
    [shopAssistAnimationSeenAtom as Atom<unknown>, true],
  ])
  atomOverrides?.forEach((value, atom) => initialValues.set(atom, value))

  return render(
    <StylesProvider value={{}}>
      <ShopAssistChatContent {...defaultProps} />
    </StylesProvider>,
    {
      contexts: {
        JotaiProviderContext: initialValues,
        PWAContext: { deviceType: 'desktop', appData: { siteId: 'coh_us_out' } },
        AnalyticsContext: {
          send: mockAnalyticsSend,
          addImpression: jest.fn(),
          isDataLayerInitialized: true,
          pageBecameInteractive: jest.fn(),
          createEventData: jest.fn(),
        },
        ViewportContext: { viewport: 'desktop' as const, isMobile: false },
      },
    }
  )
}

describe('ShopAssistChatContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    matchMediaMock.mockReturnValue({ matches: false })
    mockClearConversation.mockReturnValue('session-new')
  })

  describe('rendering', () => {
    it('renders chat shell with header, messages, and input', () => {
      renderShopAssistChatContent()

      expect(screen.getByTestId('chat-shell')).toBeVisible()
      expect(screen.getByTestId('chat-close')).toBeVisible()
      expect(screen.getByRole('textbox')).toBeVisible()
    })

    it('does not apply is-closing class when isClosing is false', () => {
      renderShopAssistChatContent({ isClosing: false })

      const shell = screen.getByTestId('chat-shell')
      expect(shell).not.toHaveClass('is-closing')
    })

    it('applies is-closing class when isClosing is true', () => {
      renderShopAssistChatContent({ isClosing: true })

      const shell = screen.getByTestId('chat-shell')
      expect(shell).toHaveClass('is-closing')
    })

    it(`shows placeholder Tell me about the gift you're looking for... when no messages`, () => {
      renderShopAssistChatContent()

      expect(
        screen.getByPlaceholderText(`Tell me about the gift you're looking for...`)
      ).toBeVisible()
    })

    it('shows placeholder "Ask a follow up..." when messages exist', () => {
      mockUseShopAssistChat({
        messages: [{ id: '1', timestamp: new Date(), type: 'user', content: 'hi' }],
      })

      renderShopAssistChatContent()

      expect(screen.getByPlaceholderText('Ask a follow up...')).toBeVisible()
    })
  })

  describe('analytics', () => {
    it('sends agentInteraction chat open without eventLocation when chat opens', () => {
      renderShopAssistChatContent()

      expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
        eventAction: 'chat open',
        eventLabel: expect.any(String),
        agentSessionId: 'session-1',
      })
    })

    it('sends agentInteraction chat initiate with eventLocation when opening with no messages', () => {
      mockUseShopAssistChat({ messages: [] })
      const emptySessionState = {
        activeSessionId: 'session-1',
        sessions: { 'session-1': { messages: [] } },
      }
      renderShopAssistChatContent(
        {},
        new Map<Atom<unknown>, unknown>([
          [openShopAssistChatRequestAtom as Atom<unknown>, 'hero banner'],
          [shopAssistChatStateAtom as Atom<unknown>, emptySessionState],
        ])
      )

      expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
        eventAction: 'chat initiate',
        eventLabel: expect.any(String),
        eventLocation: 'hero banner',
        agentSessionId: 'session-1',
      })
    })

    it('does not send chat initiate when opening with existing messages', () => {
      mockUseShopAssistChat({
        messages: [{ id: 'm1', timestamp: new Date(), type: 'user', content: 'hi' }],
      })
      renderShopAssistChatContent(
        {},
        new Map<Atom<unknown>, unknown>([
          [openShopAssistChatRequestAtom as Atom<unknown>, 'hero banner'],
        ])
      )

      expect(mockAnalyticsSend).not.toHaveBeenCalledWith(
        'agentInteraction',
        expect.objectContaining({ eventAction: 'chat initiate' })
      )
    })

    it('sends agentInteraction chat initiate with eventLocation when user confirms new chat', async () => {
      const { user } = renderShopAssistChatContent()

      await user.click(screen.getByRole('button', { name: /New Chat/i }))
      await user.click(screen.getByRole('button', { name: /Start a New Chat/i }))

      expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
        eventAction: 'chat initiate',
        eventLabel: expect.any(String),
        eventLocation: 'new chat',
        agentSessionId: 'session-new',
      })
    })

    it('sends agentInteraction chat close when close button is clicked', async () => {
      const onClose = jest.fn()
      const { user } = renderShopAssistChatContent({
        disclosure: { ...defaultDisclosure, onClose },
      })

      await user.click(screen.getByTestId('chat-close'))

      expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
        eventAction: 'chat close',
        eventLabel: expect.any(String),
        agentSessionId: 'session-1',
      })
    })
  })

  describe('close flow', () => {
    it('calls disclosure.onClose when close button is clicked (animation path)', async () => {
      const onClose = jest.fn()
      const { user } = renderShopAssistChatContent({
        disclosure: { ...defaultDisclosure, onClose },
      })

      await user.click(screen.getByTestId('chat-close'))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onCloseComplete when close is clicked with prefers-reduced-motion', async () => {
      matchMediaMock.mockReturnValue({ matches: true })
      const onClose = jest.fn()
      const onCloseComplete = jest.fn()
      const { user } = renderShopAssistChatContent({
        disclosure: { ...defaultDisclosure, onClose },
        onCloseComplete,
      })

      await user.click(screen.getByTestId('chat-close'))

      expect(onCloseComplete).toHaveBeenCalledTimes(1)
      expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onCloseComplete when animation ends', () => {
      const onCloseComplete = jest.fn()
      renderShopAssistChatContent({ isClosing: true, onCloseComplete })

      const shell = screen.getByTestId('chat-shell')
      act(() => {
        shell.dispatchEvent(new Event('animationend', { bubbles: true }))
      })

      expect(onCloseComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('error state', () => {
    it('renders ChatError when error message and no assistant message', () => {
      mockUseShopAssistChat({
        messages: [
          {
            id: 'err-1',
            timestamp: new Date(),
            type: 'error',
            errorMessage: 'Something failed',
            canRetry: true,
          },
        ],
      })

      renderShopAssistChatContent(
        {},
        new Map<Atom<unknown>, unknown>([
          [
            shopAssistChatStateAtom as Atom<unknown>,
            {
              activeSessionId: 'session-1',
              sessions: {
                'session-1': {
                  messages: [{ id: 'err-1', type: 'error' }],
                },
              },
            },
          ],
        ])
      )

      expect(screen.getByText('Something failed')).toBeVisible()
      expect(screen.getByRole('button', { name: /Refresh/i })).toBeVisible()
    })

    it('calls clearConversation when closing with error and no assistant message', async () => {
      mockUseShopAssistChat({
        messages: [
          {
            id: 'err-1',
            timestamp: new Date(),
            type: 'error',
            errorMessage: 'Something failed',
            canRetry: true,
          },
        ],
      })

      const { user } = renderShopAssistChatContent(
        {},
        new Map<Atom<unknown>, unknown>([
          [
            shopAssistChatStateAtom as Atom<unknown>,
            {
              activeSessionId: 'session-1',
              sessions: {
                'session-1': {
                  messages: [{ id: 'err-1', type: 'error' }],
                },
              },
            },
          ],
        ])
      )

      await user.click(screen.getByTestId('chat-close'))

      expect(mockClearConversation).toHaveBeenCalledTimes(1)
    })
  })

  describe('new chat', () => {
    it('sends agentInteraction when new chat button is clicked', async () => {
      const { user } = renderShopAssistChatContent()

      await user.click(screen.getByRole('button', { name: /New Chat/i }))

      expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
        eventAction: 'new chat',
        eventLabel: 'new chat cta',
        agentSessionId: 'session-1',
      })
    })
  })
})
