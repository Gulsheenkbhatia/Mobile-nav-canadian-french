import { memo, useState } from 'react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Link from 'toro/components/Link'
import RecommendationPrice from 'toro/components/Certona/RecommendationPrice'
import { getRelativeUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import AddToBagButton from 'toro/components/AddToBagButton'
import DesktopCollapsibleATBButton from 'toro/components/DesktopCollapsibleRVCarousel/DesktopCollapsibleATBButton'
import type { RecentlyViewedProduct } from 'toro/hooks/useRecentlyViewedData'

type CollapsibleItemProps = {
  product: RecentlyViewedProduct
  idx: number
  scheme: string
  experienceId: string
  title: string
  styles: any
  addImpression: (payload: any) => void
  selectRecommItem: (payload: any) => Promise<void>
  showATBBelow?: boolean
  recommendationVariant?: string
}

const CollapsibleItem = memo(
  ({
    product,
    idx,
    scheme,
    experienceId,
    title,
    styles,
    addImpression,
    selectRecommItem,
    showATBBelow = false,
    recommendationVariant,
  }: CollapsibleItemProps) => {
    const [isATBButtonDisabled, setIsATBButtonDisabled] = useState(false)

    const onTileVisible = () => {
      addImpression({
        listName: title,
        product: { ...product, is_quick_add: isATBButtonDisabled ? '0' : '1' },
        idx,
        certonaScheme: scheme,
        recAIType: product.vendor,
        sendOnceInViewport: true,
      })
    }

    const onLinkClick = async () => {
      selectRecommItem({
        listName: title,
        product: { ...product, is_quick_add: isATBButtonDisabled ? '0' : '1' },
        idx,
        eventLocation: scheme,
        recAIType: product.vendor,
      })
    }

    return (
      <ImpressionSensor
        key={`product-${product?.ID}`}
        payload={{ idx, product }}
        onVisible={onTileVisible}
        threshold={1}
        rootMargin={'0px'}
        className="rvImpressionSensor"
      >
        <Box sx={styles.productTile} position="relative">
          <Box sx={styles.imageContainer}>
            {!showATBBelow && (
              <AddToBagButton
                variantId={product.variationId}
                variantGroupId={product.ID}
                isSizedProduct={product.isSized}
                analyticsData={{
                  experienceId,
                  eventLocation: scheme,
                  recAIType: product.vendor,
                  containerLabel: title,
                  sendSelectItemFirst: true,
                }}
                styleVariant="collapsibleRVOverlay"
                setIsATBButtonDisabled={setIsATBButtonDisabled}
              />
            )}
            <Link
              key={product.detailURL}
              href={getRelativeUrl(product.detailURL)}
              onClick={onLinkClick}
            >
              <Image
                key={product.imageURL}
                src={product.imageURL}
                noMinW
                noMinH
                sx={styles.productImage}
                data-qa="RV_collapsible_tile_link_pt_img"
              />
            </Link>
          </Box>
          <Link
            key={`price-${product.detailURL}`}
            href={getRelativeUrl(product.detailURL)}
            onClick={onLinkClick}
          >
            <Box sx={styles.priceContainer}>
              <RecommendationPrice
                product={product}
                scheme={scheme}
                variant={recommendationVariant ?? 'RVRecommendationsItem'}
                hidePrice={false}
              />
            </Box>
            {product.promotions?.map(({ type, content }) => (
              <Box
                key={type}
                sx={styles.promoContent}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ))}
          </Link>
          {showATBBelow && (
            <DesktopCollapsibleATBButton
              variantId={product.variationId}
              variantGroupId={product.ID}
              isSizedProduct={product.isSized}
              analyticsData={{
                experienceId,
                eventLocation: scheme,
                recAIType: product.vendor,
                containerLabel: title,
                sendSelectItemFirst: true,
              }}
              styles={styles.atbButton}
              setIsATBButtonDisabled={setIsATBButtonDisabled}
            />
          )}
        </Box>
      </ImpressionSensor>
    )
  }
)

CollapsibleItem.displayName = 'CollapsibleItem'

export default CollapsibleItem
