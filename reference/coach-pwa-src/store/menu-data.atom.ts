import Category from 'toro/types/categoryTypes'
import type { Getter, Setter } from 'jotai'
import { atom } from 'jotai'
import isPlainObject from 'lodash/isPlainObject'
import { getCategoryLinks } from 'toro/helpers/parseMenuCategories'
import { atomWithReset, atomWithStorage } from 'jotai/utils'
import {
  STORAGE_ACTIVE_MENU_ITEMS,
  STORAGE_ACTIVE_MENU_ITEMS_PER_BRAND,
  STORAGE_SELECTED_MENU_ITEM,
  STORAGE_VISITED_CATEGORIES,
} from 'toro/constants/storageIds'
import lodashGet from 'lodash/get'
import lodashFind from 'lodash/find'
import { getCategoriesByCgIds } from 'toro/helpers/menu'
import { preferencesAtom } from 'store/preferences.atom'
import { experimentsAtom } from 'store/experiments.atom'
import { EXPERIMENTS } from 'toro/constants/experiments'
import {
  isOneCoachTabbedAtom,
  isOutletTabAtom,
  isSubBrandActiveAtom,
  subBrandAtom,
  isMobileMenuVisibleAtom,
} from 'store/global.atom'
import lodashPick from 'lodash/pick'
import { resolveCountrySelectorURLs } from 'toro/components/header/HeaderMainContent/helpers/resolveCountrySelectorURLs'
import { CountrySelectorData } from 'toro/components/LanguageSelector/types'
import {
  BRANDS,
  type Brand,
  type OneSiteBrandTabs,
  ONE_SITE_TAB_MAP,
} from 'toro/lib/oneSite/config'

export type CategoryId = string

type CategoryUrls = {
  [key: CategoryId]: Pick<Category, 'cgid' | 'url'>
}
export type MenuData = {
  topCategories?: string[]
} & {
  [key: CategoryId]: Category
}

/* ONE COACH NA region */
export const oneCoachNAProductInfoAtom = atom<{
  productVertical: 'collection' | 'outlet' | undefined
  isCoachtopia: boolean
}>({
  productVertical: undefined,
  isCoachtopia: false,
})

// Set in useHydratePageAtoms().
export const isOneCoachNAEnabledAtom = atom(false)

export const oneSiteActiveBrandAtom = atomWithReset<Brand | undefined>(
  // Starting as undefined, so we don't have flashes of styling upon hydration.
  // The atom should always be undefined if enablement prerequisites are not met.
  undefined
)

export const oneSiteActiveTabAtom = atomWithReset<OneSiteBrandTabs | undefined>(
  // Starting as undefined so the active tab doesn't flicker between Retail and Outlet upon hydration.
  // The atom should always be undefined if enablement prerequisites are not met.
  undefined
)

/* Derived: true when viewing One Coach in Outlet category context */
export const isOneCoachInOutletCategoryAtom = atom((get) => {
  const isOneCoachNAEnabled = get(isOneCoachNAEnabledAtom)
  if (isOneCoachNAEnabled) {
    return get(oneSiteActiveBrandAtom) === 'outlet'
  }
  return get(isOneCoachTabbedAtom) && get(isOutletTabAtom)
})

/* Controls atom updates that should react together on oneSiteActiveBrand */
export const setOneSiteMainAtoms = atom(null, (get, set, nextActiveBrand: Brand | undefined) => {
  const isOneSitePrefEnabled = get(isOneCoachNAEnabledAtom)

  // remain previous state if nextActiveBrand is not detected
  if (!isOneSitePrefEnabled || !nextActiveBrand) return
  const activeTab = ONE_SITE_TAB_MAP[nextActiveBrand]

  set(oneSiteActiveBrandAtom, nextActiveBrand)
  set(setOneSiteActiveTabAtom, activeTab)
})

export const setOneSiteActiveTabAtom = atom(null, (get, set, tab: OneSiteBrandTabs) => {
  const isOneSitePrefEnabled = get(isOneCoachNAEnabledAtom)

  if (!isOneSitePrefEnabled) return

  set(oneSiteActiveTabAtom, tab)
})

