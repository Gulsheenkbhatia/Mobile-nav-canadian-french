import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import RecommendedItem from 'toro/components/Einstein/RecommendedItem'

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
  type,
  screenItemVisibleCount,
  scheme,
  variant,
  styles,
}) {
  return (
    <Box
      maxW="100vw"
      className="mob-recommend"
      data-qa={
        type === 'yaml' ? 'pdp_recommendation_section_wrapper' : 'pdp_recently_viewed_section'
      }
      sx={styles.mobileRecommendationWrapper}
    >
      <Flex maxWidth="100vw" sx={styles.mobileRecommendationItems} className="mob-recommend-items">
        {recommendationProductItems?.map?.((product, idx) => {
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
      </Flex>
    </Box>
  )
}

export default withErrorBoundaryWrapper(MobileRecommendationCarousel)
