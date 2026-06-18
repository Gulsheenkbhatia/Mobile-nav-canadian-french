import React, { forwardRef } from 'react'
import { Checkbox as ChakraUICheckbox, PropsOf } from '@chakra-ui/react'

const Checkbox = forwardRef<HTMLInputElement, PropsOf<typeof ChakraUICheckbox>>((props, ref) => (
  <ChakraUICheckbox ref={ref} {...props} />
))

export default Checkbox
