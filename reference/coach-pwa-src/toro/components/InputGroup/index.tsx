import React, { forwardRef } from 'react'
import { InputGroup as ChakraUIInputGroup, InputGroupProps } from '@chakra-ui/react'

const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>((props, ref) => {
  return <ChakraUIInputGroup ref={ref} {...props} />
})

export default InputGroup
