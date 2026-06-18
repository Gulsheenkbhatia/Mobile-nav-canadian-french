import { forwardRef } from 'react'
import { Flex as ChakraUIFlex, PropsOf } from '@chakra-ui/react'

const Flex = forwardRef<HTMLDivElement, PropsOf<typeof ChakraUIFlex>>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraUIFlex ref={ref} {...props}>
        {children}
      </ChakraUIFlex>
    )
  }
)

export default Flex
