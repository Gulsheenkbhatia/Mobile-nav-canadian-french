import React, { useContext } from 'react'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useTheme from 'toro/hooks/useTheme'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'

function PopularSearchItemPrice({ priceData, styles }) {
  const { appData } = useContext(PWAContext)
  const theme = useTheme()
  const discountPercentage = priceData?.discountPercentage
  const pricesRangeArr = priceData?.pricesRangeArr
  const maxRangePrice = priceData?.maxRangePrice
  let minRangePrice
  let regularPrice
  let currentPrice
  const { space } = theme
  const locale = get(appData, 'locale')
  const { currencySymbol } = getCurrentLocale(locale)

  // Discount price
  if (discountPercentage > 0 && pricesRangeArr?.length > 1) {
    regularPrice = pricesRangeArr[0]?.maxPrice
    currentPrice = priceData?.minRangePrice
  }
  // Range price
  if (maxRangePrice) {
    minRangePrice = priceData?.minRangePrice
  }
  // Regular price
  if (!maxRangePrice && pricesRangeArr?.length === 1) {
    currentPrice = priceData?.minRangePrice
  }

  const fontStyleObj = {
    fontSize: 'var(--text-14)',
    fontWeight: 'normal',
    color: 'var(--color-black-base)',
    mr: '6px',
    fontFamily: 'var(--font-face2-normal)',
  }

  return (
    <Box p={`${space.s} ${space.mar}`}>
      {discountPercentage > 0 && pricesRangeArr?.length > 1 && (
        <Flex>
          <Text sx={{ ...fontStyleObj, ...styles.price }}>
            {currencySymbol}
            {currentPrice}
          </Text>
          <Text
            textDecoration="line-through"
            sx={{ ...fontStyleObj, ...styles.price, ...styles.fadedPrice }}
          >
            {currencySymbol}
            {regularPrice}
          </Text>
          <Text sx={{ ...fontStyleObj, ...styles.price, ...styles.fadedPrice }}>
            ({discountPercentage}%)
          </Text>
        </Flex>
      )}
      {maxRangePrice && (
        <Box>
          <Text sx={{ ...fontStyleObj, ...styles.price }}>
            {currencySymbol}
            {minRangePrice} - {currencySymbol}
            {maxRangePrice}
          </Text>
        </Box>
      )}
      {!maxRangePrice && pricesRangeArr?.length === 1 && (
        <Box>
          <Text sx={{ ...fontStyleObj, ...styles.price }}>
            {currencySymbol}
            {currentPrice}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default PopularSearchItemPrice
