import { useRouter } from 'next/router'
import isRegExp from 'lodash/isRegExp'

/**
 * Custom React hook that checks if the current pathname matches a given regular expression.
 *
 * @param {RegExp} regexp - The regular expression to test against the current pathname.
 * @returns {boolean} - Returns `true` if the pathname matches the regular expression, otherwise `false`.
 */
const usePathnameMatch = (regexp: RegExp): boolean => {
  const { pathname } = useRouter()

  if (!isRegExp(regexp)) {
    return false
  }

  return regexp.test(pathname)
}

export default usePathnameMatch
