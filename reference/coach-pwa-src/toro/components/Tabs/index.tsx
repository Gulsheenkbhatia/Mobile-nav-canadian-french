import { forwardRef } from 'react'
import { Tabs as ChakraUITabs, type TabsProps } from '@chakra-ui/react'

const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  return <ChakraUITabs ref={ref} {...props} />
})

export default Tabs
