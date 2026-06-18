import pick from 'lodash/pick'

/**
 * Creates a function that picks specified keys from each argument object,
 * merging the results hierarchically (leftmost objects take precedence).
 *
 * @param path - The key(s) to pick from each object.
 * @returns A function that accepts multiple objects and merges picked keys.
 */
function pickHierarchically(path: string | string[]) {
  return function pickRecursively(...args: Record<string, any>[]) {
    if (!args.length) return
    const currentArgument = args.at(0)
    const remainingArguments = args.slice(1)
    const picked = pick(currentArgument, path)
    return { ...pickRecursively(...remainingArguments), ...picked }
  }
}

export default pickHierarchically
