import { useContext, useRef, useState, useEffect } from 'react'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import { useAtom } from 'jotai'
import get from 'lodash/get'
import { useIntl } from 'react-intl'
import SessionContext from 'toro/components/SessionContext'
import PWAContext from 'components/common/PWAContext'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import {
  miniCartOpenReasonAtom,
  MiniCartOpenReasons,
  productsWithMaxSizeATBAtom,
  productsWithDisabledATBAtom,
  sizeDrawerMobileAtom,
  closeProductDrawerAtom,
  isProductDrawerOpenAtom,
} from 'store/global.atom'
import { ATB_DRAWER_ACTIONS, useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import { fetchFullProductsDataFromClient } from 'toro/helpers/fetchProductDataFromClient'
import { getProductFromCart } from 'toro/helpers/session'
import usePreference from 'toro/hooks/usePreference_new'
import { isItemMaxQuantityReached } from 'toro/helpers/isItemMaxQuantityReached'
import useViewportType from 'toro/hooks/useViewportType'
import useWithLoading from 'toro/hooks/useWithLoading'
import useToast from 'toro/hooks/useToast'
import { fetchColorSizes } from 'toro/helpers/plp'
import { addToBagSizesAtom, sizeDrawerVgIdAtom, sizeDrawerAnalyticsDataAtom } from 'store/plp.atom'
import { lastAddedProductToBagVariantIdAtom } from 'store/pdp.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import { sendStaffStartTrackReq } from 'toro/helpers/staffStartHelper'
import { isStaffStartScriptAtom } from 'store/scripts.atom'
import { recAITypes } from 'toro/analytics/useRecommAnalytics'
import { ACCESSORIZE_IT_BUNDLE_ID } from 'toro/components/product/AccessorizeIt/AccessorizeItTabs'
import { NormalizedAccessorizeItProduct } from 'toro/types/productTypes'
import { RecommendationVendors } from 'toro/lib/vendorProductsAdapter/recommendations/configurations'
import { useAddToCartPreviewDrawer } from 'toro/components/AddToCartPreviewDrawer/useAddToCartPreviewDrawer'

export interface AnalyticsData {
  eventLocation?: string
  recAIType?: keyof typeof recAITypes
  experienceId?: string
  containerLabel?: string
  sendSelectItemFirst?: boolean
  index?: string
}

export interface UseAddToCartProps {
  variantId?: string
  variantGroupId?: string
  onAddToCartError?: () => void
  onAddToCartSuccess?: (productData: Record<string, any>) => void
  showToastAlways?: boolean
  setSizeDrawerDesktop?: (boolean) => void
  isCMS?: boolean
  tileContainer?: HTMLElement | null
  targetRefSizeDrawer?: any
  isSizedProduct?: boolean
  analyticsData?: AnalyticsData
  isAccessorizeItBundleProduct?: boolean
  isStandaloneAccessory?: boolean
  accessorizeItSelectedProduct?: NormalizedAccessorizeItProduct | null
  onSizedProductClick?: () => void
  isSizeAlreadySelected?: boolean
}

interface ValidateProductAvailabilityResult {
  isError: boolean
  errorMessage: string
  isMaxQuantityReached: boolean
  isInventoryError: boolean
  isProductInCart: boolean
  productQuantityInCart: number
  productFromCartItemId: string
}

// Fallback messages if there are no translations
const OUT_OF_STOCK_RESTRICTION_TEXT =
  'This item cannot be added to cart. Please visit the product page for more details.'
const MAX_QUANTITY_RESTRICTION_TEXT = 'You have reached the maximum purchase limit for this item.'
const PRODUCT_NOT_SELECTED_TEXT = 'Please select a product'

type AddToCartFunctionType = () => Promise<void>

const useAddToCart = ({
  variantId,
  variantGroupId,
  onAddToCartError,
  onAddToCartSuccess,
  showToastAlways,
  isSizedProduct = false,
  analyticsData,
  isAccessorizeItBundleProduct = false,
  isSizeAlreadySelected = false,
  isStandaloneAccessory = false,
  accessorizeItSelectedProduct = null,
  onSizedProductClick,
}: UseAddToCartProps) => {
  const sessionData = useContext(SessionContext)
  const { appData } = useContext(PWAContext)
  const fullProductData = useRef<Record<string, any> | null>(null)
  const selectedVariantId = useRef(variantId)
  const selectedVariantGroupId = useRef(variantGroupId)
  const { defaultLocale, locale } = appData
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const setMiniCartOpenReason = useUpdateAtom(miniCartOpenReasonAtom)
  const [productsWithDisabledATB, setProductsWithDisabledATB] = useAtom(productsWithDisabledATBAtom)
  const [productsWithMaxSizeATB, setproductsWithMaxSizeATB] = useAtom(productsWithMaxSizeATBAtom)
  const [, setDrawerState] = useDrawerAtom()
  const { formatMessage } = useIntl()
  const { isDesktop, isMobile } = useViewportType()
  const setAddToBagSizes = useUpdateAtom(addToBagSizesAtom)
  const setSizeDrawerVgId = useUpdateAtom(sizeDrawerVgIdAtom)
  const setSizeDrawerAnalyticsData = useUpdateAtom(sizeDrawerAnalyticsDataAtom)
  const setSizeDrawerMobile = useUpdateAtom(sizeDrawerMobileAtom)
  const setLastAddedProductToBagVariantId = useUpdateAtom(lastAddedProductToBagVariantIdAtom)
  const isProductDrawerOpen = useAtomValue(isProductDrawerOpenAtom)
  const closeProductDrawer = useUpdateAtom(closeProductDrawerAtom)
  const [showSizesSelectionDesktop, setShowSizesSelectionDesktop] = useState(false)
  const analytics = useAnalytics()
  const { isPostAddToCartDesktopEnabled } = useAddToCartPreviewDrawer()

  const isAccessorizeItProduct = isAccessorizeItBundleProduct || isStandaloneAccessory
  const eventAction = isAccessorizeItProduct
    ? isStandaloneAccessory
      ? 'accessorize it atb click'
      : 'accessorize it bundle atb click'
    : 'quick add to bag'

  const eventLocation = isAccessorizeItProduct
    ? 'product'
    : isSizedProduct
    ? 'quick add to cart drawer'
    : 'quick add to cart'

  const staffStartScriptLoaded = useAtomValue(isStaffStartScriptAtom)
  const accessorySku = get(accessorizeItSelectedProduct, 'buyableVariantId', '')
  const {
    staffStartPreferences: { merchantId },
  } = usePreference({
    staffStartPreferences: ['merchantId'],
  })

  const toast = useToast({
    position: isMobile ? 'bottom' : 'top-right',
    variant: isMobile ? 'plpv3' : undefined,
  })

  const onCloseSizeDrawer = () => {
    setShowSizesSelectionDesktop(false)
  }

  const {
    toggleSiteFeatures: { enableMaxQtyRestriction: maxQtyRestrictionEnabled = false },
    cartCheckoutSettings: { defaultMaxOrderQuantity: maxOrderQty = 5 },
  } = usePreference({
    ToggleSiteFeatures: ['enableMaxQtyRestriction'],
    CartCheckoutSettings: ['defaultMaxOrderQuantity'],
  })

  const [isMaxQuantityReachedItem, setIsMaxQuantityReachedItem] = useState(false)
  const [{ isError, errorMessage }, setErrorState] = useState<{
    isError: boolean
    errorMessage: string
  }>({ isError: false, errorMessage: '' })

  useEffect(() => {
    // clear local state when productId changes
    fullProductData.current = null
    setIsMaxQuantityReachedItem(false)
    setErrorState({ isError: false, errorMessage: '' })
    selectedVariantId.current = variantId
  }, [variantId])

  useEffect(() => {
    selectedVariantGroupId.current = variantGroupId
  }, [variantGroupId])

  const validateProductAvailability = (product, variantId): ValidateProductAvailabilityResult => {
    const productFromCart = getProductFromCart(variantId, sessionData?.session)
    const productInventory = get(product, 'inventory.ats', 0) as number
    const productQuantityInCart = get(productFromCart, 'quantity', 0)
    const isAvailableQuantityError = productFromCart
      ? productInventory - productQuantityInCart < 1
      : false

    let result: ValidateProductAvailabilityResult = {
      isError: false,
      isMaxQuantityReached: false,
      isInventoryError: false,
      isProductInCart: !!productFromCart,
      productQuantityInCart,
      errorMessage: '',
      productFromCartItemId: get(productFromCart, 'item_id'),
    }

    const isMaxQuantityReached = productFromCart
      ? isItemMaxQuantityReached({
          product,
          cartSession: sessionData?.session,
          maxQtyRestrictionEnabled,
          maxQuantity: maxOrderQty,
        })
      : false

    if (
      (isAccessorizeItBundleProduct && (!variantId || !accessorySku)) ||
      (isStandaloneAccessory && !product && !variantId)
    ) {
      result = {
        ...result,
        isError: true,
        errorMessage: formatMessage({
          id: 'home.product.selectProduct.text',
          defaultMessage: PRODUCT_NOT_SELECTED_TEXT,
        }),
      }
    } else if (productInventory === 0 || isAvailableQuantityError) {
      result = {
        ...result,
        isError: true,
        errorMessage: formatMessage({
          id: 'home.product.oosToastMessage',
          defaultMessage: OUT_OF_STOCK_RESTRICTION_TEXT,
        }),
        isInventoryError: true,
      }
    } else if (isMaxQuantityReached) {
      result = {
        ...result,
        isError: true,
        errorMessage: formatMessage({
          id: 'home.product.maxQuantityRestriction.text',
          defaultMessage: MAX_QUANTITY_RESTRICTION_TEXT,
        }),
        isMaxQuantityReached: true,
      }
    }

    if (result?.isError) {
      if (isDesktop && isMaxQuantityReached && !isSizedProduct) {
        setproductsWithMaxSizeATB([...productsWithMaxSizeATB, variantId])
        setIsMaxQuantityReachedItem(true)
      }
      if (
        isMobile ||
        isAccessorizeItProduct ||
        showToastAlways ||
        isSizedProduct ||
        isPostAddToCartDesktopEnabled
      ) {
        toast({
          status: 'error',
          description: result.errorMessage,
        })
      }
      setErrorState({
        isError: true,
        errorMessage: result.errorMessage,
      })
      if (!isSizedProduct) {
        setProductsWithDisabledATB([...productsWithDisabledATB, variantId])
      }

      analytics.send('siteError', {
        eventAction,
        eventLocation,
        eventLabel: result.errorMessage,
      })

      return result
    }

    return result
  }

  const handleAddToCartError = (error: Error) => {
    setProductsWithDisabledATB([...productsWithDisabledATB, variantId])
    setErrorState({
      isError: true,
      errorMessage: error.message,
    })
    const description = formatMessage({
      id: 'home.product.oosToastMessage',
      defaultMessage: OUT_OF_STOCK_RESTRICTION_TEXT,
    })
    if (isMobile || isAccessorizeItProduct || showToastAlways || isPostAddToCartDesktopEnabled) {
      toast({
        status: 'error',
        description,
      })
    }
    onAddToCartError?.()
    if (isAccessorizeItProduct) {
      analytics.send('siteError', {
        eventAction,
        eventLocation,
        eventLabel: description,
      })
    }
  }

  const handleAccessoryCartOperation = async (
    accessorySku: string,
    isAccessoryProductInCart: boolean,
    productQuantityInCartAccessory: number,
    productFromCartItemIdAccessory: string
  ) => {
    if (isAccessoryProductInCart) {
      await sessionData.actions.updateCart({
        product: { id: accessorySku },
        productId: accessorySku,
        quantity: productQuantityInCartAccessory + 1,
        itemId: productFromCartItemIdAccessory,
        ...(isAccessorizeItProduct ? { accessorizeItBundleId: ACCESSORIZE_IT_BUNDLE_ID } : {}),
      })
    } else {
      await sessionData.actions.addToCart({
        product: { id: accessorySku },
        productId: accessorySku,
        quantity: 1,
        ...(isAccessorizeItProduct ? { accessorizeItBundleId: ACCESSORIZE_IT_BUNDLE_ID } : {}),
      })
    }
  }

  const addToCartVariant = async (variantId: string) => {
    try {
      // make sure that drawer is closed
      setDrawerState({
        type: ATB_DRAWER_ACTIONS.SET_VISIBLE,
        payload: {
          drawerVisible: false,
        },
      })

      // fetch product data if it's not already fetched
      if (fullProductData.current?.id !== variantId) {
        const productData = await fetchFullProductsDataFromClient([variantId], {
          includeInventory: true,
          withMaster: false,
          locale: locale || defaultLocale,
        })
        fullProductData.current = productData[0]
      }

      if (
        !isAccessorizeItProduct &&
        !analyticsData?.sendSelectItemFirst &&
        analyticsData?.recAIType
      ) {
        analytics.send('selectItem', {
          product: {
            ...fullProductData.current,
            extendAnalyticsData: {
              item_list_name: analyticsData?.containerLabel,
              scheme_exp_id: analyticsData?.experienceId,
              is_quick_add: isDisabled ? '0' : '1',
              rec_type: recAITypes[analyticsData.recAIType],
              index: analyticsData?.index,
            },
          },
          eventLocation: analyticsData?.eventLocation || eventLocation,
        })
      }

      const { isError, isProductInCart, productQuantityInCart, productFromCartItemId } =
        validateProductAvailability(fullProductData.current, variantId)

      const shouldValidateAccessory = isAccessorizeItBundleProduct && accessorySku && !isError

      const {
        isError: isAccessoryError,
        isProductInCart: isAccessoryProductInCart,
        productQuantityInCart: productQuantityInCartAccessory,
        productFromCartItemId: productFromCartItemIdAccessory,
      } = shouldValidateAccessory
        ? validateProductAvailability(accessorizeItSelectedProduct, accessorySku)
        : {
            isError: false,
            isProductInCart: false,
            productQuantityInCart: 0,
            productFromCartItemId: '',
          }

      if (isError || (isAccessorizeItBundleProduct && isAccessoryError)) {
        return
      }

      if (isProductInCart) {
        // Get accessory item ID if accessory exists in cart
        if (accessorySku) {
          await handleAccessoryCartOperation(
            accessorySku,
            isAccessoryProductInCart,
            productQuantityInCartAccessory,
            productFromCartItemIdAccessory
          )
        }

        await sessionData.actions.updateCart({
          product: { id: variantId },
          productId: variantId,
          quantity: productQuantityInCart + 1,
          itemId: productFromCartItemId,
          ...(isAccessorizeItProduct ? { accessorizeItBundleId: ACCESSORIZE_IT_BUNDLE_ID } : {}),
        })
      } else {
        if (accessorySku) {
          await handleAccessoryCartOperation(
            accessorySku,
            isAccessoryProductInCart,
            productQuantityInCartAccessory,
            productFromCartItemIdAccessory
          )
        }
        await sessionData.actions.addToCart({
          product: { id: variantId },
          productId: variantId,
          quantity: 1,
          ...(isAccessorizeItProduct ? { accessorizeItBundleId: ACCESSORIZE_IT_BUNDLE_ID } : {}),
        })
      }

      if (staffStartScriptLoaded) {
        sendStaffStartTrackReq({ merchantId, selectedQty: 1, productId: variantId })
      }

      const accessorizedProductFields = isAccessorizeItProduct
        ? {
            isProductTypeBundle: true,
            bundleId: ACCESSORIZE_IT_BUNDLE_ID,
          }
        : {}

      if (isAccessorizeItBundleProduct) {
        const accessoryProduct = accessorizeItSelectedProduct?.productDataForGA || {}
        analytics.send('addToCart', {
          product: {
            isBundleProductItems: true,
            bundleData: [
              {
                ...fullProductData.current,
                is_quick_add: !isDisabled ? '1' : '0',
              },
              {
                ...accessoryProduct,
                is_quick_add: !isDisabled ? '1' : '0',
              },
            ],
          },
          eventLocation,
          ...accessorizedProductFields,
        })
      } else {
        if (
          analyticsData?.sendSelectItemFirst &&
          analyticsData?.eventLocation &&
          analyticsData?.recAIType
        ) {
          await analytics.send('selectItem', {
            product: {
              ...fullProductData.current,
              extendAnalyticsData: {
                item_list_name: analyticsData?.containerLabel,
                scheme_exp_id: analyticsData?.experienceId,
                is_quick_add: isDisabled ? '0' : '1',
                rec_type: recAITypes[analyticsData.recAIType],
                index: analyticsData?.index,
              },
            },
            itemListName: analyticsData?.containerLabel,
            eventLocation: analyticsData?.eventLocation,
          })
        }

        analytics.send('addToCart', {
          product: {
            ...fullProductData.current,
            is_quick_add: !isDisabled ? '1' : '0',
          },
          itemListName: analyticsData?.containerLabel,
          eventLocation: analyticsData?.eventLocation || eventLocation,
          ...accessorizedProductFields,
        })
      }

      onAddToCartSuccess?.(fullProductData.current)
      // make sure that size drawer is closed before showing post atb drawer
      setSizeDrawerMobile(false)
      setDrawerState({
        type: ATB_DRAWER_ACTIONS.BATCH_DRAWER_STATE,
        payload: {
          drawerVisible: true,
          drawerQuantity: isAccessorizeItBundleProduct ? 2 : 1,
          variantId,
        },
      })
      if (!isPostAddToCartDesktopEnabled) {
        setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
      }
      setLastAddedProductToBagVariantId(variantId)

      // close product drawer if it is opened to avoid conflicts with bag drawer
      if (isProductDrawerOpen) {
        closeProductDrawer()
      }
    } catch (error) {
      handleAddToCartError(error)
    }
  }

  const [addToCartVariantWithLoading] = useWithLoading(
    addToCartVariant,
    [variantId],
    setFullscreenLoading
  )

  const fetchSizeDrawer = async () => {
    const sizes = await fetchColorSizes(variantGroupId)
    if (sizes?.length) {
      setSizeDrawerVgId(variantGroupId)
      setAddToBagSizes(sizes)
      setSizeDrawerAnalyticsData({
        experienceId: analyticsData?.experienceId,
        eventLocation: analyticsData?.eventLocation || 'quick add to cart drawer',
        recAIType: RecommendationVendors.XGEN,
        containerLabel: analyticsData?.containerLabel,
        sendSelectItemFirst: analyticsData?.sendSelectItemFirst,
        index: analyticsData?.index,
      })

      if (onSizedProductClick) {
        onSizedProductClick()
        return
      }
      if (isDesktop) {
        setShowSizesSelectionDesktop(true)
      } else {
        setSizeDrawerMobile(true)
      }
    }
  }

  const addToCart: AddToCartFunctionType = async () => {
    // make sure that hook was called inside the context
    if (!sessionData?.actions) return

    if (isSizedProduct && selectedVariantGroupId.current && !isSizeAlreadySelected) {
      return await fetchSizeDrawer()
    }

    return await addToCartVariant(selectedVariantId.current)
  }

  const [addToCartWithLoading] = useWithLoading(
    addToCart,
    [variantId, variantGroupId],
    setFullscreenLoading
  )

  const isMaxQuantityReached = isSizedProduct
    ? false
    : isMaxQuantityReachedItem || productsWithMaxSizeATB?.includes(selectedVariantId.current)

  const isDisabled =
    isSizedProduct || isAccessorizeItBundleProduct || isStandaloneAccessory
      ? false
      : isError || productsWithDisabledATB?.includes(selectedVariantId.current)

  return {
    addToCart: addToCartWithLoading,
    addToCartVariant: addToCartVariantWithLoading,
    isError,
    errorMessage,
    isDisabled,
    isMaxQuantityReached,
    showSizesSelectionDesktop,
    onCloseSizeDrawer,
  }
}

export default useAddToCart
