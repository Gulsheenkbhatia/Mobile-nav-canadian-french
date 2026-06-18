export type Product = {
  ID: string
  parentproductid?: string
  name: string
  detailURL: string
  description: string
  imageURL: string
  price: {
    currency: string
    fullprice: string
    saleprice: string
    discountpercentage: string
  }
  AverageRating?: string
  ReviewCount?: string
  Availability?: string
  Color?: string
  RefinementColor?: string
  CategoryLevel1?: string
  CategoryLevel2?: string
  ProductType?: string
  PrimaryCategory?: string
  UPC?: string
  VariationIdV2?: string
  SizeFlag?: boolean
}

import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'

export type EnhancedRecommendationItemProps = {
  product: Product
  idx: number
  hidePrice: boolean
  addImpression: (payload: any) => void
  selectRecommItem?: (payload: any) => void | Promise<void>
  scheme: any
  label: string
  variant?: string
  onItemClick?: () => void
  isrecommTypeGrid?: boolean
  experienceId?: string
  vendor?: RecommendationVendors
}
