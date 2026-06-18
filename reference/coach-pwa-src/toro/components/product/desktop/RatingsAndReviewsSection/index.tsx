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
import RatingsAndReviews from 'toro/components/product/RatingsAndReviews'
import useProductData from 'toro/hooks/useProductData'
import { parseProductId } from 'toro/helpers/productVariations'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'
import WriteReviewSection, {
  useIsWriteReviewSectionVisible,
} from 'toro/components/product/mobile/RatingsAndReviewsSection/WriteReviewSection'

const RatingsAndReviewsSection = () => {
  const { isMobile } = useViewportType()
  const styles = useMultiStyleConfig('RatingsAndReviews', {
    variant: isMobile ? 'adaptiveTabbedPDP' : 'pdpV5',
  })
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

  const isWriteReviewSectionVisible = useIsWriteReviewSectionVisible()

  if (!showRatingsAndReviews) {
    return null
  }

  return (
    <>
      {isWriteReviewSectionVisible && <WriteReviewSection />}
      <Box sx={styles.reviewsSectionRootWrapper}>
        <Box
          ref={setReviewSectionNode}
          id="ratings-review-section"
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
            variant={isMobile ? 'adaptiveTabbedPDP' : 'pdpV5'}
            hideWriteReviewCta={isWriteReviewSectionVisible}
          />
        </Box>
      </Box>
    </>
  )
}

export default withErrorBoundaryWrapper(RatingsAndReviewsSection)
