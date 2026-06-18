import get from 'lodash/get'
import uniq from 'lodash/uniq'
import isString from 'lodash/isString'
import {
  EARLY_ACCESS,
  EMPLOYEE_SALE,
  IS_EARLY_ACCESS,
  IS_EMPLOYEE_SALE,
} from 'toro/constants/sourceCodes'
import { checkSourceCodeWithMapping } from 'helpers/getColorSwatches'
import megaPDPEligibleToggle from 'helpers/getMegaPDPEligibleToggle'
import { splitDateTime } from 'toro/helpers/sitePreview'
import pick from 'lodash/pick'

// maps variation type to product's array of values of that type
const VARIATION_MAPPING = {
  color: 'colors',
  size: 'sizes',
  width: 'widths',
}

const masterIdRegex = /-(.*)$/gm

export const VARIATION_LABELS = {
  color: 'Color',
  size: 'Size',
  width: 'Width',
}

export const VARIATION_TYPES = {
  color: 'color',
  size: 'size',
  width: 'width',
}

export const ORDERING_STATUS = {
  addToBag: 'addToBag',
  backorder: 'backorder',
  preorder: 'preorder',
  soldOut: 'soldOut',
  notForSale: 'notForSale',
}

export const NOT_AVAILABLE_STATUSES_ARRAY = [
  ORDERING_STATUS.soldOut,
  ORDERING_STATUS.preorder,
  ORDERING_STATUS.backorder,
]

export const ORDERING_ERROR = {
  notSelected: 'notSelected',
  notAvailable: 'notAvailable',
  unKnown: 'unKnown',
  cartThreshold: 'cartThreshold',
}

export function isOrderable(item) {
  return get(item, 'orderable')
}

export function allOrderable(variants = []) {
  return variants.every(isOrderable)
}

export function getId(item) {
  return get(item, 'id') || get(item, 'value')
}

export function getMasterId(item) {
  return get(item, 'masterId')
}

export function hasId(requestedId) {
  return (item) => {
    return getId(item) === requestedId
  }
}

export function getVariantAttrValue(variant, attrName) {
  return get(variant, `variationValues["${attrName}"]`)
}

/**
 * Parse product id to get all variation data it contains
 *
 * @param {String} id
 */
export function parseProductId(id) {
  if (!isString(id) || (isString(id) && !id.length)) {
    return {}
  }
  if (id.includes('-')) {
    const parts = id.split('-')
    return {
      masterId: get(parts, '[0]', id),
      colorId: get(parts, '[1]'),
    }
  }
  if (id.includes(' ')) {
    const idClean = id.replace(/\s+/g, ' ')
    const parts = idClean.split(' ')
    return {
      masterId: get(parts, '[0]', id),
      colorId: get(parts, '[1]'),
      sizeId: get(parts, '[2]'),
      widthId: get(parts, '[3]'),
    }
  }
  if (id.includes('+')) {
    const idClean = id.replace(/\+/g, ' ')
    const parts = idClean.split(' ')
    return {
      masterId: get(parts, '[0]', id),
    }
  }
  return {
    masterId: id,
  }
}

export function findVariantById(variants, id) {
  return variants.find((variant) => variant.productId === id)
}

const getMatchesByPropValue = (obj1, obj2) => (key) =>
  !obj1[key] || !obj2[key] || obj1[key] === obj2[key]

/**
 *
 * @param {Array} variants
 * @param {Object} filterOptions onlyOrderable - filter out unorderable items; color|size|width filter by variant id
 */
export function filterProductVariants(variants, { onlyOrderable, ...options }) {
  if (!variants) {
    return []
  }
  return variants?.filter((variant) => {
    const matchesByPropValue = getMatchesByPropValue(variant?.variationValues, options)
    return (
      matchesByPropValue(VARIATION_TYPES.color) &&
      matchesByPropValue(VARIATION_TYPES.size) &&
      matchesByPropValue(VARIATION_TYPES.width) &&
      (!onlyOrderable || isOrderable(variant))
    )
  })
}

