import { MenuData } from 'store/menu-data.atom'

const findAlternativeCategories = (categories: MenuData, targetId: string) => {
  const flattenCategrories = []

  Object.values(categories).forEach((category) => {
    if (
      !Array.isArray(category) &&
      (category?.alternativeCategoryId === targetId || category?.cgid === targetId)
    ) {
      flattenCategrories.push(category)
    }
  })

  return flattenCategrories
}

export default findAlternativeCategories
