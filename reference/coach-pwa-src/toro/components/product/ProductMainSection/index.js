import { useEffect, useState, useContext, useMemo, useRef, useCallback } from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import Box from 'toro/components/Box'
import {
  getOrderingStatus,
  getOrderingStatusByVG,
  ORDERING_ERROR,
  getColorVariantId,
  getMasterId,
  ORDERING_STATUS,
  getVariantInfo,
  parseProductId,
  getVariantInventoryFromVG,
} from 'toro/helpers/productVariations'
import { fetchProductDataFromClient } from 'toro/helpers/fetchProductDataFromClient'
import useWithLoading from 'toro/hooks/useWithLoading'
import useLastSeenCookie from 'toro/hooks/useLastSeenCookie'
import PWAContext from 'components/common/PWAContext'
import Badges from 'toro/components/badges/Badges'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import SessionContext from 'toro/components/SessionContext'
import get from 'lodash/get'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import usePreference from 'toro/hooks/usePreference'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import usePreferenceGroup from 'toro/hooks/usePreferenceGroup'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import useTheme from 'toro/hooks/useTheme'
import {
  getCleanedSku,
  getVGSizesfromColor,
  getVGWidthsfromColor,
  findAttributeByType,
  orderingStatusGAMap,
} from 'toro/helpers/skuHelper'
import intersection from 'lodash/intersection'
import { useRouter } from 'next/router'
import { parseQueryString } from 'toro/helpers/url'
import useTulipLiveConnect from 'toro/hooks/useTulipLiveConnect'
import dynamic from 'next/dynamic'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import BundleVariants from 'toro/components/product/Bundle/BundleVariants'
import BundleContentModule from 'toro/components/product/Bundle/BundleContentModule'
import { ProductMainSectionBreakpointContext } from './context'
import { useAtom } from 'jotai'
import { useUpdateAtom, RESET, useResetAtom, useAtomValue } from 'jotai/utils'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import {
  forceLoadingDisplayAtom,
  isNotifyMeAvailableAtom,
  productCustomStateAtom,
  selectionChangedAtom,
  runSearchFetchAtom,
  variationTypeControlInteraction,
  countryTabIndexAtom,
  lastAddedProductToBagAtom,
  lastAddedProductToBagVariantIdAtom,
  isTangibleeInitializedAtom,
  setFitReviewAtom,
  isFirstViewedAtom,
  isAeFirstViewedAtom,
  isMegaPDPEligibleAtom,
  isTabbedAdaptivePDPEligibleAtom,
  isProductFullyOOSAtom,
  AlterCtaToShow,
  applePayErrorOnPdpAtom,
  setApplePayErrorOnPdpAtom,
  shouldShowVisuallySimilarPdpAtom,
  setSelectedColorAtom,
  productDataAtom,
  isQuickViewAtom,
  quickViewedProductAtom,
  originalProductIdAtom,
  appLoadingAtom,
  isSizeGuidePopUpOpenAtom,
  selectedSizeAtom,
  setKlarnaDetailsAtom,
} from 'store/pdp.atom'
import {
  bundleIsNotifyMeAvailableAtom,
  bundleVariantsProductsQtyAtom,
  bundleSelectedSizeAtom,
  bundleSelectedWidthAtom,
  bundleSelectedVariationAtom,
  selectedBundleVariantsDataAtom,
  bundleOrderingStatusAtom,
  stickyContainerStateAtom,
  bundleErrorsAtom,
} from 'store/bundle.atom'
import getItemByIDorFirstItem from 'toro/helpers/getItemByIDorFirstItem'
import { MAX_REACHED_MSG } from 'toro/components/AddToBagDrawer'
import { wishlistIdsAtom, updatedWishListAtom } from 'store/wishlist.atom'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import isString from 'lodash/isString'
import { isHeaderHeightAtom } from 'store/headroom.atom'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import isSW from 'toro/helpers/isSW'
import getAPIURL from 'helpers/getAPIURL'
import serialize from 'toro/helpers/serialize'
import isKS from 'toro/helpers/isKS'
import merge from 'lodash/merge'
import fetchContentAssetForOnPurpose from 'toro/helpers/fetchContentAssetForOnPurpose'
import useCertonaRequest from 'toro/hooks/useCertonaRequest'
import { getSearchResults, getZipCode } from 'toro/components/product/FindInStore/helpers'
import getProductUrl from 'toro/helpers/getProductUrl'
import usePageType from 'toro/hooks/usePageType'
import useToroEventsDispatch from 'toro/hooks/useToroEventDispatch'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'
import getProductUrlBrandOptions from 'toro/helpers/getProductUrlBrandOptions'
import { qvProductAnalyticsDataAtom, whitelistedLastVisitedPlpAtom } from 'store/plp.atom'
import { flyoutVisibleAtom } from 'store/flyout.atom'
import { setSearchRecentItemsFromCookieAtom } from 'store/search.atom'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { getPurchasedAmount } from 'toro/helpers/fetchKlarna'
import { addToViewedProductsAtom, viewedProductsAtom } from 'store/viewed-products.atom'
import { ATB_DRAWER_ACTIONS, useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import useNeutralSizingData from 'toro/hooks/useNeutralSizingData'
import { trackImpression as trackTangiblee } from 'toro/helpers/tangibleeHelper'
import { getSwatchInteractionEventPrefix } from 'toro/helpers/getSwatchInteractionEventPrefix'
import useMonetateTrack from 'toro/hooks/useMonetateTrack'
import { promotionalPricingData } from 'toro/components/product/PriceInfo/helper'
import { useLoadMiniCartPopover } from 'toro/components/header/MiniCart/useLoadMiniCartPopover'
import getPreferenceConfigValue from 'toro/helpers/getPreferenceConfigValue'
import { reminderInCartAtom } from 'store/add-to-cart-reminder.atom'
import useExperiment from 'toro/hooks/useExperiment'
import {
  miniCartOpenReasonAtom,
  MiniCartOpenReasons,
  visuallySimilarDataAtom,
  isOneCoachTabbedAtom,
  setIsOutletTabAtom,
} from 'store/global.atom'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'
import { getCustomerGroupsFromSession } from 'toro/helpers/menu'
import { getFilterOptions } from 'toro/components/Certona/helpers'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import { addBecauseYouViewedProductsAtom } from 'store/because-you-viewed-products.atom'
import withCorrId from 'helpers/traceability'
import { handleApplePayError } from 'toro/components/PaymentWidget/showPdpErrorHelpers'
import ProductTemplate from 'toro/components/product/ProductTemplate'
import { focusedFilteringAtom } from 'store/search-results.atom'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { addInteractionAtom, Action as MatchingExperienceAction } from 'store/matching-experience'
import useMetaLanderPDP from 'toro/hooks/useMetaLanderPDP'
import { addOrUpdatePickupItem } from 'toro/helpers/addOrUpdatePickupItem'
import { useAddToCartPreviewDrawer } from 'toro/components/AddToCartPreviewDrawer/useAddToCartPreviewDrawer'

const StickyContent = dynamic(() => import('./StickyContent'))
const StickyAdaptiveContent = dynamic(() => import('./StickyAdaptiveContent'))

const EnjectCustomizationScript = dynamic(
  () => import('toro/components/EnjectCustomizationScript'),
  {
    ssr: false,
  }
)

function ProductMainSection() {
  // Jotai atoms replacing ProductContext
  const isQuickView = useAtomValue(isQuickViewAtom)
  const [quickViewedProduct, setQuickViewedProduct] = useAtom(quickViewedProductAtom)
  const setShowSizeGuidePopUp = useUpdateAtom(isSizeGuidePopUpOpenAtom)
  const productData = useAtomValue(productDataAtom)
  const apploading = useAtomValue(appLoadingAtom)
  const originalProductId = useAtomValue(originalProductIdAtom)
  const setProductData = useUpdateAtom(productDataAtom)
  const { isPostAddToCartDesktopEnabled } = useAddToCartPreviewDrawer()

  const router = useRouter()
  const { query: routerQuery, asPath } = router
  const { isPLP } = usePageType()
  const theme = useTheme()
  const applePayErrorOnPdp = useAtomValue(applePayErrorOnPdpAtom)
  const setApplePayErrorOnPdp = useUpdateAtom(setApplePayErrorOnPdpAtom)
  const stickyContainerState = useAtomValue(stickyContainerStateAtom)
  const [isNotifyMeProduct, setIsNotifyMeProduct] = useAtom(isNotifyMeAvailableAtom)
  const [isNotifyMeAvailableBundle, setIsNotifyMeAvailableBundle] = useAtom(
    bundleIsNotifyMeAvailableAtom
  )
  const setFitReview = useUpdateAtom(setFitReviewAtom)
  const setCountryTabIndex = useUpdateAtom(countryTabIndexAtom)
  const [swatchInteractionObj, setSwatchInteractionObj] = useAtom(variationTypeControlInteraction)
  const bundleSelectedSize = useAtomValue(bundleSelectedSizeAtom)
  const bundleSelectedWidth = useAtomValue(bundleSelectedWidthAtom)
  const selectedBundleVariantsData = useAtomValue(selectedBundleVariantsDataAtom)
  const bundleSelectedVariation = useAtomValue(bundleSelectedVariationAtom)
  const bundleOrderingStatus = useAtomValue(bundleOrderingStatusAtom)
  const [onPurposeMaterials, setOnPurposeMaterials] = useState('')
  const { isDesktop, isMobile, isTablet } = useViewportType()
  const { appData } = useContext(PWAContext)
  const { enablePricingPromoUpdates } = appData
  const [miniCartOpenReason, setMiniCartOpenReason] = useAtom(miniCartOpenReasonAtom)
  const isBundleProduct = get(productData, 'isBundleProduct')
  const isPDPTemplateV3 = useExperiment(EXPERIMENTS.PDP_V3)
  const isTangibleeInitialized = useAtomValue(isTangibleeInitializedAtom)
  const isPDPTemplateV3Mobile = isPDPTemplateV3 && isMobile
  const { actions: sessionActions, session, isGuestUser } = useContext(SessionContext)
  const { user, cart } = session
  const analytics = useAnalytics()
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const [fallBackATB, setFallBackATB] = useState(false)
  const [animationATB, setAnimationATB] = useState({ active: false, complete: false })
  const setLastAddedProductToBagAtom = useUpdateAtom(lastAddedProductToBagAtom)
  const setLastAddedProductToBagVariantId = useUpdateAtom(lastAddedProductToBagVariantIdAtom)
  const setKlarnaDetails = useUpdateAtom(setKlarnaDetailsAtom)
  const { selectedNeutralSizingCountry } = useNeutralSizingData()
  const loadMiniCartPopover = useLoadMiniCartPopover()
  const productMasterId = get(productData, 'masterId', get(productData, 'master.ID'))
  const [isBuyNow, setIsBuyNow] = useState(false)
  const [sizeDrawerCta, setSizeDrawerCta] = useState(AlterCtaToShow.EMPTY)

  const [forceLoadingDisplay, setForceLoadingDisplay] = useAtom(forceLoadingDisplayAtom)
  const viewItemRef = useRef(0)
  const [selectionUpdated, setSelectionUpdated] = useAtom(selectionChangedAtom)
  const [productCustomState, setProductCustomState] = useAtom(productCustomStateAtom)
  const resetVisitedPagesCount = useResetAtom(reminderInCartAtom)
  const bundleProductsQty = useAtomValue(bundleVariantsProductsQtyAtom)
  const qvProductAnalyticsData = useAtomValue(qvProductAnalyticsDataAtom)
  const setRecentSearchesAtom = useUpdateAtom(setSearchRecentItemsFromCookieAtom)
  const addToViewedProducts = useUpdateAtom(addToViewedProductsAtom)
  const viewedProducts = useAtomValue(viewedProductsAtom)
  const setIsFirstPDPView = useUpdateAtom(isFirstViewedAtom)
  const setIsAeFirstPDPView = useUpdateAtom(isAeFirstViewedAtom)
  const isProductViewed = useMemo(() => viewedProducts.includes(productMasterId), [productMasterId])

  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const addToBagButtonClickedRef = useRef(false)
  const isFocusedFilteringExperimentEnabled = useExperiment(EXPERIMENTS.FOCUSED_FILTERING)

  // set media from default variant for complete server render of carousel
  const wishlists = useAtomValue(wishlistIdsAtom)
  const updatedWishLists = useAtomValue(updatedWishListAtom)
  const [bopis, runSearchFetch] = useAtom(runSearchFetchAtom)

  const addBecauseYouViewedProducts = useUpdateAtom(addBecauseYouViewedProductsAtom)
  const isBecauseYouViewedCertonaEnabled =
    useExperiment(
      `${EXPERIMENTS.BECAUSE_YOU_VIEWED_PDP}-${EXPERIMENTS.BECAUSE_YOU_VIEWED_PLP}-${EXPERIMENTS.BECAUSE_YOU_VIEWED_PLP_VARIANT_2}`
    ) && isMobile
  const { recommendations: isXgenExperience } = useAtomValue(xgenFeaturesAtom)

  const styles = useMultiStyleConfig('ProductDetailMainSection') || {}
  const quickViewStyles = useMultiStyleConfig('ProductDetailMainSection', { variant: 'quickview' })
  const [addToBagClicked, setAddToBagClicked] = useState({})
  const [inventoryFetchedFrom, setInventoryFetchedFrom] = useState()
  const getActiveMedia = useMemo(() => {
    const isOrderable = get(productData, 'defaultColor.orderable', false)
    const oosEnabled =
      get(productData, 'custom.c_displayIfOOS') ??
      get(productData, 'defaultVariantData.custom.c_displayIfOOS') ??
      get(productData, 'defaultVariationGroupData.custom.c_displayIfOOS')
    return isOrderable || oosEnabled
      ? get(productData, 'defaultColor.media', {})
      : productData?.isBundleProduct && get(productData, 'media')
      ? get(productData, 'media')
      : get(productData, 'media', null) || get(productData, 'colors[0].media', {})
  }, [productData])

  useMonetateTrack({
    isEnabled: !apploading && !isQuickView,
    pageType: 'PDP',
    productId: productMasterId,
  })

  const makeCertonaRequest = useCertonaRequest({
    pagetype: 'addtocart',
    recommendations: isMobile,
    enabled: !isXgenExperience,
  })

  const dispatchToroEvent = useToroEventsDispatch()

  const defaultVariant = productData?.variant?.find?.(
    (item) => item?.id === productData?.master?.defaultVariantID
  )

  const selectedColorSizes = productData?.selectedColor?.sizes || []
  let defaultVariantType = null

  const isProductWithNoOrLimitedSizes =
    productData?.hitType === 'product' || selectedColorSizes.length < 2
  const isProductWithAvailableSizes = selectedColorSizes.length > 0

  if (isProductWithNoOrLimitedSizes || isProductWithAvailableSizes) {
    defaultVariantType = defaultVariant
  }
  const localeData = normalizeLocalizationContent(get(appData, 'locale'))
  const [media, setMedia] = useState(getActiveMedia)
  const [selectedVariant, setSelectedVariant] = useState(defaultVariantType)
  const [selectedVariantData, setSelectedVariantData] = useState()
  const [variationGroupData, setVariationGroupData] = useState(null)
  const [, loading] = useWithLoading(fetchProductDataFromClient)
  const [orderingError, setOrderingError] = useState(null)
  const [userInteracted, setUserInteracted] = useState(null)
  const [widthClicked, setWidthClicked] = useState(false)
  const [sizeClicked, setSizeClicked] = useState(false)
  const [colorClicked, setColorClicked] = useState(false)
  const [bundleAddAllToBagClicked, setBundleAddAllToBagClicked] = useState(false)
  const [bundleAddAllToBagError, setBundleAddAllToBagError] = useState(false)

  const membershipTooltipContent = get(appData, 'membership.contentSlots.membershipTooltip')
  const [selectedQty, setSelectedQty] = useState(1)
  const [maxQuantityError, setMaxQuantityError] = useState(false)
  const [btnDisable, setBtnDisable] = useState(false)
  const [maxQtyErrorMsg, setMaxQtyErrorMsg] = useState(null)
  const [itemsNotAvailableMsg, setItemsNotAvailableMsg] = useState(null)
  const [itemsNotAvailableMsgFlag, setItemsNotAvailableMsgFlag] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const isFlyoutDrawerVisible = useAtomValue(flyoutVisibleAtom)
  const isLoggedIn = !!get(session, 'user.userEmail')

  const hitType = useMemo(() => get(productData, 'hitType'), [productData])
  const userPostalCode = useMemo(() => get(user, 'postal_code'), [session])
  const siteId = get(appData, 'siteId')
  const limitedProductData = get(appData, 'limitedProductData', false)
  const isSubBrandActive = get(appData, 'isSubBrandActive', false)
  const subBrandName = get(appData, 'subBrand')

  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const isProductFullyOOS = useAtomValue(isProductFullyOOSAtom)
  const isCompareToolEnable =
    useExperiment(
      `${EXPERIMENTS.COMPARISON_TOOL_EXPERIENCE}-${EXPERIMENTS.TAB_COMPARISON_TOOL_EXPERIENCE}`
    ) && isMobile

  const benefitsModuleData = get(productData, 'benefitsModule')
  const setIsOutletTab = useUpdateAtom(setIsOutletTabAtom)
  const isOneCoachTabbedHeaderActive = useAtomValue(isOneCoachTabbedAtom)
  const isOutletProduct = get(productData, 'custom.c_isOutlet', false)

  const {
    toggleSiteFeatures: {
      stickyAddToCartEnabled,
      stickyAddToCartPriceEnabled,
      showBundleOnPLP: showBundleSave,
    },
    sfraUnifiedFeatureCartridge: { sfraEnableFindInStoreV4 },
    priceSitePreferences: { hideListPrice },
    oneCoach: { oneCoachTabConfig = {} },
  } = usePreferenceNew({
    ToggleSiteFeatures: [
      'stickyAddToCartEnabled',
      'stickyAddToCartPriceEnabled',
      'showBundleOnPLP',
    ],
    'SFRA Unified Feature Cartridge': ['sfraEnableFindInStoreV4'],
    priceSitePreferences: ['hideListPrice'],
    oneCoach: ['oneCoachTabConfig'],
  })
  const isOutletSubCategory = oneCoachTabConfig?.isOutletSubCategory ?? false
  const bopisZipCode = getZipCode(siteId) || userPostalCode

  const preSelectedMaterialForMegaPDP = get(productData, 'preSelectMaterial') || null

  const addToCartPartialAddQuantity = useRef()

  const [focusedFiltering, setFocusedFiltering] = useAtom(focusedFilteringAtom)

  // Moved the state to parent from Product variation control in order to persist the same data in sticky and non-sticky product variant component.
  const defaultVariantGroup = productData?.variationGroup?.find?.(
    (item) => item?.id === productData?.master?.defaultVariantGroupID
  )

  const defaultVariationAttrs = defaultVariantGroup?.variationAttributes
  const { variationValues } = productData?.selectedVariantData || productData?.defaultVariant || {}
  const preSelectedWidthValue = isSW() && 'B'

  const defaultSelectedWidth = findAttributeByType(defaultVariationAttrs, 'width')?.values?.find(
    (attribute) => {
      return attribute.value === variationValues?.width
    }
  )
  const preSelectedWidth =
    preSelectedWidthValue &&
    findAttributeByType(defaultVariationAttrs, 'width')?.values?.find(
      (attr) => attr?.value === preSelectedWidthValue
    )

  const defaultSelectedSize = findAttributeByType(defaultVariationAttrs, 'size')?.values?.find(
    (attribute) => {
      return attribute.value === variationValues?.size
    }
  )

  const [selectedColor, setSelectedColor] = useState(productData?.selectedColor)
  const setSelectedColorV5 = useUpdateAtom(setSelectedColorAtom)

  useEffect(() => {
    if (selectedColor) {
      setSelectedColorV5({ id: selectedColor?.id, masterId: selectedColor?.masterId })
    }
  }, [selectedColor])

  let initialSize
  if (
    !isQuickView &&
    (hitType?.toLowerCase() === 'variant' ||
      hitType?.toLowerCase() === 'product' ||
      !isEmpty(productData?.selectedVariantData))
  ) {
    initialSize =
      variationValues?.size && defaultSelectedSize
        ? { ...defaultSelectedSize, id: defaultSelectedSize.value }
        : null
  } else if (findAttributeByType(defaultVariationAttrs, 'size')?.values?.length === 1) {
    initialSize = variationValues?.size ? defaultSelectedSize : null
  }
  const [selectedSize, setSelectedSize] = useState(initialSize)
  const [selectedWidth, setSelectedWidth] = useState(
    preSelectedWidth ||
      (variationValues?.width && defaultSelectedWidth
        ? { ...defaultSelectedWidth, id: defaultSelectedWidth.value }
        : null)
  )

  const selectedSizeAtomValue = useAtomValue(selectedSizeAtom)
  const selectedSizeValue =
    selectedSize?.id ||
    selectedSize?.value ||
    selectedSize?.text ||
    selectedSize?.name ||
    selectedSizeAtomValue

  const addInteractionForEnhancedMatchingExperience = useUpdateAtom(addInteractionAtom)
  const filterCategory = get(productData, 'custom.c_filterCategory')

  useEffect(() => {
    addInteractionForEnhancedMatchingExperience({
      action: MatchingExperienceAction.PDP_VISIT,
      value: filterCategory,
    })
  }, [filterCategory])

  useEffect(() => {
    if (
      preSelectedWidth &&
      !colorClicked &&
      !sizeClicked &&
      !widthClicked &&
      !(hitType?.toLowerCase() === 'variant' || hitType?.toLowerCase() === 'product')
    ) {
      setSelectedWidth(preSelectedWidth)
    }
  }, [preSelectedWidth])

  useEffect(() => {
    if (!isFlyoutDrawerVisible && isLoggedIn && modalOpen) {
      const url = `${asPath}${asPath?.includes?.('?') ? '&' : '?'}ptr=12`
      window.location.replace(url)
      return
    }
    if (!isFlyoutDrawerVisible) {
      setModalOpen(false)
    }
  }, [isFlyoutDrawerVisible])

  const setBundleErrors = useUpdateAtom(bundleErrorsAtom)

  const isCustomized = get(selectedColor, 'isCustomized', false)
  const isMonogrammed = get(selectedColor, 'isMonogrammed', false)

  const selectedVG = useMemo(
    () =>
      productData?.variationGroup?.find((item) => {
        const variationAttributes = item?.variationAttributes
        const variationColor = findAttributeByType(variationAttributes, 'color')?.values
        const selectedColorId =
          isCustomized || isMonogrammed ? selectedColor?.baseProductColor : selectedColor?.id
        const isSelectedColorExists = variationColor?.find(
          (item) => item?.value === selectedColorId
        )
        if (isSelectedColorExists) {
          if (isMegaPDPEligible) {
            if (item?.masterId === selectedColor?.masterId) {
              return item
            }
            return undefined
          }
          return item
        }
        return undefined
      }),
    [selectedColor, productData?.variationGroup]
  )

  const selectedVariationAttributeMap = useMemo(() => {
    return {
      color:
        isCustomized || isMonogrammed
          ? selectedColor?.baseProductColor
          : selectedColor?.id || selectedColor?.value,
      size: selectedSizeValue,
      width: selectedWidth?.id || selectedWidth?.value,
    }
  }, [selectedColor, selectedSize, selectedSizeValue, selectedWidth])

  const newSelectedVariant = useMemo(() => {
    const variants = isQuickView
      ? quickViewedProduct?.variant || quickViewedProduct?.variants || []
      : productData?.variant || productData?.variants || []

    return variants?.find((item) => {
      return (
        Object.entries(item?.variationValues).every(([key, value]) => {
          return value === selectedVariationAttributeMap[key]
        }) && item?.masterId === selectedColor?.masterId
      )
    })
  }, [
    productData?.variant,
    selectedVariationAttributeMap,
    productData?.variants,
    quickViewedProduct?.variant,
    quickViewedProduct?.variants,
  ])

  const selectedVariantOrVG = newSelectedVariant || selectedVG
  useEffect(() => {
    if (
      focusedFiltering?.categoryID &&
      isMobile &&
      isFocusedFilteringExperimentEnabled &&
      selectedVariantOrVG
    ) {
      setFocusedFiltering({
        categoryID: focusedFiltering?.categoryID,
        value: {
          color: get(selectedVariantOrVG, 'customAttributes.c_aiColorBucket'),
          filterCategory: selectedVariantOrVG?.customAttributes?.c_filterCategory,
        },
      })
    }
  }, [selectedColor, selectedVariantOrVG, isMobile, focusedFiltering?.categoryID])
  const klarnaDetails = useMemo(() => {
    if (isBundleProduct) {
      return false // TODO: fix early return
    }
    if (productData?.klarnaDetailsMap) {
      const { currentPrice } = getPurchasedAmount(selectedVariantOrVG)
      const details = productData?.klarnaDetailsMap?.[currentPrice]
      setKlarnaDetails(details || null)
      return details
    }
  }, [selectedVariantOrVG, setKlarnaDetails, isBundleProduct, productData?.klarnaDetailsMap])

  const productMaxOrderableQty =
    get(newSelectedVariant, 'customAttributes.c_maxOrderableQuantity') ||
    get(selectedVariant, 'customAttributes.c_maxOrderableQuantity', 0)

  useEffect(() => {
    if (newSelectedVariant) {
      setSelectedVariantData(newSelectedVariant)
    }
  }, [newSelectedVariant])

  useEffect(() => {
    if (newSelectedVariant?.id) {
      runSearchFetch({
        productId: newSelectedVariant?.id,
        promise: getSearchResults(newSelectedVariant?.id, bopisZipCode),
      })
    }
  }, [newSelectedVariant?.id, bopisZipCode])

  useEffect(() => {
    if (addToBagClicked?.isAddTobagClickedForbundleProductItem) {
      const selectedVariantId = addToBagClicked?.selectedBundleVariant?.id
      const selectedBundleVG = productData?.bundleProductData?.find((item) => {
        const selectedVariationGroup = item?.variationGroup?.find(
          (variationGroup) => variationGroup?.variantsAssigned?.indexOf(selectedVariantId) > -1
        )
        item.selectedVariationGroupData = selectedVariationGroup
        if (selectedVariationGroup) {
          return item
        }
        return undefined
      })
      const selectedVariationGroupData = selectedBundleVG?.selectedVariationGroupData
      const selectedBundleVGInventory = Object.values(selectedBundleVariantsData)?.find(
        (item) => item?.id === selectedVariationGroupData?.id
      )
      const gaParameters = getGABundleProduct({
        product: {
          eventLocation: `${isMegaPDPEligible ? 'mega pdp' : 'pdp'} regular`,
          bundleData: [
            {
              ...selectedVariationGroupData,
              selectedVariant: addToBagClicked?.selectedBundleVariant,
              variationValues: addToBagClicked?.selectedBundleVariant?.variationValues,
              inventory: selectedBundleVGInventory,
              quantity: addToBagClicked?.selectedQty,
            },
          ],
          isBundleProductItems: true,
        },
      })
      analytics?.send('addToCart', {
        ...gaParameters,
      })
      setAddToBagClicked({ isAddTobagClickedForbundleProductItem: false })
    }
  }, [addToBagClicked?.isAddTobagClickedForbundleProductItem])

  const [isFlyoutOpen, setFlyoutOpen] = useState(false)
  const [sizingRange, setSizingRange] = useState(0)
  const [widthRange, setWidthRange] = useState(0)
  const [loadMapper, setLoadMapper] = useState(true)

  const [{ drawerVisible }, setDrawerState] = useDrawerAtom()

  const [customizerVariants, setCustomizerVariants] = useState([])
  const [recipes, setRecipes] = useState([])

  const url = get(productData, 'url', '#')
  const [activeUrl, setActiveUrl] = useState(url)
  const [stickyContainerComp, setStickyContainerComp] = useState([])
  const name = get(productData, 'name')
  const defaultVariantData = get(productData, 'defaultVariantData')
  const defaultVariationGroupData = get(productData, 'defaultVariationGroupData')
  const instockText = get(productData, 'instockText')

  const getDefaultOrderingStatus = useMemo(() => {
    if (isBundleProduct) return ORDERING_STATUS.addToBag

    const { isMegaPDPEligible } = get(productData, 'megaPDPEligibleOptions', {})
    if (!selectedSizeValue) {
      const colorVariants = get(productData, 'colors', [])
      const hitType = get(productData, 'hitType')
      let selectedColorId = ''

      if (selectedColor) {
        selectedColorId = selectedColor.id
      } else {
        if (hitType === 'master') {
          selectedColorId = get(productData, 'defaultColor.id')
        } else if (hitType === 'product' || hitType === 'variation_group') {
          const reqId =
            get(productData, 'requestedVariantId') ||
            get(productData, 'requestedId') ||
            get(productData, 'id')
          if (isString(reqId)) {
            const splitIds = reqId?.split(' ')
            if (splitIds?.length >= 2) {
              selectedColorId = splitIds[1]
            }
          }
        }
      }

      if (isMegaPDPEligible) {
        return colorVariants.find((color) => color?.vgId === selectedColor?.vgId)?.orderable
          ? ORDERING_STATUS.addToBag
          : ORDERING_STATUS.soldOut
      }
      return colorVariants.find((color) => color?.id === selectedColorId)?.orderable
        ? ORDERING_STATUS.addToBag
        : ORDERING_STATUS.soldOut
    }

    return selectedSize?.orderable ? ORDERING_STATUS.addToBag : ORDERING_STATUS.soldOut
  }, [productData, selectedSize, selectedSizeValue, selectedColor])

  const [orderingStatus, setOrderingStatus] = useState(getDefaultOrderingStatus)
  const [selectedMaterial, setSelectedMaterial] = useState(preSelectedMaterialForMegaPDP)

  const isAddToCartDrawerEnabled = get(appData, 'isAddToCartDrawerEnabled', false)

  const checkIfCommingSoonCustomTextExists = (productData, { field = '' } = {}) => {
    const queryHead = field ? `${field}.` : ''

    return (
      get(productData, `${queryHead}customAttributes.c_inStockCustomText`, '') ||
      get(productData, `${queryHead}customAttributes.c_soldOutCustomText`, '')
    )
  }

  const getIfCommingSoonProduct = (productData, selectedVariantData = null, isMaster = false) => {
    if (isMaster) {
      return (
        checkIfCommingSoonCustomTextExists(productData, { field: 'defaultVariantData' }) ||
        checkIfCommingSoonCustomTextExists(productData, { field: 'defaultVariationGroupData' })
      )
    }

    return checkIfCommingSoonCustomTextExists(selectedVariantData || productData)
  }

  const isCommingSoonProduct = getIfCommingSoonProduct(
    selectedVG,
    selectedVariantData
    //isMasterProduct
  )

  const postponedAddToBagCall = useRef()

  useEffect(() => {
    if (drawerVisible || miniCartOpenReason) {
      setFlyoutOpen(false)
    }
  }, [drawerVisible, miniCartOpenReason])

  //When coming from PLP to PDP (data is not fully fetched for mega-pdp)
  useEffect(() => {
    setSelectedMaterial(preSelectedMaterialForMegaPDP)
  }, [preSelectedMaterialForMegaPDP])

  useEffect(() => {
    if (isFlyoutOpen) {
      toggleBodyScroll(false)
    } else {
      toggleBodyScroll(true)
    }
  }, [isFlyoutOpen])

  const brand = get(appData, 'brand')

  /* After the PDP Context Providers are refactored we need to switch to reading the product ID from "productIdAtom"
     instead.
     When reading it from the atom we're one render cycle "behind" reading it directly from "productData". Once all
     Context Providers are converted we'll investigate the impact of switching to "productIdAtom". Since at that time
     the product data will be part of JotaiProviderPDP, we shouldn't see any "desync" between rendering cycles anymore.
   */
  const productId = get(productData, 'id')

  const { masterId } = parseProductId(get(productData, 'masterId')) || get(productData, 'master.ID')
  const skuId = getCleanedSku(
    `${masterId} ${selectedColor?.id}` ||
      selectedVariant?.id ||
      productData?.defaultVariant?.productId ||
      ''
  )
  const { isStickyHeader, isTransparentStickyHeader } = useHeaderPositionPref()
  const [isHeaderHeight] = useAtom(isHeaderHeightAtom)

  const { formatMessage } = useIntl()
  const CART_UPDATE_FAILED_MSG = formatMessage({
    id: 'pdp.somethingWentWrongMsg',
    defaultMessage: 'Something went wrong, please try again',
  })
  const pdpExpecteShipdayMessageMarkup =
    get(productData, 'pdpExpectedShipdayMessage.c_body.default.markup') ||
    formatMessage({ id: 'pdp.expectedShipDate', defaultMessage: 'Expected Ship Date:' })

  const closerLookHeader = get(productData, 'custom.c_closerLookHeader')
  const closerLookText = get(productData, 'custom.c_closerLookText')
  const bundleModuleProperties = get(productData, 'associatedBundle.bundleProperties')

  const membershipExclusiveProduct = get(
    productData,
    'master.customAttributes.c_isMemberExclusive',
    ''
  )

  const enableGiftWrappingAndMessage = usePreference({
    groupId: 'giftWrapping',
    preferenceId: 'enableGiftWrappingAndMsg',
    siteId,
    defaultValue: false,
  })

  const closerLookImagePrefrences = usePreference({
    groupId: 'closerLookAttributes',
    preferenceId: 'closerLookImageSuffix',
  })

  const maxQtyRestrictionEnabledPreference = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'enableMaxQtyRestriction',
  })

  const maxOrderQtyPreference = usePreference({
    groupId: 'CartCheckoutSettings',
    preferenceId: 'defaultMaxOrderQuantity',
  })

  const hideQuantitySelector = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'hideQuantityDropdown',
  })

  const stickyAddToCartPrefObj = getPreferenceConfigValue(
    stickyAddToCartEnabled,
    isSubBrandActive,
    isDesktop
  )

  const stickyAddToCartPriceEnabledValue = getPreferenceConfigValue(
    stickyAddToCartPriceEnabled,
    isSubBrandActive,
    isDesktop
  )

  const isStickyAddToCartEnabled = !get(stickyAddToCartPrefObj, 'No', true)
  const isStickyAddToCartBelowTheFoldEnabled = get(
    stickyAddToCartPrefObj,
    'stickyAddToBagBelowFold',
    false
  )

  const isStickyAddToBagUponLandEnabled = get(
    stickyAddToCartPrefObj,
    'stickyAddToBagUponLand',
    false
  )

  const persistSoldOutPreference = usePreference({
    groupId: 'badging',
    preferenceId: 'persistSoldOut',
  })
  const finalSalePrefrence = usePreference({
    groupId: 'badging',
    preferenceId: 'finalSaleDiscountPercentage',
  })

  const SfraUnifiedFeatureCartridgePref = usePreference({
    groupId: 'SFRA Unified Feature Cartridge',
    preferenceId: 'sfraEnableOverlayFindInStore',
  })

  const isKateSpade = isKS()

  const onPurposeBadgeImage = usePreference({
    groupId: 'badging',
    preferenceId: 'onPurposeBadgeImage',
    siteId,
  })

  const envImpactModalHeadline = usePreference({
    groupId: 'coachtopia',
    preferenceId: 'envImpactModalHeadline',
  })?.value?.find?.((pref) => pref.locale === localeData?.locale?.replace?.('-', '_'))?.headline

  const onPurposeMaterialsContentAssetId = useMemo(
    () =>
      get(selectedVariantData, 'custom.c_onPurposeMaterials') ||
      get(productData, 'custom.c_onPurposeMaterials') ||
      get(productData, 'masterProductData.custom.c_onPurposeMaterials', ''),
    [selectedVariantData, productData]
  )

  useEffect(() => {
    if (onPurposeMaterialsContentAssetId) {
      fetchContentAssetForOnPurpose(onPurposeMaterialsContentAssetId)
        .then((data) => {
          setOnPurposeMaterials(data)
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }, [onPurposeMaterialsContentAssetId])

  const onPurposeProps = useMemo(
    () => ({
      isOnPurposeEnabled:
        get(selectedVariantData, 'custom.c_isOnPurposeEnabled') ||
        get(productData, 'custom.c_isOnPurposeEnabled') ||
        get(productData, 'masterProductData.custom.c_isOnPurposeEnabled', false),
      onPurposeMaterials,
      isKateSpade,
      onPurposeBadgeImage,
    }),
    [brand, productData, selectedVariantData, onPurposeMaterials, onPurposeBadgeImage]
  )

  const DisplayBopisCTA = getSiteValueFromPref(SfraUnifiedFeatureCartridgePref, siteId, false)
  const customizerPrefernceArray = usePreferenceGroup({ groupId: 'Customizer' })

  const customizerPrefernce = customizerPrefernceArray.reduce((obj, pref) => {
    return { ...obj, [pref.id]: getSiteValueFromPref(pref, siteId) }
  }, {})

  const isCustomizerPrefernceEnabled =
    customizerPrefernce?.CustomizerEnabled?.default ||
    customizerPrefernce?.CustomizerMonogrammingEnabled?.default

  const bopisAllowedCustomerGroupsPreference = usePreference({
    groupId: 'StoreLocator Configs',
    preferenceId: 'bopisAllowedCustomerGroups',
  })

  const bopisAllowedCustomerGroups = getSiteValueFromPref(
    bopisAllowedCustomerGroupsPreference,
    siteId,
    []
  )

  const userCustomerGroups = getCustomerGroupsFromSession(session)

  const isBopisAllowedByCustomerGroups =
    bopisAllowedCustomerGroups?.length === 0 ||
    intersection(bopisAllowedCustomerGroups, userCustomerGroups)?.length > 0

  const persistSoldOutValue = getSiteValueFromPref(persistSoldOutPreference, siteId, false)

  const isQuantitySelectorEnable =
    getSiteValueFromPref(hideQuantitySelector, siteId, false) ||
    selectedColor?.isCustomized ||
    selectedColor?.isMonogrammed

  const enableMobileAddToBagPreference = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'enableMobileAddToBagButton',
  })

  const enableMobileAddToBagSiteValue = getSiteValueFromPref(
    enableMobileAddToBagPreference,
    siteId,
    false
  )

  const stickyATCvarDrawerAttrPreference = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'stickyATCvarDrawerAttr',
  })

  const stickyATCvarDrawerAttr = getSiteValueFromPref(
    stickyATCvarDrawerAttrPreference,
    siteId,
    false
  )

  const maxQtyRestrictionEnabled = getSiteValueFromPref(
    maxQtyRestrictionEnabledPreference,
    siteId,
    false
  )
  const closerLookImage = getSiteValueFromPref(closerLookImagePrefrences, siteId, false)
  const maxOrderQty = getSiteValueFromPref(maxOrderQtyPreference, siteId, 5)

  const cartItems = get(session, 'cart.product_items', [])

  const cartQuantity = cartItems && cartItems.find((item) => item?.product_name === name)?.quantity

  useLastSeenCookie({ appData, pageData: productData, originalProductId })

  useEffect(() => {
    setRecentSearchesAtom(productData?.id)
    setIsFirstPDPView(!isProductViewed)
    addToViewedProducts(productMasterId)
    return () => {
      setIsFirstPDPView(RESET)
      setIsAeFirstPDPView(RESET)
    }
  }, [productData?.id])

  const imageArr = useMemo(() => {
    if (productData?.isServerSide && selectedColor) {
      return get(selectedColor, 'media.full', [])
    }
  }, [productData?.isServerSide, selectedColor])

  const closerLookImageSrc = imageArr?.find((item) =>
    item?.src?.toLowerCase().endsWith(`_${closerLookImage}`)
  )?.src

  const isSustainabilityIconExpEnabledPref = usePreference({
    groupId: 'sustainabilityIconPrefs',
    preferenceId: 'SustainabilityIconOnImage',
  })

  const isSustainabilityModuleEnabledPref = usePreference({
    groupId: 'sustainabilityIconPrefs',
    preferenceId: 'SustainabilityModuleToggle',
  })

  const isSustainabilityIconExpEnabled = getSiteValueFromPref(
    isSustainabilityIconExpEnabledPref,
    siteId,
    false
  )

  const isSustainabilityModuleEnabled = getSiteValueFromPref(
    isSustainabilityModuleEnabledPref,
    siteId,
    false
  )

  const sustainabilityIconsData = get(productData, 'filteredSustainabilityData', [])

  // const controller = useRef()
  // const cancelRequest = () => controller.current && controller.current?.abort()
  const { availableColors, availableWidths, availableSizes, availableAndOrderableVariants } =
    useMemo(
      () =>
        getVariantInfo(productData, {
          selectedColor,
          selectedSize,
          selectedWidth,
        }),
      [productData, selectedColor, selectedSize, selectedWidth]
    )

  function handleScrollOnErrorStickyATB(isSticky) {
    const addToCartCTA = document.getElementById('add-to-cart')
    const headroomHeight = isStickyHeader || isTransparentStickyHeader ? isHeaderHeight : 0
    if (isSticky && addToCartCTA) {
      window.scrollTo({
        top: addToCartCTA.offsetTop - headroomHeight,
      })
    }
  }

  const showAddToCartDrawer = useCallback(
    (quantity, partialAdded, isAddToCartDrawerDisableCallback) => {
      if (!isAddToCartDrawerEnabled) {
        isAddToCartDrawerDisableCallback?.()
        return
      }

      const variantId = selectedVariant?.id || newSelectedVariant?.id

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
        setMaxQuantityError(false)
      }
      setDrawerState({
        type: ATB_DRAWER_ACTIONS.SET_VISIBLE,
        payload: {
          drawerVisible: !isBuyNow,
          variantId: variantId,
        },
      })
      //setFullscreenLoading(false)
    },
    [isBuyNow, isAddToCartDrawerEnabled, newSelectedVariant?.id, selectedVariant?.id]
  )

  const getIsNotifyMeAvailable = (data) => {
    return get(data, 'c_isNotifyMeAvailable', false)
  }

  const isCustomizedProduct = selectedColor?.isCustomized || selectedColor?.isMonogrammed

  useEffect(() => {
    if (!apploading) {
      setFullscreenLoading(false)
    }
  }, [apploading, productData?.id])

  useEffect(() => {
    if (!apploading) {
      setFullscreenLoading(forceLoadingDisplay || (!!userInteracted && !!loading))
    }
  }, [userInteracted, loading, forceLoadingDisplay, isBundleProduct, apploading])

  const sourceCodeGroupId = useMemo(
    () => get(session, 'user.sourceCodeGroupID', get(routerQuery, 'src')),
    [session]
  )

  useEffect(() => {
    setBtnDisable(false)
    setMaxQuantityError(false)
    setMaxQtyErrorMsg('')
  }, [selectedVariant])

  const fetchInventory = async (vgId) => {
    const includeVariantData = Boolean(
      appData?.limitedProductData && !productData?.vgFetched?.[vgId]
    )
    const query = serialize({
      vgId,
      includeVariantData,
    })
    try {
      const fetchWithCorrId = withCorrId()
      const response = await fetchWithCorrId(getAPIURL(`/inventory${query}`))
      const inventoryData = await response.json()
      setFallBackATB(false)
      setForceLoadingDisplay(false)
      const variantsInventory = inventoryData.inventory.variantInventoryData || []
      const variationGroupsInventoryData = inventoryData.inventory.variationGroupInventoryData || []
      const inventoryVariants = get(inventoryData, 'variants', [])
      const modifiedVariants = inventoryVariants.map((variant) => {
        return {
          ...variant,
          url: getProductUrl({
            name: name,
            productId: variant?.id,
            caller: 'inventory variant mapping',
            ...getProductUrlBrandOptions({
              product: variant,
              brandConfig: {
                isSubBrand: isSubBrandActive,
                subBrandName,
              },
            }),
          }),
        }
      })
      const variants = [...(productData?.variant || []), ...(modifiedVariants || [])]

      const klarnaDetailsMap = {
        ...productData?.klarnaDetailsMap,
        ...inventoryData?.klarnaDetailsMap,
      }
      const variationGroups = productData?.variationGroup || []

      const vgFetched = { ...(productData?.vgFetched || {}), [vgId]: true }

      const variant = variants.map((vr) => {
        const inventory = variantsInventory.find((vi) => {
          return vr.id === vi.id
        })
        if (inventory) {
          return { ...vr, inventory, orderable: inventory.orderable }
        }
        return vr
      })

      const { availableColors, availableWidths, availableSizes } = getVariantInfo(
        { ...productData, variant },
        {
          selectedColor,
          selectedSize,
          selectedWidth,
        }
      )

      const variationAttributesMap = {
        color: availableColors,
        size: availableSizes,
        width: availableWidths,
      }

      const variationGroup = variationGroups.map((vg) => {
        const inventory = variationGroupsInventoryData.find((vgi) => {
          return vg.id === vgi.id
        })

        const variationAttributes = vg?.variationAttributes?.map((variationAttribute) => {
          const availableItems = variationAttributesMap[variationAttribute?.id] || []
          return {
            ...variationAttribute,
            values: variationAttribute?.values?.map((val) => {
              return {
                ...val,
                orderable:
                  variationAttribute?.id === 'color'
                    ? inventory?.orderable
                    : availableItems?.includes(val?.value),
              }
            }),
          }
        })
        if (inventory) {
          return {
            ...vg,
            variationAttributes,
            inventory,
            orderable: inventory.orderable,
          }
        }
        return vg
      })

      const colors = get(productData, 'colors', []).map((color) => {
        const currentVariationGroup = variationGroup.find(({ id }) => id === color.vgId)

        if (currentVariationGroup) {
          const variationAttrs = get(currentVariationGroup, 'variationAttributes', [])
          const currentVariationAttr = findAttributeByType(variationAttrs, 'color')

          return {
            ...color,
            orderable: get(currentVariationAttr, `values[0].orderable`, true),
            sizes: findAttributeByType(variationAttrs, 'size')?.values || [],
            widths: findAttributeByType(variationAttrs, 'width')?.values || [],
          }
        }

        return color
      })

      const updatedProductDetails = {
        ...productData,
        variant,
        variationGroup,
        vgFetched,
        klarnaDetailsMap,
        colors,
      }
      if (selectedColor) {
        const selectedColorWithInventory = isMegaPDPEligible
          ? colors.find((color) => color?.vgId === selectedColor.vgId)
          : colors.find((color) => color?.id === selectedColor.id)
        if (
          selectedColorWithInventory &&
          selectedColorWithInventory?.orderable !== selectedColor?.orderable
        ) {
          setSelectedColor({ ...selectedColor, orderable: selectedColorWithInventory?.orderable })
        }
      }

      if (selectedSize && availableSizes?.includes(selectedSizeValue) !== selectedSize?.orderable) {
        setSelectedSize({
          ...selectedSize,
          orderable: availableSizes?.includes(selectedSizeValue),
        })
      }

      if (
        selectedWidth &&
        availableWidths?.includes(selectedWidth?.value) !== selectedWidth?.orderable
      ) {
        setSelectedWidth({
          ...selectedWidth,
          orderable: availableWidths?.includes(selectedWidth?.value),
        })
      }

      isQuickView
        ? setQuickViewedProduct(updatedProductDetails)
        : setProductData(updatedProductDetails)
      setInventoryFetchedFrom(vgId)
    } catch (error) {
      console.error(`Error fetching inventory VG(${vgId})`)
    }
  }

  useEffect(() => {
    if (selectedVG?.id && productData?.isServerSide) {
      if (limitedProductData) {
        setUserInteracted(true)
        setForceLoadingDisplay(true)
        setFallBackATB(true)
        fetchInventory(selectedVG?.id)
      } else {
        fetchInventory(selectedVG?.id)
      }
    }
  }, [selectedVG?.id, productData?.isServerSide])

  useEffect(() => {
    if (!apploading && newSelectedVariant) {
      const currentOrderingStatus = !newSelectedVariant?.inventory
        ? getOrderingStatusByVG(selectedVG)
        : getOrderingStatus(
            newSelectedVariant,
            selectedColor,
            selectedSize,
            selectedWidth,
            apploading
          )

      setOrderingStatus(currentOrderingStatus)
    }
    setVariationGroupData(defaultVariationGroupData)
  }, [
    productData,
    selectedSize,
    selectedColor,
    selectedWidth,
    newSelectedVariant?.inventory?.orderable,
  ])

  function fireViewItem() {
    const gaParametersOverride = {
      product: { quantity: '1' },
    }
    const gaParameters = isBundleProduct ? getGABundleProduct() : getGAProduct(gaParametersOverride)

    if (gaParameters?.isProductExist) {
      analytics.send('viewItem', {
        ...gaParameters,
        selectedVariantId: selectedSku,
        wishlist: wishlists,
      })
      setSelectionUpdated(false)
    }
  }

  function fireViewProductEvent() {
    fireViewItem()
  }

  const isVariantSelected = useMemo(() => {
    return selectedVariantData?.id?.includes(selectedVariant?.id)
  }, [selectedVariantData, selectedVariant])

  const itemId = isBundleProduct ? productData?.bundleProductData?.[0]?.id : selectedVG?.id

  const isInLineRecommenderEnabled = useExperiment(
    EXPERIMENTS.CERTONA_INLINE_RECOMMENDATION_EXPERIENCE
  )

  const similarProductConfigs = get(productData, 'similarProductConfigs')

  const inLineRecommenderInitialFilter = useMemo(() => {
    return isInLineRecommenderEnabled
      ? getFilterOptions(similarProductConfigs?.filters?.[0])
      : undefined
  }, [isInLineRecommenderEnabled, similarProductConfigs])

  const { excludeVisuallySimilarCertona } = useLLMRecommendations()
  const visuallySimilarData = useAtomValue(visuallySimilarDataAtom)
  const shouldShowVisuallySimilarPdp = useAtomValue(shouldShowVisuallySimilarPdpAtom)

  const shouldExcludeLLMFromCertona =
    !isQuickView &&
    isMobile &&
    isTabbedAdaptivePDPEligible &&
    shouldShowVisuallySimilarPdp &&
    excludeVisuallySimilarCertona

  const certonaExItemIdString = useMemo(() => {
    if (!shouldExcludeLLMFromCertona) {
      return itemId
    }

    return `${itemId};${visuallySimilarData?.map((vsItem) => vsItem.ID).join(';')}`
  }, [shouldExcludeLLMFromCertona, visuallySimilarData])

  const entranceCategory = useAtomValue(whitelistedLastVisitedPlpAtom)

  const certonaFilter = useMemo(() => {
    return {
      ...inLineRecommenderInitialFilter,
      ...(entranceCategory ? { entranceCategory: entranceCategory } : {}),
    }
  }, [inLineRecommenderInitialFilter, entranceCategory])

  const [ymalScheme, recentlyViewedScheme, hybridSocialScheme] = useCertonaScheme(
    ['product1_rr', 'product2_rr', 'product3_rr', 'product5_rr'],
    {
      pagetype: 'product',
      filter: certonaFilter,
      itemid: !isQuickView ? itemId : undefined,
      exitemid: certonaExItemIdString,
      enabled:
        (itemId || isBundleProduct) &&
        !selectedColor?.isMonogrammed &&
        !selectedColor?.isCustomized &&
        !isQuickView,
      p3recommendations:
        isTabbedAdaptivePDPEligible ||
        isProductFullyOOS ||
        isCompareToolEnable ||
        !!inLineRecommenderInitialFilter,
    }
  )

  const metaLanderScheme = useMetaLanderPDP()

  useEffect(() => {
    if (itemId && isBecauseYouViewedCertonaEnabled) {
      addBecauseYouViewedProducts({
        product: { count: 1, dateUpdated: Date.now() / 1000, vgId: itemId },
      })
    }
  }, [itemId, isBecauseYouViewedCertonaEnabled])

  useEffect(() => {
    return () => {
      setCountryTabIndex(0)
      setFitReview({})
    }
  }, [])

  useEffect(() => {
    const isNotifyMeAvailableProduct =
      get(productData, 'master.customAttributes.c_isNotifyMeAvailable', false) ||
      (selectedVariantData
        ? getIsNotifyMeAvailable(selectedVariantData?.customAttributes)
        : getIsNotifyMeAvailable(productData?.custom))

    setIsNotifyMeProduct(!!isNotifyMeAvailableProduct)
  }, [selectedVariantData, selectedColor, productData])

  useEffect(() => {
    if (productData?.isServerSide) {
      const searchQuery = parseQueryString(window.location.search)
      const frp = routerQuery?.frp || searchQuery?.frp
      if (frp !== undefined) {
        const frpVariation = productData?.variationGroup?.find?.(
          (item) => item?.variantsAssigned?.includes(frp) || item?.firstVariant === frp
        )
        const frpColorData = frpVariation?.variationAttributes?.find?.(
          (item) => item?.id?.toLowerCase() === 'color'
        )?.values?.[0]
        const frpColorMasterId = get(frpVariation, 'masterId', '')
        const frpColor = frpColorData?.value || frpVariation?.color
        const sizes = getVGSizesfromColor(productData, frpColorData)

        const widths = getVGWidthsfromColor(productData, frpColorData)
        if (frpVariation && !sizes?.length && !widths?.length) {
          setSelectedVariant(frpVariation)
        }
        if (frpColor) {
          const defaultSelectedColorFrp = productData?.colors?.find?.(
            (item) => item?.id === frpColor && item?.masterId === frpColorMasterId
          )
          if (defaultSelectedColorFrp) {
            setSelectedColor(defaultSelectedColorFrp)
          }
          if (productData?.hitType === 'variant' || productData?.sizes?.length === 1) {
            if (frpVariation) {
              setSelectedVariant(frpVariation)
            }
            setSelectedSize(
              variationValues?.size
                ? getItemByIDorFirstItem(variationValues.size, productData?.sizes)
                : null
            )
          }
        }
      } else if ((isPLP || isQuickView) && productData?.defaultColor) {
        setSelectedColor(productData?.defaultColor)
      }

      setMedia(getActiveMedia)
    }
  }, [productData?.isServerSide, isMegaPDPEligible])

  useEffect(() => {
    if (!isBundleProduct) {
      if (
        !apploading &&
        availableAndOrderableVariants?.length === 0 &&
        !defaultVariantData?.orderable &&
        !newSelectedVariant
      ) {
        setOrderingStatus(ORDERING_STATUS.soldOut)
        return
      }
      if (
        (!productData?.isServerSide
          ? selectedVariantData || !selectedVariant
          : newSelectedVariant) ||
        selectedColor
      ) {
        const status =
          (!newSelectedVariant || !newSelectedVariant?.inventory) && productData?.isServerSide
            ? getOrderingStatusByVG(selectedVG)
            : getOrderingStatus(
                !productData?.isServerSide ? selectedVariantData : newSelectedVariant,
                selectedColor,
                selectedSize,
                selectedWidth,
                apploading
              )
        setOrderingStatus(status)
      }
    }
  }, [selectedVariantData, availableAndOrderableVariants, selectedColor])

  useEffect(() => {
    if (isBundleProduct) {
      const statusList = []

      for (const bundleOrderingStatusValue of Object.values(bundleOrderingStatus)) {
        if (bundleOrderingStatusValue?.[0] !== ORDERING_STATUS.notForSale) {
          statusList.push(bundleOrderingStatusValue)
        }
      }

      if (statusList?.some((status) => status?.[0] === ORDERING_STATUS.soldOut)) {
        setOrderingStatus(ORDERING_STATUS.soldOut)
      }
      if (statusList?.every((status) => status?.[0] !== ORDERING_STATUS.soldOut)) {
        setOrderingStatus(ORDERING_STATUS.addToBag)
      }
      if (
        statusList?.some(
          (status) => status?.[0] === ORDERING_STATUS.soldOut && status?.[1] === true
        )
      ) {
        setIsNotifyMeAvailableBundle(true)
      } else {
        setIsNotifyMeAvailableBundle(false)
      }
    }
  }, [productData, selectedBundleVariantsData, bundleSelectedVariation, bundleOrderingStatus])

  useEffect(() => {
    let updatedUrl
    const color = productData?.colors?.find(
      (color) => color?.id == selectedColor?.id && color?.masterId == selectedColor?.masterId
    )
    const regEx = new RegExp(`\\${productData?.masterId}\\b`, 'ig') // \b allows to perform a “whole words only” search
    if (isQuickView) {
      if (selectedVariantData) {
        updatedUrl = get(selectedVariantData, 'url', '#')
      } else if (color) {
        const colorUrl = color?.url
        updatedUrl = colorUrl?.replace(regEx, masterId)
      } else {
        updatedUrl = get(productData, 'url', '#')
      }
      setActiveUrl(updatedUrl)
    }
  }, [selectedColor, selectedVariantData])

  const resetWhiteListedLastVisitedPlp = useResetAtom(whitelistedLastVisitedPlpAtom)

  useEffect(() => {
    return () => {
      resetWhiteListedLastVisitedPlp()
    }
  }, [])

  function checkSelectedSizeAndWidthForBundle() {
    if (isMobile) {
      const unSelectedSizeBundleProducts = Object.values(stickyContainerState || {})?.filter(
        (data) =>
          data?.widthsLength
            ? !(data?.selectedBundleVariantWidth && data?.selectedBundleVariantSize)
            : !data.selectedBundleVariantSize
      )
      setStickyContainerComp(unSelectedSizeBundleProducts)
      setFlyoutOpen(true)
      if (!unSelectedSizeBundleProducts?.length) {
        setFlyoutOpen(false)
        return false
      }
      return true
    }

    const bundleProductData = productData?.bundleProductData || []
    const sortedBundleSizes = new Map()
    const sortedBundleWidths = new Map()

    const productDataSizes = bundleProductData?.filter((item) =>
      item.colors.every((child) => child.sizes.length > 0)
    )

    productDataSizes?.forEach((item) => {
      sortedBundleSizes.set(
        String(item?.masterId ?? item?.id),
        bundleSelectedSize?.[item?.masterId ?? item?.id]
      )
    })

    const productDataWidths = bundleProductData?.filter((item) =>
      item.colors.every((child) => child.widths.length > 0)
    )

    productDataWidths?.forEach((item) => {
      sortedBundleWidths.set(
        String(item?.masterId ?? item?.id),
        bundleSelectedWidth?.[item?.masterId ?? item?.id]
      )
    })

    for (const [masterId, [bundleSelectedVariantSize, sizeLength]] of sortedBundleSizes.entries()) {
      if (sizeLength !== 0 && !bundleSelectedVariantSize) {
        scrollTo({
          top: document.getElementById(masterId)?.offsetTop,
          behavior: 'smooth',
        })
        return true
      }
    }

    for (const [
      masterId,
      [bundleSelectedVariantWidth, widthLength],
    ] of sortedBundleWidths.entries()) {
      if (widthLength !== 0 && !bundleSelectedVariantWidth) {
        scrollTo({
          top: document.getElementById(masterId)?.offsetTop,
          behavior: 'smooth',
        })
        return true
      }
    }
    return false
  }

  const onBundleAddToBagButtonClick = async () => {
    setFullscreenLoading(true)
    if (checkSelectedSizeAndWidthForBundle()) {
      setBundleAddAllToBagClicked(true)
      setFullscreenLoading(false)
      return
    }

    let pidsObj = []

    const bundleProductData = productData?.bundleProductData || []

    const addToCartBundle = new Map()
    const storedAddToCartBundleProducts = []
    bundleProductData?.forEach((product) => {
      const bundleMasterId = product?.masterId
      if (Object.keys(selectedBundleVariantsData)?.includes(bundleMasterId)) {
        const selectedBundleVariantData = { ...selectedBundleVariantsData?.[bundleMasterId] }
        selectedBundleVariantData.bundleVariantQty = bundleProductsQty?.[bundleMasterId]
        const inStockTextForBundleVariant =
          get(selectedBundleVariantData, 'customAttributes.c_inStockCustomText') ||
          get(selectedBundleVariantData, 'instockText')
        if (!inStockTextForBundleVariant) {
          storedAddToCartBundleProducts.push(selectedBundleVariantData)
          addToCartBundle.set(bundleMasterId, selectedBundleVariantsData?.[bundleMasterId])
        }
      }
    })
    const gaParameters = getGABundleProduct({
      product: {
        ...productData,
        eventLocation: `${isMegaPDPEligible ? 'mega pdp' : 'pdp'} regular`,
        bundleData: storedAddToCartBundleProducts,
        quantity: '1',
        isBundleProductItems: true,
      },
    })
    analytics.send('addToCart', {
      ...gaParameters,
    })

    let error = false
    const errorQueue = []

    for (const [master, value] of addToCartBundle.entries()) {
      const productMaxOrderableQty = get(value, 'customAttributes.c_maxOrderableQuantity', 0)

      const maxQty = maxQtyRestrictionEnabled
        ? productMaxOrderableQty <= 0
          ? maxOrderQty
          : productMaxOrderableQty
        : Infinity

      const selectedVariantQty = bundleProductsQty[master]

      const cartItems = get(session, 'cart.product_items', [])
      const productInCart = cartItems.filter(
        (productInCart) =>
          productInCart?.product_id === value?.selectedVariant?.id && !productInCart?.storeName
      )

      const cartQuantity = productInCart.reduce(
        (totalQty, product) => (totalQty += product?.quantity || 0),
        0
      )

      if (cartQuantity && selectedVariantQty > maxQty && cartQuantity === +maxQty) {
        setBundleErrors((bundleErrors) => ({
          ...bundleErrors,
          [master]: { ...bundleErrors[master], maxQuantityError: true },
        }))
        setForceLoadingDisplay(false)
        setFullscreenLoading(false)
        return
      }
      const selectedVariantInventory = getVariantInventoryFromVG(value, value?.selectedVariant)

      const availableQuantity = get(selectedVariantInventory, 'inventory.ats', 0)

      if (availableQuantity < 1) {
        error = true
        setBundleErrors((bundleErrors) => ({
          ...bundleErrors,
          [master]: {
            ...bundleErrors[master],
            itemsNotAvailableError: true,
            payload: {
              itemsNotAvailableMsg: formatMessage({
                id: 'pdp.product.itemNotAvailable',
                defaultMessage: 'This item is no longer available and cannot be added to your bag.',
              }),
            },
          },
        }))
        setBundleAddAllToBagError(true)
        setForceLoadingDisplay(false)
        setFullscreenLoading(false)
        return
      }

      const selectedQuantity = cartQuantity + selectedVariantQty
      const lowestPossibleQtyValue = availableQuantity < maxQty ? +availableQuantity : +maxQty
      const isQuantityNotAvailable = lowestPossibleQtyValue < selectedQuantity
      const quantity = isQuantityNotAvailable
        ? lowestPossibleQtyValue - cartQuantity
        : selectedQuantity - cartQuantity

      if (quantity > 0) {
        pidsObj.push({
          product_id: selectedVariantInventory?.id,
          quantity,
          c_isBundleProductLineItem: true,
          c_fromBundleID: productData?.id,
        })
      }

      if (isQuantityNotAvailable) {
        if (availableQuantity) {
          errorQueue.push(() =>
            setBundleErrors((bundleErrors) => ({
              ...bundleErrors,
              [master]: {
                ...bundleErrors[master],
                maxQuantityError: true,
                itemsNotAvailableError: false,
                payload: {
                  quantity: selectedVariantQty,
                  availableQuantity: quantity,
                },
              },
            }))
          )
        } else {
          errorQueue.push(() =>
            setBundleErrors((bundleErrors) => ({
              ...bundleErrors,
              [master]: {
                ...bundleErrors[master],
                itemsNotAvailableError: true,
                payload: {
                  quantity: selectedVariantQty,
                  availableQuantity: quantity,
                },
              },
            }))
          )
        }
        error = true
      }
      if (quantity < 0) {
        setForceLoadingDisplay(false)
        setFullscreenLoading(false)
        error = true
        return
      }
    }

    const initialValue = 0
    const sumWithProductsQuantity = pidsObj?.reduce(
      (accumulator, currentValue) => accumulator + currentValue.quantity,
      initialValue
    )

    loadMiniCartPopover()

    try {
      await sessionActions.addToCart({
        bundle: pidsObj,
      })

      setFullscreenLoading(false)
      if (isMobile || isTablet || isPostAddToCartDesktopEnabled) {
        showAddToCartDrawer(sumWithProductsQuantity, false, () =>
          setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
        )
      } else if (isDesktop && !error) {
        setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
      } else if (error && errorQueue?.length) {
        while (errorQueue?.length) {
          const errorFromQueue = errorQueue.shift()
          errorFromQueue()
        }
        setBundleAddAllToBagError(true)
      }
    } catch (e) {
      setFullscreenLoading(false)
      console.error(e.message)
    }
  }

  const calculateItemsInCartObj = (selectedQty) => {
    const currentCartItems = get(session, 'cart.product_items', [])

    const variantID = get(selectedVariantData, 'id', '')

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
    } else {
      if (obj?.bagCapacityLeft < selectedQty) {
        handleAddedItemsNotAvailable(selectedQty, obj?.bagCapacityLeft)
        addToCartPartialAddQuantity.current = obj?.bagCapacityLeft
      }
    }
  }

  const onAddToBagButtonClick = async (isSticky) => {
    let quantity
    if (!session?.initialized) {
      postponedAddToBagCall.current = { arg: isSticky }
      setFullscreenLoading(true)
      return
    }
    setItemsNotAvailableMsg('')
    addToCartPartialAddQuantity.current = null

    if (!newSelectedVariant && !isCustomizedProduct) {
      analytics.send('siteError', {
        eventAction: 'add to cart',
        eventLocation: 'product',
        eventLabel: 'select size and width',
      })
      setOrderingError(ORDERING_ERROR.notSelected)
      if (isSticky && !isFlyoutOpen) {
        setFlyoutOpen(true)
      }
      setFullscreenLoading(false)
      return
    }

    const maxQty = maxQtyRestrictionEnabled
      ? productMaxOrderableQty <= 0
        ? maxOrderQty
        : productMaxOrderableQty
      : get(newSelectedVariant, 'inventory.ats', 0)

    const getAddToCartItemObj = calculateItemsInCartObj(selectedQty)
    const isRejectedAddToCartItem = rejectAddToCartItem(
      getAddToCartItemObj,
      selectedQty,
      productMaxOrderableQty
    )

    if (isRejectedAddToCartItem) {
      setMaxQuantityError(true)
      setFullscreenLoading(false)
      return
    }

    if (cartQuantity && selectedQty > maxQty && cartQuantity === +maxQty) {
      setFullscreenLoading(false)
      setMaxQuantityError(true)
      return
    }

    if (
      !selectedColor?.isMonogrammed &&
      !selectedColor?.isCustomized &&
      !productData?.isBundleProduct &&
      isDesktop
    ) {
      makeCertonaRequest({
        itemid: !isXgenExperience
          ? getColorVariantId(
              getMasterId(productData),
              selectedColor?.id || get(productData, 'defaultColor.id'),
              productData?.masterProductData?.variants
            )
          : undefined,
      })
      setLastAddedProductToBagAtom(productData)
      setLastAddedProductToBagVariantId(selectedVariant?.id || newSelectedVariant?.id)
    }

    dispatchToroEvent({ type: 'on-add-to-cart' })

    if (isPDPTemplateV3Mobile) {
      !isBuyNow && setAnimationATB({ active: true, complete: false })
    } else {
      setFullscreenLoading(true)
    }

    function checkIfGiftProductInCart(productInCart) {
      if (enableGiftWrappingAndMessage && (productInCart?.gift || productInCart?.giftMessage)) {
        return false
      }
      return true
    }

    const status = getOrderingStatus(
      newSelectedVariant,
      selectedColor,
      selectedSize,
      selectedWidth,
      apploading
    )
    if (status === orderingStatus) {
      const eventLocation = isBuyNow ? 'buy now pdp cta' : 'add to cart'
      const eventAction = isBuyNow ? 'buy now' : isQuickView ? 'quickview' : 'add to cart button'
      try {
        const cartItems = get(session, 'cart.product_items', [])
        const mappedCartItemByQty = cartItems.reduce(
          (m, item) =>
            m?.set(item?.product_id, {
              ...item,
              quantity: (m?.get(item?.product_id)?.quantity || 0) + item?.quantity,
            }),
          new Map()
        )

        const filterCartItem = Array.from(mappedCartItemByQty, ([, item]) => ({
          ...item,
        }))
        const productInCart = filterCartItem.find(
          (productInCart) =>
            productInCart?.product_id === selectedVariant?.id &&
            !productInCart?.storeName &&
            !productInCart?.c_customizerId &&
            !productInCart?.c_hasEmbellishments &&
            !productInCart?.c_customizerParentId &&
            !productInCart?.c_monogrammedItem &&
            checkIfGiftProductInCart(productInCart)
        )

        const isCartIncludesProduct = !!productInCart
        const availableQuantity = selectedVariantData
          ? get(selectedVariantData, 'inventory.ats', 0) - get(productInCart, 'quantity', 0)
          : selectedQty
        if (availableQuantity < 1 && selectedVariantData) {
          setItemsNotAvailableMsgFlag(true)
          setItemsNotAvailableMsg(
            formatMessage({
              id: 'pdp.product.itemNotAvailable',
              defaultMessage: 'This item is no longer available and cannot be added to your bag.',
            })
          )

          handleScrollOnErrorStickyATB(isSticky)
          setBtnDisable(true)
          setFullscreenLoading(false)
          isPDPTemplateV3Mobile && setAnimationATB({ active: false, complete: false })
          return
        }

        loadMiniCartPopover()

        let isQuantityNotAvailable
        if (maxQtyRestrictionEnabled && isCartIncludesProduct && !isCustomizerProduct) {
          let selectedQuantity
          if (getAddToCartItemObj?.allowAddItemToCart) {
            selectedQuantity =
              getAddToCartItemObj?.filterCartItemByProductId?.quantity + selectedQty
          } else {
            selectedQuantity = productInCart?.quantity + selectedQty
          }
          const lowestPossibleQtyValue =
            get(selectedVariantData, 'inventory.ats', 0) < maxQty
              ? +get(selectedVariantData, 'inventory.ats', 0)
              : +maxQty
          isQuantityNotAvailable = lowestPossibleQtyValue < selectedQuantity
          if (getAddToCartItemObj?.allowAddItemToCart) {
            quantity = isQuantityNotAvailable
              ? productInCart?.quantity + getAddToCartItemObj?.bagCapacityLeft
              : selectedQuantity - getAddToCartItemObj?.bagCapacityLeft
          } else {
            quantity = isQuantityNotAvailable ? lowestPossibleQtyValue : selectedQuantity
          }
          if (!isCustomizedProduct) {
            await sessionActions.updateCart({
              product: selectedVariantData,
              quantity,
              itemId: get(productInCart, 'item_id'),
              productId: newSelectedVariant?.id,
            })
          }

          if (isQuantityNotAvailable) {
            handleAddedItemsNotAvailable(selectedQty, quantity - productInCart?.quantity)
            handleScrollOnErrorStickyATB(isSticky)

            if (availableQuantity) {
              setMaxQuantityError(true)
            } else {
              setItemsNotAvailableMsgFlag(true)
            }
            addToCartPartialAddQuantity.current = quantity - productInCart?.quantity
          }
        } else {
          isQuantityNotAvailable = availableQuantity < selectedQty
          if (maxQtyRestrictionEnabled && getAddToCartItemObj?.allowAddItemToCart) {
            quantity = isQuantityNotAvailable
              ? productInCart?.quantity + getAddToCartItemObj?.bagCapacityLeft
              : productMaxOrderableQty - getAddToCartItemObj?.filterCartItemByProductId?.quantity
          } else {
            quantity =
              isQuantityNotAvailable && availableQuantity > 0 ? availableQuantity : selectedQty
          }

          if (!isCustomizedProduct) {
            await sessionActions.addToCart({
              product: selectedVariantData,
              quantity,
              productId: newSelectedVariant?.id,
            })
          } else {
            await sessionActions.addToCart({
              id: selectedColor?.id,
              location: selectedColor?.location,
            })
          }

          if (isQuantityNotAvailable) {
            handleAddedItemsNotAvailable(selectedQty, availableQuantity)
            handleScrollOnErrorStickyATB(isSticky)

            if (availableQuantity) {
              setMaxQuantityError(true)
            } else {
              setItemsNotAvailableMsgFlag(true)
            }
            addToCartPartialAddQuantity.current = availableQuantity
          }
        }
        !isBuyNow && setFullscreenLoading(false)
        isQuickView && !isQuantityNotAvailable && setQuickViewedProduct(null)
        const realAddedQuantity = !availableQuantity
          ? 0
          : addToCartPartialAddQuantity?.current
          ? addToCartPartialAddQuantity?.current
          : selectedQty
        if (isMobile || isTablet || isPostAddToCartDesktopEnabled) {
          showAddToCartDrawer(realAddedQuantity, addToCartPartialAddQuantity?.current, () =>
            setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
          )
        } else if (
          (!isQuantityNotAvailable || addToCartPartialAddQuantity?.current > 0) &&
          !isBuyNow
        ) {
          setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
        }
        if (!isQuantityNotAvailable || addToCartPartialAddQuantity?.current > 0) {
          const gaParameters = getGAProduct({
            eventLocation: getEventLocation(isSticky),
            product: {
              quantity: realAddedQuantity,
            },
          })

          analytics.send('addToCart', {
            selectedVariantId: selectedSku,
            isBuyNow,
            ...gaParameters,
          })

          if (isBuyNow) {
            gaParameters.products = [gaParameters.product]
            analytics.send('beginCheckout', {
              checkoutOption: 'regular',
              ...gaParameters,
              isBuyNow,
            })
          }

          addToBagButtonClickedRef.current = true
        } else {
          analytics.send('siteError', {
            eventAction: eventAction,
            eventLocation: eventLocation,
            eventLabel: MAX_REACHED_MSG,
          })
        }
      } catch (e) {
        console.error(e) // TODO: proper user feedback on error
        if (e?.message?.includes('ProductItemNotAvailableException')) {
          setOrderingStatus(ORDERING_STATUS.soldOut)
          setIsNotifyMeProduct(true)
          setFullscreenLoading(false)
          return
        } else {
          // TODO: proper user feedback on error
          setMaxQtyErrorMsg(CART_UPDATE_FAILED_MSG)
          handleScrollOnErrorStickyATB(isSticky)
        }
        analytics.send('siteError', {
          eventAction: eventAction,
          eventLocation: eventLocation,
          eventLabel: CART_UPDATE_FAILED_MSG,
        })
      } finally {
        addToCartPartialAddQuantity.current = null
      }
    }
    isPDPTemplateV3Mobile && setAnimationATB({ active: false, complete: true })
    !isBuyNow && setFullscreenLoading(false)
    if (status === ORDERING_STATUS.soldOut) {
      setOrderingError(ORDERING_ERROR.notAvailable)
    }
    setOrderingStatus(status)
  }

  const onPickUpInStoreClick = async (storeId) => {
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
      setMaxQuantityError(true)
      setFullscreenLoading(false)
      return
    }

    if (cartQuantity && maxQty && cartQuantity === +maxQty) {
      setMaxQuantityError(true)
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
        productId: newSelectedVariant?.id,
        storeId,
        quantity,
      })

      if (isMobile || isTablet || isPostAddToCartDesktopEnabled) {
        showAddToCartDrawer(selectedQty, false, () =>
          setMiniCartOpenReason(MiniCartOpenReasons.PickUpInStore)
        )
      } else {
        setMiniCartOpenReason(MiniCartOpenReasons.PickUpInStore)
      }
      setFullscreenLoading(false)
    } catch (e) {
      console.error(e)
      setFullscreenLoading(false)
    }
  }

  useEffect(() => {
    if (session?.initialized && postponedAddToBagCall.current) {
      onAddToBagButtonClick(postponedAddToBagCall.current?.arg)
      postponedAddToBagCall.current = null
    }
  }, [session.initialized])

  const pageType = get(productData, 'pageType')

  const { tulipEnabled, tulipConfigData } = useTulipLiveConnect(
    pageType,
    get(productData, 'tulipSocialMedia["liveConnect-StylingAdvice-new"].content')
  )

  useEffect(() => {
    if (window.tuliplivechat && tulipConfigData?.globalTulipLiveChat) {
      const isChatActive = window.tuliplivechat?.isConversationActive()
      window.tuliplivechat?.showChatBubble(tulipEnabled && isChatActive)
    }
  }, [tulipEnabled, tulipConfigData?.globalTulipLiveChat])

  const addDecimal = (number, decimals = 2) => {
    return String(number?.toFixed(decimals) || '0')
  }

  function getGAPrice() {
    const dohDodPricing = promotionalPricingData(selectedVariantOrVG)
    const priceObj = get(selectedVariantOrVG, 'pricingInfo[0]', {})
    const hasTypeRange = priceObj?.type === 'range'
    const priceObject = hasTypeRange ? priceObj.max : priceObj

    const salePrice =
      get(dohDodPricing, 'prices.value') ||
      get(priceObject, 'sales.value') ||
      get(priceObject, 'list.value')
    const listPrice = get(priceObject, 'list.value') || get(priceObject, 'sales.value')

    const discount = addDecimal(listPrice - salePrice)

    return {
      price: addDecimal(salePrice),
      net_price: addDecimal(salePrice),
      was_price: addDecimal(listPrice),
      item_discount: discount,
      list_price: addDecimal(listPrice),
    }
  }

  function getBopisInfo(gtmBopisInfo) {
    const isStoreAvailable = gtmBopisInfo?.data?.stores?.find(
      (store) => !!get(store, 'storeAvailability.[0].IN_STOCK')
    )
    let eventLocation = isQuickView ? 'quickview' : 'product'
    if (eventLocation === 'quickview') {
      return undefined
    }
    if (pageType?.toLowerCase() === 'pdp' && bopisZipCode && isFindInStorePickup) {
      return { is_bopis_pickup_available: isStoreAvailable ? '1' : '0' }
    } else {
      return undefined
    }
  }

  function getMonogramData() {
    const canMonogram =
      get(newSelectedVariant, 'customAttributes.c_isMonogrammable', null) ??
      get(selectedVariantOrVG, 'customAttributes.c_isMonogrammable')
    return {
      is_monogram_available: canMonogram ? '1' : '0',
      is_monogramable: canMonogram ? '1' : '0',
    }
  }

  function getGABundlePrice(selectedBundlePriceVariant, productData) {
    const bundlePriceObj = get(productData, 'set.pricingInfo[0]', {})
    const priceObj = get(selectedBundlePriceVariant, 'pricingInfo[0]', {})
    const hasTypeRangeBundle = bundlePriceObj?.type === 'range'
    const hasTypeRange = priceObj?.type === 'range'
    const priceObject = hasTypeRange ? priceObj.max : priceObj
    const bundlePriceObject = hasTypeRangeBundle ? bundlePriceObj?.max : bundlePriceObj

    const salePrice = get(priceObject, 'sales.value') || get(priceObject, 'list.value')
    const listPrice = get(priceObject, 'list.value') || get(priceObject, 'sales.value')
    const salePriceBundle =
      get(bundlePriceObject, 'sales.value') || get(bundlePriceObject, 'list.value')
    const listPriceBundle =
      get(bundlePriceObject, 'list.value') || get(bundlePriceObject, 'sales.value')
    const discount = addDecimal(listPrice - salePrice)
    const bundleDiscount = addDecimal(listPriceBundle - salePriceBundle)

    return {
      price: addDecimal(salePrice),
      net_price: addDecimal(salePrice),
      was_price: addDecimal(listPrice),
      item_discount: discount,
      list_price: addDecimal(listPrice),
      bundle_discount: bundleDiscount,
    }
  }

  function getGAInventory() {
    const inventory =
      selectedVariantOrVG?.inventory ||
      selectedVariantData?.inventory ||
      productData?.inventory ||
      {}
    return {
      is_available: inventory?.orderable ? '1' : '0',
      is_backordered: inventory?.backorderable ? '1' : '0',
      is_preordered: inventory?.preorderable ? '1' : '0',
    }
  }

  function getGABundleInventory(selectedBundleInventoryVariant) {
    const inventory = selectedBundleInventoryVariant?.inventory || {}
    return {
      is_available: inventory?.orderable ? '1' : '0',
      is_backordered: inventory?.backorderable ? '1' : '0',
      is_preordered: inventory?.preorderable ? '1' : '0',
      status: orderingStatusGAMap[orderingStatus],
    }
  }

  function getGAProduct(sources = {}) {
    const isBopisEnabled =
      (isFindInStoreAvailable || isFindInStorePickup) &&
      DisplayBopisCTA &&
      !isDiscontinued &&
      isBopisAllowedByCustomerGroups &&
      !isCustomizerProduct &&
      !isQuickView

    const gtmBopisInfo = !bopis?.loading && bopis?.bopisVariantFetched[newSelectedVariant?.id]
    if (isBopisEnabled && !gtmBopisInfo) {
      return
    }
    const gaProductData = {
      selectedVariantWithInventory: selectedVariantData,
      ...productData,
    }
    const product = productData['cells'] && !userInteracted ? productData : gaProductData //productData['cells'] is used to check that we are coming from PLP-to-PDP
    const itemVariant = selectedVariantData?.id || routerQuery?.frp || productData?.defaultVariantID

    const neutralSizingSizeText = get(selectedSize, `text[${selectedNeutralSizingCountry}]`)
    const size = neutralSizingSizeText
      ? `${selectedNeutralSizingCountry} ${neutralSizingSizeText}`
      : selectedSizeValue

    const additionalAttributes = {
      item_variant: itemVariant,
      color_id: selectedColor?.id || selectedColor?.name,
      color: selectedColor?.text || selectedColor?.value,
      width_id: selectedWidth?.id || selectedWidth?.value,
      width: selectedWidth?.text || selectedWidth?.name,
      ...getGAPrice(),
      ...getGAInventory(product),
      ...getBopisInfo(bopis),
      ...getMonogramData(),
    }

    if (productData?.sizes?.length) {
      additionalAttributes.size_id = selectedSizeValue
      additionalAttributes.size = size
    }

    return merge(
      {
        product: {
          ...product,
          selectedVariantData,
          pageType: 'pdp',
          size: get(
            product,
            'pickedProps.variationValues.size',
            get(selectedSize, 'id', get(variationValues, 'size', selectedSizeValue))
          ),
          quantity: selectedQty,
          selectedColor,
          selectedSize,
          selectedWidth,
          additionalAttributes,
          productDataForBadges: allLevelsProductsData,
          gaBadges: isQuickView && qvProductAnalyticsData,
        },
        wishlist: wishlists,
        eventLocation: isQuickView ? 'quickview' : isMegaPDPEligible ? 'mega product' : 'product',
        isProductExist: !!product,
      },
      sources
    )
  }

  function getGABundleProduct(sources = {}) {
    return {
      product: {
        ...productData,
        isBundleProductItems: sources?.product?.isBundleProductItems,
        bundleData: (sources?.product
          ? sources?.product?.bundleData
          : Object.values(selectedBundleVariantsData)
        )?.map((product, index) => {
          return merge({
            ...product,
            pageType: 'pdp',
            bundleAdditionalAttributes: {
              item_name: productData?.bundleProductData?.find(
                (item) => item?.masterId === product?.masterId
              )?.name,
              item_id: product?.id,
              item_category: productData?.bundleProductData?.find(
                (item) => item?.masterId === product?.masterId
              )?.item_category?.[0],
              item_category2: productData?.bundleProductData?.find(
                (item) => item?.masterId === product?.masterId
              )?.item_category?.[1],
              category_id: productData?.bundleProductData?.find(
                (item) => item?.masterId === product?.masterId
              )?.category_id,
              avg_star_rating:
                `${get(product, 'customAttributes.c_avgRatingEmplifi', 0)}` ||
                `${get(product, 'selectedVariant.customAttributes.c_avgRatingEmplifi', 0)}`,
              item_variant: product?.selectedVariant?.id,
              quantity: (
                get(product, 'quantity') ||
                bundleProductsQty[Object.keys(selectedBundleVariantsData)[index]]
              )?.toString(),
              color_id: findAttributeByType(product?.variationAttributes, 'color')?.values[0]?.name,
              review_count:
                `${get(product, 'customAttributes.c_revCountEmplifi', 0)}` ||
                `${get(product, 'selectedVariant.customAttributes.c_revCountEmplifi', 0)}`,
              has_swatch: get(product, 'variant')?.length > 1 ? '1' : '0',
              has_variant: get(product, 'variant')?.length > 1 ? '1' : '0',
              color: findAttributeByType(product?.variationAttributes, 'color')?.values[0]?.value,
              size_id: findAttributeByType(product?.variationAttributes, 'size')?.values[0]?.name,
              size: findAttributeByType(product?.variationAttributes, 'size')?.values[0]?.value,
              width_id: findAttributeByType(product?.variationAttributes, 'width')?.values[0]?.name,
              width: findAttributeByType(product?.variationAttributes, 'width')?.values[0]?.value,
              upc: productData?.bundleProductData?.find(
                (item) => item?.masterId === product?.masterId
              )?.UPC,
              ...getGABundlePrice(product?.selectedVariant, productData),
              ...getGABundleInventory(product),
            },
            sources,
          })
        }),
      },
      eventLocation: getEventLocation(addToBagClicked?.isSticky),
      isProductExist: !!productData,
    }
  }

  function getEventLocation(isSticky) {
    let eventLocation
    if (isMegaPDPEligible) {
      eventLocation = 'quickView'

      if (!isQuickView) {
        const mobileLocation = isBuyNow
          ? `buy now pdp cta${isSticky ? ' sticky' : ''}`
          : `mega pdp${isSticky ? ' sticky' : ' regular'}`
        const desktopLocation = isBuyNow ? 'buy now pdp cta' : 'mega pdp'

        eventLocation = isMobile ? mobileLocation : desktopLocation
      }
    } else {
      eventLocation = isQuickView
        ? 'quickview'
        : isBuyNow
        ? `buy now pdp cta${isSticky ? ' sticky' : ''}`
        : `pdp${isSticky ? ' sticky' : ' regular'}`
    }
    return eventLocation
  }

  const onAddToWishlistSuccess = useCallback(() => {
    const gaParameters = getGAProduct({ product: { quantity: '1' } })

    analytics.send('addToWishlist', {
      selectedVariantId: selectedSku,
      ...gaParameters,
    })
  }, [bopis, analytics, isQuickView, productData, selectedColor, selectedSize, selectedWidth])

  const onRemoveFromWishlistSuccess = useCallback(() => {
    const gaParameters = getGAProduct({ product: { quantity: '1' } })

    analytics.send('removeFromWishlist', {
      ...gaParameters,
    })
  }, [analytics, isQuickView, selectedColor, selectedSize, selectedWidth])

  const handleAddedItemsNotAvailable = (quantity, availableQuantity) => {
    const notAddedToBagQuantity = quantity - availableQuantity
    const biggerThanOne = notAddedToBagQuantity > 1
    if (availableQuantity > 0) {
      setItemsNotAvailableMsgFlag(true)
      const notAvailableMsg = formatMessage(
        {
          id: 'pdp.product.itemNotAddedDueToOutofStock',
          defaultMessage: `${availableQuantity} item${availableQuantity > 1 ? 's' : ''} ha${
            availableQuantity > 1 ? 've' : 's'
          } been moved to your bag. ${notAddedToBagQuantity} item${biggerThanOne ? 's' : ''} ${
            biggerThanOne ? 'are' : 'is'
          } no longer available test and cannot be added to your bag.`,
        },
        {
          availableQuantity,
          notAddedToBagQuantity,
        }
      )
      setItemsNotAvailableMsg(notAvailableMsg)
    }
  }

  const handleVariationControlsChange = () => {
    setOrderingError(null)
    setApplePayErrorOnPdp({ errorType: null })
    setItemsNotAvailableMsg(null)
    setItemsNotAvailableMsgFlag(false)
  }

  const getComaparablePriceCustomAttribute = (attribute) => {
    if (selectedVariantOrVG) {
      return selectedVariantOrVG?.customAttributes?.[attribute]
    }
    return productData?.custom?.[attribute]
  }

  const hideComparablePrice = getComaparablePriceCustomAttribute('c_hideComparablePriceValue')

  const hideDiscountedRate = getComaparablePriceCustomAttribute('c_hideDiscountRate')

  const allLevelsProductsData = useMemo(
    () => ({
      product: isBundleProduct
        ? productData
        : newSelectedVariant ||
          selectedVG ||
          productData?.defaultVariant ||
          productData?.defaultVariantGroup,
      variationGroupData:
        selectedVG || productData?.selectedVariantGroupData || productData?.defaultVariantGroup,
      masterData: productData?.master,
      promoText: productData?.promoText,
      instockText: productData?.instockText,
      bestSellerCheck: newSelectedVariant?.bestSellerCheck || selectedVG?.bestSellerCheck,
      hideComparablePrice: hideComparablePrice,
      hideDiscountedRate: hideDiscountedRate,
      newSelectedVariant: newSelectedVariant,
    }),
    [
      isBundleProduct,
      newSelectedVariant,
      selectedVG,
      productData,
      hideComparablePrice,
      hideDiscountedRate,
    ]
  )

  const isDiscontinued =
    get(newSelectedVariant, 'customAttributes.c_isDiscontinued', false) ||
    get(selectedVG, 'customAttributes.c_isDiscontinued', false)
  //get(productData, 'master.customAttributes.c_isDiscontinued', false)

  const displayOosSwatch = usePreference({
    groupId: 'Storefront Configs',
    preferenceId: 'displayOosSwatch',
  })

  useEffect(() => {
    if (productData?.isBundleProduct && addToBagClicked?.clicked) {
      onBundleAddToBagButtonClick()
      setAddToBagClicked({})
    } else {
      if (addToBagClicked?.clicked && (selectedVariantData || isCustomizedProduct || selectedVG)) {
        onAddToBagButtonClick(addToBagClicked?.isSticky)
        setAddToBagClicked({})
      }
    }
  }, [addToBagClicked, selectedVariantData, selectedColor])

  const isDisplayOosSwatch = getSiteValueFromPref(displayOosSwatch, siteId, false)

  const showOosSwatch =
    isDisplayOosSwatch ||
    (get(productData, 'custom.c_displayIfOOS') ??
      get(productData, 'defaultVariantGroup.customAttributes.c_displayIfOOS') ??
      get(productData, 'defaultVariant.customAttributes.c_displayIfOOS'))

  const isCustomizerProduct = isCustomized || isMonogrammed

  const onUserClick = useCallback(() => setUserInteracted(true), [])
  const onWidthClick = useCallback(() => setWidthClicked(true), [])
  const onSizeClick = useCallback(() => setSizeClicked(true), [])
  const onColorClick = useCallback(() => setColorClicked(true), [])

  const variationControlsProps = {
    isDiscontinued,
    productData,
    variationGroupData,
    showError: orderingError === ORDERING_ERROR.notSelected,
    onChange: handleVariationControlsChange,
    onMediaChange: setMedia,
    onUserClick,
    siteId,
    setSelectedColor,
    setSelectedSize,
    setSelectedWidth,
    setSelectedVariant,
    selectedColor,
    selectedSize,
    selectedWidth,
    sourceCodeGroupId,
    availableColors,
    availableSizes,
    availableWidths,
    selectedVariant,
    isQuickView,
    setShowSizeGuidePopUp,
    sizingRange,
    widthRange,
    showOosSwatch,
    customizerVariants,
    setCustomizerVariants,
    selectedVariantData:
      newSelectedVariant || productData?.selectedVariantData || productData?.defaultVariant,
    isBundleProduct,
    isDisplayOosSwatch,
    inventoryFetchedFrom,
    selectedVG,
    preSelectedWidth,
    widthClicked,
    onWidthClick,
    colorClicked,
    onColorClick,
    sizeClicked,
    onSizeClick,
    newSelectedVariant,
    selectedMaterial,
    setSelectedMaterial,
  }

  const isHideReview = get(productData, 'custom.c_hideReview')
  const widthLength = getVGWidthsfromColor(productData, selectedColor)?.length

  const sizesLength = getVGSizesfromColor(productData, selectedColor)?.length

  const variationMessagesProps = {
    errorType: orderingError,
    maxQuantityError,
    maxQtyErrorMsg,
    itemsNotAvailableMsg,
    itemsNotAvailableMsgFlag,
    ...allLevelsProductsData,
    isNotifyMeProduct,
    status: orderingStatus,
    isFinalSale: get(newSelectedVariant, 'customAttributes.c_isFinalSale', false),
    widthLength,
    sizesLength,
    selectedSize,
    selectedWidth,
    pdpExpecteShipdayMessageMarkup,
    siteId,
    finalSalePrefrence: finalSalePrefrence ? [finalSalePrefrence] : [],
    apploading,
  }

  const { colors } = theme

  const addToBagCTACustomText =
    isCustomized && !isMonogrammed
      ? formatMessage({
          id: 'pdp.addToBagWithCustomization',
          defaultMessage: 'ADD TO BAG WITH CUSTOMIZATION',
        })
      : !isCustomized && isMonogrammed
      ? formatMessage({
          id: 'pdp.addToBagWithMonogram',
          defaultMessage: 'ADD TO BAG WITH MONOGRAM',
        })
      : null

  const scrollToErrorMessage = () => {
    const viewSimilarCarousel = document.querySelector(
      '#ministage-w-atb:not(.ministage-w-atb-parallax)'
    )
    if (viewSimilarCarousel) {
      viewSimilarCarousel.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  function handleApplePayClickAnalyticsEvent() {
    const gaParameters = getGAProduct({
      eventLocation: 'apple pay pdp cta',
      product: {
        quantity: selectedQty,
      },
    })
    analytics.send('addToCart', {
      selectedVariantId: selectedSku,
      isApplePayPdp: true,
      ...gaParameters,
    })
  }

  function handleApplePayOpenPopupAnalyticsEvent() {
    const gaParameters = getGAProduct({
      eventLocation: 'apple pay pdp cta',
      product: {
        quantity: selectedQty,
      },
    })
    if (!gaParameters) return
    gaParameters.products = [gaParameters.product]
    analytics.send('beginCheckout', {
      checkoutOption: 'apple pay',
      isApplePayPdp: true,
      isExpressPay: true,
      ...gaParameters,
    })

    analytics.send('modalImpression', {
      event: 'modal_impression',
      eventAction: 'apple pay modal impression',
      modalTitle: 'apple pay payment window',
      eventLocation: 'apple pay modal',
    })
  }

  const addToBagButtonProps = {
    status: fallBackATB
      ? 'addToBag'
      : !get(productData, 'colors', [])?.length && !isBundleProduct
      ? ORDERING_STATUS.soldOut
      : orderingStatus,
    maxQuantityError,
    productData: newSelectedVariant || productData,
    onClick: (isSticky, isBuyNow = false) => {
      setIsBuyNow(isBuyNow)
      const hasSizes = productData?.sizes?.length || selectedColor?.sizes?.length

      if (!selectedVariantData && hasSizes) {
        setSizeDrawerCta(isBuyNow ? AlterCtaToShow.BUYNOW : AlterCtaToShow.EMPTY)
        analytics.send('siteError', {
          eventAction: 'add to cart',
          eventLocation: 'product',
          eventLabel: 'select size and width',
        })
        setOrderingError(ORDERING_ERROR.notSelected)
        if (isStickyAddToCartEnabled && !isTabbedAdaptivePDPEligible) {
          setFlyoutOpen(true)
        }
        if (isTabbedAdaptivePDPEligible) {
          scrollToErrorMessage()
        }
      } else {
        setAddToBagClicked({ clicked: true, isSticky })
        resetVisitedPagesCount()
      }
    },
    onApplePayClick: () => {
      let success = true
      if (!selectedVariantData && get(productData, 'sizes', [])?.length) {
        setSizeDrawerCta(AlterCtaToShow.APPLEPAY)
        setOrderingError(ORDERING_ERROR.notSelected)
        if (isStickyAddToCartEnabled && !isTabbedAdaptivePDPEligible) {
          setFlyoutOpen(true)
        }
        if (isTabbedAdaptivePDPEligible) {
          scrollToErrorMessage()
        }
        success = false
      } else {
        handleApplePayClickAnalyticsEvent()
      }
      // return new formed message
      return success
    },
    onApplePayOpen: () => {
      // all actions on ApplePay popup successfully opened
      handleApplePayOpenPopupAnalyticsEvent()
    },
    animationATB,
    setAnimationATB,
    instockText: instockText,
    colors: colors,
    enableMobileAddToBagButton: enableMobileAddToBagSiteValue,
    isQuickView,
    addToBagCTACustomText,
    apploading,
    btnDisable,
    selectedSize,
    selectedWidth,
  }

  useEffect(() => {
    handleApplePayError(applePayErrorOnPdp, setOrderingStatus, setOrderingError)
  }, [applePayErrorOnPdp])

  const bundleContentModuleProps = {
    bundleLinkText: bundleModuleProperties?.bundleLinkText,
    bundleMessage: bundleModuleProperties?.bundleMsg,
    bundleImg: bundleModuleProperties?.bundleContentImages?.images[0],
    bundleUrl: bundleModuleProperties?.bundleUrl,
  }

  const memberExclusiveButtonProps = {
    isQuickView,
    colors,
    productData: newSelectedVariant || productData,
    isGuestUser,
    isLoggedIn,
    membershipExclusiveProduct,
    setModalOpen,
  }

  const imageBadges = useMemo(
    () =>
      isQuickView || isPDPTemplateV3Mobile ? (
        ''
      ) : (
        <Box
          sx={styles.pdpBadgeOnImage({ isDesktop })}
          position="absolute"
          zIndex="10"
          display="flex"
          flexWrap="wrap"
          w={!isDesktop ? '92%' : '50%'}
          flexDirection={(isQuickView || !isDesktop) && 'row'}
        >
          <Badges
            area={BadgeArea.ON_IMAGE_PDP}
            page="pdp"
            variant={isQuickView ? BadgeArea.ON_IMAGE_QV : BadgeArea.ON_IMAGE_PDP}
            {...allLevelsProductsData}
          />
        </Box>
      ),
    [isQuickView, isDesktop, allLevelsProductsData, isPDPTemplateV3Mobile]
  )

  const getMediaHash = (media) => get(media, 'thumbnail.src')

  const getFullMediaLengthHash = (media) => get(media, 'full', []).length

  const carouselMedia = useMemo(
    () => get(selectedColor, 'media', media),
    [
      getMediaHash(selectedColor?.media || media),
      getFullMediaLengthHash(selectedColor?.media || media),
    ]
  )

  const carouselProps = {
    media: carouselMedia,
    productData,
    selectedVariant: newSelectedVariant,
    selectedColor,
    selectedSize,
    selectedWidth,
    selectedVariantData,
    imageBadges,
    sustainabilityIconsData: sustainabilityIconsData,
    isSustainabilityIconExpEnabled: isSustainabilityIconExpEnabled,
    currentVariationGroupId: selectedVG?.id,
    dynamicAssetImage: get(allLevelsProductsData, 'variationGroupData.b0Image'),
  }

  const headerBadges = isQuickView ? (
    ''
  ) : (
    <Badges
      area={BadgeArea.MARKETING_CONTENT}
      page="pdp"
      variant="marketingContentPdp"
      maxDisplayedBadges={isTabbedAdaptivePDPEligible && isMobile ? 1 : undefined}
      {...allLevelsProductsData}
    />
  )

  const tangibleeData = get(productData, 'tangibleeData')

  const skuData = useMemo(() => {
    const result = {}
    for (let tangibleeKey in tangibleeData) {
      if (typeof tangibleeData[tangibleeKey] == 'boolean')
        result[getCleanedSku(tangibleeKey)] = tangibleeData[tangibleeKey]
    }
    return result
  }, [tangibleeData])

  const variationTangibleeProps = {
    skuID: skuId,
    tangibleeData: skuData,
    variantData: selectedVariant,
    hideComparablePriceValue:
      hideListPrice && get(selectedVariant, 'customAttributes.c_hideComparablePriceValue', false),
  }

  const trackedTangibleeImpressionsRef = useRef(new Set())
  useEffect(() => {
    if (!isTangibleeInitialized || !selectedColor?.id) return
    const impressionKey = `${skuId}-${selectedColor.id}`
    if (trackedTangibleeImpressionsRef.current.has(impressionKey)) return
    trackedTangibleeImpressionsRef.current.add(impressionKey)
    trackTangiblee(skuId)
  }, [isTangibleeInitialized, skuId, selectedColor?.id])

  const tangibleeWidgetProps = useMemo(
    () => ({
      skuId: skuId,
      isVisible: !isDiscontinued && skuData[skuId] && !isQuickView,
      tangibleeData: skuData,
      variantData: newSelectedVariant,
      hideComparablePriceValue:
        hideListPrice &&
        get(newSelectedVariant, 'customAttributes.c_hideComparablePriceValue', false),
      productData,
      pageType,
    }),
    [skuId, isDiscontinued, skuData, productData, selectedVariant, isQuickView, pageType]
  )

  const stickyBundleCount = useMemo(() => {
    const totalSizeDataLength = size(stickyContainerState)
    const unSelectedSizedataLength = stickyContainerComp?.length
    const leftData = totalSizeDataLength - unSelectedSizedataLength
    return `(${leftData === 0 ? 1 : leftData + 1}/${totalSizeDataLength})`
  }, [stickyContainerState, stickyContainerComp?.length])

  const membershipExclusiveProductCTAEnabled =
    membershipExclusiveProduct &&
    !isBundleProduct &&
    !isLoggedIn &&
    orderingStatus !== ORDERING_STATUS.soldOut

  const discountinuedProductProps = {
    title: productData?.name,
    recommendedProduct: get(productData, 'master.recommendedProduct')
      ? {
          name: get(productData, 'master.recommendedProduct.name'),
          url: get(productData, 'master.recommendedProduct.url', '').replace(
            /^(?:\/\/|[^/]+)*\//,
            ''
          ),
        }
      : null,
  }

  const persistSoldOutSetting =
    orderingStatus === ORDERING_STATUS.soldOut && isNotifyMeProduct && !persistSoldOutValue
  const modelID = get(productData, 'custom.c_model', masterId)
  const displayBopisCTAToggle = useMemo(
    () => get(selectedVariant, 'displayBopisCTA', false),
    [selectedVariant]
  )
  const isFindInStoreAvailable =
    displayBopisCTAToggle &&
    (get(newSelectedVariant, 'customAttributes.c_isAvailableForFindInStore') ||
      get(selectedVG, 'customAttributes.c_isAvailableForFindInStore')) &&
    !isCommingSoonProduct &&
    !(membershipExclusiveProduct && !isLoggedIn)

  const isFindInStorePickup =
    displayBopisCTAToggle &&
    (get(newSelectedVariant, 'customAttributes.c_availableForInStorePickup') ||
      get(selectedVG, 'customAttributes.c_availableForInStorePickup')) &&
    !isCommingSoonProduct &&
    !(membershipExclusiveProduct && !isLoggedIn)

  const shouldRenderFindInStore =
    (isFindInStoreAvailable || isFindInStorePickup) &&
    DisplayBopisCTA &&
    !isDiscontinued &&
    isBopisAllowedByCustomerGroups &&
    !isCustomizerProduct

  const stickyContentProps = {
    setFlyoutOpen: setFlyoutOpen,
    stickyATCvarDrawerAttr: stickyATCvarDrawerAttr,
    isFlyoutOpen: isFlyoutOpen,
    styles: styles,
    isBundleProduct: isBundleProduct,
    stickyBundleCount: stickyBundleCount,
    stickyContainerComp: stickyContainerComp,
    stickyContainerState: stickyContainerState,
    variationControlsProps: variationControlsProps,
    variationTangibleeProps: variationTangibleeProps,
    variationMessagesProps: variationMessagesProps,
    stickyAddToCartPriceEnabled: stickyAddToCartPriceEnabledValue,
    productData: productData,
    allLevelsProductsData: allLevelsProductsData,
    selectedColor: selectedColor,
    isStickyAddToCartBelowTheFoldEnabled: isStickyAddToCartBelowTheFoldEnabled,
    isStickyAddToBagUponLandEnabled: isStickyAddToBagUponLandEnabled,
    membershipExclusiveProductCTAEnabled: membershipExclusiveProductCTAEnabled,
    memberExclusiveButtonProps: memberExclusiveButtonProps,
    orderingStatus: orderingStatus,
    isNotifyMeProduct: isNotifyMeProduct,
    isNotifyMeAvailableBundle: isNotifyMeAvailableBundle,
    selectedVariantData: selectedVariantData,
    setOrderingError: setOrderingError,
    selectedVariant: selectedVariant,
    addToBagButtonProps: addToBagButtonProps,
    selectedQty: selectedQty,
    isBuyNow: isBuyNow,
    isFindInStoreAvailable,
    isFindInStorePickup,
    DisplayBopisCTA,
    isDiscontinued,
    isBopisAllowedByCustomerGroups,
    newSelectedVariant,
    onPickUpInStoreClick,
    getGAProduct,
    sfraEnableFindInStoreV4,
    sizeDrawerCta,
    shouldRenderFindInStore,
  }

  const stickyContent =
    !isDiscontinued && isStickyAddToCartEnabled && !miniCartOpenReason ? (
      isTabbedAdaptivePDPEligible ? (
        <StickyAdaptiveContent {...stickyContentProps} />
      ) : (
        <StickyContent {...stickyContentProps} />
      )
    ) : null

  const onClickViewFullProductDetails = () => {
    analytics.send('quickViewInteraction', {
      eventLabel: selectedVG?.id || productId,
      eventAction: formatMessage({ id: 'plp.quickview.viewFullProductDetails' })?.toLowerCase(),
      eventLocation: isQuickView ? 'quickview' : 'product',
    })
  }

  const onChangeQuantity = (qty) => {
    setSelectedQty(qty)
  }

  const onSwatchInteraction = useCallback(
    (swatchValue, event = 'click', index, swatchOverlay = false) => {
      const eventPrefix = getSwatchInteractionEventPrefix(index, swatchOverlay)
      analytics.send('swatchInteraction', {
        eventAction: `${eventPrefix}:product image ${event}`,
        eventLabel: selectedVariant?.id || productId,
        eventLocation: isQuickView ? 'quickview' : isMegaPDPEligible ? 'mega product' : 'product',
        swatchType: 'product image',
        swatchValue,
        swatchVariant: selectedVariant?.id || selectedVG?.id || productId,
      })
    },
    [
      productId,
      isQuickView,
      selectedVariant,
      selectedColor,
      selectedSize,
      selectedWidth,
      selectedVG,
    ]
  )

  const promotionData = productData?.pickedProps?.promotionData

  function makeBreadcrumb(promotionData) {
    const breadcrumbs = []
    if (promotionData?.item_category) {
      breadcrumbs.push({
        cgid: promotionData?.item_category?.toLowerCase(),
        name: promotionData?.item_category,
      })
    }
    if (promotionData?.item_category2) {
      breadcrumbs.push({
        cgid: promotionData?.item_category2?.toLowerCase(),
        name: promotionData?.item_category2,
      })
    }
    if (promotionData?.item_category3) {
      breadcrumbs.push({
        cgid: promotionData?.item_category3?.toLowerCase(),
        name: promotionData?.item_category3,
      })
    }
    breadcrumbs.push({
      cgid: '',
      name: productData?.name,
    })
    return breadcrumbs
  }

  const customizeComponent = (
    <EnjectCustomizationScript
      customizerData={productData?.customizerData}
      productCustomState={productCustomState}
      setProductCustomState={setProductCustomState}
      masterId={masterId}
      redirectUrl={activeUrl || productData?.url}
      isQuickView={isQuickView}
      isCustomize={isCustomized}
      isMonogram={isMonogrammed}
      isCustomizeAnother={false}
      skuId={selectedVariant?.id || newSelectedVariant?.id}
      variationGroupData={variationGroupData || selectedVG}
      productData={productData}
      setCustomizerVariants={setCustomizerVariants}
      customizerVariants={customizerVariants}
      selectedVariant={selectedVariant || newSelectedVariant}
      setSelectedVariant={setSelectedVariant}
      selectedColor={selectedColor}
      setSelectedColor={setSelectedColor}
      customizerPrefernce={customizerPrefernce}
      isCustomizerPrefernceEnabled={isCustomizerPrefernceEnabled}
      recipes={recipes}
      setRecipes={setRecipes}
      defaultVariantProductID={
        productData?.defaultVariant?.productId || productData?.master?.defaultVariantID
      }
      colors={productData?.colors || []}
    />
  )

  const bundleVariationProps = {
    productData,
    loading,
    apploading,
    addToBagButtonProps,
    siteId,
    setFullscreenLoading,
    isQuantitySelectorEnable,
    maxQuantityError,
    isFlyoutOpen,
    setFlyoutOpen,
    colors,
    maxQtyRestrictionEnabled,
    maxOrderQty,
    finalSalePrefrence,
    bundleAddAllToBagClicked,
    bundleAddAllToBagError,
    isDisplayOosSwatch,
    sourceCodeGroupId,
    pdpExpecteShipdayMessageMarkup,
    setAddToBagClicked,
  }

  const shoppingWidgetProps = useMemo(() => {
    if (!apploading) {
      return {
        masterId: masterId,
        promotionPrice: selectedVariantData
          ? get(selectedVariantData, 'pricingInfo[0].sales.value', 0) ||
            get(selectedVariantData, 'pricingInfo[0].list.value', 0)
          : get(selectedVG, 'pricingInfo[0].sales.value', 0) ||
            get(selectedVG, 'pricingInfo[0].list.value', 0) ||
            get(selectedVG, 'pricingInfo[0].min.sales.value', 0),
        configMode: appData.configMode,
        shoppingGivesIsTest: appData.shoppingGivesIsTest,
      }
    }
  }, [masterId, selectedVariantData, selectedVG, appData, apploading])

  const bundleContentModuleComponent = <BundleContentModule {...bundleContentModuleProps} />
  const bundleVariationComponent = <BundleVariants {...bundleVariationProps} />

  const selectedSku = useMemo(
    () => get(newSelectedVariant, 'id', get(selectedVG, 'variantsAssigned')?.[0]),
    [newSelectedVariant, selectedVG]
  )
  const paymentLogosData = useMemo(
    () => get(productData, 'productSlots.contentSlots["toro-pdp-payment-logo"]', null),
    [productData]
  )

  const isPaymentLogosEnabledOnPDP = get(paymentLogosData, 'online.default', false)

  const powerReviewsUGC = {
    pageType: 'pdp',
    loading: false,
    className: 'pdp-ugc-container content-divider',
    content: get(productData, 'ugcContent'),
    masterId: get(productData, 'masterId'),
    modalId: modelID,
  }

  const additionalDetailsProps = {
    isBundleProduct,
    isDiscontinued,
    masterId: get(productData, 'masterId'),
    certona: {
      ymalScheme,
      recentlyViewedScheme,
      hybridSocialScheme,
    },
    contentAreaOne: {
      siteId,
      content: get(productData, 'pdpContentAreas["pdp-content-area-one-markup"]'),
      contentAreaCustomAttribute: get(productData, 'custom.c_pdpContentAreaOne'),
    },
    contentAreaTwo: {
      siteId,
      content: get(productData, 'pdpContentAreas["pdp-content-area-two-markup"]'),
      contentAreaCustomAttribute: get(productData, 'custom.c_pdpContentAreaTwo'),
    },
    contentAreaThree: {
      siteId,
      content: get(productData, 'pdpContentAreas["pdp-content-area-three-markup"]'),
      contentAreaCustomAttribute: get(productData, 'custom.c_pdpContentAreaThree'),
    },
    closerLookProps: {
      cLHeader: closerLookHeader,
      cLText: closerLookText,
      cLImageSuffix: closerLookImage,
      isCloserLookEnable: closerLookHeader && closerLookText && !!closerLookImageSrc,
      closerLookImageSrc: closerLookImageSrc,
    },
    sustainabilityProps: {
      sustainableHeaderContent: get(
        productData,
        'pdpSustainableHeaderContent.c_body.default.markup'
      ),
      sustainabilityIconsData,
      isSustainabilityModuleEnabled,
    },
    powerReviewsUGC,
    ugc: {
      masterId,
      modelId: modelID,
      content: get(productData, 'wyngContent'),
      pageType: 'pdp',
      emplifiVPC: get(productData, 'custom.c_emplifiVPC'),
    },
    isHideReview: get(productData, 'custom.c_hideReview'),
    ratingsAndReviews: {
      isDesktop,
      modelID,
      siteId,
      productId: get(productData, 'masterId'),
      sizingRange,
      widthRange,
      setSizingRange,
      setWidthRange,
      productData: {
        id: productData?.id,
        custom: get(productData, 'custom'),
        UPC: productData?.UPC,
      },
      reviewsData: productData?.reviewsData,
    },
    productDetailsProps: {
      isBundleProduct,
      productData,
      isDiscontinued,
      isCustomizerProduct,
      sustainabilityIconsData,
      selectedVariantOrVG,
      ...tangibleeWidgetProps,
    },
    SocialMediaAreaProps: {
      socialMedia: tulipEnabled
        ? get(productData, 'tulipSocialMedia["liveConnect-StylingAdvice-new"]')
        : get(productData, 'socialMedia["liveConnect-StylingAdvice"]'),
      productData,
      tulipConfigData,
      isMobile,
    },
    envImpactSlides: get(productData, 'custom.c_envImpacts'),
    envImpactModalHeadline,
    PaymentLogosProps: {
      paymentData: paymentLogosData,
      isPaymentLogosEnabledOnPDP,
    },
    benefitsModuleData,
    similarProductConfigs,
    itemId,
    parentCategoryId: get(productData, 'parentCategoryId'),
  }

  const firstVisitImages = get(productData, 'firstVisitImages')
  const adaptiveCarouselAltMedia = get(productData, 'adaptiveCarouselAltMedia')

  const tabbedLowerProps = {
    masterId: get(productData, 'masterId'),
    certona: {
      ymalScheme,
      recentlyViewedScheme,
      hybridSocialScheme,
      metaLanderScheme,
    },
    isHideReview: get(productData, 'custom.c_hideReview'),
    ratingsAndReviews: {
      isDesktop,
      modelID,
      siteId,
      productId: get(productData, 'masterId'),
      sizingRange,
      widthRange,
      setSizingRange,
      setWidthRange,
      productData: {
        id: productData?.id,
        UPC: productData?.UPC,
      },
      reviewsData: productData?.reviewsData,
    },
    productDetailsProps: {
      isBundleProduct,
      productData,
      isDiscontinued,
      isCustomizerProduct,
      sustainabilityIconsData,
      selectedVariantOrVG,
      ...tangibleeWidgetProps,
    },
    siteId,
    makeBreadcrumb,
    promotionData,
    apploading,
    selectedColor,
  }

  const tabbedAdaptiveLowerProps = {
    isBundleProduct,
    powerReviewsUGC,
    ugc: {
      masterId,
      modelId: modelID,
      content: get(productData, 'wyngContent'),
      pageType: 'pdp',
      emplifiVPC: get(productData, 'custom.c_emplifiVPC'),
    },
    closerLookProps: {
      cLHeader: closerLookHeader,
      cLText: closerLookText,
      cLImageSuffix: closerLookImage,
      isCloserLookEnable: closerLookHeader && closerLookText && !!closerLookImageSrc,
      closerLookImageSrc: closerLookImageSrc,
      variant: 'adaptiveTabbedPDP',
    },
    contentAreaOne: {
      siteId,
      content: get(productData, 'pdpContentAreas["pdp-content-area-one-markup"]'),
      contentAreaCustomAttribute: get(productData, 'custom.c_pdpContentAreaOne'),
    },
    contentAreaTwo: {
      siteId,
      content: get(productData, 'pdpContentAreas["pdp-content-area-two-markup"]'),
      contentAreaCustomAttribute: get(productData, 'custom.c_pdpContentAreaTwo'),
    },
    contentAreaThree: {
      siteId,
      content: get(productData, 'pdpContentAreas["pdp-content-area-three-markup"]'),
      contentAreaCustomAttribute: get(productData, 'custom.c_pdpContentAreaThree'),
    },
    benefitsModuleData,
    envImpactSlides: get(productData, 'custom.c_envImpacts'),
    envImpactModalHeadline,
    similarProductConfigs,
    itemId,
    ...tabbedLowerProps,
  }

  const contentAreaFour = {
    content: get(productData, 'pdpContentAreas["pdp-content-area-four-markup"]'),
    contentAreaCustomAttribute: get(productData, 'custom.c_pdpContentAreaFour'),
  }

  const isBopisEnabled =
    (isFindInStoreAvailable || isFindInStorePickup) &&
    DisplayBopisCTA &&
    !isDiscontinued &&
    isBopisAllowedByCustomerGroups &&
    !isCustomizerProduct

  useEffect(() => {
    const isPDP = productData?.pageType?.toUpperCase?.() === 'PDP'
    const hasBundleVariantData =
      isBundleProduct && Object.keys(selectedBundleVariantsData || {})?.length
    const isSizedProduct = (get(productData, 'colors[0].sizes') || get(productData, 'sizes'))
      ?.length
    const isVariantNotSelectedOnSizedProduct = isSizedProduct && !isVariantSelected

    const variants = productData?.variant || productData?.variants || []

    const selectedColorFirstVariant = variants?.find((vr) => {
      return (
        vr?.variationValues?.color === selectedColor?.id && vr?.masterId === selectedColor?.masterId
      )
    })

    if (
      !apploading &&
      (isBundleProduct ? true : updatedWishLists) &&
      (isBopisEnabled
        ? bopis?.bopisVariantFetched?.[newSelectedVariant?.id] && !bopis?.loading
        : true) &&
      (!isBundleProduct && userInteracted ? selectedColorFirstVariant?.inventory : true) &&
      (isVariantSelected || isVariantNotSelectedOnSizedProduct || isBundleProduct) &&
      (isPDP || isQuickView) &&
      (selectionUpdated || hasBundleVariantData) &&
      (!isBundleProduct
        ? isVariantNotSelectedOnSizedProduct || selectedVariantData?.inventory?.id
        : true)
    ) {
      if (viewItemRef.current === 0) {
        if (
          (isBundleProduct &&
            Object.values(selectedBundleVariantsData).every((item) => 'inventory' in item)) ||
          !isBundleProduct
        ) {
          if (productData?.widths?.length) {
            if (!isEmpty(selectedWidth)) {
              fireViewProductEvent()
              viewItemRef.current = 1
            }
          } else {
            fireViewProductEvent()
            viewItemRef.current = 1
          }
        } else if (!bopis?.loading && bopis?.bopisVariantFetched?.[newSelectedVariant?.id]) {
          fireViewProductEvent()
          viewItemRef.current = 1
        }
      } else if (userInteracted) {
        fireViewProductEvent()
        setUserInteracted(false)
      }
    }
  }, [
    updatedWishLists,
    selectionUpdated,
    selectedVariantData?.id,
    selectedVariantData?.inventory?.id,
    selectedColor,
    selectedBundleVariantsData,
    selectedVariant,
    apploading,
    isQuickView,
    productData,
    bopis,
    isBopisEnabled,
    selectedWidth,
  ])

  useEffect(() => {
    /* TODO: refactor nested if */
    if (!apploading) {
      if (!isEmpty(swatchInteractionObj)) {
        analytics.send('swatchInteraction', {
          ...swatchInteractionObj,
          eventLabel: productData?.id,
          swatchVariant: productData?.selectedVariantGroupId,
        })
        setSwatchInteractionObj({})
      }
    }
  }, [apploading])

  useEffect(() => {
    if (isOneCoachTabbedHeaderActive && isOutletSubCategory) {
      setIsOutletTab({ isOutletProduct })
    }
  }, [isOutletProduct, isOutletSubCategory, isOneCoachTabbedHeaderActive])

  if (!name) {
    return null
  }

  return (
    <ProductMainSectionBreakpointContext.Provider
      value={{
        // Note: Mobile only
        apploading,
        stickyContent,
        isAddToCartDrawerEnabled,
        currentVariationGroupId: selectedVG?.id,

        // Note: Desktop only
        membershipTooltipContent,
        setQuickViewedProduct,
        onClickViewFullProductDetails,
        formatMessage,
        activeUrl,
        paymentLogosData,
        isPaymentLogosEnabledOnPDP,

        // Note: shared between Mobile and Desktop
        onAddToWishlistSuccess,
        onRemoveFromWishlistSuccess,
        makeBreadcrumb,
        maxQuantityError,
        promotionData,
        carouselProps,
        isGuestUser,
        membershipExclusiveProduct,
        onSwatchInteraction,
        loading,
        headerBadges,
        allLevelsProductsData,
        isDiscontinued,
        isHideReview,
        ratingsAndReviews: additionalDetailsProps.ratingsAndReviews,
        masterId,
        selectedColor,
        discountinuedProductProps,
        isCustomizerProduct,
        skuId,
        skuData,
        selectedVariant,
        loadMapper,
        setLoadMapper,
        variationControlsProps,
        variationTangibleeProps,
        customizeComponent,
        isNotifyMeProduct,
        variationMessagesProps,
        isLoggedIn,
        orderingStatus,
        memberExclusiveButtonProps,
        isQuantitySelectorEnable,
        productMaxOrderableQty,
        selectedQty,
        onChangeQuantity,
        persistSoldOutSetting,
        addToBagButtonProps,
        selectedVariantData,
        setOrderingError,
        isFlyoutOpen,
        setFlyoutOpen,
        theme,
        isFindInStoreAvailable,
        DisplayBopisCTA,
        isBopisAllowedByCustomerGroups,
        onPickUpInStoreClick,
        isFindInStorePickup,
        tulipEnabled,
        tulipConfigData,
        bundleModuleProperties,
        bundleContentModuleComponent,
        bundleVariationComponent,
        isBundleProduct,
        showBundleSave,
        tangibleeWidgetProps,
        sustainabilityIconsData,
        membershipExclusiveProductCTAEnabled,
        shoppingWidgetProps,
        cart,
        wishlists,
        onPurposeProps,
        newSelectedVariant,
        klarnaDetails,
        getGAProduct,
        contentAreaFour,
        firstVisitImages,
        adaptiveCarouselAltMedia,
        enablePricingPromoUpdates,
        shouldRenderFindInStore,
      }}
    >
      <ProductTemplate
        selectedVariantOrVG={selectedVariantOrVG}
        styles={styles}
        quickViewStyles={quickViewStyles}
        tabbedAdaptiveLowerProps={tabbedAdaptiveLowerProps}
        additionalDetailsProps={additionalDetailsProps}
      />
    </ProductMainSectionBreakpointContext.Provider>
  )
}

export default ProductMainSection
