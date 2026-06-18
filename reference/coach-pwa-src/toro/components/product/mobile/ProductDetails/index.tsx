import useStyleConfig from 'toro/hooks/useStyleConfig'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import ProductName from 'toro/components/product/mobile/ProductDetails/ProductName'
import ProductPrice from 'toro/components/product/desktop/ProductPrice'
import StarReviewRating from 'toro/components/product/desktop/StickyBar/StarReviewRating'
import Template from 'toro/components/Template'
import { TemplateName } from 'toro/constants/templates'
import PriceCallout from 'toro/components/product/desktop/PriceCallout'

const ProductDetails = () => {
  const styles = useStyleConfig('ProductDetailsStyles')

  return (
    <Box sx={styles.productDetailsWrapper}>
      <Flex sx={styles.productDetailsHeaderRow}>
        <Box className="product-name-price-container">
          <ProductName />
          <ProductPrice />
        </Box>
        <StarReviewRating iconWidth="9.5px" iconHeight="9.5px" />
      </Flex>
      <Template forIDs={[TemplateName.pdpv6]}>
        <PriceCallout />
      </Template>
    </Box>
  )
}

export default ProductDetails
