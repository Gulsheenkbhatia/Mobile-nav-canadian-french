import { memo } from 'react'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import Skeleton from 'toro/components/Skeleton'
import dynamic from 'next/dynamic'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import useStructuredCopy from 'toro/hooks/useStructuredCopy'

const TabbedProductDetailsItem = dynamic(() =>
  import('toro/components/ProductDetails/ProductDetailsItem/TabbedPDPProductDetailsItem')
)

const ProductDetails = ({
  productData,
  skuId,
  isVisible,
  tangibleeData,
  variantData,
  isCustomized,
  apploading,
  sustainabilityIconsData,
  variant,
}) => {
  const productSlots = get(productData, 'productSlots')
  const productDescription = get(productData, 'longDescription')

  const description2 = get(productData, 'custom.c_longDescription2', '')
  const productDetails = get(productData, 'productDetails', [])
  const { hasStructuredCopy } = useStructuredCopy(productDetails)
  const productCare = get(productSlots, 'contentSlots["product-care"]')

  if (apploading) {
    return (
      <Box width="100%">
        <Skeleton minH="100px" width="100%" mt="22px" mb="22px">
          <Box mb="mar" />
        </Skeleton>
      </Box>
    )
  }

  return (
    <Box id="product-info">
      <TabbedProductDetailsItem
        isProductDetailSection
        content={productDescription}
        content2={hasStructuredCopy ? undefined : description2}
        productDetails={hasStructuredCopy ? productDetails : undefined}
        productCare={productCare}
        id="product-details"
        skuId={skuId}
        isVisible={isVisible}
        tangibleeData={tangibleeData}
        productData={productData}
        variantData={variantData}
        isCustomized={isCustomized}
        sustainabilityIconsData={sustainabilityIconsData}
        variant={variant}
      />
    </Box>
  )
}

ProductDetails.propTypes = {
  productData: PropTypes.object,
  skuId: PropTypes.string,
  isVisible: PropTypes.bool,
  tangibleeData: PropTypes.object,
  variantData: PropTypes.object,
  isCustomized: PropTypes.bool,
  apploading: PropTypes.bool,
  sustainabilityIconsData: PropTypes.array,
}

ProductDetails.defaultProps = {
  productData: {},
  skuId: '',
  isVisible: false,
  tangibleeData: {},
  variantData: {},
  isCustomized: false,
  apploading: false,
  sustainabilityIconsData: [],
}

export default withErrorBoundaryWrapper(memo(ProductDetails))
