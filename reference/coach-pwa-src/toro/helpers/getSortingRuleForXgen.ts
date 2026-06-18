import isString from 'lodash/isString'

enum SORT_ORDER {
  descending = 'desc',
  ascending = 'asc',
}

const getSortingRuleForXgen = (srule: string): { sortBy: string; sortOrder: string } => {
  const [sortBy, sortOrder] = srule && isString(srule) ? srule.split('__') : []
  return { sortBy: sortBy || 'relevance', sortOrder: SORT_ORDER[sortOrder] || 'desc' }
}

export default getSortingRuleForXgen
