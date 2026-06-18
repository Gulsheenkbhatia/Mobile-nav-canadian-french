import React, { memo, useState, useCallback, useMemo } from 'react'
import { IconButton } from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useStyles from 'toro/hooks/useStyles'
import { shopAssistChatStateAtom, setMessageFeedbackAtom } from 'store/shop-assist-chat.atom'
import { useAtomValue } from 'jotai/utils'
import { useAtom } from 'jotai'
import { submitFeedback } from 'toro/components/ShopAssistChat/services/shopAssistAPI'
import { getFeedbackContent } from 'toro/components/ShopAssistChat/utils/index'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtomSetter } from 'toro/helpers/jotai/useAtomSetter'
import type { FeedbackValue, ResponseFeedbackProps } from 'toro/components/ShopAssistChat/types'
import useAnalytics from 'toro/analytics/useAnalytics'

const ResponseFeedback = ({ messageId }: ResponseFeedbackProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setMessageFeedback = useAtomSetter(setMessageFeedbackAtom)

  const { formatMessage } = useIntl()
  const styles = useStyles()
  const { ThumbUpFilled, ThumbUp, ThumbDownFilled, ThumbDown } = useMultiStyleConfig('Icons')

  const { activeSessionId, sessions } = useAtomValue(shopAssistChatStateAtom)
  const analytics = useAnalytics()
  const {
    aiGiftConcierge: {
      aiGiftConciergeData: { enableShopAssistAkamai = false, shopAssistAkamaiDomain = '' } = {},
    } = {},
  } = usePreference({
    aiGiftConcierge: ['aiGiftConciergeData'],
  })
  const [, setStoredChatState] = useAtom(shopAssistChatStateAtom)

  const feedbackContent = useMemo(() => {
    const messages = sessions[activeSessionId]?.messages
    return messages ? getFeedbackContent(messages) : ''
  }, [sessions, activeSessionId])

  const feedbackMessage = useMemo(() => {
    if (!activeSessionId) return null
    return sessions[activeSessionId]?.messages.find((m) => m.id === messageId)
  }, [sessions, activeSessionId, messageId])

  const feedback = feedbackMessage?.feedback ?? null

  const updateFeedback = useCallback(
    (value: FeedbackValue | null) => {
      if (!activeSessionId) return
      setMessageFeedback({
        sessionId: activeSessionId,
        messageId,
        feedback: value,
      })
    },
    [activeSessionId, messageId, setStoredChatState]
  )

  const submit = useCallback(
    async (value: FeedbackValue) => {
      setIsSubmitting(true)
      try {
        await submitFeedback(
          {
            feedback: value,
            sessionId: activeSessionId,
            messageContent: feedbackContent,
          },
          { enableShopAssistAkamai, shopAssistAkamaiDomain }
        )
        updateFeedback(value)

        analytics.send('agentInteraction', {
          eventAction: 'feedback',
          eventLabel: value === 'thumbs_up' ? 'positive' : 'negative',
          agentSessionId: activeSessionId,
        })
      } catch (error) {
        console.error('Failed to submit feedback', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [activeSessionId, feedbackContent, enableShopAssistAkamai, updateFeedback]
  )

  const handleClick = useCallback(
    (value: FeedbackValue) => {
      if (!isSubmitting && feedback !== value) {
        submit(value)
      }
    },
    [feedback, isSubmitting, submit]
  )
  return (
    <Box sx={styles.feedbackContainer}>
      <Text sx={styles.feedbackLabel} data-qa="feedback-text">
        {formatMessage({
          id: 'shopAssistChat.feedback.question',
          defaultMessage: 'How was my answer?',
        })}
      </Text>

      <Box sx={styles.feedbackButtonContainer}>
        <IconButton
          aria-label={formatMessage({
            id: 'shopAssistChat.feedback.thumbup',
            defaultMessage: 'Thumbs up',
          })}
          size="m"
          variant="ghost"
          isDisabled={isSubmitting}
          data-qa="thumbs-up"
          icon={
            feedback === 'thumbs_up' ? (
              <ThumbUpFilled style={styles.thumbIcons} />
            ) : (
              <ThumbUp style={styles.thumbIcons} />
            )
          }
          sx={styles.thumbIconCta}
          onClick={() => handleClick('thumbs_up')}
        />

        <IconButton
          aria-label={formatMessage({
            id: 'shopAssistChat.feedback.thumbdown',
            defaultMessage: 'Thumbs down',
          })}
          size="m"
          variant="ghost"
          isDisabled={isSubmitting}
          sx={styles.thumbIconCta}
          data-qa="thumbs-down"
          icon={
            feedback === 'thumbs_down' ? (
              <ThumbDownFilled style={styles.thumbIcons} />
            ) : (
              <ThumbDown style={styles.thumbIcons} />
            )
          }
          onClick={() => handleClick('thumbs_down')}
        />
      </Box>
    </Box>
  )
}

export default memo(ResponseFeedback)