// Base atom for mobile menu brand selection - null when not set
export const activeMobileMenuBrandBaseAtom = atomWithReset<Brand | null>(null)

// Writable derived atom that defaults to current active brand but can be overridden
export const activeMobileMenuBrandAtom = atom(
  (get) => {
    const mobileMenuBrand = get(activeMobileMenuBrandBaseAtom)
    // If mobile menu brand is explicitly set, use it
    if (mobileMenuBrand !== null) {
      return mobileMenuBrand
    }
    // Otherwise, default to current active brand
    return get(oneSiteActiveBrandAtom)
  },
  (_get, set, newBrand: Brand) => {
    set(activeMobileMenuBrandBaseAtom, newBrand)
  }
)

// Derived atom for effective tab based on mobile menu brand selection
export const activeMobileMenuTabAtom = atom<OneSiteBrandTabs | undefined>((get) => {
  const brand = get(activeMobileMenuBrandAtom)
  return brand ? ONE_SITE_TAB_MAP[brand] : undefined
})

/*
 * User can switch the mobile menu tab and start searching, so we need to follow current UX flow with active menu tab
 * On desktop mobile values are false, in this case oneSiteActiveTab is actual
 * */
export const derivedOneSiteTabForSearchAtom = atom((get) => {
  const isMobileMenuVisible = get(isMobileMenuVisibleAtom)
  const oneSiteActiveTab = get(oneSiteActiveTabAtom)
  const activeMobileMenuTab = get(activeMobileMenuTabAtom)

  return isMobileMenuVisible ? activeMobileMenuTab : oneSiteActiveTab
})

const oneCoachNAMenuDataAtom = atom<MenuData>((get) => {
  const rawMenuData = get(rawMenuDataAtom)
  const isMobileMenuVisible = get(isMobileMenuVisibleAtom)

  // Use mobile menu brand when menu is open, otherwise use regular active brand
  const activeBrand = isMobileMenuVisible
    ? get(activeMobileMenuBrandAtom)
    : get(oneSiteActiveBrandAtom)

  const activeBrandMenuData = rawMenuData[activeBrand]

  if (!activeBrandMenuData) {
    return rawMenuData[BRANDS.COACH] ?? {}
  }

  // for Retail we have to move Coachtopia to an L1 category.
  if (activeBrand === BRANDS.COACH) {
    const coachtopiaCategory = rawMenuData[BRANDS.COACHTOPIA]

    if (coachtopiaCategory) {
      const isCoachtopiaActive = get(isSubBrandActiveAtom)

      // Switch to subbrand navigation if active on desktop only.
      // Mobile always uses the merged structure, so the flyout stays anchored to the last viewed PLP.
      if (isCoachtopiaActive && !isMobileMenuVisible) {
        return coachtopiaCategory
      }

      return {
        ...activeBrandMenuData,
        ...coachtopiaCategory,
        // @ts-expect-error - rawMenuData's type is different for OneCoach NA, because it has three root categories
        topCategories: [...(activeBrandMenuData?.topCategories || []), BRANDS.COACHTOPIA],
      }
    }
  }

  return activeBrandMenuData
})

/*
 * One Coach Shared Menu Data to applies visited logic if user navigates over multiple brands
 */
export const oneCoachSharedMenuDataAtom = atom<MenuData>((get) => {
  const rawMenuData = get(rawMenuDataAtom)
  const preferences = get(preferencesAtom)
  const activeBrand = get(oneSiteActiveBrandAtom)
  const variant = get(subnavVariantAtom)
  const variantCategories =
    preferences?.adaptiveExperience?.subnavVariants?.[activeBrand]?.[variant]

  const sharedMenuData = Object.values(rawMenuData).reduce(
    (acc, brandMenuData) => {
      const { length, topCategories, ...rest } = brandMenuData as unknown as MenuData & {
        length?: number
      }
      return { ...acc, ...rest }
    },
    { topCategories: variantCategories }
  )

  return sharedMenuData
})

export const baseCountrySelectorAtom = atom<CountrySelectorData>(undefined)

