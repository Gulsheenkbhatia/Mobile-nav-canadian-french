import { forwardRef } from 'react'
import { TabPanels as ChakraUITabPanels, type TabPanelsProps } from '@chakra-ui/react'

const TabPanels = forwardRef<HTMLDivElement, TabPanelsProps>((props, ref) => {
  return <ChakraUITabPanels ref={ref} {...props} />
})

export default TabPanels
