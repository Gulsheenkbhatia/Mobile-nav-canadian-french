import { useCallback } from 'react'
import isString from 'lodash/isString'
import { useUpdateAtom } from 'jotai/utils'

import useAnalytics from 'toro/analytics/useAnalytics'
import useWishlistNotify from 'toro/hooks/useWishlistNotify'
import useCertonaRequest from 'toro/hooks/useCertonaRequest'
import { parseProductId } from 'toro/helpers/productVariations'
import { addToSfccWishlist } from 'toro/components/SaveForLater/helpers'
import { removeFromSfccWishlist } from 'toro/components/SaveForLater/helpers/removeFromSfccWishlist'

import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import { addToWishlistAtom, removeFromWishlistAtom } from 'store/wishlist.atom'

import type { ListingProduct, DetailedProduct } from 'toro/types/productTypes'

// TODO: this hook aiming to be declared on the parent level, especially for the PLP
export function useSaveForLaterHandlers() {
  const analytics = useAnalytics()
  const wishlistNotify = useWishlistNotify()

  const addToWishlist = useUpdateAtom(addToWishlistAtom)
  const removeFromWishlist = useUpdateAtom(removeFromWishlistAtom)
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)

  // TODO: update useCertonaRequest interface
  const makeCertonaRequest = useCertonaRequest({ enabled: true, recommendations: false })

  // TODO: create obj type
  const customizationEvent = (obj: unknown) => {
    analytics.send('customization', obj)
  }

  const customizeEvent = (action: string, label: string) => {
    analytics.send('customizeInteraction', {
      eventLocation: 'PDP',
      eventAction: action,
      eventLabel: label,
    })
  }

  function handleSfccWishlistAddError(name: string) {
    wishlistNotify.notifyAddError(name)
  }

  function handleSfccWishlistRemoveError(name: string) {
    wishlistNotify.notifyRemoveError(name)
  }

  const handleAddToWishlist = useCallback(async (wishlistHandlerProps: WishlistHandlerProps) => {
    const { wishlistFallbackId, wishlistIds, name } = wishlistHandlerProps

    if (canAddToWishlist(wishlistFallbackId, wishlistIds)) {
      try {
        setFullscreenLoading(true)

        await addToSfccWishlist(wishlistHandlerProps)

        handleSfccWishlistAddSuccess(wishlistHandlerProps)
      } catch (e) {
        handleSfccWishlistAddError(name)
      } finally {
        setFullscreenLoading(false)
      }
    } else {
      handleSfccWishlistAddError(name)
    }
  }, [])

  const handleRemoveFromWishlist = useCallback(
    async (wishlistHandlerProps: WishlistHandlerProps) => {
      const { wishlistFallbackId, wishlistIds, name } = wishlistHandlerProps

      if (canRemoveFromWishlist(wishlistFallbackId, wishlistIds)) {
        try {
          setFullscreenLoading(true)

          await removeFromSfccWishlist(wishlistHandlerProps)

          handleSfccWishlistRemoveSuccess(wishlistHandlerProps)
        } catch (e) {
          handleSfccWishlistRemoveError(name)
        } finally {
          setFullscreenLoading(false)
        }
      } else {
        handleSfccWishlistRemoveError(name)
      }
    },
    []
  )

  function handleSfccWishlistRemoveSuccess(wishlistHandlerProps: WishlistHandlerProps) {
    const {
      name,
      wishlistId,
      selectedVariant,
      wishlistFallbackId,
      customizationAction,
      isCustomizedOrMonogrammed,
    } = wishlistHandlerProps

    makeCertonaRequest({
      pagetype: 'wishlistremove',
      itemid: wishlistId,
    })

    removeFromWishlist(wishlistFallbackId)

    wishlistNotify.notifyRemoveSuccess(name, async () => {
      // The undo callback to add the product back to the wishlist
      await handleAddToWishlist(wishlistHandlerProps)
    })

    if (isCustomizedOrMonogrammed) {
      customizeEvent(customizationAction, `remove_from_wishlist: ${selectedVariant?.baseProductId}`)
    }
  }

  function handleSfccWishlistAddSuccess({
    name,
    wishlistId,
    productData,
    selectedColor,
    selectedVariant,
    wishlistFallbackId,
    customizationAction,
    isCustomizedOrMonogrammed,
  }) {
    makeCertonaRequest({
      pagetype: 'addtowishlist',
      itemid: wishlistId,
    })

    addToWishlist(wishlistFallbackId)
    wishlistNotify.notifyAddSuccess(name)

    if (isCustomizedOrMonogrammed) {
      customizeEvent(customizationAction, `add_to_wishlist : ${selectedVariant?.baseProductId}`)
    }

    if (selectedVariant?.isMonogrammed) {
      customizationEvent({
        eventLocation: 'monogram-later',
        eventAction: 'monogram', //event_action
        eventLabel: 'add_to_wishlist', // event_label
        customization_step: 'complete', //customization_step
        customized_recipe_id: selectedColor?.id, // customized_recipe_id
        customized_item_parent_id: parseProductId(selectedColor?.baseProductId)?.masterId, // customized_item_parent_id
        customized_item_category:
          productData?.pickedProps?.promotionData?.item_category || productData?.category_id, //customized_item_category
        custom_color: parseProductId(selectedColor?.baseProductId)?.colorId, //custom_color
        embellish_type: selectedColor?.embellishment?.embellish_type, // embellish_type
        embellish_pattern: selectedColor?.embellishment?.embellish_pattern, // embellish_pattern
        monogram_placement: selectedColor?.monogram?.monogramPlacementCode, // monogram_placement
        monogram_details: selectedColor?.monogram?.monogramInitials, // monogram_details
      })
    }
  }

  return {
    handleAddToWishlist,
    handleRemoveFromWishlist,
  }
}

function isDefined(id: string | unknown): boolean {
  return isString(id) && id?.length > 0
}

function canAddToWishlist(id: string | unknown, wishlistIds: string[]) {
  return isDefined(id) && !wishlistIds.includes(id as string)
}

function canRemoveFromWishlist(id: string | unknown, wishlistIds: string[]) {
  return isDefined(id) && wishlistIds.includes(id as string)
}

type WishlistHandlerProps = {
  name: string
  wishlistId: string
  wishlistIds: string[]
  productData: ListingProduct | DetailedProduct
  selectedColor: string
  selectedVariant: { baseProductId: string; productId: string } & unknown // TODO: add a type both for PLP and PDP
  wishlistFallbackId: string
  customizationAction: string
  isCustomizedOrMonogrammed: boolean
}
