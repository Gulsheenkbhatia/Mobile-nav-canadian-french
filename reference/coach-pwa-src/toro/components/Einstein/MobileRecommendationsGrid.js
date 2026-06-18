import { useState, useMemo } from 'react'
import Grid from 'toro/components/Grid'
import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import RecommendedItem from 'toro/components/Einstein/RecommendedItem'
import {
  RECOMMENDATIONS_HYBRID_TOTAL_PRODUCTS_COUNT,
  RECOMMENDATIONS_HYBRID_PRODUCTS_COUNT,
} from 'toro/constants/adaptiveExperience'
import Button from 'toro/components/Button'
import { useIntl } from 'react-intl'
import useAnalytics from 'toro/analytics/useAnalytics'

function MobileRecommendationCarousel({
  recommendationProductItems,
  viewport,
  siteId,
  handleClickReco,
  hidePrice,
  label,
  addImpression,
  addToWishlistRecommItem,
  handleViewReco,
  screenItemVisibleCount,
  scheme,
  variant,
  productId,
  styles,
}) {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const [visibleProductsCount, setVisibleProductsCount] = useState(
    RECOMMENDATIONS_HYBRID_PRODUCTS_COUNT
  )
  const visibleProducts = useMemo(
    () => recommendationProductItems?.slice(0, visibleProductsCount),
    [recommendationProductItems, visibleProductsCount]
  )
  const handleLoadMoreClick = () => {
    setVisibleProductsCount((prev) => prev + RECOMMENDATIONS_HYBRID_PRODUCTS_COUNT)
    analytics.send('productInteraction', {
      eventAction: 'load more products click',
      eventLabel: productId,
      eventLocationForced: scheme,
    })
  }

  return (
    <>
      <Grid
        maxWidth="100vw"
        sx={styles.mobileRecommendationItems}
        className="mob-recommend-items"
        data-qa="pdp_recommendation_section_wrapper"
      >
        {visibleProducts?.map?.((product, idx) => {
          return (
            <Box key={product?.id}>
              <RecommendedItem
                {...{
                  product,
                  idx,
                  viewport,
                  siteId,
                  handleClickReco,
                  hidePrice,
                  label,
                  addImpression,
                  addToWishlistRecommItem,
                  handleViewReco,
                  visibleItemsOnViewPort: screenItemVisibleCount,
                  scheme,
                  variant,
                  styles,
                }}
              />
            </Box>
          )
        })}
      </Grid>
      {visibleProductsCount < recommendationProductItems?.length &&
        visibleProductsCount < RECOMMENDATIONS_HYBRID_TOTAL_PRODUCTS_COUNT && (
          <Button
            className="einsteinLoadMore"
            onClick={handleLoadMoreClick}
            sx={styles.loadMoreProductButton}
          >
            {formatMessage({
              id: 'pdp.product.loadMoreProductsBtn',
              defaultMessage: 'LOAD MORE PRODUCTS',
            })}
          </Button>
        )}
    </>
  )
}

export default withErrorBoundaryWrapper(MobileRecommendationCarousel)
