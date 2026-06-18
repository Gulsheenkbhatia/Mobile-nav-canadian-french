import { keyframes } from '@emotion/react'
import { pdpV7EntranceAnimationTheme } from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation/theme/theme-kate-spade'

const { translateFromTop, translateFromBottom } = pdpV7EntranceAnimationTheme.distances

export const pdpV7EntranceFromTop = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, ${translateFromTop}, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

export const pdpV7EntranceFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, ${translateFromBottom}, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

export const pdpV7EntranceFromCenter = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
