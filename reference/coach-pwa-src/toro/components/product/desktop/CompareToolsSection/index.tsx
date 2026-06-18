import { FC } from 'react'
import ProductCompareToolAgnosticDesktop from 'toro/lib/vendorProductsAdapter/features/ProductCompareTool/ProductCompareToolAgnosticDesktop'
import useCompareToolRecommendations from './useCompareToolRecommendations'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

const CompareToolsSection: FC = () => {
  const compareToolProps = useCompareToolRecommendations()

  if (!compareToolProps) {
    return null
  }

  return <ProductCompareToolAgnosticDesktop {...compareToolProps} />
}

export default withErrorBoundaryWrapper(CompareToolsSection)
