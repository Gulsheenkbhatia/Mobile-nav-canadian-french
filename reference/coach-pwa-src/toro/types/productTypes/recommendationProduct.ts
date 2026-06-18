import type { BaseProduct } from 'toro/types/productTypes/baseProduct'
import type { PricingInfo, MediaThumbnail, ProductVariant } from 'toro/types/productTypes/common'

export interface RecommendationProduct extends Omit<BaseProduct, 'variants'> {
  price?: number | string
  thumbnail?: MediaThumbnail
  isEnableFitReviewLink?: boolean
  quantity?: number
  availability?: boolean
  variants?: RecommendationProduct[] | ProductVariant[]
  variantsOnSale?: Array<{
    id: string
    onSale: boolean
    price?: PricingInfo | PricingInfo[]
  }>
  ID?: string
  VariationIdV2?: string
  SizeFlag?: boolean
}
