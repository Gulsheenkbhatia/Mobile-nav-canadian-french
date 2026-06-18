import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import pick from 'lodash/pick'
import isArray from 'lodash/isArray'

export default function getProductCategoryAttributeConfig(
  menuData,
  categoryData,
  attributeKey: string | string[],
  defaultValue: any = {}
) {
  if (isArray(attributeKey)) {
    const productCategoryAttributes = pick(categoryData, attributeKey)
    if (!isEmpty(productCategoryAttributes)) {
      return productCategoryAttributes
    }
  } else {
    const productCategoryAttribute = get(categoryData, attributeKey)

    if (productCategoryAttribute) {
      return productCategoryAttribute
    }
  }

  if (isEmpty(categoryData) || categoryData?.parentCategoryId === 'root') {
    return defaultValue
  }

  const parentCategory = get(menuData, categoryData.parentCategoryId, {})
  return getProductCategoryAttributeConfig(menuData, parentCategory, attributeKey, defaultValue)
}
