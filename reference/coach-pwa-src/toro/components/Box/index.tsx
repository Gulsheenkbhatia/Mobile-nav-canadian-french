import { Box as ChakraUIBox, PropsOf } from '@chakra-ui/react'
import { forwardRef } from 'react'

const Box = forwardRef<HTMLDivElement, PropsOf<typeof ChakraUIBox>>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraUIBox ref={ref} {...props}>
        {children}
      </ChakraUIBox>
    )
  }
)

export default Box
