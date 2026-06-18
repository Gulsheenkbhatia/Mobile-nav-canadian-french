import { forwardRef } from 'react'
import { TabPanel as ChakraUITabPanel, type TabPanelProps } from '@chakra-ui/react'

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>((props, ref) => {
  return <ChakraUITabPanel ref={ref} {...props} />
})

export default TabPanel
