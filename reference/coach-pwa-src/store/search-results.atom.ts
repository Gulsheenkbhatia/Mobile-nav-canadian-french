import { atom, Getter, Setter } from 'jotai'
import { Filter, Refinement, SortOption } from 'toro/types/productTypes/common'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import { areSelectableOptions, checkOptionType } from 'toro/helpers/refinements'
import { ListingProduct } from 'toro/types/productTypes'
import { atomWithReset, atomWithStorage } from 'jotai/utils'
import { badgesAtom } from 'store/badges.atom'
import { setCategorySelectedInMenuAtom, setLastVisitedCategoryAtom } from 'store/menu-data.atom'
import {
  deriveAdjacentPageUrls,
  getLazyIndex,
  getPageTitle,
  getReducedPayloadUrl,
  getURLForState,
  populateQueryParams,
} from 'toro/helpers/plp'
import isNumber from 'lodash/isNumber'
import isBoolean from 'lodash/isBoolean'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import _get from 'lodash/get'
import findIndex from 'lodash/findIndex'
import { mergeContentSlots } from 'toro/helpers/badges'
import { getActiveFiltersCount, toggleFilterReducer } from 'toro/helpers/filters'
import { getActiveFilters } from 'toro/helpers/activeFiltersHelper'
import deriveRootCategory from 'toro/helpers/deriveRootCategory'
import {
  STORAGE_APPLIED_FACETS,
  STORAGE_FOCUSED_FILTERING,
  STORAGE_SORT_USED,
} from 'toro/constants/storageIds'
import {
  enableVisuallySimilarFromCategoryAtom,
  getOnModelPlp2Up,
  isOnModelPlp2UpAtom,
  isShopByBrowseAllEnabledAtom,
  modelToggleViewAtom,
  ModelToggleView,
  onModelAtom,
} from 'store/plp.atom'
import type { PriceFilter } from 'toro/components/ExposedFilters/helpers'
import { thinkPLPAtom, ThinkPLPData } from './think-plp.atom'
import { preferencesAtom } from 'store/preferences.atom'
import uniqBy from 'lodash/uniqBy'

type AdjacentPageUrls = {
  nextUrl?: string
  nextUrlToFetch?: string
  prevUrl?: string
}

export interface FilterAtomType {
  name: string
  refvalue: string
}

export const searchResultsReloadingAtom = atom<boolean>(false)
export const setSearchResultsReloadingAtom = atom(null, (_, set, reloading: boolean) => {
  if (!isBoolean(reloading)) {
    return
  }
  set(searchResultsReloadingAtom, reloading)
})

export const disableRVRecommendationsAtom = atom<boolean>(false)
export const defaultRVRecommendationsClosedAtom = atom<boolean>(false)

export const searchResultPageAtom = atom<number>(1)
export const setSearchResultPageAtom = atom(null, (_, set, page: number) => {
  if (!isNumber(page)) {
    return
  }
  set(searchResultPageAtom, page || 1)
})

export const filtersAtom = atom<Filter[]>([])
export const exposedFiltersAtom = atom<PriceFilter[]>([])

export const isFiltersDrawerAnimationCompleteAtom = atom(false)
export const isLoadFilterComponentsAtom = atom(false)

export const isAnyFilterActiveAtom = atom((get) => {
  const filters = get(filtersAtom)

  return filters.length > 0
})

export type ActiveFilter = {
  hitCount: number
  id: string
  name: string
  displayName: string
  refvalue: string
  selectable: boolean
  swatchID: string
  type: string
}

export type FocusedFilteringValue = {
  color: string
  filterCategory: string
}

export type FocusedFilteringProps = {
  categoryID: string | null
  value: FocusedFilteringValue | null
}

export const activeFiltersAtom = atom<ActiveFilter[]>((get) => {
  const filters = get(filtersAtom)
  const refinements = get(refinementsAtom)
  return getActiveFilters(filters, refinements)
})

const initialValueFocusedFiltering = {
  categoryID: null,
  value: null,
}
export const focusedFilteringAtom = atomWithStorage<FocusedFilteringProps>(
  STORAGE_FOCUSED_FILTERING,
  initialValueFocusedFiltering
)

