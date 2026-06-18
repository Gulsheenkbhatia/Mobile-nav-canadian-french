import get from 'lodash/get'
import normalizeProduct, { getPromoCallOut } from 'lib/sales-force-connector/utils/normalize'
import megaPDPEligibleToggle from 'helpers/getMegaPDPEligibleToggle'
import getSitePreview from 'toro/helpers/getSitePreview'
import getBrandDetailsFromRequest from 'toro/helpers/getBrandDetailsFromRequest'
import { findAttributeByType } from 'toro/helpers/skuHelper'
import getLocaleFromReq from 'helpers/getLocaleFromReq'
import type { NextApiRequest } from 'next'
import {
  ListingProduct,
  SapiProductData,
  InventoryInfo,
  VariationAttribute,
} from 'toro/types/productTypes'
import type { SitePreviewConfig } from 'toro/helpers/sitePreview'

type RawProductResponse =
  | SapiProductData
  | {
      product?: {
        productData?:
          | {
              productData?: SapiProductData
            }
          | SapiProductData
      }
    }

interface TransformOptions {
  req: NextApiRequest
  activeColorId?: string
  preferences?: Record<string, unknown>
  inventoryData?: {
    inventory?: {
      inventoryInfo?: InventoryInfo
    }
  }
}

function isSapiProductData(value: unknown): value is SapiProductData {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value
}

function extractProductData(rawResponse: RawProductResponse | null): SapiProductData | null {
  if (!rawResponse) return null

  if (isSapiProductData(rawResponse)) {
    return rawResponse
  }

  const productData = rawResponse?.product?.productData

  if (isSapiProductData(productData)) {
    return productData
  }

  if (isSapiProductData(productData?.productData)) {
    return productData.productData
  }

  return null
}

function buildPromoPLP(
  productData: ListingProduct,
  variationGroupId: string | undefined,
  siteId: string
) {
  const variationGroups = get(productData, 'variationGroup', [])
  if (!variationGroups?.length) return []

  const activeVariant = variationGroups.filter((vg) => vg.id === variationGroupId)
  if (activeVariant?.length && activeVariant[0]?.promotionalCallouts) {
    const promoCallOut = getPromoCallOut(
      'promoCallOutPLP',
      activeVariant[0].promotionalCallouts,
      siteId,
      'productListing'
    )
    return promoCallOut || []
  }
  return []
}

export function transformFullProductToTileData(
  rawResponse: RawProductResponse | null,
  options: TransformOptions
): ListingProduct | null {
  const productData = extractProductData(rawResponse)
  if (!productData) return null

  const { req, activeColorId, preferences = {}, inventoryData } = options
  const inventoryInfo = get(inventoryData, 'inventory.inventoryInfo')
  const locale = getLocaleFromReq(req) || ''
  const siteId = process.env.SITE_ID_US || ''
  const brandConfig = getBrandDetailsFromRequest(req)
  const sitePreview = getSitePreview(req) as SitePreviewConfig

  const megaPDPProduct = get(productData, 'master.customAttributes.c_IsMegaPDPEligible', false)
  const newMegaPDPPref = get(productData, 'isNewMegaPDP', false)
  productData.megaPDPEligibleOptions = megaPDPEligibleToggle(megaPDPProduct, newMegaPDPPref)

  const isBundleProduct = productData?.hitType === 'set'
  const normalized = normalizeProduct(productData, {
    locale,
    siteId,
    isBundleProduct,
    isBundleVariant: isBundleProduct,
    frp: undefined,
    isSubBrand: brandConfig.isSubBrand,
    subBrandName: brandConfig.subBrandName,
    isSuggestion: false,
    cleanStateDisplayDiscountPercentage: undefined,
    sitePreview,
    mediaSequence: null,
    ...preferences,
  }) as ListingProduct

  if (!normalized) return null

  if (activeColorId) {
    const vgVariationAttributes = normalized?.variationGroup?.map?.((vg) => ({
      vgId: vg?.id,
      vgAttributes: findAttributeByType(vg?.variationAttributes, 'color'),
    }))
    const masterId = get(normalized, 'masterId', '')
    const variationGroupId = (vgVariationAttributes || []).find(
      (attribute: { vgId?: string; vgAttributes?: VariationAttribute }) =>
        activeColorId === attribute?.vgAttributes?.values?.[0]?.value &&
        attribute?.vgId?.includes(masterId)
    )?.vgId

    if (!normalized?.promoPLP) {
      normalized.promoPLP = buildPromoPLP(normalized, variationGroupId, siteId)
    }
  }

  const productTileData = pickTileFields(normalized, inventoryInfo)

  return productTileData
}

