import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import get from 'lodash/get'
import chunk from 'lodash/chunk'
import isObject from 'lodash/isObject'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Link from 'toro/components/Link'
import getAPIURL from 'helpers/getAPIURL'
import Image from 'toro/components/Image'
import useTheme from 'toro/hooks/useTheme'
import useViewportType from 'toro/hooks/useViewportType'
import ProductHeader from 'toro/components/product/ProductHeader'
import AddToBagButton from 'toro/components/product/AddToBagButton'
import BundleVariantSwatches from './bundleVariantSwatches'
import ProductVariationLabel from 'toro/components/product/ProductVariationControls/ProductVariationLabel'
import SessionContext from 'toro/components/SessionContext'
import PriceInfo from 'toro/components/product/PriceInfo'
import QuantitySelector from 'toro/components/product/QuantitySelector'
import ProductSizeControls from '../../ProductVariationControls/ProductSizeControls'
import NotifyMeButton from 'toro/components/product/NotifyMeWidget/NotifyMeButton'
import PWAContext from 'components/common/PWAContext'
import PropTypes from 'prop-types'
import ImageSlider from 'toro/components/ImageSlider'

import {
  filterProductVariants,
  getId,
  getMaxLengthButtonInRow,
  getOrderingStatus,
  getOrderingStatusByVG,
  getVariantInventoryFromVG,
  ORDERING_ERROR,
  ORDERING_STATUS,
  VARIATION_TYPES,
} from 'toro/helpers/productVariations'
import { useUpdateAtom } from 'jotai/utils'
import VariationMessages from 'toro/components/product/VariationMessages'
import usePreference from 'toro/hooks/usePreference'

import { forceLoadingDisplayAtom, userInteractedAtom } from 'store/pdp.atom'

import {
  bundleErrorsAtom,
  bundleOrderingStatusAtom,
  bundleSelectedVariationAtom,
  setBundleSelectedSizeAtom,
  setBundleSelectedWidthAtom,
  stickyContainerStateAtom,
} from 'store/bundle.atom'

