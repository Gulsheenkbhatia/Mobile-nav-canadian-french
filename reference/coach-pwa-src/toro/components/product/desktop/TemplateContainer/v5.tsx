import TemplateThemeProvider from 'toro/components/TemplateThemeProvider'
import pdpV5Theme from 'toro/components/product/desktop/theme/v5'
import ProductCarouselWithZoomModal from 'toro/components/product/desktop/ProductCarouselWithZoomModal'
import StickyBar from 'toro/components/product/desktop/StickyBar'
import CloserLookArea from 'toro/components/product/desktop/CloserLookArea'
import RecentlyViewedProducts, {
  RecommenderPosition,
} from 'toro/components/product/desktop/ProductRecommendationsWrapper'
import ProductDetails from 'toro/components/product/desktop/ProductDetails'
import UGCContainer from 'toro/components/product/desktop/UGC/UGCContainer'
import RatingsAndReviewsSection from 'toro/components/product/desktop/RatingsAndReviewsSection'
import BreadcrumbDesktopWrapper from 'toro/components/product/desktop/BreadcrumbDesktopWrapper'
import ContentSlider, { CONTENT_AREAS } from 'toro/components/product/desktop/ContentSlider'
import usePdpAnalytics from 'toro/hooks/usePdpAnalytics'
import RecommendedProductSection from 'toro/components/product/RecommendedProductSection'
import EnvironmentImpactCarouselWrapper from 'toro/components/product/desktop/EnvironmentImpactCarouselWrapper'

const TemplateContainer = () => {
  usePdpAnalytics()

  return (
    <TemplateThemeProvider id="pdpv5" theme={pdpV5Theme}>
      {/* Entry point for PDP v5 template */}
      <ProductCarouselWithZoomModal />
      <ProductDetails />
      <EnvironmentImpactCarouselWrapper />
      <StickyBar />
      <CloserLookArea />
      <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_ONE} />
      <RecommendedProductSection />
      <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_TWO} />
      <UGCContainer />
      <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_THREE} />
      <RatingsAndReviewsSection />
      <RecentlyViewedProducts recommenderPosition={RecommenderPosition.RECENTLY_VIEWED} />
      <BreadcrumbDesktopWrapper />
    </TemplateThemeProvider>
  )
}

export default TemplateContainer
