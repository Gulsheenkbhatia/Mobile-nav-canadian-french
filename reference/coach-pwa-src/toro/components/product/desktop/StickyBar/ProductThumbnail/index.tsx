import { memo } from 'react'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import useProductData from 'toro/hooks/useProductData'
import ProductTitleBadge from 'toro/components/product/desktop/StickyBar/ProductTitleBadge'
import StarReviewRating from 'toro/components/product/desktop/StickyBar/StarReviewRating'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'

const StickyBarProductThumbnail = () => {
  const name = useProductData('name')
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const styles = useStyleConfig('StickyBar', {
    variant: isSubBrandActive ? 'coachtopia' : null,
  })

  return (
    <Flex sx={styles.stickyBarProductThumbnail} className="sticky-product-info-wrapper">
      <Box>
        <Flex sx={styles.stickyBarProductThumbnailRatingBadge}>
          <StarReviewRating />
          <Box
            sx={styles.stickyBarProductTitleBadge}
            className="sticky-bar-badge"
            data-qa="pdp_txt_badge"
          >
            <ProductTitleBadge />
          </Box>
        </Flex>
        <Box
          as="p"
          sx={styles.stickyBarProductThumbnailHeader}
          data-qa="pdp_txt_pdt_title"
          className="product-thumbnail-name"
        >
          {name}
        </Box>
      </Box>
    </Flex>
  )
}
export default memo(StickyBarProductThumbnail)
