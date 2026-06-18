import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'

export interface LoveAtFirstSwipeProduct {
  ID: string
  name: string
  imageURL: string
  detailURL: string
  price: {
    currency: string
    fullprice: string
    saleprice: string
    discountpercentage: string
  }
  vendor: RecommendationVendors.XGEN
}

export interface LoveAtFirstSwipeResponse {
  experience_id: string
  display: boolean
  items: LoveAtFirstSwipeProduct[]
}
