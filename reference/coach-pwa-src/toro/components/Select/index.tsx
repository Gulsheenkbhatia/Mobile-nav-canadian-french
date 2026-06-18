import { Select as ChakraUISelect, PropsOf } from '@chakra-ui/react'

export default function Select(props: PropsOf<typeof ChakraUISelect>) {
  return <ChakraUISelect {...props} />
}
