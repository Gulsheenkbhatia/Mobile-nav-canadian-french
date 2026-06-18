import _get from 'lodash/get'
import isPlainObject from 'lodash/isPlainObject'

export type CategoryPricingFlags = {
  cleanStateDisplayDiscountPercentage?: boolean
  fallbackHideDiscountRate?: boolean
  fallbackHideComparableValue?: boolean
}

const getBooleanSapiData = (root: Record<string, unknown>, key: string) => {
  const value = _get(root, key)
  return typeof value === 'boolean' ? value : undefined
}

export function resolveCategoryPricingFlags(sapiData: unknown): CategoryPricingFlags {
  const root = isPlainObject(sapiData) ? (sapiData as Record<string, unknown>) : {}

  const cleanStateDisplayDiscountPercentage = getBooleanSapiData(
    root,
    'cleanStateDisplayDiscountPercentage'
  )
  const fallbackHideDiscountRate = getBooleanSapiData(root, 'fallbackHideDiscountRate')
  const fallbackHideComparableValue = getBooleanSapiData(root, 'fallbackHideComparableValue')

  return {
    cleanStateDisplayDiscountPercentage,
    fallbackHideDiscountRate,
    fallbackHideComparableValue,
  }
}
