import formatStringToCamelCase from './formatStringToCamelCase'

const testStringLong = 'this-is-a-test-string'
const testStringShort = 'this'

describe(__filename, () => {
  it('should return a joined camelCase string when input in hyphentated', () => {
    const formattedString = formatStringToCamelCase(testStringLong)
    expect(formattedString).toEqual('thisIsATestString')
  })

  it('should return a joined camelCase string when input in hyphentated', () => {
    const formattedString = formatStringToCamelCase(testStringShort)
    expect(formattedString).toEqual('this')
  })
})