export function getAvailablePropOptions(variants, filterOptions, propName) {
  const filteredVariants = filterProductVariants(variants, {
    ...filterOptions,
    onlyOrderable: true,
  })
    .map((variant) => getVariantAttrValue(variant, propName))
    .filter((item) => item)
  return uniq(filteredVariants)
}

function getVariationAttributeValues(variationGroup, attrName) {
  const variationAttributes = get(variationGroup, 'variationAttributes', [])
  const variationAttributeData = variationAttributes.find((varAttr) => varAttr.id === attrName)
  return get(variationAttributeData, 'values', [])
}

export function getSizesInfoByVgId(rawProductData, variationGroupId) {
  const variationGroupData = get(rawProductData, 'variationGroup', []).find(
    (vg) => vg.id === variationGroupId
  )
  if (!variationGroupData) return []

  const colorAttrValues = getVariationAttributeValues(variationGroupData, VARIATION_TYPES.color)
  const colorId = get(colorAttrValues, '[0].value')
  const selectedMasterVariants = rawProductData?.variant?.filter(
    (v) => v.masterId === variationGroupData.masterId
  )
  const variantsByColor = filterProductVariants(selectedMasterVariants, {
    color: colorId,
  })

  const sizeAttrValues = getVariationAttributeValues(variationGroupData, VARIATION_TYPES.size)
  const resultSizes = sizeAttrValues
    .map((sizeAttrValue) => {
      const variant = variantsByColor.find((v) => v?.variationValues?.size === sizeAttrValue?.value)
      return {
        ...sizeAttrValue,
        variantId: variant?.id,
      }
    })
    .filter((size) => size.variantId)
  return resultSizes
}

/**
 * Returns ordering status for particular product inventory state
 *
 * @param {Object} productData
 */
export function getOrderingStatus(
  productData,
  selectedColor,
  selectedSize,
  selectedWidth,
  apploading
) {
  selectedSize = productData?.sizes?.filter((item) => item?.id === selectedSize?.id)[0]

  const { orderable, ats, backorderable, preorderable } = get(productData, 'inventory', {})
  if (productData?.productType?.variant && selectedColor && selectedSize && selectedWidth) {
    const filteredVariants = productData?.variants?.filter((item) =>
      item?.productId?.includes(selectedColor?.id)
    )

    const orderableVariants = filterProductVariants(filteredVariants, {
      onlyOrderable: true,
      color: selectedColor?.id,
      size: selectedSize?.id,
      width: selectedWidth?.id,
    })

    if (orderableVariants?.length === 0) {
      return ORDERING_STATUS.soldOut
    }
  }

  if (
    (productData?.sizes?.length && !selectedSize) ||
    (productData?.widths?.length && !selectedWidth)
  ) {
    if (preorderable) {
      return ORDERING_STATUS.preorder
    }
    if (backorderable) {
      return ORDERING_STATUS.backorder
    }
    if (selectedColor && !selectedColor?.orderable) {
      return ORDERING_STATUS.soldOut
    }
    return ORDERING_STATUS.addToBag
  }
  if (!apploading && productData) {
    if ((selectedColor?.isCustomized || selectedColor?.isMonogrammed) && selectedColor?.orderable) {
      if (preorderable) {
        return ORDERING_STATUS.preorder
      }
      if (backorderable) {
        return ORDERING_STATUS.backorder
      }
      return ORDERING_STATUS.addToBag
    }

    if (preorderable) {
      return ORDERING_STATUS.preorder
    }
    if (backorderable) {
      return ORDERING_STATUS.backorder
    }

    if (orderable && ats > 0) {
      return ORDERING_STATUS.addToBag
    }
    return ORDERING_STATUS.soldOut
  }
  if (selectedColor && !selectedColor?.orderable) {
    return ORDERING_STATUS.soldOut
  }
  if (selectedSize && !selectedSize?.orderable) {
    return ORDERING_STATUS.soldOut
  }
  if (selectedWidth && !selectedWidth?.orderable) {
    return ORDERING_STATUS.soldOut
  }

  if (selectedWidth && !selectedWidth?.orderable) {
    return ORDERING_STATUS.soldOut
  }

  return ORDERING_STATUS.addToBag
}

