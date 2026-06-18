import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box } from '@chakra-ui/react'
import { useAtomValue } from 'jotai/utils'
import { productDetailsTooltipStateAtom } from 'store/site-preview.atom'

const TOOLTIP_Z_INDEX = 1000
const DEFAULT_STATE_DATA = {}

const ProductDetailsTooltip = () => {
  const { enabled = false, data = DEFAULT_STATE_DATA } = useAtomValue(
    productDetailsTooltipStateAtom
  )

  if (!enabled) {
    return null
  }

  return (
    <Box
      position="fixed"
      zIndex={TOOLTIP_Z_INDEX}
      borderRadius="md"
      bg="blackAlpha.700"
      bottom="1rem"
      right="1rem"
    >
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th color="white">Property</Th>
              <Th color="white">Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(data).map(([key, value]) => (
              <Tr key={key}>
                <Td color="white" fontSize="xs">
                  {key}
                </Td>
                <Td color="white" fontSize="xs">
                  {value}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ProductDetailsTooltip
