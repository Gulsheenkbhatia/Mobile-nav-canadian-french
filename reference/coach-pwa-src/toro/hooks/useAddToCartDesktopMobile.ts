import { useContext, useEffect } from 'react'
import { useAtomValue, useResetAtom, useUpdateAtom } from 'jotai/utils'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import { ATB_DRAWER_ACTIONS, useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import useViewportType from 'toro/hooks/useViewportType'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useToroEventsDispatch from 'toro/hooks/useToroEventDispatch'
import SessionContext from 'toro/components/SessionContext'
import get from 'lodash/get'
import usePreference from 'toro/hooks/usePreference_new'
import { miniCartOpenReasonAtom, MiniCartOpenReasons } from 'store/global.atom'
import useProductData from 'toro/hooks/useProductData'
import useCertonaRequest from 'toro/hooks/useCertonaRequest'
import {
  lastAddedProductToBagAtom,
  lastAddedProductToBagVariantIdAtom,
  maxQuantityErrorAtom,
  setMaxQuantityErrorAtom,
  selectedQtyAtom,
  submittableVariantIdAtom,
  selectedSizeAtom,
  isSizedProductAtom,
  orderingErrorAtom,
  addingToBagErrorAtom,
  gaProductDataAtom,
  isMegaPDPEligibleAtom,
  isStickyBarScrolledAtom,
  addToBagButtonRefAtom,
} from 'store/pdp.atom'
import { useLoadMiniCartPopover } from 'toro/components/header/MiniCart/useLoadMiniCartPopover'
import { selectedVariantInventoryAtom } from 'store/inventory.atom'
import { reminderInCartAtom } from 'store/add-to-cart-reminder.atom'
import { ORDERING_ERROR } from 'toro/helpers/productVariations'
import { useIntl } from 'react-intl'
import useAnalytics from 'toro/analytics/useAnalytics'
import {
  getAddToCartEvents,
  getNotSelectedErrorEvents,
  getQuantityNotAvailableErrorEvents,
  getAtcRequestErrorEvents,
} from 'toro/helpers/pdpGaEvents'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { useAddToCartPreviewDrawer } from 'toro/components/AddToCartPreviewDrawer/useAddToCartPreviewDrawer'

const INITIAL_MAX_ORDER_QUANTITY = 5

const sortCartItemsByQty = (cartItems: any[]) => {
  return Object.values(
    cartItems.reduce((acc, item) => {
      acc[item?.product_id] = {
        ...item,
        quantity: (acc[item?.product_id]?.quantity || 0) + item?.quantity,
      }
      return acc
    }, {})
  )
}

const SOMETHING_WENT_WRONG_ERROR = {
  id: 'pdp.somethingWentWrongMsg',
  defaultMessage: 'Something went wrong, please try again',
}

type UseAddItemToCartProps = {
  isBuyNow?: boolean
}

const useAddItemToCart = ({ isBuyNow = false }: UseAddItemToCartProps = {}) => {
  const { actions: sessionActions, session } = useContext(SessionContext)
  const dispatchToroEvent = useToroEventsDispatch()
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const setMiniCartOpenReason = useUpdateAtom(miniCartOpenReasonAtom)
  const [, setDrawerState] = useDrawerAtom()
  const { isMobile } = useViewportType()
  const setLastAddedProductToBagAtom = useUpdateAtom(lastAddedProductToBagAtom)
  const setLastAddedProductToBagVariantIdAtom = useUpdateAtom(lastAddedProductToBagVariantIdAtom)
  const loadMiniCartPopover = useLoadMiniCartPopover()
  const vInventory = useAtomValue(selectedVariantInventoryAtom)
  const selectedQty = useAtomValue(selectedQtyAtom)
  const { recommendations: isXgenExperience } = useAtomValue(xgenFeaturesAtom)
  const makeCertonaRequest = useCertonaRequest({
    pagetype: 'addtocart',
    recommendations: false,
    enabled: !isXgenExperience,
  })
  const setMaxQuantityError = useUpdateAtom(setMaxQuantityErrorAtom)
  const maxQuantityError = useAtomValue(maxQuantityErrorAtom)
  const resetVisitedPagesCount = useResetAtom(reminderInCartAtom)
  const selectedSize = useAtomValue(selectedSizeAtom)
  const isSizedProduct = useAtomValue(isSizedProductAtom)
  const setOrderingError = useUpdateAtom(orderingErrorAtom)
  const setAddingToBagError = useUpdateAtom(addingToBagErrorAtom)
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const gaProductData = useAtomValue(gaProductDataAtom)
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isStickyBarScrolled = useAtomValue(isStickyBarScrolledAtom)
  const setAtbButtonRef = useUpdateAtom(addToBagButtonRefAtom)
  const { isPostAddToCartDesktopEnabled } = useAddToCartPreviewDrawer()

  const {
    giftWrapping: { enableGiftWrappingAndMsg },
    toggleSiteFeatures: { enableMaxQtyRestriction, hideQuantityDropdown },
    cartCheckoutSettings: { defaultMaxOrderQuantity },
  } = usePreference({
    giftWrapping: ['enableGiftWrappingAndMsg'],
    ToggleSiteFeatures: ['enableMaxQtyRestriction', 'hideQuantityDropdown'],
    CartCheckoutSettings: ['defaultMaxOrderQuantity'],
  })
  const [cIsCustomized = false, cIsMonogrammed = false, cId, cLocation] = useSelectedColorData([
    'isCustomized',
    'isMonogrammed',
    'id',
    'location',
  ])
  const submittableVariantId = useAtomValue(submittableVariantIdAtom)
  const vC_maxOrderableQuantity = useSelectedVariantData('customAttributes.c_maxOrderableQuantity')
  const [pId, pDefaultColor, pdMasterProductData, pMasterId] = useProductData([
    'id',
    'defaultColor',
    'masterProductData',
    'masterId',
  ])

  useEffect(() => {
    setMaxQuantityError(false)
  }, [submittableVariantId])

  const isCustomizedProduct = cIsCustomized || cIsMonogrammed
  const isDisabled = !session?.initialized || maxQuantityError
  const isQuantitySelectorDisabled =
    hideQuantityDropdown || isCustomizedProduct || !enableMaxQtyRestriction
  const maxOrderQty = defaultMaxOrderQuantity || INITIAL_MAX_ORDER_QUANTITY

  const calculateItemsInCartObj = () => {
    const cartItems = get(session, 'cart.product_items', [])
    const cartItemsByQty = sortCartItemsByQty(cartItems)

    const cartItemByProductId: any = cartItemsByQty?.find(
      (item: any) => item?.product_id === submittableVariantId
    )
    const bagCapacityLeft = vC_maxOrderableQuantity - cartItemByProductId?.quantity
    const allowAddItemToCart = bagCapacityLeft < selectedQty

    return {
      variantId: submittableVariantId,
      cartItemsByQty,
      cartItemByProductId,
      bagCapacityLeft,
      allowAddItemToCart,
    }
  }

  const rejectAddToCartItem = ({ cartItemByProductId, variantId, bagCapacityLeft }: any) => {
    return (
      cartItemByProductId?.quantity + selectedQty > vC_maxOrderableQuantity &&
      variantId === cartItemByProductId?.product_id &&
      bagCapacityLeft >= selectedQty
    )
  }

  const checkIfGiftProductInCart = (productInCart: any) => {
    return !(enableGiftWrappingAndMsg && (productInCart?.gift || productInCart?.giftMessage))
  }

  const sendGaEvents = () => {
    const eventsPayload = getAddToCartEvents({
      gaProductData,
      submittableVariantId,
      isBuyNow,
      isMegaPDPEligible,
      isStickyBarScrolled,
    })
    eventsPayload.forEach((event) => analytics.send(...event))
  }

  const addItemToCart = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e?.currentTarget) {
      setAtbButtonRef(e.currentTarget)
    }

    if (!submittableVariantId && !isCustomizedProduct) {
      if (isSizedProduct && !selectedSize) {
        setOrderingError(ORDERING_ERROR.notSelected)
        const eventsPayload = getNotSelectedErrorEvents()
        analytics.send(...eventsPayload)
      }
      setFullscreenLoading(false)
      return
    }

    resetVisitedPagesCount()

    const restrictedMaxQty = vC_maxOrderableQuantity <= 0 ? maxOrderQty : vC_maxOrderableQuantity
    const vInventoryAts = vInventory?.ats || 0
    const maxQty = enableMaxQtyRestriction ? restrictedMaxQty : vInventoryAts

    const getAddToCartItemObj = calculateItemsInCartObj()
    const isRejectedAddToCartItem = rejectAddToCartItem(getAddToCartItemObj)

    const cartQuantity = getAddToCartItemObj.cartItemByProductId?.quantity

    if (
      isRejectedAddToCartItem ||
      (cartQuantity && selectedQty > maxQty && cartQuantity === +maxQty)
    ) {
      setMaxQuantityError(true)
      setFullscreenLoading(false)
      return
    }

    if (!cIsMonogrammed && !cIsCustomized) {
      makeCertonaRequest({
        itemid: !isXgenExperience ? submittableVariantId.replace(/\s+/g, '-') : undefined,
      })
      setLastAddedProductToBagAtom({
        id: pId,
        defaultColor: pDefaultColor,
        masterProductData: pdMasterProductData,
        masterId: pMasterId,
      })
      setLastAddedProductToBagVariantIdAtom(submittableVariantId)
    }

    dispatchToroEvent({ type: 'on-add-to-cart' })

    // Only show fullscreen loading on desktop, mobile uses drawer animation
    if (!isMobile) {
      setFullscreenLoading(true)
    }

    try {
      const productInCart: any = getAddToCartItemObj.cartItemsByQty?.find(
        (product: any) =>
          product?.product_id === submittableVariantId &&
          !product?.storeName &&
          !product?.c_customizerId &&
          !product?.c_hasEmbellishments &&
          !product?.c_customizerParentId &&
          !product?.c_monogrammedItem &&
          checkIfGiftProductInCart(product)
      )

      const availableQuantity = submittableVariantId
        ? vInventoryAts - (productInCart?.quantity || 0)
        : selectedQty
      if (availableQuantity < 1 && submittableVariantId) {
        setMaxQuantityError(true)
        if (!isMobile) {
          setFullscreenLoading(false)
        }
        return
      }

      loadMiniCartPopover()

      let quantity, isQuantityNotAvailable

      if (enableMaxQtyRestriction && Boolean(productInCart) && !isCustomizedProduct) {
        const selectedQuantity =
          (getAddToCartItemObj.allowAddItemToCart
            ? getAddToCartItemObj.cartItemByProductId?.quantity
            : productInCart?.quantity) + selectedQty
        const lowestPossibleQtyValue = Math.min(+vInventoryAts, +maxQty)
        isQuantityNotAvailable = lowestPossibleQtyValue < selectedQuantity
        if (getAddToCartItemObj.allowAddItemToCart) {
          quantity = isQuantityNotAvailable
            ? productInCart?.quantity + getAddToCartItemObj.bagCapacityLeft
            : selectedQuantity - getAddToCartItemObj.bagCapacityLeft
        } else {
          quantity = isQuantityNotAvailable ? lowestPossibleQtyValue : selectedQuantity
        }

        if (!isCustomizedProduct) {
          sendGaEvents()
          await sessionActions.updateCart({
            product: { id: submittableVariantId },
            quantity,
            itemId: productInCart?.item_id,
            productId: submittableVariantId,
          })
        }
      } else {
        isQuantityNotAvailable = availableQuantity < selectedQty
        if (enableMaxQtyRestriction && getAddToCartItemObj.allowAddItemToCart) {
          quantity = isQuantityNotAvailable
            ? productInCart?.quantity + getAddToCartItemObj.bagCapacityLeft
            : vC_maxOrderableQuantity - getAddToCartItemObj.cartItemByProductId?.quantity
        } else {
          quantity =
            isQuantityNotAvailable && availableQuantity > 0 ? availableQuantity : selectedQty
        }

        sendGaEvents()
        if (!isCustomizedProduct) {
          await sessionActions.addToCart({
            product: { id: submittableVariantId },
            quantity,
            productId: submittableVariantId,
          })
        } else {
          await sessionActions.addToCart({
            id: cId,
            location: cLocation,
          })
        }
      }

      if (isQuantityNotAvailable && availableQuantity) {
        setMaxQuantityError(true)
        const eventsPayload = getQuantityNotAvailableErrorEvents({ isBuyNow })
        analytics.send(...eventsPayload)
      }
      if (!isBuyNow && !isMobile) {
        setFullscreenLoading(false)
      }
      if (!isQuantityNotAvailable && !isBuyNow) {
        setDrawerState({
          type: ATB_DRAWER_ACTIONS.BATCH_DRAWER_STATE,
          payload: {
            drawerVisible: true,
            drawerQuantity: selectedQty,
            variantId: submittableVariantId,
          },
        })
        if (!isPostAddToCartDesktopEnabled) {
          setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
        }
      }
    } catch (e) {
      setAddingToBagError(formatMessage(SOMETHING_WENT_WRONG_ERROR))
      if (!isMobile) {
        setFullscreenLoading(false)
      }
      console.error(e)

      const eventsPayload = getAtcRequestErrorEvents({ isBuyNow })
      analytics.send(...eventsPayload)
    }
  }

  return {
    addToCart: addItemToCart,
    isQuantitySelectorDisabled,
    isDisabled,
    enableMaxQtyRestriction,
    defaultMaxOrderQuantity,
    maxQty: vC_maxOrderableQuantity,
  }
}

export default useAddItemToCart
