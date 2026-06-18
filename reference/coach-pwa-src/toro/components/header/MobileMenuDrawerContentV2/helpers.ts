import get from 'lodash/get'
import type Category from 'toro/types/categoryTypes'

export function getMobileNavigationT2DataQA(category: Category) {
  const parentCategoryId = get(category, 'parentCategoryId')
  const cgid = get(category, 'cgid')

  return `l2_nav_${parentCategoryId}_${cgid}`
}

export function getMobileNavigationT3DataQa(category: Category) {
  const parentCategoryTreeCgid = get(category, 'parentCategoryTree[0].cgid')
  const parentCategoryId = get(category, 'parentCategoryId')
  const cgid = get(category, 'cgid')

  return `l3_nav_${parentCategoryTreeCgid}_${parentCategoryId}_${cgid}`
}

export function getDataQa(data: string, tierNum: number) {
  return `newNav_T${tierNum}_${data}`
}
