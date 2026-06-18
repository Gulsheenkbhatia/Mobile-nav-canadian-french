import { API_WISHLIST_ADD } from 'toro/constants/Urls'
import withCorrId from 'helpers/traceability'

export async function addToSfccWishlist({
  wishlistId,
  selectedVariant,
  wishlistFallbackId,
  isCustomizedOrMonogrammed,
}) {
  const fetchWithCorrId = withCorrId()
  const response = await fetchWithCorrId(API_WISHLIST_ADD, {
    method: 'POST',
    body: createPayload({
      wishlistId,
      selectedVariant,
      wishlistFallbackId,
      isCustomizedOrMonogrammed,
    }),
  })

  const result = await response.json()

  if (response.ok) {
    if (result.success) {
      return result
    } else {
      throw new Error('Could not add item to wishlist.')
    }
  } else {
    throw new Error(result?.error)
  }
}

function createPayload({
  wishlistId,
  selectedVariant,
  wishlistFallbackId,
  isCustomizedOrMonogrammed,
}) {
  return JSON.stringify(
    isCustomizedOrMonogrammed
      ? { recipe: selectedVariant?.productId || selectedVariant?.id }
      : { pid: wishlistId, wishlistFallbackId: wishlistFallbackId }
  )
}
