import { atom, WritableAtom } from 'jotai'
import isPlainObject from 'lodash/isPlainObject'
import isBoolean from 'lodash/isBoolean'
import {
  atomWithDefault,
  atomWithReset,
  atomWithStorage,
  createJSONStorage,
  selectAtom,
} from 'jotai/utils'
import _get from 'lodash/get'
import has from 'lodash/has'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import { isAppleDevice } from 'toro/helpers/isMobileDevice'
import { ApplePayErrorOnPdp, ApplePayErrorInfo } from 'toro/components/PaymentWidget/types'
import type { VariationAttribute } from 'toro/types/productTypes/common'
import { getCleanedSku, getNewMegaPDPColors } from 'toro/helpers/skuHelper'
import {
  STORAGE_FIRST_INTRO_BROWSER_SESSION_COMPLETE,
  STORAGE_PROMO_COUPON_CODE,
  STORAGE_RECOMMENDED_FITGUIDE_SIZE,
} from 'toro/constants/storageIds'
import sessionStorage from 'toro/helpers/sessionStorage'
import { isVisuallySimilarDataInitializedAtom, visuallySimilarDataAtom } from 'store/global.atom'
import getPromoByType, { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import { checkInsStockText, ORDERING_ERROR, ORDERING_STATUS } from 'toro/helpers/productVariations'
import { preferencesAtom } from 'store/preferences.atom'
import {
  getAddToBagButtonTextData,
  getDefaultSizeValue,
  getGaProductData,
  getProductDataForBadges,
  getProductDataForMarketingBadges,
} from 'toro/helpers/pdpData'
import { selectedVariantInventoryAtom } from 'store/inventory.atom'
import { wishlistIdsAtom } from 'store/wishlist.atom'
import { updateXgenRecommendationsDataAtom } from 'store/xgen-recommendations.atom'
import isLocalisedApplePayEligible from 'toro/helpers/isLocalisedApplePayEligible'
import { ProductVertical } from 'toro/constants/OneSite'
import { experimentsAtom } from 'store/experiments.atom'
import { isOneCoachNAEnabledAtom, oneSiteActiveTabAtom } from 'store/menu-data.atom'
import getHierarchically from 'toro/helpers/getHierarchically'
import pickHierarchically from 'toro/helpers/pickHierarchically'
import { DetailedProduct } from 'toro/types/productTypes'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { getPdpVisuallySimilarFieldName } from 'toro/helpers/getPdpVisuallySimilarFieldName'

// Note: these were just converted from useState, requires refactoring
export const userInteractedAtom = atom(null)
export const drawerVisibleAtom = atom(false)
export const drawerQuantityAtom = atom(null)
export const isPartialAddedAtom = atom(false)
export const forceLoadingDisplayAtom = atom(false)
export const productCustomStateAtom = atom({})
export const carouselKeyStateAtom = atom(0)
export const isNotifyMeAvailableAtom = atom<boolean>(false)
export const selectionChangedAtom = atom(false)
export const pdpReviewsAtom = atom([])
export const pdpRatingsFilterAtom = atom({
  search: '',
  sortBy: '',
  filterBy: '',
  ratingsFilterValue: '',
})
export const isSizeGuidePopUpOpenAtom = atom(false)
export const customizerDataAtom = atom({})
export const customizerRecipesAtom = atom([])
export const variationTypeControlInteraction = atom({})
export const subBrandSuffixAtom = atom('')
export const countryTabIndexAtom = atom(0)
export const lastAddedProductToBagAtom = atom({})
export const lastAddedProductToBagVariantIdAtom = atom('')
export const selectedTabsDataAtom = atom([])
export const fetchResultAtom = atom({
  loading: true,
  bopisVariantFetched: {},
  error: null,
  data: { stores: [] },
})
export const priceGroupAtom = atom<object>({})
export const setPriceGroupAtom = atom(null, (_, set, obj) => {
  if (!isPlainObject(obj)) {
    return {}
  }
  set(priceGroupAtom, obj)
})
export const runSearchFetchAtom = atom(
  (get) => get(fetchResultAtom),
  (get, set, { page, productId, onSuccess, onError, sendStoreSearchData, promise }) => {
    set(fetchResultAtom, (prev) => ({ ...prev, loading: true }))

    promise
      .then((data) => {
        const prevData = get(fetchResultAtom).data || { stores: [] }
        const newData = page > 0 ? { ...data, stores: [...prevData.stores, ...data.stores] } : data
        set(fetchResultAtom, {
          loading: false,
          bopisVariantFetched: { [productId]: true },
          error: null,
          data: newData,
        })
        onSuccess?.()
        sendStoreSearchData?.(data)
      })
      .catch((err) => {
        set(fetchResultAtom, (prev) => ({
          ...prev,
          loading: false,
          error: err.message || 'Something went wrong',
        }))
        onError?.(err)
      })
  }
)
export const isTangibleeInitializedAtom = atom(false)
export const availableSizesAtom = atom((get) => {
  const selectedColor = get(selectedColorAtom)
  const sizes = _get(selectedColor, 'sizes')
  return sizes?.filter((item) => item?.orderable)?.map((size) => size.id || size.value)
})
export const isReviewModalOpenedAtom = atom<boolean>(false)
export const setReviewModalOpenedAtom = atom(null, (_, set, isModalOpen: boolean) => {
  if (!isBoolean(isModalOpen)) {
    return
  }
  set(isReviewModalOpenedAtom, isModalOpen)
})
export const maxQuantityErrorAtom = atom<boolean>(false)
export const setMaxQuantityErrorAtom = atom(null, (_, set, isTrue: boolean) => {
  if (!isBoolean(isTrue)) {
    return
  }
  set(maxQuantityErrorAtom, isTrue)
})
export const recommendedFitGuideSizeAtom = atomWithStorage(STORAGE_RECOMMENDED_FITGUIDE_SIZE, '')

export const fitReviewAtom = atom({})
export const setFitReviewAtom = atom(null, (get, set, update: object) => {
  if (!isPlainObject(update)) {
    return set(fitReviewAtom, {})
  }
  set(fitReviewAtom, { ...get(fitReviewAtom), ...update })
})
export const isFirstViewedAtom = atomWithReset(true)

export const isAeFirstViewedAtom = atomWithReset(false)

export const reviewSectionNodeAtom = atom<HTMLElement>(null as HTMLElement)

export const setReviewSectionNodeAtom = atom(null, (_, set, node: HTMLElement) => {
  if (node instanceof Element === false) {
    return
  }
  set(reviewSectionNodeAtom, node)
})

export const accessorizeItNodeAtom = atom<HTMLElement>(null as HTMLElement)

export const setAccessorizeItNodeAtom = atom(null, (_, set, node: HTMLElement) => {
  if (node instanceof Element === false) {
    return
  }
  set(accessorizeItNodeAtom, node)
})

/*
 * PDP Context Providers refactoring.
 * Do not add atoms below this line that are not part of the PDP refactoring.
 */
export const productIdAtom = atom('')
export const isQuickViewAtom = atom(false)

// ProductContext refactoring - additional atoms
export const appLoadingAtom = atom(false)
export const quickViewedProductAtom = atom(null)
export const originalProductIdAtom = atom('')

/*
 * The next two Mega PDP atom values could be read directly from 'megaPDPEligibleOptions',
 * but sometimes the product data received by a nested component doesn't have the full payload.
 */
export const isMegaPDPEligibleAtom = atom(false)
export const isNewMegaPDPEligibleAtom = atom(false)

export const activeTabIndexAtom = atom<number>(1)

export const setActiveTabIndexAtom = atom(null, (_, set, activeTabIndex: number) => {
  set(activeTabIndexAtom, activeTabIndex)
})

export const isShowingShippingAndReturnsModal = atom(false)

/** Flyout for Fast Shipping “Learn more” — separate from free-shipping modal so both can exist on the PDP */
export const isShowingFastShippingModalAtom = atom(false)

export const isShowingPaymentVarietyModalAtom = atom(false)

export const isShowingSignUpDisclaimerModalAtom = atom(false)
export const toggleIsShowingSignUpDisclaimerModalAtom = atom(null, (get, set) => {
  set(isShowingSignUpDisclaimerModalAtom, !get(isShowingSignUpDisclaimerModalAtom))
})

export const isTabbedAdaptivePDPEligibleAtom = atom(false)
export const isTabbedAdaptiveScrolledAtom = atom(false)
export const isTabbedAdaptiveDynamicAssetInViewportAtom = atom(false)
export const isProductFullyOOSAtom = atom(false)
export const shouldShowVisuallySimilarPdpAtom = atom((get) => {
  const visuallySimilarData = get(visuallySimilarDataAtom)
  const isVisuallySimilarDataInitialized = get(isVisuallySimilarDataInitializedAtom)
  return !isVisuallySimilarDataInitialized || Boolean(visuallySimilarData?.length)
})

export const visuallySimilarPropAtom = atom((get) => {
  const selectedVariantGroup = get(selectedVariantGroupAtom)
  const isOneSiteEnabled = get(isOneCoachNAEnabledAtom)
  const activeTab = get(oneSiteActiveTabAtom)
  const preferences = get(preferencesAtom)
  const experiments = get(experimentsAtom)
  const version = _get(
    preferences,
    'toggleSiteFeatures.enableVisuallySimilar.version',
    'v2'
  ) as string

  if (!selectedVariantGroup) {
    return ''
  }

  const isVisuallySimilarCrossChannel = experiments.includes(
    EXPERIMENTS.VISUALLY_SIMILAR_CROSS_CHANNEL
  )

  const fieldName = getPdpVisuallySimilarFieldName({
    isOneSiteEnabled,
    isVisuallySimilarCrossChannelExperiment: isVisuallySimilarCrossChannel,
    activeTab,
    enableVisuallySimilarVersion: version,
  })

  return (
    _get(selectedVariantGroup, `customAttributes.c_${fieldName}`, '') ||
    _get(selectedVariantGroup, fieldName, '')
  )
})

export const adyenPaymentMethodsAtom = atom(null)
export const isPdpV4ATFFullPricingAtom = atom(false)

export enum AlterCtaToShow {
  EMPTY = 'noButton',
  BUYNOW = 'buyNowButton',
  APPLEPAY = 'applePayButton',
}

export const alterCtaToShowAtom = atom<AlterCtaToShow>(AlterCtaToShow.EMPTY)
export const getInitAlterCtaToShow = (preferences, currentLocale) => {
  const {
    enableApplePayOnPDP,
    Adyen_ClientKey,
    applePayAllowedCountryCodesForCheckout: allowedApplePayCountries,
  } = _get(preferences, 'applePayConfigs', {})
  const isRegionApplePayEligible = isLocalisedApplePayEligible(
    currentLocale,
    allowedApplePayCountries
  )

  return Adyen_ClientKey && enableApplePayOnPDP && isRegionApplePayEligible
    ? AlterCtaToShow.EMPTY
    : AlterCtaToShow.BUYNOW
}
alterCtaToShowAtom.onMount = (setAtom) => {
  if (!isAppleDevice()) {
    setAtom(AlterCtaToShow.BUYNOW)
  }
}
export enum ApplePayErrorType {
  PRODUCT_NOT_AVAILABLE = 'ProductItemNotAvailableException',
  INVALID_SHIPPING_ADDRESS = 'invalidShippingAddress',
  INVALID_BILLING_ADDRESS = 'invalidBillingAddress',
  FRAUD = 'Fraud',
  INVALID_REQUEST = 'Invalid_Request',
  AUTHFAILED = 'AUTHFAILED',
  REAL_TIME_INVENTORY = 'realTimeInventory',
  CART_THRESHOLD_ERROR = 'cartThresholdError',
  UNKNOWN = 'unKnown',
}
export const applePayErrorOnPdpAtom = atom<ApplePayErrorOnPdp>({ errorType: null })
export const setApplePayErrorOnPdpAtom = atom(null, (get, set, error: ApplePayErrorInfo) => {
  const applePayTechnicalErrorMsg = get(applePayErrorOnPdpAtom).applePayTechnicalErrorMsg
  set(applePayErrorOnPdpAtom, {
    applePayTechnicalErrorMsg,
    ...error,
  })
})
export const applePayErrorMessageAtom = atom<string>((get) => {
  const { errorType, errorMsg, applePayTechnicalErrorMsg } = get(applePayErrorOnPdpAtom)
  if (
    [
      ApplePayErrorType.REAL_TIME_INVENTORY,
      ApplePayErrorType.CART_THRESHOLD_ERROR,
      ApplePayErrorType.INVALID_REQUEST,
      ApplePayErrorType.UNKNOWN,
    ].includes(errorType)
  ) {
    return errorMsg
  }

  if ([ApplePayErrorType.FRAUD, ApplePayErrorType.AUTHFAILED].includes(errorType)) {
    return applePayTechnicalErrorMsg
  }
  return ''
})

export const klarnaDetailsAtom = atomWithReset<any>(null)
export const setKlarnaDetailsAtom = atom(null, (_, set, klarnaDetails: any) => {
  if (!isPlainObject(klarnaDetails) && klarnaDetails !== null) {
    return
  }
  set(klarnaDetailsAtom, klarnaDetails)
})

/**
 * Atom that determines if Klarna payment is fully enabled and ready to use
 * Checks both preference settings and that Klarna details are available
 */
export const isKlarnaEnabledAtom = atom<boolean>((get) => {
  const klarnaDetails = get(klarnaDetailsAtom)
  const preferences = get(preferencesAtom)

  const hasKlarnaDetails = has(klarnaDetails, 'textMain.value')

  const enableKlarna = _get(preferences, 'Klarna_Payments.enableKlarna', false)

  const isAdyenPaymentsEnabled = _get(preferences, 'Adyen.AdyenAssociatedPaymentsEnabled', false)
  const osmClient = _get(preferences, 'Adyen.AdyenKlarnaOSMClient', {})

  const hasAdyenKlarnaForAnyLocale =
    isAdyenPaymentsEnabled &&
    Object.values(osmClient).some((config: any) => _get(config, 'enable', false))

  return Boolean(hasKlarnaDetails && (enableKlarna || hasAdyenKlarnaForAnyLocale))
})

export const shouldRenderAfterPayAtom = atom<boolean>(false)
export const setShouldRenderAfterPayAtom = atom(null, (_, set, shouldRender: boolean) => {
  if (!isBoolean(shouldRender)) {
    return
  }
  set(shouldRenderAfterPayAtom, shouldRender)
})

export const affirmPriceAtom = atomWithReset<string>(null)
export const setAffirmPriceAtom = atom(null, (_, set, element: string | null) => {
  if (!isString(element)) {
    return
  }
  set(affirmPriceAtom, element)
})

export const afterPayPriceAtom = atomWithReset<string | null>(null)
export const setAfterPayPriceLabelAtom = atom(null, (_, set, priceLabel: string | null) => {
  if (!isString(priceLabel) && priceLabel !== null) {
    return
  }
  // Extract price with currency from text like "or as low as $24.62/mo. with"
  const priceMatch = priceLabel.match(/([€$£¥₹])\s*(\d{1,3}(?:[,.\s]\d{3})*(?:[,.]\d{2})?)/)
  if (priceMatch) {
    set(afterPayPriceAtom, `${priceMatch[1]}${priceMatch[2]}`)
  } else {
    // Alternative pattern where currency comes after (e.g., 30.00€)
    const priceMatchAfter = priceLabel.match(/(\d{1,3}(?:[,.\s]\d{3})*(?:[,.]\d{2})?)\s*([€$£¥₹])/)
    if (priceMatchAfter) {
      set(afterPayPriceAtom, `${priceMatchAfter[1]}${priceMatchAfter[2]}`)
    }
  }
})

/*
 * New PDP state management
 */
// export const productDataAtom = atom<ProductData | null>(null)

export const productDataAtom = atom<DetailedProduct | null>(null) as WritableAtom<
  DetailedProduct | null,
  DetailedProduct | null,
  void
>

export const setNewProductDataAtom = atom<DetailedProduct | null, DetailedProduct | null>(
  null, // Initial value
  (get, set, newProductData) => {
    // Update the product data atom
    set(productDataAtom, newProductData)
    set(selectedColorAtom, newProductData?.selectedColor || newProductData?.defaultColor)
    set(selectedQtyAtom, 1)
    set(selectedSizeAtom, getDefaultSizeValue(newProductData))
    set(addToBagButtonRefAtom, null)

    // [XGEN vendor-agnostic] might be a better place for this
    set(updateXgenRecommendationsDataAtom, newProductData)
  }
)

/*
 * Selected color variant
 */
export const selectedColorAtom = atomWithDefault((get) => {
  const productData = get(productDataAtom)
  return productData?.selectedColor || productData?.defaultColor
})

/*
 * Write-only atom that should replace primitive atom setter
 * to remove prop-drill.
 */
export const setSelectedColorAtom = atom(null, (get, set, { id, masterId }) => {
  if (!isString(id) || !isString(masterId)) {
    return
  }
  const currentSelectedColor = get(selectedColorAtom)
  const productData = get(productDataAtom)
  const colors = <DetailedProduct['colors']>_get(productData, 'colors', [])
  const customizerVariants = get(customizerVariantsAtom)

  const allColors = [...customizerVariants, ...colors]

  if (!isArray(allColors) || isEmpty(allColors)) {
    return
  }

  const isCustomized = _get(currentSelectedColor, 'isCustomized')
  const isMonogrammed = _get(currentSelectedColor, 'isMonogrammed')
  const isCustomizedColor = isCustomized || isMonogrammed
  const selectedColor = allColors.find((color) => {
    if (isCustomizedColor) {
      return color.masterId === masterId && color.id === id
    }
    return color.masterId === masterId && (color.baseProductColor === id || color.id === id)
  })

  if (!selectedColor) {
    return
  }
  set(selectedColorAtom, selectedColor)
})

export const isMatchedVariant = (variant, selectedColor, selectedSize?: string) => {
  const isCustomizedColor = selectedColor?.isCustomized || selectedColor?.isMonogrammed
  const selectedColorId = _get(selectedColor, isCustomizedColor ? 'baseProductColor' : 'id')

  return (
    (variant?.masterId === selectedColor?.masterId ||
      variant?.productId?.includes(selectedColor?.masterId)) && // for PLP dataset
    variant?.variationValues?.color === selectedColorId &&
    (!selectedSize || variant?.variationValues?.size === selectedSize)
  )
}

export const selectedVariantAtom = atom((get) => {
  const productData = get(productDataAtom)
  const defaultVariant = _get(productData, 'defaultVariant')
  const variants = _get(productData, 'variant', _get(productData, 'variants', []))
  const selectedColor = get(selectedColorAtom)
  const selectedSize = get(selectedSizeAtom)
  const isSizedProduct = get(isSizedProductAtom)
  if (isSizedProduct) {
    return selectedSize
      ? variants.find((variant) => isMatchedVariant(variant, selectedColor, selectedSize))
      : defaultVariant
  }
  return variants?.find((variant) => isMatchedVariant(variant, selectedColor))
})

// represents selected variant data only if it's ready to be added to bag
export const selectedSubmittableVariantDataAtom = atom((get) => {
  const selectedVariant = get(selectedVariantAtom)
  const selectedSize = get(selectedSizeAtom)
  const isSizedProduct = get(isSizedProductAtom)
  if (isSizedProduct && !selectedSize) {
    return null
  }
  return selectedVariant
})

export const submittableVariantIdAtom = selectAtom(
  selectedSubmittableVariantDataAtom,
  (data) => data?.id
)

/*
 * Selected variant group
 */
export const selectedVariantGroupAtom = atom((get) => {
  const productData = get(productDataAtom)
  const selectedColor = get(selectedColorAtom)

  if (isEmpty(productData) || isEmpty(selectedColor)) {
    return null
  }
  if (selectedColor.masterId !== productData.masterId) {
    return null
  }

  const variationGroup = <DetailedProduct['variationGroup']>_get(productData, 'variationGroup', [])

  if (isEmpty(variationGroup)) {
    return null
  }

  const isMegaPDPEligible = _get(productData, 'isMegaPDPEligible', false)
  const isNewMegaPDP = _get(productData, 'isNewMegaPDP', false)
  const isCustomizedColor = selectedColor?.isCustomized || selectedColor?.isMonogrammed
  const selectedColorId = _get(selectedColor, isCustomizedColor ? 'baseProductColor' : 'id')

  if (isMegaPDPEligible || isNewMegaPDP) {
    return variationGroup.find((item) => {
      return item.masterId === selectedColor.masterId && item.id.includes(selectedColorId)
    })
  }

  if (!selectedColorId) {
    return
  }

  return variationGroup.find((item) => {
    if (item?.color === selectedColorId) {
      return true
    }

    const variationAttributes = <VariationAttribute[]>_get(item, 'variationAttributes', [])

    if (isEmpty(variationAttributes)) {
      return false
    }

    const colorAttributeValues = variationAttributes.find((attr) => {
      if (!attr.id || !attr.values) {
        return false
      }
      return attr.id === 'color' && isArray(attr.values)
    })?.values

    if (!colorAttributeValues || isEmpty(colorAttributeValues)) {
      return false
    }

    const containsSelectedColor = colorAttributeValues.some(
      (item) => item?.value === selectedColorId
    )

    if (!containsSelectedColor) {
      return false
    }

    return true
  })
})

export const currentProductVerticalAtom = atom((get) => {
  const productData = get(productDataAtom)
  const variantGroupData = get(selectedVariantGroupAtom)
  const selectedVariant = get(selectedVariantAtom)

  return getHierarchically('c_productVertical')(
    selectedVariant?.customAttributes,
    variantGroupData?.customAttributes,
    productData?.custom
  )
})

/*
 * New PDP Price atom
 */
export const productPriceAtom = atom((get) => {
  const productData = get(productDataAtom)
  const variantGroupData = get(selectedVariantGroupAtom)
  const selectedVariant = get(selectedVariantAtom)
  const preferences = get(preferencesAtom)
  const productVertical = get(currentProductVerticalAtom)

  const prices: any = _get(productData, 'prices', {})
  const defPrices = _get(productData, 'defaultVariant.prices', {})

  const pricingInfo = _get(variantGroupData, 'pricingInfo', [])

  const { discountPercentage, list, sales } = pricingInfo?.[0] || {}

  const regularPrice = list?.formatted || prices?.regularPrice || defPrices?.regularPrice
  const salePrice = sales?.formatted || prices?.currentPrice || defPrices?.currentPrice
  const discountPercentageValue = discountPercentage || prices?.discount || defPrices?.discount

  const hideDiscountPercentageOnPDP = _get(
    preferences,
    'OneSite.oneSitePDPConfig.hideDiscountPercentage',
    false
  )
  const hideComparableValueOnPDP = _get(
    preferences,
    'OneSite.oneSitePDPConfig.hideComparableValue',
    false
  )

  const {
    c_hideDiscountRate: hideDiscountRate,
    c_hideComparablePriceValue: hideComparablePriceValue,
  } = pickHierarchically(['c_hideDiscountRate', 'c_hideComparablePriceValue'])(
    selectedVariant?.customAttributes,
    variantGroupData?.customAttributes,
    productData?.custom
  )

  const hideDiscountPercentageOneSite =
    (hideDiscountPercentageOnPDP &&
      (productVertical === ProductVertical.Collection ||
        productVertical === ProductVertical.Outlet)) ||
    !!hideDiscountRate
  const hideComparableValueOneSite =
    (hideComparableValueOnPDP && productVertical === ProductVertical.Outlet) ||
    !!hideComparablePriceValue

  const selectedColor = get(selectedColorAtom)
  const isCustomizedProduct =
    _get(selectedColor, 'isCustomized', false) || _get(selectedColor, 'isMonogrammed', false)

  const customizedPrice = _get(selectedColor, 'price')
  const hasValidCustomizedPrice =
    customizedPrice && customizedPrice !== 'undefined' && customizedPrice !== 'N/A'

  return {
    regularPrice: isCustomizedProduct
      ? _get(selectedColor, 'standardPrice') || regularPrice
      : regularPrice,
    salePrice: isCustomizedProduct
      ? hasValidCustomizedPrice
        ? customizedPrice
        : 'N/A'
      : salePrice,
    discountPercentageValue: isCustomizedProduct ? 0 : discountPercentageValue,
    isCustomizedProduct,
    hideDiscountPercentageOneSite,
    hideComparableValueOneSite: hideComparableValueOneSite || isCustomizedProduct,
  }
})

/*
 * New PDP Price Group atom
 */

export const productPriceGroupAtom = atom((get) => {
  const { regularPrice, salePrice } = get(productPriceAtom)
  return {
    listPrice: regularPrice,
    salePrice,
  }
})

/*
 * SKU id atom
 */
export const skuIdAtom = atom((get) => {
  const productData = get(productDataAtom)
  const selectedColorId = get(selectedColorAtom)?.id
  const selectedVgId = get(selectedVariantGroupAtom)?.id
  return getCleanedSku(
    `${productData?.masterId} ${selectedColorId}` ||
      selectedVgId ||
      productData?.defaultVariant?.id ||
      ''
  )
})

export const promoCouponCodeAtom = atomWithStorage(STORAGE_PROMO_COUPON_CODE, null, sessionStorage)

/*
 * Selected material
 * TODO: Implement setter in PDPV5 code when we implement material selectors
 */
export const selectedMaterialAtom = atom((get) => {
  const productData = get(productDataAtom)
  return _get(productData, 'preSelectMaterial')
})

/*
 * Customizer variants
 * TODO: Implement setter in PDPV5 code when we implement enject customizer scripts
 */
export const customizerVariantsAtom = atom([])

/*
 * Atom to retrieve what color variations should be displayed.
 * Logic built from what is in ProductVariationsControls.
 */
export const displayedColorsAtom = atom((get) => {
  const productData = get(productDataAtom)
  const selectedMaterial = get(selectedMaterialAtom)
  const isNewMegaPDPEligible = get(isNewMegaPDPEligibleAtom)
  const isQuickView = get(isQuickViewAtom)
  const customizerVariants = get(customizerVariantsAtom)

  const groupColorsData = _get(productData, 'groupedColors', {})
  const newMegaPDPGroupData = _get(productData, 'newMegaPDPGroupData', {})

  const isPDPLoaded = has(productData, 'variant')

  let colorArray = _get(productData, 'colors', [])

  // MegaPDP logic
  if (selectedMaterial && !isNewMegaPDPEligible) {
    colorArray = groupColorsData[selectedMaterial?.materialName?.toLowerCase()] || []
  } else if (isNewMegaPDPEligible && isPDPLoaded && !isQuickView) {
    const colorKeyToAccess = productData?.selectedTabsData
      ?.map((attribute) => attribute?.name)
      .join('.')

    if (colorKeyToAccess?.length && !isEmpty(newMegaPDPGroupData)) {
      colorArray = getNewMegaPDPColors(
        newMegaPDPGroupData,
        colorKeyToAccess,
        _get(productData, 'colors', [])
      )
    }
  }

  // Enject logic
  colorArray = [
    ...Object.values(
      customizerVariants.reduce((acc, cur) => Object.assign(acc, { [cur?.id]: cur }), {})
    ),
    ...Object.values(
      colorArray.reduce((acc, cur) => Object.assign(acc, { [cur?.vgId]: cur }), {
        id: '',
        text: '',
        image: {
          src: '',
          title: '',
          alt: '',
        },
        orderable: false,
        media: {
          full: [],
          thumbnails: [],
          thumbnail: {
            src: '',
            title: '',
            alt: '',
          },
        },
        url: '',
        sizes: [],
        widths: [],
        vgId: '',
        masterId: '',
        materialName: '',
        styleGroup: '',
        displayIfOOS: false,
      })
    ),
  ]

  return colorArray
})

export const finalSaleShippingAtom = atom((get) => {
  const productData = get(productDataAtom)
  const selectedVariantGroupData = get(selectedVariantGroupAtom)

  const isOrderable = _get(selectedVariantGroupData, 'orderable')
  const isFinalSale = _get(selectedVariantGroupData, 'customAttributes.c_isFinalSale')

  const freeShipping = _get(productData, 'productSlots.contentSlots["free-shipping"]')
  const freeShippingReturn = _get(productData, 'productSlots.contentSlots["free-shipping-return"]')

  const isOnline = _get(freeShippingReturn, 'online.default', false)

  const finalSaleText =
    isOrderable && isOnline
      ? isFinalSale
        ? _get(freeShipping, 'content.text', '').toLowerCase()
        : _get(freeShippingReturn, 'content.text', '').toLowerCase()
      : ''

  const shippingBody = isOrderable ? (isFinalSale ? freeShipping : freeShippingReturn) : ''

  return { finalSaleText, shippingBody }
})

/**
 * Fast Shipping modal: content slot `fast-shipping-pdp` (same id as OCAPI fetch key).
 * Parsed with the same `freeShippingReturnParser` as `pdp-shipping-and-returns` — replicate markup (#shipText, etc.).
 *
 * Do not gate Learn more on selectedVariantGroupAtom / orderable. That atom can be null before
 * swatch hydration or in some templates, which incorrectly hid the CTA even when CMS slot exists.
 * Modal body is informational (same family as slot HTML), not purchase eligibility.
 */
export const fastShippingPdpAtom = atom((get) => {
  const productData = get(productDataAtom)
  const slot = _get(productData, 'productSlots.contentSlots.fast-shipping-pdp')

  const modalTitleRaw = _get(slot, 'content.text', '')
  const modalTitle = `${modalTitleRaw ?? ''}`

  const body = _get(slot, 'content.body')
  const shippingInfo = _get(slot, 'content.shippinginfo')
  const hasParsedSlotContent = Boolean(body || shippingInfo)

  return {
    modalTitle,
    shippingBody: slot,
    hasContent: hasParsedSlotContent,
  }
})

/** PDP slot `variety-of-payment-pdp` — Learn more modal (same parser contract as shipping-and-returns HTML) */
export const paymentVarietyPdpAtom = atom((get) => {
  const productData = get(productDataAtom)
  const slot = _get(productData, 'productSlots.contentSlots.variety-of-payment-pdp')

  const modalTitleRaw = _get(slot, 'content.text', '')
  const modalTitle = `${modalTitleRaw ?? ''}`

  const body = _get(slot, 'content.body')
  const shippingInfo = _get(slot, 'content.shippinginfo')
  const hasParsedSlotContent = Boolean(body || shippingInfo)

  return {
    modalTitle,
    shippingBody: slot,
    hasContent: hasParsedSlotContent,
  }
})

export const promoCalloutsPDPAtom = atom((get) => {
  const selectedVariant = get(selectedVariantAtom)
  const promoArr = _get(selectedVariant, 'promoPDP.promoCallOut', [])
  return promoArr.filter((promo) => {
    const text = _get(promo, '["call-out-message"].content.text')
    const spanText = _get(promo, '["call-out-message"].content.spanText')
    return !!text || !!spanText
  })
})

export const isSizedProductAtom = atom((get) => {
  const productData = get(productDataAtom)
  return _get(productData, 'sizes', []).length > 0
})

export const selectedSizeAtom = atomWithDefault<string>((get) => {
  const productData = get(productDataAtom)
  return getDefaultSizeValue(productData)
})

export const setSelectedSizeAtom = atom(null, (_, set, size: string) => {
  if (!isString(size)) {
    return
  }
  set(selectedSizeAtom, size)
  set(orderingErrorAtom, null)
})

export const rotationPromoMessagesAtom = atom((get) => {
  const promoArr = get(promoCalloutsPDPAtom)
  if (promoArr?.length > 0) {
    const ipx1Promo = getPromoByType(promoArr, PROMO_TYPES.IPX1)
    const isNotOTDPricePromosIPX1 = ipx1Promo?.filter(
      (promo) => !_get(promo, '[call-out-message].content.promo.hasOTDPrice', false)
    )
    const ipx2Promo = getPromoByType(promoArr, PROMO_TYPES.IPX2)
    const rbPromos = getPromoByType(promoArr, PROMO_TYPES.RB)
    return [isNotOTDPricePromosIPX1, ipx2Promo, rbPromos].flat()
  }
  return []
})

export const sizingRangeAtom = atom<number>(0)
export const setSizingRangeAtom = atom(null, (_, set, sizingRange: number) => {
  if (isNaN(sizingRange)) return
  set(sizingRangeAtom, sizingRange)
})

export const widthRangeAtom = atom<number>(0)
export const setWidthRangeAtom = atom(null, (_, set, widthRange: number) => {
  if (isNaN(widthRange)) return
  set(widthRangeAtom, widthRange)
})

export const tangibleeDataAtom = atom((get) => {
  const productData = get(productDataAtom)
  if (!productData) return {}
  const tangibleeProductData = _get(productData, 'tangibleeData', {}) || {}
  const tangibleeData = Object.keys(tangibleeProductData).reduce((acc, key) => {
    if (typeof tangibleeProductData[key] === 'boolean') {
      acc[getCleanedSku(key)] = tangibleeProductData[key]
    }
    return acc
  }, {})
  return tangibleeData
})

export const isTangibleePdpV7WfiContentReadyAtom = atom(false)

export const isPdpV7UgcAnchorNavVisibleAtom = atom(false)

export const selectedQtyAtom = atom<number>(1)

const getIsNotifyMeAvailable = (data) => {
  return _get(data, 'c_isNotifyMeAvailable', false)
}
export const isNotifyMeAvailableProductAtom = atom((get) => {
  const productData = get(productDataAtom)
  const selectedVariantData = get(selectedVariantAtom)
  return (
    getIsNotifyMeAvailable(productData?.master?.customAttributes) ||
    (selectedVariantData
      ? getIsNotifyMeAvailable(selectedVariantData?.customAttributes)
      : getIsNotifyMeAvailable(productData.custom))
  )
})

export const isCustomizedProductAtom = atom((get) => {
  const selectedColor = get(selectedColorAtom)
  const isCustomized = _get(selectedColor, 'isCustomized', false)
  const isMonogrammed = _get(selectedColor, 'isMonogrammed', false)
  return isCustomized || isMonogrammed
})

type OrderringErrorKey = keyof typeof ORDERING_ERROR
type OrderringErrorValue = typeof ORDERING_ERROR[OrderringErrorKey]
export const orderingErrorAtom = atomWithReset<OrderringErrorValue | null>(null)

export const scrollToReview42Atom = atom<boolean>(false)

type OrderringStatusKey = keyof typeof ORDERING_STATUS
type OrderringStatusValue = typeof ORDERING_STATUS[OrderringStatusKey]
export const orderingStatusAtom = atom<OrderringStatusValue>((get) => {
  const inventory = get(selectedVariantInventoryAtom)
  const { preorderable, orderable, backorderable } = inventory || {}

  if (backorderable) {
    return ORDERING_STATUS.backorder
  }
  if (preorderable) {
    return ORDERING_STATUS.preorder
  }
  return orderable ? ORDERING_STATUS.addToBag : ORDERING_STATUS.soldOut
})

export const persistSoldOutSettingAtom = atom((get) => {
  const orderingStatus = get(orderingStatusAtom)
  const isNotifyMeProduct = get(isNotifyMeAvailableProductAtom)
  const preferences = get(preferencesAtom)
  const persistSoldOut = _get(preferences, 'badging.persistSoldOut', false)

  return orderingStatus === ORDERING_STATUS.soldOut && isNotifyMeProduct && !persistSoldOut
})

export const isInStockTextAtom = atom((get) => {
  const selectedVariant = get(selectedVariantAtom)
  return checkInsStockText(selectedVariant)
})

export const addToBagButtonTextDataAtom = atom((get) => {
  const orderingStatus = get(orderingStatusAtom)
  const selectedVariant = get(selectedVariantAtom)
  const selectedColor = get(selectedColorAtom)

  return getAddToBagButtonTextData(selectedVariant, orderingStatus, selectedColor)
})

export const isStickyBarMinimizedAtom = atom<boolean>(false)
export const isStickyBarScrolledAtom = atom<boolean>(false)
export const addingToBagErrorAtom = atom<string>('')

export const hasErrorsAtom = atom((get) => {
  const orderingError = get(orderingErrorAtom)
  const maxQuantityError = get(maxQuantityErrorAtom)
  const addingToBagError = get(addingToBagErrorAtom)

  return Boolean(orderingError || maxQuantityError || addingToBagError)
})

export const dropAtbErrorsAtom = atom(null, (_, set) => {
  set(addingToBagErrorAtom, '')
  set(orderingErrorAtom, null)
  set(maxQuantityErrorAtom, false)
  set(applePayErrorOnPdpAtom, { errorType: null })
})

export const productDataForGaBadgesAtom = atom((get) => {
  const productData = get(productDataAtom)
  const selectedColor = get(selectedColorAtom)
  const selectedSubmittableVariantData = get(selectedSubmittableVariantDataAtom)
  const selectedVariantGroup = get(selectedVariantGroupAtom)
  const inventory = get(selectedVariantInventoryAtom)

  return getProductDataForBadges({
    productData,
    selectedColor,
    selectedSubmittableVariantData,
    selectedVariantGroup,
    inventory,
  })
})

export const gaProductDataAtom = atom((get) => {
  const productData = get(productDataAtom)
  const selectedVariantData = get(selectedVariantAtom)
  const selectedSize = get(selectedSizeAtom)
  const selectedQty = get(selectedQtyAtom)
  const selectedColor = get(selectedColorAtom)
  const wishlists = get(wishlistIdsAtom)
  const isMegaPDPEligible = get(isMegaPDPEligibleAtom)
  const productDataForBadges = get(productDataForGaBadgesAtom)
  const selectedSubmittableVariantData = get(selectedSubmittableVariantDataAtom)
  const inventory = get(selectedVariantInventoryAtom)

  return getGaProductData({
    productData,
    selectedVariantData,
    selectedSize,
    selectedQty,
    selectedColor,
    wishlists,
    isMegaPDPEligible,
    productDataForBadges,
    selectedSubmittableVariantData,
    inventory,
  })
})

/**
 * Atom to manage the state of meta product recommendations.
 *
 * @property {boolean} enabled - Indicates if the user navigated from meta.
 * @property {string} [productIds] - Array of product IDs to display as recommendations.
 * @property {boolean} [isMetaTest] - Determines if the new recommendations experiment should be shown.
 */
export const metaProductsAtom = atomWithReset<{
  enabled: boolean
  productIds?: string
  isMetaTest?: boolean
}>({
  enabled: false,
})

export const setMetaProductsAtom = atom(
  null,
  (
    _,
    set,
    {
      productIds,
      clickedProductId,
      isFromMeta,
    }: { productIds: string; clickedProductId: string; isFromMeta: boolean }
  ) => {
    const productsList = !!productIds.trim() ? productIds.split(',') : []
    const currentProductIdx = productsList.findIndex((p) => p === clickedProductId)

    if (currentProductIdx !== -1) {
      productsList.splice(currentProductIdx, 1)
    }
    productsList.unshift(clickedProductId)

    set(metaProductsAtom, {
      enabled: isFromMeta,
      productIds: productsList.join(','),
      isMetaTest: isFromMeta && !!productsList.length && !!clickedProductId,
    })
  }
)

export const productCardDetailsAtom = atom((get) => {
  const productData = get(productDataAtom)
  const productCardDetails = _get(productData, 'productCardDetails', [])
  const selectedVariantGroup = get(selectedVariantGroupAtom)

  return productCardDetails
    .map((card) => {
      const image = card.images[selectedVariantGroup?.id]
      if (!image) {
        return null
      }
      return {
        ...card,
        image,
      }
    })
    .filter(Boolean)
})

export const addToBagButtonRefAtom = atom<HTMLElement | null>(null as HTMLElement | null)

export const productDataForMarketingBadgesAtom = atom((get) => {
  const productData = get(productDataAtom)
  const selectedVariant = get(selectedVariantAtom)
  const selectedColor = get(selectedColorAtom)
  const selectedVariantGroup = get(selectedVariantGroupAtom)
  const inventory = get(selectedVariantInventoryAtom)

  return getProductDataForMarketingBadges({
    productData,
    selectedVariant,
    selectedColor,
    selectedVariantGroup,
    inventory,
  })
})

export const isFindInStorePickupAtom = atom((get) => {
  const productData = get(productDataAtom)
  const selectedVariant = get(selectedSubmittableVariantDataAtom)
  const selectedVariantGroup = get(selectedVariantGroupAtom)
  const displayBopisCTAToggle = _get(selectedVariant, 'displayBopisCTA', false)

  const isNewSelectedVariantAvailableForInStorePickup = _get(
    selectedVariant,
    'customAttributes.c_availableForInStorePickup',
    false
  )

  const isSelectedVariantGroupAvailableForInStorePickup = _get(
    selectedVariantGroup,
    'customAttributes.c_availableForInStorePickup',
    false
  )

  const data = selectedVariant || productData
  const isComingSoonProduct =
    _get(data, `customAttributes.c_inStockCustomText`, '') ||
    _get(data, `customAttributes.c_soldOutCustomText`, '')

  const isMembershipExclusiveProduct = _get(
    productData,
    'master.customAttributes.c_isMemberExclusive',
    ''
  )
  return (
    displayBopisCTAToggle &&
    (isNewSelectedVariantAvailableForInStorePickup ||
      isSelectedVariantGroupAvailableForInStorePickup) &&
    !isComingSoonProduct &&
    !isMembershipExclusiveProduct
  )
})

export const isFindInStoreAvailableAtom = atom((get) => {
  const productData = get(productDataAtom)
  const selectedVariant = get(selectedSubmittableVariantDataAtom)
  const selectedVariantGroup = get(selectedVariantGroupAtom)
  const displayBopisCTAToggle = _get(selectedVariant, 'displayBopisCTA', false)

  const isNewSelectedVariantAvailableForFindInStore = _get(
    selectedVariant,
    'customAttributes.c_isAvailableForFindInStore',
    false
  )

  const isSelectedVariantGroupAvailableForFindInStore = _get(
    selectedVariantGroup,
    'customAttributes.c_isAvailableForFindInStore',
    false
  )

  const data = selectedVariant || productData
  const isComingSoonProduct =
    _get(data, `customAttributes.c_inStockCustomText`, '') ||
    _get(data, `customAttributes.c_soldOutCustomText`, '')

  const isMembershipExclusiveProduct = _get(
    productData,
    'master.customAttributes.c_isMemberExclusive',
    ''
  )
  return (
    displayBopisCTAToggle &&
    (isNewSelectedVariantAvailableForFindInStore ||
      isSelectedVariantGroupAvailableForFindInStore) &&
    !isComingSoonProduct &&
    !isMembershipExclusiveProduct
  )
})

export const productCarouselActiveIndexAtom = atom<number>(0)

export const productCarouselGoToSlideRequestAtom = atom<number | null>(null) as WritableAtom<
  number | null,
  number | null,
  void
>

/** PDP v7 Tap to Discover / angle navigator: hide site header + use immersive hero chrome. */
export const isPdpV7TapToDiscoverImmersiveAtom = atom(false)

export const shouldRenderFindInStoreAtom = atom((get) => {
  const selectedVariant = get(selectedSubmittableVariantDataAtom)
  const selectedVG = get(selectedVariantGroupAtom)
  const isFindInStoreAvailable = get(isFindInStoreAvailableAtom)
  const isFindInStorePickup = get(isFindInStorePickupAtom)

  const isDiscontinued =
    _get(selectedVariant, 'customAttributes.c_isDiscontinued', false) ||
    _get(selectedVG, 'customAttributes.c_isDiscontinued', false)

  const preferences = get(preferencesAtom)
  const DisplayBopisCTA = _get(
    preferences,
    ['SFRA Unified Feature Cartridge', 'sfraEnableOverlayFindInStore'],
    false
  )

  const selectedColor = get(selectedColorAtom)
  const isCustomized = _get(selectedColor, 'isCustomized', false)
  const isMonogrammed = _get(selectedColor, 'isMonogrammed', false)
  const isCustomizerProduct = isCustomized || isMonogrammed

  return (
    (isFindInStoreAvailable || isFindInStorePickup) &&
    DisplayBopisCTA &&
    !isDiscontinued &&
    !isCustomizerProduct
  )
})

export const activePdpNavTabAtom = atom<string>('')

export const introBrowserSessionCompleteAtom = atomWithStorage<boolean>(
  STORAGE_FIRST_INTRO_BROWSER_SESSION_COMPLETE,
  false,
  createJSONStorage<boolean>(() => localStorage)
)
