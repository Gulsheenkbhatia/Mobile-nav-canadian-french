import { SCHEMA_TYPES, SCHEMA_UNITS } from 'toro/constants/seo'

const { QUANTITATIVE_VALUE } = SCHEMA_TYPES
const { INCHES } = SCHEMA_UNITS

type DimensionAttributes = {
  c_widthVal?: string
  c_size?: string
  c_height?: string
  c_itemWidth?: string
  c_length?: string
  c_bagSize?: string
}

type QuantitativeValue = { '@type': string; value: number; unitCode: string }

type DimensionsObject = {
  height?: QuantitativeValue
  width?: QuantitativeValue
  depth?: QuantitativeValue
  size?: string
}

export const getDimensions = (
  { c_widthVal, c_size, c_height, c_itemWidth, c_length, c_bagSize }: DimensionAttributes,
  hasSize: boolean
) => {
  if (hasSize && c_size) {
    return {
      size: c_widthVal,
      hasMeasurement: {
        '@type': QUANTITATIVE_VALUE,
        value: c_size,
        unitCode: INCHES,
      },
    }
  }

  const dimensions: DimensionsObject = {
    height: c_height
      ? {
          '@type': QUANTITATIVE_VALUE,
          value: parseFloat(c_height),
          unitCode: INCHES,
        }
      : undefined,

    width: c_itemWidth
      ? {
          '@type': QUANTITATIVE_VALUE,
          value: parseFloat(c_itemWidth),
          unitCode: INCHES,
        }
      : undefined,

    depth: c_length
      ? {
          '@type': QUANTITATIVE_VALUE,
          value: parseFloat(c_length),
          unitCode: INCHES,
        }
      : undefined,
  }

  if (c_bagSize) {
    dimensions.size = c_bagSize
  }

  return dimensions
}
