import { type FC, useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import { categoryIdAtom } from 'store/search-results.atom'
import RecommendedCategoriesComponent from 'toro/components/product/RecommendedCategories/RecommendedCategoriesComponent'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'
import { brandAtom } from 'store/global.atom'

type CLPRecommendedCategoriesProps = {
  isComparablePriceEnabledCategory: boolean
}

const CLPRecommendedCategories: FC<CLPRecommendedCategoriesProps> = ({
  isComparablePriceEnabledCategory,
}) => {
  const categoryId = useAtomValue(categoryIdAtom)
  const {
    adaptiveExperience: { recommendedCategoriesOnCLPs },
  } = usePreference({
    adaptiveExperience: ['recommendedCategoriesOnCLPs'],
  })
  const brand = useAtomValue(brandAtom)
  const { isMobile } = useViewportType()
  const isCoachSite = brand.includes('coach')

  const categories = useMemo(() => {
    return {
      catIDs:
        recommendedCategoriesOnCLPs?.clpMappings?.[categoryId] ||
        recommendedCategoriesOnCLPs?.default ||
        [],
    }
  }, [recommendedCategoriesOnCLPs, categoryId])

  if (!isMobile || !isCoachSite || !categories.catIDs.length) return null

  return (
    <RecommendedCategoriesComponent
      recommendCategories={categories}
      variant="plp"
      isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
    />
  )
}

export default CLPRecommendedCategories
