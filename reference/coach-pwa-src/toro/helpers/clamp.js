/**
 * Clamps the number between the specified 'min' and 'max' values
 * @param {number} val The number to clamp
 * @param {number} min The lower limit of the clamp interval
 * @param {number} max The upper limit of the clamp interval
 * @returns {number} The clamped value.
 * @example Clamping 50 in the interval [100, 200] will return 100
 * @example Clamping 150 in the interval [100, 200] will return 150
 * @example Clamping 250 in the interval [100, 200] will return 200
 */
export default function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}
