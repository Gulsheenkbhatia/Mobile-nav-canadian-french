import {
  filterVariations,
  getDealPromotion,
} from 'lib/vendorProductsAdapter/search/vendors/xgen/helpers'
import {
  getInventory,
  normalizeMedia,
  normalizeColorData,
  normalizeVariations,
} from 'lib/vendorProductsAdapter/search/vendors/xgen/builders'
import { currentLocaleAtom } from 'store/global.atom'
import { getConstructorPriceInfo } from 'toro/helpers/getConstructorPriceInfo'
import get from 'lodash/get'
import pick from 'lodash/pick'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import { getRelativeUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import isPromoValid from 'toro/helpers/isPromoValid'
import isEmpty from 'lodash/isEmpty'
import { TemplateName } from 'toro/constants/templates'
import { preferencesAtom } from 'store/preferences.atom'
import { XgenContainerID } from 'toro/lib/xgen/types'

export const getPromotionPlp = (promotions, timeZoneOffsetInHours) => {
  const topRankedPromo = promotions.filter((promo) => typeof promo?.promoRank === 'number')
  if (topRankedPromo.length === 0) {
    return null
  }
  topRankedPromo.sort((a, b) => a.promoRank - b.promoRank)
  const topActivePromo = topRankedPromo.find((promo) => {
    return isPromoValid(
      promo?.promoStartDate?.replace('+', '') ?? '',
      promo?.promoEndDate?.replace('+', '') ?? '',
      timeZoneOffsetInHours
    )
  })
  if (!topActivePromo) {
    return null
  }
  const text = topActivePromo?.calloutMsgplp || ''
  const styleMatch = text.match(/style="([^"]+)"/)
  const promoStyle = styleMatch ? styleMatch[1] : ''
  const formattedPromo = {
    'call-out-message': {
      content: {
        text,
        spanText: '',
        promoStyle,
        scriptContent: '',
        mainHtml: text,
        isPromoModal: false,
        shouldInjectJquery: null,
        isOTD: false,
        promo: {},
        styles: null,
      },
      config: {
        device: 'All',
      },
      id: 'call-out-message',
    },
  }
  return [formattedPromo]
}

const normalizedVariantKeys = [
  'orderable',
  'displayifOOS',
  'productId',
  'variationValues',
  'prices',
]

export const getStockStatus = (product) => {
  if (product.preorderable) return 'preorder'
  else if (product.is_in_stock) return 'in stock'
  return 'out of stock'
}

export const transformRawProducts = (p) => {
  return {
    availability: getStockStatus(p),
    masterId: p.master_id,
    quantity: p.quantity,
    name: p.prod_name,
    id: p.prod_code,
    orderable: p.is_orderable,
    isBestSeller: p.is_best_seller,
    VariationId: p.variant_id,
    IsOnSale: p.is_on_sale,
    price: p.price,
    sale_price: p.sale_price,
    colorVal: p.color_value,
    url: p.product_url,
    color: p.color,
    isOnSale: p.is_on_sale,
    additional_image_link: p.images,
    hideDiscountRate: p.hide_discount_rate,
    hideComparablePriceValue: p.hide_comparable_price_value,
    displayIfOOs: p.display_if_oos,
    ColorSwatchURL: p.color_swatch_url,
    color_id: p.color_id,
    isOnlineNow: p.is_online_now,
    isMemberExclusive: p.is_member_exclusive,
    isNewArrival: p.is_new_arrival,
    brand: p.brand,
    enableColorAdaptive: p.enable_color_adaptive,
    enablePDP4Template: p.enable_pdp4_template,
    hideReview: p.hide_review,
    inventoryThreshold: p.inventory_threshold,
    isEarlyAccess: p.is_early_access,
    isEmployeeSale: p.is_employee_sale,
    isFinalSale: p.is_final_sale,
    isPrivateSale: p.is_private_sale,
    material: p.material,
    maxSalePercent: p.max_sale_percent,
    onlineFlag: p.online_flag,
    promotions: p.promotions,
    preorderable: p.preorderable,
    top_rated: p.is_top_rated,
    visuallySimilarPIDs: p.visually_similar_pids,
    variants: Array.isArray(p.variants)
      ? p.variants.map((v) => ({
          variationGroupId: v.group_id,
          IsCustomizable: v.is_customizable,
          IsMemberExclusive: v.is_member_exclusive,
          IsNewArrival: v.is_new_arrival,
          IsOnSale: v.is_on_sale,
          VariationId: v.variant_id,
          additional_image_link: v.images,
          color: v.color,
          ColorSwatchURL: v.color_swatch_url,
          displayIfOOs: v.display_if_oos,
          enableColorAdaptive: v.enable_color_adaptive,
          enablePDP4Template: v.enable_pdp4_template,
          hideComparablePriceValue: v.hide_comparable_price_value,
          hideDiscountRate: v.hide_discount_rate,
          hideReview: v.hide_review,
          id: v.prod_code,
          image_url: v.image,
          inStockCustomText: v.in_stock_custom_text,
          isEarlyAccess: v.is_early_access,
          isEmployeeSale: v.is_employee_sale,
          isFinalSale: v.is_final_sale,
          material: v.material,
          maxSalePercent: v.max_sale_percent,
          price: v.price,
          sale_price: v.sale_price,
          color_id: v.color_id,
          quantity: v.quantity,
          availability: getStockStatus(v),
          isOnlineNow: v.is_online_now,
          onlineFlag: v.online_flag,
          visuallySimilarPIDs: p.visually_similar_pids,
        }))
      : [],
  }
}