export const activeFiltersCountAtom = atom((get) => {
  const filters = get(filtersAtom)
  const refinements = get(refinementsAtom)

  return getActiveFiltersCount({ filters, refinements })
})

export const setFiltersAtom = atom(null, (_, set, filters: Filter[]) => {
  if (!Array.isArray(filters)) {
    return
  }
  set(searchResultPageAtom, 1)
  set(filtersAtom, filters)
})

export const targetRefinementAtom = atom<{ id: string }>({
  id: 'filterCategory',
})

export const toggleFiltersAtom = atom(null, (get, set, { optionRefValue, refinementId }) => {
  const currentFilters = get(filtersAtom)
  const currentBusyFilterId = get(busyFilterIdAtom)

  if (currentBusyFilterId && refinementId !== currentBusyFilterId) {
    return
  }

  const isShopByBrowseAllEnabled = get(isShopByBrowseAllEnabledAtom)

  const targetRefinement = get(targetRefinementAtom)

  if (!isShopByBrowseAllEnabled && refinementId === targetRefinement?.id) {
    set(isShopByBrowseAllEnabledAtom, true)
  }

  const { optionIndex, nextFilters, removeFilter } = toggleFilterReducer({
    optionRefValue,
    refinementId,
    currentFilters,
  })

  set(setBusyFilterIdAtom, refinementId)
  set(setLastAppliedRefinementId, refinementId)
  set(setSearchResultsReloadingAtom, true)
  set(setFiltersAtom, nextFilters)

  return { nextFilters, optionIndex, removeFilter }
})

// plpTemplateConfigurations
export const refinementsIdAtom = atom<string>('')

// plpTemplateConfigurations
export const setRefinementsIdAtom = atom(null, (_, set, id: '') => {
  set(refinementsIdAtom, id)
})

export const refinementsAtom = atom<Refinement[]>([])

export const visibleRefinementsAtom = atom((get) => {
  const refinements = get(refinementsAtom)
  if (!Array.isArray(refinements)) {
    return []
  }
  return refinements.filter(
    (refinement) =>
      _get(refinement, 'options.length') &&
      (!checkOptionType(refinement) || areSelectableOptions(refinement))
  )
})

export const setRefimenentsAtom = atom(null, (_, set, refinements: Refinement[]) => {
  if (!Array.isArray(refinements)) {
    return
  }
  set(refinementsAtom, refinements)
})

export const setThinkPLPAtom = atom(null, (_, set, thinkPLP: ThinkPLPData) => {
  if (!isPlainObject(thinkPLP) || !thinkPLP.isThinkPage) {
    return
  }
  set(thinkPLPAtom, thinkPLP)
})

export const extendRefinementsAtom = atom(null, (get, set, incomingRefinements: Refinement[]) => {
  if (!Array.isArray(incomingRefinements)) {
    return
  }
  const currentRefinements = get(refinementsAtom)
  const appliedRefinementType = get(lastAppliedRefinementId)
  const appliedFilterIndex = findIndex(incomingRefinements, { id: appliedRefinementType })

  // Populate initial refinements
  if (!currentRefinements.length || appliedFilterIndex < 0) {
    set(refinementsAtom, incomingRefinements)
    return
  }

  // Retain last applied filter
  const extendedRefinements = [...incomingRefinements]
  extendedRefinements[appliedFilterIndex] = currentRefinements[appliedFilterIndex]

  set(refinementsAtom, extendedRefinements)
})
export const sortingRuleAtom = atom<string>('')
export const setSortingRuleAtom = atom(null, (_, set, srule: string) => {
  if (!isString(srule)) {
    return
  }
  set(searchResultPageAtom, 1)
  set(sortingRuleAtom, srule)
})

export const sortOptionsAtom = atom<SortOption[]>([])
export const setSortOptionsAtoms = atom(null, (_, set, options: SortOption[]) => {
  if (!Array.isArray(options)) {
    return
  }
  set(sortOptionsAtom, options)
})
export const currentSortAtom = atom<string | undefined>((get) => {
  const options = get(sortOptionsAtom)
  if (!Array.isArray(options)) {
    return
  }
  return options.find((option) => option.code === get(sortingRuleAtom))?.name
})

