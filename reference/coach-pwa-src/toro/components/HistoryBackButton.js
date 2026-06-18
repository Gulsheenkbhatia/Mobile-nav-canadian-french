import React from 'react'
import Flex from 'toro/components/Flex'
import PrevArrow from 'toro/components/Certona/Arrows/Left'
import useTheme from 'toro/hooks/useTheme'

const HistoryBackButton = () => {
  const theme = useTheme()
  return (
    <Flex
      alignItems="center"
      sx={{
        padding: '0 7px 0 0',
        position: 'fixed',
        left: '1px',
        bottom: '50px',
        zIndex: 99999,
        height: '38px',
        backgroundColor: theme.colors.main.black,
        color: theme.colors.main.white,
        '& .leftArrowStyle': {
          display: 'contents',
        },
        '& svg': {
          transform: 'scale(0.7)',
        },
        '& path': {
          fill: theme.colors.main.white,
        },
      }}
      onClick={() => window.history.back()}
    >
      <PrevArrow />
      BACK
    </Flex>
  )
}

export default HistoryBackButton
