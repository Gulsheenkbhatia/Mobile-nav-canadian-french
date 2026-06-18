import get from 'lodash/get'
import has from 'lodash/has'
import isArray from 'lodash/isArray'
import flattenDeep from 'lodash/flattenDeep'
import {
  badgeTypes,
  badgeTypesOnImage,
  badgeTypesUnderCTA,
} from 'toro/components/badges/constants/badgeTypes'
import {
  MarketingConfType,
  PageTypeLc,
  ProductForBadges,
  ValidBadgeID,
} from 'toro/components/badges/types'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import { SearchVariationGroupData } from 'toro/search'
import { DetailedProduct, VariantGroupData } from 'toro/types/productTypes'

type BadgePriority = {
  badgeArea: BadgeArea
  badgeID: ValidBadgeID
  rank: number
}

export type Preference = {
  id: string
  site_values?: { [siteId: string]: any }
}

type GetBadgeTypesListByAreaParams = {
  page: PageTypeLc
  area: BadgeArea
  badgingPreferences: Preference[]
  siteId: string
  product?: ProductForBadges
  variationGroupData?: SearchVariationGroupData
  masterData?: DetailedProduct['master']
  bestSellerCheck?: boolean
  instockText?: string
  selectedVG?: VariantGroupData
  isViewedProduct?: boolean
  isMobile?: boolean
}

type GetBadgeTypesListByAreaResult = {
  badges?: BadgePriority[]
  maxBadgeDisplay?: number
  isAreaEnabled?: boolean
}

type GetContentIdByBadgeTypeParams = {
  page: PageTypeLc
  type: ValidBadgeID
  badgingPreferences: Preference[]
  siteId: string
  isBundleProduct?: boolean
  isSocialProofEnabled?: boolean
}

export const getCustom = (product?: ProductForBadges | SearchVariationGroupData): string =>
  product?.['customAttributes'] ? 'customAttributes' : 'custom'

