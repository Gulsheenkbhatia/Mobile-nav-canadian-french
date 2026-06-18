import type {
  ProductReachVariants,
  SapiPromotionCallout,
} from 'toro/types/productTypes/apiProductTypes'
import type {
  VariationAttribute,
  PricingInfo,
  InventoryInfo,
  MarketingConfigItem,
  OrderableAttributes,
} from 'toro/types/productTypes/common'
import type { BaseProduct } from 'toro/types/productTypes/baseProduct'

export interface MinProduct extends BaseProduct {
  category_id: string
  item_category: string
  activeColor?: string
  defaultVariant?: {
    pricingInfo: PricingInfo[]
    variationAttributes?: OrderableAttributes
    displayBopisCTA?: boolean
    customAttributes?: {
      c_megaPDPStyleGroup?: string
    }
  }
  minData?: {
    minicartPropValues: OrderableAttributes
  }
}

export interface MinProductRaw extends BaseProduct {
  ID: string
  prices?: PricingInfo[]
  pricingInfo?: PricingInfo[]
  imageURL?: string
  prodUrl?: string
  prodName?: string
  inventoryInfo?: InventoryInfo
  variationAttributes: VariationAttribute[]
  category_id: string
  item_category: string
  masterId: string
  brand: string
  isNew: boolean
  avgRatingEmplifi: string
  revCountEmplifi: string
  validFrom: string
  validTo: string
  variationGroupCount?: number
  upc: string
  size?: string
  width?: string
  widthVal?: string
  isOutlet?: boolean
  isFinalSale?: boolean
  maxSalePercent?: number
  hideComparablePriceValue?: boolean
  isGiftCardProduct?: boolean
  isCoachtopia?: boolean
  isCustomizable?: boolean
  isMonogrammable?: boolean
  displayBopisCTA?: boolean
  defaultVariantGroupID?: string
  badgeData?: BadgeData
  item_style_group?: string
  isMegaPDPEligible?: boolean
  isAlmostGone?: boolean
  inventoryThreshold?: number
  productReach?: ProductReachVariants | null
  productVertical?: string | null
  promotionalCallouts?: SapiPromotionCallout[]
}

export interface BadgeData {
  marketingBadge?: string
  marketingMessage?: string
  marketingBadgeJson?: MarketingConfigItem[]
  marketingMessageJson?: MarketingConfigItem[]
}
