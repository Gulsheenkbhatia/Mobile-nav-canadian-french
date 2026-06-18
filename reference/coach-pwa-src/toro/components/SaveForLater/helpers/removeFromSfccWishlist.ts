import { stringifyQueryParams as stringify } from 'toro/helpers/url'
import { API_WISHLIST_REMOVE } from 'toro/constants/Urls'
import { getFormattedPid } from 'toro/components/SaveForLater/helpers/getFormattedPid'
import withCorrId from 'helpers/traceability'

export async function removeFromSfccWishlist({
  name,
  wishlistId,
  selectedVariant,
  wishlistFallbackId,
  isCustomizedOrMonogrammed,
}) {
  const fetchWithCorrId = withCorrId()
  const qparams = isCustomizedOrMonogrammed
    ? stringify({ recipe: selectedVariant?.productId || selectedVariant?.id })
    : stringify({
        pid: getFormattedPid({ wishlistId, selectedVariant }),
        wishlistFallbackId: wishlistFallbackId,
        productName: name,
      })

  const response = await fetchWithCorrId(`${API_WISHLIST_REMOVE}?${qparams}`)
  const result = await response.json()

  if (response.ok) {
    if (result.success) {
      return result
    } else {
      throw new Error('Could not remove item from wishlist.')
    }
  } else {
    throw new Error(result?.error)
  }
}
