export type CategoryModuleId =
  | 'sketch'
  | 'waysToWear'
  | 'specs'
  | 'features'
  | 'contentAreas'
  | 'makeItYours'
  | 'compare'

export type TailModuleId = 'ugc' | 'ymal' | 'recentlyViewed' | 'reviews'

export type PdpV7StackModuleId = CategoryModuleId | TailModuleId

export type LowerStackCategory = 'bag' | 'shoe'

export type LowerStackSessionKey = 'firstVisit' | 'repeatVisit'

export const lowerStackCategoryModuleIds: readonly CategoryModuleId[] = [
  'sketch',
  'waysToWear',
  'specs',
  'features',
  'contentAreas',
  'makeItYours',
  'compare',
]

export const lowerStackTailModuleIds: readonly TailModuleId[] = [
  'ugc',
  'ymal',
  'recentlyViewed',
  'reviews',
]

export const lowerStackModuleIdSet = new Set<string>([
  ...lowerStackCategoryModuleIds,
  ...lowerStackTailModuleIds,
])

interface CategoryDefaultsByContext {
  bag: Record<LowerStackSessionKey, CategoryModuleId[]>
  shoe: Record<LowerStackSessionKey, CategoryModuleId[]>
}

export const lowerStackCategoryDefaults: CategoryDefaultsByContext = {
  bag: {
    firstVisit: [
      'sketch',
      'waysToWear',
      'specs',
      'features',
      'contentAreas',
      'makeItYours',
      'compare',
    ],
    repeatVisit: [
      'waysToWear',
      'compare',
      'features',
      'specs',
      'sketch',
      'makeItYours',
      'contentAreas',
    ],
  },
  shoe: {
    firstVisit: ['sketch', 'specs', 'features', 'contentAreas', 'makeItYours', 'compare'],
    repeatVisit: ['compare', 'specs', 'sketch', 'contentAreas', 'makeItYours'],
  },
}

interface FullLowerStackDefaultsByContext {
  bag: Record<LowerStackSessionKey, Array<PdpV7StackModuleId>>
  shoe: Record<LowerStackSessionKey, Array<PdpV7StackModuleId>>
}

export const lowerStackDefaults: FullLowerStackDefaultsByContext = {
  bag: {
    firstVisit: [...lowerStackCategoryDefaults.bag.firstVisit, ...lowerStackTailModuleIds],
    repeatVisit: [...lowerStackCategoryDefaults.bag.repeatVisit, ...lowerStackTailModuleIds],
  },
  shoe: {
    firstVisit: [...lowerStackCategoryDefaults.shoe.firstVisit, ...lowerStackTailModuleIds],
    repeatVisit: [...lowerStackCategoryDefaults.shoe.repeatVisit, ...lowerStackTailModuleIds],
  },
}
