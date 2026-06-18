import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import ProductVariationLabel from 'toro/components/product/ProductVariationControls/ProductVariationLabel'
import AlignedControlsContainer from 'toro/components/product/ProductVariationControls/AlignedControlsContainer'
import ProductMaterialControl from 'toro/components/product/ProductVariationControls/ProductMaterialControl'
import { useTheme } from '@emotion/react'
import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
function ProductMaterialControls({
  selectedMaterial,
  setSelectedMaterial,
  isSticky,
  materialList,
  setFullscreenLoading,
  megaPdpAttrDisplayName,
  selectedColor,
  productId,
}) {
  const materials = useMemo(
    () =>
      materialList?.map?.((item, idx) => (
        <ProductMaterialControl
          item={item}
          idx={idx}
          key={idx}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          selectedColor={selectedColor}
          setFullscreenLoading={setFullscreenLoading}
          productId={productId}
        />
      )),
    [materialList, selectedColor, selectedMaterial]
  )

  return (
    <Box className="mega-pdp-materials">
      <Box data-testid="isNotSticky-product">
        <ProductVariationLabel
          label={megaPdpAttrDisplayName}
          value={selectedMaterial?.materialName}
          variantType={megaPdpAttrDisplayName}
        />
      </Box>
      <AlignedControlsContainer
        itemsMargin={useTheme()?.space?.s}
        maxItemsInRow={4}
        label={'Material'}
        isSticky={isSticky}
      >
        {materials}
      </AlignedControlsContainer>
    </Box>
  )
}

ProductMaterialControls.propTypes = {
  selectedMaterial: PropTypes.object,
  setSelectedMaterial: PropTypes.func,
  isSticky: PropTypes.bool,
  materialList: PropTypes.array,
  setFullscreenLoading: PropTypes.func,
  megaPdpAttrDisplayName: PropTypes.string,
  selectedColor: PropTypes.object,
  productId: PropTypes.string,
}

export default memo(withErrorBoundaryWrapper(ProductMaterialControls))
