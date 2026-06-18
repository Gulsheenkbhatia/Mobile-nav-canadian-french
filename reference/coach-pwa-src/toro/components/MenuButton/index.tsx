import { MenuButton as ChakraUIMenuButton, MenuButtonProps } from '@chakra-ui/react'

export default function MenuButton({ ...props }: MenuButtonProps) {
  return <ChakraUIMenuButton {...props} />
}
