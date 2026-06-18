import { useMemo } from 'react'
import {
  SelectedVariantComputed,
  checkOnSize,
  getWishlistId,
  checkIsInWishlist,
  getWishlistFallbackId,
  getComputeSelectedVariantData,
} from 'toro/components/SaveForLater/helpers'

type UseSaveForLaterComputed = {
  hasSizes: boolean
  wishlistId: string
  isInWishlist: boolean
  wishlistFallbackId: string
  selectedVariantComputed: SelectedVariantComputed
}
export function useSaveForLaterComputed({
  wishlistIds,
  productData,
  selectedVariant,
}): UseSaveForLaterComputed {
  const selectedVariantComputed = useMemo(
    () => getComputeSelectedVariantData({ selectedVariant }),
    [selectedVariant]
  )

  const wishlistId = useMemo(() => getWishlistId({ selectedVariant }), [selectedVariant])

  const hasSizes = useMemo(
    () => checkOnSize({ productData, selectedVariant }),
    [productData, selectedVariant]
  )

  const wishlistFallbackId = useMemo(
    () => getWishlistFallbackId({ productData, wishlistId, hasSizes, selectedVariant }),
    [productData, wishlistId, hasSizes, selectedVariant]
  )

  const isInWishlist = useMemo(
    () => checkIsInWishlist({ wishlistId, selectedVariant, wishlistIds, wishlistFallbackId }),
    [wishlistId, selectedVariant, wishlistIds, wishlistFallbackId]
  )

  return {
    hasSizes,
    wishlistId,
    isInWishlist,
    wishlistFallbackId,
    selectedVariantComputed,
  }
}
