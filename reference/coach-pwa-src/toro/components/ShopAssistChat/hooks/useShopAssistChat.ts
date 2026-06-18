import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import usePreference from 'toro/hooks/usePreference_new'
import type {
  AddMessageProps,
  ChatMessage,
  Product,
  StreamContentItem,
  StreamEventData,
} from 'toro/components/ShopAssistChat/types'
import { GUARDRAIL_ERROR_MESSAGE } from 'toro/components/ShopAssistChat/constants'
import {
  generateSessionId,
  getUserContext,
  getWelcomePrompts,
  pickRandomItems,
} from 'toro/components/ShopAssistChat/utils'
import { shopAssistChatStateAtom, type StoredChatState } from 'store/shop-assist-chat.atom'
import { streamShopAssistResponse } from 'toro/components/ShopAssistChat/services/shopAssistAPI'
import { currentLocaleAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'
import { useIntl } from 'react-intl'
import useAnalytics from 'toro/analytics/useAnalytics'

const eventLabelMap: Record<string, string> = {
  assistant: 'text',
  'product-tile': 'product',
  'suggested-replies': 'prompt',
  user: 'user',
}

export function useShopAssistChat(isOpen: boolean) {
  const { formatMessage } = useIntl()
  const {
    aiGiftConcierge: {
      aiGiftConciergeData: {
        enableShopAssistAkamai = false,
        streamReadTimeoutMs = 15000,
        shopAssistAkamaiDomain = '',
        giftingAssistantPromptLabels = [],
      } = {},
    } = {},
  } = usePreference({
    aiGiftConcierge: ['aiGiftConciergeData'],
  })
  const abortControllerRef = useRef<AbortController | null>(null)
  const productRef = useRef<Product[]>([])
  const agentMessageCountRef = useRef<number | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [hasHydrated, setHasHydrated] = useState(false)
  const [storedChatState, setStoredChatState] = useAtom(shopAssistChatStateAtom)
  const locale = useAtomValue(currentLocaleAtom)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const analytics = useAnalytics()

  const addMessage = (props: AddMessageProps) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      agentMessageId: props.agentMessageId ?? agentMessageCountRef.current,
      ...props,
    }

    setMessages((prev) => [...prev, newMessage])

    const eventLabel = eventLabelMap[props.type]
    if (!eventLabel) return

    const payload: Record<string, unknown> = {
      agentSessionId: sessionId,
    }

    if (props.type === 'user') {
      payload.eventAction = 'message send'
      payload.eventLabel = props.source === 'prompt' ? 'prompt' : 'text'
      payload.agentMessageCount = (agentMessageCountRef.current ?? 0) + 1
    } else {
      payload.eventAction = 'message received'
      payload.eventLabel = eventLabel
      payload.agentMessageCount = props.agentMessageId ?? agentMessageCountRef.current
    }

    analytics.send('agentInteraction', payload)
  }
  const abortActiveRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }

  const deserializeMessages = (storedMessages: StoredChatState['sessions'][string]['messages']) =>
    (storedMessages || []).map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }))

  const getMaxAgentMessageId = (
    msgs: StoredChatState['sessions'][string]['messages']
  ): number | null => {
    const ids = (msgs || []).map((m) => m.agentMessageId).filter((id): id is number => id != null)
    return ids.length > 0 ? Math.max(...ids) : null
  }

  const createEmptySession = () => ({
    messages: [],
    toolCallEvents: [],
  })

  const normalizeStoredState = (state: any): StoredChatState => {
    if (!state || typeof state !== 'object') {
      return { activeSessionId: null, sessions: {} }
    }

    if ('sessions' in state) {
      const sessionKeys = Object.keys(state.sessions ?? {})
      const activeSessionId = state.activeSessionId ?? sessionKeys[0] ?? null
      return {
        activeSessionId,
        sessions: state.sessions ?? {},
      }
    }

    if ('messages' in state || 'toolCallEvents' in state) {
      const legacySessionId = state.sessionId || generateSessionId()
      return {
        activeSessionId: legacySessionId,
        sessions: {
          [legacySessionId]: {
            messages: state.messages || [],
          },
        },
      }
    }

    return { activeSessionId: null, sessions: {} }
  }

  useEffect(() => {
    if (!isOpen) {
      setHasHydrated(false)
      return
    }

    if (hasHydrated) return

    const normalizedState = normalizeStoredState(storedChatState)

    const isLegacyState =
      storedChatState &&
      typeof storedChatState === 'object' &&
      ('messages' in storedChatState || 'toolCallEvents' in storedChatState)
    const shouldSyncState =
      isLegacyState || normalizedState.activeSessionId !== storedChatState?.activeSessionId

    if (shouldSyncState) {
      setStoredChatState(normalizedState)
    }

    const nextSessionId = normalizedState.activeSessionId || generateSessionId()
    const sessionData = normalizedState.sessions[nextSessionId]

    if (!sessionData) {
      setStoredChatState({
        ...normalizedState,
        activeSessionId: nextSessionId,
        sessions: {
          ...normalizedState.sessions,
          [nextSessionId]: createEmptySession(),
        },
      })
    }

    const loadedMessages = sessionData?.messages || []
    const maxAgentMessageId = getMaxAgentMessageId(loadedMessages)
    setMessages(deserializeMessages(loadedMessages))
    setSessionId(nextSessionId)
    agentMessageCountRef.current = maxAgentMessageId
    setHasHydrated(true)
  }, [isOpen, hasHydrated, storedChatState, setStoredChatState])

  useEffect(() => {
    if (!hasHydrated || !sessionId) return
    setStoredChatState((prev) => {
      const normalizedState = normalizeStoredState(prev)
      return {
        activeSessionId: sessionId,
        sessions: {
          ...normalizedState.sessions,
          [sessionId]: {
            messages: messages
              ?.filter((message) => message.type !== 'error')
              ?.map((message) => ({
                ...message,
                timestamp: message.timestamp.toISOString(),
              })),
          },
        },
      }
    })
  }, [messages, sessionId, hasHydrated, setStoredChatState])

  const flushProduct = useCallback(() => {
    if (!productRef?.current?.length) return

    addMessage({
      type: 'product-tile',
      product: productRef.current,
    })

    productRef.current = []
  }, [addMessage])

  const streamContentHandlers = useMemo<
    Partial<Record<keyof StreamContentItem, (item: StreamContentItem) => void>>
  >(
    () => ({
      text: (item) => {
        flushProduct()
        addMessage({ type: 'assistant', content: item.text })
      },

      product: (item) => {
        if (item.product?.id) {
          productRef.current.push(item.product)
        }
      },

      product_images: (item) => {
        flushProduct()
        addMessage({
          type: 'product-images',
          productImages: item.product_images,
        })
      },

      suggested_replies: (item) => {
        flushProduct()
        addMessage({
          type: 'suggested-replies',
          suggestedReplies: item.suggested_replies,
        })
      },
    }),
    [flushProduct, addMessage]
  )

  const parseEventData = (eventData: StreamEventData & { error?: string }) => {
    const echoedId = eventData.client_metadata?.analytics_message_id
    const fallbackId = eventData.message_id
    const isValidEchoedId =
      typeof echoedId === 'string' && echoedId.trim() !== '' && !Number.isNaN(Number(echoedId))
    const id = isValidEchoedId ? echoedId : fallbackId
    if (id != null && String(id) !== '') {
      agentMessageCountRef.current = Number(id)
    }

    if (eventData.error === GUARDRAIL_ERROR_MESSAGE) {
      const text =
        eventData.message?.content?.[0]?.text ??
        formatMessage({
          id: 'shopAssistChat.guardrail.defaultMessageOne',
          defaultMessage: 'Sorry, I cannot assist with that.',
        })
      flushProduct()
      addMessage({ type: 'assistant', content: text })
      addMessage({
        type: 'assistant',
        content: formatMessage({
          id: 'shopAssistChat.guardrail.defaultMessageTwo',
          defaultMessage: 'Try asking me about',
        }),
      })
      const welcomePrompts = getWelcomePrompts(formatMessage, giftingAssistantPromptLabels)
      const suggestedPrompts = pickRandomItems(welcomePrompts, 3)
      if (suggestedPrompts.length > 0) {
        addMessage({
          type: 'suggested-replies',
          suggestedReplies: suggestedPrompts,
        })
      }
      return
    }

    if (eventData.event?.metadata || eventData.event?.contentBlockStart) {
      return
    }

    if (eventData.type === 'STREAM_DONE') {
      flushProduct()
      return
    }

    const message = eventData?.message
    if (!message) return

    if (message?.role === 'assistant' && !message?.related_product_id) {
      const content = message.content?.filter((item) => !item.toolUse) ?? []

      for (const item of content) {
        const key = (Object.keys(item) as (keyof StreamContentItem)[]).find(
          (k) => streamContentHandlers[k]
        )

        if (key) {
          streamContentHandlers[key]?.(item)
        }
      }
    }

    if (message?.role === 'user') {
      for (const item of message.content ?? []) {
        if (item.toolResult?.status === 'success') {
          try {
            const resultText = item.toolResult.content[0]?.text
            const products = JSON.parse(resultText)

            if (Array.isArray(products)) {
              addMessage({
                type: 'product-results',
                content: `Found ${products.length} products`,
                products,
              })
            }
          } catch {
            // ignore malformed tool results
          }
        }
      }
    }
  }

  const sendMessage = async (
    messageToSend: string,
    skipStorage = false,
    source: 'text' | 'prompt' = 'text'
  ) => {
    if (!messageToSend.trim() || isLoading) return

    abortActiveRequest()
    productRef.current = []
    const controller = new AbortController()
    abortControllerRef.current = controller

    agentMessageCountRef.current = agentMessageCountRef.current ?? 0

    setIsLoading(true)

    if (!skipStorage) {
      addMessage({ type: 'user', content: messageToSend, source })
    }

    try {
      eventSourceRef.current?.close()

      const analyticsMessageId = String((agentMessageCountRef.current ?? 0) + 2)
      await streamShopAssistResponse(
        {
          prompt: messageToSend,
          sessionId,
          userContext: getUserContext(),
          locale,
          clientMetadata: { analytics_message_id: analyticsMessageId },
        },
        parseEventData,
        {
          signal: controller.signal,
          enableShopAssistAkamai,
          streamReadTimeoutMs,
          shopAssistAkamaiDomain,
        }
      )
    } catch (error) {
      let errorMessage = formatMessage({
        id: 'shopAssistChat.error.retry',
        defaultMessage: 'Try entering your message again.',
      })

      if (error instanceof Error && error.message === 'NETWORK_ERROR') {
        errorMessage = formatMessage({
          id: 'shopAssistChat.error.network',
          defaultMessage: 'Please check your internet connection and try again.',
        })
      }

      addMessage({
        type: 'error',
        content: messageToSend,
        errorMessage,
        canRetry: true,
      })
      const errorCode =
        error instanceof Error && 'code' in error ? (error as { code?: string }).code : undefined

      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
      if (errorCode === 'ERR_ABRUPT_STREAM_END') {
        return
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
      setIsLoading(false)
    }
  }

  const clearConversation = (): string => {
    abortActiveRequest()
    const newSessionId = generateSessionId()
    setMessages([])
    setSessionId(newSessionId)
    setIsLoading(false)
    agentMessageCountRef.current = null
    setStoredChatState((prev) => {
      const normalizedState = normalizeStoredState(prev)
      const { [sessionId || '']: _, ...restSessions } = normalizedState.sessions
      return {
        activeSessionId: newSessionId,
        sessions: {
          ...restSessions,
          [newSessionId]: createEmptySession(),
        },
      }
    })
    return newSessionId
  }

  const loadSession = (targetSessionId: string) => {
    if (!targetSessionId) return
    const normalizedState = normalizeStoredState(storedChatState)
    const sessionData = normalizedState.sessions[targetSessionId]
    if (!sessionData) return

    setSessionId(targetSessionId)
    setMessages(deserializeMessages(sessionData.messages))
    const maxAgentMessageId = getMaxAgentMessageId(sessionData.messages)
    agentMessageCountRef.current = maxAgentMessageId
    setStoredChatState({ ...normalizedState, activeSessionId: targetSessionId })
  }

  const clearSession = (targetSessionId?: string) => {
    const sessionToClear = targetSessionId || sessionId
    if (!sessionToClear) return

    setStoredChatState((prev) => {
      const normalizedState = normalizeStoredState(prev)
      const { [sessionToClear]: _, ...restSessions } = normalizedState.sessions
      const nextActiveSessionId =
        normalizedState.activeSessionId === sessionToClear ? null : normalizedState.activeSessionId
      return {
        activeSessionId: nextActiveSessionId,
        sessions: restSessions,
      }
    })

    if (sessionToClear === sessionId) {
      setMessages([])
      setSessionId(null)
      agentMessageCountRef.current = null
    }
  }

  return {
    messages,
    isLoading,
    sessionId,
    sessionIds: Object.keys(normalizeStoredState(storedChatState).sessions),
    messagesEndRef,
    sendMessage,
    clearConversation,
    loadSession,
    clearSession,
  }
}
