import { EXPERIMENTS } from 'toro/constants/experiments'
import isEmpty from 'toro/helpers/emptyObjectCheck'
import useExperiment from 'toro/hooks/useExperiment'
import usePreference from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'
import usePageType from 'toro/hooks/usePageType'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'

const RecommendedCategories = dynamic(
  () => import('toro/components/product/RecommendedCategories/RecommendedCategoriesComponent'),
  { ssr: false }
)

const RecommendedCategoriesWrapper = ({
  categoryId,
  recommendedCategoriesData,
  isComparablePriceEnabledCategory,
}: {
  categoryId?: string
  recommendedCategoriesData?: { catIDs: string[] }
  isComparablePriceEnabledCategory?: boolean
}) => {
  const {
    adaptiveExperience: { recommendCategories, plpCatRecommendationsToggle },
  } = usePreference({
    adaptiveExperience: ['recommendCategories', 'plpCatRecommendationsToggle'],
  })

  const { isPDP, isPLP } = usePageType()
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)

  const variant = isPLP ? 'plp' : isTabbedAdaptivePDPEligible ? 'pdpV4' : undefined

  const isRecommendedCategoriesEnabled = useExperiment(
    `${EXPERIMENTS.RECOMMENDED_CATEGORIES}-${EXPERIMENTS.RECOMMENDED_CATEGORIES_DISPLAY_PRODUCTS_PDP}`
  )
  const isRecommendedCategoriesOnPLPEnabled = useExperiment(
    `${EXPERIMENTS.RECOMMENDED_CATEGORIES_ON_PLP}-${EXPERIMENTS.RECOMMENDED_CATEGORIES_DISPLAY_PRODUCTS_PLP}`
  )

  const shouldShowRecommendedCategoriesOnPDP =
    isPDP &&
    isRecommendedCategoriesEnabled &&
    !isEmpty(recommendCategories) &&
    recommendCategories?.enable &&
    recommendCategories?.catIDs?.length > 0

  const shouldShowRecommendedCategoriesOnPLP =
    isPLP &&
    isRecommendedCategoriesOnPLPEnabled &&
    !isEmpty(plpCatRecommendationsToggle) &&
    plpCatRecommendationsToggle?.[isSubBrandActive ? 'subBrand' : 'brand'] &&
    recommendedCategoriesData?.catIDs?.length > 0

  if (!(shouldShowRecommendedCategoriesOnPDP || shouldShowRecommendedCategoriesOnPLP)) {
    return null
  }

  return (
    <RecommendedCategories
      categoryId={categoryId}
      recommendCategories={
        shouldShowRecommendedCategoriesOnPLP ? recommendedCategoriesData : recommendCategories
      }
      variant={variant}
      isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
    />
  )
}

export default RecommendedCategoriesWrapper
