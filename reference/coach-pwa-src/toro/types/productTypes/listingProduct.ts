import type { SearchPrices } from 'toro/search'
import type { BaseProduct } from 'toro/types/productTypes/baseProduct'
import type {
  CustomAttributes,
  MarketingConfig,
  MarketingConfigItem,
  PromotionDataShape,
  InventoryInfo,
  MediaThumbnail,
  PricingInfo,
  VariationAttribute,
  ProductVariant,
} from 'toro/types/productTypes/common'
import type { TemplatePerDevice } from 'toro/constants/templates'

export enum PriceTemplate {
  SinglePrice = 'singlePriceTemplate',
  Comparable = 'comparableTemplate',
  Discount = 'discountTemplate',
  FullPriceComparable = 'fullPriceComparableTemplate',
  Strikeoff = 'strikeoffPriceTemplate',
  FullPrice = 'fullPriceTemplate',
}

export interface ListingProduct extends BaseProduct {
  firstVariant?: string
  variant?: ProductVariant[]
  isBundleVariant?: boolean
  basketInfo?: {
    c_isBundleProductLineItem?: boolean
  }
  pricingDisplayTemplate?: PriceTemplate | null
  enableSwatches?: boolean
  showRatings?: boolean
  pageType?: string
  masterCustom?: CustomAttributes
  cells?: number[]
  sourceCodeBadge?: string[] | MarketingConfigItem[] | string | null
  sourceCodeMessage?: string[] | MarketingConfigItem[] | string | null
  bundlePromoCallout?: string
  activeProductData?: {
    bestseller?: boolean
  }
  defaultVariant?: {
    ID?: string
    productId?: string
    prices?: PricingInfo | PricingInfo[] | SearchPrices
    variationValues?: {
      color?: string
    }
    customAttributes?: CustomAttributes
  }
  masterProductData?: {
    custom?: CustomAttributes
    inventory?: InventoryInfo
    marketingBadgeConf?: MarketingConfig | null
    marketingMessageConf?: MarketingConfig | null
    validFrom?: string
    pickedProps?: {
      currency?: string
    }
  }
  masterPromotionPrice?: {
    ID?: string
    enableSwatchesOnVG?: boolean
    price?: PricingInfo[]
  } | null
  c_ProductSetbadgingData?: {
    soldOutBadge?: {
      soldOutCallOutMessage?: string
    }
  }
  promotionData?: PromotionDataShape
  thumbnail?: MediaThumbnail
  variantsOnSale?: Array<{
    id: string
    onSale: boolean
    price?: PricingInfo | PricingInfo[]
  }>
  isEnableFitReviewLink?: boolean
  quantity?: number
  availability?: boolean
  ID?: string
  VariationIdV2?: string
  SizeFlag?: boolean
  variationAttributes?: VariationAttribute[]
  templates?: TemplatePerDevice
}
