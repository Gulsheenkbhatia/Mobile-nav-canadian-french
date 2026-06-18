import isPlainObject from 'lodash/isPlainObject'
import pick from 'lodash/pick'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { getCategoryUrl } from 'toro/lib/sales-force-connector/utils/getUrl'

export const getCategoryLinks = (category) => {
  if (!category?.cgid) {
    return
  }

  const { url: rawUrl, ID, cgid } = pick(category, ['url', 'ID', 'cgid'])
  // ID field is returned by new API and cgid by legacy one. Will be removed after full transition to new API.
  const url = rawUrl.replace(/.*\/\/.*?(\/.*)/gi, '$1')
  const categoryId = ID || cgid

  if (url) {
    return { url, cgid: categoryId }
  }

  return
}

const getCorrectDateInterval = (contentIdObject) => {
  const { from_date, to_date } = pick(contentIdObject, ['from_date', 'to_date'])
  const currentTimeInterval = new Date().getTime()
  const fromDateTime = new Date(from_date).getTime()
  const toDateTime = new Date(to_date).getTime()
  if (!fromDateTime && !toDateTime) {
    return true
  }
  if (fromDateTime && !toDateTime) {
    return fromDateTime < currentTimeInterval
  }
  if (!fromDateTime && toDateTime) {
    return currentTimeInterval < toDateTime
  }
  return fromDateTime < currentTimeInterval && currentTimeInterval < toDateTime
}

const getParsedNavFlyoutContentId = (navFlyoutContentId) => {
  try {
    const parsedContentIds = JSON.parse(navFlyoutContentId)
    if (Array.isArray(parsedContentIds)) {
      const { content_id = '' } = pick(parsedContentIds.find(getCorrectDateInterval), [
        'content_id',
      ])
      return content_id
    }
  } catch (e) {
    return navFlyoutContentId
  }
}

const parseFromJSON = (val, defaultValue) => {
  try {
    return JSON.parse(val)
  } catch (_err) {
    return defaultValue || val
  }
}

export const transformCategoryCustomAttributes = (attributes = {}) => {
  return Object.entries(attributes).reduce((prev, [key, value]) => {
    if (!key.includes('inlinePromoTileJson')) {
      prev[key.replace(/^c_/, '')] = parseFromJSON(value)
    }
    return prev
  }, {})
}

export const setCategoryFlyoutContent = (categories = [], flyout) => {
  if (categories?.length && isPlainObject(flyout) && get(flyout, 'online.default', false)) {
    const matchingCategory = categories.find((item) => item.navFlyoutContentId === flyout.id)
    if (matchingCategory) {
      matchingCategory.flyoutContent = flyout.content
    }
    categories.forEach((item) => setCategoryFlyoutContent(item.subCategories))
  }
}

const getRelativeUrl = (url) => {
  try {
    const urlObj = new URL(url, 'http://localhost:3000')
    return urlObj.pathname + urlObj.search
  } catch (e) {
    return url
  }
}

