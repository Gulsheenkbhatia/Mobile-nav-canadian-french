import Box from 'toro/components/Box'
import Grid from 'toro/components/Grid'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import RecommendedItem from 'toro/components/Einstein/RecommendedItem'

function DesktopRecommendationsGrid({
  recommendationProductItems,
  styles,
  screenItemVisibleCount,
  ...props
}) {
  return (
    <Grid sx={styles.recommendationGrid} data-qa="recommendations-section">
      {recommendationProductItems?.map?.((product, idx) => (
        <Box key={product?.id}>
          <RecommendedItem
            {...{
              ...props,
              product,
              idx,
              visibleItemsOnViewPort: screenItemVisibleCount,
              styles,
            }}
          />
        </Box>
      ))}
    </Grid>
  )
}

export default withErrorBoundaryWrapper(DesktopRecommendationsGrid)
