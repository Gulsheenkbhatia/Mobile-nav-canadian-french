import { BreadcrumbItem as ChakraUIBreadcrumbItem } from '@chakra-ui/react'

export default function BreadcrumbItem({ children, ...props }) {
  return <ChakraUIBreadcrumbItem {...props}>{children}</ChakraUIBreadcrumbItem>
}
