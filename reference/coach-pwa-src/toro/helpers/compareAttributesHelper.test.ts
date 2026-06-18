import {
  getCompareAttributesFromCustom,
  getCompareAttributesPrefValues,
  getCustomAttributeValues,
  HARDWARE_COLOR_ATTR_NAME,
} from './compareAttributesHelper'

describe('compareAttributesHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCompareAttributesFromCustom', () => {
    it('returns parsed JSON object when valid and non-empty', () => {
      const result = getCompareAttributesFromCustom(
        JSON.stringify({
          measurementSpecs: { enable: true, attributes: ['length'] },
        })
      )

      expect(result).toEqual({
        measurementSpecs: { enable: true, attributes: ['length'] },
      })
    })

    it('returns undefined for valid but empty JSON object', () => {
      const result = getCompareAttributesFromCustom(JSON.stringify({}))
      expect(result).toBeUndefined()
    })

    it('logs and returns undefined when JSON parsing fails', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined)

      const result = getCompareAttributesFromCustom('not-json')

      expect(result).toBeUndefined()
      expect(logSpy).toHaveBeenCalledWith('Error Parsing compare attributes data')
      logSpy.mockRestore()
    })
  })

  describe('getCompareAttributesPrefValues', () => {
    it('returns empty object when config is empty', () => {
      expect(getCompareAttributesPrefValues({})).toEqual({})
    })

    it('includes enabled options and omits disabled options', () => {
      const result = getCompareAttributesPrefValues({
        measurementSpecs: { enable: true, attributes: ['length', 'width'] },
        materials: { enable: false, attributes: ['material'] },
        defaultEnabled: { attributes: ['foo'] },
      })

      expect(result).toEqual({
        measurementSpecs: ['length', 'width'],
        defaultEnabled: ['foo'],
      })
    })
  })

  describe('getCustomAttributeValues', () => {
    it('maps measurement specs to {label,value} objects, prefers default variant, and slices to max', () => {
      const result = getCustomAttributeValues({
        compareAttributesConfig: {
          measurementSpecs: ['length', 'width', 'height', 'depth', 'itemWidth'],
        },
        defaultVariantCustomAttributes: {
          c_length: '10',
          c_width: '20',
        },
        masterCustomAttributes: {
          c_width: '200',
          c_height: '30',
          c_depth: '40',
          c_itemWidth: '50',
        },
      })

      expect(result.measurementSpecs).toEqual([
        { label: 'length', value: '10' },
        { label: 'width', value: '20' },
        { label: 'height', value: '30' },
        { label: 'depth', value: '40' },
      ])
    })

    it('maps non-measurement attributes to values and filters missing values', () => {
      const result = getCustomAttributeValues({
        compareAttributesConfig: {
          care: ['careInstructions', 'nonexistent'],
        },
        defaultVariantCustomAttributes: {
          c_careInstructions: 'Wipe clean',
        },
        masterCustomAttributes: {},
      })

      expect(result).toEqual({
        care: ['Wipe clean'],
      })
    })

    it(`wraps ${HARDWARE_COLOR_ATTR_NAME} values with token prefix`, () => {
      const result = getCustomAttributeValues({
        compareAttributesConfig: {
          hardware: [HARDWARE_COLOR_ATTR_NAME],
        },
        defaultVariantCustomAttributes: {
          c_hardwareColor: 'Brass',
        },
        masterCustomAttributes: {},
      })

      expect(result).toEqual({
        hardware: [`{${HARDWARE_COLOR_ATTR_NAME}}Brass`],
      })
    })

    it('returns empty arrays for keys with no resolved values', () => {
      const result = getCustomAttributeValues({
        compareAttributesConfig: {
          care: ['careInstructions'],
          measurementSpecs: ['length'],
        },
        defaultVariantCustomAttributes: {},
        masterCustomAttributes: {},
      })

      expect(result).toEqual({
        care: [],
        measurementSpecs: [],
      })
    })
  })
})
