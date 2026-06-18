import { forwardRef } from 'react'
import { List as ChakraUIList, ListProps } from '@chakra-ui/react'

const List = forwardRef<HTMLUListElement, ListProps>((props, ref) => {
  return <ChakraUIList ref={ref} {...props} />
})

export default List
