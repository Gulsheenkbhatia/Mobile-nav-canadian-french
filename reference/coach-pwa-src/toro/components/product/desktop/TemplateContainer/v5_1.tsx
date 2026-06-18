import TemplateThemeProvider from 'toro/components/TemplateThemeProvider'
import theme from 'pdpv5_1-theme'
import ProductCarouselWithZoomModal from 'toro/components/product/desktop/ProductCarouselWithZoomModal'
import CloserLookArea from 'toro/components/product/desktop/CloserLookArea'
import { RecommenderPosition } from 'toro/components/product/desktop/ProductRecommendationsWrapper'
import ProductDetails from 'toro/components/product/desktop/ProductDetails'
import UGCContainer from 'toro/components/product/desktop/UGC/UGCContainer'
import RatingsAndReviewsSection from 'toro/components/product/desktop/RatingsAndReviewsSection'
import BreadcrumbDesktopWrapper from 'toro/components/product/desktop/BreadcrumbDesktopWrapper'
import ContentSlider, { CONTENT_AREAS } from 'toro/components/product/desktop/ContentSlider'
import usePdpAnalytics from 'toro/hooks/usePdpAnalytics'
import EnvironmentImpactCarouselWrapper from 'toro/components/product/desktop/EnvironmentImpactCarouselWrapper'
import Grid from 'toro/components/Grid'
import MainStageArea from 'toro/components/product/desktop/v5_1/MainStageArea'
import RecentlyViewedContainer from 'toro/components/product/desktop/v5_1/RecentlyViewedContainer'
import CompareToolsSection from 'toro/components/product/desktop/CompareToolsSection'
import useTangibleeColorSwatches from 'toro/hooks/useTangibleeColorSwatches'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'
import Lazy from 'toro/components/Lazy'
import AccessorizeItSkeleton from 'toro/components/product/AccessorizeIt/AccessorizeItSkeleton'
import AccessorizeIt from 'toro/components/product/AccessorizeIt'
import RecommendedProductSection from 'toro/components/product/RecommendedProductSection'
import TabbedContentModule, {
  TabbedContentAttribute,
} from 'toro/components/product/TabbedContentModule'
import FAQComponent from 'toro/components/FAQComponent'

const TemplateContainer = () => {
  usePdpAnalytics()
  useTangibleeColorSwatches()

  return (
    <TemplateThemeProvider id="pdpv5_1" theme={theme}>
      {/* Entry point for PDP v5_1 template */}
      <Grid data-qa="pdpv5_1_grid" templateColumns="minmax(0, 1fr) 506px">
        <ProductCarouselWithZoomModal />
        <MainStageArea />
      </Grid>
      <ProductDetails />
      <EnvironmentImpactCarouselWrapper />
      <CloserLookArea />
      <TabbedContentModule moduleId={TabbedContentAttribute.ONE} />
      <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_ONE} />
      <Experiment forIDs={EXPERIMENTS.PROMOTE_RECENTLY_VIEWED}>
        <RecentlyViewedContainer
          type="recentlyviewed"
          recommenderPosition={RecommenderPosition.RECENTLY_VIEWED}
          variant="pdpv5_1"
        />
      </Experiment>
      <TabbedContentModule moduleId={TabbedContentAttribute.TWO} />
      <RecommendedProductSection variant="pdpv5_1" />
      <Lazy fallback={<AccessorizeItSkeleton />}>
        <AccessorizeIt />
      </Lazy>
      <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_TWO} />
      <CompareToolsSection />
      <FAQComponent />
      <UGCContainer />
      <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_THREE} />
      <RatingsAndReviewsSection />
      <Experiment notForIDs={EXPERIMENTS.PROMOTE_RECENTLY_VIEWED}>
        <RecentlyViewedContainer
          type="recentlyviewed"
          recommenderPosition={RecommenderPosition.RECENTLY_VIEWED}
          variant="pdpv5_1"
        />
      </Experiment>
      <BreadcrumbDesktopWrapper />
    </TemplateThemeProvider>
  )
}

export default TemplateContainer
