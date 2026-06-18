import { getDefaultSizeValue } from 'toro/helpers/pdpData'

describe('getDefaultSizeValue', () => {
  it('should return empty string for null product data', () => {
    expect(getDefaultSizeValue(null)).toBe('')
  })

  it('should return empty string when no default variation size values exist', () => {
    const productData = {
      defaultVariantGroup: {
        variationAttributes: [{ id: 'color', values: [{ value: 'red' }] }],
      },
    }
    expect(getDefaultSizeValue(productData as any)).toBe('')
  })

  it('should return empty string when size values array is empty', () => {
    const productData = {
      defaultVariantGroup: {
        variationAttributes: [{ id: 'size', values: [] }],
      },
    }
    expect(getDefaultSizeValue(productData as any)).toBe('')
  })

  it('should return empty string when size values array has multiple items', () => {
    const productData = {
      defaultVariantGroup: {
        variationAttributes: [
          {
            id: 'size',
            values: [{ value: 'S' }, { value: 'M' }],
          },
        ],
      },
    }
    expect(getDefaultSizeValue(productData as any)).toBe('')
  })

  it('should return the single size value when only one size exists', () => {
    const productData = {
      defaultVariantGroup: {
        variationAttributes: [
          {
            id: 'size',
            values: [{ value: 'OneSize' }],
          },
        ],
      },
    }
    expect(getDefaultSizeValue(productData as any)).toBe('OneSize')
  })

  it('should return preselected size when it is appear in URL', () => {
    const productData = {
      selectedVariantData: {
        variationValues: { size: '5' },
      },
    }
    expect(getDefaultSizeValue(productData as any)).toBe('5')
  })
})