export const getBadgeTypesListByArea = ({
  page,
  area,
  badgingPreferences,
  siteId,
  product,
  variationGroupData,
  masterData,
  bestSellerCheck,
  instockText,
  selectedVG,
  isViewedProduct,
  isMobile,
}: GetBadgeTypesListByAreaParams): GetBadgeTypesListByAreaResult => {
  if (!badgingPreferences) {
    return {}
  }

  const badgeAreaPreference = (badgingPreferences || []).find(({ id }) => id === 'badgeAreaJson')
  const bestSellerObject = (badgingPreferences || []).find(
    ({ id }) => id === 'enableBestSellerByCategory'
  )

  const isBundleProductSet = !!get(product, 'isProductSet', get(product, 'set'))

  const bestSellerPref = getSiteValueFromPref(
    bestSellerObject,
    siteId,
    get(bestSellerObject, 'value', false)
  )

  const badgeAreaConfig = getSiteValueFromPref(
    badgeAreaPreference,
    siteId,
    get(badgeAreaPreference, 'value', [])
  ).find(({ badgeArea }) => badgeArea === area)

  const maxBadgeDisplay = get(badgeAreaConfig, 'maxDisplay', 1)
  const isAreaEnabled = get(badgeAreaConfig, 'enabled', false)

  const badgePriorityByPage = getPriorityPreferenceByPage(
    badgingPreferences,
    page,
    area,
    isBundleProductSet,
    product
  )

  const isPreordarable = get(product, 'inventory.preorderable')
  const isBackorderable = get(product, 'inventory.backorderable')
  const isSourceCode = (type: MarketingConfType): boolean =>
    !!get(product, `sourceCode${type}`) || !!get(selectedVG, `sourceCode${type}`)
  const getSourceCodeSlotIds = (sourceCodeType: string) => {
    const productSourceCode =
      get(product, `sourceCode${sourceCodeType}`) || get(selectedVG, `sourceCode${sourceCodeType}`)
    return flattenDeep(Object.values(productSourceCode)).map(({ type }: any) => {
      const isBadge = sourceCodeType === 'Badge'

      if (type === 'pdp')
        return [
          badgeTypes[`isPrivateMarketing${sourceCodeType}pdp`],
          isBadge && badgeTypesOnImage['isPrivateMarketingBadgepdp'],
        ]

      if (type === 'plp')
        return [
          badgeTypes[`isPrivateMarketing${sourceCodeType}plp`],
          isBadge && badgeTypesOnImage['isPrivateMarketingBadgeplp'],
        ]

      return []
    })
  }

  const isPLP = page === 'plp'

  const productLevelBadges = [
    ...(isBestSeller(page, bestSellerPref, product, bestSellerCheck)
      ? [badgeTypes['isBestSeller'], badgeTypesOnImage['isBestSeller']]
      : []),
    ...(isFinalSale(badgingPreferences, product, siteId, variationGroupData, page)
      ? [badgeTypes['isFinalSale'], badgeTypes['isFinalSaleMessage']]
      : []),
    ...(isAlmostGone(
      isPLP
        ? {
            ...product,
            variationGroupData,
            activeColor: product?.defaultColor?.id,
          }
        : product
    )
      ? [
          badgeTypes['isAlmostGone'],
          badgeTypesOnImage['isAlmostGone'],
          badgeTypesOnImage['inventoryCallout'],
          badgeTypes['inventoryCallout'],
        ]
      : []),
    ...(isOnlyFewLeft(product) ? [badgeTypes['isOnlyFewLeft']] : []),
    ...(isSocialProof(product, isMobile) ? [badgeTypes['socialProof']] : []),
    ...(isNewArrival(badgingPreferences, product, masterData, siteId)
      ? [badgeTypes['isNewArrival'], badgeTypesOnImage['isNewArrival']]
      : []),
    ...(isTopRated(badgingPreferences, masterData, siteId, product)
      ? [badgeTypesOnImage['isTopRated'], badgeTypes['isTopRated']]
      : []),
    ...(isPreordarable && !instockCustom(product, instockText)
      ? [badgeTypes['isPreOrder'], badgeTypesOnImage['isPreOrder'], badgeTypesUnderCTA['preorder']]
      : []),
    ...(isBackorderable
      ? [
          badgeTypes['isBackOrder'],
          badgeTypesOnImage['isBackOrder'],
          badgeTypesUnderCTA['backorder'],
        ]
      : []),
    ...(isCustomMarketing('Badge', product, variationGroupData, masterData, selectedVG)
      ? [
          badgeTypes[`isCustomMarketingBadge${page}`],
          badgeTypesOnImage[`isCustomMarketingBadge${page}`],
          badgeTypesOnImage[`isCustomBundleBadge${page}`],
        ]
      : []),
    ...(isViewedProduct
      ? [badgeTypes['isViewedProduct'], badgeTypesOnImage['isViewedProduct']]
      : []),
    ...(instockCustom(product, instockText) && !isSoldOut(product, null)
      ? [badgeTypes['instockCustom'], badgeTypesOnImage['instockCustom']]
      : []),
    ...(isSoldOut(product, variationGroupData, isPreordarable, isBackorderable)
      ? [badgeTypes['isSoldOut'], badgeTypesOnImage['isSoldOut']]
      : []),
    ...(isSourceCode('Badge') ? flattenDeep(getSourceCodeSlotIds('Badge')) : []),
    ...(isSourceCode('Message') ? flattenDeep(getSourceCodeSlotIds('Message')) : []),
    ...(isCustomMarketing('Message', product, variationGroupData, masterData, selectedVG)
      ? [badgeTypes[`isCustomMarketingMessage${page}`]]
      : []),
    isPromotionCallout(product) ? badgeTypes['isPromotionCallout'] : undefined,
    isBundleProduct(product) ? badgeTypes['isBundleProduct'] : undefined,
  ]

  const prioritiesList: BadgePriority[] = getSiteValueFromPref(badgePriorityByPage, siteId, [])

  const sortedBadgesByPriority = prioritiesList
    .filter(({ badgeArea, badgeID }) => badgeArea === area && productLevelBadges.includes(badgeID))
    .sort((a, b) => a.rank - b.rank)

  return {
    badges: sortedBadgesByPriority || [],
    maxBadgeDisplay,
    isAreaEnabled,
  }
}

