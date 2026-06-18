import { useMemo } from 'react'
import flattenDeep from 'lodash/flattenDeep'
import useProductData from 'toro/hooks/useProductData'

type ProductCategoryValue = unknown

const SHOES_CATEGORY_PATTERN = /\b(shoe|shoes|footwear|flat)\b/i
const BAG_CATEGORY_PATTERN = /\b(bag|bags|handbag|handbags)\b/i

export type ProductCategoryFlags = {
  isShoeCategory: boolean
  isBagCategory: boolean
}

export function getProductCategoryFlags(
  productCategory: ProductCategoryValue
): ProductCategoryFlags {
  const normalizedCategories = flattenDeep([productCategory]).filter(
    (category): category is string => typeof category === 'string'
  )

  return {
    isShoeCategory: normalizedCategories.some((category) => SHOES_CATEGORY_PATTERN.test(category)),
    isBagCategory: normalizedCategories.some((category) => BAG_CATEGORY_PATTERN.test(category)),
  }
}

const useProductCategoryFlags = () => {
  const categorySignals = useProductData([
    'item_category',
    'pickedProps.promotionData.item_category',
    'category_id',
    'masterProductData.primaryCategoryId',
    'parentCategoryId',
    'custom.c_filterCategory',
  ])

  return useMemo(() => getProductCategoryFlags(categorySignals), [categorySignals])
}

export default useProductCategoryFlags
