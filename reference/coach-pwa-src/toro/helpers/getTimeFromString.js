/**
 * Returns the timestamp (in milliseconds) of a given string representing a date and time.
 * The string should be in the format "YYYYMMDDHHmm" (e.g., "202305151230" for May 15, 2023, 12:30 PM).
 * The business expects that site preview time is in EST timezone, so the returned date will be in EST
 *
 * @param {string} string - The input string representing the date and time.
 * @param {string} format - The desired format of the returned timestamp. Valid values are "UTC" and any other value.
 *                          If set to "UTC", the timestamp will be in UTC time; otherwise, it will be in local time.
 * @param {number} timeZoneOffsetInHours - The timezone offset to align previewTool with EST time (by default 5).
 * @returns {number} The timestamp (in milliseconds) of the specified date and time.
 */

export const getSitePreviewTimeFromString = (string, format, timeZoneOffsetInHours = 5) => {
  const [year, month, day, hour, minute] = [
    string.substring(0, 4),
    string.substring(4, 6),
    string.substring(6, 8),
    string.substring(8, 10),
    string.substring(10, 12),
  ]
  const dateStr = `${year}-${month}-${day}T${hour}:${minute}:00`

  const offset = new Date().getTimezoneOffset()
  const localOffset = offset / 60
  const estOffset = localOffset - timeZoneOffsetInHours

  const newDateFromStr = new Date(new Date(dateStr).getTime() - estOffset * 60 * 60 * 1000)

  const date = format === 'UTC' ? newDateFromStr.toUTCString() : new Date(dateStr)
  return new Date(date).getTime()
}

/**
 * Returns the timestamp (in milliseconds) of the current date and time or a specified date and time.
 *
 * @param {boolean} returnTodayTime - A flag indicating whether to return the timestamp of the current date and time.
 *                                   If set to true, the current date and time will be used. If set to false,
 *                                   the specified date and time will be used.
 * @param {string} format - The desired format of the returned timestamp. Valid values are "UTC" and any other value.
 *                          If set to "UTC", the timestamp will be in UTC time; otherwise, it will be in local time.
 * @param {string} [string] - (Optional) The string representing the date and time. This parameter is required only if
 *                            returnTodayTime is set to false. The string should be in any valid date format .
 *
 * @returns {number} The timestamp (in milliseconds) of the current or specified date and time.
 */
export const getTimeFromValidDateString = (returnTodayTime, format, string = '') => {
  const date = returnTodayTime ? new Date() : new Date(string)
  const dateStr = format === 'UTC' ? date.toUTCString() : date.toString()
  return Date.parse(dateStr)
}
