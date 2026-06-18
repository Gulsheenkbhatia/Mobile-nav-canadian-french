import type { XgenContainer } from 'lib/xgen'
import type { LoveAtFirstSwipeResponse } from 'toro/components/LoveAtFirstSwipe/types'
import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'

export const mapXgenToLoveAtFirstSwipeResponse = (
  container: XgenContainer
): LoveAtFirstSwipeResponse => {
  return {
    experience_id: container.strategyId,
    display: container.display,
    items: container.items.map((product) => ({
      ID: product.id || product.variationGroupId,
      name: product.name,
      detailURL: product.detailUrl,
      imageURL: product.imageUrl ? `${product.imageUrl.split('?')[0]}?$productTile-4-5-m$` : '',
      price: {
        currency: product.price?.currency || '$',
        fullprice: String(product.price?.fullPrice || 0),
        saleprice: String(product.price?.salePrice || product.price?.fullPrice || 0),
        discountpercentage: String(product.price?.discountPercentage || 0),
      },
      vendor: RecommendationVendors.XGEN,
    })),
  }
}
