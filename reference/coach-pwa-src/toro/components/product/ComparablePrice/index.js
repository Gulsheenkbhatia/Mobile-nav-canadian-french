import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useAtomValue } from 'jotai/utils'
import { isSWOutletAtom } from 'store/global.atom'

export default function ComparablePrice({ listPrice, variant }) {
  const styles = useMultiStyleConfig('ComparablePrice', {
    variant,
  })
  const { formatMessage } = useIntl()
  const isSWOutlet = useAtomValue(isSWOutletAtom)
  return (
    <>
      {listPrice ? (
        <Box className="pdp-comparable-price" sx={styles.comparablePriceContainer?.(isSWOutlet)}>
          <Flex
            sx={styles.comparablePriceWrapper?.(isSWOutlet)}
            direction="row"
            data-qa="wrapper_comparable_value"
            className="comparable-price-container"
          >
            <Box as="span">
              <Text
                sx={styles.comparablePriceText?.(isSWOutlet)}
                variant="body-text-secondary"
                data-qa="txt_comparable_value"
              >
                {formatMessage({
                  id: 'pdp.product.comparableValueText',
                  defaultMessage: 'Comparable Value',
                })}
              </Text>
            </Box>
            <Box sx={styles.comparablePrice} as="span">
              <Text
                variant="body-text-secondary"
                data-qa="txt_comparable_value_price"
                sx={styles.comparablePriceValue?.(isSWOutlet)}
              >
                {listPrice}
              </Text>
            </Box>
          </Flex>
        </Box>
      ) : null}
    </>
  )
}

ComparablePrice.propTypes = {
  listPrice: PropTypes.string,
}
