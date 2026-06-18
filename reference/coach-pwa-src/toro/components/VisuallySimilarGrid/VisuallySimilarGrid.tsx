import React, { useCallback, useState, useMemo } from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Grid from 'toro/components/Grid'
import Text from 'toro/components/Text'
import Lazy from 'toro/components/Lazy'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import RecommendationItemTile from 'toro/components/RecommendationItemTile'
import VisuallySimilarGridSkeleton from 'toro/components/VisuallySimilarGrid/VisuallySimilarGridSkeleton'
import useAnalyticsEventsRec from 'toro/components/RecommendationsContainer/useAnalyticsEventsRec'
import { RecommendationVendors } from 'toro/lib/vendorProductsAdapter/recommendations/configurations'
import useRecommendations from 'toro/hooks/useRecommendations'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import { XgenContainerID } from 'toro/lib/xgen'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePreference from 'toro/hooks/usePreference_new'
import { extractLookbookImage } from 'toro/components/product/ProductMediaArea/helpers'

interface VisuallySimilarGridProps {
  schema?: string
  gridColumns?: 2 | 3
}

const VisuallySimilarGrid: React.FC<VisuallySimilarGridProps> = ({
  schema = 'ymal',
  gridColumns = 2,
}) => {
  const styles = useMultiStyleConfig('VisuallySimilarGrid')
  const { formatMessage } = useIntl()

  const selectedVgId = useVariantGroupData('id')
  const { fetchRecommendations, data: recommendationsData, isLoading } = useRecommendations(schema)
  const [hasTriggeredFetch, setHasTriggeredFetch] = useState(false)
  const isLookbookActive = useExperiment(
    `${EXPERIMENTS.LOOKBOOK_BELOW_THE_FOLD_PDP}-${EXPERIMENTS.LOOKBOOK_VIDEO_WAYS_TO_WEAR}-${EXPERIMENTS.LOOKBOOK_VIDEO_WHAT_FITS_INSIDE}`
  )

  const {
    adaptiveExperience: { enableLookBook },
  } = usePreference({
    adaptiveExperience: ['enableLookBook'],
  })

  const handleVisibility = useCallback(
    (visible: boolean) => {
      if (visible && !hasTriggeredFetch && selectedVgId) {
        // Only trigger when VG ID is in normalized format (dashes, not spaces)
        if (selectedVgId.includes(' ')) return
        setHasTriggeredFetch(true)
        fetchRecommendations(selectedVgId)
      }
    },
    [hasTriggeredFetch, selectedVgId, fetchRecommendations]
  )

  const products = recommendationsData?.items || []
  const shouldUseLookbookPrioritization = isLookbookActive && enableLookBook?.imageAssets

  const processedProducts = useMemo(() => {
    if (!shouldUseLookbookPrioritization) return products

    return products.map((product) => {
      const [priorityImage] = extractLookbookImage(product.media, enableLookBook.imageAssets)

      if (!priorityImage) return product

      return {
        ...product,
        image: {
          aspectRatio: product.image.aspectRatio,
          src: priorityImage.src,
          alt: priorityImage.alt,
        },
      }
    })
  }, [products, shouldUseLookbookPrioritization, enableLookBook?.imageAssets])

  const label =
    recommendationsData?.containerDisplayName ||
    formatMessage({
      id: 'pdp.product.visuallySimilarTitle',
      defaultMessage: 'Visually Similar',
    })

  const analyticsEvents = useAnalyticsEventsRec({
    containerId: XgenContainerID.ymal,
    vendor: RecommendationVendors.XGEN,
    label,
    strategyId: 'ymal_grid',
  })

  if (!processedProducts.length && !isLoading && hasTriggeredFetch) {
    return null
  }

  return (
    <Lazy onVisible={handleVisibility}>
      {isLoading ? (
        <VisuallySimilarGridSkeleton gridColumns={gridColumns} />
      ) : processedProducts.length > 0 ? (
        <Box sx={styles.container}>
          <Box sx={styles.titleWrapper}>
            <Text as="h2" sx={styles.title}>
              {label}
            </Text>
          </Box>
          <Grid
            sx={gridColumns === 2 ? styles.gridContainer2Up : styles.gridContainer3Up}
            templateColumns={`repeat(${gridColumns}, minmax(0, 1fr))`}
          >
            {processedProducts.map((product, idx) => (
              <Box key={product.id || idx}>
                <RecommendationItemTile
                  idx={idx}
                  containerId={XgenContainerID.ymal}
                  strategyId="ymal_grid"
                  productItem={product}
                  analyticsEvents={analyticsEvents}
                  containerLabel={label}
                  vendor={RecommendationVendors.XGEN}
                  showSkeleton={false}
                  styleVariant="visuallySimilarGrid"
                />
              </Box>
            ))}
          </Grid>
        </Box>
      ) : null}
    </Lazy>
  )
}

export default VisuallySimilarGrid