import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import { filteredItemsWithSrc } from 'helpers/getColorSwatches'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import useAnalytics from 'toro/analytics/useAnalytics'
import pickPreference from 'toro/helpers/pickPreference'
import { ATB_DRAWER_ACTIONS, useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'
import useExperiment from 'toro/hooks/useExperiment'
import { useLoadMiniCartPopover } from 'toro/components/header/MiniCart/useLoadMiniCartPopover'
import { miniCartOpenReasonAtom, MiniCartOpenReasons } from 'store/global.atom'
import { useAddToCartPreviewDrawer } from 'toro/components/AddToCartPreviewDrawer/useAddToCartPreviewDrawer'

function BundleVariationCard({
  variantData,
  loading,
  apploading,
  siteId,
  getBundleSelectedVariants,
  selectedBundleVariantsData,
  onChangeQuantity,
  selectedVariantQty,
  isQuantitySelectorEnable,
  isFlyoutOpen,
  setFlyoutOpen,
  colors,
  maxQtyRestrictionEnabled,
  maxOrderQty,
  finalSalePrefrence,
  variantOrderingError = false,
  onSizeStateupdateorErrorUpdate,
  isDisplayOosSwatch,
  sourceCodeGroupId,
  bundleId,
  pdpExpecteShipdayMessageMarkup,
  bundleErrors,
  isApplePayEligible,
  setAddToBagClicked,
  selectedVariantQtyState,
}) {
  const theme = useTheme()
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const isMultiLocaleSizeExists = useRef(false)
  const { isPostAddToCartDesktopEnabled } = useAddToCartPreviewDrawer()
  const { space, borderRadius, borders } = theme
  const { viewport, isDesktop, isMobile, isTablet } = useViewportType()
  const isDiscontinued = get(variantData, 'custom.c_isDiscontinued')
  const normalizeBundleProduct = variantData
  const defaultVariantId = get(normalizeBundleProduct, 'master.defaultVariantID', '')
  const isPDPTemplateV3Mobile = useExperiment(EXPERIMENTS.PDP_V3) && isMobile
  const qtySelectorVariant = (isPDPTemplateV3Mobile && 'quantitySelectorV3') || undefined
  const styles = useMultiStyleConfig('pdpBundlingStyles', {
    variant: qtySelectorVariant,
  })
  const defaultVariant = normalizeBundleProduct?.variant?.find(
    (data) => data?.id === defaultVariantId
  )
  const bundleMasterId = get(normalizeBundleProduct, 'masterId')
  const defaultSelectedColorId = defaultVariant?.variationValues?.color
  const defaultSelectedColor = normalizeBundleProduct?.colors?.find?.(
    (data) => data.id === defaultSelectedColorId
  )
  const defaultVariantGroup = normalizeBundleProduct?.defaultVariantGroup
  const [selectedVariantGroup, setSelectedVariantGroup] = useState(defaultVariantGroup)
  const swatchColors = get(normalizeBundleProduct, 'colors', [])
  const label = {
    color: formatMessage({ id: 'pdp.product.colorText', defaultMessage: 'COLOR' }),
    size: formatMessage({ id: 'pdp.product.sizeText', defaultMessage: 'size' }),
    width: formatMessage({ id: 'pdp.product.widthText', defaultMessage: 'Width' }),
  }
  const showOos =
    get(normalizeBundleProduct, 'custom.c_displayIfOOS') ??
    get(selectedBundleVariantsData, 'variationGroupData.custom.c_displayIfOOS') ??
    get(selectedBundleVariantsData, 'customAttributes.c_displayIfOOS')
  const gender =
    get(selectedBundleVariantsData, 'customAttributes.c_gender', '') ??
    get(selectedBundleVariantsData, 'variationGroupData.custom.c_gender') ??
    get(normalizeBundleProduct, 'custom.c_gender')
  const showOosSwatches = isDisplayOosSwatch || showOos
  const [selectedBundleVariantSize, setSelectedBundleVariantSize] = useState(null)

  const [selectedBundleVariantColor, setSelectedBundleVariantColor] = useState(defaultSelectedColor)
  const colorsLength = normalizeBundleProduct?.colors?.length || []
  const { appData } = useContext(PWAContext)
  const setMiniCartOpenReason = useUpdateAtom(miniCartOpenReasonAtom)

  const { preferences, isSubBrandActive } = appData || {}
  const {
    'Storefront Configs': { defaultSize: neutralSizePref = {} },
  } = pickPreference({ 'Storefront Configs': ['defaultSize'] }, preferences)

  const activeBrandPref = isSubBrandActive ? neutralSizePref?.subBrand : neutralSizePref?.brand
  const isNeutralSizingEnabled = activeBrandPref?.isEnabled
  const neutralSizingCountryTypes = activeBrandPref?.sizeType || []

  const sizes = useMemo(
    () =>
      normalizeBundleProduct?.colors?.find?.((data) => data.id === selectedBundleVariantColor?.id)
        ?.sizes,
    [selectedBundleVariantColor]
  )
  isMultiLocaleSizeExists.current = !!sizes?.length && isObject(sizes[0]?.text)
  const isNeutralSizingApplicable = isNeutralSizingEnabled && isMultiLocaleSizeExists.current
  const sizesLength = sizes?.length
  const widths = useMemo(
    () =>
      normalizeBundleProduct?.colors?.find?.((data) => data.id === selectedBundleVariantColor?.id)
        ?.widths,
    [selectedBundleVariantColor]
  )
  const defaultSelectedWidth = widths?.find(
    (item) => item.value === variantData.defaultVariant.variationValues.width
  )
  const [selectedBundleVariantWidth, setSelectedBundleVariantWidth] = useState(
    defaultSelectedWidth ? defaultSelectedWidth : null
  )
  const widthsLength = widths?.length
  const setBundleSelectedSize = useUpdateAtom(setBundleSelectedSizeAtom)
  const setBundleSelectedWidth = useUpdateAtom(setBundleSelectedWidthAtom)
  const setBundleOrderingStatus = useUpdateAtom(bundleOrderingStatusAtom)
  const setBundleSelectedVariation = useUpdateAtom(bundleSelectedVariationAtom)
  const setStickyContianerState = useUpdateAtom(stickyContainerStateAtom)
  const setBundleErrors = useUpdateAtom(bundleErrorsAtom)
  const inStockTextForBundleVariant =
    get(selectedBundleVariantsData, 'customAttributes.c_inStockCustomText') ||
    get(selectedBundleVariantsData, 'instockText') ||
    get(selectedBundleVariantsData, 'defaultVariantData.custom.c_inStockCustomText') ||
    get(selectedBundleVariantsData, 'defaultVariationGroupData.custom.c_inStockCustomText')
  const labelValue = get(selectedBundleVariantColor, 'text', '')
  const { src, alt } = get(selectedBundleVariantColor, 'media.thumbnail', {})
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant)
  const url =
    (Object.keys(selectedVariant?.variationValues || [])?.length > 1 &&
      get(selectedVariant, 'url')) ||
    get(selectedBundleVariantColor, 'url', '')
  const [availableSizes, setAvailableSizes] = useState(null)
  const [availableWidths, setAvailableWidths] = useState(null)
  const filterItems = (items = [], filterExcluded = {}) =>
    items?.filter?.((item) => item?.orderable || item?.id === filterExcluded?.id) || []
  const [initialItems, setInitialItems] = useState(
    showOosSwatches ? swatchColors : filterItems(swatchColors, defaultSelectedColor)
  )
  const productMaxOrderableQty = useMemo(
    () =>
      get(selectedVariant, 'customAttributes.c_maxOrderableQuantity') ||
      get(normalizeBundleProduct, 'defaultVariantData.custom.c_maxOrderableQuantity', 0),
    [selectedVariant]
  )

  const productVariations =
    get(selectedBundleVariantsData, 'variant') || get(normalizeBundleProduct, 'variant', [])

  const {
    variantMaxQuantityError,
    variantItemsNotAvailableError,
    variantItemsNotAvailableMsg,
    variantItemsNotAvailableMsgFlag,
  } = bundleErrors

  const defaultOrderingStatus = useCallback(() => {
    getOrderingStatusByVG(selectedVariantGroup)
  }, [normalizeBundleProduct])

  const sourceCodeGroupAttributeMappingPreference = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'sourceCodeGroupAttributeMapping',
  })
  const sourceCodeGroupAttributeMapping = getSiteValueFromPref(
    sourceCodeGroupAttributeMappingPreference,
    siteId,
    {}
  )
  const displayedItems = useMemo(() => {
    const variationGroup = get(normalizeBundleProduct, 'variationGroup', [])
    const filteredSuppressed =
      variationGroup
        ?.filter?.((variation) => variation?.customAttributes?.c_suppressColorBundle)
        .map((item) => item?.customAttributes?.c_color) || []
    const filteredItemsSrc = filteredItemsWithSrc({
      items: initialItems,
      variationSrc: variationGroup,
      sourceCodeGroupId,
      sourceCodeGroupAttributeMapping,
    })
    return filteredItemsSrc?.filter?.((item) => !filteredSuppressed.includes(item?.id)) || []
  }, [initialItems, normalizeBundleProduct])

  const hideBundleProductATCButtonPreference = usePreference({
    groupId: 'bundleConfigurations',
    preferenceId: 'hideBundleProductATCButton',
  })

  const hideBundleProductATCButton = getSiteValueFromPref(
    hideBundleProductATCButtonPreference,
    siteId,
    false
  )

  // FIXME: First of all, defaultOrderingStatus() doesn't have a return statement, so it will return "undefined".
  // FIXME: Second of all, defaultOrderingStatus() is called on every re-render instead of being called on the initial
  //   render only.
  const [variantOrderingStatus, setVariantOrderingStatus] = useState(defaultOrderingStatus())
  const [isNotifyMeAvailableBundleProduct, setIsNotifyMeAvailableBundle] = useState(
    normalizeBundleProduct?.custom?.c_isNotifyMeAvailable
  )

  const isNotifyMeBundle =
    variantOrderingStatus === ORDERING_STATUS.soldOut && isNotifyMeAvailableBundleProduct

  const [orderingError, setOrderingError] = useState(null)
  const [maxQuantityError, setMaxQuantityError] = useState(false)
  const [maxQtyErrorMsg, setMaxQtyErrorMsg] = useState('')
  const setForceLoadingDisplay = useUpdateAtom(forceLoadingDisplayAtom)
  const [itemsNotAvailableMsg, setItemsNotAvailableMsg] = useState('')
  const [itemsNotAvailableMsgFlag, setItemsNotAvailableMsgFlag] = useState(false)
  const setUserInteracted = useUpdateAtom(userInteractedAtom)
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const loadMiniCartPopover = useLoadMiniCartPopover()

  const postponedAddToBagCall = useRef()
  const addToCartPartialAddQuantity = useRef()

  const isAddToCartDrawerEnabled = get(appData, 'isAddToCartDrawerEnabled', false)

  const { actions: sessionActions, session } = useContext(SessionContext)

  const cartItems = get(session, 'cart.product_items', [])
  const cartQuantity = cartItems?.find?.(
    (item) => item?.product_name === normalizeBundleProduct?.name
  )?.quantity

  const onSelectingSwatch = (value) => {
    setSelectedBundleVariantColor(value)
    const swatchVariationGroup = normalizeBundleProduct?.variationGroup?.find((data) =>
      data?.id.includes(value?.id)
    )
    setSelectedVariantGroup(swatchVariationGroup)
    analytics.send('swatchInteraction', {
      eventLocation: 'product',
      eventAction: 'swatch click',
      swatchType: get(label, 'color'),
      swatchValue: value?.text,
      eventLabel: normalizeBundleProduct?.id,
      eventpage_location: 'product',
    })
  }
  const onSelectionChange = () => {
    const selectedColorId = getId(selectedBundleVariantColor)
    const selectedSizeId = get(selectedBundleVariantSize, 'value')
    const selectedWidthId = get(selectedBundleVariantWidth, 'value')

    let nextSelectedVariant = null
    let filteredVariants

    if (selectedColorId) {
      filteredVariants = productVariations?.filter?.(
        (item) =>
          item?.productId?.includes?.(selectedColorId) ||
          get(item, `variationValues.${VARIATION_TYPES.color}`, '') === selectedColorId
      )
    } else {
      filteredVariants = productVariations
    }
    const getNextAvailableSizes = (filteredVariants) => {
      return filteredVariants
        ?.map?.((item) => {
          if (item?.orderable) {
            return item?.value
          }
          return false
        })
        .filter((item) => item)
    }
    const getNextAvailableWidths = (filteredVariants) => {
      return filteredVariants
        ?.map?.((item) => {
          if (item?.orderable) {
            return item?.value
          }
          return false
        })
        .filter((item) => item)
    }
    const nextAvailableSizes = getNextAvailableSizes(sizes)
    const nextAvailableWidths = getNextAvailableWidths(widths)
    if (
      (selectedBundleVariantColor || !colorsLength) &&
      (selectedBundleVariantSize || !sizesLength) &&
      (selectedBundleVariantWidth || !widthsLength)
    ) {
      nextSelectedVariant = get(
        filterProductVariants(filteredVariants, {
          color: selectedColorId,
          size: selectedSizeId,
          width: selectedWidthId,
        }),
        '[0]'
      )
    }
    setSelectedVariant(nextSelectedVariant)
    setAvailableSizes(nextAvailableSizes)
    setAvailableWidths(nextAvailableWidths)

    const orderableVariants = filterProductVariants(filteredVariants, {
      onlyOrderable: true,
      color: selectedColorId,
      size: selectedSizeId,
      width: selectedWidthId,
    })

    if (orderableVariants?.length === 0) {
      setVariantOrderingStatus(ORDERING_STATUS.soldOut)
      setIsNotifyMeAvailableBundle(false)
    }
  }

  const allLevelsProductsData = {
    product:
      selectedVariant ||
      selectedBundleVariantsData ||
      getVariantInventoryFromVG(selectedBundleVariantsData, selectedVariant),
    variationGroupData:
      selectedBundleVariantsData ||
      selectedBundleVariantsData?.defaultVariationGroupData ||
      normalizeBundleProduct?.defaultVariationGroupData,
    masterData: normalizeBundleProduct,
    promoText: normalizeBundleProduct?.promoText,
    instockText: normalizeBundleProduct?.instockText,
    bestSellerCheck: normalizeBundleProduct?.activeProductData?.bestseller,
  }

  const checkFinalSale =
    (sizesLength && !selectedBundleVariantSize) || (widthsLength && !selectedBundleVariantWidth)
      ? get(selectedBundleVariantsData, 'customAttributes.c_isFinalSale', false)
      : get(selectedBundleVariantsData, 'customAttributes.c_isFinalSale', false) &&
        get(selectedBundleVariantsData, 'selectedVariant.customAttributes.c_isFinalSale', false)

  const variationMessagesProps = {
    errorType: variantOrderingError ? ORDERING_ERROR.notSelected : orderingError,
    maxQuantityError: variantMaxQuantityError || maxQuantityError,
    maxQtyErrorMsg,
    itemsNotAvailableMsg: variantItemsNotAvailableMsg || itemsNotAvailableMsg,
    itemsNotAvailableMsgFlag:
      variantItemsNotAvailableError || variantItemsNotAvailableMsgFlag || itemsNotAvailableMsgFlag,
    ...allLevelsProductsData,
    isNotifyMeProduct: isNotifyMeAvailableBundleProduct,
    status: variantOrderingStatus,
    isFinalSale: checkFinalSale,
    widthLength: widthsLength,
    sizesLength,
    selectedSize: selectedBundleVariantSize,
    selectedWidth: selectedBundleVariantWidth,
    siteId,
    finalSalePrefrence: finalSalePrefrence ? [finalSalePrefrence] : [],
    apploading,
    pdpExpecteShipdayMessageMarkup,
    isBundleVariant: true,
  }

  const handleAddedItemsNotAvailable = (quantity, availableQuantity) => {
    const notAddedToBagQuantity = quantity - availableQuantity
    const biggerThanOne = notAddedToBagQuantity > 1
    if (availableQuantity > 0) {
      setItemsNotAvailableMsgFlag(true)
      setItemsNotAvailableMsg(
        `${availableQuantity} item${availableQuantity > 1 ? 's' : ''} ha${
          availableQuantity > 1 ? 've' : 's'
        } been moved to your bag. ${notAddedToBagQuantity} item${biggerThanOne ? 's' : ''} ${
          biggerThanOne ? 'are' : 'is'
        } no longer available and cannot be added to your bag.`
      )
    }
  }
  const [, setDrawerState] = useDrawerAtom()

  const showAddToCartDrawer = useCallback(
    (variantId, quantity, partialAdded, isAddToCartDrawerDisableCallback) => {
      if (!isAddToCartDrawerEnabled) {
        isAddToCartDrawerDisableCallback?.()
        return
      }

      if (quantity) {
        setDrawerState({
          type: ATB_DRAWER_ACTIONS.BATCH_DRAWER_STATE,
          payload: {
            drawerQuantity: quantity,
            isPartialAdded: !!partialAdded,
            drawerVisible: true,
            variantId,
          },
        })
      }
    },
    [setDrawerState, isAddToCartDrawerEnabled]
  )

  const onAddToBagButtonClick = async (isSticky) => {
    let quantity

    if (!session?.initialized) {
      postponedAddToBagCall.current = { arg: isSticky }
      setForceLoadingDisplay(true)
      return
    }

    setItemsNotAvailableMsg('')
    addToCartPartialAddQuantity.current = null

    if (
      (sizesLength && !selectedBundleVariantSize) ||
      (widthsLength && !selectedBundleVariantWidth)
    ) {
      analytics.send('siteError', {
        eventAction: 'add to cart',
        eventLocation: 'product',
        eventLabel: 'select size and width',
      })
      setOrderingError(ORDERING_ERROR.notSelected)
      setForceLoadingDisplay(false)
      setFullscreenLoading(false)
      return
    }
    const maxQty =
      maxQtyRestrictionEnabled &&
      (productMaxOrderableQty <= 0 ? maxOrderQty : productMaxOrderableQty)
    if (cartQuantity && selectedVariantQty > maxQty && cartQuantity === +maxQty) {
      setMaxQuantityError(true)
      setForceLoadingDisplay(false)
      setFullscreenLoading(false)
      return
    }

    setUserInteracted(true)
    setForceLoadingDisplay(true) // adding this here so there's no flickering for the loading indicator
    setFullscreenLoading(true)
    const status =
      !selectedVariant || !selectedVariant?.inventory
        ? getOrderingStatusByVG(selectedVariantGroup)
        : getOrderingStatus(
            selectedVariant,
            selectedBundleVariantColor,
            selectedBundleVariantSize,
            selectedBundleVariantWidth,
            apploading
          )
    if (status === variantOrderingStatus) {
      try {
        const cartItems = get(session, 'cart.product_items', [])
        const productInCart =
          cartItems?.filter?.(
            (productInCart) =>
              productInCart?.product_id === selectedVariant?.id && !productInCart?.storeName
          ) || []

        const cartQuantity = productInCart.reduce(
          (totalQty, product) => (totalQty += product?.quantity || 0),
          0
        )

        const isCartIncludesProduct = !!productInCart?.length
        const vrItem = getVariantInventoryFromVG(selectedBundleVariantsData, selectedVariant)
        const availableQuantity = get(vrItem, 'inventory.ats', 0)
        if (availableQuantity < 1) {
          setItemsNotAvailableMsgFlag(true)
          setItemsNotAvailableMsg(
            formatMessage({
              id: 'pdp.product.itemNotAvailable',
              defaultMessage: 'This item is no longer available and cannot be added to your bag.',
            })
          )
          setForceLoadingDisplay(false)
          setFullscreenLoading(false)
          return
        }

        loadMiniCartPopover()

        let isQuantityNotAvailable
        if (isCartIncludesProduct && availableQuantity) {
          const selectedQuantity = cartQuantity + selectedVariantQty
          const lowestPossibleQtyValue = availableQuantity < maxQty ? +availableQuantity : +maxQty
          isQuantityNotAvailable = lowestPossibleQtyValue < selectedQuantity
          quantity = isQuantityNotAvailable
            ? lowestPossibleQtyValue - cartQuantity
            : selectedQuantity
          if (cartQuantity < lowestPossibleQtyValue) {
            await sessionActions.updateCart({
              product: selectedBundleVariantsData,
              quantity: isQuantityNotAvailable
                ? quantity + get(productInCart[0], 'quantity', 0)
                : quantity,
              itemId: get(productInCart[0], 'item_id'),
              c_isBundleProductLineItem: true,
              c_fromBundleID: bundleId,
              c_headlessLastUpdated: new Date().toISOString(),
              isApplePayEligible: isApplePayEligible,
            })
          }

          if (isQuantityNotAvailable) {
            handleAddedItemsNotAvailable(selectedVariantQty, quantity)
            if (availableQuantity) {
              setMaxQuantityError(true)
              setItemsNotAvailableMsgFlag(false)
            } else {
              setItemsNotAvailableMsgFlag(true)
            }
            addToCartPartialAddQuantity.current = quantity - cartQuantity
          }
        } else {
          isQuantityNotAvailable = availableQuantity < selectedVariantQty
          quantity = isQuantityNotAvailable ? availableQuantity : selectedVariantQty

          await sessionActions.addToCart({
            productId: vrItem?.id || selectedBundleVariantsData?.id,
            quantity,
            c_fromBundleID: bundleId,
            c_isBundleProductLineItem: true,
            c_headlessLastUpdated: new Date().toISOString(),
            isApplePayEligible: isApplePayEligible,
          })

          if (isQuantityNotAvailable) {
            handleAddedItemsNotAvailable(selectedVariantQty, availableQuantity)
            if (availableQuantity) {
              setMaxQuantityError(true)
              setItemsNotAvailableMsgFlag(false)
            } else {
              setItemsNotAvailableMsgFlag(true)
            }
            addToCartPartialAddQuantity.current = availableQuantity
          }
        }
        setForceLoadingDisplay(false)
        setFullscreenLoading(false)

        if (isMobile || isTablet) {
          const quantity = addToCartPartialAddQuantity.current
            ? addToCartPartialAddQuantity.current
            : selectedVariantQty || 0
          showAddToCartDrawer(
            vrItem?.id || selectedBundleVariantsData?.id,
            quantity,
            addToCartPartialAddQuantity.current,
            () => setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
          )
        } else if (
          !isPostAddToCartDesktopEnabled ||
          !isQuantityNotAvailable ||
          addToCartPartialAddQuantity.current > 0
        ) {
          setMiniCartOpenReason(MiniCartOpenReasons.AddToBag)
        }
      } catch (e) {
        console.error(e) // TODO: proper user feedback on error
        setMaxQtyErrorMsg(
          formatMessage({
            id: 'pdp.somethingWentWrongMsg',
            defaultMessage: 'Something went wrong, please try again',
          })
        )
        setForceLoadingDisplay(false)
        setFullscreenLoading(false)
      } finally {
        addToCartPartialAddQuantity.current = null
      }
    }
    setForceLoadingDisplay(false)
    setFullscreenLoading(false)
    if (status === ORDERING_STATUS.soldOut) {
      setOrderingError(ORDERING_ERROR.notAvailable)
    }
    setVariantOrderingStatus(status)
  }

  const addToBagButtonProps = {
    status: variantOrderingStatus,
    maxQuantityError,
    productData: selectedVariant || selectedBundleVariantsData || normalizeBundleProduct,
    onClick: onAddToBagButtonClick,
    instockText: normalizeBundleProduct?.instockText,
    colors: colors,
    // enableMobileAddToBagButton: enableMobileAddToBagSiteValue,
    apploading,
    selectedVariantQty,
    bundleId,
    individualBundleProduct: true,
  }

  const maxSizeButtonsInRow = getMaxLengthButtonInRow(sizes, isDesktop, false)
  const maxWidthButtonsInRow = getMaxLengthButtonInRow(widths, isDesktop, false)

  const stickyContainerData = {
    gender,
    sizesLength,
    selectedBundleVariantSize,
    availableSizes,
    setSelectedBundleVariantSize,
    orderingError,
    maxSizeButtonsInRow,
    sizes,
    productId: normalizeBundleProduct?.masterId || normalizeBundleProduct?.id,
    thumbnail: { src, alt },
    productName: variantData?.name,
    variationMessagesProps,
    ...(widthsLength
      ? {
          widthsLength,
          selectedBundleVariantWidth,
          availableWidths,
          setSelectedBundleVariantWidth,
          widths,
        }
      : {}),
    isNeutralSizingApplicable,
    neutralSizingCountryTypes,
  }

  useEffect(() => {
    const selectedBundleVariant = selectedVariant ?? defaultVariant
    selectedBundleVariant?.id &&
      getBundleSelectedVariants({
        masterId: bundleMasterId,
        selectedVariantGroup: selectedVariantGroup,
        selectedVariant: selectedBundleVariant,
        selectedBundleVariantColor,
        stickyContainerData,
        gender,
      })

    setBundleErrors((bundleErrors) => ({
      ...bundleErrors,
      [bundleMasterId]: {
        maxQuantityError: false,
        itemsNotAvailableError: false,
        payload: {},
      },
    }))
    setMaxQuantityError(false)
    setItemsNotAvailableMsgFlag(false)
    setMaxQtyErrorMsg('')
    setItemsNotAvailableMsg('')
  }, [selectedVariant?.id, selectedVariantGroup?.id])

  useEffect(() => {
    if (
      selectedBundleVariantSize ||
      selectedBundleVariantWidth ||
      variationMessagesProps?.errorType
    ) {
      onSizeStateupdateorErrorUpdate({ masterId: bundleMasterId, stickyContainerData })
    }
  }, [selectedBundleVariantSize, variationMessagesProps?.errorType, selectedBundleVariantWidth])

  useEffect(() => {
    if (selectedBundleVariantsData || !selectedVariant) {
      const status =
        !selectedVariant || !selectedVariant?.inventory
          ? getOrderingStatusByVG(selectedVariantGroup)
          : getOrderingStatus(
              selectedVariant || normalizeBundleProduct?.defaultVariantData,
              selectedBundleVariantColor,
              selectedBundleVariantSize,
              selectedBundleVariantWidth,
              apploading
            )
      if (inStockTextForBundleVariant) {
        setVariantOrderingStatus(ORDERING_STATUS.notForSale)
      } else {
        setVariantOrderingStatus(status)
      }

      selectedVariant &&
        setIsNotifyMeAvailableBundle(selectedVariant?.customAttributes?.c_isNotifyMeAvailable)
    }
  }, [
    selectedVariant,
    selectedBundleVariantsData,
    selectedBundleVariantColor,
    selectedBundleVariantSize,
    selectedBundleVariantWidth,
  ])

  useEffect(() => {
    sizesLength &&
      setBundleSelectedSize({
        [bundleMasterId]: [selectedBundleVariantSize?.value, sizesLength],
      })

    widthsLength &&
      setBundleSelectedWidth({
        [bundleMasterId]: [selectedBundleVariantWidth?.value, widthsLength],
      })
    setBundleSelectedVariation((bundleSelectedVariation) => ({
      ...bundleSelectedVariation,
      [bundleMasterId]: [
        selectedBundleVariantColor,
        selectedBundleVariantSize,
        selectedBundleVariantWidth,
      ],
    }))
  }, [selectedBundleVariantColor, selectedBundleVariantSize, selectedBundleVariantWidth])

  useEffect(() => {
    setBundleOrderingStatus((bundleOrderingStatus) => ({
      ...bundleOrderingStatus,
      [bundleMasterId]: [variantOrderingStatus, isNotifyMeAvailableBundleProduct],
    }))
  }, [variantOrderingStatus, isNotifyMeAvailableBundleProduct])

  useEffect(() => {
    onSelectionChange()
  }, [
    selectedBundleVariantSize,
    selectedBundleVariantWidth,
    selectedBundleVariantColor,
    productVariations,
  ])

  useEffect(() => {
    stickyContainerData?.sizesLength &&
      selectedBundleVariantsData?.id &&
      setStickyContianerState((prevStickyData) => ({
        ...prevStickyData,
        [bundleMasterId]: stickyContainerData,
      }))
  }, [
    selectedBundleVariantsData,
    variantOrderingStatus,
    isNotifyMeAvailableBundleProduct,
    selectedBundleVariantColor,
  ])

  useEffect(() => {
    setInitialItems(
      showOosSwatches ? swatchColors : filterItems(swatchColors, defaultSelectedColor)
    )
  }, [swatchColors])

  const onSizeControlChange = useCallback(
    (value) => {
      setSelectedBundleVariantSize(value)
      // send analytics - size
      analytics.send('swatchInteraction', {
        eventLocation: 'product',
        eventAction: 'swatch click',
        swatchType: get(label, 'size'),
        swatchValue: value?.text,
        eventLabel: normalizeBundleProduct?.id,
        swatchVariant: `${normalizeBundleProduct?.id} ${value?.text} ${
          selectedBundleVariantWidth?.text || ''
        }`, // masterid-color/size width
      })
    },
    [label, normalizeBundleProduct?.id, selectedBundleVariantWidth?.text]
  )

  const onWidthControlChange = useCallback(
    (value) => {
      setSelectedBundleVariantWidth(value)
      // send analytics - width
      analytics.send('swatchInteraction', {
        eventLocation: 'product',
        eventAction: 'swatch click',
        swatchType: get(label, 'width'),
        swatchValue: value?.text,
        eventLabel: normalizeBundleProduct?.id,
        swatchVariant: `${normalizeBundleProduct?.id} ${selectedBundleVariantSize?.text || ''} ${
          value?.text
        }`, // masterid-color/size width
      })
    },
    [label, normalizeBundleProduct?.id, selectedBundleVariantWidth?.text]
  )

  const onQuantityChange = useCallback(
    (qty) => {
      onChangeQuantity?.(qty, bundleMasterId)
    },
    [bundleMasterId, selectedVariantQtyState]
  )

  const slides = useMemo(() => chunk(displayedItems, 5), [displayedItems])

  if (isDiscontinued) {
    return null
  }

  const renderButtons = (isNotifyMeBundle, hideBundleProductATCButton, apploading) => {
    return !isNotifyMeBundle ? (
      <Box>
        {!hideBundleProductATCButton && (
          <Flex sx={styles.atbControlsWrapper}>
            {!isQuantitySelectorEnable && (
              <QuantitySelector
                flexShrink={0}
                maxQty={productMaxOrderableQty}
                disabled={variantOrderingStatus === ORDERING_STATUS.soldOut || maxQuantityError}
                selectedQuantity={selectedVariantQty}
                onChange={onQuantityChange}
                isQuickView={false}
                productId={bundleMasterId}
                variant={qtySelectorVariant}
                isBundleVariant
              />
            )}
            <AddToBagButton
              {...addToBagButtonProps}
              isSticky
              isBundleVariant
              selectedVariant={selectedVariant}
              selectedQty={selectedVariantQty}
              setAddToBagClicked={setAddToBagClicked}
            />
          </Flex>
        )}
      </Box>
    ) : (
      <Box>
        <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
          <VariationMessages {...variationMessagesProps} isSticky />
        </Experiment>
        {!hideBundleProductATCButton && (
          <Flex w="100%" sx={styles.atbControlsWrapper}>
            {!isQuantitySelectorEnable && (
              <QuantitySelector
                flexShrink={0}
                maxQty={productMaxOrderableQty}
                disabled={variantOrderingStatus === ORDERING_STATUS.soldOut}
                productId={bundleMasterId}
                variant={qtySelectorVariant}
                isBundleVariant
              />
            )}
            {!apploading && (
              <NotifyMeButton
                productId={get(selectedBundleVariantsData, 'id', null)}
                setOrderingError={setOrderingError}
                selectedVariant={selectedVariant}
                isFlyoutOpen={isFlyoutOpen}
                setFlyoutOpen={setFlyoutOpen}
                isBundleVariant
                isDesktop={isDesktop}
              />
            )}
          </Flex>
        )}
      </Box>
    )
  }

  return (
    <Box
      mt="24px"
      id={bundleMasterId}
      borderTop={`${borders['1px']} ${theme.colors.main.inactive}`}
      pt="24px"
      sx={styles.bundleVariantCard}
      className="individual-bundle-product"
    >
      <Flex sx={styles.bundleTopInfo} gridGap={3}>
        <Box
          cursor="pointer"
          m={`0 ${space.s1} ${space.sm1}`}
          width="110px"
          minH="95px"
          backgroundColor="#f0f0f0"
          as="button"
          position="relative"
          borderRadius={borderRadius.default}
          boxSizing="content-box"
          sx={styles.bundleVariantImageContainer}
          className="individual-bundle-product-image-containers"
        >
          <Link href={url} prefetchUrl={getAPIURL(url)} scroll={false}>
            <Image
              borderRadius={borderRadius.default}
              w="100%"
              src={src}
              alt={alt}
              lazy={!isDesktop}
              aspectImgRatio={'0.84'}
              pdp={viewport === 'mobile'}
              sx={styles.bundleVariantImage}
            />
          </Link>
        </Box>
        <Box className="individual-bundle-product-info" sx={styles.bundleProductInfo}>
          <ProductHeader
            productData={normalizeBundleProduct}
            selectedBundleVariantsData={selectedBundleVariantsData}
            isDiscontinued={isDiscontinued}
            loading={loading}
            apploading={apploading}
            isBundleVariant
            bundleVariantUrl={url}
            bundleCardRedirect={true}
          />
          <Box
            align="center"
            className="price-container"
            mb={!isDesktop && '10px'}
            sx={styles.bundlePriceContainer}
          >
            <PriceInfo
              productData={normalizeBundleProduct}
              selectedVariant={
                selectedVariant ||
                selectedBundleVariantsData?.selectedVariant ||
                selectedBundleVariantsData
              }
              selectedColor={selectedBundleVariantColor}
              isBundleVariant
            />
          </Box>
          <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
            <Box
              sx={styles.BundleVariantSwatchesContainer}
              data-qa="bundle_select-color-variant"
              className="bundle-select-color-variant"
            >
              <ImageSlider swipeable={!isDesktop} isDesktop={isDesktop} arrows>
                {slides.map((displayedItems, index) => (
                  <ImageSlider.Slide
                    key={`color-group-${index}`}
                    pl={slides.length > 0 && Boolean(index) ? 'var(--spacing-4)' : 0}
                    sx={styles.swatchSlider?.(true)}
                    justifyContent="flex-start"
                  >
                    {React.Children.toArray(
                      displayedItems?.map((item, idx) => (
                        <BundleVariantSwatches
                          key={idx}
                          item={item}
                          selected={getId(item) === getId(selectedBundleVariantColor)}
                          onClick={onSelectingSwatch}
                          disabled={!item.orderable}
                          styles={styles}
                        />
                      ))
                    )}
                  </ImageSlider.Slide>
                ))}
              </ImageSlider>
            </Box>
            <Box minH={isDesktop && '25px'} mt={isDesktop && '14px'}>
              <ProductVariationLabel
                label={get(label, 'color')}
                value={labelValue}
                variantType="color"
                isBundleCard
              />
            </Box>
          </Experiment>
        </Box>
      </Flex>
      <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
        <Box minH={isDesktop && '25px'} mt={isDesktop && '14px'}>
          <ProductVariationLabel
            label={get(label, 'color')}
            value={labelValue}
            variantType={'color'}
          />
        </Box>
        <Box sx={styles.BundleVariantSwatchesContainer} data-qa="bundle_select-color-variant">
          {React.Children.toArray(
            displayedItems?.map((item, idx) => (
              <BundleVariantSwatches
                key={idx}
                item={item}
                selected={getId(item) === getId(selectedBundleVariantColor)}
                onClick={onSelectingSwatch}
                disabled={!item.orderable}
                styles={styles}
              />
            ))
          )}
        </Box>
      </Experiment>
      {sizesLength > 0 && (
        <ProductSizeControls
          h={isDesktop && '171px'}
          label={get(label, 'size')}
          gender={gender}
          items={sizes}
          selectedItem={selectedBundleVariantSize}
          availableItems={availableSizes}
          onChange={onSizeControlChange}
          showErrorIfEmpty={orderingError === ORDERING_ERROR.notSelected}
          maxItemsInRow={maxSizeButtonsInRow}
          productId={normalizeBundleProduct?.id}
          isBundleVariant={variationMessagesProps?.isBundleVariant}
          variantType={'size'}
          isNeutralSizingApplicable={isNeutralSizingApplicable}
          neutralSizingCountryTypes={neutralSizingCountryTypes}
        />
      )}
      {widthsLength > 0 && (
        <ProductSizeControls
          h={isDesktop && '75px'}
          label={get(label, 'width')}
          items={widths}
          selectedItem={selectedBundleVariantWidth}
          availableItems={availableWidths}
          onChange={onWidthControlChange}
          showErrorIfEmpty={orderingError === ORDERING_ERROR.notSelected}
          maxItemsInRow={maxWidthButtonsInRow}
          productId={normalizeBundleProduct?.id}
          variantType={'width'}
          isBundleVariant
        />
      )}
      <VariationMessages {...variationMessagesProps} isSticky />
      {renderButtons(isNotifyMeBundle, hideBundleProductATCButton, apploading)}
    </Box>
  )
}

