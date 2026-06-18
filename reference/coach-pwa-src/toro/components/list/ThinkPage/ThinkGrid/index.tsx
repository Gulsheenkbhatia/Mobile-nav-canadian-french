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
import Box from 'toro/components/Box'
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
import { GridVariant } from 'toro/helpers/thinkPlp'
import { useAddToCartPreviewDrawer } from 'toro/components/AddToCartPreviewDrawer/useAddToCartPreviewDrawer'

const PlpSizeDrawer = dynamic(() => import('toro/components/list/PlpSizeDrawer'), {
  ssr: false,
})

// TODO: define the types for the props
interface ThinkGridProps extends Record<string, any> {
  gridVariant: GridVariant | 'rowGrid'
  rowStartPosition: number
  showSinglePriceOnly?: boolean
  thinkPageSwatchesDisabled?: boolean
  onModelSequence?: string[]
  productTitleCharLimit?: number | null
}

const OUT_OF_STOCK_RESTRICTION_TEXT =
  'This item is no longer available and cannot be added to your bag.'

const GRID_SIZE_FIXED_C = 2 // 2x2 grid

const ThinkGrid = ({
  gridVariant,
  onModelSequence,
  products,
  priceType,
  isComparablePriceValue,
  suppressMaterial,
  pageType,
  isFPC = false,
  isSPC = false,
  isComparablePriceEnabledCategory = false,
  enableAddToBag,
  categoryImageSequence,
  rowStartPosition,
  showOnlySinglePrice,
  thinkPageSwatchesDisabled = false,
  productTitleCharLimit = null,
}: ThinkGridProps) => {
  const styles = useMultiStyleConfig('ThinkGrid', { size: gridVariant })
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
    Math.max(newProducts.length - 1 + rowStartPosition, 0)
  )

  // Ref so the debounced callback always reads current length (avoids stale closure when
  // products load asynchronously, e.g. ThinkTabbedContent).
  const newProductsLengthRef = useRef(newProducts.length)
  newProductsLengthRef.current = newProducts.length

  const sendTileImpressions = useCallback(
    debounce(() => {
      const visibilityChunks = chunk(tileImpressionsToSend.current, newProductsLengthRef.current)
      visibilityChunks.forEach((visibilityChunk) => {
        analytics.send('viewItemListCategory', { items: [...visibilityChunk] })
      })
      tileImpressionsToSend.current = []
    }, 300),
    [router]
  )

  const onTileVisible = useCallback(
    ({ idx }) => {
      const localIdx = idx - rowStartPosition
      tileImpressionsToSend.current.push({
        ...newProducts[localIdx],
        index: idx + 1,
      })
      sendTileImpressions()
    },
    [analytics.addImpression, newProducts, rowStartPosition]
  )

  const renderMixedGrid = (
    gridVariant: 'fixedA' | 'fixedB' | 'fixedC',
    products: any[],
    productProps: any,
    rowStartPosition: number,
    onModelSequence?: string[]
  ) => {
    if (gridVariant === 'fixedA') {
      return (
        <Grid data-qa="fixedA-think-plp" sx={styles.gridWrapper}>
          <Grid className="left-grid">
            {products.slice(0, 4).map((product, idx) => (
              <ProductTile
                key={`product-${product.id}-${idx}`}
                {...productProps}
                product={product}
                index={rowStartPosition + idx}
              />
            ))}
          </Grid>
          <Box className="right-on-model">
            <ProductTile
              key={`product-${products[4].id}-4`}
              {...productProps}
              product={products[4]}
              index={rowStartPosition + 4}
              onModelPlpSequence={onModelSequence}
              gridVariant={'2up'}
              isThinkPage
            />
          </Box>
        </Grid>
      )
    }

    if (gridVariant === 'fixedB') {
      // Grid B: onModel image on left, 2x2 grid on right
      return (
        <Grid data-qa="fixedB-think-plp" sx={styles.gridWrapper}>
          <Box className="left-on-model">
            <ProductTile
              key={`product-${products[0].id}-0`}
              {...productProps}
              product={products[0]}
              index={rowStartPosition}
              onModelPlpSequence={onModelSequence}
              gridVariant={'2up'}
              isThinkPage
            />
          </Box>
          <Grid className="right-grid">
            {products.slice(1, 5).map((product, idx) => (
              <ProductTile
                key={`product-${product.id}-${idx + 1}`}
                {...productProps}
                product={product}
                index={rowStartPosition + idx + 1}
              />
            ))}
          </Grid>
        </Grid>
      )
    }

    if (gridVariant === 'fixedC') {
      // Grid C: 2x2 grid with diagonal on-model pattern
      // Position 0 (top-left) and 3 (bottom-right): on-model images
      // Position 1 (top-right) and 2 (bottom-left): default images

      return (
        <Grid data-qa="fixedC-think-plp" sx={styles.gridWrapper}>
          {products.slice(0, 4).map((product, idx) => {
            const row = Math.floor(idx / GRID_SIZE_FIXED_C)
            const col = idx % GRID_SIZE_FIXED_C
            const isOnModel = row === col // row and column are the same
            return (
              <ProductTile
                key={`product-${product.id}-${idx}`}
                {...productProps}
                product={product}
                index={rowStartPosition + idx}
                {...(isOnModel && {
                  onModelPlpSequence: onModelSequence,
                  gridVariant: '2up',
                  isThinkPage: true,
                })}
              />
            )
          })}
        </Grid>
      )
    }
  }

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

  const productProps = {
    tilePreferences,
    pricePreferences,
    isComparablePriceValue,
    isComparablePriceEnabledCategory,
    sourceCodeGroupId,
    priceType,
    suppressMaterial,
    pageType,
    isSPC,
    isFPC,
    onVisible: onTileVisible,
    lastLoadedTileIndex: lastLoadedTileIndexOnFirstRender,
    pageUrlHash,
    onImageLoad: undefined,
    isQuickAddToBagEnabledForCategory: isQuickAddToBagEnabled,
    onAddToBagClick: onAddToBagClick,
    categoryImageSequence,
    variant: 'thinkPlp',
    sizeVariant: gridVariant,
    showOnlySinglePrice,
    disableColorSwatches: thinkPageSwatchesDisabled,
    productTitleCharLimit,
  }

  return (
    <>
      {gridVariant === 'fixedA' || gridVariant === 'fixedB' || gridVariant === 'fixedC' ? (
        renderMixedGrid(gridVariant, newProducts, productProps, rowStartPosition, onModelSequence)
      ) : (
        <Grid data-qa={`${gridVariant}-think-plp`} sx={styles.gridWrapper}>
          <IconContainer />
          {newProducts.map((product, idx) => {
            const productPosition = idx + rowStartPosition
            return (
              <ProductTile
                {...productProps}
                key={`product-${product.id}-${productPosition}`}
                product={product}
                index={productPosition}
                onImageLoad={idx === pageBecameInteractiveTriggerIndex ? onImageLoad : null}
                onModelPlpSequence={onModelSequence}
                gridVariant={gridVariant}
                isThinkPage
              />
            )
          })}
        </Grid>
      )}

      {isSizeDrawerOpen && (
        <PlpSizeDrawer
          setIsOpen={setIsSizeDrawerOpen}
          onAddToBagClick={onSizeDrawerAtbClickWithLoader}
        />
      )}
    </>
  )
}

export default withErrorBoundaryWrapper(memo(ThinkGrid))
