import type {
  VariantGroupData,
  PricingInfo,
  InventoryInfo,
  CustomAttributes,
  MarketingConfig,
  MediaImage,
  DefaultColorInfo,
  Color,
  Size,
  ProductVariant,
  Width,
  PromoTextItem,
  PromotionDataShape,
} from 'toro/types/productTypes/common'
import type { ProductHitType } from 'toro/types/productTypes/apiProductTypes'
import type { NormalizedMedia, NormalizedPromoData } from 'toro/types/productTypes/normalizers'
import type { ContentAssetSlotConfig } from 'toro/types/contentAsset'

export type HeroGalleryImageRow = {
  order?: number
  tabLabel?: string
  type?: undefined
  asset_suffix: string
  assetUrl?: never
}

export type HeroGalleryVideoRow = {
  order?: number
  tabLabel?: string
  type: 'video'
  assetUrl: string
  asset_suffix?: never
}

export type HeroGalleryRow = HeroGalleryImageRow | HeroGalleryVideoRow

export interface BaseProduct {
  id: string
  productId?: string
  masterId?: string
  name: string
  brand?: string
  url: string
  media?: NormalizedMedia
  hitType?: ProductHitType
  validFrom?: string
  validTo?: string
  canonicals?: Record<string, string>
  prices?: PricingInfo | PricingInfo[]
  pricingInfo?: PricingInfo[]
  inventory?: InventoryInfo
  custom?: CustomAttributes
  variationValues?: {
    color?: string
    size?: string
  }
  productType?: {
    [key: string]: boolean
  }
  colors?: Color[]
  sizes?: Size[] | string[]
  defaultColor?: DefaultColorInfo | Color
  variants?: ProductVariant[]
  variationGroup?: VariantGroupData[]
  hideDiscountedRate?: boolean
  hideComparablePriceValue?: boolean
  isBundleProduct?: boolean
  isProductSet?: boolean
  isPdpV5Applicable?: boolean
  isServerSide?: boolean
  promotionPrice?: PricingInfo[]
  promoPDP?: NormalizedPromoData | null
  promoPLP?: NormalizedPromoData | NormalizedPromoData[] | null
  marketingBadgeConf?: MarketingConfig | null
  marketingMessageConf?: MarketingConfig | null
  marketingBadge?: string
  marketingMessage?: string
  video?: string | null
  imageGroups?: {
    images: MediaImage[]
    viewType: string
  }[]
  miniCartPromoText?: PromoTextItem[] | null
  widths?: Width[]
  megaPDPEligibleOptions?: {
    isMegaPDPEligible?: boolean
    isNewMegaPDPEligible?: boolean
  }
  defaultVariantGroup?: {
    customAttributes?: CustomAttributes
    marketingBadgeConf?: MarketingConfig | null
    marketingMessageConf?: MarketingConfig | null
    pricingInfo?: PricingInfo[]
  }
  master?: {
    ID?: string
    masterId?: string
    defaultVariantID?: string
    defaultVariantGroupID?: string
    customAttributes?: Record<string, string | number | boolean>
    custom?: CustomAttributes
    marketingBadgeConf?: MarketingConfig | null
    marketingMessageConf?: MarketingConfig | null
    sourceCodeBadge?: ContentAssetSlotConfig[]
    sourceCodeMessage?: ContentAssetSlotConfig[]
    validFrom?: string
    validTo?: string
    hitType?: ProductHitType
  }
  pickedProps?: {
    variationValues?: {
      color?: string
    }
    currency?: string
    promotionData?: PromotionDataShape
    upc?: string
    validFrom?: string
    validTo?: string
    inventory?: InventoryInfo
    productPromotions?: Array<{
      calloutMsg?: string
      promotionId?: string
    }>
    hitType?: string
    c_size?: string
  }
  isAiDriven?: boolean
  isTopRated?: boolean
  isNewArrival?: boolean
  variationGroupData?: {
    custom?: CustomAttributes
    inventory?: InventoryInfo
    marketingBadgeConf?: MarketingConfig | null
    marketingMessageConf?: MarketingConfig | null
  }
  /** PDP spec grid (values normalized from `<br>` in `normalizeProduct`). */
  productSpecs?: Array<{ label?: string; icon?: string; values?: string[] }>
  /** Hero angle tabs; see `useHeroGalleryEntries` in `helpers/heroGallery`. */
  heroGalleryData?: HeroGalleryRow[]
}
