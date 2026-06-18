import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import ChatHeader from 'toro/components/ShopAssistChat/ChatHeader'
import ChatInput from 'toro/components/ShopAssistChat/ChatInput'
import ChatShell from 'toro/components/ShopAssistChat/ChatShell'
import CircleAnimation from 'toro/components/ShopAssistChat/CircleAnimation'
import ChatStarter from 'toro/components/ShopAssistChat/ChatStarter'
import ChatMessages from 'toro/components/ShopAssistChat/ChatMessages'
import { useShopAssistChat } from 'toro/components/ShopAssistChat/hooks/useShopAssistChat'
import useDisclosure from 'toro/hooks/useDisclosure'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import NewChatConfirmation from 'toro/components/ShopAssistChat/NewChatConfirmation'
import ChatError from 'toro/components/ShopAssistChat/ChatError'
import {
  openShopAssistChatRequestAtom,
  setActiveMessageIdAtom,
  shopAssistAnimationSeenAtom,
  shopAssistChatStateAtom,
} from 'store/shop-assist-chat.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import Box from 'toro/components/Box'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getNormalizedPathname } from 'toro/components/ShopAssistChat/utils'

export type ShopAssistChatDisclosure = {
  isOpen: boolean
  onOpen: (location?: string) => void
  onClose: () => void
}

export type ShopAssistChatContentProps = {
  disclosure: ShopAssistChatDisclosure
  isClosing: boolean
  onCloseComplete: () => void
}

