import React from 'react'
import useTheme from 'toro/hooks/useTheme'
import Flex from 'toro/components/Flex'
import { ChatIcon } from 'toro/icons'

const LiveChat = () => {
  const theme = useTheme()
  const fireLiveChat = () => {
    if (window.embedded_svc) {
      window.embedded_svc.onHelpButtonClick()
    }
  }

  return (
    <Flex
      alignItems="center"
      sx={{
        padding: 0,
        position: 'fixed',
        right: '20px',
        bottom: '146px',
        zIndex: 1000,
        borderRadius: '40px',
        height: '38px',
        width: 'auto',
        backgroundColor: theme.colors.main.white,
        '&:hover': {
          backgroundColor: theme.colors.main.white,
        },
        color: theme.colors.main.black,
        boxShadow: theme.boxShadow.button,
      }}
      onClick={fireLiveChat}
    >
      <ChatIcon style={{ transform: `scale(0.50)` }} />
    </Flex>
  )
}

export default LiveChat
