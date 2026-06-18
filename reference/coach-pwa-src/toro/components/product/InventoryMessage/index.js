import Box from 'toro/components/Box'
import { useIntl } from 'react-intl'

function InventoryMessage({ onlyLeft }) {
  const { formatMessage } = useIntl()
  return (
    <Box w="100%" mb="m">
      {formatMessage({ id: 'pdp.product.inventoryMessage' }, { itemCount: onlyLeft })}
    </Box>
  )
}

export default InventoryMessage
