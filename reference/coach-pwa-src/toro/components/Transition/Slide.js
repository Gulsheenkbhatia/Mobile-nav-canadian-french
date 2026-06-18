import { Slide as ChakraUISlide } from '@chakra-ui/react'

export default function Slide({ children, ...props }) {
  return <ChakraUISlide {...props}>{children}</ChakraUISlide>
}
