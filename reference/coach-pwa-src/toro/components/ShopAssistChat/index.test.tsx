import React from 'react'
import { render, screen, act, waitFor } from 'test-utils/react'
import ShopAssistChat from 'toro/components/ShopAssistChat/index'
import useAnalytics from 'toro/analytics/useAnalytics'
import {
  openShopAssistChatRequestAtom,
  setOpenShopAssistChatRequestAtom,
  shopAssistAnimationSeenAtom,
  shopAssistChatStateAtom,
  stickyAiChatAtom,
} from 'store/shop-assist-chat.atom'
import type { Atom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'

const mockClearConversation = jest.fn()

jest.mock('toro/analytics/useAnalytics')
const mockUseAnalytics = jest.mocked(useAnalytics)
const mockAnalyticsSend = jest.fn()

jest.mock('toro/components/ShopAssistChat/hooks/useShopAssistChat', () => ({
  __esModule: true,
  useShopAssistChat: jest.fn(() => ({
    messages: [],
    isLoading: false,
    sendMessage: jest.fn(),
    clearConversation: mockClearConversation,
  })),
}))

const mockIconComponent = () => null
jest.mock('toro/hooks/useMultiStyleConfig', () => ({
  __esModule: true,
  default: jest.fn((key: string) =>
    key === 'Icons'
      ? {
          NewChatIcon: mockIconComponent,
          MagicIcon: mockIconComponent,
          SendIcon: mockIconComponent,
          ReloadIcon: mockIconComponent,
          LoadingIcon: mockIconComponent,
          ThumbUpFilled: mockIconComponent,
          ThumbUp: mockIconComponent,
          ThumbDownFilled: mockIconComponent,
          ThumbDown: mockIconComponent,
        }
      : {}
  ),
}))

jest.mock('toro/hooks/useViewportType', () => ({
  __esModule: true,
  default: () => ({ isMobile: false }),
}))

jest.mock('toro/components/ShopAssistChat/ChatLauncher', () => ({
  __esModule: true,
  default: ({ onOpen }: any) => <button onClick={onOpen}>AI Chat</button>,
}))
const defaultSessionState = {
  activeSessionId: 'session-1',
  sessions: {
    'session-1': {
      messages: [{ id: 'm1', timestamp: '', type: 'user' as const, content: 'hi' }],
    },
  },
}

const emptySessionState = {
  activeSessionId: 'session-1',
  sessions: { 'session-1': { messages: [] } },
}

const matchMediaMock = jest.fn()
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMediaMock,
  })
})

function SetterButton() {
  const setEventLocation = useUpdateAtom(setOpenShopAssistChatRequestAtom)
  return (
    <button type="button" onClick={() => setEventLocation('setter test')}>
      Open via setter
    </button>
  )
}

function renderShopAssistChat(atomOverrides?: Map<Atom<unknown>, unknown>) {
  const initialValues = new Map<Atom<unknown>, unknown>([
    [openShopAssistChatRequestAtom, null] as [Atom<unknown>, unknown],
    [shopAssistChatStateAtom, defaultSessionState] as [Atom<unknown>, unknown],
    [shopAssistAnimationSeenAtom, true] as [Atom<unknown>, unknown],
    [stickyAiChatAtom, false] as [Atom<unknown>, unknown],
  ])
  atomOverrides?.forEach((value, atom) => initialValues.set(atom, value))
  return render(<ShopAssistChat />, {
    contexts: {
      JotaiProviderContext: initialValues,
    },
  })
}

