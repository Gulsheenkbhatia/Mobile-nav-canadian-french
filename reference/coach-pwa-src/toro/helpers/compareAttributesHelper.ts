import get from 'lodash/get'
import { MAX_MEASUREMENT_SPECS } from 'toro/constants/measurementSpecs'
import isEmpty from 'lodash/isEmpty'

export const HARDWARE_COLOR_ATTR_NAME = 'hardwareColor'

type CompareAttributesValues = Record<string, any>

export const getCompareAttributesFromCustom = (customPropertyValue: string) => {
  let result
  try {
    result = JSON.parse(customPropertyValue)
    if (isEmpty(result)) {
      return
    }
  } catch (error) {
    console.log('Error Parsing compare attributes data')
  }
  return result
}

export const getCompareAttributesPrefValues = (compareAttributes = {}) =>
  Object.keys(compareAttributes).reduce((acc, compareOptionName) => {
    const compareOption = get(compareAttributes, compareOptionName, {})
    const enable = get(compareOption, 'enable', true)
    const attributes = get(compareOption, 'attributes', [])
    return enable ? { ...acc, [compareOptionName]: attributes } : acc
  }, {})

const getMeasurementSpecValues = ({
  attributes,
  defaultVariantCustomAttributes,
  masterCustomAttributes,
}) =>
  attributes
    .map((attribute = '') => {
      const value =
        get(defaultVariantCustomAttributes, `c_${attribute}`) ||
        get(masterCustomAttributes, `c_${attribute}`)
      return value ? { label: attribute, value } : null
    })
    .filter(Boolean)
    .slice(0, MAX_MEASUREMENT_SPECS)

export const getCustomAttributeValues = ({
  compareAttributesConfig,
  defaultVariantCustomAttributes,
  masterCustomAttributes,
}): CompareAttributesValues =>
  Object.keys(compareAttributesConfig).reduce((acc, compareAttribute) => {
    const compareAttributeValues = get(compareAttributesConfig, compareAttribute, [])

    if (compareAttribute === 'measurementSpecs') {
      acc[compareAttribute] = getMeasurementSpecValues({
        attributes: compareAttributeValues,
        defaultVariantCustomAttributes,
        masterCustomAttributes,
      })
    } else {
      acc[compareAttribute] = compareAttributeValues
        .map((attribute = '') => {
          let value =
            get(defaultVariantCustomAttributes, `c_${attribute}`) ||
            get(masterCustomAttributes, `c_${attribute}`)
          if (attribute === HARDWARE_COLOR_ATTR_NAME && value) {
            value = `{${HARDWARE_COLOR_ATTR_NAME}}${value}`
          }

          return value
        })
        .filter((item) => item)
    }

    return acc
  }, {})
