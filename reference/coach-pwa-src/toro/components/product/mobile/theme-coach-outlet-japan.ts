import mergeWith from 'lodash/mergeWith'
import { themeMerger } from 'store/theme-with-experiments.atom'
import pdpV6Theme from 'toro/components/product/mobile/theme'
import AddToBagArea from 'toro/components/product/mobile/AddToBagArea/theme-coach-outlet-japan'
import AccessorizeIt from 'toro/components/product/mobile/AccessorizeIt/theme-coach-outlet-japan'
import RecommendationsContainer from 'toro/components/product/mobile/RecommendationsContainer/theme-coach-japan'
import RatingsAndReviews from 'toro/components/product/mobile/RatingsAndReviewsSection/themes/v6/theme-coach-outlet-japan'
import { styles } from 'toro/components/product/mobile/styles'

const pdpV6ThemeJP = {
  styles,
  components: {
    AddToBagArea,
    RatingsAndReviews,
  },
}

const baseTheme = mergeWith({}, pdpV6Theme, pdpV6ThemeJP, themeMerger(pdpV6Theme))

const deeplyMergedComponents = {
  components: {
    AccessorizeIt,
    RecommendationsContainer,
  },
}

const finalTheme = mergeWith({}, baseTheme, deeplyMergedComponents, themeMerger(baseTheme))

export default finalTheme
