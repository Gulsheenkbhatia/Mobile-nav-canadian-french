import dynamic from 'next/dynamic'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import AdaptivePDPRotatingBanner from 'toro/components/product/AdaptivePDPRotatingBanner'

const CertonaRecommendations = dynamic(() => import('toro/components/Certona/Recommendation'), {
  ssr: false,
})

const OutOfStockPDPBottom = ({ certona, productDetailsProps, masterId }) => {
  const adaptiveTabbedStyles = useMultiStyleConfig('TabbedAdaptivePDP')
  const {
    recommendations: { hideRecommendationPrice: hideYmalPrice },
  } = usePreference({
    recommendations: '*',
  })

  const { hybridSocialScheme } = certona || {}

  return (
    <Box sx={adaptiveTabbedStyles.lowerMainContainer}>
      <AdaptivePDPRotatingBanner
        productData={productDetailsProps?.productData}
        variantData={productDetailsProps?.variantData}
      />
      <div id="recommendations-section" className="certona_wrapper">
        <CertonaRecommendations
          certonaData={hybridSocialScheme}
          hidePrice={hideYmalPrice}
          type="product3_rr"
          variant="similarProductRecommendation"
          productId={get(productDetailsProps, 'productData.selectedVariantGroupId') || masterId}
          isRenderRecentlyViewed={false}
        />
      </div>
    </Box>
  )
}

export default OutOfStockPDPBottom
