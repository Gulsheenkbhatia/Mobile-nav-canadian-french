import { useEffect, useReducer } from 'react'
import { useAtomValue } from 'jotai/utils'
import get from 'lodash/get'
import pick from 'lodash/pick'
import { xgenClientAtom } from 'store/xgen.atom'
import { mostViewedProductAtom } from 'store/because-you-viewed-products.atom'
import { activeFiltersAtom } from 'store/search-results.atom'
import { XgenContainerID, type XgenContainer } from 'toro/lib/xgen/types'
import { RecommendationVendors } from 'toro/lib/vendorProductsAdapter/recommendations/configurations'
import type { RecentlyViewedProduct } from 'toro/hooks/useRecentlyViewedData'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import { appendRrecParam } from 'toro/components/Einstein/helpers'

export type BYVRecommendationsReturn = {
  eyebrowLabel: string
  title: string
  referenceProduct: RecentlyViewedProduct | null
  products: RecentlyViewedProduct[]
  display: boolean
  experienceId: string
  vendorScheme: string
  addImpression: (payload: any) => void
  selectRecommItem: (payload: any) => Promise<void>
  isLoading: boolean
}

type State = Omit<BYVRecommendationsReturn, 'addImpression' | 'selectRecommItem'>

const makeInitialState = (containerId: XgenContainerID): State => ({
  isLoading: true,
  eyebrowLabel: '',
  title: '',
  referenceProduct: null,
  products: [],
  display: false,
  experienceId: '',
  vendorScheme: containerId,
})

const mapXgenItemToProduct = (
  item: XgenContainer['items'][number],
  buildPromotions: (p: any, containerId: string) => any,
  containerId: XgenContainerID
): RecentlyViewedProduct => {
  const {
    id,
    name,
    price: rawPrice,
    detailUrl,
    imageUrl,
    availability,
    variationId,
    isSized,
  } = pick(item, [
    'id',
    'name',
    'price',
    'detailUrl',
    'imageUrl',
    'availability',
    'variationId',
    'isSized',
  ])

  const price = Object.entries((rawPrice as Record<string, unknown>) ?? {}).reduce<
    Record<string, string>
  >((acc, [k, v]) => {
    acc[k.toLowerCase()] = typeof v === 'string' ? v : String(v ?? '')
    return acc
  }, {})

  return {
    ID: id,
    name,
    price,
    detailURL: appendRrecParam(detailUrl),
    imageURL: imageUrl as string,
    Availability: String(availability ?? '0'),
    promotions: buildPromotions(item, containerId),
    vendor: RecommendationVendors.XGEN,
    variationId: variationId,
    isSized: isSized,
  }
}

const resolveContainerState = (
  container: XgenContainer,
  buildPromotions: (p: any, containerId: string) => any,
  containerId: XgenContainerID
): Omit<State, 'isLoading'> => {
  const allItems = (container.items ?? []).map((item) =>
    mapXgenItemToProduct(item, buildPromotions, containerId)
  )
  const [referenceProduct = null, ...products] = allItems

  return {
    eyebrowLabel: get(container, 'explanation', '') || get(container, 'containerDisplayName', ''),
    title: get(container, 'containerDisplayName', ''),
    referenceProduct,
    products,
    display: get(container, 'display', false) && products.length > 0,
    experienceId: get(container, 'strategyId', ''),
    vendorScheme: containerId,
  }
}

const stateReducer = (prev: State, next: Partial<State>): State => ({ ...prev, ...next })

const useBYVRecommendations = (
  containerId: XgenContainerID = XgenContainerID.sm_el_sitevisit1,
  { enabled = true }: { enabled?: boolean } = {}
): BYVRecommendationsReturn => {
  const xgenClient = useAtomValue(xgenClientAtom)
  const mostViewedProduct = useAtomValue(mostViewedProductAtom)
  const activeFilters = useAtomValue(activeFiltersAtom)

  const featuredVgId = mostViewedProduct?.count > 1 ? mostViewedProduct?.vgId : undefined

  const [state, dispatch] = useReducer(stateReducer, makeInitialState(containerId))

  useEffect(() => {
    if (!enabled) return

    if (activeFilters.length > 0 || !xgenClient) {
      dispatch({ isLoading: false, display: false })
      return
    }

    dispatch({ isLoading: true })

    const fetchData = async () => {
      try {
        if (featuredVgId) {
          await xgenClient.recommendations.setContext({ mostViewedProd: featuredVgId })
        }
        const raw = await xgenClient.recommendations.getRaw(containerId)
        const buildPromotions =
          xgenClient.recommendations.exposeAdapter('promotions')?.build ?? (() => [])
        const container = raw?.containers?.find((c) => c.containerId === containerId)

        if (container) {
          dispatch({
            ...resolveContainerState(container, buildPromotions, containerId),
            isLoading: false,
          })
        } else {
          dispatch({ isLoading: false, display: false })
        }
      } catch {
        dispatch({ isLoading: false, display: false })
      } finally {
        await xgenClient.recommendations.setContext({ mostViewedProd: undefined })
      }
    }

    void fetchData()
  }, [xgenClient, featuredVgId, activeFilters.length, containerId, enabled])

  const { addImpression, selectRecommItem } = useRecommAnalytics({
    forceViewport: 'mobile',
    products: state.products,
    certonaData: { experience_id: state.experienceId },
  })

  return {
    ...state,
    addImpression,
    selectRecommItem,
  }
}

export default useBYVRecommendations
