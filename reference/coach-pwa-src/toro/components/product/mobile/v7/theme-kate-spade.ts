import mergeWith from 'lodash/mergeWith'
import pdpModernTheme from 'toro/components/product/mobile/v7/theme'
import SketchContainer from 'toro/components/product/mobile/v7/SketchContainer/theme-kate-spade'
import WaysToWear from 'toro/components/product/mobile/v7/WaysToWear/theme-kate-spade'
import ProductPrice from 'toro/components/product/mobile/v7/ProductPrice/theme/theme-kate-spade'
import ProductMainStageV7 from 'toro/components/product/mobile/v7/MainStageV7/theme/theme-kate-spade'
import ProductGalleryV7 from 'toro/components/product/mobile/v7/ProductGalleryV7/theme/theme-kate-spade'
import AngleNavigatorV7 from 'toro/components/product/mobile/v7/AngleNavigator/theme/theme-kate-spade'
import ProductImageSwatchesV7 from 'toro/components/product/mobile/v7/ProductImageSwatchesV7Container/theme/theme-kate-spade'
import PdpAnchorNavV7 from 'toro/components/product/mobile/v7/PDPAnchorNavV7/theme/theme-kate-spade'
import ProductActions from 'toro/components/product/mobile/v7/ProductActions/theme/theme-kate-spade'
import RecommendationsContainer from 'toro/components/product/mobile/RecommendationsContainer/theme-kate-spade'
import RecommendationsSlider from 'toro/components/product/mobile/RecommendationsSlider/themes/theme-kate-spade'
import SectionSlider from 'toro/components/product/mobile/SectionSlider/theme-kate-spade'
import PDPRecommendations from 'toro/components/product/mobile/PDPRecommendations/theme-kate-spade'
import ProductSpecsGrid from 'toro/components/product/mobile/v7/ProductSpecifications/theme/theme-kate-spade'
import ExpandableProductDetails from 'toro/components/product/mobile/ExpandableProductDetails/theme-kate-spade'
import ProductCardTable from 'toro/components/product/mobile/ExpandableProductDetails/ProductCardTable/theme-kate-spade'
import RatingsAndReviews from 'toro/components/product/mobile/v7/RatingsAndReviewsSection/theme/theme-kate-spade'

import ViewMorePromoDrawer from 'toro/components/product/mobile/v7/ViewMorePromoDrawer/theme/theme-kate-spade'
import ProductTitleV7 from 'toro/components/product/mobile/v7/ProductTitle/theme/theme-kate-spade'
import SizeSelectorModern from 'toro/components/product/mobile/v7/SizeSelectorModern/theme/theme-kate-spade'
import SignatureFeaturesShoes from 'toro/components/product/mobile/v7/SignatureFeaturesShoes/theme/theme-kate-spade'
import UGC from 'toro/components/product/mobile/UGC/theme/theme-kate-spade'

import CharmsSelector from 'toro/components/product/mobile/v7/CharmsSelector/theme/theme-kate-spade'
import SignatureFeatures from 'toro/components/product/mobile/v7/SignatureFeatures/theme/theme-kate-spade'
import ProductCompareTool from 'toro/components/product/mobile/ProductCompareTool/theme-kate-spade'
import FinalSaleProductMessage from 'toro/components/product/mobile/v7/FinalSaleProductMessage/theme/theme-kate-spade'

const TemplateContainerKateSpade = {
  baseStyle: {
    container: {
      backgroundColor: 'var(--color-neutral-light-1, #F0F0F0)',
      pb: 'var(--spacing-1)',
    },
  },
}

const pdpModernKateSpadeTheme = {
  components: {
    TemplateContainerV7: TemplateContainerKateSpade,
    SketchContainer,
    WaysToWear,
    ProductPrice,
    ProductMainStageV7,
    ProductGalleryV7,
    AngleNavigatorV7,
    ProductImageSwatchesV7,
    PdpAnchorNavV7,
    ProductActions,
    RecommendationsSlider,
    SectionSlider,
    PDPRecommendations,
    ViewMorePromoDrawer,
    ProductTitleV7,
    SizeSelectorModern,
    SignatureFeaturesShoes,
    ProductSpecsGrid,
    ExpandableProductDetails,
    ProductCardTable,
    CharmsSelector,
    SignatureFeatures,
    RatingsAndReviews,
    ProductCompareTool,
    FinalSaleProductMessage,
    UGC,
    RecommendationsContainer,
  },
}

export default mergeWith({}, pdpModernTheme, pdpModernKateSpadeTheme)
