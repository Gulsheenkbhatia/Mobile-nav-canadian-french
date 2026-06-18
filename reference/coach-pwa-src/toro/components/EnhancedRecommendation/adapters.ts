import { XgenContainerID, type XgenContainer } from 'toro/lib/xgen/types'
import type { Product } from 'toro/components/EnhancedRecommendation/EnhancedRecommendationItem/types'
import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'

export type EnhancedRecommendationScheme = {
  scheme: string
  display: string
  experience_id: string
  explanation?: string
  items?: Product[]
  vendor?: RecommendationVendors
}

const IMAGE_SUFFIXES: Partial<Record<XgenContainerID, string>> = {
  [XgenContainerID.productlisting7_rr]: '$YMALPDPLarge$',
} as const

const resolveImageSuffixUrl = (
  imageUrl: Product['imageURL'],
  xgenContainerId: XgenContainerID
): Product['imageURL'] => {
  const suffix = IMAGE_SUFFIXES[xgenContainerId]
  return suffix ? `${imageUrl}?${suffix}` : imageUrl
}

/**
 * Transforms XGEN container data to match structure expected by EnhancedRecommendation components
 * @param xgenContainer - Container from XGEN API response containing products and metadata
 * @param type - Scheme type identifier for the recommendation
 * @returns Transformed data compatible with EnhancedRecommendation
 */
export const adaptXgenToEnhancedRecommendation = (
  xgenContainer: XgenContainer,
  type: string
): EnhancedRecommendationScheme => ({
  scheme: type,
  display: 'true',
  experience_id: xgenContainer.strategyId,
  explanation: xgenContainer.containerDisplayName || '',
  vendor: RecommendationVendors.XGEN,
  items: xgenContainer.items.map(
    (product): Product => ({
      ID: product.id || product.variationGroupId,
      parentproductid: product.masterId || product.id,
      name: product.name,
      detailURL: product.detailUrl,
      description: product.description,
      imageURL: resolveImageSuffixUrl(product.imageUrl, xgenContainer.containerId),
      price: {
        currency: product.price?.currency || '$',
        fullprice: String(product.price?.fullPrice || 0),
        saleprice: String(product.price?.salePrice || product.price?.fullPrice || 0),
        discountpercentage: String(product.price?.discountPercentage || 0),
      },
      AverageRating: String(product.averageRating || 0),
      ReviewCount: String(product.reviewCount || 0),
      Availability: String(product.availability || 0),
      Color: product.color || '',
      RefinementColor: product.colorVal || product.color || '',
      CategoryLevel1: product.categoryLevel1 || '',
      CategoryLevel2: product.categoryLevel2 || '',
      ProductType: product.primaryCategory || '',
      PrimaryCategory: product.primaryCategory || '',
      UPC: product.upc || '',
      VariationIdV2: product.variationId || product.id,
      SizeFlag: product.isSized || false,
    })
  ),
})
