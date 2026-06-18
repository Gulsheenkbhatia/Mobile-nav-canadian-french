import { Icon as ChakraUIIcon } from '@chakra-ui/react'
import { forwardRef } from 'react'

const RecommendationArrows = forwardRef(({ children, ...props }, ref) => {
  return (
    <ChakraUIIcon ref={ref} {...props}>
      {children}
    </ChakraUIIcon>
  )
})

export default RecommendationArrows
