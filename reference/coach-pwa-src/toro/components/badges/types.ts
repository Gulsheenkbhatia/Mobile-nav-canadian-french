import {
  badgeTypes,
  badgeTypesOnImage,
  badgeTypesUnderCTA,
} from 'toro/components/badges/constants/badgeTypes'
import { DetailedProduct, ListingProduct, RecommendationProduct } from 'toro/types/productTypes'

export type ValidBadgeID =
  | typeof badgeTypes[keyof typeof badgeTypes]
  | typeof badgeTypesOnImage[keyof typeof badgeTypesOnImage]
  | typeof badgeTypesUnderCTA[keyof typeof badgeTypesUnderCTA]

export type PageTypeLc = 'pdp' | 'plp' | 'minicart'

export type ProductForBadges = Partial<ListingProduct | DetailedProduct | RecommendationProduct> & {
  activeColor?: string
}

export type MarketingConfType = 'Badge' | 'Message'
