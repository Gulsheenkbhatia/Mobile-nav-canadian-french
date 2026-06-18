import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import _get from 'lodash/get'

import { preferencesAtom } from 'store/preferences.atom'
import { experimentsAtom } from 'store/experiments.atom'
import {
  totalPagesAtom,
  productsAtom,
  updatePageDataAtom,
  setSortOptionsAtoms,
  extendRefinementsAtom,
  filtersAtom,
  sortingRuleAtom,
  initialRouteParamsAtom,
  searchResultPageAtom,
  customerGroupsAtom,
} from 'store/search-results.atom'
import { badgesAtom } from 'store/badges.atom'
import { isPlpV3Atom } from 'store/plp.atom'
import {
  currentLocaleAtom,
  isSubBrandActiveAtom,
  subBrandAtom,
  isOutletTabAtom,
} from 'store/global.atom'
import { bundlePromotionAtom } from 'store/bundle.atom'
import { sitePreviewAtom } from 'store/site-preview.atom'

import isMobileDevice from 'toro/helpers/isMobileDevice'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import getSortingRuleForXgen from 'toro/helpers/getSortingRuleForXgen'
import fetchOcapiContentAssetsFromClient from 'toro/helpers/fetchOcapiContentAssetsFromClient'

import type { ListingProduct } from 'toro/types/productTypes'
import type { SearchContext } from 'lib/vendorProductsAdapter/search/types/xgen'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { AbortError } from 'toro/helpers/abortablePromise'
import type { SortOption } from 'toro/types/productTypes/common'

import XgenClient from 'toro/lib/xgen/client'
import { getSearchData } from 'toro/analytics/clients/googleAnalyticsHelpers'
import { intlAtom } from 'store/intl.atom'
import { BRANDS } from 'toro/lib/oneSite/config'
import { isSearchV2EnabledAtom } from 'store/search.atom'
import getOneSiteSearchContext from 'toro/search/helpers/getOneSiteSearchContext'
import { oneSiteActiveTabAtom } from 'store/menu-data.atom'
import { xgenChannelAtom } from 'store/xgen-channel.atom'

export const TERMS_LIMIT_DEFAULT = 5
const TERMS_LIMIT_SEARCH_V2 = 10

export const brandBoostingAtom = atom((get) => {
  const preferences = get(preferencesAtom)
  const enableStoreContext = _get(preferences, 'xgenPreferences.enableStoreContext', false)
  const isOutlet = get(isOutletTabAtom)
  const isCoachtopiaBoost = get(isSubBrandActiveAtom)

  if (!enableStoreContext) return undefined
  if (isOutlet) return BRANDS.OUTLET
  if (isCoachtopiaBoost) return BRANDS.COACHTOPIA
  return BRANDS.RETAIL
})

export const fetchBadgesContentSlotsAtom = atom(null, async (get, set, newSlotsIds: string[]) => {
  const existingBadges = get(badgesAtom)
  const existingIds = existingBadges.map((badge) => badge.id)

  const filteredIds = newSlotsIds?.filter((id) => !existingIds.includes(id)).sort() || []

  if (!filteredIds.length) return

  try {
    const newBadgesContent = await fetchOcapiContentAssetsFromClient(filteredIds)
    const newBadges = Object.values(newBadgesContent)

    set(badgesAtom, [...existingBadges, ...newBadges])
  } catch (error) {
    console.error('[XGEN logs]: Failed to fetch badges content:', error)
  }
})

export const xgenClientAtom = atom(new XgenClient())

xgenClientAtom.write = (get) => {
  const isMobile = isMobileDevice()
  const xgenClient = get(xgenClientAtom)
  const isPLPV3 = get(isPlpV3Atom)
  const subBrand = get(subBrandAtom)
  const experiments = get(experimentsAtom)
  const currentLocale = get(currentLocaleAtom)
  const isSubBrand = get(isSubBrandActiveAtom)
  const preferences = get(preferencesAtom)
  const sitePreview = get(sitePreviewAtom)
  const initialRouteParams = get(initialRouteParamsAtom)
  const customerGroups = get(customerGroupsAtom)
  const xgenFeaturesConfig = get(xgenFeaturesAtom)
  const activeTab = get(oneSiteActiveTabAtom)
  const xgenChannel = get(xgenChannelAtom)

  const { formatMessage } = get(intlAtom)

  const experimentsSet = new Set(experiments.split('-'))
  const isXgenFeatureEnabled = Object.values(xgenFeaturesConfig).some(Boolean)

  if (!isXgenFeatureEnabled) {
    console.error('[XGEN logs]: XGEN vendor is disabled.')
    return null
  }

  const isSearchOverlayRedesign = get(isSearchV2EnabledAtom)

  const context: SearchContext = {
    src: _get(initialRouteParams, 'query.src'),
    isPLPV3,
    isMobile,
    preferences,
    page: 'search',
    brandConfig: {
      isSubBrand,
      canonicalUrl: '', // TODO: define/get
      subBrandName: subBrand,
    },
    experiments: experimentsSet,
    currentLocale: getCurrentLocale(currentLocale),
    sitePreview,
    isFeatureEnabled: isXgenFeatureEnabled,
    customerGroups,
    formatMessage,
    termsLimit: get(isSearchV2EnabledAtom) ? TERMS_LIMIT_SEARCH_V2 : TERMS_LIMIT_DEFAULT,
    isSearchOverlayRedesign,
    channel: xgenChannel,
  }

  xgenClient.initialize(context, activeTab)
}

