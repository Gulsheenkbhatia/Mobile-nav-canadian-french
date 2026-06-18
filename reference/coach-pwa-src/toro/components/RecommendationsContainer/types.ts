import { RecommendationVendors } from 'toro/lib/vendorProductsAdapter/recommendations/configurations'
import type { ProductItem } from 'toro/types'
import { ReactNode } from 'react'
import { SystemStyleObject } from '@chakra-ui/react'

export type ResponseRecommendations = {
  items: ProductItem[]
  vendor: RecommendationVendors
  containerDisplayName: string
  containerId: string
  strategyId: string
}

export type RecommendationsBlockProps = {
  children: ReactNode
  variant?: 'baseStyle' | 'aeDrawer' | 'recomCarouselThink' | 'recommendationsStack'
}

export type AnalyticsEvents = {
  onTileClick: (product: ProductItem, idx: number, overrides?: Record<string, any>) => void
  onTileVisible: (product: ProductItem, idx: number, overrides?: Record<string, any>) => void
  onAddToWishlistSuccess: (product: ProductItem, idx: number) => void
  onRemoveFromWishlistSuccess: (product: ProductItem, idx: number) => void
  onLinkClick: (product: ProductItem, idx: number) => void
}

export interface RecommendationStyles {
  baseRecommendationTitle?: SystemStyleObject
  [key: string]: SystemStyleObject | undefined
}
