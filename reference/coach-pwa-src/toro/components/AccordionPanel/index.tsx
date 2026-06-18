import { AccordionPanel as ChakraUIAccordionPanel, PropsOf } from '@chakra-ui/react'

export default function AccordionPanel({ ...props }: PropsOf<typeof ChakraUIAccordionPanel>) {
  return <ChakraUIAccordionPanel {...props} />
}
