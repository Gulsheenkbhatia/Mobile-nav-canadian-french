import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import { useIntl } from 'react-intl'

function PickUpInStoreButton({ ...props }) {
  const { formatMessage } = useIntl()
  return (
    <Box w="100%" mb="3">
      <Button variant="secondary" size="lg" w="100%" {...props}>
        {formatMessage({ id: 'plp.pickUpinStoreButton' })}
      </Button>
    </Box>
  )
}

export default PickUpInStoreButton
