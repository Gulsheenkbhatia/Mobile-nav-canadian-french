import { getDaysFromSeconds } from 'toro/helpers/date'

describe('Date Util Testing', () => {
  const days = getDaysFromSeconds(86400)
  it('should return day equal to 1', () => {
    expect(days).toEqual(1)
  })
})
