import { MenuList as ChakraUIMenuList, PropsOf } from '@chakra-ui/react'

export default function MenuList({ ...props }: PropsOf<typeof ChakraUIMenuList>) {
  return <ChakraUIMenuList {...props}></ChakraUIMenuList>
}