export const getCategory = (
  category,
  parentTree = [],
  rootCategory,
  deviceType = 'desktop',
  subBrandRootCategory,
  newCoachtopiaNav,
  pickRootOnly = false
) => {
  const {
    subCategories,
    ID,
    cgid,
    name,
    displayName,
    customCategoryAttributes: originalCustomCategoryAttributes = {},
  } = category

  /*
    ID, displayName, customCategoryAttributes.navFlyoutContentId, customCategoryAttributes.inlinePromoTileJson fields are returned by new API.
    cgid, name, navFlyoutContentId, inlinePromoTileJson are returned by legacy API.
    Will be removed after full transition to new API.
  */
  const categoryId = ID || cgid
  const categoryName = displayName || name || ''
  const navFlyoutContentId =
    originalCustomCategoryAttributes.navFlyoutContentId ||
    category.navFlyoutContentId ||
    originalCustomCategoryAttributes.c_navFlyoutContentId

  const customCategoryAttributes = transformCategoryCustomAttributes(
    originalCustomCategoryAttributes
  )

  const parentCategoryTree = isEmpty(parentTree)
    ? [{ cgid: categoryId, name: categoryName }]
    : [...parentTree, { cgid: categoryId, name: categoryName }]
  let parsedSubCategories

  if (Array.isArray(subCategories)) {
    if (!pickRootOnly) {
      parsedSubCategories = subCategories.reduce((acc, subCategory) => {
        if (isPlainObject(subCategory) && !isEmpty(subCategory)) {
          const updatedParentTree = [...parentTree, { cgid: categoryId, name: categoryName }]
          acc.push(getCategory(subCategory, updatedParentTree, rootCategory, deviceType))
        }
        return acc
      }, [])
    } else {
      parsedSubCategories = subCategories.map(({ ID, cgid }) => ID || cgid)
    }
  }
  const isRootCoachtopiaCategory = subBrandRootCategory === categoryId || undefined
  const isCoachTopiaSubCategory =
    (get(customCategoryAttributes, 'isCoachtopiaSubCategory', false) &&
      !isRootCoachtopiaCategory) ||
    undefined
  return {
    name: categoryName,
    cgid: categoryId,
    url: getRelativeUrl(category.url) || getCategoryUrl(parentCategoryTree),
    isOutletSubCategory: category.isOutletSubCategory,
    isOutlet: get(category, 'customCategoryAttributes.c_isOutlet', false),
    thredUpFlag:
      String(originalCustomCategoryAttributes?.c_isThredUpcategory || '').toLowerCase() === 'true',
    isCoachtopiaSubCategory: newCoachtopiaNav ? isCoachTopiaSubCategory : undefined,
    isCoachtopiaRootCategory: newCoachtopiaNav ? isRootCoachtopiaCategory : undefined,
    ...pick(customCategoryAttributes, [
      'isComparablePriceEnabled',
      'isEnableFitReviewLink',
      'isSaleCategory',
      'isSourceCodedSaleCategory',
      'navFlyoutImage',
      'firstVisitImages',
      'navImageUrl',
      'navFlyoutCategoryStyle',
      'navFlyoutCatStyleMob',
      'alternativeCategoryId',
      'alternativeUrl',
      'displaySubNavinPLP',
      'sizeChartID',
      'footMeasureContentId',
      'categoryImageSequence',
      'calloutinfo',
      'bgColorForSubNavHP',
      'catNameColorForSubNavHP',
      'similarProductConfigs',
      'enableVisuallySimilar',
      'exposedPriceFilters',
      'enableFocusFilter',
      'sizeBodyText',
      'sizeDefaultAsset',
      'sizeHeadline',
      'spaceBodyText',
      'spaceDefaultAsset',
      'spaceHeadline',
      'seeHowFitsHeadline',
      'seeHowFitsBodyText',
      'seeHowFitsDefaultAsset',
      'handlesBodyText',
      'handlesDefaultAsset',
      'handlesHeadline',
      'materialsBodyText',
      'materialsDefaultAsset',
      'materialsHeadline',
      'featuresHeadline',
      'featuresBodyText',
      'featuresDefaultAsset',
      'featuresContentHeader',
      'featuresContentImage',
      'sketchDiagramContainerImage',
      'searchName',
      'disableRVRecommendations',
      'defaultRVRecommendationsClosed',
    ]),
    ...(deviceType === 'desktop'
      ? {
          navFlyoutContentId: getParsedNavFlyoutContentId(navFlyoutContentId),
          showDesktopTier3Image: get(customCategoryAttributes, 'showDesktopTier3Image'),
        }
      : {
          navFlyoutContentId: isRootCoachtopiaCategory
            ? getParsedNavFlyoutContentId(navFlyoutContentId)
            : null,
          showMobileTier3Image: get(customCategoryAttributes, 'showMobileTier3Image'),
        }),
    // if ID returned from new API exists, return scheduledCustomerGroups from customAttributes, in other case parse legacy one.
    scheduledCustomerGroups: ID
      ? customCategoryAttributes.scheduledCustomerGroups.split(',').filter((group) => !!group)
      : category.scheduledCustomerGroups,
    subCategories: parsedSubCategories,
    parentCategoryId: parentTree[parentTree.length - 1]?.cgid || 'root',
    parentCategoryTree,
    parentWyngFilterUUID: get(rootCategory, 'customCategoryAttributes.c_wyngFilterUUID'),
  }
}
