const formatStringToCamelCase = (str) => {
  const splittedProperty = str.split('-')

  if (splittedProperty?.length === 1) return splittedProperty[0]

  return (
    splittedProperty[0] +
    splittedProperty
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join('')
  )
}

export default formatStringToCamelCase
