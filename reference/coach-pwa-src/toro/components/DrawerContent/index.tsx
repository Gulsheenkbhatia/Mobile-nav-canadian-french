import { DrawerContent as ChakraUIDrawerContent, PropsOf } from '@chakra-ui/react'

export default function DrawerContent(props: PropsOf<typeof ChakraUIDrawerContent>) {
  return <ChakraUIDrawerContent {...props} />
}