export const defaultSortAtom = atom<string>('')
export const setDefaultSortAtom = atom(null, (_, set, srule) => {
  if (!isString(srule)) {
    return
  }
  set(defaultSortAtom, srule)
})

export const setXgenProductsAtom = atom(null, (get, set, recommendations: any) => {
  if (!Array.isArray(recommendations)) {
    return
  }
  const products = get(productsAtom)
  set(productsAtom, uniqBy([...products, ...recommendations], 'id'))
})

export const productsAtom = atom<ListingProduct[]>([])
export const setProductsAtom = atom(null, (_, set, products: ListingProduct[]) => {
  if (!Array.isArray(products)) {
    return
  }
  set(productsAtom, products)
})

export const totalProductsAtom = atom<number>(0)
export const setTotalProductsAtom = atom(null, (_, set, total: number) => {
  if (!isNumber(total)) {
    return
  }
  set(totalProductsAtom, total)
})

export const totalPagesAtom = atom<number>(1)
export const setTotalPagesAtom = atom(null, (_, set, totalPages: number) => {
  if (!isNumber(totalPages)) {
    return
  }
  set(totalPagesAtom, totalPages)
})

export const busyFilterIdAtom = atomWithReset<string>('')
export const setBusyFilterIdAtom = atom(null, (_, set, id: string) => {
  if (!isString(id)) {
    return
  }
  set(busyFilterIdAtom, id)
})

export const lastAppliedRefinementId = atomWithReset<string>('')
export const setLastAppliedRefinementId = atom(null, (_, set, id: string) => {
  if (!isString(id)) {
    return
  }
  set(lastAppliedRefinementId, id)
})

export const pageTitleAtom = atom<string>('')
export const setPageTitleAtom = atom(null, (_, set, title: string) => {
  if (!isString(title)) {
    return
  }
  set(pageTitleAtom, title)
})

export const rootCategoryAtom = atom<string>('')

export const categoryIdAtom = atom<string>('')

export const preloadImageSrcAtom = atom<string>('')
export const setPreloadImageSrcAtom = atom(null, (_, set, preloadImageSrc: string) => {
  if (!isString(preloadImageSrc)) {
    return
  }
  set(preloadImageSrcAtom, preloadImageSrc)
})

export const lazyIndexAtom = atom<number>(0)
export const setLazyIndexAtom = atom(null, (_, set, index: number) => {
  if (!isNumber(index)) {
    return
  }
  set(lazyIndexAtom, index)
})

export const seoDataAtom = atom<object>({})
export const setSeoDataAtom = atom(null, (_, set, seoData: object) => {
  if (!isPlainObject(seoData)) {
    return {}
  }
  set(seoDataAtom, seoData)
})

export const initialRouteParamsAtom = atom<{
  query?: NextParsedUrlQuery
  asPath?: string
  locale?: string
}>({})
export const setInitialRouteParamsAtom = atom(null, (_, set, { query, asPath, locale }) => {
  if (!isPlainObject(query) || !isString(asPath)) {
    return {}
  }
  set(initialRouteParamsAtom, { query, asPath, locale })
})

