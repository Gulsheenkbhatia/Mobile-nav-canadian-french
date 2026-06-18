import get from 'lodash/get'
import { MessageDescriptor } from 'react-intl'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'
import { promotionalPricingData } from 'toro/components/product/PriceInfo/helper'
import type {
  Color,
  DetailedProduct,
  InventoryInfo,
  VariantGroupData,
} from 'toro/types/productTypes'
import pick from 'lodash/pick'
import { prioritize } from 'toro/components/product/desktop/StickyBar/ProductTitleBadge/helpers'

const getSoldOutCustomText = (productData) =>
  get(productData, 'custom.c_soldOutCustomText') ||
  get(productData, 'defaultVariantData.custom.c_soldOutCustomText') ||
  get(productData, 'defaultVariationGroupData.custom.c_soldOutCustomText') ||
  get(productData, 'customAttributes.c_soldOutCustomText')

const getInstockText = (productData) =>
  get(productData, 'custom.c_inStockCustomText') ||
  get(productData, 'instockText') ||
  get(productData, 'defaultVariantData.custom.c_inStockCustomText') ||
  get(productData, 'defaultVariationGroupData.custom.c_inStockCustomText') ||
  get(productData, 'customAttributes.c_inStockCustomText')

const soldOutTextData = {
  id: 'pdp.product.outOfStockAdaptivePDPButton',
  defaultMessage: 'Sold Out',
}
const preorderTextData = {
  id: 'pdp.product.preOrder',
  defaultMessage: 'Pre-order',
}
const notForSaleTextData = {
  id: 'pdp.product.notForSale',
  defaultMessage: 'Not for sale',
}
const addToBagTextData = {
  id: 'pdp.product.addToBagAdaptivePDPTextMobile',
  defaultMessage: 'Add to Bag',
}
const addToBagWithCustomizationTextData = {
  id: 'pdp.addToBagWithCustomization',
  defaultMessage: 'ADD TO BAG WITH CUSTOMIZATION',
}
const addToBagWithMonogramTextData = {
  id: 'pdp.addToBagWithMonogram',
  defaultMessage: 'ADD TO BAG WITH MONOGRAM',
}

function getCustomizedText(selectedColor: { isCustomized?: boolean; isMonogrammed?: boolean }) {
  if (get(selectedColor, 'isCustomized') && !get(selectedColor, 'isMonogrammed')) {
    return addToBagWithCustomizationTextData
  }
  if (get(selectedColor, 'isMonogrammed') && !get(selectedColor, 'isCustomized')) {
    return addToBagWithMonogramTextData
  }

  return null
}

export const getAddToBagButtonTextData = (
  productData,
  orderingStatus,
  selectedColor
): string | MessageDescriptor => {
  if (ORDERING_STATUS.soldOut === orderingStatus) {
    return getSoldOutCustomText(productData) || soldOutTextData
  }
  if (ORDERING_STATUS.preorder === orderingStatus) {
    return preorderTextData
  }
  if (ORDERING_STATUS.notForSale === orderingStatus) {
    return notForSaleTextData
  }

  const customizedText = getCustomizedText(selectedColor)
  if (customizedText) {
    return customizedText
  }

  if (getInstockText(productData)) {
    return getInstockText(productData)
  }
  return addToBagTextData
}

export const getCustomValue = (data, key) => {
  return get(data, `customAttributes.${key}`, get(data, `custom.${key}`))
}

const addDecimal = (number, decimals = 2) => {
  return String(number?.toFixed(decimals) || '0')
}

