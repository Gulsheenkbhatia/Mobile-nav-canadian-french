import { forwardRef } from 'react'
import { Tab as ChakraUITab, type TabProps } from '@chakra-ui/react'

const Tab = forwardRef<HTMLButtonElement, TabProps>((props, ref) => {
  return <ChakraUITab ref={ref} {...props} />
})

export default Tab