export const getContentIdByBadgeType = ({
  page,
  type,
  badgingPreferences,
  siteId,
  isBundleProduct = false,
  isSocialProofEnabled = false,
}: GetContentIdByBadgeTypeParams) => {
  if (!badgingPreferences) {
    return null
  }

  const badgeDetailsPreference = badgingPreferences.find(
    ({ id }) => id === `badgeDetailsJSON${page}`
  )
  const bundlebadgeDetailsPreference = badgingPreferences.find(
    ({ id }) => id === `bundlebadgeDetailsJSON${page}`
  )

  let preferenceValue = getSiteValueFromPref(badgeDetailsPreference, siteId, [])
  let bundlePreferenceValue = getSiteValueFromPref(bundlebadgeDetailsPreference, siteId, [])

  if (!isBundleProduct) {
    preferenceValue = preferenceValue.concat(bundlePreferenceValue)
  } else {
    preferenceValue = bundlePreferenceValue
  }

  const contentByBadgeType = preferenceValue.find(({ badgeType }) => {
    // all badgeType that is including InventoryCallout should get almostGone/onlyFewLeft badges
    if (type === 'onImageInventoryCallout') {
      return badgeType === 'almostGoneOnImage'
    }
    if (type === 'socialProof' && isSocialProofEnabled && page === 'pdp') {
      return badgeType === 'socialProofMessage'
    }
    if (type === 'inventoryCallout') {
      return badgeType === 'onlyFewLeft' || badgeType === 'almostGone'
    }
    if (type === 'promotionCalloutMessage') {
      return badgeType === 'promotionCallout'
    }
    if (type === 'viewedOnImage') {
      return badgeType === 'viewed'
    }
    return badgeType === type
  })
  return contentByBadgeType
}

export const getStockLevel = (product?: ProductForBadges, isMaster?: boolean): number => {
  const ats = isMaster
    ? // For master
      get(product, 'variationGroupData.inventory.ats') ||
      get(product, 'masterProductData.inventory.ats') ||
      get(product, 'inventory.ats')
    : // For variant
      get(product, 'inventory.ats')
  return ats || 0
}

export const getPriorityPreferenceByPage = (
  preferences?: Preference[],
  page?: PageTypeLc,
  area?: BadgeArea,
  isBundleProductSet = false,
  product?: ProductForBadges
): Preference | null => {
  if (!preferences) {
    return null
  }

  return preferences.find(({ id }) => {
    if (area === 'onImagePLP' || area === 'onImagePDP') {
      return isBundleProductSet || isBundleProduct(product)
        ? id === `bundleonImageBadgePriorityJSON${page}`
        : id === `onImageBadgePriorityJSON${page}`
    }
    return isBundleProductSet || isBundleProduct(product)
      ? id === `bundlebadgePriorityJSON${page}`
      : id === `badgePriorityJSON${page}`
  })
}

const isBestSeller = (
  page: PageTypeLc,
  bestSellerPref: boolean,
  product?: ProductForBadges,
  bestSellerCheck?: boolean
): boolean => {
  if (page !== 'pdp' && (bestSellerPref || page === 'plp')) {
    return (
      get(product, 'activeProductData.bestseller') ||
      get(product, 'promotionData.bestseller') ||
      (product?.hitType !== 'master' &&
        isArray(get(product, 'variationGroup')) &&
        get(product, 'variationGroup', []).find((variant) => variant?.id === product?.id)
          ?.bestSellerCheck)
    )
  }
  return bestSellerCheck || get(product, 'promotionData.bestseller')
}

const checkIfRatingMeetsThreshold = (
  productData?: ProductForBadges | DetailedProduct['master'],
  thresholdStarRating?: number,
  thresholdNoOfReviews?: number,
  custom?: string
): boolean =>
  get(productData, `${custom}.c_avgRatingEmplifi`, false) >= (thresholdStarRating || 0) &&
  get(productData, `${custom}.c_revCountEmplifi`, false) >= (thresholdNoOfReviews || 0)

export const isTopRated = (
  preferences: Preference[] = [],
  masterData?: DetailedProduct['master'],
  siteId?: string,
  product?: ProductForBadges
): boolean => {
  if (product?.isAiDriven) {
    return product?.isTopRated
  }
  const custom = getCustom(product)
  const thresholdStarRatingPreference = preferences.find(({ id }) => id === 'thresholdStarRating')
  const thresholdStarRating = getSiteValueFromPref(thresholdStarRatingPreference, siteId)
  const thresholdNoOfReviewsPreference = preferences.find(({ id }) => id === 'thresholdNoOfReviews')
  const thresholdNoOfReviews = getSiteValueFromPref(thresholdNoOfReviewsPreference, siteId)
  return (
    checkIfRatingMeetsThreshold(product, thresholdStarRating, thresholdNoOfReviews, custom) ||
    checkIfRatingMeetsThreshold(masterData, thresholdStarRating, thresholdNoOfReviews, custom)
  )
}

