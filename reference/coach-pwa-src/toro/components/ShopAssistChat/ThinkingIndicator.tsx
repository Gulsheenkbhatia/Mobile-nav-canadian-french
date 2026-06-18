import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { type MessageDescriptor, useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import useStyles from 'toro/hooks/useStyles'
import { type ThinkingIndicatorProps } from 'toro/components/ShopAssistChat/types'

const LoadingIcon = dynamic(
  () => import('@tapestry-inc/design-tokens/kate-spade/icon/object/spade.svg')
)

const THINKING_MESSAGES: MessageDescriptor[] = [
  {
    id: 'shopAssistChat.thinking.message1',
    defaultMessage: 'Thinking of something special',
  },
  {
    id: 'shopAssistChat.thinking.message2',
    defaultMessage: 'Looking for the right fit',
  },
  {
    id: 'shopAssistChat.thinking.message3',
    defaultMessage: 'Adding a thoughtful touch',
  },
  {
    id: 'shopAssistChat.thinking.message4',
    defaultMessage: 'Getting closer to the perfect gift',
  },
]

let nextThinkingMessageIndex = 0

function getNextThinkingMessage(): MessageDescriptor {
  const len = THINKING_MESSAGES.length
  const index = nextThinkingMessageIndex % len
  nextThinkingMessageIndex = (index + 1) % len
  return THINKING_MESSAGES[index]
}

const ThinkingIndicator = ({ className }: ThinkingIndicatorProps) => {
  const { formatMessage } = useIntl()
  const styles = useStyles()
  const [thinkingMessage] = useState(() => getNextThinkingMessage())

  return (
    <Box sx={styles.thinkingWrapper} className={className}>
      <Box sx={styles.thinkingContainer}>
        <Box sx={styles.spadeIcon}>
          <LoadingIcon width="15px" height="13px" />
        </Box>

        <Text sx={styles.thinkingText}>{formatMessage(thinkingMessage)}</Text>
      </Box>
    </Box>
  )
}

export default ThinkingIndicator
