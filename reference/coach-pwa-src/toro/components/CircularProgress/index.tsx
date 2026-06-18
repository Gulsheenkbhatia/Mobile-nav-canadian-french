import { CircularProgress as ChakraUICircularProgress, PropsOf } from '@chakra-ui/react'

export default function CircularProgress({ ...props }: PropsOf<typeof ChakraUICircularProgress>) {
  return <ChakraUICircularProgress {...props} />
}
