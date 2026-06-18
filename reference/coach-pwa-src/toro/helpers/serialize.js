import isNil from 'lodash/isNil'
import isObject from 'lodash/isObject'

const serialize = (obj) => {
  const str = []
  for (const p in obj) {
    if (isObject(obj[p])) {
      Object.keys(obj[p]).forEach((key) => {
        str.push(`${p}[${key}]=${encodeURIComponent(obj[p][key])}`)
      })
    } else if (!isNil(obj[p]) && obj[p] !== '') {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.length ? '?' + str.join('&') : str.join('&')
}

export default serialize
