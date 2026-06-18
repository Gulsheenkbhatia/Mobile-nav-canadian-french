import { getIsPaginatedPlpReload } from './virtualReferrer'

describe('getIsPaginatedPlpReload', () => {
  it('should properly defines if reload of paginated PLP has happened', () => {
    expect(getIsPaginatedPlpReload('', '')).toBe(false)
    expect(getIsPaginatedPlpReload('https://coach.com/', 'https://coach.com/')).toBe(false)
    expect(
      getIsPaginatedPlpReload(
        'https://coach.com/shop/new/view-all',
        'https://coach.com/shop/new/view-all'
      )
    ).toBe(false)
    expect(
      getIsPaginatedPlpReload(
        'https://coach.com/shop/new/view-all?page=4',
        'https://coach.com/shop/new/view-all'
      )
    ).toBe(true)
    expect(
      getIsPaginatedPlpReload(
        'https://coach.com/shop/new/view-all?page=4&sort=top',
        'https://coach.com/shop/new/view-all'
      )
    ).toBe(false)
    expect(
      getIsPaginatedPlpReload(
        'https://coach.com/shop/new/view-all?page=4',
        'https://coach.com/shop/men/view-all'
      )
    ).toBe(false)
  })
})
