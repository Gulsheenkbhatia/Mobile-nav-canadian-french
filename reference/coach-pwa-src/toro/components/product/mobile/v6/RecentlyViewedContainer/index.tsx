import RecentlyViewedProducts, {
  RecommenderPosition,
} from 'toro/components/product/desktop/ProductRecommendationsWrapper'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import withVendorSwitch from 'toro/hocs/withVendorSwitch'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'

const RecentlyViewedComponent = withVendorSwitch(
  RecentlyViewedProducts,
  withSchemeValidation(RecommendationsContainer, RecentlyViewedProducts)
)

export default () => (
  <RecentlyViewedComponent
    type="recentlyviewed"
    recommenderPosition={RecommenderPosition.RECENTLY_VIEWED}
  />
)
