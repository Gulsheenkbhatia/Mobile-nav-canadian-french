const currencyList = ['$', '€', '£', '¥']

const currencyRegExp = new RegExp(`[(${currencyList.join('|')})]`)

const getCountryOptionsFromPriceLabel = (label) => {
  if (!label) return []
  const countryData = label.split(currencyRegExp)
  const [country, currencyName, currency] = countryData
  return [country, currency || currencyName]
}

export default getCountryOptionsFromPriceLabel
