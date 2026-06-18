import { Center as ChakraUICenter, PropsOf } from '@chakra-ui/react'

export default function Center({ ...props }: PropsOf<typeof ChakraUICenter>) {
  return <ChakraUICenter {...props} />
}
