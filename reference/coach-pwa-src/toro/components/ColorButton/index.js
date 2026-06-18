import React, { memo } from 'react'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'
import { useAtomValue } from 'jotai/utils'

function ColorButton({
  src,
  alt,
  color,
  selected,
  disabled,
  size = 'sm',
  ignoreHover,
  allowClickOnDisabled,
  sx,
  fetchFilterUrl,
  colorText,
  ...props
}) {
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  let className = ''
  if (selected) {
    className = `${className} selected`
  }
  if (disabled && allowClickOnDisabled) {
    className = `${className} allow-disabled`
  }
  const { isDesktop } = useViewportType()

  return (
    <Button
      variant="color-option"
      size={size}
      disabled={!allowClickOnDisabled && disabled}
      className={className}
      href={fetchFilterUrl}
      sx={
        ignoreHover
          ? {
              '&:hover': null,
              ...sx,
            }
          : sx
      }
      {...props}
    >
      {src ? (
        <Image src={src} alt={alt} w="100%" h="100%" lazy={!isDesktop} tabIndex="0" />
      ) : color === null ? (
        <Box />
      ) : color?.split(',').length > 1 ? (
        <Box style={{ background: `linear-gradient(45deg,${color})` }} />
      ) : (
        <Box bg={color} />
      )}
      {isCompletePlpV3Desktop && (
        <Box as="span" style={{ width: '55px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {colorText}
        </Box>
      )}
    </Button>
  )
}

export default memo(ColorButton)