export const countrySelectorAtom = atom<CountrySelectorData>((get) => {
  const isOneCoachNAEnabled = get(isOneCoachNAEnabledAtom)
  const baseCountrySelector = get(baseCountrySelectorAtom)

  // TODO: decouple atom: if OneSite enabled, return OneSite country selector atom
  if (!isOneCoachNAEnabled) {
    return baseCountrySelector
  }

  const activeBrand = get(oneSiteActiveBrandAtom)
  const preferences = get(preferencesAtom)
  const oneSiteConfig = lodashGet(preferences, 'OneSite.oneSiteConfig', {})

  const currentBrandCountrySelectorURLs = lodashGet(
    lodashFind(Object.values(oneSiteConfig), { categoryId: activeBrand }),
    'countrySelectorURL',
    {}
  )

  return resolveCountrySelectorURLs(baseCountrySelector, currentBrandCountrySelectorURLs)
})

/* END OF ONE COACH NA region */

const menuDataAtom = atom<MenuData>((get) => {
  const isOneCoachNAEnabled = get(isOneCoachNAEnabledAtom)
  if (isOneCoachNAEnabled) {
    return get(oneCoachNAMenuDataAtom)
  }

  const preferences = get(preferencesAtom)
  const rawMenuData = get(rawMenuDataAtom)
  const isOutlet = get(isOutletTabAtom)
  const isOneCoachActive = get(isOneCoachTabbedAtom)
  const oneCoachTabConfig = lodashGet(preferences, 'oneCoach.oneCoachTabConfig', {})
  const { isOutletSubCategory = false, outletRootCategory = '' } = lodashPick(oneCoachTabConfig, [
    'isOutletSubCategory',
    'outletRootCategory',
  ]) as {
    isOutletSubCategory?: boolean
    outletRootCategory?: string
    link?: string
  }
  const isOneCoachWithOutletSubCategoryActive =
    isOneCoachActive && isOutletSubCategory && !!outletRootCategory
  if (isOneCoachWithOutletSubCategoryActive) {
    return getFinalMenuData(rawMenuData, outletRootCategory, isOutlet)
  } else {
    return rawMenuData
  }
})

export const categoryUrlsAtom = atom<CategoryUrls>((get) => {
  const menuData = get(menuDataAtom)
  if (!menuData.length) {
    return {}
  }
  return Object.keys(menuData).reduce((sum, key) => {
    const link = getCategoryLinks(menuData[key])
    if (!isPlainObject(link)) {
      return sum
    }
    return { ...sum, [key]: link }
  }, {})
})

type ActiveMenuItem = CategoryId | null
type ActiveMenuItems = {
  t1: ActiveMenuItem
  t2: ActiveMenuItem
  t3: ActiveMenuItem
}

const defaultActiveMenuItems = {
  t1: null,
  t2: null,
  t3: null,
}

export const activeMenuItemsAtom = atom<ActiveMenuItems>(defaultActiveMenuItems)

export const setActiveMenuItemAtom = atom(null, (get, set, { tn, cgid }) => {
  const activeMenuItems = get(activeMenuItemsAtom)
  set(activeMenuItemsAtom, {
    ...activeMenuItems,
    [`t${tn}`]: cgid,
  })
})

export const dropActiveMenuItemsAtom = atom(null, (get, set) => {
  set(activeMenuItemsAtom, defaultActiveMenuItems)
})

type ActiveMobileMenuItems = {
  t1: ActiveMenuItem
  t2: ActiveMenuItem
}

const defaultActiveMobileMenuItems = { t1: null, t2: null }

const activeMobileMenuItemsPerBrandAtom = atomWithStorage<
  Partial<Record<Brand, ActiveMobileMenuItems>>
>(STORAGE_ACTIVE_MENU_ITEMS_PER_BRAND, {})

const activeMobileMenuItemsBaseAtom = atomWithStorage<ActiveMobileMenuItems>(
  STORAGE_ACTIVE_MENU_ITEMS,
  defaultActiveMobileMenuItems
)

