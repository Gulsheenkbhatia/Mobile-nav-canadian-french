import dynamic from 'next/dynamic'
import { useContext, useEffect, useMemo, useRef, memo, useCallback, useState } from 'react'
import ProductTile from 'toro/components/list/ProductTile'
import Grid from 'toro/components/Grid'
import useAnalytics from 'toro/analytics/useAnalytics'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import get from 'lodash/get'
import SessionContext from 'toro/components/SessionContext'
import { useRouter } from 'next/router'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PWAContext from 'components/common/PWAContext'
import usePreference from 'toro/hooks/usePreference_new'
import usePricePreferences from 'toro/hooks/usePricePreferences'
import {
  useTilePreferences,
  assignCellPosition,
  getPageBecameInteractiveTriggerIndex,
} from 'toro/components/list/ProductsListing/helpers'
import debounce from 'lodash/debounce'
import chunk from 'lodash/chunk'
import IconContainer from 'toro/components/list/IconContainer'
import { getPageUrlHashForTileVisibility } from 'toro/constants/utils.plp'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { getProductFromCart } from 'toro/helpers/session'
import useToast from 'toro/hooks/useToast'
import { useIntl } from 'react-intl'
import { MAX_QUANTITY_RESTRICTION_TEXT } from 'toro/components/product/VariationMessages'
import { wishlistIdsAtom } from 'store/wishlist.atom'
import { addToBagSizesAtom, sizeDrawerVgIdAtom } from 'store/plp.atom'
import { ATB_DRAWER_ACTIONS, useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import { useLoadMiniCartPopover } from 'toro/components/header/MiniCart/useLoadMiniCartPopover'
import { fetchColorSizes, productHasSizes, fetchSizeVariantData } from 'toro/helpers/plp'
import useWithLoading from 'toro/hooks/useWithLoading'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import { miniCartOpenReasonAtom, MiniCartOpenReasons } from 'store/global.atom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAddToCartPreviewDrawer } from 'toro/components/AddToCartPreviewDrawer/useAddToCartPreviewDrawer'

const PlpSizeDrawer = dynamic(() => import('toro/components/list/PlpSizeDrawer'), {
  ssr: false,
})

const OUT_OF_STOCK_RESTRICTION_TEXT =
  'This item is no longer available and cannot be added to your bag.'

function ShopByProductsListing({
  products = [],
  cellStartIndex,
  priceType,
  isComparablePriceValue,
  suppressMaterial,
  pageType,
  isFPC = false,
  isSPC = false,
  isComparablePriceEnabledCategory = false,
  enableAddToBag,
  categoryImageSequence,
  onModelPlpSequence,
}) {
  const { appData } = useContext(PWAContext)
  const setMiniCartOpenReason = useUpdateAtom(miniCartOpenReasonAtom)
  const { actions: sessionActions, session } = useContext(SessionContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const analytics = useAnalytics()
  const tileImpressionsToSend = useRef([])
  const pageUrlHash = getPageUrlHashForTileVisibility()
  const rootNode = useRef(null)
  const { contentUpdated } = useCmsAnalytics(rootNode)
  const [, setDrawerState] = useDrawerAtom()
  const loadMiniCartPopover = useLoadMiniCartPopover()
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false)
  const setAddToBagSizes = useUpdateAtom(addToBagSizesAtom)
  const setSizeDrawerVgId = useUpdateAtom(sizeDrawerVgIdAtom)
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const [fetchColorSizesWithLoad] = useWithLoading(fetchColorSizes, [], setFullscreenLoading)
  const styles = useMultiStyleConfig('ShopByProductListingPage')
  const { isPostAddToCartDesktopEnabled } = useAddToCartPreviewDrawer()

  const {
    toggleSiteFeatures: { enableMaxQtyRestriction: maxQtyRestrictionEnabled = false },
    cartCheckoutSettings: { defaultMaxOrderQuantity: maxOrderQty = 5 },
  } = usePreference({
    ToggleSiteFeatures: ['enableMaxQtyRestriction'],
    CartCheckoutSettings: ['defaultMaxOrderQuantity'],
  })

  const wishlistIds = useAtomValue(wishlistIdsAtom)
  const toast = useToast({
    position: 'bottom',
    variant: 'plpv3',
  })

  useEffect(() => contentUpdated(), [])

  const newProducts = useMemo(() => assignCellPosition(products, false), [products])

  const { current: pageBecameInteractiveTriggerIndex } = useRef(
    getPageBecameInteractiveTriggerIndex(pageUrlHash, newProducts, false)
  )

  const { current: lastLoadedTileIndexOnFirstRender } = useRef(
    Math.max(newProducts.length - 1 + cellStartIndex, 0)
  )

  const sendTileImpressions = useCallback(
    debounce(() => {
      const visibilityChunks = chunk(tileImpressionsToSend.current, 4)
      visibilityChunks.forEach((visibilityChunk) => {
        analytics.send('viewItemListCategory', { items: [...visibilityChunk] })
      })
      tileImpressionsToSend.current = []
    }, 300),
    [router]
  )

  const onTileVisible = useCallback(
    ({ idx }) => {
      tileImpressionsToSend.current.push({
        ...newProducts[idx],
        index: idx + 1,
      })
      sendTileImpressions()
    },
    [analytics.addImpression, newProducts]
  )

  const sourceCodeGroupId = useMemo(
    () => get(router, 'query.src', get(session, 'user.sourceCodeGroupID') || null),
    [session]
  )

  const onImageLoad = useCallback(() => {
    analytics.pageBecameInteractive(
      typeof window !== 'undefined' ? window.location.href : undefined
    )
  }, [analytics.pageBecameInteractive])

  const tilePreferences = useTilePreferences()
  const pricePreferences = usePricePreferences()
  const isQuickAddToBagEnabled = enableAddToBag

  const isATBDrawerEnabled =
    isQuickAddToBagEnabled && get(appData, 'isAddToCartDrawerEnabled', false)

  const updateDrawerState = useCallback((product) => {
    // TODO(DIGIT-26048): replace with actual id from API response
    const productId = product?.id?.includes(' ')
      ? product.id
      : get(product, 'defaultVariant.id', product?.id?.replace('-', ' '))
    setDrawerState({
      type: ATB_DRAWER_ACTIONS.BATCH_DRAWER_STATE,
      payload: {
        drawerVisible: !!product,
        drawerQuantity: 1,
        variantId: productId,
      },
    })
  }, [])

  const updateCartSession = useCallback(
    async (product, eventLocation) => {
      const productId = product?.id?.includes(' ')
        ? product.id
        : get(product, 'defaultVariant.id', product?.id?.replace('-', ' '))
      const productFromCart = getProductFromCart(productId, session)
      const productInventory = get(product, 'inventory.ats', 0)
      const productQuantityInCart = get(productFromCart, 'quantity', 0)

      const productMaxOrderableQty = get(
        product,
        'custom.c_maxOrderableQuantity',
        get(product, 'defaultVariant.customAttributes.c_maxOrderableQuantity', 0)
      )
      const maxQty = maxQtyRestrictionEnabled
        ? productMaxOrderableQty <= 0
          ? maxOrderQty
          : productMaxOrderableQty
        : productInventory
      const availableQuantity = productInventory - productQuantityInCart

      if (productInventory === 0 || availableQuantity < 1 || productQuantityInCart === maxQty) {
        const errorDescription =
          productQuantityInCart === maxQty
            ? formatMessage({
                id: 'plp.product.maxQuantityRestriction.text',
                defaultMessage: MAX_QUANTITY_RESTRICTION_TEXT,
              })
            : formatMessage({
                id: 'plp.product.oosToastMessage',
                defaultMessage: OUT_OF_STOCK_RESTRICTION_TEXT,
              })
        toast({
          status: 'error',
          description: errorDescription,
          dataQa: productQuantityInCart === maxQty ? 'max_qty_error_msg' : null,
        })
        analytics.send('siteError', {
          eventAction: 'quick add to bag',
          eventLocation,
          eventLabel: errorDescription,
        })
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
      } catch (e) {
        console.error(e.message)
        return false
      }

      analytics.send('addToCart', {
        product: {
          ...product,
          quantity: '1',
        },
        eventLocation,
      })

      return true
    },
    [session]
  )
  const [updateCartSessionWithLoader] = useWithLoading(updateCartSession, [], setFullscreenLoading)

  const onAddToBagClick = useCallback(
    (product, setDisableQuickAddButton) => async () => {
      analytics.send('selectItem', {
        product,
        eventLocation: 'quick add to cart',
        wishlist: wishlistIds,
      })

      const currentColor = product?.defaultColor || {}
      if (productHasSizes(product) && currentColor.orderable) {
        const sizes = await fetchColorSizesWithLoad(currentColor.vgId)
        if (sizes?.length) {
          setAddToBagSizes(sizes)
          setSizeDrawerVgId(currentColor.vgId)
          setIsSizeDrawerOpen(true)
          return
        }
      }

      loadMiniCartPopover()
      const success = await updateCartSessionWithLoader(product, 'quick add to cart')
      if (success) {
        isATBDrawerEnabled && updateDrawerState(product)
        if (!isPostAddToCartDesktopEnabled) {
          setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
        }
      } else {
        setDisableQuickAddButton(true)
      }
    },
    [
      setMiniCartOpenReason,
      updateDrawerState,
      updateCartSession,
      isATBDrawerEnabled,
      loadMiniCartPopover,
      wishlistIds,
      isPostAddToCartDesktopEnabled,
    ]
  )

  const onSizeDrawerAtbClick = useCallback(
    async (selectedVariantId) => {
      const variantData = await fetchSizeVariantData(selectedVariantId)
      loadMiniCartPopover()
      const success = await updateCartSession(variantData, 'quick add to cart drawer')
      if (success) {
        setIsSizeDrawerOpen(false)
        isATBDrawerEnabled && updateDrawerState(variantData)
        if (!isPostAddToCartDesktopEnabled) {
          setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
        }
      }
    },
    [
      setMiniCartOpenReason,
      updateDrawerState,
      updateCartSession,
      isATBDrawerEnabled,
      loadMiniCartPopover,
      isPostAddToCartDesktopEnabled,
    ]
  )
  const [onSizeDrawerAtbClickWithLoader] = useWithLoading(
    onSizeDrawerAtbClick,
    [],
    setFullscreenLoading
  )

  return (
    <>
      <Grid sx={styles.productListingContainer}>
        <IconContainer />
        {newProducts.map((product, idx) => {
          if (product?.productType?.variant) {
            product.productType.variant = null
          }

          const cellIndex = cellStartIndex + idx

          return (
            <ProductTile
              key={`product-${product.id}-${cellIndex}`}
              tilePreferences={tilePreferences}
              pricePreferences={pricePreferences}
              isComparablePriceValue={isComparablePriceValue}
              isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
              product={product}
              sourceCodeGroupId={sourceCodeGroupId}
              index={cellIndex}
              priceType={priceType}
              suppressMaterial={suppressMaterial}
              pageType={pageType}
              isSPC={isSPC}
              isFPC={isFPC}
              onVisible={onTileVisible}
              lastLoadedTileIndex={lastLoadedTileIndexOnFirstRender}
              pageUrlHash={pageUrlHash}
              onImageLoad={cellIndex === pageBecameInteractiveTriggerIndex ? onImageLoad : null}
              isQuickAddToBagEnabledForCategory={isQuickAddToBagEnabled}
              onAddToBagClick={onAddToBagClick}
              categoryImageSequence={categoryImageSequence}
              onModelPlpSequence={idx === 0 ? onModelPlpSequence : null}
            />
          )
        })}
      </Grid>
      {isSizeDrawerOpen && (
        <PlpSizeDrawer
          setIsOpen={setIsSizeDrawerOpen}
          onAddToBagClick={onSizeDrawerAtbClickWithLoader}
        />
      )}
    </>
  )
}

export default withErrorBoundaryWrapper(memo(ShopByProductsListing))
