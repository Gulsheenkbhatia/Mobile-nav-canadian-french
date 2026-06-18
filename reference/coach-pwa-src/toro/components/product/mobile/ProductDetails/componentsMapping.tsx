import PayInInstallments from 'toro/components/product/mobile/PayInInstallments'
import FreeShippingAndReturns from 'toro/components/product/mobile/FreeShippingAndReturns'
import VarietyOfPayment from 'toro/components/product/mobile/VarietyOfPayment'
import FindInStore from 'toro/components/product/mobile/FindInStore'
import FastShipping from 'toro/components/product/mobile/FastShipping'
import PromoCallout from 'toro/components/product/PromoCallout'
import ProductHighlights from 'toro/components/product/mobile/ProductHighlights'
import CollapsibleProductSectionContainer from 'toro/components/product/mobile/v6/CollapsibleProductSectionContainer'
import PromoRotationBanner from 'toro/components/product/mobile/PromoRotationBanner'
import ContentSlider, { CONTENT_AREAS } from 'toro/components/product/desktop/ContentSlider'
import SearchExpose from 'toro/components/product/mobile/SearchExpose'
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
import MainStage from 'toro/components/product/mobile/ProductDetails/MainStage'
import TabbedContentModule, {
  TabbedContentAttribute,
} from 'toro/components/product/TabbedContentModule'
import Lazy from 'toro/components/Lazy'
import FeaturedContent from 'toro/components/product/mobile/FeaturedContent'
import {
  ProductAccordions,
  ExpandableProductDetailsAccordion,
  ExpandableProductDynamicAccordion,
} from 'toro/components/product/mobile/ExpandableProductDetails/ExpandableAccordions'
import SocialLanderSection from 'toro/components/product/mobile/TemplateContainer/SocialLanderSection'
import { ITemplateComponentsKeys, TemplateComponentsKeys } from 'toro/helpers/templating/types'
import FAQComponent from 'toro/components/FAQComponent'
import GoneViralContainer from 'toro/components/GoneViralRecommendation/GoneViralContainer'
import LoveAtFirstSwipeContainer from 'toro/components/LoveAtFirstSwipe/container'
import BecauseYouViewedContainerPdp from 'toro/components/BecauseYouViewedRecommendation/pdp/BecauseYouViewedContainerPdp'

const PromoIPX3 = () => <PromoCallout promoType={PROMO_TYPES.IPX3} variant="ipx3Placement" />
const ContentAreaOne = () => <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_ONE} />
const ContentAreaTwo = () => <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_TWO} />
const ContentAreaThree = () => <ContentSlider contentArea={CONTENT_AREAS.CONTENT_AREA_THREE} />
const TabbedContentModuleOne = () => <TabbedContentModule moduleId={TabbedContentAttribute.ONE} />
const TabbedContentModuleTwo = () => <TabbedContentModule moduleId={TabbedContentAttribute.TWO} />
const CustomizeAndMonogramWidget = () => <CustomizeAndMonogram type="widget" />
const AccessorizeItComponent = () => (
  <Lazy fallback={<AccessorizeItSkeleton />}>
    <AccessorizeIt />
  </Lazy>
)
const DynamicAccordionOne = () => <ExpandableProductDynamicAccordion accordionIndex={0} />
const DynamicAccordionTwo = () => <ExpandableProductDynamicAccordion accordionIndex={1} />
const DynamicAccordionThree = () => <ExpandableProductDynamicAccordion accordionIndex={2} />

export const componentsMap: Record<ITemplateComponentsKeys, React.ComponentType<any>> = {
  MainStage,
  PayInInstallments,
  FreeShippingAndReturns,
  VarietyOfPayment,
  FindInStore,
  FastShipping,
  PromoIPX3,
  ProductHighlights,
  FeaturedContent,
  ProductAccordions,
  ProductDetailsAccordion: ExpandableProductDetailsAccordion,
  CollapsibleProductDetails: CollapsibleProductSectionContainer,
  DynamicAccordionOne: DynamicAccordionOne,
  DynamicAccordionTwo: DynamicAccordionTwo,
  DynamicAccordionThree: DynamicAccordionThree,
  PromoRotationBanner,
  TabbedContentModuleOne,
  ContentAreaOne,
  YouMayAlsoLike: YouMayAlsoLikeContainer,
  SearchExpose,
  AccessorizeIt: AccessorizeItComponent,
  CustomizeAndMonogramWidget,
  ContentAreaTwo,
  TabbedContentModuleTwo,
  ContentAreaThree,
  RecentlyViewed: RecentlyViewedContainer,
  CompareTools: CompareToolsSection,
  UGCContainer,
  FAQComponent,
  RatingsAndReviewsSection,
  Breadcrumbs: BreadcrumbsMobileWrapper,
  SocialLander: SocialLanderSection,
  GoneViral: GoneViralContainer,
  LoveAtFirstSwipe: LoveAtFirstSwipeContainer,
  BecauseYouViewedPdp: BecauseYouViewedContainerPdp,
}

export const getComponent = (component: ITemplateComponentsKeys) => {
  const actualKey = TemplateComponentsKeys.find(
    (key) => key.toLowerCase() === component.toLowerCase()
  )
  if (!actualKey) {
    return null
  }
  return componentsMap[actualKey]
}
