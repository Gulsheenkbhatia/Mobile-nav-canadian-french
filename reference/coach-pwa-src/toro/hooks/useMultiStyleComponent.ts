import { useMultiStyleConfig } from '@chakra-ui/react'
import React from 'react'
export const enum MultiStyleComponent {
  icons = 'Icons',
}
export default function (themeKey: MultiStyleComponent) {
  return useMultiStyleConfig(themeKey) as Record<string, React.ElementType>
}
