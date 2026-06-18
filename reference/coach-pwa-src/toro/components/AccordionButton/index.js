import { AccordionButton as ChakraUIAccordionButton } from '@chakra-ui/react'

export default function AccordionButton({ ...props }) {
  return (
    <ChakraUIAccordionButton
      {...props}
      _focus={{ outline: 'none' }}
      sx={{ textAlign: 'center !important', ...props.sx }}
    />
  )
}