export const activeMobileMenuItemsAtom = atom(
  (get) => {
    const activeBrand = get(activeMobileMenuBrandAtom)

    // Non-OneCoach sites: use original storage as-is
    if (!activeBrand) {
      return get(activeMobileMenuItemsBaseAtom)
    }

    const selectionsByBrand = get(activeMobileMenuItemsPerBrandAtom)
    const savedSelection = selectionsByBrand[activeBrand]

    if (savedSelection?.t1) {
      return savedSelection
    }

    const rawMenuData = get(rawMenuDataAtom)
    const firstCategoryId = lodashGet(rawMenuData, [activeBrand, 'topCategories', 0])
    return { t1: firstCategoryId || null, t2: null }
  },
  (get, set, newSelection: ActiveMobileMenuItems) => {
    const activeBrand = get(activeMobileMenuBrandAtom)

    // Non-OneCoach sites: use original storage
    if (!activeBrand) {
      set(activeMobileMenuItemsBaseAtom, newSelection)
      return
    }

    set(activeMobileMenuItemsPerBrandAtom, (prev) => ({
      ...prev,
      [activeBrand]: newSelection,
    }))
  }
)

export const setActiveMobileMenuItemAtom = atom(null, (get, set, { tn, cgid }) => {
  const activeMenuItems = get(activeMobileMenuItemsAtom)
  set(activeMobileMenuItemsAtom, {
    ...activeMenuItems,
    [`t${tn}`]: cgid,
  })
})

export const dropActiveMobileMenuItemsAtom = atom(null, (get, set) => {
  set(activeMobileMenuItemsAtom, defaultActiveMobileMenuItems)
})

export const reInitActiveMobileMenuItemsAtom = atom(null, (get, set) => {
  const menuData = get(menuDataAtom)
  const isOneCoachNA = get(isOneCoachNAEnabledAtom)
  const isSubBrandActive = get(isSubBrandActiveAtom)
  const subBrandRootCategoryId = get(subBrandRootCategoryIdAtom)

  // OneCoach + Coachtopia: use the sub-brand root category as t1
  // because the desktop-resolved menu data doesn't include the synthetic 'coachtopia' L1.
  const defaultT1Cgid =
    isOneCoachNA && isSubBrandActive && subBrandRootCategoryId
      ? subBrandRootCategoryId
      : lodashGet(menuData, [menuData?.topCategories[0], 'cgid'])

  set(activeMobileMenuItemsAtom, { ...defaultActiveMobileMenuItems, t1: defaultT1Cgid })
})

type SelectedMobileItem = {
  cgid: string
  url: string
}

export const selectedMobileItemAtom = atomWithStorage<SelectedMobileItem>(
  STORAGE_SELECTED_MENU_ITEM,
  {
    cgid: '',
    url: '',
  }
)

const buildTopCategoryCgids = ({
  baseCategories,
  visited,
  menuData,
  limit,
}: {
  baseCategories: string[]
  visited: string[]
  menuData: MenuData
  limit: number
}) => {
  const { topCategories, ...categoriesData } = menuData
  const normalize = (id: string) => id?.split('_L')[0]

  const altToId = new Map<string, string>()
  const idToAlt = new Map<string, string>()

  Object.values(categoriesData).forEach((c) => {
    altToId.set(c.alternativeCategoryId, c.cgid)
    idToAlt.set(c.cgid, c.alternativeCategoryId)
  })

  const validVisited = visited.map(normalize).reduce((acc, id) => {
    if (id.startsWith(BRANDS.COACHTOPIA)) return acc

    if (
      categoriesData[id]?.alternativeCategoryId &&
      categoriesData[categoriesData[id].alternativeCategoryId]
    ) {
      acc.push(categoriesData[id].alternativeCategoryId)
    } else if (id && categoriesData[id]) {
      acc.push(id)
    }
    return acc
  }, [])

  if (validVisited.length >= limit) {
    return validVisited.slice(0, limit)
  }

  const filteredBase = baseCategories.filter((cgid) => {
    if (cgid.startsWith(BRANDS.COACHTOPIA)) return false

    return !validVisited.some(
      (visitedId) =>
        altToId.get(visitedId) === cgid || idToAlt.get(visitedId) === cgid || visitedId === cgid
    )
  })

  return [...validVisited, ...filteredBase].slice(0, limit)
}

const subnavVariantAtom = atom((get) => {
  const experiments = get(experimentsAtom)
  const topSubnavigationActiveExperiment = experiments
    .split('-')
    .find((exp) => exp.startsWith(EXPERIMENTS.HP_SUBNAVIGATION))
  const variant = topSubnavigationActiveExperiment?.replace(EXPERIMENTS.HP_SUBNAVIGATION, '')
  return variant
})

