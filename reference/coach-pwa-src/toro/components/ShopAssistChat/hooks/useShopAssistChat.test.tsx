import { act, renderHook, waitFor } from 'test-utils/react'
import { STORAGE_SHOP_ASSIST_CHAT_STATE } from 'toro/constants/storageIds'
import useToast from 'toro/hooks/useToast'

import { useShopAssistChat } from 'toro/components/ShopAssistChat/hooks/useShopAssistChat'
import { streamShopAssistResponse } from 'toro/components/ShopAssistChat/services/shopAssistAPI'
import { generateSessionId, getUserContext } from 'toro/components/ShopAssistChat/utils'
import { shopAssistChatStateAtom, StoredChatState } from 'store/shop-assist-chat.atom'
import usePreference from 'toro/hooks/usePreference_new'
import useAnalytics from 'toro/analytics/useAnalytics'

jest.mock('toro/hooks/useToast', () => jest.fn())
jest.mock('toro/components/ShopAssistChat/services/shopAssistAPI', () => ({
  streamShopAssistResponse: jest.fn(),
}))
jest.mock('toro/components/ShopAssistChat/utils', () => ({
  generateSessionId: jest.fn(),
  getUserContext: jest.fn(),
  getWelcomePrompts: jest.fn(() => [
    'For a special occasion',
    'Gift ideas for my wife',
    'Trending now',
    'For my best friend',
    'Under $200',
  ]),
  pickRandomItems: (arr: unknown[], count: number) => arr.slice(0, count),
}))
jest.mock('toro/hooks/usePreference_new', () => jest.fn())

jest.mock('toro/analytics/useAnalytics')

const mockUseAnalytics = jest.mocked(useAnalytics)
const mockUseToast = jest.mocked(useToast)
const mockStreamShopAssistResponse = jest.mocked(streamShopAssistResponse)
const mockGenerateSessionId = jest.mocked(generateSessionId)
const mockGetUserContext = jest.mocked(getUserContext)
const mockUsePreference = jest.mocked(usePreference)

const getStoredState = () =>
  JSON.parse(localStorage.getItem(STORAGE_SHOP_ASSIST_CHAT_STATE) || 'null')

const setup = (isOpen = true, initialState?: StoredChatState | Record<string, unknown>) => {
  const initialValues = new Map()

  if (initialState) {
    initialValues.set(shopAssistChatStateAtom, initialState)
  }

  return renderHook(() => useShopAssistChat(isOpen), {
    contexts: { JotaiProviderContext: initialValues },
  })
}

const mockAnalyticsSend = jest.fn()

