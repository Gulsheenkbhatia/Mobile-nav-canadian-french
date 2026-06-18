const selectIfCondition = <T>(
  condition: boolean,
  source: T | (() => Promise<T> | T),
  fallback: T | null = null
): Promise<T | null> | T | null => {
  if (!condition) return fallback
  if (typeof source === 'function') {
    const result = (source as () => Promise<T> | T)()
    return result instanceof Promise ? result : Promise.resolve(result)
  }
  return source
}

export default selectIfCondition
