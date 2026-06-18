import ProductSizeControls from 'toro/components/product/ProductVariationControls/ProductSizeControls'
import Box from 'toro/components/Box'

function ProductTypesControls({
  masterId,
  attrName,
  associatedValues,
  isSticky,
  variantDataList = [],
  ...props
}) {
  const heightControlProps = {
    masterId,
    label: attrName,
    items: associatedValues,
    variantDataList: variantDataList,
  }
  return (
    <Box>
      {!isSticky && (
        <ProductSizeControls
          {...props}
          {...heightControlProps}
          isVariationTypeControls
          variantType={heightControlProps?.label}
        />
      )}
    </Box>
  )
}

export default ProductTypesControls