export const isAlmostGone = (product?: ProductForBadges): boolean => {
  const variationGroup = get(product, 'variationGroup', [])
  const isAlmostGoneExist = has(variationGroup, '[0].isAlmostGone')
  if (isArray(variationGroup) && variationGroup.length && isAlmostGoneExist) {
    const activeColor = get(product, 'activeColor')
    return get(
      variationGroup.filter((item) => item.color === activeColor),
      '[0].isAlmostGone'
    )
  }

  const custom = getCustom(product)
  const stockLevel = getStockLevel(product)
  const inventoryThreshold = get(product, `${custom}.c_inventoryThreshold`, 0)
  return stockLevel > 0 && stockLevel < inventoryThreshold
}

export const instockCustom = (product?: ProductForBadges, instockText?: string): boolean => {
  const custom = getCustom(product)
  const instockCheck = get(product, `${custom}.c_inStockCustomText`, false)
  return Boolean((instockText && instockText !== 'undefined') || instockCheck)
}

export const isSoldOut = (
  product?: ProductForBadges,
  bundleProductData: any = {},
  isPreordarable?: boolean,
  isBackorderable?: boolean
) => {
  const custom = getCustom(product)
  const isBundleProduct = product?.hitType === 'set'
  const isMasterProduct = product?.hitType === 'master'
  const variationGroup = get(product, 'variationGroup', [])
  const isInStockExist = has(variationGroup, '[0].InStock')

  if (
    isBundleProduct &&
    bundleProductData &&
    Object.keys(bundleProductData).length &&
    get(bundleProductData, `${custom}.c_soldOutBadge.soldOutBadge`)
  ) {
    return true
  }

  if (product && !isBundleProduct) {
    if (
      !isBackorderable &&
      !isPreordarable &&
      isArray(variationGroup) &&
      variationGroup.length &&
      isInStockExist
    ) {
      const activeColor = get(product, 'defaultColor.id')
      const isInStock = get(
        variationGroup.filter((item) => item.color === activeColor),
        '[0].InStock',
        false
      )
      return !isInStock
    }

    const productInventory = isMasterProduct
      ? get(product, 'variationGroupData.inventory')
      : get(product, 'inventory')
    let stockLevel = get(productInventory, 'stockLevel')
    const ats = get(productInventory, 'ats')
    const orderable = get(productInventory, 'orderable')

    if (stockLevel === 999999 && ats === 0 && orderable) {
      return false
    }
    stockLevel = getStockLevel(product, isMasterProduct)

    return stockLevel === 0
  }
  return false
}

export const isOnlyFewLeft = (product?: ProductForBadges): boolean => {
  const custom = getCustom(product)
  const stockLevel = getStockLevel(product)
  const inventoryThreshold = get(product, `${custom}.c_inventoryThreshold`, 0)

  return stockLevel > 0 && stockLevel < inventoryThreshold
}

export const isSocialProof = (product?: ProductForBadges, isMobile?: boolean): boolean => {
  if (isMobile) {
    const custom = getCustom(product)
    const socialProofDataWindowMin = get(product, `${custom}.c_socialProofDataWindow.units.min`)
    if (!socialProofDataWindowMin) return false
    const itemSold = get(product, `${custom}.c_itemSold`, 0)
    return itemSold > socialProofDataWindowMin
  }
  return false
}

