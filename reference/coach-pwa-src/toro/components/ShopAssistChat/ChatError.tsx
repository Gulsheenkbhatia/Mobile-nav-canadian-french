import React, { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import useStyles from 'toro/hooks/useStyles'
import useAnalytics from 'toro/analytics/useAnalytics'
import { FormErrorOutlineIcon } from 'toro/icons'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { activeMessageIdAtom, setActiveMessageIdAtom } from 'store/shop-assist-chat.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import type { ChatErrorProps } from 'toro/components/ShopAssistChat/types'

const ChatError = ({ messageId, errorMessage, buttonLabel, canRetry, onRetry }: ChatErrorProps) => {
  const { formatMessage } = useIntl()
  const { ReloadIcon } = useMultiStyleConfig('Icons')
  const styles = useStyles()
  const analytics = useAnalytics()

  const errorMessageId = useAtomValue(activeMessageIdAtom)
  const setErrorMessageId = useUpdateAtom(setActiveMessageIdAtom)
  const isErrorVisible = errorMessageId === messageId && (errorMessage || canRetry)

  const handleRetry = useCallback(() => {
    setErrorMessageId('')
    onRetry?.()
  }, [setErrorMessageId, onRetry])

  const title = formatMessage({
    id: 'shopAssistChat.error.title',
    defaultMessage: 'Oops, something didn’t load correctly.',
  })

  const hint =
    errorMessage ??
    formatMessage({
      id: 'shopAssistChat.error.hint',
      defaultMessage: 'Try entering your message again.',
    })

  useEffect(() => {
    if (!isErrorVisible) return

    analytics.send('siteError', {
      eventAction: 'chat error',
      eventLabel: `${title} ${hint}`,
    })
  }, [isErrorVisible, analytics])

  if (!isErrorVisible) {
    return null
  }

  return (
    <Box role="alert" aria-live="polite" sx={styles.errorAlert}>
      <Box sx={styles.errorLeft}>
        <Box aria-hidden="true" sx={styles.errorIcon}>
          <FormErrorOutlineIcon width="24" height="24" />
        </Box>

        <Box sx={styles.errorBody}>
          <Text as="p" sx={styles.errorTitle}>
            {title}
          </Text>
          <Text as="p" sx={styles.errorDescription}>
            {hint}
          </Text>
        </Box>
      </Box>

      {canRetry && (
        <Box>
          <Button
            variant="ghost"
            onClick={handleRetry}
            sx={styles.errorActionButton}
            aria-label={buttonLabel}
          >
            <ReloadIcon width="13" height="13" />

            {buttonLabel}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default ChatError
