const normalizeRequestQuery = (query = {}, keyToNormalize = 'slug') => {
  const normalizedKeys = Object.keys(query).filter((key) => {
    if (key.includes(keyToNormalize)) {
      return key === keyToNormalize
    }

    if (key.includes('_v_')) {
      return false
    }

    return true
  })

  return normalizedKeys.reduce((prev, queryKey) => {
    return {
      ...prev,
      [queryKey]: query[queryKey],
    }
  }, {})
}

export default normalizeRequestQuery
