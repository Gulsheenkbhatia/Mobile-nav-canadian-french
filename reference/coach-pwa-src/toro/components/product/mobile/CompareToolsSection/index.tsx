import React, { FC } from 'react'
import ProductCompareTool from 'toro/lib/vendorProductsAdapter/features/ProductCompareTool'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import { useAtomValue } from 'jotai/utils'
import { productDataAtom, selectedVariantAtom, selectedVariantGroupAtom } from 'store/pdp.atom'

const CompareToolsSection: FC = () => {
  const isCompareToolEnable = useExperiment(EXPERIMENTS.COMPARISON_TOOL_EXPERIENCE)
  const isTabComparisonToolEnable = useExperiment(EXPERIMENTS.TAB_COMPARISON_TOOL_EXPERIENCE)

  const productData = useAtomValue(productDataAtom)
  const selectedVariantOrVG = useAtomValue(selectedVariantAtom)
  const selectedVariantGroup = useAtomValue(selectedVariantGroupAtom)

  const productDetailsProps = {
    productData,
    selectedVariantOrVG,
    selectedVariantGroup,
  }

  if (!isCompareToolEnable && !isTabComparisonToolEnable) {
    return null
  }

  return <ProductCompareTool type="product5_rr" productDetailsProps={productDetailsProps} />
}

export default CompareToolsSection
