export function checkIsInWishlist({
  wishlistId,
  wishlistIds,
  selectedVariant,
  wishlistFallbackId,
}): boolean {
  if (selectedVariant) {
    return wishlistIds?.includes(wishlistId) || wishlistIds?.includes(wishlistFallbackId)
  }

  return false
}