BundleVariationCard.propTypes = {
  variantData: PropTypes.object,
  apploading: PropTypes.bool,
  loading: PropTypes.bool,
  siteId: PropTypes.string,
  getBundleSelectedVariants: PropTypes.func,
  selectedBundleVariantsData: PropTypes.object,
  setSelectedBundleVariantsData: PropTypes.func,
  onChangeQuantity: PropTypes.func,
  selectedVariantQty: PropTypes.number,
  isQuantitySelectorEnable: PropTypes.bool,
  isFlyoutOpen: PropTypes.bool,
  setFlyoutOpen: PropTypes.func,
  colors: PropTypes.object,
  maxQtyRestrictionEnabled: PropTypes.bool,
  maxOrderQty: PropTypes.number,
  finalSalePrefrence: PropTypes.object,
  variantOrderingError: PropTypes.bool,
  onSizeStateupdateorErrorUpdate: PropTypes.func,
  selectedVariantSize: PropTypes.string,
  selectedVariantWidth: PropTypes.string,
  isDisplayOosSwatch: PropTypes.bool,
  sourceCodeGroupId: PropTypes.string,
  bundleId: PropTypes.string,
  pdpExpecteShipdayMessageMarkup: PropTypes.string,
  bundleErrors: PropTypes.object,
  isApplePayEligible: PropTypes.bool,
}
BundleVariationCard.defaultProps = {
  getBundleSelectedVariants: () => {},
  setSelectedBundleVariantsData: () => {},
  onOpen: () => {},
  setFlyoutOpen: () => {},
}
export default BundleVariationCard
