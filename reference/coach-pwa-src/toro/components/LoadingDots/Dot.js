import React from 'react'
import useTheme from 'toro/hooks/useTheme'
import Box from 'toro/components/Box'
import { KEYFRAMES_DOTS } from 'toro/components/LoadingDots/index'

function Dot({ animationDelay }) {
  const theme = useTheme()

  return (
    <Box
      bg={theme.colors.main.white}
      borderRadius="50%"
      w="6px"
      h="6px"
      m="xs"
      animation={`${KEYFRAMES_DOTS} 600ms infinite alternate ${animationDelay}`}
    />
  )
}

export default Dot
