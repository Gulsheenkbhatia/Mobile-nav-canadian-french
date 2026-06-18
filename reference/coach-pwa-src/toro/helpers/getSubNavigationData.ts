import findAlternativeCategories from 'toro/helpers/findAlternativeCategories'
import pick from 'lodash/pick'
import get from 'lodash/get'
import generateCategoryQaAttribute from 'toro/helpers/generateCategoryQaAttribute'
import { getCategoriesByCgIds } from 'toro/helpers/menu'
import { MenuData } from 'store/menu-data.atom'
import { BRANDS, type Brand } from 'lib/oneSite/config'

type BreadcrumbItem = {
  absUrl?: string
  alternateH1Tag?: string
  categoryID?: string
  htmlValue?: string
  url?: string
}

/**
 * OneSite menu data is keyed by brand: { coach: MenuData, outlet: MenuData, coachtopia: MenuData }
 * Detect by checking whether both main OneSite brand keys (coach, outlet) exist.
 * These never appear as standalone category IDs (always prefixed: coach-women, outlet-bags, etc.).
 * Note: coachtopia is intentionally excluded from the check because it can also appear
 * as a category key inside flat MenuData (added as a synthetic L1 submenu item).
 */
type BrandKeyedMenuData = {
  [key in Brand]: MenuData
}

export const flattenIfNested = (categories: MenuData | BrandKeyedMenuData): MenuData => {
  const isBrandKeyed = BRANDS.COACH in categories && BRANDS.OUTLET in categories
  if (!isBrandKeyed) return categories as MenuData
  return Object.assign({}, ...Object.values(categories)) as MenuData
}

const getSubNavigationData = (
  rawCategories: MenuData | BrandKeyedMenuData,
  sapiCategoryId: string,
  enableSubNavInPLPFromSapi: boolean,
  breadcrumbs: BreadcrumbItem[]
) => {
  const categories = flattenIfNested(rawCategories)
  // We need to look for alternative categories for the case when the category is not in menu-data (redirection)
  const alternativeCategories = findAlternativeCategories(categories, sapiCategoryId)

  let category = alternativeCategories.length
    ? alternativeCategories[alternativeCategories.length - 1]
    : {}

  const categoryBreadcrumb =
    breadcrumbs && breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1] : {}
  const parentCategoryBreadcrumb =
    breadcrumbs && breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 2] : {}

  const alternativeCategory = alternativeCategories.find(
    (item) => item?.cgid === category?.alternativeCategoryId
  )

  const currentParentCategory = categories[category?.parentCategoryId]

  const alternativeParentCategory = categories[alternativeCategory?.parentCategoryId]

  let parentCategory

  if (
    alternativeParentCategory &&
    alternativeParentCategory?.subCategories &&
    category?.parentCategoryId !== alternativeCategory?.parentCategoryId &&
    (category.alternativeUrl !== categoryBreadcrumb?.absUrl ||
      (category.alternativeUrl === categoryBreadcrumb?.absUrl &&
        categoryBreadcrumb?.absUrl === parentCategoryBreadcrumb?.absUrl))
  ) {
    const alternativeParentSubcategories = getCategoriesByCgIds(
      categories,
      alternativeParentCategory?.subCategories
    )
    category = alternativeParentSubcategories.find(
      (item) => item.cgid === category?.alternativeCategoryId
    )
    parentCategory = alternativeParentCategory
  } else {
    parentCategory = currentParentCategory
  }

  const isViewAllCategory =
    parentCategory?.alternativeCategoryId === category?.cgid ||
    (parentCategory?.alternativeCategoryId === sapiCategoryId &&
      category?.alternativeCategoryId === sapiCategoryId) ||
    parentCategory?.subCategories?.find((id) => id === category?.cgid)

  const targetCategory = isViewAllCategory ? parentCategory : category

  const displaySubNavInPLP =
    get(targetCategory, 'displaySubNavInPLP', false) ||
    get(category, 'displaySubNavInPLP', false) ||
    enableSubNavInPLPFromSapi

  const targetCategorySubCategories = getCategoriesByCgIds(
    categories,
    targetCategory?.subCategories
  )
  if (!displaySubNavInPLP || !targetCategorySubCategories.length) return
  return targetCategorySubCategories?.reduce((acc, item) => {
    if (item?.cgid === category?.cgid) {
      return acc
    }
    if (
      (targetCategory.alternativeCategoryId !== item?.cgid &&
        targetCategory.alternativeCategoryId !== item?.alternativeCategoryId) ||
      !targetCategory.alternativeCategoryId
    ) {
      const { parentCategoryTree } = item
      const dataQA = generateCategoryQaAttribute(parentCategoryTree)
      const subNavCategory = pick(item, [
        'cgid',
        'alternativeCategoryId',
        'url',
        'name',
        'isOutlet',
        'isSaleCategory',
        'isSourceCodedSaleCategory',
        'scheduledCustomerGroups',
        'parentCategoryTree',
      ])
      acc.push({ ...subNavCategory, dataQA })
    }
    return acc
  }, [])
}

export default getSubNavigationData
