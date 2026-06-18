import type { InventoryInfo } from 'toro/types/productTypes'

declare interface ProductItem {
  id: string
  masterId: string
  variationId: string
  variationGroupId: string
  url: string
  image: Image
  name?: string
  media?: ProductMediaItem[]
  category?: string
  price?: Price
  promotions?: Promotion[]
  inventory?: ItemInventory
  review?: { rating: number; total: number }
  badges?: { id: string; content: string }
  isSized: boolean
  isMemberExclusive?: boolean
  allowSaving?: boolean
  displayAtb?: boolean
  ctsButton?: string
}

declare interface ProductItemWithVariants extends ProductItem {
  variants: Variant[]
}

export type ProductMediaItem =
  | (Image & { type: 'image'; isLookbookImage?: boolean })
  | (Video & { type: 'video' })

type Image = {
  src: string
  alt: string
  aspectRatio?: number
}

type Price = {
  value: string
  sale: boolean
  comparable?: string
  strikeoff?: string
  discount?: string
  variant?: string
}

type Promotion = {
  type: string
  content: string
}

type Video = {
  url: string
  thumbnail?: string
}

type VariantAttributes = 'id' | 'masterId' | 'image' | 'media' | 'url' | 'name' | 'inventory'

type Variant = Pick<ProductItem, VariantAttributes> & {
  isOrderable: boolean
  isDefault: boolean
}

type ItemInventory = Omit<InventoryInfo, 'allocationResetDate' | 'inStockDate' | 'perpetual'> & {
  maxQuantity: number
}

declare interface PageTypeFlags {
  isHP: boolean
  isPLP: boolean
  isPDP: boolean
  isSRP: boolean
  isContentPage: boolean
  isProductPassport: boolean
  isRetailHP: boolean
  isSubHP: boolean
  isOutletHP: boolean
  isShopBy?: boolean
}