function pickTileFields(data: ListingProduct, inventoryInfo?: InventoryInfo): ListingProduct {
  const masterCustom = get(data, 'master.customAttributes', {})

  return {
    id: data.id,
    name: data.name,
    masterId: data.masterId,
    url: data.url,
    firstVariant: data.firstVariant,
    hitType: data.hitType,
    isProductSet: data.isProductSet,
    isServerSide: data.isServerSide,

    colors: data.colors,
    defaultColor: data.defaultColor,
    media: data.media,

    custom: data.custom,
    variationGroup: data.variationGroup,
    variationGroupData: buildVariationGroupData(data),
    variationValues: data.variationValues,
    variant: data.variant,
    variants: data.variants,

    defaultVariant: data.defaultVariant,
    defaultVariantGroup: data.defaultVariantGroup,
    sizes: data.sizes,
    widths: data.widths,

    prices: data.prices,
    promotionPrice: data.promotionPrice,
    masterPromotionPrice: data.masterPromotionPrice,
    pricingDisplayTemplate: data.pricingDisplayTemplate,
    hideComparablePriceValue: data.hideComparablePriceValue,
    hideDiscountedRate: data.hideDiscountedRate,

    inventory: inventoryInfo || data.inventory,

    masterProductData: buildMasterProductData(data, masterCustom),

    promoPLP: data.promoPLP,
    promoPDP: data.promoPDP,
    promotionData: data.promotionData,
    activeProductData: data.activeProductData,

    pickedProps: data.pickedProps,
    variantsOnSale: data.variantsOnSale,

    marketingBadgeConf: data.marketingBadgeConf,
    marketingMessageConf: data.marketingMessageConf,
    sourceCodeBadge: data.sourceCodeBadge,
    sourceCodeMessage: data.sourceCodeMessage,

    megaPDPEligibleOptions: data.megaPDPEligibleOptions,
    enableSwatches: data.enableSwatches,

    brand: data.brand,
    validFrom: data.validFrom,
    isAiDriven: data.isAiDriven,
    isTopRated: data.isTopRated,
    isNewArrival: data.isNewArrival,
    master: data.master,
  }
}

/**
 * Constructs masterProductData from the normalized product's master object.
 */
function buildMasterProductData(
  data: ListingProduct,
  masterCustom: Record<string, unknown>
): Record<string, unknown> {
  return {
    custom: {
      c_hideComparablePriceValue: masterCustom.c_hideComparablePriceValue,
      c_inventoryThreshold: masterCustom.c_inventoryThreshold || data.custom?.c_inventoryThreshold,
      c_isMemberExclusive: masterCustom.c_isMemberExclusive,
    },
    marketingBadgeConf: get(data, 'master.marketingBadgeConf'),
    marketingMessageConf: get(data, 'master.marketingMessageConf'),
    validFrom: get(data, 'master.validFrom', data.validFrom),
    pickedProps: {
      currency: get(data, 'pickedProps.currency'),
    },
  }
}

/**
 * Constructs variationGroupData from the current product's VG context.
 */
function buildVariationGroupData(data: ListingProduct): Record<string, unknown> {
  const defaultVG = data.defaultVariantGroup || {}
  return {
    custom: {
      c_hideComparablePriceValue: get(defaultVG, 'customAttributes.c_hideComparablePriceValue'),
      c_inventoryThreshold: get(defaultVG, 'customAttributes.c_inventoryThreshold'),
    },
    marketingBadgeConf: get(defaultVG, 'marketingBadgeConf'),
    marketingMessageConf: get(defaultVG, 'marketingMessageConf'),
  }
}
