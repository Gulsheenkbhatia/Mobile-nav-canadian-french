import { FC, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useAtomValue } from 'jotai/utils'
import VisuallySimilarSlider from 'toro/components/product/desktop/VisuallySimilarSlider'

import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import { visuallySimilarDataAtom, isVisuallySimilarDataInitializedAtom } from 'store/global.atom'
import Box from 'toro/components/Box'
import RecommendationsSliderSkeleton from 'toro/components/product/desktop/RecommendationsSlider/RecommendationsSliderSkeleton'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

type VisuallySimilarContainerProps = {
  variant?: string
  visuallySimilarVariant?: string
}

const VisuallySimilarContainer: FC<VisuallySimilarContainerProps> = ({
  variant,
  visuallySimilarVariant,
}) => {
  const { isVisuallySimilarPDPEnabled, setVisuallySimilarProp, visuallySimilarProp } =
    useLLMRecommendations()

  const visuallySimilarData = useAtomValue(visuallySimilarDataAtom)
  const isVisuallySimilarDataInitialized = useAtomValue(isVisuallySimilarDataInitializedAtom)

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
  })

  useEffect(() => {
    if (!inView) return
    if (!isVisuallySimilarPDPEnabled) return
    if (!visuallySimilarProp) return
    if (isVisuallySimilarDataInitialized) return

    setVisuallySimilarProp(visuallySimilarProp)
  }, [inView, isVisuallySimilarPDPEnabled, visuallySimilarProp, isVisuallySimilarDataInitialized])

  if (!isVisuallySimilarPDPEnabled) {
    return null
  }

  const renderRecommendations = () => {
    if (!isVisuallySimilarDataInitialized) {
      return <RecommendationsSliderSkeleton />
    }

    if (visuallySimilarData?.length) {
      return <VisuallySimilarSlider variant={visuallySimilarVariant || variant} />
    }
    return null
  }

  return (
    <Box ref={inViewRef}>
      {!inView ? <RecommendationsSliderSkeleton /> : renderRecommendations()}
    </Box>
  )
}

export default withErrorBoundaryWrapper(VisuallySimilarContainer)
