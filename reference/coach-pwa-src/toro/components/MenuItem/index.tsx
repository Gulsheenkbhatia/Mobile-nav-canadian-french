import { MenuItem as ChakraUIMenuItem, PropsOf } from '@chakra-ui/react'

export default function MenuItem({ ...props }: PropsOf<typeof ChakraUIMenuItem>) {
  return <ChakraUIMenuItem {...props} />
}
