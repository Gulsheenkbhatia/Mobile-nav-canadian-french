import { Breadcrumb as ChakraUIBreadcrumb } from '@chakra-ui/react'

export default function Breadcrumb({ children, ...props }) {
  return <ChakraUIBreadcrumb {...props}>{children}</ChakraUIBreadcrumb>
}
