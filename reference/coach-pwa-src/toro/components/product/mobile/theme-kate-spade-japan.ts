import mergeWith from 'lodash/mergeWith'
import { themeMerger } from 'store/theme-with-experiments.atom'
import pdpV6KateSpadeTheme from 'toro/components/product/mobile/theme-kate-spade'
import AddToBagArea from 'toro/components/product/mobile/AddToBagArea/theme-kate-spade-japan'
import ProductCarousel from 'toro/components/product/mobile/ProductCarouselWithZoom/theme-kate-spade-japan'
import ProductMediaTangibleeControls from 'toro/components/product/mobile/ProductMediaTangibleeControls/theme-kate-spade-japan'
import Badge from 'toro/components/product/mobile/Badges/theme-kate-spade-japan'
import ProductNameStyles from 'toro/components/product/mobile/ProductDetails/ProductName/theme-kate-spade-japan'
import ExpandableProductDetails from 'toro/components/product/mobile/ExpandableProductDetails/theme-kate-spade-japan'
import ProductPrice from 'toro/components/product/mobile/ProductDetails/ProductPrice/theme-kate-spade-japan'
import RatingsAndReviews from 'toro/components/product/mobile/RatingsAndReviewsSection/themes/v6/theme-kate-spade-japan'
import RecommendationsContainer from 'toro/components/product/mobile/RecommendationsContainer/theme-kate-spade-japan'
import FastShipping from 'toro/components/product/mobile/FastShipping/themes/theme-kate-spade-japan'
import { stylesKs } from 'toro/components/product/mobile/styles'

const pdpV6KateSpadeThemeJP = {
  styles: stylesKs,
  components: {
    AddToBagArea,
    ProductCarousel,
    ProductMediaTangibleeControls,
    Badge,
    ProductNameStyles,
    ExpandableProductDetails,
    ProductPrice,
    RatingsAndReviews,
    RecommendationsContainer,
    FastShipping,
  },
}

const baseTheme = mergeWith(
  {},
  pdpV6KateSpadeTheme,
  pdpV6KateSpadeThemeJP,
  themeMerger(pdpV6KateSpadeTheme)
)

const deeplyMergedComponents = {
  components: {},
}

const finalTheme = mergeWith({}, baseTheme, deeplyMergedComponents, themeMerger(baseTheme))

export default finalTheme
