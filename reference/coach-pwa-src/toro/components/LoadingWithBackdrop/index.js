import CircularProgress from 'toro/components/CircularProgress'
import Box from 'toro/components/Box'
import useTheme from 'toro/hooks/useTheme'
import { memo } from 'react'

function LoadingWithBackdrop(props) {
  const theme = useTheme()
  const { position, zIndex } = props

  return (
    <Box
      position={position || 'fixed'}
      top={0}
      left={0}
      bottom={0}
      right={0}
      bg={theme.colors.main.white}
      opacity="0.5"
      zIndex={zIndex || theme.zIndex.toast}
    >
      <CircularProgress
        isIndeterminate
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color={theme.colors.main.black}
        thickness="3px"
        size="100px"
        {...props}
      />
    </Box>
  )
}

export default memo(LoadingWithBackdrop)
