import React, { forwardRef } from 'react'
import { Button as ChakraUIButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react'
import type Theme from './themes/theme'
import type ThemeKT from './themes/theme-kate-spade'

export type ButtonProps = Omit<ChakraButtonProps, 'variant' | 'size'> & {
  variant?:
    | ChakraButtonProps['variant']
    | keyof typeof Theme['variants']
    | keyof typeof ThemeKT['variants']
  size?: ChakraButtonProps['size'] | keyof typeof Theme['sizes'] | keyof typeof ThemeKT['sizes']
  onClick?: ChakraButtonProps['onClick'] | ((e: MouseEvent) => void | Promise<void>)
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, size, variant, ...props }, ref) => {
    function getCustomSize() {
      if (variant === 'plain' || variant === 'color-option' || variant === 'icon-only') {
        if (size && !(size as string).startsWith(variant)) {
          return `${variant}-${size}`
        }
      }
      return size
    }

    return (
      <ChakraUIButton ref={ref} variant={variant} size={getCustomSize()} {...props}>
        {children}
      </ChakraUIButton>
    )
  }
)

export default Button