xgenClientAtom.onMount = (setAtom) => {
  setAtom()
}

export const retrieveFromXgenAtom = atom(null, async (get, set, parameters: any) => {
  const xgenClient = get(xgenClientAtom)
  const existingProducts = get(productsAtom)
  const existingBundlePromos = get(bundlePromotionAtom)
  const existingSortOptions = get(xgenSortOptionsAtom)
  const page = get(searchResultPageAtom)
  const srule = get(sortingRuleAtom)
  const filters = get(filtersAtom)
  const { searchTerm, query } = parameters

  if (!xgenClient) return {}

  const currentSrule = srule || query.srule
  const { sortBy, sortOrder } = getSortingRuleForXgen(currentSrule)
  const store = get(brandBoostingAtom)
  const extraContext = getOneSiteSearchContext(searchTerm, get)

  try {
    const [data, xgenSortOptions] = await Promise.all([
      await xgenClient.search(searchTerm, {
        ...parameters,
        page,
        filters,
        sortBy,
        sortOrder,
        existingBundlePromos,
        query,
        store,
        extraContext,
      }),
      !existingSortOptions.length ? xgenClient.getSortOptions() : existingSortOptions,
    ])

    // Update atom only if no Xgen options and new sort options were fetched
    if (!existingSortOptions.length && Array.isArray(xgenSortOptions) && xgenSortOptions.length) {
      set(xgenSortOptionsAtom, xgenSortOptions)
    }

    // Always update `setSortOptionsAtoms` to stay in sync
    set(setSortOptionsAtoms, xgenSortOptions)

    const pageData = _get(data, 'pageData')
    const refinements = _get(pageData, 'refinements', [])
    const newProducts = _get(pageData, 'products', []) as ListingProduct[]
    const badgesContentSlotsIds = _get(data, 'badgesContentSlotsIds', [])
    const promotions = _get(data, 'promotions', { bundleSlots: {} })

    await set(fetchBadgesContentSlotsAtom, badgesContentSlotsIds)

    // TODO[performance]: consider store products by page in a map pages: {2: products: [], 3: products}
    const updatedProducts = page > 1 ? existingProducts.concat(newProducts) : pageData.products

    set(bundlePromotionAtom, {
      ...existingBundlePromos,
      ...promotions.bundleSlots,
    })

    set(productsAtom, updatedProducts as ListingProduct[])
    set(filtersAtom, filters)
    set(sortingRuleAtom, currentSrule)
    set(extendRefinementsAtom, refinements)

    const updatedPageData = {
      ...pageData,
      products: updatedProducts,
      filters,
      srule,
      page,
      sortOptions: xgenSortOptions,
    }

    set(updatePageDataAtom, { pageData: { ...updatedPageData, refinements: null } })

    if (pageData) {
      const totalPages = pageData.totalPages || 1
      set(totalPagesAtom, totalPages)
    }

    return updatedPageData
  } catch (error) {
    if (error instanceof AbortError) {
      return { aborted: true }
    }
    console.error('[XGEN logs]: Error fetching data from XGEN', error)
    return { error }
  }
})

export const xgenSortOptionsAtom = atom<SortOption[]>([])

type RetrieveSearchSuggestionsParams = {
  searchTerm: string
  pageSize?: number
}

type SearchTerm = {
  name: string
  link: string
}

type SearchSuggestionsResult = {
  products: unknown[]
  totalNumResults: number
  searchQuery: string
  topSearches: SearchTerm[]
  isAborted?: boolean
}

export const retrieveXgenSearchSuggestionsAtom = atom(
  null,
  async (get, _set, params: RetrieveSearchSuggestionsParams): Promise<SearchSuggestionsResult> => {
    const xgenClient = get(xgenClientAtom)
    const { searchTerm, pageSize = 4 } = params

    if (!xgenClient) {
      return { products: [], totalNumResults: 0, searchQuery: searchTerm, topSearches: [] }
    }

    const extraContext = getOneSiteSearchContext(searchTerm, get)
    try {
      const result = await xgenClient.searchSuggestions(searchTerm, {
        pageSize,
        extraContext,
      })

      return {
        products: result?.products ?? [],
        totalNumResults: result?.totalNumResults ?? 0,
        searchQuery: result?.searchQuery ?? searchTerm,
        topSearches: result?.topSearches ?? [],
        isAborted: result?.isAborted ?? false,
      }
    } catch (error) {
      console.error('[XGEN logs]: Error fetching search suggestions', error)
      return { products: [], totalNumResults: 0, searchQuery: searchTerm, topSearches: [] }
    }
  }
)

type SearchEventPayload = Partial<Parameters<typeof getSearchData>>
export const xgenSearchEventPayloadAtom = atomWithReset<SearchEventPayload>(
  {} as SearchEventPayload
)