export default function ShopAssistChatContent({
  disclosure,
  isClosing,
  onCloseComplete,
}: ShopAssistChatContentProps) {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  // disclosure for new chat confirmation
  const { isOpen: isConfirmOpen, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure()
  const setErrorMessageId = useUpdateAtom(setActiveMessageIdAtom)

  const { messages, isLoading, sendMessage, clearConversation } = useShopAssistChat(true)

  /* Keeping this for future reference — we might come back to this later. */
  // const hasSeenAnimation = useAtomValue(shopAssistAnimationSeenAtom)

  const setHasSeenAnimation = useUpdateAtom(shopAssistAnimationSeenAtom)

  const headerRef = useRef<HTMLDivElement | null>(null)
  const footerRef = useRef<HTMLDivElement | null>(null)
  const [offsets, setOffsets] = useState({ header: 0, footer: 0 })

  const [clearInput, setClearInput] = useState(false)

  const hasSentOpenAnalyticsRef = useRef(false)
  const [mode, setMode] = useState<'animation' | 'starter' | 'conversation'>('starter')

  const styles = useMultiStyleConfig('AIShopAssistChat', { mode })
  const latestMessage = messages[messages?.length - 1]
  const isError = latestMessage?.type === 'error'

  const { activeSessionId, sessions } = useAtomValue(shopAssistChatStateAtom)
  const eventLocation = useAtomValue(openShopAssistChatRequestAtom)
  const activeSession = sessions[activeSessionId]

  const hasAssistantMessage =
    (activeSession && activeSession?.messages?.some((msg) => msg?.type === 'assistant')) ?? false

  const { isOpen } = disclosure

  useEffect(() => {
    if (mode === 'animation' && isOpen) {
      const timer = setTimeout(() => {
        setHasSeenAnimation(true)
        setMode('starter')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [mode, isOpen])

  useEffect(() => {
    if (messages.length > 0) {
      setMode('conversation')
    }
  }, [messages.length])

  useEffect(() => {
    const measure = () => {
      setOffsets({
        header: headerRef.current?.getBoundingClientRect().height || 0,
        footer: footerRef.current?.getBoundingClientRect().height || 0,
      })
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (isError && !hasAssistantMessage) {
      setErrorMessageId(latestMessage?.id)
    }
  }, [isError, latestMessage, setErrorMessageId])

  useEffect(() => {
    if (!activeSessionId || hasSentOpenAnalyticsRef.current) return

    hasSentOpenAnalyticsRef.current = true

    const hasNoMessages = (activeSession?.messages?.length ?? 0) === 0
    if (eventLocation && hasNoMessages) {
      analytics.send('agentInteraction', {
        eventAction: 'chat initiate',
        eventLabel: getNormalizedPathname(),
        eventLocation,
        agentSessionId: activeSessionId,
      })
    }

    analytics.send('agentInteraction', {
      eventAction: 'chat open',
      eventLabel: getNormalizedPathname(),
      agentSessionId: activeSessionId,
    })
  }, [activeSessionId, analytics, eventLocation, activeSession?.messages?.length])

  const clearChat = useCallback((): string => {
    setErrorMessageId(null)
    const newSessionId = clearConversation()
    setMode('starter')
    return newSessionId
  }, [setErrorMessageId, clearConversation])

  const prefersReducedMotion = useMemo(() => {
    return (
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  const handleClose = useCallback(() => {
    analytics.send('agentInteraction', {
      eventAction: 'chat close',
      eventLabel: getNormalizedPathname(),
      agentSessionId: activeSessionId,
    })
    if (isError && !hasAssistantMessage) {
      clearChat()
    }
    if (prefersReducedMotion) {
      onCloseComplete()
      return
    }
    disclosure.onClose()
  }, [
    analytics,
    activeSessionId,
    isError,
    hasAssistantMessage,
    clearChat,
    prefersReducedMotion,
    onCloseComplete,
    disclosure,
  ])

  const handleSuggestedReply = useCallback(
    (message, skipStorage = false) => {
      sendMessage(message, skipStorage, 'prompt')
      setMode('conversation')
    },
    [sendMessage]
  )

  const openNewChatConfirm = useCallback(() => {
    openConfirm()
    analytics.send('agentInteraction', {
      eventAction: 'new chat',
      eventLabel: 'new chat cta',
      agentSessionId: activeSessionId,
    })
  }, [openConfirm, analytics, activeSessionId])

  const closeNewChatConfirm = useCallback(() => {
    closeConfirm()
    analytics.send('agentInteraction', {
      eventAction: 'new chat',
      eventLabel: 'prompt cancel',
      agentSessionId: activeSessionId,
    })
  }, [closeConfirm, analytics, activeSessionId])

  const handleConfirmNewChat = useCallback(() => {
    setClearInput((prev) => !prev)
    const newSessionId = clearChat()
    closeConfirm()

    analytics.send('agentInteraction', {
      eventAction: 'chat initiate',
      eventLabel: getNormalizedPathname(),
      eventLocation: 'new chat',
      agentSessionId: newSessionId,
    })
    analytics.send('agentInteraction', {
      eventAction: 'new chat',
      eventLabel: 'prompt new chat',
      agentSessionId: newSessionId,
    })
  }, [clearChat, closeConfirm, analytics])

  const handleSend = (message: string) => {
    setMode('conversation')
    sendMessage(message)
  }

  const renderContent = () => {
    switch (mode) {
      case 'animation':
        return <CircleAnimation />

      case 'starter':
        return <ChatStarter onSelectPrompt={handleSuggestedReply} />

      case 'conversation':
      default:
        return (
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            onSuggestedReply={handleSuggestedReply}
            offsets={offsets}
          />
        )
    }
  }

  const placeholder =
    messages.length > 0
      ? formatMessage({
          id: 'shopAssistChat.placeholder.followUp',
          defaultMessage: 'Ask a follow up...',
        })
      : formatMessage({
          id: 'shopAssistChat.placeholder.initial',
          defaultMessage: `Tell me about the gift you're looking for...`,
        })

  return (
    <ChatShell isClosing={isClosing} onCloseComplete={onCloseComplete} mode={mode}>
      {mode !== 'animation' && (
        <ChatHeader ref={headerRef} onClose={handleClose} onNew={openNewChatConfirm} mode={mode} />
      )}

      {renderContent()}

      {isError && !hasAssistantMessage && (
        <Box sx={styles.errorContainer}>
          <ChatError
            errorMessage={latestMessage?.errorMessage}
            buttonLabel={formatMessage({
              id: 'shopAssistChat.error.refresh',
              defaultMessage: 'Refresh',
            })}
            canRetry={latestMessage?.canRetry}
            onRetry={clearChat}
            messageId={latestMessage?.id}
          />
        </Box>
      )}

      {mode !== 'animation' && (
        <ChatInput
          ref={footerRef}
          onSend={handleSend}
          placeholder={placeholder}
          disabled={isLoading}
          clearInput={clearInput}
        />
      )}
      <NewChatConfirmation
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmNewChat}
        onCancel={closeNewChatConfirm}
      />
    </ChatShell>
  )
}
