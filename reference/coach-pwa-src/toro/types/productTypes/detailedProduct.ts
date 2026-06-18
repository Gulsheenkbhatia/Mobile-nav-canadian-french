import type { RecommendationProduct } from 'toro/types/productTypes/recommendationProduct'
import type { BaseProduct } from 'toro/types/productTypes/baseProduct'
import type {
  ProductVariant,
  VariantGroupData,
  Color,
  CustomAttributes,
  PromotionDataShape,
  MarketingConfig,
  MaterialInfo,
  NewMegaPDPGroupData,
  NewMegaPDPTabsData,
  PricingInfo,
  CustomizerData,
  FAQItemWithContent,
} from 'toro/types/productTypes/common'
import { ReviewData } from 'toro/components/product/RatingsAndReviews/ReviewsList/types'

export interface DetailedProduct extends BaseProduct {
  title?: string
  selectedVariantId?: string
  selectedVariantData?: ProductVariant
  selectedVariantGroupId?: string
  selectedVariantGroupData?: VariantGroupData
  selectedColor?: Color
  reviewsData?: ReviewData
  item_category?: string | string[]
  imageEditorialCopy?: Record<string, CustomAttributes>
  defaultVariant?: ProductVariant | null
  defaultVariantGroup?: VariantGroupData
  variant?: ProductVariant[]
  promotionData?: PromotionDataShape
  pricingDisplayTemplate?: string | null
  promoText?: string[] | null
  availableColorsNumber?: number | null
  whatFitsInside?: string[]
  masterProductData?: DetailedProduct
  groupedColors?: Partial<Record<string, Color[]>>
  materialList?: MaterialInfo[]
  preSelectMaterial?: MaterialInfo
  newMegaPDPGroupData?: NewMegaPDPGroupData
  newMegaPDPTabsData?: NewMegaPDPTabsData
  selectedTabsData?: { tabId: string; name: string }[]
  setId?: string
  sizeChartID?: string
  formattedPricing?: PricingInfo[]
  description?: string
  longDescription?: string
  shortDescription?: string
  recommendations?: {
    similar?: RecommendationProduct[]
    accessories?: RecommendationProduct[]
  }
  marketingConfig?: MarketingConfig
  UPC?: string
  compareAttributesConfig?: CompareAttributesConfig
  customizerData?: CustomizerData
  productName?: string
  bundleProductData?: Array<Record<string, unknown>>
  defaultVariantData?: {
    pickedProps?: {
      promotionData?: {
        offers?: {
          priceValidUntil?: string
        }
      }
    }
  }
  defaultVariationGroupData?: {
    pickedProps?: {
      promotionData?: {
        offers?: {
          priceValidUntil?: string
        }
      }
    }
  }
  similarProducts?: Array<Record<string, unknown>>
  categoryData?: {
    parentCategoryTree?: Array<Record<string, unknown>>
  }
  faqData?: Array<FAQItemWithContent>
  productDetails?: ProductDetailItem[]
  set?:
    | {
        pricingInfo?: Array<{
          sales?: {
            currency?: string
            value?: number
          }
        }>
      }
    | Record<string, unknown>
  pageDescription?: string
}

export type CompareAttributesConfig = Record<string, string[]>

export interface ProductDetailItem {
  label: string
  values: string | string[]
}