/**
 * Transforms plpTopProductsData.items to match the structure expected by ProductTile
 * The key difference is that ProductItem (from recommendations) lacks the colors array with media/thumbnails
 * that regular search products have
 *
 * @param recommendedItems - Array of ProductItem from plpTopProductsData.items
 * @returns Transformed array compatible with products array (SearchProductData structure)
 */
export const transformTopProductsToProductsFormat = ({
  rawProduct,
  isMobile,
  isPdpV6,
  isPdpV5_1,
  recType,
  strategyId,
}) => {
  if (isEmpty(rawProduct)) {
    return null
  }
  const result = transformRawProducts(rawProduct)
  const locale = get(currentLocaleAtom)
  const preferences = get(preferencesAtom)
  const enableOneSite = get(preferences, 'OneSite.enableOneSite', false)
  const timeZoneOffsetInHours = preferences?.ToggleSiteFeatures?.timeZoneOffsetInHours
  const currentLocale = getCurrentLocale(locale)
  const {
    name: productName = '',
    variants: variations = [],
    isNewArrival = false,
    inventoryThreshold,
    isBestSeller,
    VariationId: variationId,
    url: productUrl,
    quantity = 0,
    masterId = '',
    hideComparablePriceValue = false,
    price = 0,
    sale_price: salePrice = 0,
    top_rated: isTopRated,
    promotions = [],
    enablePDP4Template = false,
    enableColorAdaptive = false,
    hitType,
  } = result
  const colorVariationId = variationId
  const filteredVariants = filterVariations(variations, {}, '', variationId)
  const normalizedPlpVariationGroups = normalizeVariations(filteredVariants, productName)
  const normalizedVariants = normalizedPlpVariationGroups
    .filter((variant) => variant.orderable || variant.displayifOOS)
    .map((variant) => {
      const reducedVariant = pick(variant, normalizedVariantKeys)
      return reducedVariant
    })
  const defaultVariant =
    normalizedVariants.find((variant) => variant.productId === variationId) || normalizedVariants[0]
  const normalizedPlpColors = normalizeColorData({
    filteredVariants,
    masterId,
    productName,
  }).filter((item) => item.orderable || item.displayifOOS)
  const defaultColor = normalizedPlpColors.find(
    ({ VariationId }) => VariationId === colorVariationId
  )
  const dealPromotion = getDealPromotion(promotions, {}, timeZoneOffsetInHours)
  const promoPLP = getPromotionPlp(promotions, timeZoneOffsetInHours)
  const inventory = getInventory({ data: result })
  const variantsOnSale = normalizedPlpVariationGroups.map((variation) => {
    const { VariationId: variationId, IsOnSale } = variation
    const frpPrice = getConstructorPriceInfo({
      productVariants: normalizedPlpVariationGroups,
      currentLocale,
      enableOneSite,
      frpVGId: variationId,
      promotion: dealPromotion,
    })
    return {
      id: variationId,
      onSale: IsOnSale,
      price: frpPrice?.[0] ?? {},
    }
  })
  const defaultVG = normalizedPlpVariationGroups.find((vg) => vg.productId === variationId)
  const hideDiscountedRate = defaultVG?.hideDiscountRate
  const isBundleProduct = hitType === 'set'
  const templates = {
    mobile: isMobile && !isBundleProduct && isPdpV6 ? TemplateName.pdpv6 : TemplateName.default,
    desktop:
      !isMobile && !isBundleProduct && isPdpV5_1 ? TemplateName.pdpv5_1 : TemplateName.default,
  }

  return {
    eventLocation: XgenContainerID.plpTopProducts,
    recType,
    scheme_exp_id: strategyId,
    isTopRated,
    isNewArrival,
    enableSwatches: Boolean(normalizedPlpVariationGroups?.length),
    colors: normalizedPlpColors,
    custom: {
      c_isBestSeller: isBestSeller,
      c_inventoryThreshold: inventoryThreshold,
      c_enablePdp4Template: enablePDP4Template ?? false,
      c_enableColorAdaptive: enableColorAdaptive ?? false,
    },
    defaultColor,
    defaultVariant,
    price,
    prices: {
      currentPrice: salePrice,
      regularPrice: price,
      priceRange: null,
      discount: 0,
    },
    promotionPrice: getConstructorPriceInfo({
      productData: result,
      productVariants: normalizedPlpVariationGroups,
      enableOneSite,
      frpVGId: variationId,
      currentLocale,
      promotion: dealPromotion,
    }),
    hideComparablePriceValue,
    id: variationId,
    productId: variationId,
    hideDiscountedRate,
    masterId,
    masterProductData: {
      custom: {
        c_hideComparablePriceValue: false,
        c_inventoryThreshold: inventoryThreshold,
        c_isMemberExclusive: false,
      },
    },
    media: normalizeMedia({ data: result }),
    name: productName,
    pickedProps: {},
    productType: {
      option: true,
      variant: true,
    },
    promoPDP: {},
    promoPLP,
    promotionData: {
      bestseller: isBestSeller,
    },
    url: getRelativeUrl(productUrl),
    quantity,
    showRatings: false,
    sourceCodeBadge: null,
    sourceCodeMessage: null,
    variants: normalizedVariants,
    variantsOnSale: variantsOnSale,
    variationGroup: normalizedPlpVariationGroups,
    inventory,
    variationGroupData: {
      custom: {
        c_hideComparablePriceValue: hideComparablePriceValue,
      },
      inventory,
    },
    hitType: 'master',
    templates,
    variationAttributes: [
      {
        attributeID: 'color',
        displayName: 'Color',
        ID: 'color',
      },
    ],
    variationValues: { color: defaultColor?.id },
  }
}
