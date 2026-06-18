import { Textarea as ChakraUITextarea, PropsOf } from '@chakra-ui/react'

export default function Textarea(props: PropsOf<typeof ChakraUITextarea>) {
  return <ChakraUITextarea {...props} />
}
