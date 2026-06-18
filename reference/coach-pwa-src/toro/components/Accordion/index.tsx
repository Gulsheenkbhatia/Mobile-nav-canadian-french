import { Accordion as ChakraUIAccordion, AccordionProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(({ ...props }, ref) => {
  return <ChakraUIAccordion ref={ref} {...props} />
})

export default Accordion
