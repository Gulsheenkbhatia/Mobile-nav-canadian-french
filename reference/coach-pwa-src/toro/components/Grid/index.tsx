import React, { forwardRef } from 'react'
import { Grid as ChakraUIGrid, GridProps } from '@chakra-ui/react'

type GridElement = React.ElementRef<typeof ChakraUIGrid>

const Grid = forwardRef<GridElement, GridProps>((props, ref) => {
  return <ChakraUIGrid ref={ref} {...props} />
})

export default Grid