function getGAPrice(variantData) {
  const dohDodPricing = promotionalPricingData(variantData)
  const priceObj = get(variantData, 'pricingInfo[0]', {})
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

function getGAInventory(inventory) {
  return {
    is_available: inventory?.orderable ? '1' : '0',
    is_backordered: inventory?.backorderable ? '1' : '0',
    is_preordered: inventory?.preorderable ? '1' : '0',
  }
}

export const getGaProductData = ({
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
}) => {
  const selectedSizeData = get(productData, 'sizes', []).find(({ id }) => id === selectedSize)
  const itemVariant = selectedVariantData?.id
  const selectedVariantWithInventory = {
    ...selectedSubmittableVariantData,
    inventory,
  }

  return {
    product: {
      ...productData,
      selectedVariantData: selectedVariantWithInventory,
      pageType: 'pdp',
      size: selectedSizeData?.text || get(selectedVariantData, 'variationValues.size'),
      quantity: selectedQty,
      selectedColor,
      selectedSize: selectedSizeData,
      // selectedWidth,
      additionalAttributes: {
        item_variant: itemVariant,
        color_id: selectedColor?.id,
        color: selectedColor?.text,
        size_id: selectedSize || undefined,
        size: selectedSizeData?.text,
        // width_id: selectedWidth?.id || selectedWidth?.value,
        // width: selectedWidth?.text || selectedWidth?.name,
        ...getGAPrice(selectedVariantData),
        ...getGAInventory(inventory),
        // ...getBopisInfo(bopis),
        // ...getMonogramData(),
      },
      productDataForBadges,
      selectedVariantWithInventory,
    },
    wishlist: wishlists,
    eventLocation: isMegaPDPEligible ? 'mega product' : 'product',
    isProductExist: !!productData,
  }
}

export const getProductDataForBadges = ({
  productData,
  selectedColor,
  selectedSubmittableVariantData,
  selectedVariantGroup,
  inventory,
}) => {
  const getCustom = (key) =>
    getCustomValue(selectedSubmittableVariantData, key) || getCustomValue(productData, key)
  const variationGroupData = get(productData, 'variationGroup', []).find(
    ({ id }) => id === selectedColor?.vgId
  )

  const product = selectedSubmittableVariantData || selectedVariantGroup || productData

  return {
    product: {
      ...product,
      inventory,
    },
    variationGroupData,
    masterData: productData?.master,
    promoText: productData?.promoText,
    instockText: productData?.instockText,
    bestSellerCheck:
      selectedSubmittableVariantData?.bestSellerCheck || selectedColor?.bestSellerCheck,
    hideComparablePrice: getCustom('c_hideComparablePriceValue'),
    hideDiscountedRate: getCustom('c_hideDiscountRate'),
    newSelectedVariant: {
      ...selectedSubmittableVariantData,
      inventory,
    },
  }
}

export const getProductDataForMarketingBadges = ({
  productData,
  selectedVariant,
  selectedColor,
  selectedVariantGroup,
  inventory,
}: {
  productData: DetailedProduct | null
  selectedVariant: any
  selectedColor: Color
  selectedVariantGroup: VariantGroupData
  inventory: InventoryInfo
}) => {
  if (!productData) {
    return {}
  }

  const variationGroupData =
    selectedVariantGroup ||
    get(productData, 'variationGroup', []).find(({ id }) => id === get(selectedColor, 'vgId'))

  const pickProp = (path: string) =>
    prioritize(get(selectedVariant, path), get(variationGroupData, path), get(productData, path))

  const getCustomSource = (data: any) => get(data, 'customAttributes') || get(data, 'custom') || {}

  const sourceCodeBadge = pickProp('sourceCodeBadge')
  const sourceCodeMessage = pickProp('sourceCodeMessage')
  const marketingBadgeConf = pickProp('marketingBadgeConf')
  const marketingMessageConf = pickProp('marketingMessageConf')

  const mergedCustomAttributes = {
    ...getCustomSource(productData),
    ...getCustomSource(variationGroupData),
    ...getCustomSource(selectedVariant),
  }
  const allowedKeys: string[] = [
    'c_inventoryThreshold',
    'c_inStockCustomText',
    'c_avgRatingEmplifi',
    'c_revCountEmplifi',
  ]

  const customAttributes = pick(mergedCustomAttributes, allowedKeys)

  const validFrom = prioritize(
    get(selectedVariantGroup, 'validFrom'),
    get(productData, 'pickedProps.validFrom'),
    get(productData, 'validFrom')
  )

  const product = {
    ...(selectedVariant || {}),
    inventory,
    sourceCodeBadge,
    sourceCodeMessage,
    marketingBadgeConf,
    marketingMessageConf,
    customAttributes,
    custom: customAttributes,
    pickedProps: {
      validFrom,
    },
  }

  // Slim variationGroupData to required fields
  const vgCustom = getCustomSource(variationGroupData)
  const variationGroupDataSlim = {
    ...pick(variationGroupData || {}, ['marketingBadgeConf', 'marketingMessageConf']),
    customAttributes: pick(vgCustom, ['c_isFinalSale', 'c_maxSalePercent', 'c_soldOutBadge']),
  }

  // Slim masterData to required fields
  const master = get(productData, 'master') || {}
  const masterCustom = getCustomSource(master)
  const masterDataSlim = {
    ...pick(master, ['marketingBadgeConf', 'marketingMessageConf', 'validFrom']),
    pickedProps: {
      validFrom: get(master, 'pickedProps.validFrom'),
    },
    customAttributes: pick(masterCustom, ['c_avgRatingEmplifi', 'c_revCountEmplifi']),
  }

  // Slim selectedVG to required fields
  const selectedVGSlim = pick(selectedVariantGroup || {}, [
    'sourceCodeBadge',
    'sourceCodeMessage',
    'marketingBadgeConf',
    'marketingMessageConf',
  ])

  const bestSellerCheck = prioritize(
    get(selectedVariant, 'bestSellerCheck'),
    get(selectedColor, 'bestSellerCheck')
  )

  return {
    product,
    variationGroupData: variationGroupDataSlim,
    masterData: masterDataSlim,
    instockText: get(productData, 'instockText'),
    bestSellerCheck,
    selectedVG: selectedVGSlim,
  }
}

/**
 * Gets the default size value from product data
 * @param productData - The product data object
 * @returns The default size value or empty string if no default size exists
 */
export const getDefaultSizeValue = (productData: DetailedProduct | null): string => {
  if (!productData) return ''

  const selectedVariantSize = get(productData, 'selectedVariantData.variationValues.size')

  if (selectedVariantSize) {
    return selectedVariantSize
  }

  const defaultVariationSizeValues = get(
    productData,
    'defaultVariantGroup.variationAttributes',
    []
  ).find((attr) => attr.id === 'size')?.values

  if (defaultVariationSizeValues?.length === 1) {
    return get(defaultVariationSizeValues, '[0].value', '')
  }

  return ''
}