export const topCategoriesAtom = atom((get) => {
  const menuData = get(menuDataAtom)
  if (!menuData?.topCategories) return []

  const defaultCategories = menuData.topCategories
  const variant = get(subnavVariantAtom)

  if (!variant) {
    return getCategoriesByCgIds(menuData, defaultCategories)
  }

  const isOneCoachNAEnabled = get(isOneCoachNAEnabledAtom)
  let finalMenuData: MenuData, variantCategories: string[]
  if (isOneCoachNAEnabled) {
    finalMenuData = get(oneCoachSharedMenuDataAtom)
    variantCategories = finalMenuData.topCategories
  } else {
    finalMenuData = menuData
    variantCategories = get(preferencesAtom)?.adaptiveExperience?.subnavVariants?.[variant]
  }

  const baseCategories = variantCategories ?? defaultCategories
  const finalCgids = buildTopCategoryCgids({
    baseCategories,
    visited: get(visitedCategoriesAtom) || [],
    menuData: finalMenuData,
    limit: baseCategories.length,
  })
  const coachtopiaCategory = defaultCategories.find((cgid) => cgid.startsWith(BRANDS.COACHTOPIA))
  if (coachtopiaCategory) {
    finalCgids.push(coachtopiaCategory)
  }

  return getCategoriesByCgIds(finalMenuData, finalCgids)
})

export const subBrandRootCategoryIdAtom = atom((get) => {
  const preferences = get(preferencesAtom)
  const subBrand = get(subBrandAtom)
  return preferences?.[subBrand]?.[`${subBrand}RootCategory`]
})

export const subBrandCategoriesAtom = atom((get) => {
  const menuData = get(menuDataAtom)
  const subBrandRootCategoryId = get(subBrandRootCategoryIdAtom)
  const defaultCategoryIds = menuData[subBrandRootCategoryId]
    ? menuData?.[subBrandRootCategoryId]?.subCategories
    : menuData?.topCategories

  const isOneCoachNAEnabled = get(isOneCoachNAEnabledAtom)
  const isSubBrandActive = get(isSubBrandActiveAtom)
  const subBrand = get(subBrandAtom)

  // return default categories if not oneCoach or this is coachtopia
  if (!isOneCoachNAEnabled || (subBrand === BRANDS.COACHTOPIA && isSubBrandActive)) {
    if (!defaultCategoryIds) return []

    return getCategoriesByCgIds(menuData, defaultCategoryIds)
  }

  // SubNavigation for OneCoach
  const sharedMenuData = get(oneCoachSharedMenuDataAtom)
  const baseCategoriesIds = sharedMenuData.topCategories ?? defaultCategoryIds

  const finalCgids = buildTopCategoryCgids({
    baseCategories: baseCategoriesIds,
    visited: get(visitedCategoriesAtom) || [],
    menuData: sharedMenuData,
    limit: baseCategoriesIds.length,
  })

  const coachtopiaCategory = defaultCategoryIds.find((cgid) => cgid.startsWith(BRANDS.COACHTOPIA))
  if (coachtopiaCategory) {
    finalCgids.push(coachtopiaCategory)
  }

  if (!finalCgids) return []

  return getCategoriesByCgIds(sharedMenuData, finalCgids)
})

const visitedCategoriesAtom = atomWithStorage<string[]>(STORAGE_VISITED_CATEGORIES, [])

const MAX_CATEGORY_GROUPS = 5

export const setLastVisitedCategorySetter = (
  get: Getter,
  set: Setter,
  { cgid }: { cgid: string }
) => {
  const preferences = get(preferencesAtom)
  const enableCategoryCapture = lodashGet(
    preferences,
    'ToggleSiteFeatures.enablePersonalization',
    false
  )
  if (!enableCategoryCapture) return

  const menuData = get(menuDataAtom)
  const { topCategories, ...categoriesData } = menuData
  const category = Object.values(categoriesData).find(
    (item) => item.alternativeCategoryId === cgid || item.cgid === cgid
  )
  if (!category) return

  const parentCategories = category.parentCategoryTree || []
  const categoryLevel = parentCategories.length || 1
  const categoryId = `${category.cgid}_L${categoryLevel}`

  set(visitedCategoriesAtom, (previousCategories) => {
    const others = previousCategories
      .filter((id) => id !== categoryId)
      .slice(0, MAX_CATEGORY_GROUPS - 1)
    return [categoryId, ...others]
  })
}
export const setLastVisitedCategoryAtom = atom(null, setLastVisitedCategorySetter)

