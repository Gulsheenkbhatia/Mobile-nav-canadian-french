import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { selectedQtyAtom, selectedVariantAtom } from 'store/pdp.atom'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import { useCallback, useContext } from 'react'
import SessionContext from 'toro/components/SessionContext'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import useViewportType from 'toro/hooks/useViewportType'
import { miniCartOpenReasonAtom, MiniCartOpenReasons } from 'store/global.atom'
import PWAContext from 'components/common/PWAContext'
import { ATB_DRAWER_ACTIONS, useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import { addOrUpdatePickupItem } from 'toro/helpers/addOrUpdatePickupItem'
import { useAddToCartPreviewDrawer } from 'toro/components/AddToCartPreviewDrawer/useAddToCartPreviewDrawer'

export function usePickUpInStoreClick() {
  const selectedQty = useAtomValue(selectedQtyAtom)
  const { appData } = useContext(PWAContext)
  const isAddToCartDrawerEnabled = get(appData, 'isAddToCartDrawerEnabled', false)
  const { session, actions: sessionActions } = useContext(SessionContext)
  const { isMobile, isTablet } = useViewportType()
  const {
    toggleSiteFeatures: { maxQtyRestrictionEnabled = false },
    cartCheckoutSettings: { defaultMaxOrderQuantity: maxOrderQty = 5 },
  } = usePreference({
    ToggleSiteFeatures: ['enableMaxQtyRestriction'],
    CartCheckoutSettings: ['defaultMaxOrderQuantity'],
  })
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const setMiniCartOpenReason = useUpdateAtom(miniCartOpenReasonAtom)
  const [, setDrawerState] = useDrawerAtom()
  const selectedVariantData = useAtomValue(selectedVariantAtom)
  const [selectedVariantId, productMaxOrderableQty = 0] = useSelectedVariantData([
    'id',
    'customAttributes.c_maxOrderableQuantity',
  ])
  const { isPostAddToCartDesktopEnabled } = useAddToCartPreviewDrawer()

  const cartItems = get(session, 'cart.product_items', [])

  const cartQuantity = cartItems && cartItems.find((item) => item?.product_name === name)?.quantity

  const calculateItemsInCartObj = (selectedQty) => {
    const currentCartItems = get(session, 'cart.product_items', [])

    const variantID = selectedVariantId

    const sortCartItemByQnt = currentCartItems.reduce(
      (m, { product_id, quantity }) => m?.set(product_id, (m?.get(product_id) || 0) + quantity),
      new Map()
    )

    const filterCartItem = Array.from(sortCartItemByQnt, ([product_id, quantity]) => ({
      product_id,
      quantity,
    }))

    const filterCartItemByProductId = filterCartItem?.find((item) => item?.product_id === variantID)
    const bagCapacityLeft = productMaxOrderableQty - filterCartItemByProductId?.quantity
    let allowAddItemToCart = bagCapacityLeft < selectedQty

    return {
      currentCartItems,
      variantID,
      sortCartItemByQnt,
      filterCartItem,
      filterCartItemByProductId,
      bagCapacityLeft,
      allowAddItemToCart,
    }
  }

  const rejectAddToCartItem = (obj, selectedQty, productMaxOrderableQty) => {
    if (
      obj?.filterCartItemByProductId?.quantity + selectedQty > productMaxOrderableQty &&
      obj?.variantID === obj?.filterCartItemByProductId?.product_id &&
      obj?.bagCapacityLeft >= selectedQty
    ) {
      return true
    }
  }

  const showAddToCartDrawer = useCallback(
    (quantity, partialAdded, isAddToCartDrawerDisableCallback) => {
      if (!isAddToCartDrawerEnabled) {
        isAddToCartDrawerDisableCallback?.()
        return
      }

      const variantId = selectedVariantId

      if (quantity) {
        setDrawerState({
          type: ATB_DRAWER_ACTIONS.BATCH_DRAWER_STATE,
          payload: {
            drawerQuantity: quantity,
            isPartialAdded: !!partialAdded,
            drawerErrorMsgFlag: false,
            variantId: variantId,
          },
        })
      } else {
        setDrawerState({
          type: ATB_DRAWER_ACTIONS.BATCH_DRAWER_STATE,
          payload: {
            isPartialAdded: false,
            drawerErrorMsgFlag: true,
            variantId: variantId,
          },
        })
      }
      setDrawerState({
        type: ATB_DRAWER_ACTIONS.SET_VISIBLE,
        payload: {
          drawerVisible: true,
          variantId: variantId,
        },
      })
    },
    [isAddToCartDrawerEnabled, selectedVariantId]
  )

  return useCallback(
    async (storeId) => {
      const maxQty =
        maxQtyRestrictionEnabled &&
        (productMaxOrderableQty <= 0 ? maxOrderQty : productMaxOrderableQty)

      const pickUpInStoreItemObj = calculateItemsInCartObj(selectedQty)
      const isRejectedPickUpAtStore = rejectAddToCartItem(
        pickUpInStoreItemObj,
        selectedQty,
        productMaxOrderableQty
      )

      if (isRejectedPickUpAtStore) {
        setFullscreenLoading(false)
        return
      }

      if (cartQuantity && maxQty && cartQuantity === +maxQty) {
        setFullscreenLoading(false)
        return
      }
      let quantity
      if (pickUpInStoreItemObj?.allowAddItemToCart) {
        quantity = pickUpInStoreItemObj?.bagCapacityLeft
      } else {
        quantity = selectedQty
      }
      try {
        setFullscreenLoading(true)
        await addOrUpdatePickupItem({
          session,
          sessionActions,
          product: selectedVariantData,
          productId: selectedVariantId,
          storeId,
          quantity,
        })

        if (isMobile || isTablet) {
          showAddToCartDrawer(selectedQty, false, () =>
            setMiniCartOpenReason(MiniCartOpenReasons.PickUpInStore)
          )
        } else if (!isPostAddToCartDesktopEnabled) {
          setMiniCartOpenReason(MiniCartOpenReasons.PickUpInStore)
        }
        setFullscreenLoading(false)
      } catch (e) {
        console.error(e)
        setFullscreenLoading(false)
      }
    },
    [
      isAddToCartDrawerEnabled,
      selectedQty,
      selectedVariantId,
      productMaxOrderableQty,
      maxQtyRestrictionEnabled,
      maxOrderQty,
      sessionActions,
      setFullscreenLoading,
      setMiniCartOpenReason,
      selectedVariantData,
      isMobile,
      isTablet,
      cartQuantity,
    ]
  )
}
