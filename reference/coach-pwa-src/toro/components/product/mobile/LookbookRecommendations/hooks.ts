import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useProductData from 'toro/hooks/useProductData'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import { useEffect, useMemo } from 'react'
import useRecommendations from 'toro/hooks/useRecommendations'
import usePreference from 'toro/hooks/usePreference_new'
import _isEmpty from 'lodash/isEmpty'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'
import { getLookbookRecommendationItems } from 'toro/components/product/mobile/LookbookRecommendations/helpers'
import type { ResponseRecommendations } from 'toro/components/RecommendationsContainer/types'
import useViewportType from 'toro/hooks/useViewportType'
import usePageType from 'toro/hooks/usePageType'

type UseLookbookHook = () => {
  isLookbookRecommendationsEnabled: boolean
  data: ResponseRecommendations
  isLoading: boolean
}

export const useLookbookRecommendations: UseLookbookHook = () => {
  const { isMobile } = useViewportType()
  const { isPDP } = usePageType()
  const isLookbookExperimentEnabled = useExperiment(EXPERIMENTS.LOOKBOOK_BELOW_THE_FOLD_PDP)
  const {
    adaptiveExperience: { enableLookBook },
  } = usePreference({
    adaptiveExperience: ['enableLookBook'],
  })

  const isEnabled = isLookbookExperimentEnabled && isMobile && isPDP && !_isEmpty(enableLookBook)

  const [fallbackSelectedVariantGroupId, department] = useProductData([
    'bundleProductData[0].defaultVariantGroup.id',
    'custom.c_department',
  ])
  const selectedVariantGroupId = useVariantGroupData('id') || fallbackSelectedVariantGroupId
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  const { fetchRecommendations, isLoading, data: ymalData } = useRecommendations('ymal')
  const lookbookRecommendationItems = useMemo(() => {
    return getLookbookRecommendationItems({
      recommendationItems: ymalData.items,
      preferences: enableLookBook,
      isSubBrandActive,
      department,
    })
  }, [ymalData.items, enableLookBook, isSubBrandActive, department])

  useEffect(() => {
    if (!isEnabled || !selectedVariantGroupId) return
    // Only trigger when VG ID is in normalized format (dashes, not spaces)
    if (selectedVariantGroupId.includes(' ')) return
    void fetchRecommendations(selectedVariantGroupId)
  }, [isEnabled, selectedVariantGroupId, fetchRecommendations])

  return {
    isLoading,
    isLookbookRecommendationsEnabled: isEnabled,
    data: {
      ...ymalData,
      items: lookbookRecommendationItems,
    },
  }
}
