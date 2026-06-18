/**
 * Returns true when user prefers reduced motion.
 */
export default function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return Boolean(mediaQuery && mediaQuery.matches)
}
