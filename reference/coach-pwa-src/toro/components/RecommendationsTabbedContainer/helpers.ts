import {
  Filter,
  TabbedRecommendationsConfig,
  type TabFilter,
} from 'toro/components/RecommendationsTabbedContainer/types'

export const DEFAULT_FILTER = 0

// Helper function to convert filter to XGEN context format
// This function prevents context layering by resetting all filter values and setting only the active one.
// Only one filter can be active at a time (size, color, material, etc.).
// E.g. if user activates black color, the previously activated small bag size should not remain in context.
export const getXgenFilterContext = (
  filter: Filter,
  xgenContext: Record<TabFilter['filterType'], undefined>
): Record<TabFilter['filterType'], TabFilter['value']> => {
  if (!filter) return {}

  const { filterType, value } = filter
  return { ...xgenContext, [filterType]: value }
}

export const getXgenInitialFilterContext = (
  filters: TabbedRecommendationsConfig['filters']
): Record<TabFilter['filterType'], undefined> => {
  return filters.reduce((acc, filter) => {
    acc[filter.filterType] = undefined
    return acc
  }, {})
}
