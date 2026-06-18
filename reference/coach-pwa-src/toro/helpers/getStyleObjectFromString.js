import formatStringToCamelCase from 'toro/helpers/formatStringToCamelCase'

const getStyleObjectFromString = (str) => {
  if (!str) {
    return {}
  }

  const style = {}
  str.split(';').forEach((el) => {
    const [property = '', value = ''] = el.split(':')
    if (!property) return

    const formattedProperty = formatStringToCamelCase(property?.trim())
    style[formattedProperty] = value?.trim()
  })

  return style
}

export default getStyleObjectFromString
