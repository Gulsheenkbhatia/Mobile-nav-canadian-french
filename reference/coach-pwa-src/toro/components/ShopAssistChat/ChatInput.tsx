import React, { useState, useCallback, useEffect, memo, forwardRef, useRef } from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Input from 'toro/components/Input'
import Button from 'toro/components/Button'
import useStyles from 'toro/hooks/useStyles'
import { type ChatInputProps } from 'toro/components/ShopAssistChat/types'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { setActiveMessageIdAtom } from 'store/shop-assist-chat.atom'
import { useUpdateAtom } from 'jotai/utils'
import { isAndroidDevice } from 'toro/helpers/isMobileDevice'

const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(
  ({ clearInput, onSend, placeholder, disabled, className = '' }, ref) => {
    const { formatMessage } = useIntl()
    const [inputValue, setInputValue] = useState('')
    const styles = useStyles()
    const { SendIcon } = useMultiStyleConfig('Icons')
    const setErrorMessageId = useUpdateAtom(setActiveMessageIdAtom)

    const inputRef = useRef<HTMLInputElement | null>(null)

    const isSendDisabled = disabled || !inputValue.trim()
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    }, [])

    useEffect(() => {
      setInputValue('')
    }, [clearInput])

    useEffect(() => {
      if (!disabled && !isAndroidDevice()) {
        requestAnimationFrame(() => {
          inputRef.current?.focus()
        })
      }
    }, [disabled])

    const handleSend = useCallback(() => {
      setErrorMessageId('')
      if (!isSendDisabled && onSend) {
        onSend(inputValue)
        setInputValue('')
      }
    }, [isSendDisabled, onSend, setErrorMessageId, inputValue])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          handleSend()
        }
      },
      [handleSend]
    )

    return (
      <Box
        ref={ref}
        className={`chat-input ${className}`}
        sx={styles.chatInputContainer}
        role="region"
        aria-label={formatMessage({
          id: 'shopAssistChat.aria.inputRegion',
          defaultMessage: 'Message input area',
        })}
      >
        <Box sx={styles.chatInputWrapper}>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            isDisabled={disabled}
            variant="flyout"
            sx={styles.chatInput}
            className="chat-input__field"
            aria-label={formatMessage({
              id: 'shopAssistChat.aria.messageInput',
              defaultMessage: 'Type your message',
            })}
            placeholder={placeholder}
            aria-describedby={!disabled ? 'chat-input-help' : undefined}
            autoComplete="off"
            data-qa="input-prompt"
            spellCheck
          />

          <Box sx={styles.chatSendButtonWrapper} className="chat-input__send-button-wrapper">
            <Button
              onClick={handleSend}
              disabled={isSendDisabled}
              sx={styles.chatSendButton}
              aria-label={formatMessage({
                id: isSendDisabled
                  ? 'shopAssistChat.aria.sendDisabled'
                  : 'shopAssistChat.aria.sendEnabled',
                defaultMessage: isSendDisabled ? 'Send disabled' : 'Send message',
              })}
              type="button"
              data-qa="ai-send-message"
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }
)

export default memo(ChatInput)
