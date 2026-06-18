import { SMALL_NUM } from 'toro/constants/math'

/**
 * Linear mapping of a value from its interval to another interval.
 * @param {number} value Value to map, belongs to domain interval.
 * @param {number[]} domain Interval that contains the value to map.
 * @param {number[]} values Interval to map the value to.
 * @param {boolean} roundToInt Whether to round the output value, defaults to true.
 * @returns {number} Value mapped to the values interval.
 * @example For domain [0, 10] and values [0, 1000], mapping the value 5 will return 500.
 */
export function mapLinear(value, domain, values, roundToInt = true) {
  const scale = (values[1] - values[0]) / (domain[1] - domain[0])
  const val = values[0] + scale * (value - domain[0])
  return roundToInt ? Math.round(val) : val
}

/**
 * Natural logarithm mapping of a value from its interval to another interval.
 * @param {number} value Value to map, belongs to domain interval.
 * @param {number[]} domain Interval that contains the value to map.
 * @param {number[]} values Interval to map the value to.
 * @param {boolean} roundToInt Whether to round the output value, defaults to true.
 * @returns {number} Value mapped to the values interval.
 * @example For domain [0, 10] and values [1, 1000], mapping the value 5 will return 32.
 */
export function mapLn(value, domain, values, roundToInt = true) {
  const lnValues = [Math.log(values[0] + SMALL_NUM), Math.log(values[1] + SMALL_NUM)]
  const scale = (lnValues[1] - lnValues[0]) / (domain[1] - domain[0])
  const exp = Math.exp(lnValues[0] + scale * (value - domain[0]))
  return roundToInt ? Math.round(exp) : exp
}

/**
 * Reverse natural logarithm mapping of a value from its interval to another interval.
 * @param {number} value Value to map, belongs to domain interval.
 * @param {number[]} domain Logarithm interval that contains the value to map.
 * @param {number[]} values Interval to map the value to.
 * @param {boolean} roundToInt Whether to round the output value, defaults to true.
 * @returns {number} Value mapped to the values interval.
 * @example For domain [1, 1000] and values [0, 10], mapping the value 32 will return 5.
 */
export function mapLnRev(value, domain, values, roundToInt = true) {
  const lnDomain = [Math.log(domain[0] + SMALL_NUM), Math.log(domain[1] + SMALL_NUM)]
  const scale = (values[1] - values[0]) / (lnDomain[1] - lnDomain[0])
  const val = values[0] + scale * (Math.log(value + SMALL_NUM) - lnDomain[0])
  return roundToInt ? Math.round(val) : val
}
