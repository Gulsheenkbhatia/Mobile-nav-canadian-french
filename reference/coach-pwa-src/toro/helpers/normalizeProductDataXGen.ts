import { get } from 'lodash'
import { filterContentByDate, VARIATION_TYPES } from 'toro/helpers/productVariations'
import getProductUrl from 'toro/helpers/getProductUrl'
import isArray from 'lodash/isArray'
import { getPriceInfoXGen } from 'toro/helpers/getPriceInfoXGen'
import { getDealPromotion } from 'toro/lib/vendorProductsAdapter/search/vendors/xgen/helpers'
import {
  RecommendationProduct,
  XgenApiProductData,
  EmptyObject,
  XgenApiVariation,
  MarketingConfigItem,
  MarketingConfig,
  SearchProductVariation,
  Strict,
} from 'toro/types/productTypes'
import { SitePreviewConfig } from 'toro/helpers/sitePreview'
import { BrandConfig } from 'toro/lib/vendorProductsAdapter/search/types/module'
import { MarketingConfType } from 'toro/components/badges/types'
import {
  SupportedCurrency,
  SupportedLanguage,
  SupportedLocale,
  SupportedRegion,
} from 'toro/types/locales'

export interface CurrentLocale {
  locale: SupportedLocale
  currency: SupportedCurrency
  currencyDecimals: number
  currencySymbol: string
  lang: SupportedLanguage
  region: SupportedRegion
  currencySymbolAfterPrice?: boolean
}

const PRODUCT_PREORDERABLE = 'preorder'
const PRODUCT_AVAILABLE = ['in stock', PRODUCT_PREORDERABLE] as const

type ProductAvailability = typeof PRODUCT_AVAILABLE[number]

const instock = (element: ProductAvailability): boolean => PRODUCT_AVAILABLE.includes(element)
const searchableIfUnavailableFlag = (element: string): boolean => Boolean(element)

const convertBooleanStringsToBoolean = (val: any) => {
  if (
    typeof val === 'string' &&
    (val?.toLowerCase() === 'true' || val?.toLowerCase() === 'false')
  ) {
    return val.toLowerCase() === 'true'
  }
  return val
}

const getVariationMapData = (data: XgenApiProductData) => {
  const variationMapData = get(data, 'variations', [])
  return Array.isArray(variationMapData)
    ? variationMapData.reduce((a, v) => {
        for (const key in v) v[key] = convertBooleanStringsToBoolean(v[key])
        return { ...a, ...v }
      }, {})
    : variationMapData
}

const getMarketingConf = (
  result: XgenApiVariation,
  type: MarketingConfType,
  sitePreview: SitePreviewConfig | EmptyObject
): MarketingConfig | null => {
  const isMarketingField = String(get(result, `Marketing${type}`, '')).toLowerCase() === 'true'
  const marketingArrContent = get(result, `Marketing${type}Content_Variation`)

  if (!isMarketingField || !marketingArrContent) {
    return null
  } else if (isMarketingField && marketingArrContent) {
    if (!isArray(marketingArrContent)) {
      return null
    }
    return marketingArrContent.reduce((sum: MarketingConfig, item: MarketingConfigItem) => {
      if (filterContentByDate(item, sitePreview?.dateTime)) {
        return {
          ...sum,
          [item.type]: item.contentId,
        }
      }
      return sum
    }, {})
  }
}

const normalizeVariations = (
  result: XgenApiVariation[],
  productName: string,
  sitePreview: SitePreviewConfig | EmptyObject = {}
): SearchProductVariation[] =>
  result.map((variant) => {
    const orderable = get(variant, 'availability', []).some(instock)
    const searchableIfUnavailable = get(variant, 'searchableIfUnavailable', []).some(
      searchableIfUnavailableFlag
    )
    const variationMapData = getVariationMapData(variant)
    const additionalImages = get(variationMapData, 'additional_image_link')
      ? get(variationMapData, 'additional_image_link')?.split(',')
      : []
    const Image400Link = get(variationMapData, 'Image400Link')
    const media = [Image400Link, ...additionalImages]
      .filter((i) => i?.length)
      .map((image) => {
        return {
          src: image,
          alt: '',
        }
      })
    const url = getProductUrl({
      name: productName,
      productId: variant.VariationId,
      frpId: null,
      locale: null,
      canonicalUrl: null,
      isSubBrand: null,
      subBrandName: null,
    })
    return {
      ...variationMapData,
      firstVariant: variationMapData?.VariationId,
      color: variant.VariationId.replace(/\s\s+/g, ' ').split('-')?.[1],
      name: productName,
      orderable,
      displayifOOS: searchableIfUnavailable,
      media: {
        full: media,
        thumbnails: media,
        thumbnail: media,
      },
      productID: variant.VariationId,
      productId: variant.VariationId,
      variationValues: {
        color: variant.VariationId.replace(/\s\s+/g, ' ').split('-')?.[1],
      },
      prices: {
        tieredPrices: [
          {
            price: get(variant, 'price'),
            quantity: 1,
          },
        ],
        currentPrice: get(variant, 'sale_price'),
        regularPrice: get(variant, 'price'),
        priceRange: null,
        discount: get(variant, 'maxSalePercent', 0),
      },
      url,
      variantsAssigned: [],
      marketingBadgeConf: getMarketingConf(variant, 'Badge', sitePreview),
      marketingMessageConf: getMarketingConf(variant, 'Message', sitePreview),
    }
  })

