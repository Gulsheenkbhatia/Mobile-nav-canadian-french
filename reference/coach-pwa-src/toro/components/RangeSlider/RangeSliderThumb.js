import React from 'react'
import Box from 'toro/components/Box'
import useTheme from 'toro/hooks/useTheme'
import useViewportType from 'toro/hooks/useViewportType'
import { RangeSliderDotIcon } from 'toro/icons'
import { useAtomValue } from 'jotai/utils'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'

function RangeSliderThumb({ position, active, onGrab, thumbSize, thumbSizeActive, ...props }) {
  const theme = useTheme()
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  const { isMobile } = useViewportType()

  const translate = [
    active ? position - thumbSizeActive / 2 : position - thumbSize / 2,
    active ? (thumbSize - thumbSizeActive) / 2 : 0,
  ]

  function handleGrab(e) {
    onGrab && onGrab(e)
  }

  return (
    <Box
      role="slider"
      position="absolute"
      bg={theme.colors.main.white}
      border={isCompletePlpV3Desktop ? '' : `2px solid ${theme.colors.main.black}`}
      w={`${active ? thumbSizeActive : thumbSize}px`}
      h={`${active ? thumbSizeActive : thumbSize}px`}
      borderRadius="50%"
      cursor={'pointer'}
      transform={`translate(${translate[0]}px, ${translate[1]}px)`}
      draggable={false}
      userSelect="none"
      onMouseDown={handleGrab}
      onTouchStart={handleGrab}
      className={`
        ${isMobile ? 'has-touch' : ''}
      `}
      sx={{
        touchAction: 'none',
        '&.has-touch:after': {
          content: '""',
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          bottom: '-4px',
          left: '-4px',
          borderRadius: '50%',
        },
      }}
      {...props}
    >
      {isCompletePlpV3Desktop && (
        <RangeSliderDotIcon
          width={`${active ? thumbSizeActive : thumbSize}px`}
          height={`${active ? thumbSizeActive : thumbSize}px`}
        />
      )}
    </Box>
  )
}

export default RangeSliderThumb