export const setCategorySelectedInMenuAtomSetter = (
  get: Getter,
  set: Setter,
  { cgid }: { cgid: string }
) => {
  if (!cgid) {
    return
  }

  const preferences = get(preferencesAtom)
  const enableNewGlobalHeader = lodashGet(
    preferences,
    'generalConfiguration.enableNewGlobalHeader',
    false
  )

  if (!enableNewGlobalHeader) {
    return
  }

  const menuData = get(menuDataAtom)
  const isSubBrandActive = get(isSubBrandActiveAtom)
  const subBrandRootCategoryId = get(subBrandRootCategoryIdAtom)
  const { topCategories, ...categoriesData } = menuData

  const category = Object.values(categoriesData).find(
    (item) =>
      (item.alternativeCategoryId === cgid || item.cgid === cgid) && !item.subCategories.length
  )
  if (!category) return
  const parentCategories = category.parentCategoryTree || []

  set(selectedMobileItemAtom, { cgid: category.cgid, url: category.url })

  const isOneCoachNA = get(isOneCoachNAEnabledAtom)

  if (isSubBrandActive && menuData.topCategories.includes(subBrandRootCategoryId)) {
    set(activeMobileMenuItemsAtom, {
      t1: subBrandRootCategoryId || null,
      t2: parentCategories[1]?.cgid || null,
    })
  } else if (isSubBrandActive && isOneCoachNA) {
    // OneCoach: Coachtopia is a synthetic L1 in the merged mobile menu,
    // but the desktop-resolved menu data doesn't include it in topCategories.
    // Use subBrandRootCategoryId as t1 and shift parentCategories by one level.
    set(activeMobileMenuItemsAtom, {
      t1: subBrandRootCategoryId || null,
      t2: parentCategories[0]?.cgid || null,
    })
  } else {
    set(activeMobileMenuItemsAtom, {
      t1: parentCategories.length > 0 ? parentCategories[0]?.cgid || null : category.cgid,
      t2: parentCategories.length > 1 ? parentCategories[1]?.cgid || null : category.cgid,
    })
  }
}
export const setCategorySelectedInMenuAtom = atom(null, setCategorySelectedInMenuAtomSetter)

export default menuDataAtom

export const rawMenuDataAtom = atom<MenuData>({})

const getFinalMenuData = (
  rawMenuData: MenuData,
  outletRootCategory: string,
  isOutlet: boolean
): MenuData => {
  if (!rawMenuData || Object.keys(rawMenuData).length === 0) return {}

  const rootCategory = rawMenuData[outletRootCategory] as Category | undefined
  const topCategorySet = new Set(rawMenuData.topCategories || [])

  const { outletCategories, topCategories, filteredTopCategories } = Object.entries(
    rawMenuData
  ).reduce(
    (acc, [key, value]) => {
      const cat = value as Category

      // Build outletCategories
      if (cat?.isOutletSubCategory) {
        acc.outletCategories[key] = cat

        // Build topCategories (outlet-specific)
        if (cat.parentCategoryId === outletRootCategory) {
          acc.topCategories.push(key)
        }
      }

      // Build filteredTopCategories (excludes outlet category from retail menu when isOutlet is true)
      if (topCategorySet.has(key)) {
        if (!(rootCategory?.isOutlet && key === outletRootCategory)) {
          acc.filteredTopCategories.push(key)
        }
      }

      return acc
    },
    {
      outletCategories: {} as Record<string, Category>,
      topCategories: [] as string[],
      filteredTopCategories: [] as string[],
    }
  )

  const outletCategoriesLength = Object.keys(outletCategories).length

  return {
    ...rawMenuData,
    topCategories: isOutlet && outletCategoriesLength ? topCategories : filteredTopCategories,
  } as MenuData
}
