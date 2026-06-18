import { BreadcrumbLink as ChakraUIBreadcrumbLink } from '@chakra-ui/react'
import Link from 'toro/components/Link'
import isString from 'lodash/isString'

export default function BreadcrumbLink({ children, ...props }) {
  if (!isString(props?.href)) {
    return (
      <ChakraUIBreadcrumbLink isCurrentPage {...props}>
        {children}
      </ChakraUIBreadcrumbLink>
    )
  }
  return (
    <ChakraUIBreadcrumbLink as={Link} {...props}>
      {children}
    </ChakraUIBreadcrumbLink>
  )
}
