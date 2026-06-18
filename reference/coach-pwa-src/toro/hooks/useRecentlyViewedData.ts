import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useEffect, useCallback, useReducer } from 'react'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import useCertonaRequest from 'toro/hooks/useCertonaRequest'
import usePreference from 'toro/hooks/usePreference_new'

import get from 'lodash/get'
import pick from 'lodash/pick'

import { type CertonaScheme } from 'store/certona-schemes.atoms'
import { type RVRecommendationsConfig } from 'toro/components/RecentlyViewedCarousel/RVRecommendationsCarousel'
import { XgenRawResponse, XgenContainer, XgenContainerID, XgenProduct } from 'toro/lib/xgen'
import { RecommendationVendors } from 'toro/lib/vendorProductsAdapter/recommendations/configurations'
import { xgenClientAtom } from 'store/xgen.atom'
import type { CertonaProductPricing } from 'toro/components/Certona/RecommendationPrice'
import useSelectCertonaItems from 'toro/hooks/useSelectCertonaItems'
import type { ProductItem } from 'toro/types'
import {
  getXgenRecentlyViewedAtom,
  updateXgenRecentlyViewedAtom,
} from 'store/xgen-recently-viewed.atom'

export type RecentlyViewedProduct = {
  detailURL: string
  imageURL: string
  isAlmostGone?: boolean
  ID: string
  Availability: string
  price: Partial<CertonaProductPricing>
  vendor?: RecommendationVendors
  variationId?: string
  isSized?: boolean
  name?: string
  promotions?: { type: string; content: string }[]
}

type RecentlyViewedRecommendations = {
  products: RecentlyViewedProduct[]
  title: string
  display: boolean
  vendorScheme: string
  experience_id?: string
  vendor?: RecommendationVendors
}

type ReducerPayload =
  | {
      vendor: RecommendationVendors.CERTONA
      data: CertonaScheme
    }
  | {
      vendor: RecommendationVendors.XGEN
      data: XgenRawResponse
    }

const initialPayload = {
  products: [],
  title: '',
  display: false,
}

const defaultDisabledSchemes = []
const defaultInventoryLookupValue = { thresholdInventoryRV: { min: 2, max: 10 } }

const normalizeCertonaPayload = (
  schemeData: CertonaScheme,
  deriveProducts: (
    products: RecentlyViewedRecommendations['products']
  ) => RecentlyViewedRecommendations['products']
): RecentlyViewedRecommendations => {
  const items = get(schemeData, 'items', [])
  const normalizedItems = items.map((product) => ({
    ...product,
    variationId: product.VariationIdV2,
    isSized: product.SizeFlag,
    vendor: RecommendationVendors.CERTONA,
  }))

  return {
    products: deriveProducts(normalizedItems),
    title: get(schemeData, 'explanation', 'Recently Viewed'),
    display: get(schemeData, 'display', 'no') === 'yes',
    experience_id: get(schemeData, 'experience_id', ''),
    vendorScheme: get(schemeData, 'scheme', ''),
    vendor: RecommendationVendors.CERTONA,
  }
}

const normalizeXgenPayload = (
  container: XgenContainer,
  deriveProducts: (
    products: RecentlyViewedRecommendations['products']
  ) => RecentlyViewedRecommendations['products'],
  buildPromotions: (rawProduct: XgenProduct, containerId: string) => ProductItem['promotions']
): RecentlyViewedRecommendations => {
  const modifiedProducts = container.items?.map((product) => {
    const {
      id,
      name,
      price: rawPrice,
      detailUrl,
      imageUrl,
      availability,
      variationId,
      isSized,
    } = pick(product, [
      'id',
      'name',
      'price',
      'detailUrl',
      'imageUrl',
      'availability',
      'variationId',
      'isSized',
    ])

    const price = Object.entries(rawPrice).reduce((acc, [key, value]) => {
      const sanitizedKey = key.toLowerCase()
      const sanitizedValue = typeof value === 'string' ? value : value?.toString() || ''
      return { ...acc, [sanitizedKey]: sanitizedValue }
    }, {})

    const promotions = buildPromotions(product, XgenContainerID.rv_on_top_plp)

    return {
      ID: id,
      name,
      price,
      detailURL: detailUrl,
      imageURL: imageUrl,
      Availability: availability.toString(),
      promotions,
      vendor: RecommendationVendors.XGEN,
      variationId,
      isSized,
    }
  })

  return {
    products: deriveProducts(modifiedProducts || []),
    title: get(container, 'containerDisplayName', 'Recently Viewed'),
    display: get(container, 'display', false),
    experience_id: get(container, 'strategyId', ''),
    vendorScheme: get(container, 'containerId', ''),
    vendor: RecommendationVendors.XGEN,
  }
}