function renderShopAssistChatWithSetterButton(atomOverrides?: Map<Atom<unknown>, unknown>) {
  const initialValues = new Map<Atom<unknown>, unknown>([
    [openShopAssistChatRequestAtom, null] as [Atom<unknown>, unknown],
    [shopAssistChatStateAtom, defaultSessionState] as [Atom<unknown>, unknown],
    [shopAssistAnimationSeenAtom, true] as [Atom<unknown>, unknown],
    [stickyAiChatAtom, false] as [Atom<unknown>, unknown],
  ])
  atomOverrides?.forEach((value, atom) => initialValues.set(atom, value))
  return render(
    <>
      <SetterButton />
      <ShopAssistChat />
    </>,
    {
      contexts: {
        JotaiProviderContext: initialValues,
      },
    }
  )
}

describe('ShopAssistChat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    matchMediaMock.mockReturnValue({ matches: false })
    mockUseAnalytics.mockReturnValue({ send: mockAnalyticsSend } as any)
    HTMLElement.prototype.scrollTo = jest.fn()
    const useShopAssistChat = jest.requireMock(
      'toro/components/ShopAssistChat/hooks/useShopAssistChat'
    ).useShopAssistChat
    useShopAssistChat.mockReturnValue({
      messages: [],
      isLoading: false,
      sendMessage: jest.fn(),
      clearConversation: mockClearConversation,
    })
  })

  describe('closing state and handleCloseComplete', () => {
    jest.mock('toro/components/ShopAssistChat/hooks/useShopAssistChat', () => ({
      __esModule: true,
      useShopAssistChat: jest.fn(() => ({
        messages: [{ id: 'm1', timestamp: '', type: 'user', content: 'hi' }],
        isLoading: false,
        sendMessage: jest.fn(),
        clearConversation: mockClearConversation,
      })),
    }))
    it('sets isClosing to true when closing the chat', async () => {
      const { user } = renderShopAssistChat()

      await user.click(screen.getByRole('button', { name: /AI Chat/i }))

      const shell = await screen.findByTestId('chat-shell')
      expect(shell).toBeVisible()

      const closeButton = await screen.findByTestId('chat-close')
      expect(closeButton).toBeVisible()

      await user.click(closeButton)

      expect(shell).toHaveClass('is-closing')
    })

    it('handleCloseComplete resets isClosing to false', async () => {
      const { user } = renderShopAssistChat()

      await user.click(screen.getByRole('button', { name: /AI Chat/i }))

      const shell = await screen.findByTestId('chat-shell')
      await user.click(screen.getByTestId('chat-close'))
      expect(shell).toHaveClass('is-closing')

      act(() => {
        shell.dispatchEvent(new Event('animationend', { bubbles: true }))
      })

      expect(screen.getByRole('button', { name: /AI Chat/i })).toBeVisible()
      expect(screen.queryByTestId('chat-shell')).toBeNull()
    })

    it('renders ChatLauncher when !isOpen && !isClosing', () => {
      renderShopAssistChat()

      expect(screen.getByRole('button', { name: /AI Chat/i })).toBeVisible()
      expect(screen.queryByTestId('chat-shell')).toBeNull()
    })

    it('renders ChatShell with content during closing state after user clicks close', async () => {
      const { user } = renderShopAssistChat()

      await user.click(screen.getByRole('button', { name: /AI Chat/i }))

      expect(await screen.findByTestId('chat-shell')).toBeVisible()
      expect(screen.getByTestId('chat-close')).toBeVisible()

      await user.click(screen.getByTestId('chat-close'))

      const shell = screen.getByTestId('chat-shell')
      expect(shell).toBeVisible()
      expect(shell).toHaveClass('is-closing')
    })
  })

  describe('error clearing during close', () => {
    it('calls clearChat (clearConversation) when closing with error and no assistant message', async () => {
      const useShopAssistChat = jest.requireMock(
        'toro/components/ShopAssistChat/hooks/useShopAssistChat'
      ).useShopAssistChat
      useShopAssistChat.mockReturnValue({
        messages: [
          {
            id: 'err-1',
            timestamp: new Date(),
            type: 'error',
            errorMessage: 'Something failed',
            canRetry: true,
          },
        ],
        isLoading: false,
        sendMessage: jest.fn(),
        clearConversation: mockClearConversation,
      })

      const { user } = renderShopAssistChat(
        new Map<Atom<unknown>, unknown>([
          [
            shopAssistChatStateAtom,
            {
              activeSessionId: 'session-1',
              sessions: {
                'session-1': {
                  messages: [{ id: 'err-1', type: 'error' }],
                },
              },
            },
          ] as [Atom<unknown>, unknown],
        ])
      )

      await user.click(screen.getByRole('button', { name: /AI Chat/i }))
      await user.click(await screen.findByTestId('chat-close'))

      expect(mockClearConversation).toHaveBeenCalledTimes(1)
    })
  })

  describe('programmatic open (atom)', () => {
    it('opens the chat and sends chat open without eventLocation, chat initiate with eventLocation', async () => {
      renderShopAssistChat(
        new Map<Atom<unknown>, unknown>([
          [openShopAssistChatRequestAtom, 'hero banner'] as [Atom<unknown>, unknown],
          [shopAssistChatStateAtom, emptySessionState] as [Atom<unknown>, unknown],
        ])
      )

      expect(await screen.findByTestId('chat-shell')).toBeVisible()

      await waitFor(() =>
        expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
          eventAction: 'chat open',
          eventLabel: expect.any(String),
          agentSessionId: 'session-1',
        })
      )
      await waitFor(() =>
        expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
          eventAction: 'chat initiate',
          eventLabel: expect.any(String),
          eventLocation: 'hero banner',
          agentSessionId: 'session-1',
        })
      )
    })

    it('opens the chat when setOpenShopAssistChatRequestAtom is called', async () => {
      const { user } = renderShopAssistChatWithSetterButton(
        new Map<Atom<unknown>, unknown>([
          [shopAssistChatStateAtom, emptySessionState] as [Atom<unknown>, unknown],
        ])
      )

      expect(screen.queryByTestId('chat-shell')).toBeNull()

      await user.click(screen.getByRole('button', { name: /Open via setter/i }))

      expect(await screen.findByTestId('chat-shell')).toBeVisible()

      await waitFor(() =>
        expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
          eventAction: 'chat open',
          eventLabel: expect.any(String),
          agentSessionId: 'session-1',
        })
      )
      await waitFor(() =>
        expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
          eventAction: 'chat initiate',
          eventLabel: expect.any(String),
          eventLocation: 'setter test',
          agentSessionId: 'session-1',
        })
      )
    })
  })

  describe('handleLauncherOpen functionality', () => {
    it('should set sticky AI chat state when launcher is opened', async () => {
      const { user } = renderShopAssistChat(
        new Map<Atom<unknown>, unknown>([
          [shopAssistChatStateAtom, emptySessionState] as [Atom<unknown>, unknown],
        ])
      )

      await user.click(screen.getByRole('button', { name: /AI Chat/i }))

      expect(await screen.findByTestId('chat-shell')).toBeVisible()

      await waitFor(() =>
        expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
          eventAction: 'chat open',
          eventLabel: expect.any(String),
          agentSessionId: 'session-1',
        })
      )
      await waitFor(() =>
        expect(mockAnalyticsSend).toHaveBeenCalledWith('agentInteraction', {
          eventAction: 'chat initiate',
          eventLabel: expect.any(String),
          eventLocation: 'sticky icon',
          agentSessionId: 'session-1',
        })
      )
    })

    it('should call setEventLocation with sticky icon when handleLauncherOpen is called', async () => {
      const { user } = renderShopAssistChat()

      expect(screen.getByRole('button', { name: /AI Chat/i })).toBeVisible()

      await user.click(screen.getByRole('button', { name: /AI Chat/i }))

      expect(await screen.findByTestId('chat-shell')).toBeVisible()
      expect(screen.queryByRole('button', { name: /AI Chat/i })).not.toBeInTheDocument()
    })
  })
})
