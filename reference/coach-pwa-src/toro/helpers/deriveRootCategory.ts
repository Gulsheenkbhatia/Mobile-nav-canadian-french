import get from 'lodash/get'

const deriveRootCategory = (pageData) => {
  const categoryId = get(pageData, 'id', '')
  const parentCategory = get(pageData, 'breadcrumbs[0]', {})
  return [categoryId, parentCategory?.id ?? ''].some((el) => /sw-outlet/.test(el)) ||
    parentCategory?.categoryID === 'outlet'
    ? 'outlet'
    : parentCategory?.id || parentCategory?.categoryID
}

export default deriveRootCategory