export const isFinalSale = (
  preferences: Preference[] = [],
  product?: ProductForBadges,
  siteId?: string,
  variationGroupData?: SearchVariationGroupData,
  page?: PageTypeLc
): boolean => {
  const custom = getCustom(product)
  const vgCustom = getCustom(variationGroupData)
  const finalSaleDiscountPreference = preferences.find(
    ({ id }) => id === 'finalSaleDiscountPercentage'
  )

  const finalSale =
    page === 'minicart'
      ? get(variationGroupData, `${vgCustom}.c_isFinalSale`, false)
      : product
      ? get(product, `${custom}.c_isFinalSale`) ??
        get(variationGroupData, `${vgCustom}.c_isFinalSale`, false)
      : get(variationGroupData, `${vgCustom}.c_isFinalSale`)

  const maxSalePercent = product
    ? variationGroupData
      ? get(product, `${custom}.c_maxSalePercent`) &&
        get(variationGroupData, `${vgCustom}.c_maxSalePercent`, 0)
      : get(product, `${custom}.c_maxSalePercent`)
    : get(variationGroupData, `${vgCustom}.c_maxSalePercent`, 0)

  // Here we can't make default value for masterData, because field can be absent
  // and because of isNewProductAPI flag it will not render FINAL SALE badge

  const inStockVariant = get(product, 'inventory.ats', 0)
  if (inStockVariant === 0) {
    return false
  }

  const finalSaleDiscountPercentage = getSiteValueFromPref(finalSaleDiscountPreference, siteId)
  return !!(
    finalSale ||
    (finalSaleDiscountPercentage && maxSalePercent && maxSalePercent >= finalSaleDiscountPercentage)
  )
}

export const isPromotionCallout = (product?: ProductForBadges) => {
  const isPromotionCallout = get(product, 'pickedProps.productPromotions', [])
  return isPromotionCallout?.length > 0
}

export const isBundleProduct = (product?: ProductForBadges) => {
  return get(product, 'basketInfo.c_isBundleProductLineItem', false)
}

export const getMarketingConf = (
  data?: ProductForBadges | SearchVariationGroupData | DetailedProduct['master'] | VariantGroupData,
  type?: MarketingConfType,
  page?: PageTypeLc
) => {
  const fieldName = `marketing${type}Conf`
  return get(data, `${fieldName}${page ? `.${page}` : ''}`)
}

export const isCustomMarketing = (
  type: MarketingConfType,
  product?: ProductForBadges,
  variationGroupData?: SearchVariationGroupData,
  masterData?: DetailedProduct['master'],
  selectedVG?: VariantGroupData
) =>
  !!getMarketingConf(product, type) ||
  !!getMarketingConf(variationGroupData, type) ||
  !!getMarketingConf(selectedVG, type) ||
  !!getMarketingConf(masterData, type)

export const isNewArrival = (
  preferences: Preference[] = [],
  product?: ProductForBadges,
  masterData?: DetailedProduct['master'],
  siteId = 'coh_us_rt'
) => {
  if (product?.isAiDriven) {
    return product?.isNewArrival
  }
  const thresholdArrivalPreference = preferences.find(({ id }) => id === 'newArrivalInXDays')
  const thresholdArrival = +getSiteValueFromPref(thresholdArrivalPreference, siteId)

  let validFrom = get(product, `pickedProps.validFrom.default@${siteId}`, get(product, 'validFrom'))
  if (!validFrom) {
    validFrom = get(product, 'pickedProps.validFrom')
  }
  if (!validFrom) {
    validFrom = get(
      masterData,
      `pickedProps.validFrom.default@${siteId}`,
      get(masterData, 'validFrom')
    )
  }

  let now = new Date()
  let nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (validFrom) {
    let productDateObj = new Date(validFrom)
    let releaseDate = new Date(
      productDateObj.getFullYear(),
      productDateObj.getMonth(),
      productDateObj.getDate()
    )

    let days = (nowDate.getTime() - releaseDate.getTime()) / 86400000
    return Math.floor(days) < thresholdArrival
  }
  return false
}

export const getSiteValueFromPref = (
  preference?: Preference,
  siteId = '',
  defaultValue?: Preference['site_values'],
  isDisplayValue?: boolean
) => {
  const siteValue = get(preference, `site_values.${siteId}`)
  if (siteValue === undefined) {
    const preferenceValue = isDisplayValue ? 'displayValue' : 'value'
    return get(preference, preferenceValue, defaultValue)
  }
  return siteValue
}

export const getSocialProofSlotContent = (
  product?: ProductForBadges,
  slotContent?: string
): string => {
  const custom = getCustom(product)
  const socialProofDataWindow = get(product, `${custom}.c_socialProofDataWindow`, {})
  const { frequency, units = {} } = socialProofDataWindow
  const { max } = units
  const itemSold = get(product, `${custom}.c_itemSold`, 0)
  const displayCount = itemSold > max ? `${max}+` : itemSold

  return slotContent?.replace(/\{count\}/gi, displayCount)?.replace(/\{frequency\}/gi, frequency)
}
