import PayInInstallments from 'toro/components/product/mobile/PayInInstallments'
import FreeShippingAndReturns from 'toro/components/product/mobile/FreeShippingAndReturns'
import FindInStore from 'toro/components/product/mobile/FindInStore'
import PromoCallout from 'toro/components/product/PromoCallout'
import ProductHighlights from 'toro/components/product/mobile/ProductHighlights'
import FeaturedContent from 'toro/components/product/mobile/FeaturedContent'
import ExpandableProductDetails from 'toro/components/product/mobile/ExpandableProductDetails'
import PromoRotationBanner from 'toro/components/product/mobile/PromoRotationBanner'
import ContentSlider, { CONTENT_AREAS } from 'toro/components/product/desktop/ContentSlider'
import Lazy from 'toro/components/Lazy'
import Experiment from 'toro/components/Experiment'
import SearchExpose from 'toro/components/product/mobile/SearchExpose'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import RecentlyViewedContainer from 'toro/components/product/mobile/v6/RecentlyViewedContainer'
import AccessorizeIt from 'toro/components/product/AccessorizeIt'
import CustomizeAndMonogram from 'toro/components/product/mobile/CustomizeAndMonogram'
import CompareToolsSection from 'toro/components/product/mobile/CompareToolsSection'
import UGCContainer from 'toro/components/product/desktop/UGC/UGCContainer'
import RatingsAndReviewsSection from 'toro/components/product/desktop/RatingsAndReviewsSection'
import BreadcrumbsMobileWrapper from 'toro/components/product/mobile/BreadcrumbsMobileWrapper'
import AccessorizeItSkeleton from 'toro/components/product/AccessorizeIt/AccessorizeItSkeleton'
import YouMayAlsoLikeContainer from 'toro/components/product/mobile/v6/YouMayAlsoLikeContainer'
import TabbedContentModule, {
  TabbedContentAttribute,
} from 'toro/components/product/TabbedContentModule'
import FAQComponent from 'toro/components/FAQComponent'

const LowerPDPSection = () => {
  return (
    <>
      <PayInInstallments />
      <FreeShippingAndReturns />
      <FindInStore />
      <PromoCallout promoType={PROMO_TYPES.IPX3} variant="ipx3Placement" />
      <ProductHighlights />
      <FeaturedContent />
      <ExpandableProductDetails />
      <PromoRotationBanner />
      <TabbedContentModule moduleId={TabbedContentAttribute.ONE} />
      <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_ONE} />
      <Experiment forIDs={EXPERIMENTS.PROMOTE_RECENTLY_VIEWED}>
        <RecentlyViewedContainer />
      </Experiment>
      <YouMayAlsoLikeContainer type="ymal" />
      <SearchExpose />
      <Lazy fallback={<AccessorizeItSkeleton />}>
        <AccessorizeIt />
      </Lazy>
      <CustomizeAndMonogram type="widget" />
      <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_TWO} />
      <TabbedContentModule moduleId={TabbedContentAttribute.TWO} />
      <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_THREE} />
      <Experiment notForIDs={EXPERIMENTS.PROMOTE_RECENTLY_VIEWED}>
        <RecentlyViewedContainer />
      </Experiment>
      <CompareToolsSection />
      <UGCContainer />
      <FAQComponent />
      <RatingsAndReviewsSection />
      <BreadcrumbsMobileWrapper />
    </>
  )
}

export default LowerPDPSection
