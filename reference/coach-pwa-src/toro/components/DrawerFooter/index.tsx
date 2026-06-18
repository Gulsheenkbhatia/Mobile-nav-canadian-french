import { DrawerFooter as ChakraUIDrawerFooter, PropsOf } from '@chakra-ui/react'

export default function DrawerFooter({ ...props }: PropsOf<typeof ChakraUIDrawerFooter>) {
  return <ChakraUIDrawerFooter {...props} />
}
