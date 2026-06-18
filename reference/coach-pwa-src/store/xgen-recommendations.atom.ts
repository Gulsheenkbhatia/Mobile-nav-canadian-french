import { atom } from 'jotai'
import capitalize from 'lodash/capitalize'
import { atomWithReset, atomWithStorage, createJSONStorage, RESET } from 'jotai/utils'

import { xgenClientAtom } from 'store/xgen.atom'
import { XgenContainerID, type XgenNormalisedResponse } from 'lib/xgen'
import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'

import { checkIfDebugNormalisedEnabled } from 'lib/xgen/utils/logger'
import { activeMobileMenuTabAtom } from 'store/menu-data.atom'
import { type OneSiteBrandTabs } from 'lib/oneSite/config'
import { RecommendationProduct } from 'toro/types/productTypes/recommendationProduct'
import { STORAGE_XGEN_CUSTOMER_ID } from 'toro/constants/storageIds'
import { xgenChannelAtom } from 'store/xgen-channel.atom'

// Deduplication cache to prevent duplicate API calls
const recentCallsCache = new Set<string>()

export const xgenRecommendationsInitialData: XgenNormalisedResponse = Object.values(
  XgenContainerID
).reduce((acc, containerId) => {
  return {
    ...acc,
    [containerId]: {
      containerId: '',
      strategyId: '',
      items: [],
      containerDisplayName: '',
      vendor: RecommendationVendors.XGEN,
    },
  }
}, {}) as XgenNormalisedResponse

export const xgenRecommendationsDataAtom = atomWithReset<XgenNormalisedResponse>(
  xgenRecommendationsInitialData
)

export const xgenAlternateUserIdAtom = atomWithStorage<string | null>(
  STORAGE_XGEN_CUSTOMER_ID,
  null,
  createJSONStorage<string | null>(() => localStorage)
)

export const updateXgenRecommendationsDataAtom = atom(
  null,
  (get, set, currentProduct: RecommendationProduct) => {
    // reset atom data if no active product
    if (!currentProduct?.id) {
      set(xgenRecommendationsDataAtom, RESET)
      // Clear deduplication cache when product changes
      recentCallsCache.clear()
    }
  }
)

export const retrieveXgenRecommendationsAtom = atom(null, async (get, set, { type, vgId }) => {
  const xgenClient = get(xgenClientAtom)
  const containerId = XgenContainerID[type]

  if (!xgenClient) {
    console.warn('[XGEN logs][recommendations][atom]: xgenClient is not initialized')
    return
  }

  if (!type || !containerId) {
    console.warn('[XGEN logs][recommendations][atom]: container type is not provided', {
      type,
      containerId,
    })
    return
  }
  // Create deduplication key
  const callKey = `${type}:${vgId}`
  if (recentCallsCache.has(callKey)) {
    return
  }
  recentCallsCache.add(callKey)
  setTimeout(() => {
    recentCallsCache.delete(callKey)
  }, 1000)

  // Run specific context updates before fetching recommendations
  await Promise.all([set(updateXgenOneSiteContextAtom), set(updateXgenPdpContextAtom, vgId)])

  const alternateUserId = get(xgenAlternateUserIdAtom)
  if (alternateUserId) {
    await xgenClient.recommendations.setCustomerId(alternateUserId)
  }

  xgenClient.recommendations.setChannelContext(get(xgenChannelAtom))

  try {
    const newRecommendations = await xgenClient.recommendations.get(containerId)
    const existingRecommendations = get(xgenRecommendationsDataAtom)

    const recommendations: XgenNormalisedResponse = {
      ...existingRecommendations,
      ...newRecommendations,
    }

    if (checkIfDebugNormalisedEnabled()) {
      console.log(
        '[XGEN logs][recommendations][atom] ui normalised recommendations:',
        recommendations
      )
    }

    set(xgenRecommendationsDataAtom, recommendations)
    return recommendations
  } catch (e) {
    console.error('[XGEN logs][recommendations][atom][error]: retrieveXgenRecommendationsAtom:', e)
  }
})

export const updateXgenOneSiteContextAtom = atom(null, async (get) => {
  const xgenClient = get(xgenClientAtom)
  const oneSiteActiveTab = get(activeMobileMenuTabAtom)

  if (!xgenClient || !oneSiteActiveTab) return

  try {
    const capitalizedTab = capitalize(oneSiteActiveTab) as OneSiteBrandTabs
    await xgenClient.recommendations.setContext({ oneSiteActiveTab: capitalizedTab })
  } catch (e) {
    console.error('[XGEN][context sync error]', e)
  }
})

export const updateXgenPdpContextAtom = atom(null, async (get, set, vgId: string) => {
  const xgenClient = get(xgenClientAtom)

  if (!xgenClient || !vgId) return

  try {
    await xgenClient.recommendations.setPdpProduct(vgId)
    await xgenClient.recommendations.excludeProducts(vgId)
  } catch (e) {
    console.error('[XGEN logs][recommendations][atom][error]: updateXgenPdpProductAtom:', e)
  }
})
