import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import Button from 'toro/components/Button'
import Text from 'toro/components/Text'
import Popover from 'toro/components/Popover'
import PopoverTrigger from 'toro/components/PopoverTrigger'
import PopoverContent from 'toro/components/PopoverContent'
import PopoverBody from 'toro/components/PopoverBody'
import PopoverArrow from 'toro/components/PopoverArrow'
import useStyles from 'toro/hooks/useStyles'
import type { PopoverProps } from '@chakra-ui/react'

type ChatLauncherTooltipProps = Pick<PopoverProps, 'children' | 'placement' | 'isOpen' | 'onClose'>

const TOOLTIP_AUTO_DISMISS_MS = 5000

const ChatLauncherTooltip = ({
  children,
  placement = 'top',
  isOpen,
  onClose,
}: ChatLauncherTooltipProps) => {
  const styles = useStyles()
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (!isOpen) return
    const timeout = setTimeout(onClose, TOOLTIP_AUTO_DISMISS_MS)
    return () => clearTimeout(timeout)
  }, [isOpen, onClose])

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement={placement}
      closeOnBlur={false}
      closeOnEsc
      isLazy
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent sx={styles.chatLauncherTooltip} _focus={{ outline: 'none' }}>
        <PopoverArrow bg="var(--color-primary)" />
        <PopoverBody sx={styles.chatLauncherTooltipBody}>
          <Text sx={styles.chatLauncherTooltipText} variant="primary" size="xs">
            {formatMessage(
              {
                id: 'shopAssistChat.chatLauncher.tooltipText',
                defaultMessage:
                  "<strong>Your personal AI gifting expert —</strong> ready to help you find something they'll truly love.",
              },
              {
                strong: (chunks) => <strong>{chunks}</strong>,
              }
            )}
          </Text>
          <Button
            size="sm"
            variant="primary"
            onClick={onClose}
            data-qa="chat-launcher-tooltip-cta"
            sx={styles.chatLauncherTooltipCta}
          >
            {formatMessage({
              id: 'shopAssistChat.chatLauncher.tooltipCta',
              defaultMessage: 'Got it',
            })}
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ChatLauncherTooltip
