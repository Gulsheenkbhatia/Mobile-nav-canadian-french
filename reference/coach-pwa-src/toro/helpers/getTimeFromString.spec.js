import { getSitePreviewTimeFromString, getTimeFromValidDateString } from './getTimeFromString'

describe('src/toro/helpers/getSitePreviewTimeFromString.js', () => {
  // Test case 1: Convert a date string to timestamp in local time
  test('Converts a date string to timestamp in local time', () => {
    const string = '202305151230' // May 15, 2023, 12:30 PM
    const format = 'local'

    const result = getSitePreviewTimeFromString(string, format)

    expect(typeof result).toBe('number')
    expect(result).toBe(new Date('2023-05-15:12:30').getTime())
  })

  // Test case 2: Convert a date string to timestamp in UTC
  test('Converts a date string to timestamp in UTC', () => {
    const string = '202305151230' // May 15, 2023, 12:30 PM
    const format = 'UTC'
    const result = getSitePreviewTimeFromString(string, format)

    expect(typeof result).toBe('number')
    expect(result).toBe(new Date(new Date('2023-05-15:17:30')).getTime())
  })
})

describe('src/toro/helpers/getTimeFromValidDateString.js', () => {
  // Test case 1: Convert the current date to timestamp in local time
  test('Converts the current date to timestamp in local time', () => {
    const returnTodayTime = true
    const format = 'local'

    const result = getTimeFromValidDateString(returnTodayTime, format)

    expect(typeof result).toBe('number')
    expect(result).toBeCloseTo(Date.now(), -5)
  })

  // Test case 2: Convert the current date to timestamp in UTC
  test('Converts the current date to timestamp in UTC', () => {
    const returnTodayTime = true
    const format = 'UTC'

    const result = getTimeFromValidDateString(returnTodayTime, format)

    expect(typeof result).toBe('number')
    expect(result).toBeCloseTo(Date.now(), -5)
  })

  // Test case 3: Convert a specified date to timestamp in local time
  test('Converts a specified date to timestamp in local time', () => {
    const returnTodayTime = false
    const format = 'local'
    const string = '2023-05-26T00:00:00Z'

    const result = getTimeFromValidDateString(returnTodayTime, format, string)

    expect(typeof result).toBe('number')
    expect(result).toBe(1685059200000)
  })

  // Test case 4: Convert a specified date to timestamp in UTC
  test('Converts a specified date to timestamp in UTC', () => {
    const returnTodayTime = false
    const format = 'UTC'
    const string = '2023-07-01T00:00:00Z'

    const result = getTimeFromValidDateString(returnTodayTime, format, string)

    expect(typeof result).toBe('number')
    expect(result).toBe(1688169600000)
  })

  // Test case 5: Convert a empty date to timestamp in UTC
  test('Converts a specified date to timestamp in UTC', () => {
    const returnTodayTime = false
    const format = 'UTC'
    const string = ''

    const result = getTimeFromValidDateString(returnTodayTime, format, string)

    expect(typeof result).toBe('number')
    expect(result).toBe(NaN)
  })
})
