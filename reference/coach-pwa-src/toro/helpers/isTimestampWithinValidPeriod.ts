/**
 * Checks if the given timestamp is within the valid period based on the specified number of days.
 *
 * @param {number} timestamp - The timestamp to check (in seconds).
 * @param {number} daysThreshold - The number of days to check against for expiration.
 * @returns {boolean} - Returns true if the timestamp is within the valid period, false otherwise.
 */
export function isTimestampWithinValidPeriod(timestamp: number, daysThreshold: number): boolean {
  const secondsInDay = 24 * 60 * 60 // Number of seconds in a day (24 * 60 * 60) = 86400

  const now = Math.floor(Date.now() / 1000) // Current timestamp in seconds

  const expirationThreshold = now - daysThreshold * secondsInDay

  return timestamp > expirationThreshold
}
