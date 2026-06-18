import RecommendedProductSection from 'toro/components/product/RecommendedProductSection'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import withVendorSwitch from 'toro/hocs/withVendorSwitch'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'

export default withVendorSwitch(
  RecommendedProductSection,
  withSchemeValidation(RecommendationsContainer, RecommendedProductSection)
)
