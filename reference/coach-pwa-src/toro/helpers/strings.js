export const renderWithSpecialCharacters = (value = '', mimType = 'text/html') => {
  try {
    if (!value) return value
    const parser = new DOMParser()

    return parser.parseFromString(value, mimType).body.textContent
  } catch (_err) {
    return value
  }
}
