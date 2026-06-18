import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import {
  setReviewSectionNodeAtom,
  setSizingRangeAtom,
  setWidthRangeAtom,
  sizingRangeAtom,
  widthRangeAtom,
} from 'store/pdp.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import RatingsAndReviews from 'toro/components/product/mobile/v7/RatingsAndReviewsSection/RatingsAndReviews'
import useProductData from 'toro/hooks/useProductData'
import { parseProductId } from 'toro/helpers/productVariations'
import usePreference from 'toro/hooks/usePreference_new'

const RatingsAndReviewsSection = () => {
  const styles = useMultiStyleConfig('RatingsAndReviews')
  const setReviewSectionNode = useUpdateAtom(setReviewSectionNodeAtom)
  const sizingRange = useAtomValue(sizingRangeAtom)
  const setSizingRange = useUpdateAtom(setSizingRangeAtom)

  const widthRange = useAtomValue(widthRangeAtom)
  const setWidthRange = useUpdateAtom(setWidthRangeAtom)

  const [model, productId, masterID, id, custom, UPC, reviewsData, isHideReview] = useProductData([
    'custom.c_model',
    'masterId',
    'master.ID',
    'id',
    'custom',
    'UPC',
    'reviewsData',
    'custom.c_hideReview',
  ])

  const {
    powerReviews: { enableEmplifi },
  } = usePreference({
    powerReviews: ['enableEmplifi'],
  })

  const showRatingsAndReviews = !isHideReview && enableEmplifi

  const { masterId } = parseProductId(productId)

  const modelID = model || masterId || masterID

  const productData = { id, custom, UPC }

  if (!showRatingsAndReviews) {
    return null
  }

  return (
    <>
      <Box sx={styles.reviewsSectionRootWrapper}>
        <Box
          ref={setReviewSectionNode}
          id="ratings-review-section-v7"
          sx={styles.reviewsSectionWrapper}
        >
          <RatingsAndReviews
            modelID={modelID}
            productId={productId}
            sizingRange={sizingRange}
            widthRange={widthRange}
            setSizingRange={setSizingRange}
            setWidthRange={setWidthRange}
            productData={productData}
            reviewsData={reviewsData}
            variant={'adaptiveTabbedPDPV7'}
            hideWriteReviewCta={false}
          />
        </Box>
      </Box>
    </>
  )
}

export default withErrorBoundaryWrapper(RatingsAndReviewsSection)