export function getOrderingStatusByVG(selectedVariantGroup) {
  const isOrderable = get(selectedVariantGroup, 'orderable')
  if (isOrderable) {
    return ORDERING_STATUS.addToBag
  } else {
    return ORDERING_STATUS.soldOut
  }
}

const getVariationGroupProductId = (variationGroup) =>
  variationGroup?.productId || variationGroup?.productID

export function getMasterIdForProductWithoutVariants(masterId, variants) {
  if (masterIdRegex.test(masterId) && variants.length === 0) {
    return masterId.replace(masterIdRegex, '')
  }
  return masterId
}

export function getColorVariantId(
  masterId,
  colorId,
  variants = [],
  { isVariationGroup = false } = {}
) {
  if (isVariationGroup && variants.length) {
    const variationGroup = variants.find((item) =>
      getVariationGroupProductId(item)?.includes(colorId)
    )
    return getVariationGroupProductId(variationGroup)
  }
  if (variants?.length) {
    return variants.find((item) => item?.variationValues?.color?.includes(colorId))?.productId
  }
  return `${masterId}-${colorId}`
}

export function getVariantInventoryFromVG(data, variant = {}) {
  if (data?.variant) {
    const vr = Object.values(data?.variant)?.find((vrData) => {
      if (vrData?.id === variant?.id) {
        return vrData
      }
      return undefined
    })
    return vr
  }
}

export function getPropValuesFromVariationValues(product, fromDefault = true, megaPDPSitePref) {
  const variationValues = get(
    product,
    `${fromDefault ? 'defaultVariant' : 'pickedProps'}.variationValues`
  )
  if (!variationValues) {
    return {}
  }

  const megaPDPEligibleProduct = get(product, 'master.customAttributes.c_IsMegaPDPEligible', false)
  const { isMegaPDPEligible } = megaPDPEligibleToggle(megaPDPEligibleProduct, megaPDPSitePref)

  const out = {}
  for (const key of Object.keys(variationValues)) {
    const mappedProp = VARIATION_MAPPING[key]
    if (mappedProp) {
      const prop = product[mappedProp]
      if (prop) {
        const found = isMegaPDPEligible
          ? prop.find(
              (p) =>
                p.id === variationValues[key] && p?.masterId === product?.masterId && p?.orderable
            )
          : prop.find((p) => p.id === variationValues[key])
        if (found) {
          out[key] = found
        }
      }
    }
  }

  return out
}

// Get filtered variants based on priceType
export function getFilteredVariants(variationInfo, isSalePriceType, isFullPriceType, productData) {
  let filteredVariants = []
  try {
    if (isSalePriceType) {
      const onSaleVariants = variationInfo.filter((item) => item.isOnSale).map((i) => i.pid)
      filteredVariants = productData.variants.filter((item) =>
        onSaleVariants?.includes(item.productId)
      )
    } else if (isFullPriceType) {
      const onFPVariants = variationInfo.filter((item) => !item.isOnSale).map((i) => i.pid)
      filteredVariants = productData.variants.filter((item) =>
        onFPVariants?.includes(item.productId)
      )
    }
  } catch (e) {
    filteredVariants = []
  }
  return filteredVariants
}

const filterColors = (variants, colorData) => {
  return colorData.filter((cData) => variants.some((variant) => variant.includes(cData.id)))
}

// Get filtered colors based on priceType
export function getFilteredColors(
  variationInfo,
  normalizedProductData,
  isSalePriceType,
  isFullPriceType
) {
  let filteredColors = []
  try {
    if (isSalePriceType) {
      // color ids are like V5QVE while product data is having ids like '22952 V5QVE'
      const onSaleVariantId = variationInfo?.filter((item) => item?.isOnSale)
      const variants = normalizedProductData?.variants
      const onSaleVariants = variants?.map((variant) =>
        variant?.productId?.includes(onSaleVariantId)
      )?.variationValues?.color
      filteredColors = filterColors(onSaleVariants, normalizedProductData?.colors)
    } else if (isFullPriceType) {
      const onFPVariantId = variationInfo?.filter((item) => !item?.isOnSale)
      const variants = normalizedProductData?.variants
      const onFPVariants = variants?.map((variant) => variant?.productId?.includes(onFPVariantId))
        ?.variationValues?.color
      filteredColors = filterColors(onFPVariants, normalizedProductData?.colors)
    }
  } catch (e) {
    filteredColors = []
  }
  return filteredColors
}

