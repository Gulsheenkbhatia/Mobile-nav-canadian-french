import getSubNavigationData from './getSubNavigationData'
import type { MenuData } from 'store/menu-data.atom'

const cat = (cgid: string, extra = {}) =>
  ({
    cgid,
    name: cgid,
    url: '',
    subCategories: [],
    parentCategoryId: undefined,
    parentCategoryTree: [],
    ...extra,
  } as unknown)

const flatMenuData = {
  topCategories: ['parent'],
  parent: cat('parent', { subCategories: ['a', 'b'], displaySubNavInPLP: true }),
  a: cat('a', { parentCategoryId: 'parent' }),
  b: cat('b', { parentCategoryId: 'parent' }),
} as unknown as MenuData

const oneSiteMenuData = {
  coach: { ...flatMenuData },
  outlet: { topCategories: ['x'], x: cat('x') },
} as unknown as MenuData

describe('getSubNavigationData', () => {
  it('flat MenuData — returns siblings excluding current', () => {
    const result = getSubNavigationData(flatMenuData, 'a', true, [])
    expect(result.map((c) => c.cgid)).toEqual(['b'])
  })

  it('OneSite nested — produces same result as flat', () => {
    const flat = getSubNavigationData(flatMenuData, 'a', true, [])
    const nested = getSubNavigationData(oneSiteMenuData, 'a', true, [])
    expect(nested).toEqual(flat)
  })

  it('returns undefined when subNav is disabled', () => {
    const data = {
      ...flatMenuData,
      parent: cat('parent', { subCategories: ['a', 'b'], displaySubNavInPLP: false }),
    } as unknown as MenuData
    expect(getSubNavigationData(data, 'a', false, [])).toBeUndefined()
  })
})
