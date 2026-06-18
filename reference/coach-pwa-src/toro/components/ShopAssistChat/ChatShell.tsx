import React, { useCallback, useEffect, useState } from 'react'
import { iOS } from 'toro/components/SitePreview/TemplateEditor/lib/utilities'
import { Global } from '@emotion/react'
import Box from 'toro/components/Box'
import useStyles from 'toro/hooks/useStyles'
import useViewportType from 'toro/hooks/useViewportType'
import { type ChatShellProps } from 'toro/components/ShopAssistChat/types'
import { promptGradientAngleProperty } from 'toro/components/ShopAssistChat/themes/theme-kate-spade'
import { useLockBodyScroll } from 'toro/hooks/useLockBodyScroll'

const shellBgMap = {
  animation: 'var(--color-neutral-light-1)',
  starter: '#FFA097',
  conversation: 'var(--color-neutral-light-1)',
}

const ChatShell = ({ children, isClosing, onCloseComplete, mode }: ChatShellProps) => {
  const { isMobile } = useViewportType()
  const styles = useStyles()
  const [hasAnimated, setHasAnimated] = useState(true)

  useLockBodyScroll(isMobile)

  useEffect(() => {
    setHasAnimated(false)
    if (!isClosing && mode === 'starter') {
      setHasAnimated(true) // only once after mount
    }
  }, [isClosing, mode])

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget || !isClosing || !onCloseComplete) return
      onCloseComplete()
    },
    [isClosing, onCloseComplete]
  )

  return (
    <>
      <Global styles={promptGradientAngleProperty} />
      <Box
        {...(iOS ? { key: mode } : {})}
        sx={{
          ...styles.shellContainer,
          backgroundColor: shellBgMap[mode],
        }}
        className={[hasAnimated ? 'animate-in' : '', isClosing ? 'is-closing' : ''].join(' ')}
        onAnimationEnd={handleAnimationEnd}
        data-qa="chat-shell"
      >
        {children}
      </Box>
    </>
  )
}

export default ChatShell
