import { FC } from 'react'
import Box from 'toro/components/Box'
import { ProductItem } from 'toro/types'
import { useIntl } from 'react-intl'
import Text from 'toro/components/Text'
import useCustomSalePriceColor from 'toro/hooks/useCustomSalePriceColor'
import { useStyles } from '@chakra-ui/react'

const ProductItemPrice: FC<ProductItem['price']> = ({
  children,
  value,
  sale,
  comparable,
  strikeoff,
  discount,
}) => {
  const styles: any = useStyles()
  const { formatMessage } = useIntl()
  const customSalePriceColor = useCustomSalePriceColor({ isCertonaRecommendationContainer: true })

  const showCustomSaleColor = sale && customSalePriceColor?.color
  const discountColor = sale && comparable ? 'var(--color-sale)' : 'var(--color-neutral-base)'

  return (
    <Box sx={styles.tilePriceWrapper}>
      {comparable && (
        <Box sx={styles.tileComparablePriceWrapper}>
          <Text variant="body-text-secondary" size="sm">
            {formatMessage({
              id: 'plp.price.comparablevalue',
              defaultMessage: 'Comparable Value',
            })}
          </Text>

          <Text variant="body-text-secondary" size="sm">
            {comparable}
          </Text>
        </Box>
      )}

      <Box sx={styles.tilePriceContainer}>
        <Text
          className="tile-price-text"
          variant="secondary"
          as="span"
          sx={{
            ...styles.tilePriceText,
            ...(sale ? styles.tilePriceTextColor : {}),
            ...(showCustomSaleColor ? { color: `${customSalePriceColor?.color} !important` } : {}),
          }}
        >
          {value}
        </Text>

        {strikeoff && (
          <Text variant="secondary" as="span" sx={styles.tileStrikeoffPrice}>
            {strikeoff}
          </Text>
        )}

        {discount && (
          <Text variant="secondary" as="span" sx={styles.tileDiscount} color={discountColor}>
            ({discount} {comparable ? 'off' : ''})
          </Text>
        )}
      </Box>
      {children}
    </Box>
  )
}

export default ProductItemPrice
