import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useViewportType from 'toro/hooks/useViewportType'
import ViewMoreSimilar from 'toro/components/ViewMoreSimilar'
import SimilarOptionJumplink from 'toro/components/SimilarOptionJumpLink'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

const LastSlideWithSimilarOptions = ({ selectedVariantId, variant }) => {
  const { isMobile } = useViewportType()
  const isPDPv5_1Enabled = useTemplate([TemplateName.pdpv5_1])
  const isViewMoreSimilarEnabled =
    useExperiment(EXPERIMENTS.VIEW_MORE_SIMILAR_PRODUCTS_PDP) && (isMobile || isPDPv5_1Enabled)

  if (isViewMoreSimilarEnabled) {
    return (
      <ViewMoreSimilar selectedVariantId={selectedVariantId} variant={variant} hidePromotions />
    )
  }

  return <SimilarOptionJumplink selectedVariantId={selectedVariantId} variant={variant} />
}

export default LastSlideWithSimilarOptions
