export function getWishlistId({ selectedVariant }): string {
  return (
    selectedVariant?.variationId ||
    selectedVariant?.productId ||
    selectedVariant?.id ||
    selectedVariant?.productID ||
    selectedVariant?.firstVariant
  )
}
