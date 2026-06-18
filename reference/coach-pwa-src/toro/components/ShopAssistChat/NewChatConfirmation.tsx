import React from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import useStyles from 'toro/hooks/useStyles'
import { type NewChatConfirmationProps } from 'toro/components/ShopAssistChat/types'

const NewChatConfirmation = ({ isOpen, onCancel, onConfirm }: NewChatConfirmationProps) => {
  const { formatMessage } = useIntl()
  const styles = useStyles()

  if (!isOpen) return null

  return (
    <Box sx={styles.confirmationLayer}>
      <Box sx={styles.confirmationOverlay} onClick={onCancel} />
      <Box sx={styles.confirmationContainer} role="dialog" aria-modal="true">
        <Box sx={styles.confirmationTitle}>
          {formatMessage({
            id: 'shopAssistChat.confirmNewChat.title',
            defaultMessage: 'Start a new chat?',
          })}
        </Box>

        <Box sx={styles.confirmationBodyContainer}>
          <Box sx={styles.confirmationBody}>
            <Box as="p">
              {formatMessage({
                id: 'shopAssistChat.confirmNewChat.message',
                defaultMessage:
                  'This will clear your current conversation. Do you want to continue?',
              })}
            </Box>
          </Box>
          <Box sx={styles.confirmationButtonContainer}>
            <Button
              variant="ghost"
              onClick={onCancel}
              sx={styles.cancelCta}
              data-qa="ai-cancel-new-chat"
            >
              {formatMessage({
                id: 'shopAssistChat.cancel',
                defaultMessage: 'Cancel',
              })}
            </Button>

            <Button onClick={onConfirm} sx={styles.confirmCta} data-qa="ai-confirm-new-chat">
              {formatMessage({
                id: 'shopAssistChat.confirmNewChat.confirmButton',
                defaultMessage: 'Start a New Chat',
              })}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default NewChatConfirmation