export const populatePageDataAtom = atom(null, (get, set, { pageData, badgingContentSlots }) => {
  if (!isPlainObject(pageData)) {
    return
  }
  const pageTitle = getPageTitle(pageData as ReturnType<typeof getPageTitle>)
  if (Array.isArray(pageData.products)) {
    set(productsAtom, pageData.products)
  }
  if (isNumber(pageData.page)) {
    set(searchResultPageAtom, pageData.page || 1)
  }
  if (Array.isArray(pageData.filters)) {
    set(filtersAtom, pageData.filters)
  }
  if (Array.isArray(pageData.refinements)) {
    set(refinementsAtom, pageData.refinements)
  }
  if (isNumber(pageData.total)) {
    set(totalProductsAtom, pageData.total)
  }
  if (isNumber(pageData.totalPages)) {
    set(totalPagesAtom, pageData.totalPages)
  }
  if (isString(pageData.defaultSort)) {
    set(defaultSortAtom, pageData.defaultSort)
  }
  if (Array.isArray(pageData.sortOptions)) {
    set(sortOptionsAtom, pageData.sortOptions)
  }
  if (isString(pageData.srule)) {
    set(sortingRuleAtom, pageData.srule)
  }
  if (isString(pageTitle)) {
    set(pageTitleAtom, pageTitle)
  }
  if (isString(pageData.preloadImageSrc)) {
    set(preloadImageSrcAtom, pageData.preloadImageSrc)
  }
  if (isPlainObject(pageData.seoContent)) {
    set(seoDataAtom, pageData.seoContent)
  }
  if (Array.isArray(badgingContentSlots)) {
    set(badgesAtom, mergeContentSlots(get(badgesAtom), badgingContentSlots))
  }
  if (isNumber(pageData.pageSize)) {
    set(
      lazyIndexAtom,
      getLazyIndex(pageData.pageSize, !!pageData?.topContentSlot?.content?.content)
    )
  }
  set(rootCategoryAtom, deriveRootCategory(pageData))
  set(categoryIdAtom, pageData.id || '')
  set(enableVisuallySimilarFromCategoryAtom, pageData.enableVisuallySimilar)
  set(isOnModelPlp2UpAtom, getOnModelPlp2Up(pageData))
  set(onModelAtom, _get(pageData, 'onModel', {}))
  set(
    modelToggleViewAtom,
    _get(pageData, 'onModel.isOnModelTabActive') ? ModelToggleView.Model : ModelToggleView.Product
  )
  const exposedFilters = _get(pageData, 'exposedPriceFilters.price')
  set(exposedFiltersAtom, Array.isArray(exposedFilters) ? exposedFilters : [])

  set(customerGroupsAtom, pageData.customerGroups || [])
  set(setLastVisitedCategoryAtom, { cgid: pageData.id })
  // Set category selected in menu
  set(setCategorySelectedInMenuAtom, { cgid: pageData.id })
  set(defaultRVRecommendationsClosedAtom, _get(pageData, 'defaultRVRecommendationsClosed'))
  set(disableRVRecommendationsAtom, _get(pageData, 'disableRVRecommendations', false))
})

export const updatePageDataAtom = atom(null, (get, set, { pageData, badgingContentSlots }) => {
  if (!isPlainObject(pageData)) {
    return
  }
  if (Array.isArray(pageData.refinements)) {
    set(refinementsAtom, pageData.refinements)
  }
  if (isNumber(pageData.total)) {
    set(totalProductsAtom, pageData.total)
  }
  if (isNumber(pageData.totalPages)) {
    set(totalPagesAtom, pageData.totalPages)
  }
  if (isPlainObject(pageData.seoContent)) {
    set(seoDataAtom, pageData.seoContent)
  }
  if (Array.isArray(badgingContentSlots)) {
    set(badgesAtom, mergeContentSlots(get(badgesAtom), badgingContentSlots))
  }
  if (pageData.isThinkPage) {
    set(thinkPLPAtom, {
      isThinkPage: pageData.isThinkPage,
      PLPTabColor: pageData.PLPTabColor,
      enableTransparentHeader: pageData.enableTransparentHeader,
    })
  }
  set(enableVisuallySimilarFromCategoryAtom, pageData.enableVisuallySimilar)
})

export const resetPageDataAtom = atom(null, (_, set) => {
  set(refinementsAtom, [])
  set(filtersAtom, [])
  set(totalProductsAtom, 0)
  set(sortingRuleAtom, '')
  set(seoDataAtom, {})
  set(totalPagesAtom, 0)
  set(enableVisuallySimilarFromCategoryAtom, false)
  set(thinkPLPAtom, {
    isThinkPage: false,
    PLPTabColor: null,
    enableTransparentHeader: false,
  })
})

export const searchResultsUrlAtom = atom((get) => {
  const page = get(searchResultPageAtom)
  const filters = get(filtersAtom)
  const { query: searchQuery, asPath, locale } = get(initialRouteParamsAtom)
  const defaultSort = get(defaultSortAtom)
  const srule = get(sortingRuleAtom)
  const query = populateQueryParams(searchQuery, page, filters, srule, defaultSort)
  const url = getURLForState(query, asPath, locale)
  const isShopByBrowseAllEnabled = get(isShopByBrowseAllEnabledAtom)
  const urlToFetch = getReducedPayloadUrl(url, isShopByBrowseAllEnabled)

  return { url, urlToFetch }
})

