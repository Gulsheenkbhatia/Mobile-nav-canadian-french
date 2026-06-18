import React from 'react'
import { PopoverBody as ChakraUIPopoverBody, PopoverBodyProps } from '@chakra-ui/react'

const PopoverBody: React.FC<PopoverBodyProps> = (props) => {
  return <ChakraUIPopoverBody {...props} />
}

export default PopoverBody
