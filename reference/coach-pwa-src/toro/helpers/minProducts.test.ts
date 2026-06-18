import { encodeAccessorizeItParam, decodeAccessorizeItQueryParam } from './minProducts'

describe('encodeAccessorizeItParam', () => {
  it('should encode array format object into query string format', () => {
    const input = {
      charms: ['CX180-B4/B4', 'CE745-BRS'],
      straps: ['77840-B4P1Y', '77840-LHP1Y'],
    }

    const result = encodeAccessorizeItParam(input)
    const expected = 'charms%3ACX180-B4%2FB4%2CCE745-BRS%3Bstraps%3A77840-B4P1Y%2C77840-LHP1Y'

    expect(result).toBe(expected)
  })

  it('should encode string format object into query string format', () => {
    const input = {
      charms: 'CX180-B4/B4,CE745-BRS',
      straps: '77840-B4P1Y,77840-LHP1Y',
    }

    const result = encodeAccessorizeItParam(input)
    const expected = 'charms%3ACX180-B4%2FB4%2CCE745-BRS%3Bstraps%3A77840-B4P1Y%2C77840-LHP1Y'

    expect(result).toBe(expected)
  })

  it('should handle empty object and invalid inputs', () => {
    expect(encodeAccessorizeItParam({})).toBe('')
    expect(encodeAccessorizeItParam(null as any)).toBe('')
    expect(encodeAccessorizeItParam(undefined as any)).toBe('')
    expect(encodeAccessorizeItParam('string' as any)).toBe('')
  })

  it('should filter out empty arrays and strings', () => {
    const input = {
      charms: ['CX180-B4/B4', 'CE745-BRS'],
      straps: [],
      wallets: ['valid-value'],
      emptyString: '',
    }

    const result = encodeAccessorizeItParam(input)
    const expected = 'charms%3ACX180-B4%2FB4%2CCE745-BRS%3Bwallets%3Avalid-value'

    expect(result).toBe(expected)
  })
})

describe('decodeAccessorizeItQueryParam', () => {
  it('should decode a valid encoded string back to object', () => {
    const input = 'charms%3ACX180-B4%2FB4%2CCE745-BRS%3Bstraps%3A77840-B4P1Y%2C77840-LHP1Y'

    const result = decodeAccessorizeItQueryParam(input)
    const expected = {
      charms: ['CX180-B4/B4', 'CE745-BRS'],
      straps: ['77840-B4P1Y', '77840-LHP1Y'],
    }

    expect(result).toEqual(expected)
  })

  it('should handle empty and invalid inputs', () => {
    expect(decodeAccessorizeItQueryParam('')).toEqual({})
    expect(decodeAccessorizeItQueryParam(null as any)).toEqual({})
    expect(decodeAccessorizeItQueryParam(undefined as any)).toEqual({})
    expect(decodeAccessorizeItQueryParam(123 as any)).toEqual({})
  })

  it('should handle malformed encoded string gracefully', () => {
    const input = 'invalid-format-without-colons'
    const result = decodeAccessorizeItQueryParam(input)
    expect(result).toEqual({})
  })
})

describe('encodeAccessorizeItParam and decodeAccessorizeItQueryParam integration', () => {
  it('should encode and decode array format correctly', () => {
    const original = {
      charms: ['CX180-B4/B4', 'CE745-BRS'],
      straps: ['77840-B4P1Y', '77840-LHP1Y'],
    }

    const encoded = encodeAccessorizeItParam(original)
    const decoded = decodeAccessorizeItQueryParam(encoded)

    expect(decoded).toEqual(original)
  })

  it('should encode string format and decode back to arrays', () => {
    const original = {
      charms: 'CX180-B4/B4,CE745-BRS',
      straps: '77840-B4P1Y,77840-LHP1Y',
    }

    const encoded = encodeAccessorizeItParam(original)
    const decoded = decodeAccessorizeItQueryParam(encoded)

    const expected = {
      charms: ['CX180-B4/B4', 'CE745-BRS'],
      straps: ['77840-B4P1Y', '77840-LHP1Y'],
    }

    expect(decoded).toEqual(expected)
  })
})
