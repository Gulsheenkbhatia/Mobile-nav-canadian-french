/** Words that should stay all-caps (acronyms, currency). */
const ALL_CAPS_WORD = /^[A-Z]{2,}$/
const CURRENCY_CODE = /^\$[A-Za-z]+$/

function formatWord(word: string): string {
  if (!word) return word
  if (ALL_CAPS_WORD.test(word) || CURRENCY_CODE.test(word)) {
    return word.toUpperCase()
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/**
 * Title case for nav headlines — capitalize the first letter of each word.
 * Preserves short acronyms (QA, SIT) and currency tokens ($USD).
 */
export function toNavHeadlineCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map(formatWord)
    .join(' ')
}
