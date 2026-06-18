import { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import get from 'lodash/get'
import xor from 'lodash/xor'
import isObject from 'lodash/isObject'
import has from 'lodash/has'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import { useIntl } from 'react-intl'
import useViewportType from 'toro/hooks/useViewportType'
import SizeGuideButton from 'toro/components/product/SizeGuideButton'
import ProductColorControls from 'toro/components/product/ProductVariationControls/ProductColorControls'
import ProductSizeControls from 'toro/components/product/ProductVariationControls/ProductSizeControls'
import {
  filterProductVariants,
  getId,
  VARIATION_TYPES,
  getAvailablePropOptions,
  getNewAvailablePropOptions,
  getMaxLengthButtonInRow,
  parseProductId,
} from 'toro/helpers/productVariations'

import {
  selectionChangedAtom,
  selectedTabsDataAtom,
  priceGroupAtom,
  isMegaPDPEligibleAtom,
  isNewMegaPDPEligibleAtom,
  isTabbedAdaptivePDPEligibleAtom,
} from 'store/pdp.atom'
import PWAContext from 'components/common/PWAContext'
import { trackImpression as trackTangibleeImpression } from 'toro/helpers/tangibleeHelper'
import {
  getSKUs,
  getFormattedPrices,
  getVGSizesfromColor,
  getVGWidthsfromColor,
  getNewMegaPDPColors,
} from 'toro/helpers/skuHelper'
import useAnalytics from 'toro/analytics/useAnalytics'
import getItemByIDorFirstItem from 'toro/helpers/getItemByIDorFirstItem'
import ProductTypesControls from 'toro/components/product/ProductVariationControls/ProductTypeControls'
import Box from 'toro/components/Box'
import isArray from 'lodash/isArray'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'

import { useAtom } from 'jotai'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import ProductMaterialControls from 'toro/components/product/ProductVariationControls/ProductMaterialControls'
import Skeleton from 'toro/components/Skeleton'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import TabControls from 'toro/components/product/ProductVariationControls/NewMegaPDP/TabControls'
import Flex from 'toro/components/Flex'
import FitReviewText from './FitReviewText'
import useNeutralSizingData from 'toro/hooks/useNeutralSizingData'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePreference from 'toro/hooks/usePreference_new'
import VariationMessages from 'toro/components/product/VariationMessages'
import useExperiment from 'toro/hooks/useExperiment'

const TruefitWidget = dynamic(() => import('toro/components/product/TruefitWidget'), {
  ssr: false,
})

function ProductVariationControls({
  productData,
  variationGroupData,
  onMediaChange,
  onColorSelection,
  showError,
  onChange,
  onUserClick,
  // isDiscontinued,
  // moving these state set methods to parent
  setSelectedColor,
  setSelectedSize,
  setSelectedWidth,
  setAvailableColors,
  setAvailableSizes,
  setAvailableWidths,
  setSelectedVariant,
  // Moving these state to parent
  selectedColor,
  selectedSize,
  selectedWidth,
  availableSizes,
  availableWidths,
  isSticky,
  isQuickView,
  setShowSizeGuidePopUp,
  sizingRange,
  widthRange,
  showOosSwatch,
  customizerVariants,
  setCustomizerVariants,
  tangibleeData,
  variantData,
  skuID,
  selectedVariant,
  sourceCodeGroupId,
  selectedVariantData,
  isBundleProduct,
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
  isDisplayOosSwatch,
  hideSizes,
  hideColors,
  isPDPTemplateV3Mobile,
  variant,
  hslColor,
  hideMegaPDPTabs,
  variationMessagesProps,
  hideError,
  hideExtendedColors,
  hideComparablePriceValue,
}) {
  const { appData } = useContext(PWAContext)

  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isNewMegaPDPEligible = useAtomValue(isNewMegaPDPEligibleAtom)
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const analytics = useAnalytics()
  const { isDesktop } = useViewportType()
  const { formatMessage } = useIntl()
  const isMultiLocaleSizeExists = useRef(false)
  const sizeGuideContent = get(productData, 'sizeChartID.c_body.default.markup')
  const gender = get(selectedVG, 'customAttributes.c_gender') || get(productData, 'custom.c_gender')
  const variationSrcGroup = get(productData, 'variationSrcGroup', [])
  const productVariations = get(productData, 'variant', [])
  const isExtendedAdaptivePDP =
    variant === 'extendedAdaptiveTabbedPDP' && isTabbedAdaptivePDPEligible
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)

  const masterId = isBundleProduct ? get(productData, 'id') : get(productData, 'masterId')
  const productId = get(productData, 'id')
  const locale = get(appData, 'locale')
  const priceGroup = useAtomValue(priceGroupAtom)
  const setSelectionChanged = useUpdateAtom(selectionChangedAtom)
  const {
    trueFit: { enableTrueFit, truefitClientID, trueFitApiUrl },
  } = usePreference({
    TrueFit: ['enableTrueFit', 'truefitClientID', 'trueFitApiUrl'],
  })
  const { isNeutralSizingEnabled, neutralSizingCountryTypes, selectedNeutralSizingCountry } =
    useNeutralSizingData()

  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const [selectedTabsData, setSelectedTabsData] = useAtom(selectedTabsDataAtom)
  const isTruefitCtaEnabled =
    get(selectedVariantData, 'customAttributes.c_trueFitCtaEnabled', false) ||
    get(selectedVG, 'customAttributes.c_trueFitCtaEnabled', false)

  const isTrueFitVisible = !isQuickView && !isBundleProduct && enableTrueFit && isTruefitCtaEnabled
  const isCustomizedProduct = selectedColor?.isCustomized || selectedColor?.isMonogrammed
  const label = {
    size: formatMessage({ id: 'pdp.product.sizeText', defaultMessage: 'size' }),
    width: formatMessage({ id: 'pdp.product.widthText', defaultMessage: 'Width' }),
  }

  const customFitNote = {
    customFitSize: get(productData, 'custom.c_customFitSize'),
    customFitWidth: get(productData, 'custom.c_customFitWidth'),
  }

  const isPDPLoaded = has(productData, 'variant')

  const colorKeyToAccess = useMemo(() => {
    return productData?.selectedTabsData?.map((attribute) => attribute?.name).join('.')
  }, [productData?.selectedTabsData])

  const colors = useMemo(() => {
    const groupColorsData = get(productData, 'groupedColors', {})
    const newMegaPDPGroupData = get(productData, 'newMegaPDPGroupData', {})

    if (selectedMaterial && !isNewMegaPDPEligible) {
      return groupColorsData[selectedMaterial?.materialName?.toLowerCase()] || []
    }

    if (isNewMegaPDPEligible && isPDPLoaded && !isQuickView) {
      return getNewMegaPDPColors(
        newMegaPDPGroupData,
        colorKeyToAccess,
        get(productData, 'colors', [])
      )
    }

    return get(productData, 'colors', [])
  }, [productData, isPDPLoaded, selectedMaterial, isNewMegaPDPEligible, isQuickView])

  const variants = useMemo(() => {
    if (variationGroupData) {
      return get(variationGroupData, 'variants', [])
    } else {
      return get(productData, 'variants', [])
    }
  }, [productData, variationGroupData])

  const variantsFromMaster =
    get(productData, 'masterProductData.variants') || get(productData, 'variant', [])
  const variationGroups = get(productData, 'variationGroup', [])
  const newMegaPDPTabs = get(productData, 'newMegaPDPTabsData', [])

  const { defaultVariant, variationTypeControls, materialList, megaPdpAttrDisplayName } =
    productData

  const [sizes, widths] = useMemo(() => {
    if (productData?.isServerSide) {
      if (selectedColor) {
        return [
          getVGSizesfromColor(productData, selectedColor),
          getVGWidthsfromColor(productData, selectedColor),
        ]
      }
      return [
        getVGSizesfromColor(productData, get(productData, 'master.defaultVariantGroupID')),
        getVGWidthsfromColor(productData, get(productData, 'master.defaultVariantGroupID')),
      ]
    }
    return [get(productData, 'sizes', []), get(productData, 'widths', [])]
  }, [productData, selectedColor])

  const defaultColor = useMemo(() => {
    const defaultSelectedColor = defaultVariant?.variationValues?.color
    const compareColor = selectedColor?.id || defaultSelectedColor
    const isProductMegaPDPEligible = get(productData, 'isMegaPDPEligible') || isMegaPDPEligible
    let { defaultColor } = productData
    if (defaultSelectedColor) {
      defaultColor = isProductMegaPDPEligible
        ? colors?.find?.(
            (color) => color?.masterId === defaultVariant?.masterId && color?.id === compareColor
          )
        : getItemByIDorFirstItem(compareColor, colors)
      if (isProductMegaPDPEligible) {
        let showOosSwatch = defaultColor?.displayIfOOS || isDisplayOosSwatch
        if (defaultColor && !defaultColor?.orderable && !showOosSwatch) {
          const orderableColors = colors?.filter?.((color) => color?.orderable)
          if (orderableColors?.[0]?.masterId === defaultColor?.masterId)
            defaultColor = orderableColors[0]
          else {
            const colorsToDisplay = colors?.filter?.((color) => color?.displayIfOOS)
            if (colorsToDisplay?.[0]?.masterId === defaultColor?.masterId)
              defaultColor = colorsToDisplay[0]
          }
        }
      }
    } else if (
      (isProductMegaPDPEligible && colors && (isDisplayOosSwatch || colors[0]?.displayIfOOS)) ||
      (!isProductMegaPDPEligible && showOosSwatch)
    ) {
      defaultColor = colors?.[0]
    } else {
      const filteredColors = colors && colors?.filter((item) => item?.orderable)
      defaultColor = filteredColors && filteredColors[0]
    }
    return defaultColor
  }, [productData, isMegaPDPEligible, colors, isDisplayOosSwatch, selectedColor])

  const { defaultWidth, defaultSize } = useMemo(() => {
    let defaultSize = null
    let defaultWidth = null
    const defaultSelectedSize =
      (newSelectedVariant || productData?.productType?.variant) &&
      defaultVariant?.variationValues?.size
    const defaultSelectedWidth =
      (newSelectedVariant || productData?.productType?.variant) &&
      defaultVariant?.variationValues?.width
    const compareSize = selectedSize?.id || defaultSelectedSize
    const compareWidth = selectedWidth?.id || defaultSelectedWidth

    if (defaultSelectedWidth) {
      defaultWidth = getItemByIDorFirstItem(compareWidth, widths)
    }
    if (defaultSelectedSize) {
      defaultSize = getItemByIDorFirstItem(compareSize, sizes)
    }
    return { defaultWidth, defaultSize }
  }, [productData, newSelectedVariant, selectedSize, selectedWidth])

  const onSelectionChange = (isInventoryFetched = false) => {
    const selectedColorId = getId(selectedColor)
    const selectedSizeId = getId(selectedSize)
    const selectedWidthId = getId(selectedWidth)
    if (!isInventoryFetched) {
      setSelectionChanged(true)
    }
    const customizerBaseProductId = get(selectedColor, 'baseProductId')
    const isSelectedVariantDiff =
      selectedVariant?.productId !== customizerBaseProductId ||
      selectedVariant?.id !== customizerBaseProductId
    const colorFilterId =
      customizerBaseProductId && isCustomizedProduct ? customizerBaseProductId : selectedColorId

    let nextSelectedVariant = null
    let filteredVariants
    if (selectedColorId) {
      filteredVariants = isMegaPDPEligible
        ? productVariations?.filter?.(
            (item) =>
              item?.productId?.includes(colorFilterId) ||
              (get(item, `variationValues.${VARIATION_TYPES.color}`, '') === colorFilterId &&
                item?.id?.includes(selectedColor?.masterId))
          )
        : productVariations?.filter?.(
            (item) =>
              item?.productId?.includes(colorFilterId) ||
              get(item, `variationValues.${VARIATION_TYPES.color}`, '') === colorFilterId
          )
    } else {
      filteredVariants = variants
    }

    const nextAvailableColors = getAvailablePropOptions(
      filteredVariants,
      {
        size: selectedSizeId,
        width: selectedWidthId,
        onlyOrderable: true,
      },
      VARIATION_TYPES.color
    )

    let nextAvailableSizes = getAvailablePropOptions(
      filteredVariants,
      {
        color: selectedColorId,
        width: selectedWidthId,
        onlyOrderable: true,
      },
      VARIATION_TYPES.size
    )

    let nextAvailableWidths = getAvailablePropOptions(
      filteredVariants,
      {
        color: selectedColorId,
        size: selectedSizeId,
        onlyOrderable: true,
      },
      VARIATION_TYPES.width
    )

    if (selectedVG && !selectedWidthId) {
      nextAvailableSizes = getNewAvailablePropOptions(selectedVG, VARIATION_TYPES.size)
      nextAvailableWidths = getNewAvailablePropOptions(selectedVG, VARIATION_TYPES.width)
    }

    if (
      (selectedColor || !colors?.length) &&
      (selectedSize || !sizes?.length) &&
      (selectedWidth || !widths?.length)
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

    if (isCustomizedProduct) {
      isSelectedVariantDiff && setSelectedVariant(filteredVariants?.[0])
    } else {
      nextSelectedVariant && setSelectedVariant(nextSelectedVariant)
    }

    setAvailableColors(nextAvailableColors)
    if (filteredVariants?.length && xor(availableSizes, nextAvailableSizes)?.length) {
      setAvailableSizes(nextAvailableSizes)
    }
    nextAvailableWidths?.length && setAvailableWidths(nextAvailableWidths)

    // check available and orderable variants based on the selected variations

    const orderableVariants = filterProductVariants(filteredVariants, {
      onlyOrderable: true,
      color: selectedColorId,
      size: selectedSizeId,
      width: selectedWidthId,
    })

    if (!isCustomizedProduct) {
      onChange && onChange({ orderableVariants })
    } else {
      onChange && onChange({ orderableVariants: filteredVariants })
    }
  }

  const onTangibleeSwatchChange = useCallback(() => {
    const { currencySymbol: currency } = getCurrentLocale(locale.replace(/_/g, '-'))
    const { price, discountedPrice } = getFormattedPrices(priceGroup)
    window?.tangiblee('productSilentUpdate', {
      variations: getSKUs(tangibleeData),
      sku: skuID,
      price: price,
      currency: currency,
      discountedPrice: !hideComparablePriceValue && discountedPrice,
      inStock: variantData?.orderable,
    })
    trackTangibleeImpression(skuID)
  }, [variantData, locale, priceGroup])

  useEffect(() => {
    if (productData?.selectedTabsData && !isQuickView) {
      setSelectedTabsData(productData?.selectedTabsData)
    }
  }, [productData?.selectedTabsData])

  useEffect(() => {
    if (window.tangiblee && window.tangiblee('isModalOpened')) {
      onTangibleeSwatchChange()
    }
  }, [priceGroup, selectedColor])

  useEffect(() => {
    if (selectedColor) {
      onSelectionChange()
    }
  }, [selectedColor?.id, selectedSize?.id, selectedSize?.value, selectedWidth?.id])

  useEffect(() => {
    if (!isCustomizedProduct && defaultColor) {
      setSelectedColor(defaultColor)
    }

    if (
      preSelectedWidth &&
      !widthClicked &&
      !sizeClicked &&
      !colorClicked &&
      !(
        productData?.hitType?.toLowerCase() === 'variant' ||
        productData?.hitType?.toLowerCase() === 'product'
      )
    ) {
      setSelectedWidth(preSelectedWidth)
    } else if (defaultWidth) {
      productData?.productType?.variant ||
        (productData?.widths?.length === 1 && setSelectedWidth(defaultWidth))
    }
    if (defaultSize) {
      if (
        !isQuickView &&
        !productData?.fetchedFromFrp &&
        productData?.hitType !== 'variation_group' &&
        (productData?.productType?.variant || productData?.sizes?.length === 1) &&
        selectedSize?.id !== defaultSize?.id
      ) {
        setSelectedSize(defaultSize)
      }
    }
  }, [defaultColor?.id, defaultColor?.masterId, defaultSize?.id, defaultWidth?.id])

  useEffect(() => {
    if (inventoryFetchedFrom) {
      onSelectionChange(true)
    }
  }, [inventoryFetchedFrom])

  useEffect(() => {
    if (selectedColor) {
      onMediaChange(get(selectedColor, 'media'))
    }
  }, [selectedColor])

  useEffect(() => {
    // TODO: PDP to PDP clientside transitioning is blocking the initial rendering with the linkedPageData.
    //       We may add this back when address UX performance
    // getAssociatedData(itemsList)
    // this should execute only once on initial mount,
    // this should not run when swatch changes

    if (selectedColor && !selectedColor?.orderable && !showOosSwatch && !isMegaPDPEligible) {
      if (isArray(colors)) {
        const orderableColors = colors?.filter((color) => color?.orderable)
        if (orderableColors?.length > 0) {
          setSelectedColor(orderableColors[0])
        }
      }
    }
  }, [])

  const sizedProduct = sizes?.length
  const widthProduct = widths?.length

  useEffect(() => {
    if (sizedProduct === 1 && !selectedSize) {
      const firstSize = sizes[0]
      setSelectedSize({
        ...firstSize,
        ...(!firstSize.value && { value: firstSize.id }),
      })
    }
  }, [sizedProduct])

  useEffect(() => {
    if (widthProduct === 1 && !selectedWidth) {
      const firstWidth = widths[0]
      setSelectedWidth({
        ...firstWidth,
        ...(!firstWidth.value && { value: firstWidth.id }),
      })
    }
  }, [widthProduct])

  const getVariant = useCallback(
    ({ collections, colorId, sizeId, widthId, getFromVG, getFromV }) => {
      let variantId = ''
      collections?.forEach((item) => {
        if (getFromV) {
          const itemColorId = item?.variationValues?.color
          const itemSizeId = item?.variationValues?.size
          const itemWidthId = item?.variationValues?.width

          if (
            colorId &&
            colorId === itemColorId &&
            (sizeId ? sizeId === itemSizeId : true) &&
            (widthId ? widthId === itemWidthId : true)
          ) {
            variantId = item?.productId || item?.id
          }
        } else if (getFromVG) {
          if (colorId === item?.color) {
            variantId = item?.productID
          }
        }
      })

      if (!variantId) {
        variationGroups?.forEach((item) => {
          if (item?.color === colorId) {
            variantId = item?.productID
          }
        })
      }
      return variantId
    },
    [variationGroups]
  )

  const onColorChange = useCallback(
    (value) => {
      onUserClick()
      onColorClick()
      setSelectedColor(value)
      if (!(value?.isCustomized || value?.isMonogrammed)) {
        onColorSelection(value, true)
      }
      const colorId = get(value, 'id')
      const swatchVariant = sizedProduct
        ? selectedSize
          ? widthProduct
            ? selectedWidth
              ? {
                  collections: variantsFromMaster,
                  colorId,
                  sizeId: selectedSize?.id,
                  widthId: selectedWidth?.id,
                  getFromV: true,
                }
              : {
                  collections: variationGroups,
                  colorId,
                  getFromVG: true,
                }
            : {
                collections: variantsFromMaster,
                colorId,
                sizeId: selectedSize?.id,
                getFromV: true,
              }
          : {
              collections: variationGroups,
              colorId,
              getFromVG: true,
            }
        : { collections: variantsFromMaster, colorId, getFromV: true }
      const swatchVariantId = getVariant(swatchVariant)
      analytics.send('swatchInteraction', {
        eventLocation: isQuickView ? 'quickview' : 'product',
        eventAction: 'swatch click',
        eventLabel: swatchVariantId || get(selectedVariantData, 'id', 'undefined'),
        swatchType: 'color',
        swatchValue: get(value, 'text'),
        swatchVariant: swatchVariantId || get(selectedVariantData, 'id', 'undefined'),
      })
    },
    [
      setSelectedColor,
      onColorSelection,
      productData,
      isQuickView,
      analytics,
      selectedVariant,
      selectedSize,
      selectedWidth,
    ]
  )

  const onSizeChange = useCallback(
    (value) => {
      onUserClick()
      onSizeClick()
      setSelectedSize(value)
      const swatchVariant = widthProduct
        ? selectedWidth
          ? {
              collections: variantsFromMaster,
              colorId: selectedColor?.id,
              sizeId: get(value, 'id'),
              widthId: selectedWidth?.id,
              getFromV: true,
            }
          : {
              collections: variationGroups,
              colorId: selectedColor?.id,
              getFromVG: true,
            }
        : {
            collections: variantsFromMaster,
            colorId: selectedColor?.id,
            sizeId: get(value, 'id') || get(value, 'value'),
            getFromV: true,
          }
      const swatchVariantId = getVariant(swatchVariant)
      analytics.send('swatchInteraction', {
        eventLocation: isQuickView ? 'quickview' : 'product',
        eventAction: 'swatch click',
        swatchType: selectedNeutralSizingCountry
          ? `${selectedNeutralSizingCountry} ${get(label, 'size')}`
          : get(label, 'size'),
        swatchValue: get(value?.text, selectedNeutralSizingCountry, value?.text),
        eventLabel: parseProductId(swatchVariantId).masterId,
        swatchVariant: swatchVariantId,
      })
    },
    [
      onUserClick,
      setSelectedSize,
      isQuickView,
      productId,
      selectedWidth,
      selectedColor,
      selectedNeutralSizingCountry,
    ]
  )

  const onWidthChange = useCallback(
    (value) => {
      onUserClick()
      onWidthClick()
      setSelectedWidth(value)
      const swatchVariantId = getVariant({
        collections: variantsFromMaster,
        colorId: selectedColor?.id,
        sizeId: selectedSize?.id,
        widthId: get(value, 'id'),
        getFromV: true,
      })
      analytics.send('swatchInteraction', {
        eventLocation: isQuickView ? 'quickview' : 'product',
        eventAction: 'swatch click',
        swatchType: get(label, 'width'),
        swatchValue: value?.text,
        eventLabel: swatchVariantId,
        swatchVariant: swatchVariantId,
      })
    },
    [onUserClick, setSelectedWidth, isQuickView, productId, selectedSize, selectedColor]
  )

  isMultiLocaleSizeExists.current = !!sizes?.length && isObject(sizes[0]?.text)
  const isNeutralSizingApplicable = isNeutralSizingEnabled && isMultiLocaleSizeExists.current
  const maxSizeButtonsInRow = getMaxLengthButtonInRow(
    sizes,
    isDesktop,
    isQuickView,
    isNeutralSizingApplicable,
    isNewMegaPDPEligible
  )
  const maxWidthButtonsInRow = getMaxLengthButtonInRow(widths, isDesktop, isQuickView)
  const newSwatchArr = useMemo(
    () => [
      ...Object.values(
        customizerVariants.reduce((acc, cur) => Object.assign(acc, { [cur?.id]: cur }), {})
      ),
      ...Object.values(colors.reduce((acc, cur) => Object.assign(acc, { [cur?.vgId]: cur }), {})),
    ],
    [customizerVariants, colors]
  )

  const truefitVariantId =
    selectedColor?.id != undefined
      ? `${productId?.split('-')?.[0]}-${selectedColor?.id}`
      : productId

  const showSizeGuide = sizeGuideContent && !!sizes?.length && !hideSizes
  const isMegaPDP = isMegaPDPEligible || isNewMegaPDPEligible
  const shouldHideMegaPDPTabs = !!get(productData, 'custom.c_hideTabs')

  const isMegaPDPMaterialControlsVisible =
    isMegaPDPEligible &&
    !isQuickView &&
    !isNewMegaPDPEligible &&
    !shouldHideMegaPDPTabs &&
    !isTabbedAdaptivePDPEligible

  const isMegaPDPTabControlsVisible =
    !isQuickView && isNewMegaPDPEligible && !shouldHideMegaPDPTabs && !hideMegaPDPTabs

  return (
    <>
      <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop={!isMegaPDP}>
        {!isQuickView &&
          !isTabbedAdaptivePDPEligible &&
          variationTypeControls?.map(({ keyAt, attrName, associatedValues }) => (
            <Box key={keyAt}>
              <ProductTypesControls
                masterId={masterId}
                attrName={attrName}
                associatedValues={associatedValues}
                showErrorIfEmpty={showError}
                maxItemsInRow={isDesktop ? 4 : 3}
                isSticky={isSticky}
                productId={productId}
              />
            </Box>
          ))}
      </Experiment>
      {isMegaPDPMaterialControlsVisible ? (
        materialList?.length ? (
          <ProductMaterialControls
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            isSticky={isSticky}
            materialList={materialList}
            setFullscreenLoading={setFullscreenLoading}
            megaPdpAttrDisplayName={megaPdpAttrDisplayName}
            selectedColor={selectedColor}
            productId={productId}
          />
        ) : (
          <Skeleton h="100px" my="10px" />
        )
      ) : null}

      {isMegaPDPTabControlsVisible &&
        newMegaPDPTabs?.map?.((tabData) => {
          const selectedTab =
            selectedTabsData?.find?.((selectedTabData) =>
              tabData?.tabs?.find((tab) => tab?.name === selectedTabData?.name)
            ) || {}
          return (
            <TabControls
              selectedTab={selectedTab}
              isSticky={isSticky}
              tabList={tabData?.tabs}
              tabLabel={tabData?.tabId}
              selectedColor={selectedColor}
              productId={productId}
              key={tabData?.tabId}
              isPDPLoaded={isPDPLoaded}
              variant={isExtendedAdaptivePDP && 'extendedAdaptiveTabbedPDP'}
            />
          )
        })}
      {((isMegaPDPEligible && !isNewMegaPDPEligible && !selectedMaterial) ||
        (isNewMegaPDPEligible && !isPDPLoaded)) &&
      !isQuickView ? (
        <Skeleton h="100px" my="15px" />
      ) : (
        !!colors?.length &&
        !hideColors && (
          <ProductColorControls
            h={isDesktop && '162px'}
            items={newSwatchArr}
            variationSrc={variationSrcGroup}
            sourceCodeId={sourceCodeGroupId}
            selectedItem={selectedColor}
            productData={productData}
            isQuickView={isQuickView}
            onChange={onColorChange}
            showErrorIfEmpty={showError}
            isSticky={isSticky}
            showOosSwatch={showOosSwatch}
            masterId={masterId}
            setCustomizerVariants={setCustomizerVariants}
            customizerVariants={customizerVariants}
            setSelectedColor={setSelectedColor}
            isMegaPDPEligible={isMegaPDPEligible}
            isNewMegaPDPEligible={isNewMegaPDPEligible}
            selectedMaterial={selectedMaterial}
            isDisplayOosSwatch={isDisplayOosSwatch}
            variant={variant}
            hslColor={hslColor}
            defaultColor={defaultColor}
          />
        )
      )}

      {isTrueFitVisible && !hideSizes && (
        <TruefitWidget
          masterId={masterId}
          truefitClientID={truefitClientID}
          trueFitApiUrl={trueFitApiUrl}
          variantId={truefitVariantId}
          isSticky={isSticky}
        />
      )}

      {!!sizes?.length && !hideSizes && (
        <ProductSizeControls
          h={isDesktop && '171px'}
          label={get(label, 'size')}
          customFitNote={customFitNote}
          gender={gender}
          items={sizes}
          selectedItem={selectedSize}
          availableItems={availableSizes}
          onChange={onSizeChange}
          showErrorIfEmpty={showError}
          maxItemsInRow={maxSizeButtonsInRow}
          isSticky={isSticky}
          isQuickView={isQuickView}
          setShowSizeGuidePopUp={setShowSizeGuidePopUp}
          rangeValue={sizingRange}
          productId={productId}
          sizeGuideContent={sizeGuideContent}
          variantType={'size'}
          isNeutralSizingApplicable={isNeutralSizingApplicable}
          neutralSizingCountryTypes={neutralSizingCountryTypes}
          isNewMegaPDPEligible={isNewMegaPDPEligible}
          isPDPTemplateV3Mobile={isPDPTemplateV3Mobile}
          showSizeGuide={showSizeGuide && isPDPTemplateV3Mobile}
          variant={variant}
        />
      )}
      {showSizeGuide && (
        <Flex justify="space-between" align="baseline">
          {!isPDPTemplateV3Mobile && (
            <SizeGuideButton
              isQuickView={isQuickView}
              setShowSizeGuidePopUp={setShowSizeGuidePopUp}
              sizeGuideContent={sizeGuideContent}
              productId={productId}
              isSticky={isSticky}
              quickViewEventLocation={isQuickView ? 'quickview' : 'product'}
            />
          )}
          {isNeutralSizingApplicable && (
            <FitReviewText label={get(label, 'size')} isSticky={isSticky} />
          )}
        </Flex>
      )}
      {!!widths?.length && !hideSizes && (
        <ProductSizeControls
          h={isDesktop && '75px'}
          label={get(label, 'width')}
          items={widths}
          customFitNote={customFitNote}
          selectedItem={selectedWidth}
          availableItems={availableWidths}
          onChange={onWidthChange}
          showErrorIfEmpty={showError}
          maxItemsInRow={maxWidthButtonsInRow}
          isSticky={isSticky}
          rangeValue={widthRange}
          productId={productId}
          sizeGuideContent={sizeGuideContent}
          variantType={'width'}
          variant={variant}
        />
      )}
      {isExtendedAdaptivePDP &&
        isMegaPDPTabControlsVisible &&
        !isPdpV41Enabled &&
        !isPdpV42Enabled && (
          <Box display={hideExtendedColors ? 'none' : 'block'}>
            <ProductColorControls
              items={newSwatchArr}
              variationSrc={variationSrcGroup}
              sourceCodeId={sourceCodeGroupId}
              selectedItem={selectedColor}
              productData={productData}
              isQuickView={isQuickView}
              onChange={onColorChange}
              showErrorIfEmpty={showError}
              isSticky={isSticky}
              showOosSwatch={showOosSwatch}
              masterId={masterId}
              setCustomizerVariants={setCustomizerVariants}
              customizerVariants={customizerVariants}
              setSelectedColor={setSelectedColor}
              isMegaPDPEligible={isMegaPDPEligible}
              isNewMegaPDPEligible={isNewMegaPDPEligible}
              selectedMaterial={selectedMaterial}
              isDisplayOosSwatch={isDisplayOosSwatch}
              variant={variant}
              hslColor={hslColor}
              isExtendedAdaptivePDP={isExtendedAdaptivePDP}
            />
          </Box>
        )}
      {isExtendedAdaptivePDP && !hideError && <VariationMessages {...variationMessagesProps} />}
    </>
  )
}
ProductVariationControls.propTypes = {
  productData: PropTypes.object,
  variationGroupData: PropTypes.object,
  onMediaChange: PropTypes.func,
  onColorSelection: PropTypes.func,
  showError: PropTypes.bool,
  onChange: PropTypes.func,
  onUserClick: PropTypes.func,
  isDiscontinued: PropTypes.bool,
  setSelectedColor: PropTypes.func,
  setSelectedSize: PropTypes.func,
  setSelectedWidth: PropTypes.func,
  setAvailableColors: PropTypes.func,
  setAvailableSizes: PropTypes.func,
  setAvailableWidths: PropTypes.func,
  setSelectedVariant: PropTypes.func,
  selectedColor: PropTypes.object,
  selectedSize: PropTypes.object,
  selectedWidth: PropTypes.object,
  availableColors: PropTypes.array,
  availableSizes: PropTypes.array,
  availableWidths: PropTypes.array,
  isSticky: PropTypes.bool,
  isQuickView: PropTypes.bool,
  setShowSizeGuidePopUp: PropTypes.func,
  sizingRange: PropTypes.number,
  widthRange: PropTypes.number,
  showOosSwatch: PropTypes.bool,
  customizerVariants: PropTypes.array,
  setCustomizerVariants: PropTypes.func,
  tangibleeData: PropTypes.object,
  variantData: PropTypes.object,
  skuID: PropTypes.string,
  selectedVariant: PropTypes.object,
  sourceCodeGroupId: PropTypes.string,
  selectedVariantData: PropTypes.object,
  isBundleProduct: PropTypes.bool,
  isDisplayOosSwatch: PropTypes.bool,
  isMegaPDPEligible: PropTypes.bool,
  selectedMaterial: PropTypes.object,
  setSelectedMaterial: PropTypes.func,
  hideSizes: PropTypes.bool,
  hideColors: PropTypes.bool,
  isPDPTemplateV3Mobile: PropTypes.bool,
  hideMegaPDPTabs: PropTypes.bool,
  hideError: PropTypes.bool,
  variationMessagesProps: PropTypes.object,
  hideExtendedColors: PropTypes.bool,
}
ProductVariationControls.defaultProps = {
  productData: {},
  onMediaChange: () => {},
  onColorSelection: () => {},
  showError: false,
  onChange: () => {},
  onUserClick: () => {},
  isDiscontinued: false,
  availableColors: [],
  availableSizes: [],
  availableWidths: [],
  isSticky: false,
  isQuickView: false,
  showOosSwatch: false,
  customizerVariants: [],
  tangibleeData: {},
  variantData: {},
  skuID: '',
  selectedVariant: {},
  sourceCodeGroupId: '',
  isBundleProduct: false,
  isDisplayOosSwatch: false,
  setAvailableColors: () => {},
  setAvailableSizes: () => {},
  setAvailableWidths: () => {},
  setAvailableAndOrderableVariants: () => {},
  hideSizes: false,
  hideColors: false,
  isPDPTemplateV3Mobile: false,
  hideMegaPDPTabs: false,
  hideError: true,
  variationMessagesProps: {},
  hideExtendedColors: true,
}
export default withErrorBoundaryWrapper(ProductVariationControls)
