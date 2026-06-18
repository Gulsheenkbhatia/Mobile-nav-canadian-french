import RecommendedProductSection from 'toro/components/product/RecommendedProductSection'
import VisuallySimilarGrid from 'toro/components/VisuallySimilarGrid/VisuallySimilarGrid'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePreference from 'toro/hooks/usePreference_new'
import { XgenContainerID } from 'toro/lib/xgen/types'
import { useAtomValue } from 'jotai/utils'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'

interface YouMayAlsoLikeContainerProps {
  type?: string
  variant?: string
}

const YouMayAlsoLikeContainer: React.FC<YouMayAlsoLikeContainerProps> = ({
  type = 'ymal',
  variant,
  ...props
}) => {
  const isYmalGrid2Up = useExperiment(EXPERIMENTS.YMAL_GRID_2UP)
  const isYmalGrid3Up = useExperiment(EXPERIMENTS.YMAL_GRID_3UP)
  const { recommendations: isXgenRecommendations = false } = useAtomValue(xgenFeaturesAtom)

  const {
    recommendations: { disabledSchemes = [] },
  } = usePreference({
    recommendations: ['disabledSchemes'],
  })

  if (type === 'ymal') {
    const isSchemaDisabled = disabledSchemes.includes(XgenContainerID.ymal)
    const shouldShowGrid =
      (isYmalGrid2Up || isYmalGrid3Up) && isXgenRecommendations && !isSchemaDisabled

    if (shouldShowGrid) {
      return <VisuallySimilarGrid schema="ymal" gridColumns={isYmalGrid3Up ? 3 : 2} />
    }
  }

  return (
    <RecommendedProductSection
      visuallySimilarVariant={variant ?? 'visuallySimilarPDPv6'}
      variant={variant}
      {...props}
    />
  )
}

export default YouMayAlsoLikeContainer
