export const getSwatchInteractionEventPrefix = (index, swatchOverlay) => {
  if (index) {
    if (swatchOverlay) {
      return `P${index}:text overlay`
    } else {
      return `P${index}`
    }
  } else if (swatchOverlay) {
    return `hero:text overlay`
  }
  return 'hero'
}
