import React, { useEffect, useRef } from 'react'
import Box from 'toro/components/Box'
import ShopAssistSkeleton from 'toro/components/ShopAssistChat/ShopAssistSkeleton'
import ThinkingIndicator from 'toro/components/ShopAssistChat/ThinkingIndicator'
import ChatMessageItem from 'toro/components/ShopAssistChat/ChatMessageItem'
import useStyles from 'toro/hooks/useStyles'
import { type ChatMessagesProps } from 'toro/components/ShopAssistChat/types'

const ChatMessages = ({ messages, isLoading, onSuggestedReply, offsets }: ChatMessagesProps) => {
  const styles = useStyles()
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const viewportHeight = window.innerHeight - offsets.header - offsets.footer
    const userNodes = container.querySelectorAll<HTMLElement>('[data-type="user"]')
    const lastUserEl = userNodes[userNodes.length - 1]

    if (!lastUserEl) return

    // Measure only nodes AFTER last user
    const allChildren = Array.from(container.children) as HTMLElement[]

    const startIndex = allChildren.findIndex((el) => el === lastUserEl)

    const blockHeight = allChildren.slice(startIndex).reduce((sum, el) => sum + el.offsetHeight, 0)

    const spacer = container.querySelector<HTMLElement>('#dynamic-spacer')
    if (!spacer) return

    // Add whitespace ONLY if needed
    spacer.style.minHeight =
      blockHeight < viewportHeight ? `${viewportHeight - blockHeight}px` : '0px'

    container.scrollTo({
      top: lastUserEl.offsetTop - offsets.header,
      behavior: 'auto',
    })
  }, [messages.length, isLoading])

  return (
    <Box sx={styles.chatMessageContainer} ref={containerRef}>
      {messages?.map((message, index) => (
        <ChatMessageItem
          key={`${message.id} - ${index}`}
          message={message}
          isLast={index === messages?.length - 1}
          onSuggestedReply={onSuggestedReply}
        />
      ))}

      {isLoading && (
        <Box sx={styles.loading}>
          <ThinkingIndicator />
          <ShopAssistSkeleton />
        </Box>
      )}

      <Box id="dynamic-spacer" />
    </Box>
  )
}

export default ChatMessages
