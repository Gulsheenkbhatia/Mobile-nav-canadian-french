import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import RecommendedItem from 'toro/components/Einstein/RecommendedItem'
import SplideSlider from 'toro/components/SplideSlider'

function DesktopRecommendationsCarousel({
  recommendationProductItems,
  recommendationSliderWrapper,
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
  sliderGap,
  styles,
}) {
  return (
    <Box
      as="div"
      sx={recommendationSliderWrapper}
      className="recommendSlider"
      data-qa={
        type === 'yaml' ? 'pdp_recommendation_section_wrapper' : 'pdp_recently_viewed_section'
      }
    >
      <SplideSlider
        options={{
          pagination: false,
          drag: true,
          lazyLoad: false,
          perPage: screenItemVisibleCount,
          perMove: 1,
          arrows: recommendationProductItems?.length > 4,
          gap: sliderGap,
        }}
        styles={{
          arrows: {
            transform: 'scale(2)',
            top: 'calc(50% - 32px)',
          },
          arrowPrev: { left: '-42px' },
          arrowNext: { right: '-54px' },
        }}
      >
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
                  styles,
                }}
              />
            </Box>
          )
        })}
      </SplideSlider>
    </Box>
  )
}

export default withErrorBoundaryWrapper(DesktopRecommendationsCarousel)
