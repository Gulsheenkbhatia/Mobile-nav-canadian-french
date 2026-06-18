import { UnorderedList as ChakraUIUnorderedList, PropsOf } from '@chakra-ui/react'

export default function UnorderedList(props: PropsOf<typeof ChakraUIUnorderedList>) {
  return <ChakraUIUnorderedList {...props} />
}
