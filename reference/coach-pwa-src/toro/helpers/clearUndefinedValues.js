import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

function clearUndefinedValues(obj, key, undefinedKeysToKeep) {
  let value = obj
  if (key !== undefined) {
    value = obj[key]
    if (value === undefined) {
      if (!undefinedKeysToKeep.includes(key)) {
        delete obj[key]
      }
      return
    }
  }

  if (isObject(value)) {
    Object.keys(value).forEach((k) => clearUndefinedValues(value, k, undefinedKeysToKeep))
    return
  }
  if (isArray(value)) {
    value.forEach((item, idx) => clearUndefinedValues(value, idx))
    return
  }
}

export default clearUndefinedValues
