import React, { FC } from 'react'
import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import RecommendationsSlider, {
  RecommendationProvider,
} from 'toro/components/product/desktop/RecommendationsSlider'
import { useAtomValue } from 'jotai/utils'
import { visuallySimilarDataAtom } from 'store/global.atom'
import { useIntl } from 'react-intl'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'

type VisuallySimilarLazyContainerProps = {
  variant?: string
}

type VisuallySimilarContainerProps = {
  title: string
  products: any[]
  addImpression: (any) => void
  selectRecommItem: (any) => Promise<void>
  variant?: string
}

const VisuallySimilarContainer: FC<VisuallySimilarContainerProps> = ({
  title,
  products,
  addImpression,
  selectRecommItem,
  variant,
}) => {
  return (
    <RecommendationsSlider
      title={title}
      products={products}
      addImpression={addImpression}
      selectRecommItem={selectRecommItem}
      provider={RecommendationProvider.llm}
      scheme="product1_llm"
      variant={variant}
    />
  )
}

const VisuallySimilarLazyContainer: FC<VisuallySimilarLazyContainerProps> = ({ variant }) => {
  const visuallySimilarData = useAtomValue(visuallySimilarDataAtom)
  const { addImpression, selectRecommItem } = useRecommAnalytics({
    products: visuallySimilarData,
    certonaData: {
      experience_id: 'product1_llm',
    },
  })

  const { formatMessage } = useIntl()
  const title = formatMessage({
    id: 'pdp.product.shopSimilarTitle',
    defaultMessage: 'Visually Similar',
  })

  return (
    <Box id="visually-similar-section">
      <VisuallySimilarContainer
        title={title}
        products={visuallySimilarData}
        addImpression={addImpression}
        selectRecommItem={selectRecommItem}
        variant={variant}
      />
    </Box>
  )
}

export default withErrorBoundaryWrapper(VisuallySimilarLazyContainer)
