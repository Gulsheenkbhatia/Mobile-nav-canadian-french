import { InputLeftElement as ChakraUIInputLeftElement, forwardRef } from '@chakra-ui/react'

const InputLeftElement = forwardRef(({ children, ...props }, ref) => {
  return (
    <ChakraUIInputLeftElement ref={ref} {...props}>
      {children}
    </ChakraUIInputLeftElement>
  )
})

export default InputLeftElement
