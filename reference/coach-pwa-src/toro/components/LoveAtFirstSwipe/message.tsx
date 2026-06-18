import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import { useIntl } from 'react-intl'

export default function LoveAtFirstSwipeMessage({
  message,
  onStartOver,
}: {
  message: string
  onStartOver: () => void
}) {
  const style = useStyleConfig('LoveAtFirstSwipe')
  const { formatMessage } = useIntl()
  return (
    <Box sx={style.messageContainer}>
      <Text sx={style.message}>{message}</Text>
      <Box sx={style.messageControls}>
        <Button sx={style.startOverButton} onClick={onStartOver}>
          {formatMessage({
            id: 'loveAtFirstSwipe.buttonStartOver',
            defaultMessage: 'Start over',
          })}
        </Button>
      </Box>
    </Box>
  )
}
