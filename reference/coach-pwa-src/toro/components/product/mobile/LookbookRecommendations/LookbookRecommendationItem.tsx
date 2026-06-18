import type { FC } from 'react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Text from 'toro/components/Text'
import type { ProductItem } from 'toro/types'
import { getImages } from 'toro/components/product/mobile/LookbookRecommendations/helpers'
import ProductItemPrice from 'toro/components/ProductItemTile/ProductItemPrice'
import Link from 'toro/components/Link'
import useStyles from 'toro/hooks/useStyles'
import AddToBagButton from 'toro/components/AddToBagButton'
import { recAITypes } from 'toro/analytics/useRecommAnalytics'

type LookbookRecommendationItemProps = {
  data: ProductItem
  containerLabel: string
  strategyId: string
  containerId: string
  vendor: keyof typeof recAITypes
  hideATBIcon?: boolean
}

const LookbookRecommendationItem: FC<LookbookRecommendationItemProps> = ({
  data,
  containerId,
  strategyId,
  containerLabel,
  vendor,
  hideATBIcon = false,
}) => {
  const styles = useStyles()
  const images = getImages(data.media)

  return (
    <Link href={data.url} prefetch sx={styles.itemRootWrapper}>
      <Box sx={styles.itemImageWrapper}>
        {images.map((image) => {
          return <Image key={image.src} src={image.src} alt={image.alt} sx={styles.itemImage} />
        })}
      </Box>
      <Box sx={styles.itemDetailsWrapper}>
        <Text sx={styles.itemTitle}>{data.name}</Text>
        <ProductItemPrice {...data.price} />
        {data.displayAtb && (
          <AddToBagButton
            styleVariant="lookbookRecommendations"
            variantId={data.variationId}
            variantGroupId={data.variationGroupId}
            isSizedProduct={data.isSized}
            isMobileOnly
            analyticsData={{
              containerLabel,
              experienceId: strategyId,
              eventLocation: containerId,
              recAIType: vendor,
            }}
            hideIcon={hideATBIcon}
          />
        )}
      </Box>
    </Link>
  )
}

export default LookbookRecommendationItem
