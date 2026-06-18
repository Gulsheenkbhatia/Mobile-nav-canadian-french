import type { SearchPrices, SearchPromoCallout } from 'toro/search/types/api'
import type { SapiProductData } from 'toro/types/productTypes/apiProductTypes'
import type {
  InventoryInfo,
  MediaImage,
  MediaItem,
  MediaThumbnail,
  PricingInfo,
} from 'toro/types/productTypes/common'
import type { MinProduct } from 'toro/types/productTypes/minProduct'

export type ProductUnionType = string | number | boolean | null
export type ProductUnionMap = Record<string, ProductUnionType>

type SitePreviewConfig = {
  'customer-group'?: string
  dateTime?: string
  'source-code'?: string
}

export interface NormalizedMedia {
  full?: Array<MediaImage>
  thumbnails?: Array<MediaImage>
  thumbnail?: MediaThumbnail
  sequence?: Array<MediaItem>
}

export type NormalizedAccessorizeItProduct = {
  id: string
  priceFormatted: string
  imageURL: string
  inventory: InventoryInfo | undefined
  buyableVariantId: string | undefined
  productDataForGA: MinProduct | null
  accessorizedImageUrl?: string
}

export type AccessorizeItProductsData = {
  [key: string]: NormalizedAccessorizeItProduct[] | undefined
}

export interface NormalizedProductPassport {
  id: string
  name: string
  attributes: ProductUnionMap
  media: NormalizedMedia
  coachtopiaLiningMaterial?: string
  envImpacts?: Array<{
    value: string
    title: string
    description: string
    viewMoreUrl: string
    icon: string
    iconTop: boolean
  }>
  priorityBasedContents: string[]
  disclaimer?: string
}

export interface NormalizedPromoData {
  defaultVariant?: string | null
  promoCallOut?: SearchPromoCallout[] | string[]
  promoCallout?: SearchPromoCallout[] | string[]
  promoLearnMore?: string[] | string | null
  promoPricing?: PricingInfo[]
}

export interface NormalizeProductParams {
  locale?: string
  siteId?: string
  params?: ProductUnionMap
  isBundleProduct?: boolean
  isBundleVariant?: boolean
  frp?: string
  isSubBrand?: boolean
  subBrandName?: string
  sitePreview?: SitePreviewConfig
  mediaSequence?: Record<string, number>
  compareAttributesConfig?: Record<string, string[]>
  displayOosSwatch?: boolean
  isSuggestion?: boolean
  enableOneSite?: boolean
  enableFallbackPricing?: boolean
  cleanStateDisplayDiscountPercentage?: boolean
  fallbackHideDiscountRate?: boolean
  fallbackHideComparableValue?: boolean
  isSPC?: boolean
  isFPC?: boolean
  enforceEnglishUrl?: boolean
  imageSequenceIds?: string[]
  enableSwatchesOnVG?: boolean
  isEnableRatingOnPLP?: boolean
  maxPromoCalloutsDisplayPLP?: number
  isNewMegaPDP?: boolean
  enableFallbackOosFrp?: boolean
  forceFrpPricing?: boolean
  displayVideosInAltImage?: boolean
  enableEmplifi?: boolean
  imageVideoSequence?: string
  enableVideoInCarousel?: boolean
  categoryImageSequence?: string
}

export type NormalizedPlpBundleProduct = SapiProductData & {
  hitType: 'set'
  pageType: 'plp'
  bundlePromoCallout?: string
  prices: SearchPrices
}
