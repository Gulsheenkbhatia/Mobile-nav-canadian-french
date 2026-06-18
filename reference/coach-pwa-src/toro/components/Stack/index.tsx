import { Stack as ChakraUIStack, PropsOf } from '@chakra-ui/react'

// This might need to be expanded
// to account for HStack and VStack

export default function Stack(props: PropsOf<typeof ChakraUIStack>) {
  return <ChakraUIStack {...props} />
}
