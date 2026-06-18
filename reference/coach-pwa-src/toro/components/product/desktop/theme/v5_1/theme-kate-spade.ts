import { themeMerger } from 'store/theme-with-experiments.atom'
import mergeWith from 'lodash/mergeWith'
import pdpThemev5 from 'toro/components/product/desktop/theme/v5'
import pdpThemev5_1 from 'toro/components/product/desktop/theme/v5_1/theme'
import PDPColorSwatches from 'toro/components/product/desktop/PDPColorSwatches/themes/v5_1/kate-spade'
import ProductSizeSelector from 'toro/components/product/desktop/v5_1/SizeSelector/themes/kate-spade'
import SizeGuideTheme from 'toro/components/product/SizeGuideButton/themes/v5_1/kate-spade'
import ProductCard from 'toro/components/product/desktop/ProductCard/themes/v5_1/kate-spade'
import ProductCardTable from 'toro/components/product/desktop/ProductCardTable/themes/v5_1/kate-spade'
import ProductDetails from 'toro/components/product/desktop/ProductDetails/themes/v5_1/kate-spade'
import TangibleeWidget from 'toro/components/product/desktop/ProductTangibleeControl/themes/v5_1/product-details-kate-spade'
import ProductCarouselZoomModal from 'toro/components/product/desktop/ProductCarouselZoomModal/themes/v5_1/kate-spade'
import AddToBagArea from 'toro/components/product/desktop/AddToBagArea/themes/v5_1/kate-spade'
import VariationMessages from 'toro/components/product/desktop/AddToBagArea/TooltipVariationMessages/themes/v5_1/kate-spade'
import ProductInfoMessage from 'toro/components/product/ProductInfoMessage/themes/v5_1/kate-spade'
import StarReviewRatingStyles from 'toro/components/product/desktop/StickyBar/StarReviewRating/themes/v5_1/kate-spade'
import MainStageArea from 'toro/components/product/desktop/v5_1/MainStageArea/themes/kate-spade'
import ProductPrice from 'toro/components/product/desktop/v5_1/ProductPrice/themes/kate-spade'
import UGC from 'toro/components/product/desktop/UGC/themes/v5_1/kate-spade'
import SectionSlider from 'toro/components/product/desktop/SectionSlider/themes/v5_1/kate-spade'
import RatingsAndReviews from 'toro/components/product/desktop/RatingsAndReviewsSection/themes/v5_1/kate-spade'
import Badge from 'toro/components/badges/Badge/themes/v5_1/kate-spade'
import RotatingMessages from 'toro/components/product/desktop/v5_1/RotatingMessages/themes/kate-spade'
import KlarnaWidgetTheme from 'toro/components/product/KlarnaWidget/themes/v5_1/kate-spade'
import ShippingAndReturnsWidget from 'toro/components/product/TabbedPDP/ShippingAndReturnsWidget/themes/v5_1/kate-spade'
import AfterPay from 'toro/components/AfterPay/themes/v5_1/kate-spade'
import Affirm from 'toro/components/Affirm/themes/v5_1/kate-spade'
import RecommendationsSlider from 'toro/components/product/desktop/RecommendationsSlider/themes/v5_1/kate-spade'
import RecommendationsContainer from 'toro/components/RecommendationsContainer/themes/v5_1/kate-spade'
import RecommendationItemTile from 'toro/components/RecommendationItemTile/themes/v5_1/kate-spade'
import PDPRecommendations from 'toro/components/Certona/Recommendation/themes/v5_1/kate-spade'
import ContentSlider from 'toro/components/product/desktop/ContentSlider/themes/v5_1/kate-spade'
import FindInStoreWidgetTheme from 'toro/components/product/FindInStore/FindInStoreWidget/themes/v5_1/kate-spade'
import PartOfBundleCta from 'toro/components/product/desktop/v5_1/PartOfBundleCta/themes/kate-spade'
import Wishlist from 'toro/components/product/desktop/v5_1/Wishlist/themes/kate-spade'
import AccessorizeIt from 'toro/components/product/AccessorizeIt/themes/v5_1/kate-spade'
import PrestyledAccordion from 'toro/components/PrestyledAccordion/themes/theme-kate-spade'
import SimilarOptionJumpLinkStyles from 'toro/components/SimilarOptionJumpLink/themes/v5_1/kate-spade'

type V5ComponentNames = keyof typeof pdpThemev5['components']
type NewComponents =
  | 'ProductCarouselZoomModal'
  | 'ProductInfoMessage'
  | 'MainStageArea'
  | 'RotatingMessages'
  | 'KlarnaWidgetTheme'
  | 'Badge'
  | 'ShippingAndReturnsWidget'
  | 'AfterPay'
  | 'Affirm'
  | 'RecommendationsContainer'
  | 'RecommendationItemTile'
  | 'PDPRecommendations'
  | 'FindInStoreWidgetTheme'
  | 'PartOfBundleCta'
  | 'Wishlist'
  | 'AccessorizeIt'
  | 'PrestyledAccordion'
  | 'SimilarOptionJumpLinkStyles'

/**
 * Represents the set of allowed component names for v5.1.
 *
 * By default, this includes all components from the v5 theme (`V5ComponentNames`).
 * If you need to support new components that do not exist in v5, extend
 * `NewComponents` with their names.
 *
 * @example
 * // Add new components
 * type NewComponents = 'First' | 'Second'
 *
 * // Create a type that allows v5 components + new ones
 * type MyComponents = V5_1ComponentNames<NewComponents>
 *
 * const components: MyComponents = {
 *   ProductCarousel: {}, // from v5
 *   First: {},           // newly added
 *   Second: {},          // newly added
 *   Wrong: {}            // error (not in v5 and not listed in NewComponents)
 * }
 */
type V5_1ComponentNames<TNewComponent extends NewComponents> = Partial<
  Record<V5ComponentNames | TNewComponent, unknown>
>

const pdpThemeKateSpadeV5_1: { components: V5_1ComponentNames<NewComponents> } = {
  components: {
    PDPColorSwatches,
    ProductSizeSelector,
    SizeGuideTheme,
    ProductCard,
    ProductCardTable,
    ProductDetails,
    TangibleeWidget,
    ProductCarouselZoomModal,
    AddToBagArea,
    VariationMessages,
    ProductInfoMessage,
    StarReviewRatingStyles,
    MainStageArea,
    ProductPrice,
    UGC,
    SectionSlider,
    RatingsAndReviews,
    Badge,
    RotatingMessages,
    KlarnaWidgetTheme,
    ShippingAndReturnsWidget,
    AfterPay,
    Affirm,
    RecommendationsSlider,
    RecommendationsContainer,
    RecommendationItemTile,
    PDPRecommendations,
    ContentSlider,
    FindInStoreWidgetTheme,
    PartOfBundleCta,
    Wishlist,
    AccessorizeIt,
    PrestyledAccordion,
    SimilarOptionJumpLinkStyles,
  },
}

export default mergeWith({}, pdpThemev5_1, pdpThemeKateSpadeV5_1, themeMerger(pdpThemev5_1))
