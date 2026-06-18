import { useAtomValue } from 'jotai/utils'

import Box from 'toro/components/Box'
import Button from 'toro/components/Button'

import { wishlistIdsAtom } from 'store/wishlist.atom'

import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useSaveForLaterComputed } from 'toro/components/SaveForLater/useSaveForLaterComputed'
import { useSaveForLaterHandlers } from 'toro/components/SaveForLater/useSaveForLaterHandlers'
import useProductData from 'toro/hooks/useProductData'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import Icon from 'toro/icons/heart.svg'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useCallback } from 'react'
import useAnalytics from 'toro/analytics/useAnalytics'
import { gaProductDataAtom, isMegaPDPEligibleAtom } from 'store/pdp.atom'

function Wishlist() {
  const styles = useMultiStyleConfig('Wishlist')
  const analytics = useAnalytics()
  const wishlistIds = useAtomValue(wishlistIdsAtom)
  const gaProductData = useAtomValue(gaProductDataAtom)
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const [name, variationAttributes, pickedProps, category_id] = useProductData([
    'name',
    'variationAttributes',
    'pickedProps',
    'category_id',
  ])
  const selectedColor = useSelectedColorData('id')
  const [variantId, isCustomized, isMonogrammed, variant, variants, masterId] =
    useSelectedVariantData([
      'id',
      'isCustomized',
      'isMonogrammed',
      'variant',
      'variants',
      'masterId',
    ])

  const productData = {
    name,
    variationAttributes,
    variant,
    variants,
    masterId,
    pickedProps,
    category_id,
  }

  const selectedVariant = {
    productId: variantId,
    baseProductId: variantId,
    isCustomized,
    isMonogrammed,
    variant,
    variants,
    masterId,
  }

  const {
    wishlistId,
    isInWishlist,
    wishlistFallbackId,
    selectedVariantComputed: { isCustomizedOrMonogrammed, customizationAction },
  } = useSaveForLaterComputed({
    productData,
    selectedVariant,
    wishlistIds,
  })

  const { handleAddToWishlist, handleRemoveFromWishlist } = useSaveForLaterHandlers()

  const triggerEvent = useCallback(
    (eventName: string) => {
      analytics.send(eventName, {
        eventLocation: isMegaPDPEligible ? 'mega product' : 'product',
        ...gaProductData,
      })
    },
    [analytics, gaProductData, isMegaPDPEligible]
  )

  async function handleClick(e) {
    e.stopPropagation()
    e.preventDefault()
    if (isInWishlist) {
      await handleRemoveFromWishlist({
        name,
        wishlistId,
        wishlistIds,
        // @ts-expect-error TODO: it expectes the whole productData but uses just a few properties
        productData,
        selectedVariant,
        wishlistFallbackId,
        customizationAction,
        isCustomizedOrMonogrammed,
      })
      triggerEvent('removeFromWishlist')
    } else {
      await handleAddToWishlist({
        name,
        wishlistId,
        wishlistIds,
        // @ts-expect-error TODO: it expectes the whole productData but uses just a few properties
        productData,
        selectedColor,
        selectedVariant: { productId: variantId, baseProductId: variantId },
        wishlistFallbackId,
        customizationAction,
        isCustomizedOrMonogrammed,
      })
      triggerEvent('addToWishlist')
    }
  }

  return (
    <Box data-qa="qv_btn_wshlst">
      <Button
        aria-label="wishlist"
        variant="icon-only-w-focus"
        size="content"
        onClick={handleClick}
        sx={styles.button}
      >
        <Box
          data-qa={isInWishlist ? 'selected-wishlist' : 'unselected-wishlist'}
          sx={isInWishlist ? styles.fillIcon : styles.icon}
        >
          <Icon />
        </Box>
        Save
      </Button>
    </Box>
  )
}

export default withErrorBoundaryWrapper(Wishlist)
