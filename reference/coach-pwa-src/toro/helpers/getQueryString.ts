import isNil from 'lodash/isNil'

type ParamValue = string | number | boolean
type ParamValues = string[] | number[] | boolean[]

interface Params {
  [key: string]: ParamValue | ParamValues
}
const buildQueryString = (params: Params): string => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (isNil(value) || value === '') return

    if (Array.isArray(value)) {
      value.forEach((val: ParamValue) => {
        if (isValidParamValue(val)) {
          searchParams.append(key, val.toString())
        }
      })
    } else {
      if (isValidParamValue(value)) {
        searchParams.append(key, value.toString())
      }
    }
  })

  return searchParams.toString()
}

const isValidParamValue = (value: ParamValue): boolean => {
  if (typeof value === 'boolean') {
    return true
  } else if (typeof value === 'number' || typeof value === 'string') {
    return true
  }
  return false
}

export default buildQueryString
