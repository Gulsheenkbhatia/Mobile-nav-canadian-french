import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { chakra } from '@chakra-ui/react'

const forwardedProps = [
  'as',
  'href',
  'passHref',
  'scroll',
  'children',
  'onClick',
  'data-qa',
  'aria-label',
  'target',
  'title',
  'prefetch',
  'onKeyDown',
  'rel',
  'shallow',
]
const shouldForwardProp = (prop: any) => forwardedProps.includes(prop)

// https://chakra-ui.com/docs/components/link/usage#usage-with-nextjs
// wrap the NextLink with Chakra UI's factory function
const MagicLink = chakra<typeof NextLink, NextLinkProps>(NextLink, {
  // ensure that you're forwarding all of the required props for your case
  shouldForwardProp,
})

export default MagicLink
