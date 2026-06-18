import { Icon as ChakraUIIcon, type IconProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

const Icon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  return <ChakraUIIcon ref={ref} {...props} />
})

export default Icon