export function normalizeProductDataXGen(
  value: string,
  data: XgenApiProductData,
  isVariant: boolean = false,
  currentLocale: CurrentLocale | null = null,
  brandConfig: Strict<BrandConfig> | EmptyObject = {},
  tilePreferences: {
    displayOosSwatch?: boolean
    bundleListPriceCaption?: string
    enableSaleSuppression?: boolean
    timeZoneOffsetInHours?: number
  } = {},
  siteIdentifierValue: string = '',
  isPreviewEnabled: boolean = false,
  sitePreview?: SitePreviewConfig,
  src: string = ''
): RecommendationProduct {
  const product = data
  const isBundleProduct = get(product, 'isBundle', false)
  const frpVGId = get(data, 'VariationId', null)
  const isCoachOutletOrKSS = ['ksna-surprise', 'coach-outlet'].includes(siteIdentifierValue)
  const displayOosSwatchPref = get(tilePreferences, 'displayOosSwatch')
  const bundleListPriceCaption = get(tilePreferences, 'bundleListPriceCaption')
  const enableSaleSuppression = get(tilePreferences, 'enableSaleSuppression')
  const timeZoneOffsetInHours = get(tilePreferences, 'timeZoneOffsetInHours')
  const variationMapData = getVariationMapData(product)
  const url = getProductUrl({
    name: value,
    productId: isVariant ? get(variationMapData, 'VariationId') : get(product, 'id'),
    frpId: !isBundleProduct && product?.variation_id,
    locale: null,
    ...brandConfig,
    ...data,
  })
  const variants = get(data, 'variations') || []
  const normalizedVariationGroups = normalizeVariations(variants, value)
  const defaultVG = normalizedVariationGroups.filter((vg) => vg.VariationId === frpVGId)[0]
  const hideDiscountRate = get(defaultVG, 'hideDiscountRate', false)
  const hideComparablePriceValue = get(defaultVG, 'hideComparablePriceValue', false)
  const adaptToMediaFormat = (url) => ({ src: url, alt: value })
  const thumbnailUrl = get(product, 'image_url', '')
  const thumbnail = adaptToMediaFormat(thumbnailUrl)
  const images = [
    thumbnail,
    ...(product?.image_url?.split(',').map(adaptToMediaFormat) || []),
  ].filter((i) => i?.src?.length)
  const media = {
    full: images,
    thumbnails: images,
    thumbnail,
  }
  const getSpecification = (type: string) => {
    const variants = get(data, 'variations', [])
    if (!variants.length) {
      return []
    }

    return variants.map((variant) => ({
      id: get(variant, 'VariationId'),
      text: get(variant, 'facets', [])?.find((item) => item.name === type)?.values?.[0] || [],
      image: get(variant, 'image_url', ''),
    }))
  }
  const normalizedVariants = get(data, 'variations', []).map((variant) =>
    normalizeProductDataXGen(
      value,
      variant,
      true,
      currentLocale,
      brandConfig,
      tilePreferences,
      siteIdentifierValue,
      isPreviewEnabled,
      sitePreview,
      src
    )
  )

  const promotions = get(data, 'promotions', []).filter((promo) => promo?.ID)
  const dealPromotion = getDealPromotion(promotions, sitePreview, timeZoneOffsetInHours)

  const variantsOnSale = normalizedVariationGroups.map((variation) => {
    const { VariationId: variationId, IsOnSale } = variation
    const frpPrice = getPriceInfoXGen({
      productVariants: normalizedVariationGroups,
      currentLocale,
      displayOosSwatchPref,
      isCoachOutletOrKSS,
      frpVGId: variationId,
      promotion: dealPromotion,
      enableSaleSuppression,
      src,
    })
    return {
      id: variationId,
      onSale: IsOnSale,
      price: get(frpPrice, '[0]', {}),
    }
  })

  return {
    id: isVariant ? get(variationMapData, 'VariationId') : get(product, 'id'),
    name: value,
    url,
    price: get(variationMapData, 'price'),
    promotionPrice: getPriceInfoXGen({
      productData: variationMapData,
      productVariants: normalizedVariationGroups,
      currentLocale,
      displayOosSwatchPref,
      isCoachOutletOrKSS,
      frpVGId,
      isBundleProduct,
      bundleListPriceCaption,
      promotion: dealPromotion,
      enableSaleSuppression,
      src,
    }),
    hideDiscountedRate: hideDiscountRate,
    hideComparablePriceValue,
    media,
    thumbnail: { src: thumbnailUrl, alt: product.color || product.id },
    colors: getSpecification(VARIATION_TYPES.color),
    sizes: getSpecification(VARIATION_TYPES.size),
    isEnableFitReviewLink: false,
    quantity: get(product, 'quantity'),
    defaultColor: {
      color: product.color,
      media: { thumbnails: [{ src: product.image_url }] },
      text: get(product, 'facets', [])?.find((item) => item.name === VARIATION_TYPES.color)
        ?.values?.[0],
    },
    productType: { variationGroup: true },
    variants: normalizedVariants,
    variantsOnSale,
    availability: Boolean(variantsOnSale.filter((item) => item.onSale)),
    isAiDriven: false,
    isBundleProduct,
    isProductSet: isBundleProduct,
    hitType: isBundleProduct ? 'set' : 'master',
  }
}