export function filterColorsToSwatches(
  product,
  isDisplayOosSwatch,
  srcParam,
  sourceCodeGroupAttributeMapping,
  isEnableSaleSuppression,
  isSPC = false,
  isFPC = false,
  isPlpV3 = false
) {
  const colors = get(product, 'colors', [])
  const variationGroup = get(product, 'variationGroup', [])
  let colorsToShowAsPerSrc = colors
  if (variationGroup.length > 0) {
    colorsToShowAsPerSrc = []
    colors.forEach((color) => {
      variationGroup.forEach((item) => {
        if (
          !item?.color?.includes(color?.id) ||
          !item?.variationAttributes?.[0]?.values[0]?.name === color?.text
        ) {
          return
        }
        if (
          (!item?.isEarlyAccess && !item?.isEmployeeSale) ||
          (checkSourceCodeWithMapping({
            sourceCodeGroupId: srcParam,
            sourceCodeToCheck: [EARLY_ACCESS, IS_EARLY_ACCESS],
            sourceCodeGroupAttributeMapping,
            isEnableSaleSuppression,
          }) &&
            item?.isEarlyAccess) ||
          (checkSourceCodeWithMapping({
            sourceCodeGroupId: srcParam,
            sourceCodeToCheck: [EMPLOYEE_SALE, IS_EMPLOYEE_SALE],
            sourceCodeGroupAttributeMapping,
            isEnableSaleSuppression,
          }) &&
            item?.isEmployeeSale)
        ) {
          let index = colorsToShowAsPerSrc.findIndex((object) => object.id === color.id)
          if (index === -1) {
            colorsToShowAsPerSrc.push({
              ...color,
              orderable: item.orderable,
              displayifOOS: item?.displayifOOS,
              isOnSale: item.isOnSale,
              isDefaultSwatch: color.vgId === product?.defaultColor?.vgId,
            })
          }
        }
      })
    })
  }

  const swatches = isDisplayOosSwatch
    ? colorsToShowAsPerSrc
    : colorsToShowAsPerSrc.filter((item) => {
        const displayIfOOS = 'displayifOOS' in item ? item.displayifOOS : isDisplayOosSwatch

        return item.orderable || displayIfOOS
      })

  if (isSPC) return swatches.filter((swatch) => swatch.isOnSale)
  if (isFPC) return swatches.filter((swatch) => !swatch.isOnSale)

  // push at least one default swatch if there is nothing else to show
  if (isPlpV3 && swatches.length === 0) {
    const defaultSwatch = colorsToShowAsPerSrc.find((item) => item?.isDefaultSwatch)
    if (defaultSwatch) {
      swatches.push(defaultSwatch)
    }
  }

  return swatches
}

export function getMaxLengthButtonInRow(
  items,
  isDesktop,
  isQuickView,
  isNeutralSizingApplicable = false
) {
  const largestLenghtInItems =
    items?.length > 0
      ? !isNaN(Number(get(items?.[0], 'text', null) || get(items?.[0], 'name', null)))
        ? items.filter((item) => isNaN(Number(item?.text || item?.name)))
        : items?.filter((size) => get(size, 'text.length', 0) || get(size, 'name.length', 0) > 3)
      : null
  const maxLengthButtonsInRow =
    largestLenghtInItems?.length > 0 ? (isDesktop ? (isQuickView ? 2 : 3) : 2) : isDesktop ? 7 : 6
  return isNeutralSizingApplicable ? 6 : maxLengthButtonsInRow
}

