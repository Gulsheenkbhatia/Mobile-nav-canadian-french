export function getWishlistFallbackId({
  wishlistId,
  productData,
  selectedVariant,
  hasSizes,
}): string {
  let wishlistFallbackId = wishlistId

  if (!hasSizes) {
    wishlistFallbackId = selectedVariant?.firstVariant || wishlistId

    const variants = productData?.variant || productData?.variants

    variants?.forEach((item) => {
      if (
        item.variationValues.color === (selectedVariant?.id || selectedVariant?.color) &&
        item.masterId === selectedVariant?.masterId
      ) {
        wishlistFallbackId = item.id || item.productId || item.productID
      }
    })
  }

  return wishlistFallbackId
}
