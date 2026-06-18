import dynamic from 'next/dynamic'
import {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import ProductTile from 'toro/components/list/ProductTile'
import Grid from 'toro/components/Grid'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import InlinePromoTilePLP from 'toro/components/list/InlinePromoTilePLP'
import GridItem from 'toro/components/GridItem'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import get from 'lodash/get'
import SessionContext from 'toro/components/SessionContext'
import { useRouter } from 'next/router'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PWAContext from 'components/common/PWAContext'
import usePreference from 'toro/hooks/usePreference_new'
import usePricePreferences from 'toro/hooks/usePricePreferences'
import usePaginationTrigger from 'toro/hooks/usePaginationTrigger'
import {
  assignCellPosition,
  getColSpan,
  getPageBecameInteractiveTriggerIndex,
  getRowSpan,
  isPromo,
  mergeProductsWithPromos,
  useTilePreferences,
} from 'toro/components/list/ProductsListing/helpers'
import debounce from 'lodash/debounce'
import chunk from 'lodash/chunk'
import groupBy from 'lodash/groupBy'
import IconContainer from 'toro/components/list/IconContainer'
import PLPBottomSlotsContainer from 'toro/components/PLPBottomSlotsContainer'
import AdaptableInlineSearchPlpContainer from 'toro/components/AdaptableInlineSearch/AdaptableInlineSearchPlpContainer'
import SurveyContainer from 'toro/components/Survey/SurveyContainer'
import { getPageUrlHashForTileVisibility } from 'toro/constants/utils.plp'
import { filtersAtom } from 'store/search-results.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useCertonaOnMount } from 'toro/hooks/useCertonaRequest'
import { getProductFromCart } from 'toro/helpers/session'
import useToast from 'toro/hooks/useToast'
import { useIntl } from 'react-intl'
import { MAX_QUANTITY_RESTRICTION_TEXT } from 'toro/components/product/VariationMessages'
import { wishlistIdsAtom } from 'store/wishlist.atom'
import { lastAddedProductToBagVariantIdAtom } from 'store/pdp.atom'
import { ATB_DRAWER_ACTIONS, useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import { useLoadMiniCartPopover } from 'toro/components/header/MiniCart/useLoadMiniCartPopover'
import {
  addToBagSizesAtom,
  isPlpV3Atom,
  onModelPlpSequenceAtom,
  sizeDrawerVgIdAtom,
} from 'store/plp.atom'
import { fetchColorSizes, fetchSizeVariantData, productHasSizes } from 'toro/helpers/plp'
import useWithLoading from 'toro/hooks/useWithLoading'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import { miniCartOpenReasonAtom, MiniCartOpenReasons } from 'store/global.atom'
import { getFilterOptions, useFiltersFromCertonaOnPLP } from 'toro/components/Certona/helpers'
import { isItemMaxQuantityReached } from 'toro/helpers/isItemMaxQuantityReached'
import RecommendationComponents from 'toro/components/PLPBottomSlotsContainer/components'
import { DEALS_SCHEME } from 'toro/components/Certona/certona-schemes'
import RecommendedCategoriesContainer from 'toro/components/product/RecommendedCategories'
import { useUserChannelOnMount } from 'toro/hooks/useUserChannelOnMount'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import RecommendationsTabbedContainer from 'toro/components/RecommendationsTabbedContainer'
import { XgenContainerID } from 'toro/lib/xgen/types'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import ProductLoadAnnouncement from 'toro/components/list/ProductLoadAnnouncement'
import { useAddToCartPreviewDrawer } from 'toro/components/AddToCartPreviewDrawer/useAddToCartPreviewDrawer'

const CertonaTabbedRecommendation = dynamic(
  () => import('toro/components/Certona/TabbedRecommendation'),
  {
    ssr: false,
  }
)

const CertonaOnPlp = dynamic(() => import('toro/components/Certona/RecommendationOnPlp'), {
  ssr: false,
})

const PlpSizeDrawer = dynamic(() => import('toro/components/list/PlpSizeDrawer'), {
  ssr: false,
})

const DealsRecommendationContainer = dynamic(
  () => import('toro/components/EnhancedRecommendation/DealsRecommendationContainer'),
  {
    ssr: false,
  }
)

const BecauseYouViewedContainerPlp = dynamic(
  () => import('toro/components/BecauseYouViewedRecommendation/plp'),
  {
    ssr: false,
  }
)

const LoveAtFirstSwipeContainer = dynamic(
  () => import('toro/components/LoveAtFirstSwipe/container'),
  { ssr: false }
)

const OUT_OF_STOCK_RESTRICTION_TEXT =
  'This item is no longer available and cannot be added to your bag.'

const fillerElem = <div style={{ display: 'none' }} />

const ProductListingRecommendationsContainer = withSchemeValidation(
  RecommendationsContainer,
  CertonaOnPlp
)

function ProductsListing({
  products = [],
  onQuickViewClick = undefined,
  priceType,
  inlinePromoTileSlotsContent,
  isComparablePriceValue,
  suppressMaterial,
  pageType,
  pageSize,
  isFPC = false,
  isSPC = false,
  isCertonaTileEnabled = false,
  isComparablePriceEnabledCategory = false,
  categoryID,
  enableAddToBag,
  searchTerm = undefined,
  categoryImageSequence,
  matchExperienceConfig,
  bottomSlots,
  styles,
  isVisuallySimilarSRPEnabled = undefined,
}) {
  const { isPostAddToCartDesktopEnabled } = useAddToCartPreviewDrawer()
  const { appData } = useContext(PWAContext)
  const setMiniCartOpenReason = useUpdateAtom(miniCartOpenReasonAtom)
  const { isDesktop, isMobile } = useViewportType()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const { actions: sessionActions, session } = useContext(SessionContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const analytics = useAnalytics()
  const { triggerPagination, isPaginationDisabled } = usePaginationTrigger()
  const tileImpressionsToSend = useRef([])
  const pageUrlHash = getPageUrlHashForTileVisibility()
  const rootNode = useRef(null)
  const { contentUpdated } = useCmsAnalytics(rootNode)
  const [, setDrawerState] = useDrawerAtom()
  const loadMiniCartPopover = useLoadMiniCartPopover()
  const [isGlobalSizeDrawerOpen, setIsGlobalSizeDrawerOpen] = useState()
  const setAddToBagSizes = useUpdateAtom(addToBagSizesAtom)
  const setSizeDrawerVgId = useUpdateAtom(sizeDrawerVgIdAtom)
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const setLastAddedProductToBagVariantId = useUpdateAtom(lastAddedProductToBagVariantIdAtom)
  const [fetchSizesWithFullscreenLoad] = useWithLoading(fetchColorSizes, [], setFullscreenLoading)
  const { recommendations: recommendationsVendorEnabled = false } = useAtomValue(xgenFeaturesAtom)
  const isReplaceMatchingWithRecsExperiment = useExperiment(EXPERIMENTS.REPLACE_MATCHING_WITH_RECS)
  const isCertonaMatchExperienceEnabled = matchExperienceConfig?.enabled && isMobile
  const matchExperienceFilter = useMemo(() => {
    return isCertonaMatchExperienceEnabled
      ? getFilterOptions(matchExperienceConfig?.filters?.[0])
      : undefined
  }, [isCertonaMatchExperienceEnabled])
  const onModelPlpSequence = useAtomValue(onModelPlpSequenceAtom)
  const userChannel = useUserChannelOnMount()

  const dealsCertonaFilter = useFiltersFromCertonaOnPLP({
    slots: isCertonaTileEnabled,
    scheme: DEALS_SCHEME,
    isEnabled: isMobile,
  })

  const {
    lazyLoad: { enableLazyLoad: lazyLoadingEnabled },
    toggleSiteFeatures: { enableMaxQtyRestriction: maxQtyRestrictionEnabled = false },
    cartCheckoutSettings: { defaultMaxOrderQuantity: maxOrderQty = 5 },
    recommendations: { hideRecommendations, disableRecommendationOnPages, hideRecommendationPrice },
  } = usePreference({
    lazyLoad: ['enableLazyLoad'],
    ToggleSiteFeatures: ['enableMaxQtyRestriction'],
    CartCheckoutSettings: ['defaultMaxOrderQuantity'],
    recommendations: '*',
  })
  const hideRecommendationsOnPLP = disableRecommendationOnPages?.includes('PLP')

  const filters = useAtomValue(filtersAtom)
  const wishlistIds = useAtomValue(wishlistIdsAtom)
  const toast = useToast({
    position: isPlpV3 ? 'bottom' : undefined,
    variant: isPlpV3 ? 'plpv3' : undefined,
  })

  const isCertonaEnabledOnPlp = useMemo(
    () => !hideRecommendations && !hideRecommendationsOnPLP && !filters.length,
    [hideRecommendations, hideRecommendationsOnPLP, filters]
  )

  useCertonaOnMount({
    pagetype: 'productlisting',
    recommendations: true,
    enabled: isCertonaTileEnabled,
    filter: matchExperienceFilter || dealsCertonaFilter,
    categoryID,
  })

  useEffect(() => contentUpdated(), [])

  const newProducts = useMemo(() => {
    const isDefault = !isDesktop ? 2 : undefined
    return assignCellPosition(
      mergeProductsWithPromos(products, inlinePromoTileSlotsContent, isDefault),
      isDesktop
    )
  }, [inlinePromoTileSlotsContent, products, isDesktop])

  const { current: pageBecameInteractiveTriggerIndex } = useRef(
    products.length <= pageSize
      ? 0
      : getPageBecameInteractiveTriggerIndex(pageUrlHash, newProducts, isDesktop)
  )
  const { current: lastLoadedTileIndexOnFirstRender } = useRef(Math.max(newProducts.length - 1, 0))

  const showMoreCell = useMemo(() => {
    const cellsPerRow = isDesktop ? 4 : 2
    const rowsToTrigger = Math.ceil(pageSize / (2 * cellsPerRow))
    const filledCellCount = newProducts.reduce(
      (acc, curr) => acc + (isPromo(curr) ? getColSpan(curr, isDesktop) : 1),
      0
    )
    const cellShift =
      filledCellCount % cellsPerRow ? cellsPerRow - (filledCellCount % cellsPerRow) : 0
    const totalCellCount = filledCellCount + cellShift

    return totalCellCount - rowsToTrigger * cellsPerRow
  }, [newProducts, isDesktop, pageSize])

  const sendTileImpressions = useCallback(
    debounce(() => {
      const visibilityChunks = chunk(tileImpressionsToSend.current, 4)
      visibilityChunks.forEach((visibilityChunk) => {
        const byEventLocation = groupBy(
          visibilityChunk,
          (item) => item.eventLocation || 'module category'
        )
        Object.values(byEventLocation).forEach((items) => {
          analytics.send('viewItemListCategory', { items: [...items] })
        })
      })
      tileImpressionsToSend.current = []
    }, 300),
    [router]
  )

  const onTileVisible = useCallback(
    ({ idx, cells }) => {
      tileImpressionsToSend.current.push({
        ...newProducts[idx],
        index: idx + 1,
      })
      sendTileImpressions()
      if (cells?.some((cellIdx) => cellIdx >= showMoreCell) && lazyLoadingEnabled) {
        triggerPagination()
      }
    },
    [analytics.addImpression, showMoreCell, lazyLoadingEnabled, triggerPagination, newProducts]
  )

  const onPromoVisible = useCallback(
    ({ cells }) => {
      if (cells?.some((cellIdx) => cellIdx >= showMoreCell) && lazyLoadingEnabled) {
        triggerPagination()
      }
    },
    [showMoreCell, lazyLoadingEnabled, triggerPagination]
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

  const isATBDrawerEnabled = useMemo(
    () => isQuickAddToBagEnabled && get(appData, 'isAddToCartDrawerEnabled', false),
    [isQuickAddToBagEnabled]
  )

  const updateDrawerState = useCallback(
    (product) => {
      // TODO(DIGIT-26048): replace with actual id from API response
      const productId = product?.id?.includes(' ')
        ? product.id
        : get(product, 'defaultVariant.id', product?.id?.replace('-', ' '))
      const vgId = get(product, 'defaultColor.vgId', '')
      setDrawerState({
        type: ATB_DRAWER_ACTIONS.BATCH_DRAWER_STATE,
        payload: {
          drawerVisible: !!product,
          drawerQuantity: 1,
          variantId: productId,
          vgId,
        },
      })
    },
    [setDrawerState]
  )

  const showOosError = () => {
    toast({
      status: 'error',
      description: formatMessage({
        id: 'plp.product.oosToastMessage',
        defaultMessage: OUT_OF_STOCK_RESTRICTION_TEXT,
      }),
    })
  }

  const updateCartSession = useCallback(
    async (product, eventLocation) => {
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
              id: 'plp.product.maxQuantityRestriction.text',
              defaultMessage: MAX_QUANTITY_RESTRICTION_TEXT,
            })
          : formatMessage({
              id: 'plp.product.oosToastMessage',
              defaultMessage: OUT_OF_STOCK_RESTRICTION_TEXT,
            })
        if (isMobile || (isDesktop && productHasSizes(product))) {
          toast({
            status: 'error',
            description: errorDescription,
            dataQa: isMaxQuantityReached ? 'max_qty_error_msg' : null,
          })
        }
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
        if (e.message.includes('ProductItemNotAvailableException')) {
          showOosError()
        }
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
    (
        product,
        setDisableQuickAddButton,
        fetchColorSizes = fetchSizesWithFullscreenLoad,
        setIsDrawerOpen = setIsGlobalSizeDrawerOpen
      ) =>
      async () => {
        analytics.send('selectItem', {
          product,
          eventLocation: 'quick add to cart',
          wishlist: wishlistIds,
        })

        const currentColor = product?.defaultColor || {}
        if (productHasSizes(product) && currentColor.orderable) {
          const sizes = await fetchColorSizes(currentColor.vgId)
          if (sizes?.length) {
            const haveOrderableSizes = sizes?.some((size) => size.orderable)
            if (!haveOrderableSizes) {
              showOosError()
              setDisableQuickAddButton(true)
              return
            }
            setAddToBagSizes(sizes)
            setSizeDrawerVgId(currentColor.vgId)
            setIsDrawerOpen(true)
            return
          }
        }

        !(isDesktop || isPostAddToCartDesktopEnabled) && loadMiniCartPopover()
        const success = await updateCartSessionWithLoader(product, 'quick add to cart')
        if (success) {
          isATBDrawerEnabled && updateDrawerState(product)
          if (!isPostAddToCartDesktopEnabled) {
            setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
          }
          if (isDesktop) {
            const productId = product?.id?.includes(' ')
              ? product.id
              : get(product, 'defaultVariant.id', product?.id?.replace('-', ' '))
            setLastAddedProductToBagVariantId(productId)
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
      isDesktop,
      isPostAddToCartDesktopEnabled,
    ]
  )

  const onSizeDrawerAtbClick = useCallback(
    async (selectedVariantId, setIsDrawerOpen = setIsGlobalSizeDrawerOpen) => {
      const variantData = await fetchSizeVariantData(selectedVariantId)
      !(isDesktop || isPostAddToCartDesktopEnabled) && loadMiniCartPopover()
      const success = await updateCartSession(variantData, 'quick add to cart drawer')
      if (success) {
        setIsDrawerOpen(false)
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
      isDesktop,
    ]
  )
  const [onSizeDrawerAtbClickWithLoader] = useWithLoading(
    onSizeDrawerAtbClick,
    [],
    setFullscreenLoading
  )

  const renderRecommendationSlot = (product) => {
    const isRecommenderMatchesForTabbedCertona =
      matchExperienceConfig?.recommender === product?.recommendations

    if (isCertonaMatchExperienceEnabled && isRecommenderMatchesForTabbedCertona)
      return (
        <CertonaTabbedRecommendation
          hideRecommendationPrice={hideRecommendationPrice}
          matchExperienceConfig={matchExperienceConfig}
          categoryID={categoryID}
          pageType="productlisting"
          variant="tabbedRecommendation"
          userChannel={userChannel}
        />
      )

    const type = product?.recommendations
    const RecommendationComponent = RecommendationComponents[type]
    if (RecommendationComponent) {
      return <RecommendationComponent slot={product} categoryId={categoryID} type={type} />
    }

    return (
      <CertonaOnPlp
        type={product?.recommendations}
        hideRecommendationPrice={hideRecommendationPrice}
        isPlpV3={isPlpV3}
      />
    )
  }

  const renderSlot = (slot, colSpan, rowSpan, idx) => {
    if (slot?.isInlineSearch) {
      return <AdaptableInlineSearchPlpContainer />
    }

    if (slot?.isSurvey) {
      return <SurveyContainer answers={slot?.answers} variant={isPlpV3 ? 'round' : ''} />
    }

    if (slot?.isRecommendedCategories) {
      return (
        <RecommendedCategoriesContainer
          recommendedCategoriesData={slot?.categories}
          isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
        />
      )
    }

    if (slot?.isCertona) {
      const shouldRenderTabbedRecommendations =
        recommendationsVendorEnabled &&
        matchExperienceConfig?.enabled &&
        (slot?.recommendations === 'productlisting7_rr' ||
          slot?.recommendations === XgenContainerID.productlisting7_rr)

      if (shouldRenderTabbedRecommendations) {
        if (isReplaceMatchingWithRecsExperiment) {
          return (
            <ProductListingRecommendationsContainer
              type="sm_el_plp8"
              hideRecommendationPrice={hideRecommendationPrice}
              isPlpV3={isPlpV3}
              hideWishlist
            />
          )
        }

        return (
          <RecommendationsTabbedContainer
            type={slot?.recommendations}
            matchExperienceConfig={matchExperienceConfig}
            pageType="productlisting"
            hideRecommendationPrice={hideRecommendationPrice}
            categoryID={categoryID}
            variant="tabbedRecommendation"
            userChannel={userChannel}
          />
        )
      }

      const shouldRenderDealsRecommendations =
        recommendationsVendorEnabled &&
        (slot?.recommendations === DEALS_SCHEME || slot?.recommendations === 'sm_el_plp7')

      if (shouldRenderDealsRecommendations) {
        return <DealsRecommendationContainer type={slot.recommendations} />
      }

      if (slot?.recommendations === XgenContainerID.sm_el_sitevisit1) {
        return <BecauseYouViewedContainerPlp />
      }

      if (slot?.recommendations === XgenContainerID.sm_el_sitewide2) {
        return <LoveAtFirstSwipeContainer />
      }

      if (recommendationsVendorEnabled && !!XgenContainerID[slot?.recommendations]) {
        if (slot?.recommendations === XgenContainerID.sm_el_sitewide1) {
          const RecommendationComponent = RecommendationComponents[XgenContainerID.sm_el_sitewide1]
          if (RecommendationComponent) {
            return (
              <RecommendationComponent
                slot={slot}
                categoryId={categoryID}
                type={slot?.recommendations}
              />
            )
          }
        }

        return (
          <ProductListingRecommendationsContainer
            type={slot.recommendations}
            hideRecommendationPrice={hideRecommendationPrice}
            isPlpV3={isPlpV3}
          />
        )
      }

      return renderRecommendationSlot(slot)
    }

    return (
      <ImpressionSensor
        skip={isPaginationDisabled}
        payload={{ idx, cells: slot.cells }}
        onVisible={onPromoVisible}
      >
        <InlinePromoTilePLP
          markup={slot.content?.markup}
          colSpan={colSpan}
          rowSpan={rowSpan}
          isSplideContent={slot.content?.isSplideContent}
          hasVideo={slot.content?.hasVideo || false}
        />
      </ImpressionSensor>
    )
  }

  const renderProductTile = (product, idx) => {
    return (
      <ProductTile
        key={`product-${product.id}-${idx}`}
        tilePreferences={tilePreferences}
        pricePreferences={pricePreferences}
        isComparablePriceValue={isComparablePriceValue}
        isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
        product={product}
        sourceCodeGroupId={sourceCodeGroupId}
        onQuickViewClick={onQuickViewClick}
        index={idx}
        priceType={priceType}
        suppressMaterial={suppressMaterial}
        pageType={pageType}
        isSPC={isSPC}
        isFPC={isFPC}
        onVisible={onTileVisible}
        lastLoadedTileIndex={lastLoadedTileIndexOnFirstRender}
        pageUrlHash={pageUrlHash}
        onImageLoad={idx === pageBecameInteractiveTriggerIndex ? onImageLoad : null}
        isQuickAddToBagEnabledForCategory={isQuickAddToBagEnabled}
        onAddToBagClick={onAddToBagClick}
        searchTerm={searchTerm}
        categoryImageSequence={categoryImageSequence}
        onSizeDrawerAtbClickWithLoader={onSizeDrawerAtbClickWithLoader}
        onModelPlpSequence={onModelPlpSequence}
        categoryID={categoryID}
        isVisuallySimilarSRPEnabled={isVisuallySimilarSRPEnabled}
      />
    )
  }

  const renderInlinePromoTile = (product, colSpan, rowSpan, idx) => {
    return (
      <GridItem
        colSpan={colSpan}
        rowSpan={rowSpan}
        // we also use index because some products are duplicates and have the same id
        key={`promo-${product.id}-${idx}`}
        sx={styles.promoGridItem}
      >
        {renderSlot(product, colSpan, rowSpan, idx)}
      </GridItem>
    )
  }

  let put2FillerElemAfterIdx = null
  return (
    <>
      <ProductLoadAnnouncement />
      <IconContainer />
      <Grid sx={styles.productListingGrid}>
        {newProducts.map((product, idx) => {
          if (product?.productType?.variant) {
            product.productType.variant = null
          }
          if (product?.isCertona && !isCertonaEnabledOnPlp) {
            return null
          }
          const colSpan = getColSpan(product, isDesktop)
          const rowSpan = getRowSpan(product, isDesktop)

          if (isPromo(product) && isDesktop && rowSpan === 2) {
            put2FillerElemAfterIdx = idx + 2
          }

          const itemKeyBase = `${product?.id || 'product-id'}-${idx}`

          return isPromo(product) ? (
            <Fragment key={`plp-promo-${itemKeyBase}`}>
              {renderInlinePromoTile(product, colSpan, rowSpan, idx)}
              {/* empty hidden div to keep odd/even order of elements in Grid for specific CSS */}
              {colSpan === 2 && [fillerElem]}
              {colSpan === 4 && [fillerElem, fillerElem, fillerElem]}
            </Fragment>
          ) : (
            <Fragment key={`plp-product-${itemKeyBase}`}>
              {renderProductTile(product, idx)}
              {idx === put2FillerElemAfterIdx && [fillerElem, fillerElem]}
            </Fragment>
          )
        })}
      </Grid>
      <PLPBottomSlotsContainer
        bottomSlots={bottomSlots}
        styles={styles}
        categoryId={categoryID}
        isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
      />
      {isPlpV3 && isGlobalSizeDrawerOpen && (
        <PlpSizeDrawer
          setIsOpen={setIsGlobalSizeDrawerOpen}
          onAddToBagClick={onSizeDrawerAtbClickWithLoader}
        />
      )}
    </>
  )
}

export default withErrorBoundaryWrapper(memo(ProductsListing))
