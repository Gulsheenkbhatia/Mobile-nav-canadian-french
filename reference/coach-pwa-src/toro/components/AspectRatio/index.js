import { AspectRatio as ChakraUIAspectRatio, forwardRef } from '@chakra-ui/react'

const AspectRatio = forwardRef(({ children, ...props }, ref) => {
  return (
    <ChakraUIAspectRatio ref={ref} {...props}>
      {children}
    </ChakraUIAspectRatio>
  )
})

export default AspectRatio