describe('useShopAssistChat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    mockUseToast.mockReturnValue(jest.fn())
    mockGetUserContext.mockReturnValue({
      recent_search_queries: [],
      recently_viewed_items: [],
    })
    mockGenerateSessionId.mockReturnValue('generated-session')
    mockUsePreference.mockReturnValue({
      aiGiftConcierge: {
        aiGiftConciergeData: {
          enableShopAssistAkamai: false,
          streamReadTimeoutMs: 15000,
          shopAssistAkamaiDomain: '',
        },
      },
    })
    mockUseAnalytics.mockReturnValue({ send: mockAnalyticsSend } as any)
  })

  it('hydrates from stored sessions and exposes session metadata', async () => {
    const { result } = setup(true, {
      activeSessionId: 'session-1',
      sessions: {
        'session-1': {
          messages: [
            {
              id: 'm-1',
              timestamp: new Date('2024-01-01T00:00:00Z').toISOString(),
              type: 'assistant',
              content: 'Welcome back',
            },
          ],
          toolCallEvents: [
            {
              id: 'e-1',
              toolUseId: 'tool-1',
              name: 'search_catalog',
              timestamp: new Date('2024-01-01T00:00:00Z').toISOString(),
            },
          ],
        },
      },
    })

    await waitFor(() => expect(result.current.sessionId).toBe('session-1'))

    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].content).toBe('Welcome back')
    expect(result.current.sessionIds).toEqual(['session-1'])
  })

  it('migrates legacy storage shape into session map', async () => {
    const { result } = setup(true, {
      sessionId: 'legacy-session',
      messages: [
        {
          id: 'legacy-message',
          timestamp: new Date('2024-01-02T00:00:00Z').toISOString(),
          type: 'assistant',
          content: 'Legacy message',
        },
      ],
    })

    await waitFor(() => expect(result.current.sessionId).toBe('legacy-session'))

    const storedState = getStoredState()
    expect(storedState.activeSessionId).toBe('legacy-session')
    expect(storedState.sessions['legacy-session'].messages).toHaveLength(1)
    expect(result.current.messages[0].content).toBe('Legacy message')
  })

  it('streams assistant responses and persists messages per session', async () => {
    mockGenerateSessionId.mockReturnValue('session-1')

    mockStreamShopAssistResponse.mockImplementation(async (_payload, onEvent) => {
      onEvent({
        event: {
          contentBlockStart: {
            start: { toolUse: { toolUseId: 'tool-1', name: 'search_catalog' } },
          },
        },
      })
      onEvent({
        message: {
          role: 'assistant',
          content: [
            { text: 'Here are some options.' },
            { toolUse: { name: 'search_catalog' } },
            {
              product: {
                id: 'p-1',
                title: 'Product 1',
                image_url: 'https://example.com/image1.jpg',
                url: 'https://example.com/product1',
                price: 100,
                sale_price: 0,
                color: 'red',
              },
            },
            { product_images: ['https://example.com/1.png'] },
            { suggested_replies: ['Show more'] },
          ],
        },
      })
      onEvent({
        message: {
          role: 'user',
          content: [
            {
              toolResult: {
                status: 'success',
                content: [{ text: JSON.stringify([{ product_id: 'sku-1' }]) }],
              },
            },
          ],
        },
      })
    })

    const { result } = setup()

    await waitFor(() => expect(result.current.sessionId).toBe('session-1'))

    act(() => {
      result.current.sendMessage('Find a gift')
    })

    const messageTypes = result.current.messages.map((message) => message.type)
    expect(messageTypes).toEqual([
      'user',
      'assistant',
      'product-tile',
      'product-images',
      'suggested-replies',
      'product-results',
    ])
    expect(mockStreamShopAssistResponse).toHaveBeenCalledWith(
      {
        prompt: 'Find a gift',
        sessionId: 'session-1',
        userContext: {
          recent_search_queries: [],
          recently_viewed_items: [],
        },
        locale: '',
        clientMetadata: { analytics_message_id: '2' },
      },
      expect.any(Function),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        enableShopAssistAkamai: false,
        streamReadTimeoutMs: 15000,
      })
    )

    const storedState = getStoredState()
    expect(storedState.sessions['session-1'].messages).toHaveLength(messageTypes.length)
  })

  it('passes enableShopAssistAkamai when preference is enabled', async () => {
    mockGenerateSessionId.mockReturnValue('session-1')
    mockUsePreference.mockReturnValue({
      aiGiftConcierge: {
        aiGiftConciergeData: {
          enableShopAssistAkamai: true,
          streamReadTimeoutMs: 20000,
          shopAssistAkamaiDomain: 'https://akamai.example.com',
        },
      },
    })

    const { result } = setup()

    await waitFor(() => expect(result.current.sessionId).toBe('session-1'))

    act(() => {
      result.current.sendMessage('Need ideas')
    })

    expect(mockStreamShopAssistResponse).toHaveBeenCalledWith(
      {
        prompt: 'Need ideas',
        sessionId: 'session-1',
        userContext: {
          recent_search_queries: [],
          recently_viewed_items: [],
        },
        locale: '',
        clientMetadata: { analytics_message_id: '2' },
      },
      expect.any(Function),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        enableShopAssistAkamai: true,
        streamReadTimeoutMs: 20000,
        shopAssistAkamaiDomain: 'https://akamai.example.com',
      })
    )
  })

  it('clearConversation starts a new session and removes the previous session', async () => {
    mockGenerateSessionId.mockReturnValueOnce('session-1').mockReturnValueOnce('session-2')

    const { result } = setup()

    await waitFor(() => expect(result.current.sessionId).toBe('session-1'))

    act(() => {
      result.current.clearConversation()
    })

    await waitFor(() => expect(result.current.sessionId).toBe('session-2'))

    const storedState = getStoredState()
    expect(storedState.activeSessionId).toBe('session-2')
    expect(storedState.sessions['session-1']).toBeUndefined()
    expect(storedState.sessions['session-2']).toBeDefined()
  })

  it('clearConversation aborts an active streaming request', async () => {
    let capturedSignal: AbortSignal | undefined
    mockStreamShopAssistResponse.mockImplementation(async (_payload, _onEvent, options) => {
      capturedSignal = options?.signal
      await new Promise(() => null)
    })

    const { result } = setup()

    await waitFor(() => expect(result.current.sessionId).toBe('generated-session'))

    act(() => {
      result.current.sendMessage('Hello')
    })

    await waitFor(() => expect(capturedSignal).toBeDefined())

    act(() => {
      result.current.clearConversation()
    })

    expect(capturedSignal?.aborted).toBe(true)
  })

  it('loadSession switches to an existing session and updates active session', async () => {
    const { result } = setup(true, {
      activeSessionId: 'session-1',
      sessions: {
        'session-1': {
          messages: [
            {
              id: 'm-1',
              timestamp: new Date('2024-01-01T00:00:00Z').toISOString(),
              type: 'assistant',
              content: 'Session 1',
            },
          ],
          toolCallEvents: [],
        },
        'session-2': {
          messages: [
            {
              id: 'm-2',
              timestamp: new Date('2024-01-01T00:00:00Z').toISOString(),
              type: 'assistant',
              content: 'Session 2',
            },
          ],
          toolCallEvents: [],
        },
      },
    })

    await waitFor(() => expect(result.current.sessionId).toBe('session-1'))

    act(() => {
      result.current.loadSession('session-2')
    })

    await waitFor(() => expect(result.current.sessionId).toBe('session-2'))

    expect(result.current.messages[0].content).toBe('Session 2')
    expect(getStoredState().activeSessionId).toBe('session-2')
  })

  it('clearSession removes a session and clears state when it is active', async () => {
    const { result } = setup(true, {
      activeSessionId: 'session-1',
      sessions: {
        'session-1': {
          messages: [
            {
              id: 'm-1',
              timestamp: new Date('2024-01-01T00:00:00Z').toISOString(),
              type: 'assistant',
              content: 'Session 1',
            },
          ],
          toolCallEvents: [],
        },
        'session-2': {
          messages: [
            {
              id: 'm-2',
              timestamp: new Date('2024-01-01T00:00:00Z').toISOString(),
              type: 'assistant',
              content: 'Session 2',
            },
          ],
          toolCallEvents: [],
        },
      },
    })

    await waitFor(() => expect(result.current.sessionId).toBe('session-1'))

    await act(async () => {
      result.current.clearSession('session-1')
    })

    await waitFor(() => expect(result.current.sessionId).toBeNull())

    expect(result.current.messages).toHaveLength(0)
  })

  it('displays guardrail intervention as assistant message with 3 random prompts', async () => {
    mockGenerateSessionId.mockReturnValue('session-1')

    mockStreamShopAssistResponse.mockImplementation(async (_payload, onEvent) => {
      onEvent({
        message: {
          role: 'assistant',
          content: [{ text: 'Sorry, I cannot assist with that.' }],
        },
        client_metadata: { analytics_message_id: '25' },
        error: 'Guardrail intervention',
        request_id: '476b31ec-84c6-499f-9f2d-bdf06ac39137',
      })
    })

    const { result } = setup()

    await waitFor(() => expect(result.current.sessionId).toBe('session-1'))

    act(() => {
      result.current.sendMessage('inappropriate request')
    })

    await waitFor(() => expect(result.current.messages.length).toBeGreaterThanOrEqual(2))

    const messageTypes = result.current.messages.map((m) => m.type)
    expect(messageTypes).toContain('user')
    expect(messageTypes).toContain('assistant')
    expect(messageTypes).toContain('suggested-replies')

    const assistantMsg = result.current.messages.find((m) => m.type === 'assistant')
    expect(assistantMsg?.content).toBe('Sorry, I cannot assist with that.')

    const suggestedMsg = result.current.messages.find((m) => m.type === 'suggested-replies')
    expect(suggestedMsg?.suggestedReplies).toHaveLength(3)
  })
})
