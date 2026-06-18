function objectValueStringify(object) {
  if (typeof object !== 'object') return {}
  return Object.entries(object).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: typeof value === 'object' ? JSON.stringify(value) : value,
    }
  }, {})
}

export default objectValueStringify
