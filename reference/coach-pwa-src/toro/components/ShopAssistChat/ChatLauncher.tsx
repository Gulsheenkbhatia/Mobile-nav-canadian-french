import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { keyframes } from '@emotion/react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Text from 'toro/components/Text'
import useStyles from 'toro/hooks/useStyles'
import { type ChatLauncherProps } from 'toro/components/ShopAssistChat/types'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import {
  chatLauncherTextCollapsedAtom,
  chatLauncherTooltipDismissedAtom,
  stickyAiChatAtom,
} from 'store/shop-assist-chat.atom'
import usePreference from 'toro/hooks/usePreference_new'
import ChatLauncherTooltip from 'toro/components/ShopAssistChat/ChatLauncherTooltip'
import useStickyAiEntryPoint from 'toro/components/ShopAssistChat/hooks/useStickyAiEntryPoint'

const FADE_DELAY_MS = 500

const createChatLauncherTextWidthCollapse = (width: number) =>
  keyframes`
  from { width: ${width}px; }
  to { width: 0; }
`

const ChatLauncher = ({ onOpen, tooltipPlacement = 'top' }: ChatLauncherProps) => {
  const { formatMessage } = useIntl()
  const styles = useStyles()
  const { MagicIcon, MinusIcon } = useMultiStyleConfig('Icons')
  const storedCollapsed = useAtomValue(chatLauncherTextCollapsedAtom)
  const setTextCollapsed = useUpdateAtom(chatLauncherTextCollapsedAtom)
  const tooltipDismissed = useAtomValue(chatLauncherTooltipDismissedAtom)
  const setTooltipDismissed = useUpdateAtom(chatLauncherTooltipDismissedAtom)
  const stickyAiChatOpened = useAtomValue(stickyAiChatAtom)
  const textWrapperRef = useRef<HTMLDivElement>(null)
  const [textWidth, setTextWidth] = useState<number | null>(null)
  const [isCollapsing, setIsCollapsing] = useState(false)

  // Collapse text when sticky chat is open or user has previously collapsed it
  const textCollapsed = stickyAiChatOpened || storedCollapsed

  const { aiGiftConcierge: { aiGiftConciergeData: { enableLauncherTooltip = false } = {} } = {} } =
    usePreference({
      aiGiftConcierge: ['aiGiftConciergeData'],
    })

  // show tooltip only once the text collapses into pill form
  const isTooltipVisible = enableLauncherTooltip && textCollapsed && !tooltipDismissed

  const isStickyAiChatAllowed = useStickyAiEntryPoint()

  const handleDismissTooltip = useCallback(() => {
    setTooltipDismissed(true)
  }, [setTooltipDismissed])

  useLayoutEffect(() => {
    const el = textWrapperRef.current
    if (!el) return
    setTextWidth(el.offsetWidth)
  }, [])

  const launcherButton = (
    <Button
      onClick={onOpen}
      sx={styles.chatLauncherButton}
      data-qa="open-ai-concierge"
      aria-label={formatMessage({
        id: 'shopAssistChat.chatLauncher.aiChatCtaLabel',
        defaultMessage: 'Ask our AI Gift Assistant',
      })}
    >
      <Box sx={styles.chatLauncherContent}>
        <MagicIcon />
        {!textCollapsed && (
          <Box
            ref={textWrapperRef}
            sx={{
              ...styles.chatLauncherTextWrapper,
              width: textWidth === null ? 'max-content' : textWidth,
              ...(textWidth !== null &&
                isCollapsing && {
                  animation: `${createChatLauncherTextWidthCollapse(
                    textWidth
                  )} ${FADE_DELAY_MS}ms ease-out forwards`,
                }),
            }}
            onAnimationEnd={() => {
              if (isCollapsing) {
                setTextCollapsed(true)
                setIsCollapsing(false)
              }
            }}
          >
            <Text sx={styles.chatLauncherText}>
              {formatMessage({
                id: 'shopAssistChat.chatLauncher.aiChatCtaLabel',
                defaultMessage: 'Ask our AI Gift Assistant',
              })}
            </Text>
            <Box
              sx={styles.minusIconContainer}
              onClick={(e) => {
                e.stopPropagation()
                setIsCollapsing(true)
              }}
            >
              <MinusIcon
                width="16px"
                height="16px"
                style={{
                  stroke: 'var(--color-black-base)',
                  strokeWidth: '1.667px',
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Button>
  )

  return !isStickyAiChatAllowed ? null : (
    <Box sx={styles.chatLauncherContainer}>
      <ChatLauncherTooltip
        placement={tooltipPlacement}
        isOpen={isTooltipVisible}
        onClose={handleDismissTooltip}
      >
        {launcherButton}
      </ChatLauncherTooltip>
    </Box>
  )
}

export default ChatLauncher
