import RecentlyViewedProducts from 'toro/components/product/desktop/ProductRecommendationsWrapper'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import withVendorSwitch from 'toro/hocs/withVendorSwitch'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'

export default withVendorSwitch(
  RecentlyViewedProducts,
  withSchemeValidation(RecommendationsContainer, RecentlyViewedProducts)
)
