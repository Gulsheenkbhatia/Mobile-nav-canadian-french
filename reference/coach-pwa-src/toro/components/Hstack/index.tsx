import { HStack as ChakraUIHstack, PropsOf } from '@chakra-ui/react'

export default function HStack(props: PropsOf<typeof ChakraUIHstack>) {
  return <ChakraUIHstack {...props} />
}