export const adjacentPageUrlsAtom = atom<AdjacentPageUrls>({})
export const setAdjacentPageUrlsAtom = atom(null, (get, set, pageData) => {
  const { query, asPath, locale } = get(initialRouteParamsAtom)
  set(adjacentPageUrlsAtom, deriveAdjacentPageUrls(pageData, query, asPath, locale))
})

export const expandedAccordionRefinementsAtom = atom<number[]>([])
export const setExpandedAccordionRefinementsAtom = atom(null, (get, set, values: string[]) => {
  if (!Array.isArray(values)) {
    return
  }

  const refinements = get(visibleRefinementsAtom)
  const refinementIndexes = values.map((value) => {
    return refinements.findIndex((v) => v.id === value)
  })

  set(expandedAccordionRefinementsAtom, refinementIndexes)
})

export const customerGroupsAtom = atom<string[]>([])

// Storage atoms created at module level for performance
const selectedFacetListAtom = atomWithStorage<string[]>(STORAGE_APPLIED_FACETS, [])
const sortHistoryAtom = atomWithStorage<string[]>(STORAGE_SORT_USED, [])

// Needed to detect added/removed filters by comparing with the last state.
export const previousActiveFiltersAtom = atom<FilterAtomType[]>([])

// Maximum number of items to track
const MAX_FACET_HISTORY = 4
const MAX_SORT_HISTORY = 4

export const setLastAppliedFacetSetter = (get: Getter, set: Setter) => {
  const preferences = get(preferencesAtom)
  const enablePersonalization = _get(preferences, 'ToggleSiteFeatures.enablePersonalization', false)
  if (!enablePersonalization) return

  const activeFilters = get(activeFiltersAtom) as any[]
  const prevFilters = get(previousActiveFiltersAtom)

  let diff = activeFilters.filter((f) => !prevFilters.some((p) => p.name === f.name))

  if (diff.length === 0) {
    const changedFacet = activeFilters.find((f) => {
      const prev = prevFilters.find((p) => p.name === f.name)
      return prev && prev.refvalue !== f.refvalue
    })

    if (changedFacet) diff = [changedFacet]
  }

  set(previousActiveFiltersAtom, activeFilters)

  if (diff.length === 0) return

  const changed = diff[0]

  set(selectedFacetListAtom, (prevList) => {
    let updated = [...prevList]

    const facetName = changed.name.toLowerCase()
    const newValue = changed.refvalue
    const prefix = `${facetName}:`

    const idx = updated.findIndex((x) => x.startsWith(prefix))

    if (idx !== -1) {
      const existingEntry = updated[idx]
      const [, valStr] = existingEntry.split(':')
      const currentValues = valStr.split(',').map((v) => v.trim())

      const newValues = newValue
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)

      const finalValues = Array.from(new Set([...currentValues, ...newValues]))

      updated[idx] = `${facetName}:${finalValues.join(', ')}`
    } else {
      updated.push(`${facetName}:${newValue}`)
    }

    if (updated.length > MAX_FACET_HISTORY) {
      updated = updated.slice(updated.length - MAX_FACET_HISTORY)
    }

    return updated
  })
}

export const setLastAppliedFacetAtom = atom(null, setLastAppliedFacetSetter)

export const setSortHistorySetter = (get: Getter, set: Setter) => {
  const preferences = get(preferencesAtom)
  const enablePersonalization = _get(preferences, 'ToggleSiteFeatures.enablePersonalization', false)
  if (!enablePersonalization) return

  const currentSort = get(currentSortAtom) as string | null
  if (!currentSort) return

  const sortKey = currentSort.trim()

  set(sortHistoryAtom, (previousSorts) => {
    const filteredSorts = previousSorts.filter((sort) => sort !== sortKey)

    const updatedSorts = [sortKey, ...filteredSorts]

    if (updatedSorts.length > MAX_SORT_HISTORY) {
      return updatedSorts.slice(0, MAX_SORT_HISTORY)
    }

    return updatedSorts
  })
}

export const setSortHistoryAtom = atom(null, setSortHistorySetter)
