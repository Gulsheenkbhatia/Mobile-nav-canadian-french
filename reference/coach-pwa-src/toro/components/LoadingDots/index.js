import React from 'react'
import { keyframes } from '@emotion/react'
import Dot from 'toro/components/LoadingDots/Dot'
import Flex from 'toro/components/Flex'

export const KEYFRAMES_DOTS = keyframes`
  0% {
    opacity: 1
  }
  50%, 100% {
    opacity: 0.5
  }
`

function LoadingDots() {
  return (
    <Flex>
      <Dot animationDelay="0ms" />
      <Dot animationDelay="300ms" />
      <Dot animationDelay="600ms" />
    </Flex>
  )
}

export default LoadingDots
