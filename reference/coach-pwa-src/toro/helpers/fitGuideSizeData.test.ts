import {
  CM_PER_INCH,
  enrichAndSortSizeDataByFootLength,
  getFootLengthBoundsFromTable,
  getFootLengthValidationStatus,
} from 'toro/helpers/fitGuideSizeData'

const rows = [
  { length: 8, us: '8', uk: '7', eu: '41' },
  { length: 10, us: '10', uk: '9', eu: '43' },
  { length: 12, us: '12', uk: '11', eu: '45' },
]

describe('enrichAndSortSizeDataByFootLength', () => {
  it('returns original order when foot length is empty', () => {
    expect(enrichAndSortSizeDataByFootLength(rows, '', 'IN')).toEqual(rows)
  })

  it('returns original order when foot length is not a number', () => {
    expect(enrichAndSortSizeDataByFootLength(rows, 'abc', 'IN')).toEqual(rows)
  })

  it('sorts by closest length in inches when unit is IN', () => {
    const sorted = enrichAndSortSizeDataByFootLength(rows, '10', 'IN')
    expect(sorted.map((r) => r.us)).toEqual(['10', '8', '12'])
    expect(sorted[0].difference).toBe(0)
    expect(sorted[1].difference).toBe(2)
    expect(sorted[2].difference).toBe(2)
  })

  it('converts CM input to inches before comparing', () => {
    const sorted = enrichAndSortSizeDataByFootLength(rows, '25.4', 'CM')
    expect(sorted[0].us).toBe('10')
    expect(25.4 / CM_PER_INCH).toBe(10)
  })
})

describe('getFootLengthBoundsFromTable', () => {
  it('returns min/max inches from rows', () => {
    expect(
      getFootLengthBoundsFromTable([
        { length: 8, us: '8', uk: '7', eu: '41' },
        { length: 11, us: '11', uk: '10', eu: '44' },
        { length: 9, us: '9', uk: '8', eu: '42' },
      ])
    ).toEqual({ minInches: 8, maxInches: 11 })
  })

  it('returns null for empty data', () => {
    expect(getFootLengthBoundsFromTable([])).toBeNull()
  })
})

describe('getFootLengthValidationStatus', () => {
  const bounds = { minInches: 8, maxInches: 11 }

  it('returns idle when empty', () => {
    expect(getFootLengthValidationStatus('', 'IN', bounds)).toEqual({ kind: 'idle' })
  })

  it('returns incomplete when value ends with a decimal point', () => {
    expect(getFootLengthValidationStatus('9.', 'IN', bounds)).toEqual({ kind: 'incomplete' })
  })

  it('returns invalid_range below min in inches', () => {
    const r = getFootLengthValidationStatus('7.5', 'IN', bounds)
    expect(r.kind).toBe('invalid_range')
    if (r.kind === 'invalid_range') {
      expect(r.unit).toBe('IN')
      expect(r.minDisplay).toBe('8')
      expect(r.maxDisplay).toBe('11')
    }
  })

  it('returns invalid_range above max in cm', () => {
    const r = getFootLengthValidationStatus('99', 'CM', bounds)
    expect(r.kind).toBe('invalid_range')
    if (r.kind === 'invalid_range') {
      expect(r.unit).toBe('CM')
    }
  })

  it('returns valid for inclusive bounds', () => {
    expect(getFootLengthValidationStatus('11', 'IN', bounds)).toMatchObject({
      kind: 'valid',
      valueInches: 11,
    })
    expect(getFootLengthValidationStatus('8', 'IN', bounds)).toMatchObject({
      kind: 'valid',
      valueInches: 8,
    })
  })

  it('accepts two decimal places', () => {
    expect(getFootLengthValidationStatus('10.25', 'IN', bounds).kind).toBe('valid')
  })
})
