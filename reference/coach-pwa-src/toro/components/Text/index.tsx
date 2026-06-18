import React, { forwardRef } from 'react'
import { Text as ChakraUIText, TextProps as ChakraUITextProps } from '@chakra-ui/react'
import { colors } from 'toro/theme'

/**
 * TORO TextToro
 *
 * @param {variant} possible values: ['primary', 'secondary', 'body-primary', 'body-text-secondary', 'cta-primary', 'eyebrow-primary']
 * @param {size} possible values: xxl - xs for 'primary', 'secondary' variants; lg - sm for 'body-text' variants; md - sm for cta-primary; bld, md eyebrow-primary;
 */

export type TextProps = ChakraUITextProps & { name?: string }

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, size = 'md', variant = 'primary', ...props }, ref) => {
    return (
      <ChakraUIText
        ref={ref}
        variant={variant}
        size={variant === 'primary' ? size : `${variant}-${size}`}
        color={colors.main.black}
        {...props}
      >
        {children}
      </ChakraUIText>
    )
  }
)

export default Text