/**
 * React hook to fetch and normalize recently viewed product recommendations.
 *
 * @param {RVRecommendationsConfig} config - Configuration for recommendations.
 * @param {string} config.certonaScheme - Certona scheme identifier.
 * @param {string} config.location - Page location (e.g., 'HP', 'PLP').
 * @param {number} [config.limit] - Maximum number of products to return.
 * @param {boolean} [config.enableBadging] - Whether to enable inventory badging.
 * @returns {RecentlyViewedRecommendations} Normalized recommendations payload.
 *
 * This hook automatically chooses between Certona and Xgen vendors based on feature flags and disabled schemes.
 * It normalizes the vendor-specific payloads into a unified structure for consumption by UI components.
 */
const useRecentlyViewedData = ({
  certonaScheme,
  location,
  limit,
  enableBadging,
}: RVRecommendationsConfig) => {
  const {
    recommendations: { disabledSchemes = defaultDisabledSchemes },
    inventoryLookup: { thresholdInventoryRV } = defaultInventoryLookupValue,
  } = usePreference({
    inventoryLookup: ['thresholdInventoryRV'],
    recommendations: ['disabledSchemes'],
  })
  const { recommendations: isXgenExperience } = useAtomValue(xgenFeaturesAtom)
  const xgenClient = useAtomValue(xgenClientAtom)

  const cachedXgenData = useAtomValue(getXgenRecentlyViewedAtom)
  const updateCachedXgenData = useUpdateAtom(updateXgenRecentlyViewedAtom)

  const containerLocationsMap = {
    HP: XgenContainerID.home2_rr,
    default: XgenContainerID.rv_on_top_plp,
  }

  const xgenContainerId = containerLocationsMap[location] || containerLocationsMap.default

  const deriveProducts = useCallback(
    (products: RecentlyViewedRecommendations['products']) => {
      const slicedProducts = limit ? products.slice(0, limit) : products
      return !enableBadging
        ? slicedProducts
        : slicedProducts.map((product) => {
            const inventory = Number(get(product, 'Availability', '0'))
            const isAlmostGone =
              inventory >= thresholdInventoryRV?.min && inventory <= thresholdInventoryRV?.max
            return { ...product, isAlmostGone }
          })
    },
    [limit, enableBadging, thresholdInventoryRV]
  )

  const payloadReducer = useCallback(
    (state, payload: ReducerPayload) => {
      switch (payload.vendor) {
        default:
          return state
        case RecommendationVendors.XGEN: {
          const matchingScheme =
            payload.data?.containers?.find(({ containerId }) => containerId === xgenContainerId) ||
            ({} as XgenContainer)
          const promotionsAdapter = xgenClient.recommendations.exposeAdapter('promotions')
          return normalizeXgenPayload(matchingScheme, deriveProducts, promotionsAdapter.build)
        }
        case RecommendationVendors.CERTONA: {
          return normalizeCertonaPayload(payload.data, deriveProducts)
        }
      }
    },
    [xgenClient, xgenContainerId, deriveProducts]
  )

  const pagetype = location === 'HP' ? 'home' : 'productlisting'
  const requestCertonaData = useCertonaRequest({
    pagetype,
    recommendations: true,
    enabled: location === 'HP',
  })

  const isCertonaSchemeDisabled = disabledSchemes.includes(certonaScheme)
  const isXgenSchemeDisabled = disabledSchemes.includes(xgenContainerId)

  const isCertonaDataSource =
    !isCertonaSchemeDisabled && (!isXgenExperience || isXgenSchemeDisabled)

  const [responsePayload, dispatch] = useReducer(payloadReducer, null, () => {
    if (!isCertonaDataSource && cachedXgenData) {
      const matchingScheme =
        cachedXgenData?.containers?.find(({ containerId }) => containerId === xgenContainerId) ||
        ({} as XgenContainer)
      const promotionsAdapter = xgenClient.recommendations.exposeAdapter('promotions')
      return normalizeXgenPayload(matchingScheme, deriveProducts, promotionsAdapter.build)
    }
    return initialPayload
  })

  const certonaPayload = useSelectCertonaItems(certonaScheme) as CertonaScheme
  useEffect(() => {
    if (isCertonaDataSource) {
      dispatch({ data: certonaPayload, vendor: RecommendationVendors.CERTONA })
    }
  }, [certonaPayload, isCertonaDataSource])

  const requestXgenData = useCallback(async () => {
    await xgenClient.recommendations.clearExcludedProducts()
    const data = await xgenClient.recommendations.getRaw(xgenContainerId)
    updateCachedXgenData(data)
    dispatch({ data, vendor: RecommendationVendors.XGEN })
  }, [xgenClient, xgenContainerId, updateCachedXgenData])

  useEffect(() => {
    if (isCertonaDataSource) {
      requestCertonaData()
      return
    }
    requestXgenData()
  }, [requestCertonaData, requestXgenData, isCertonaDataSource])

  return responsePayload
}

export default useRecentlyViewedData
