import { DrawerHeader as ChakraUIDrawerHeader, PropsOf } from '@chakra-ui/react'

export default function DrawerHeader(props: PropsOf<typeof ChakraUIDrawerHeader>) {
  return <ChakraUIDrawerHeader {...props} />
}
