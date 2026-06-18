import React, { forwardRef, ReactNode } from 'react'
import { Input as ChakraUIInput, InputProps } from '@chakra-ui/react'

interface CustomInputProps extends InputProps {
  children?: ReactNode
}

const Input = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
  return <ChakraUIInput ref={ref} {...props} />
})

export default Input
