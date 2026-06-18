import { useCallback } from 'react'
import usePageType from 'toro/hooks/usePageType'
import usePreference from 'toro/hooks/usePreference_new'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { filtersAtom, setXgenProductsAtom } from 'store/search-results.atom'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { PLP_TOP_PRODUCTS } from 'toro/constants/productList'
import { xgenClientAtom } from 'store/xgen.atom'
import { XgenContainerID } from 'toro/lib/xgen/types'
import { transformTopProductsToProductsFormat } from 'toro/components/list/ProductsListing/recommendationsHelper'
import {
  hasVisitedPdpInSessionAtom,
  plpRecsFetchedAtom,
  setPlpRecsFetchedAtom,
} from 'store/plp.atom'

export function usePlpRecommendations() {
  const { isMobile } = useViewportType()
  const { isPLP } = usePageType()
  const isPersonalizedPlpEnabled = useExperiment(EXPERIMENTS.PERSONALIZED_RECOMMENDATION_PLP)
  const {
    recommendations: { enablePlpInGridRecommendations = false, enablePdpGatingForPlpRecs = false },
  } = usePreference({
    recommendations: ['enablePlpInGridRecommendations', 'enablePdpGatingForPlpRecs'],
  })

  const setXgenProducts = useUpdateAtom(setXgenProductsAtom)
  const plpRecsFetched = useAtomValue(plpRecsFetchedAtom)
  const setPlpRecsFetched = useUpdateAtom(setPlpRecsFetchedAtom)
  const hasVisitedPdpInSession = useAtomValue(hasVisitedPdpInSessionAtom)
  const filters = useAtomValue(filtersAtom)
  const xgenClient = useAtomValue(xgenClientAtom)
  const isPdpV6 = useExperiment(EXPERIMENTS.PDP_V6)
  const isPdpV5_1 = useExperiment(EXPERIMENTS.PDP_V5_1)

  const fetchAndStoreRecommendations = useCallback(
    async (categoryId) => {
      if (!categoryId) return
      if (plpRecsFetched === categoryId) return
      if (enablePdpGatingForPlpRecs && !hasVisitedPdpInSession) return
      const hasChangedSort =
        typeof window !== 'undefined' && !!(window?.location?.search?.indexOf('srule') !== -1)
      if (filters.length > 0 || hasChangedSort) return []
      await xgenClient.recommendations.setContext({ parentCategory: categoryId })
      const containerId = XgenContainerID[PLP_TOP_PRODUCTS]
      const rawPlpTopProductsData = await xgenClient.recommendations.getRaw(containerId)
      const plpTopProductsData = rawPlpTopProductsData?.containers?.find(
        (container) => container.containerId === containerId
      )
      if (plpTopProductsData && plpTopProductsData?.items?.length) {
        const normalized = plpTopProductsData?.items.map((item: any) =>
          transformTopProductsToProductsFormat({
            rawProduct: item?.full_xgen_product,
            isMobile,
            isPdpV6,
            isPdpV5_1,
            recType: 'XGN',
            strategyId: plpTopProductsData?.strategyId,
          })
        )
        setXgenProducts(normalized)
      }
      setPlpRecsFetched(categoryId)
    },
    [
      filters,
      isPdpV6,
      isPdpV5_1,
      isMobile,
      isPLP,
      isPersonalizedPlpEnabled,
      enablePlpInGridRecommendations,
      enablePdpGatingForPlpRecs,
      hasVisitedPdpInSession,
      plpRecsFetched,
      setXgenProducts,
      setPlpRecsFetched,
    ]
  )

  const isEnabled = !!(
    isMobile &&
    isPLP &&
    isPersonalizedPlpEnabled &&
    enablePlpInGridRecommendations
  )

  return !isEnabled ? () => {} : fetchAndStoreRecommendations
}