export const getNewAvailablePropOptions = (selectedVG, attributeName) => {
  const allAttributes =
    selectedVG?.variationAttributes?.find((attr) => {
      return attr.id === attributeName
    })?.values || []

  const updatedAttributes = []
  allAttributes.forEach((attr) => {
    if (attr.orderable) {
      updatedAttributes.push(attr.value)
    }
  })

  return updatedAttributes
}

export const getVariantInfo = (productData, { selectedColor, selectedSize, selectedWidth }) => {
  const selectedColorId = getId(selectedColor)
  const selectedSizeId = getId(selectedSize)
  const selectedWidthId = getId(selectedWidth)
  const masterId = getMasterId(selectedColor)

  const variants = productData?.isServerSide
    ? get(productData, 'variant', [])
    : get(productData, 'variants', [])

  const isCustomizedProduct = selectedColor?.isCustomized || selectedColor?.isMonogrammed

  const customizerBaseProductId = get(selectedColor, 'baseProductId')

  const colorFilterId =
    customizerBaseProductId && isCustomizedProduct ? customizerBaseProductId : selectedColorId

  let filteredVariants
  if (selectedColorId) {
    filteredVariants = variants?.filter(
      (item) =>
        (item?.productId?.includes(colorFilterId) ||
          get(item, `variationValues.${VARIATION_TYPES.color}`, '') === colorFilterId) &&
        item?.masterId === masterId
    )
  } else {
    filteredVariants = variants
  }

  const availableColors = []

  productData?.variationGroup?.forEach((vg) => {
    if (vg.orderable) {
      const color = vg?.variationAttributes?.find(
        (variationAttribute) => variationAttribute?.id === 'color'
      )?.values?.[0]?.value
      if (color && !availableColors.includes(color)) {
        availableColors.push(color)
      }
    }
  })

  let availableSizes = getAvailablePropOptions(
    filteredVariants,
    {
      color: selectedColorId,
      width: selectedWidthId,
      onlyOrderable: true,
    },
    VARIATION_TYPES.size
  )

  let availableWidths = getAvailablePropOptions(
    filteredVariants,
    {
      color: selectedColorId,
      size: selectedSizeId,
      onlyOrderable: true,
    },
    VARIATION_TYPES.width
  )

  const availableAndOrderableVariants = filterProductVariants(filteredVariants, {
    onlyOrderable: true,
    color: selectedColorId,
    size: selectedSizeId,
    width: selectedWidthId,
  })

  return {
    availableColors,
    availableWidths,
    availableSizes,
    availableAndOrderableVariants,
  }
}

export const filterContentByDate = (badge, sitePreviewDateTime) => {
  const { from_date, to_date } = pick(badge, ['from_date', 'to_date'])
  const fromDate = new Date(from_date)
  fromDate.setHours(0, 0, 0, 0)
  const fromDateTime = fromDate.getTime()

  const toDate = new Date(to_date)
  toDate.setHours(23, 59, 59, 0)
  const toDateTime = toDate.getTime()

  if (!fromDateTime && !toDateTime) {
    return true
  }
  let currentTimeInterval = new Date().getTime()
  if (sitePreviewDateTime) {
    const { date, time } = splitDateTime(sitePreviewDateTime)
    const sitePreviewDate = new Date(date + ' ' + time)
    currentTimeInterval = sitePreviewDate.getTime()
  }
  if (fromDateTime && !toDateTime) {
    return fromDateTime <= currentTimeInterval
  }
  if (!fromDateTime && toDateTime) {
    return currentTimeInterval <= toDateTime
  }
  return fromDateTime <= currentTimeInterval && currentTimeInterval <= toDateTime
}

export const checkInsStockText = (productData) => {
  const customProps = [
    'custom.c_inStockCustomText',
    'instockText',
    'defaultVariantData.custom.c_inStockCustomText',
    'defaultVariationGroupData.custom.c_inStockCustomText',
    'customAttributes.c_inStockCustomText',
  ]

  const inStockText = customProps.reduce((text, prop) => text || get(productData, prop), null)

  return Boolean(inStockText)
}
