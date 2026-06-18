import PropTypes from 'prop-types'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { setReviewSectionNodeAtom } from 'store/pdp.atom'
import { useUpdateAtom } from 'jotai/utils'
import RatingsAndReviews from 'toro/components/product/RatingsAndReviews'

function LazyRatingsAndReviews({
  isDesktop,
  modelID,
  siteId,
  productId,
  sizingRange,
  widthRange,
  setSizingRange,
  setWidthRange,
  productData,
  reviewsData,
}) {
  const styles = useMultiStyleConfig('ProductDetailMainSection')
  const setReviewSectionNode = useUpdateAtom(setReviewSectionNodeAtom)

  return (
    <Box
      ref={setReviewSectionNode}
      id="ratings-review-section"
      className="content-divider"
      style={{
        minHeight: '243px', // minimal possible height for product with no reviews
      }}
      sx={styles.LazyRatingsAndReviews(isDesktop)}
    >
      <RatingsAndReviews
        modelID={modelID}
        siteId={siteId}
        productId={productId}
        sizingRange={sizingRange}
        widthRange={widthRange}
        setSizingRange={setSizingRange}
        setWidthRange={setWidthRange}
        productData={productData}
        reviewsData={reviewsData}
      />
    </Box>
  )
}

LazyRatingsAndReviews.propTypes = {
  isDesktop: PropTypes.bool,
  modelID: PropTypes.string,
  siteId: PropTypes.string,
  productId: PropTypes.string,
  sizingRange: PropTypes.number,
  widthRange: PropTypes.number,
  setSizingRange: PropTypes.func,
  setWidthRange: PropTypes.func,
  productData: PropTypes.object,
}

LazyRatingsAndReviews.defaultProps = {
  siteId: '',
  sizingRange: 0,
  widthRange: 0,
  productData: {},
}

export default withErrorBoundaryWrapper(LazyRatingsAndReviews)
