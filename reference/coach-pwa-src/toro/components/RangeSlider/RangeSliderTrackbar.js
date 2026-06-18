import { useAtomValue } from 'jotai/utils'
import React from 'react'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'
import Box from 'toro/components/Box'
import useTheme from 'toro/hooks/useTheme'

function RangeSliderTrackbar({ values, limits, thumbSize, thumbSizeActive }) {
  const theme = useTheme()
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  const inactiveColor = isCompletePlpV3Desktop
    ? 'var(--color-neutral-light-2)'
    : theme.colors.main.inactive
  const colors = [inactiveColor, theme.colors.main.black, inactiveColor]

  function getTrackBackground() {
    // sort values ascending
    const progress = values
      .slice()
      .sort((a, b) => a - b)
      .map((value) => ((value - limits[0]) / (limits[1] - limits[0])) * 100)
    const middle = progress.reduce(
      (acc, point, index) => `${acc}, ${colors[index]} ${point}%, ${colors[index + 1]} ${point}%`,
      ''
    )
    return `linear-gradient(to right, ${colors[0]} 0%${middle}, ${colors[colors?.length - 1]} 100%)`
  }

  return (
    <Box
      position="absolute"
      right="0"
      alignSelf="center"
      height="2px"
      bg={getTrackBackground()}
      sx={
        isCompletePlpV3Desktop
          ? { marginX: '3px', left: 0 }
          : {
              width: `calc(100% - ${thumbSizeActive - thumbSize / 2}px)`,
              left: `${thumbSizeActive - thumbSize}px`,
            }
      }
    />
  )
}

export default RangeSliderTrackbar
