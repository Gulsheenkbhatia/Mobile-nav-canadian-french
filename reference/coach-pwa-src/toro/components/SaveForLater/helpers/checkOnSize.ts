export function checkOnSize({ productData, selectedVariant }): boolean {
  return (
    productData?.variationAttributes?.filter((item) => item.attributeID === 'size')?.length ||
    selectedVariant?.sizes?.length
  )
}
