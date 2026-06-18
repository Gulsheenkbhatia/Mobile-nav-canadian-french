import mergeWith from 'lodash/mergeWith'
import { themeMerger } from 'store/theme-with-experiments.atom'
import pdpV6Theme from 'toro/components/product/mobile/theme'
import ProductCarousel from 'toro/components/product/mobile/ProductCarouselWithZoom/theme-kate-spade'
import Badge from 'toro/components/product/mobile/Badges/theme-kate-spade'
import ProductNameStyles from 'toro/components/product/mobile/ProductDetails/ProductName/theme-kate-spade'
import ProductPrice from 'toro/components/product/mobile/ProductDetails/ProductPrice/theme-kate-spade'
import ProductDetailsStyles from 'toro/components/product/mobile/ProductDetails/theme-kate-spade'
import ProductHighlights from 'toro/components/product/mobile/ProductHighlights/themes/theme-kate-spade'
import ProductCard from 'toro/components/product/mobile/ProductHighlights/ProductCard/theme-kate-spade'
import ProductMediaTangibleeControls from 'toro/components/product/mobile/ProductMediaTangibleeControls/theme-kate-spade'
import AddToBagArea from 'toro/components/product/mobile/AddToBagArea/theme-kate-spade'
import SigninMemberButtonTheme from 'toro/components/product/mobile/AddToBagArea/SignInMemberButton/theme-kate-spade'
import VariationMessages from 'toro/components/product/mobile/AddToBagArea/VariationMessages/theme-kate-spade'
import CustomizeAndMonogram from 'toro/components/product/mobile/CustomizeAndMonogram/theme-kate-spade'
import ProductInfoMessage from 'toro/components/product/mobile/AddToBagArea/ProductInfoMessage/theme-kate-spade'
import NotifyMeButton from 'toro/components/product/mobile/AddToBagArea/NotifyMe/theme-kate-spade'
import TangibleeWidget from 'toro/components/product/mobile/ProductMediaTangibleeControls/product-details-theme-kate-spade'
import ProductCardTable from 'toro/components/product/mobile/ExpandableProductDetails/ProductCardTable/theme-kate-spade'
import ExpandableProductDetails from 'toro/components/product/mobile/ExpandableProductDetails/theme-kate-spade'
import HotspotBadge from 'toro/components/product/desktop/HotspotBadge/themes/theme-kate-spade'
import PDPColorSwatches from 'toro/components/product/mobile/PDPColorSwatches/theme-kate-spade'
import SearchExposeTheme from 'toro/components/product/mobile/SearchExpose/theme-kate-spade'
import AddToCartButton from 'toro/components/product/mobile/AddToCartRecommendationButton/theme-kate-spade'
import PDPRecommendations from 'toro/components/product/mobile/PDPRecommendations/theme-kate-spade'
import RecommendationsContainer from 'toro/components/product/mobile/RecommendationsContainer/theme-kate-spade'
import AccessorizeIt from 'toro/components/product/mobile/AccessorizeIt/theme-kate-spade'
import ProductSizeSelector from 'toro/components/product/mobile/SizeSelector/theme-kate-spade'
import ProductCompareTool from 'toro/components/product/mobile/ProductCompareTool/theme-kate-spade'
import PayInInstallments from 'toro/components/product/mobile/PayInInstallments/themes/theme-kate-spade'
import FreeShippingAndReturns from 'toro/components/product/mobile/FreeShippingAndReturns/themes/theme-kate-spade'
import FastShipping from 'toro/components/product/mobile/FastShipping/themes/theme-kate-spade'
import VarietyOfPayment from 'toro/components/product/mobile/VarietyOfPayment/themes/theme-kate-spade'
import FindInStoreWidgetTheme from 'toro/components/product/mobile/FindInStore/theme-kate-spade'
import UGC from 'toro/components/product/mobile/UGC/theme/theme-kate-spade'
import RatingsAndReviews from 'toro/components/product/mobile/RatingsAndReviewsSection/themes/v6/theme-kate-spade'
import FeaturedContent from 'toro/components/product/mobile/FeaturedContent/theme-kate-spade'
import RecommendationsSlider from 'toro/components/product/mobile/RecommendationsSlider/themes/theme-kate-spade'
import SectionSlider from 'toro/components/product/mobile/SectionSlider/theme-kate-spade'
import { stylesKs } from 'toro/components/product/mobile/styles'
import WriteReviewSection from 'toro/components/product/mobile/RatingsAndReviewsSection/WriteReviewSection/theme-kate-spade'
import RecommendationItemTile from 'toro/components/product/mobile/RecommendationItemTile/theme-kate-spade'
import PrestyledAccordion from 'toro/components/PrestyledAccordion/themes/theme-kate-spade'
import ProductMediaThumbnails from 'toro/components/product/mobile/ProductMediaThumbnails/theme'

const pdpV6KateSpadeTheme = {
  styles: stylesKs,
  components: {
    ProductCarousel,
    Badge,
    ProductNameStyles,
    ProductPrice,
    ProductDetailsStyles,
    ProductHighlights,
    ProductCard,
    ProductMediaTangibleeControls,
    AddToBagArea,
    SigninMemberButtonTheme,
    VariationMessages,
    CustomizeAndMonogram,
    ProductInfoMessage,
    NotifyMeButton,
    TangibleeWidget,
    ProductCardTable,
    ExpandableProductDetails,
    HotspotBadge,
    PDPColorSwatches,
    SearchExposeTheme,
    AddToCartButton,
    PDPRecommendations,
    RecommendationsContainer,
    ProductSizeSelector,
    ProductCompareTool,
    PrestyledAccordion,
    ProductMediaThumbnails,
  },
}

const baseTheme = mergeWith({}, pdpV6Theme, pdpV6KateSpadeTheme)

const deeplyMergedComponents = {
  components: {
    RatingsAndReviews,
    FreeShippingAndReturns,
    VarietyOfPayment,
    FastShipping,
    AccessorizeIt,
    FeaturedContent,
    PayInInstallments,
    RecommendationsSlider,
    FindInStoreWidgetTheme,
    SectionSlider,
    WriteReviewSection,
    RecommendationItemTile,
    UGC,
  },
}

const finalTheme = mergeWith({}, baseTheme, deeplyMergedComponents, themeMerger(baseTheme))

export default finalTheme
