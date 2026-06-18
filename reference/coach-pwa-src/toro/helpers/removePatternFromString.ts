export const ONCLICK_INLINE_FN_PATTERN_START = 'onclick'
const ONCLICK_INLINE_FN_PATTERN_END = ';"'

interface IRemovePatternFromString {
  (string: string, startPattern?: string, endPattern?: string): string
}

export const removePatternFromString: IRemovePatternFromString = (
  string,
  startPattern = ONCLICK_INLINE_FN_PATTERN_START,
  endPattern = ONCLICK_INLINE_FN_PATTERN_END
) => {
  const firstIndex = string?.indexOf(startPattern)
  if (firstIndex < 0) {
    return string
  }
  const secondIndex = string?.slice(firstIndex)?.indexOf(endPattern) + endPattern.length
  if (secondIndex < 0) {
    return string
  }
  const patternForReplace = string.slice(firstIndex, firstIndex + secondIndex)
  const handledString = string.replace(patternForReplace, '')
  return handledString
}
