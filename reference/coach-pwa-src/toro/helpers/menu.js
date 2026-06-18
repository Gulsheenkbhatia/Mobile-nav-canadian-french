import get from 'lodash/get'
import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'

export const getCustomerGroupsFromSession = (session) => {
  return get(session, 'user.CustomerGroups.customerGroups', []).reduce((sum, group) => {
    return [...sum, ...get(group, 'name', '').split(',')]
  }, [])
}

export const isVisibleMenuCategory = (session, category) => {
  const sessionCustomerGroups = getCustomerGroupsFromSession(session)
  const sourceCodeGroupCategoryID = get(session, 'user.sourceCodeGroupCategoryID')
  const listSourceCodeGroupCategoriesID = get(session, 'user.listSourceCodeGroupCategoriesID', [])
  const categoryCustomerGroups = get(category, 'scheduledCustomerGroups', [])

  // Check is category.cgid contains in listSourceCodeGroupCategoriesID this needed when customer
  // added several category ids for one src promotion
  const isCategoryIdInSrcGroup =
    listSourceCodeGroupCategoriesID.some((item) => item === category.cgid) ||
    category.cgid === sourceCodeGroupCategoryID

  return Boolean(
    (!category.isSaleCategory ||
      (category.isSaleCategory && category.isSourceCodedSaleCategory && isCategoryIdInSrcGroup)) &&
      (!(category.isSaleCategory || category.isSourceCodedSaleCategory) ||
        (category.isSaleCategory && category.isSourceCodedSaleCategory)) &&
      (!categoryCustomerGroups?.length ||
        categoryCustomerGroups.find((catCustGroup) => sessionCustomerGroups.includes(catCustGroup)))
  )
}

export const getVisibleMenuData = (fullMenuData, session, isShowBundleSave) => {
  if (!fullMenuData) {
    return {}
  }

  const filteredMenuData = Object.keys(fullMenuData).reduce((sum, key) => {
    const category = fullMenuData[key]
    if (
      (category.cgid === 'bundleandsave' && !isShowBundleSave) ||
      (!isVisibleMenuCategory(session, category) && key !== 'topCategories')
    ) {
      return sum
    }

    return {
      ...sum,
      [key]: category,
    }
  }, {})

  return filteredMenuData
}

export function isCategoryVisible(category) {
  const isOutlet = get(category, 'customCategoryAttributes.c_isOutlet') === true
  // EU must return both Retail and Outlet categories. `isOutletSubCategory`
  // is included only when the oneCoachOutletCategoryToggle is ON in SFCC’s GetCategoryInfo API.
  const isRetailCategory = get(category, 'isOutletSubCategory') === false
  return isPlainObject(category) && !isEmpty(category) && (isRetailCategory || !isOutlet)
}

const flatAllCategoriesRecursively = (category) => {
  const data = Array.isArray(category) ? category : [category]
  return data.reduce((prev, curr) => {
    if (Array.isArray(curr)) {
      return prev.concat(flatAllCategoriesRecursively(category))
    }
    if (curr?.subCategories?.length) {
      return prev.concat(curr).concat(flatAllCategoriesRecursively(curr?.subCategories))
    }
    return prev.concat(curr)
  }, [])
}

const getCgId = (category) => category.cgid

const simplifySubCategoriesInCategory = (category) => ({
  ...category,
  subCategories: get(category, 'subCategories', []).map(getCgId),
  isOutletSubCategory: get(category, 'isOutletSubCategory', false),
})

export const normalizeMenuData = (rawCategories) => {
  const flatCategoriesArray = flatAllCategoriesRecursively(rawCategories).map(
    simplifySubCategoriesInCategory
  )

  const flatCategoriesObject = flatCategoriesArray.reduce(
    (sum, category) => ({
      ...sum,
      [category.cgid]: category,
    }),
    {}
  )

  return {
    topCategories: rawCategories.map(getCgId),
    ...flatCategoriesObject,
    length: flatCategoriesArray.length,
  }
}

export function getCategoriesByCgIds(menuData, cgIds = []) {
  return cgIds.reduce((sum, cgId) => [...sum, menuData[cgId]], []).filter((category) => category)
}

export const getSubBrandRootCategoryId = (preferences, subBrand) => {
  return preferences?.[subBrand]?.[`${subBrand}RootCategory`]
}
