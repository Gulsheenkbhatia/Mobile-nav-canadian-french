import { ModalContent as ChakraUIModalContent, PropsOf } from '@chakra-ui/react'

export default function ModalContent(props: PropsOf<typeof ChakraUIModalContent>) {
  return <ChakraUIModalContent {...props} />
}
