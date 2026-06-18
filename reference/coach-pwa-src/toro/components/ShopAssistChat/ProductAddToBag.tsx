import React, { useState, useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import QuickAddToBag from 'toro/components/list/QuickAddToBag'
import { fetchFullProductsDataFromClient } from 'toro/helpers/fetchProductDataFromClient'
import { fetchColorSizes, fetchSizeVariantData, productHasSizes } from 'toro/helpers/plp'
import { MAX_QUANTITY_RESTRICTION_TEXT } from 'toro/components/product/VariationMessages'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import get from 'lodash/get'
import { addToBagSizesAtom, sizeDrawerVgIdAtom } from 'store/plp.atom'
import useWithLoading from 'toro/hooks/useWithLoading'
import { isItemMaxQuantityReached } from 'toro/helpers/isItemMaxQuantityReached'
import { getProductFromCart } from 'toro/helpers/session'
import SessionContext from 'toro/components/SessionContext'
import useToast from 'toro/hooks/useToast'
import { useAtomValue, useUpdateAtom, useAtomCallback } from 'jotai/utils'
import { currentLocaleAtom } from 'store/global.atom'
import {
  shopAssistProductDataCacheAtom,
  isShopAssistProductCacheEntryExpired,
  MAX_SHOP_ASSIST_CACHE_ENTRIES,
  SHOP_ASSIST_PRODUCT_CACHE_TTL_MS,
} from 'store/shop-assist-chat.atom'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import { OUT_OF_STOCK_RESTRICTION_TEXT } from 'toro/components/ShopAssistChat/constants'
import useAnalytics from 'toro/analytics/useAnalytics'
import { Product } from 'toro/components/ShopAssistChat/types'

interface Props {
  productId: string
  setIsSizeDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  registerDrawerHandler: (handler: any) => void
  formatAnalyticsItems: (items: any[], startIndex?: number) => any
  productIndex: number
  productData: Product
}
const toastConfig = {
  position: 'bottom' as const,
  variant: 'plpv3',
  containerStyle: {
    '& > div': {
      backgroundColor: 'var(--color-white-base)',
      alignItems: 'center',
      borderRadius: '8px',
      width: {
        base: 'calc(100vw - var(--spacing-6))',
        md: 'auto',
      },
      maxWidth: {
        base: '100%',
        md: '400px',
      },
      height: '73px',
      margin: '0 auto',
    },
  },
}

const ProductAddToBag = ({
  productId,
  setIsSizeDrawerOpen,
  registerDrawerHandler,
  formatAnalyticsItems,
  productIndex,
  productData: giftAssistantProductData,
}: Props) => {
  const { formatMessage } = useIntl()

  const toast = useToast(toastConfig)

  const { actions: sessionActions, session } = useContext(SessionContext)

  const { isDesktop, isMobile } = useViewportType()
  const analytics = useAnalytics()

  const unnamedProductName = formatMessage({
    id: 'shopAssistChat.addToBag.unnamedProduct',
    defaultMessage: 'Item',
  })
  const currentLocale = useAtomValue(currentLocaleAtom)
  const fetchProductData = useAtomCallback(
    async (get, set, { productId, locale }: { productId: string; locale: string }) => {
      const key = `${productId}-${locale}`
      const cache = get(shopAssistProductDataCacheAtom)

      const entry = cache.get(key)
      if (entry && !isShopAssistProductCacheEntryExpired(entry)) {
        cache.delete(key)
        cache.set(key, entry)

        set(shopAssistProductDataCacheAtom, cache)

        return entry.data
      }
      if (entry) cache.delete(key)

      const productData = await fetchFullProductsDataFromClient([productId], {
        includeInventory: true,
        withMaster: false,
        locale,
      })

      const expiresAt = Date.now() + SHOP_ASSIST_PRODUCT_CACHE_TTL_MS
      if (cache.size >= MAX_SHOP_ASSIST_CACHE_ENTRIES) {
        const oldestKey = cache.keys().next().value
        cache.delete(oldestKey)
      }

      cache.set(key, {
        data: productData,
        expiresAt,
      })

      set(shopAssistProductDataCacheAtom, cache)

      return productData
    }
  )
  const setAddToBagSizes = useUpdateAtom(addToBagSizesAtom)
  const setSizeDrawerVgId = useUpdateAtom(sizeDrawerVgIdAtom)
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)

  const [disabled, setDisabled] = useState(false)

  const {
    toggleSiteFeatures: { enableMaxQtyRestriction: maxQtyRestrictionEnabled = false },
    cartCheckoutSettings: { defaultMaxOrderQuantity: maxOrderQty = 5 },
  } = usePreference({
    ToggleSiteFeatures: ['enableMaxQtyRestriction'],
    CartCheckoutSettings: ['defaultMaxOrderQuantity'],
  })

  const showOosError = useCallback(() => {
    toast({
      status: 'error',
      description: formatMessage({
        id: 'shopAssistChat.addToBag.oosToastMessage',
        defaultMessage: OUT_OF_STOCK_RESTRICTION_TEXT,
      }),
    })
  }, [toast, formatMessage])

  const updateCartSession = useCallback(
    async (product) => {
      const productId = product?.id?.includes(' ')
        ? product.id
        : get(product, 'defaultVariant.id', product?.id?.replace('-', ' '))

      const productFromCart = getProductFromCart(productId, session)
      const productInventory = get(product, 'inventory.ats', 0)
      const productQuantityInCart = get(productFromCart, 'quantity', 0)
      const availableQuantity = productInventory - productQuantityInCart

      const isMaxQuantityReached = isItemMaxQuantityReached({
        product,
        cartSession: session,
        maxQtyRestrictionEnabled,
        maxQuantity: maxOrderQty,
      })

      if (productInventory === 0 || availableQuantity < 1 || isMaxQuantityReached) {
        const errorDescription = isMaxQuantityReached
          ? formatMessage({
              id: 'shopAssistChat.addToBag.maxQuantityRestrictionText',
              defaultMessage: MAX_QUANTITY_RESTRICTION_TEXT,
            })
          : formatMessage({
              id: 'shopAssistChat.addToBag.oosToastMessage',
              defaultMessage: OUT_OF_STOCK_RESTRICTION_TEXT,
            })

        if (isMobile || (isDesktop && productHasSizes(product))) {
          toast({
            status: 'error',
            description: errorDescription,
          })
        }

        return false
      }

      const addToBagData = {
        product: { id: productId },
        quantity: 1,
        productId,
      }

      try {
        if (!productFromCart) {
          await sessionActions.addToCart(addToBagData)
        } else {
          await sessionActions.updateCart({
            ...addToBagData,
            quantity: productFromCart.quantity + 1,
            itemId: get(productFromCart, 'item_id'),
          })
        }
      } catch (e: any) {
        console.error(e.message)
        if (e.message.includes('ProductItemNotAvailableException')) {
          showOosError()
        }
        return false
      }

      return true
    },
    [session]
  )

  const [updateCartSessionWithLoader] = useWithLoading(updateCartSession, [], setFullscreenLoading)

  const onSizeDrawerAtbClick = useCallback(
    async (selectedVariantId) => {
      const variantData = await fetchSizeVariantData(selectedVariantId)
      const [formattedProduct] = formatAnalyticsItems([giftAssistantProductData], productIndex)

      const success = await updateCartSession(variantData)

      if (success) {
        setIsSizeDrawerOpen(false)
        analytics.send('addToCart', {
          product: formattedProduct,
          eventLocation: 'gift assistant',
        })

        toast({
          status: 'success',
          description: formatMessage(
            {
              id: 'shopAssistChat.addToBag.addedToBag',
              defaultMessage: 'The {productName} has been added to your Bag.',
            },
            {
              productName: variantData?.name || unnamedProductName,
            }
          ),
        })
      }
    },
    [updateCartSession, giftAssistantProductData, productIndex]
  )

  const [onSizeDrawerAtbClickWithLoader] = useWithLoading(
    onSizeDrawerAtbClick,
    [],
    setFullscreenLoading
  )
  const [fetchSizesWithFullscreenLoad] = useWithLoading(fetchColorSizes, [], setFullscreenLoading)

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      const productData = await fetchProductData({
        productId,
        locale: currentLocale,
      })

      const product = productData[0]
      const currentColor = product?.defaultColor || {}

      const [formattedProduct] = formatAnalyticsItems([giftAssistantProductData], productIndex)

      analytics.send('selectItem', {
        eventLocation: 'gift assistant',
        product: formattedProduct,
      })

      if (productHasSizes(product) && currentColor.orderable) {
        const sizes = await fetchSizesWithFullscreenLoad(currentColor.vgId)

        if (sizes?.length) {
          const haveOrderableSizes = sizes.some((size) => size.orderable)

          if (!haveOrderableSizes) {
            showOosError()
            setDisabled(true)
            return
          }

          setAddToBagSizes(sizes)
          setSizeDrawerVgId(currentColor.vgId)

          registerDrawerHandler(onSizeDrawerAtbClickWithLoader)
          setIsSizeDrawerOpen(true)

          return
        }
      }

      const success = await updateCartSessionWithLoader(product)

      if (success) {
        analytics.send('addToCart', {
          product: formattedProduct,
          eventLocation: 'gift assistant',
        })

        toast({
          status: 'success',
          description: formatMessage(
            {
              id: 'shopAssistChat.addToBag.addedToBag',
              defaultMessage: 'The {productName} has been added to your Bag.',
            },
            {
              productName: product?.name || unnamedProductName,
            }
          ),
        })
      } else {
        setDisabled(true)
      }
    },
    [
      productId,
      currentLocale,
      fetchProductData,
      showOosError,
      updateCartSessionWithLoader,
      setAddToBagSizes,
      setSizeDrawerVgId,
      setIsSizeDrawerOpen,
      toast,
      productIndex,
      giftAssistantProductData,
    ]
  )

  return (
    <QuickAddToBag
      onClick={handleClick}
      disabled={disabled}
      showOnLegacy
      isMaxQuantityReached={false}
      isProductSet={false}
    />
  )
}

export default React.memo(ProductAddToBag)
