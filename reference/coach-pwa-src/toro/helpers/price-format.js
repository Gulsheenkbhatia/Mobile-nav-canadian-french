/**
 * Formats a price for display.
 * @param {Number} price The price as a floating point number
 * @param {Object} options
 * @param {String} options.currency The currency code
 * @param {Number} options.decimals The number of decimal places to display
 * @param {String} options.locale The locale code
 * @param {Boolean} options.disablePriceFormatGrouping The toggle to (not)grouping price format
 * @param {Boolean} options.hideSymbol The toggle to (not)send with currency symbol
 * @return {String}
 */
export function price(
  price,
  {
    currency = 'USD',
    decimals = 2,
    locale = 'en-US',
    disablePriceFormatGrouping = false,
    hideSymbol = false,
    forceCommaSeparated = false,
    currencySymbol = '$',
    currencySymbolAfterPrice = false,
    forceCommaSeparatedForThousands = false,
  } = {}
) {
  if (!price) {
    return
  }

  if (!isNaN(price)) {
    const formatter = new Intl.NumberFormat(locale, {
      // when undefined set to style or currency opt we still getting expected result
      style: hideSymbol ? undefined : 'currency',
      currency: hideSymbol ? undefined : currency,
      minimumFractionDigits: Number.isSafeInteger(Number(price)) ? 0 : decimals,
      useGrouping: !disablePriceFormatGrouping,
    })

    const formattedPrice = formatter
      .formatToParts(price)
      .map(({ type, value }) => {
        if (['currency', 'literal'].includes(type) && currencySymbolAfterPrice) {
          return ''
        }
        if (type === 'group' && forceCommaSeparatedForThousands) {
          return ','
        }
        if (type === 'decimal') {
          return forceCommaSeparated ? ',' : '.'
        }

        return value
      })
      .join('')
      .replace('CA$', 'C$')

    if (currencySymbolAfterPrice) {
      return formattedPrice + ` ${currencySymbol}`
    }

    return formattedPrice
  }
  return price
}

/**
 * Returns currency symbol.
 * @param {String} currency The current currency code
 * @return {String}
 */

export const currencyMap = { USD: '$', CAD: '$', JPY: ['¥', '￥'] }

export function getCurrency(currentCurrency) {
  return currencyMap[currentCurrency]?.[0] || ''
}

/**
 * Formats a price string by removing unnecessary trailing zeros in the decimal part.
 *
 * @param {string} price - The price string to be formatted. It is expected to be a numeric string that may contain a decimal point.
 * @returns {string} - The formatted price string. If the decimal part consists only of zeros, it returns the integer part only. Otherwise, it returns the price with the original decimal part.
 */
export const formatPrice = (price = '') => {
  const [integerPart, decimalPart] = price.split('.')
  return decimalPart && /^0+$/.test(decimalPart) ? integerPart : price
}
