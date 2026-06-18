import parseCookieString from './parseCookieString'

describe('src/toro/helpers/parseCookieString', () => {
  it('returns an empty array when given an empty input', () => {
    const raw = ''
    const result = parseCookieString(raw)
    expect(result).toEqual([])
  })

  it('returns an array of cookie values when given a valid JSON string with date stamps', () => {
    const raw = '{"2023-01-01": "value1", "2023-02-01": "value2", "2023-03-01": "value3"}'
    const result = parseCookieString(raw)
    expect(result).toEqual(['value1', 'value2', 'value3'])
  })

  it('returns an empty array when given an invalid JSON string', () => {
    const raw = 'invalid-json-string'
    const result = parseCookieString(raw)
    expect(result).toEqual([])
  })
})
