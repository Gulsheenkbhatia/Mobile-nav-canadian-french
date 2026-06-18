import { extractNumericPrice } from './extractNumericPrice'

describe('extractNumericPrice', () => {
  it('returns null for empty input', () => {
    expect(extractNumericPrice('')).toBeNull()
    expect(extractNumericPrice(null)).toBeNull()
    expect(extractNumericPrice(undefined)).toBeNull()
  })

  it('parses common currency-prefixed formats', () => {
    expect(extractNumericPrice('$24.62')).toBe(24.62)
    expect(extractNumericPrice('£30.00')).toBe(30)
    expect(extractNumericPrice('€30,00')).toBe(30)
  })

  it('returns null for unparseable strings', () => {
    expect(extractNumericPrice('N/A')).toBeNull()
  })
})
