import React, { memo, forwardRef } from 'react'
import { useIntl } from 'react-intl'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import useStyles from 'toro/hooks/useStyles'
import { ChevronBoldDownIcon } from 'toro/icons'
import { type ChatHeaderProps } from 'toro/components/ShopAssistChat/types'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const headerBgMap = {
  animation: 'var(--color-neutral-light-1)',
  starter: '#FFA097',
  conversation:
    'linear-gradient(180deg, var(--color-neutral-light-1) 0%, rgba(240, 240, 240, 0.95) 50%, rgba(240, 240, 240, 0) 100%)',
}

export const ChatHeader = forwardRef<HTMLDivElement, ChatHeaderProps>(
  ({ onClose, onNew, mode }, ref) => {
    const { formatMessage } = useIntl()
    const styles = useStyles()
    const { NewChatIcon } = useMultiStyleConfig('Icons')

    return (
      <Box
        ref={ref}
        sx={styles.headerContainer}
        className="header-container"
        bg={headerBgMap[mode] || headerBgMap.conversation}
      >
        <Button onClick={onNew} variant="ghost" sx={styles.newChatButton} data-qa="new-chat">
          <NewChatIcon />
          {formatMessage({
            id: 'shopAssistChat.newChat',
            defaultMessage: 'New Chat',
          })}
        </Button>

        <Box sx={styles.actions}>
          <Button
            onClick={onClose}
            variant="ghost"
            sx={styles.collapseButton}
            aria-label={formatMessage({
              id: 'shopAssistChat.collapse',
              defaultMessage: 'Close chat',
            })}
            data-qa="chat-close"
          >
            <ChevronBoldDownIcon width="24px" height="24px" />
          </Button>
        </Box>
      </Box>
    )
  }
)

export default memo(ChatHeader)
