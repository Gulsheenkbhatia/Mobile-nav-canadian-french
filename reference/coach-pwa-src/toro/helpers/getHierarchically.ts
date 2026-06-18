import get from 'lodash/get'
import isNil from 'lodash/isNil'

/**
 * Returns a function that searches for a value at the given path in a list of objects,
 * returning the first non-null/non-undefined value found.
 *
 * @param {string} path - The lodash-style path to search for in each object.
 * @returns {(args: Record<string, any>[]) => any} - A function that takes objects and returns the first found value.
 *
 * @example
 * const getName = getHierarchically('user.name')({ user: { name: null } }, { user: { name: 'Alice' } })
 * // result === 'Alice'
 */
function getHierarchically(path: string | string[]) {
  return function getRecursively(...args: Record<string, any>[]) {
    if (!args.length) return
    const currentArgument = args.at(0)
    const remainingArguments = args.slice(1)
    const value = get(currentArgument, path)
    return !isNil(value) ? value : getRecursively(...remainingArguments)
  }
}

export default getHierarchically
