import { FC } from 'react'
import { useInView } from 'react-intersection-observer'
import { useAtomValue } from 'jotai/utils'
import VisuallySimilarSlider from 'toro/components/product/desktop/VisuallySimilarSlider'
import ProductRecommendationsWrapper, {
  RecommenderPosition,
} from 'toro/components/product/desktop/ProductRecommendationsWrapper'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import useProductData from 'toro/hooks/useProductData'
import { visuallySimilarDataAtom, isVisuallySimilarDataInitializedAtom } from 'store/global.atom'
import Box from 'toro/components/Box'
import RecommendationsSliderSkeleton from 'toro/components/product/desktop/RecommendationsSlider/RecommendationsSliderSkeleton'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import withVendorSwitch from 'toro/hocs/withVendorSwitch'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import PDPRecommendationsTabbedContainer from 'toro/components/RecommendationsTabbedContainer/PDPRecommendationsTabbedContainer'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { useLookbookRecommendations } from 'toro/components/product/mobile/LookbookRecommendations/hooks'
import LookbookRecommendations from 'toro/components/product/mobile/LookbookRecommendations'

type RecommendedProductSectionProps = {
  variant?: string
  visuallySimilarVariant?: string
}

const VendorSwitchedProductRecommendationsWrapper = withVendorSwitch(
  ProductRecommendationsWrapper,
  withSchemeValidation(RecommendationsContainer, ProductRecommendationsWrapper)
)

const RecommendedProductSection: FC<RecommendedProductSectionProps> = ({
  variant,
  visuallySimilarVariant,
}) => {
  const { isVisuallySimilarPDPEnabled, setVisuallySimilarProp, visuallySimilarProp } =
    useLLMRecommendations()
  const visuallySimilarData = useAtomValue(visuallySimilarDataAtom)
  const isVisuallySimilarDataInitialized = useAtomValue(isVisuallySimilarDataInitializedAtom)
  const [similarProductConfigs] = useProductData(['similarProductConfigs'])

  const { recommendations: isXgenRecommendationsEnabled } = useAtomValue(xgenFeaturesAtom)
  const isInlineProductRecommendationEnabled = useExperiment(
    EXPERIMENTS.CERTONA_INLINE_RECOMMENDATION_EXPERIENCE
  )

  const { isLookbookRecommendationsEnabled } = useLookbookRecommendations()

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    onChange: (inView) => {
      if (inView) {
        if (isVisuallySimilarPDPEnabled) {
          setVisuallySimilarProp(visuallySimilarProp)
        } else {
          setVisuallySimilarProp('')
        }
      }
    },
  })

  function renderRecommendations() {
    if (isLookbookRecommendationsEnabled) {
      return <LookbookRecommendations />
    }

    if (
      isXgenRecommendationsEnabled &&
      isInlineProductRecommendationEnabled &&
      similarProductConfigs
    ) {
      return <PDPRecommendationsTabbedContainer pageType="product" variant="inlinePDPv6" />
    }

    if (!isVisuallySimilarPDPEnabled) {
      return (
        <VendorSwitchedProductRecommendationsWrapper
          recommenderPosition={RecommenderPosition.YMAL}
          variant={variant}
          type="ymal"
        />
      )
    }

    // If data is loading, show skeleton
    if (!isVisuallySimilarDataInitialized) {
      return <RecommendationsSliderSkeleton />
    }

    // If we have similar products, show them
    if (visuallySimilarData.length) {
      return <VisuallySimilarSlider variant={visuallySimilarVariant || variant} />
    }

    // Fallback to regular recommendations
    return (
      <VendorSwitchedProductRecommendationsWrapper
        recommenderPosition={RecommenderPosition.YMAL}
        variant={variant}
        type="ymal"
      />
    )
  }

  return (
    <Box ref={inViewRef}>
      {inView && renderRecommendations()}
      {!inView && <RecommendationsSliderSkeleton />}
    </Box>
  )
}

export default withErrorBoundaryWrapper(RecommendedProductSection)
