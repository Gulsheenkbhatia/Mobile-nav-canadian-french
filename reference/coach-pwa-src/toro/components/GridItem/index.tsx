import { GridItem as ChakraUIGridItem, PropsOf } from '@chakra-ui/react'

export default function GridItem(props: PropsOf<typeof ChakraUIGridItem>) {
  return <ChakraUIGridItem {...props} />
}
