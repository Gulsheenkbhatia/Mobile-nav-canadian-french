import { Badge as ChakraUIBadge } from '@chakra-ui/react'

export default function OrderedList({ children, ...props }) {
  return <ChakraUIBadge {...props}>{children}</ChakraUIBadge>
}
