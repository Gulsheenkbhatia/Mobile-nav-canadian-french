import { Drawer as ChakraUIDrawer, PropsOf } from '@chakra-ui/react'

interface DrawerProps extends PropsOf<typeof ChakraUIDrawer> {
  variant?: string
  size?: string
}

export default function Drawer({ children, variant, size, ...props }: DrawerProps) {
  let _size = size
  if (variant === 'flyout') {
    _size = `${variant}-${size}`
  }

  return (
    <ChakraUIDrawer variant={variant} size={_size} {...props}>
      {children}
    </ChakraUIDrawer>
  )
}
