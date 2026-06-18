/**
 * Determines if Flock swatches should be used for a product based on feature flags
 * and category eligibility.
 */
export default function shouldUseFlockSwatches(
  enableFlockColorSwatches: boolean,
  isPDPv6: boolean,
  currentCategoryId?: string | null
): boolean {
  if (!enableFlockColorSwatches || !isPDPv6) {
    return false
  }

  if (!currentCategoryId) {
    return false
  }

  // Pattern breakdown:
  // - women-(?:handbags|bags) - matches "women-handbags" or "women-bags" anywhere in the string
  //   e.g. also matches "outlet-women-handbags" and "retail-women-handbags" because the pattern is unanchored
  // - ^(?:outlet-|retail-)?bags - matches strings starting with "bags" with an optional "outlet-" or "retail-" prefix
  const flockSwatchPattern = /women-(?:handbags|bags)|^(?:outlet-|retail-)?bags/
  return flockSwatchPattern.test(currentCategoryId)
}
