import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import { useIntl } from 'react-intl'

const FallbackErrorButton = ({ errorMessage = '' }) => {
  const buttonProps = {
    variant: 'secondary',
    disabled: true,
    backgroundColor: 'var(--color-inactive)',
    _hover: { pointerEvents: 'none' },
  }

  const { formatMessage } = useIntl()

  return (
    <Box mb="3" flexGrow="1">
      <Button
        {...buttonProps}
        onClick={() => {}}
        size="lg"
        w="100%"
        whiteSpace="break-spaces"
        id="add-to-cart-error"
        data-qa="add-to-bag-error"
        sx={{
          '&[disabled]:hover': { background: 'var(--color-neutral-base)' },
          textTransform: 'none',
        }}
      >
        {formatMessage({
          id: 'pdp.product.addBagError',
          defaultMessage: errorMessage || 'Ohh! Something Went Wrong',
        })}
      </Button>
    </Box>
  )
}

export default FallbackErrorButton
