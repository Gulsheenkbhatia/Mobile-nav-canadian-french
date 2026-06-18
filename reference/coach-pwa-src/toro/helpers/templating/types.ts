export const TemplateComponentsKeysMapping = {
  MAIN_STAGE: 'MainStage',
  PAY_IN_INSTALLMENTS: 'PayInInstallments',
  FREE_SHIPPING_AND_RETURNS: 'FreeShippingAndReturns',
  VARIETY_OF_PAYMENT: 'VarietyOfPayment',
  FIND_IN_STORE: 'FindInStore',
  FAST_SHIPPING: 'FastShipping',
  PROMO_IPX3: 'PromoIPX3',
  PRODUCT_HIGHLIGHTS: 'ProductHighlights',
  FEATURED_CONTENT: 'FeaturedContent',
  PRODUCT_ACCORDIONS: 'ProductAccordions',
  PRODUCT_DETAILS_ACCORDION: 'ProductDetailsAccordion',
  COLLAPSIBLE_PRODUCT_DETAILS: 'CollapsibleProductDetails',
  DYNAMIC_ACCORDION_ONE: 'DynamicAccordionOne',
  DYNAMIC_ACCORDION_TWO: 'DynamicAccordionTwo',
  DYNAMIC_ACCORDION_THREE: 'DynamicAccordionThree',
  PROMO_ROTATION_BANNER: 'PromoRotationBanner',
  TABBED_CONTENT_MODULE_ONE: 'TabbedContentModuleOne',
  CONTENT_AREA_ONE: 'ContentAreaOne',
  YOU_MAY_ALSO_LIKE: 'YouMayAlsoLike',
  SEARCH_EXPOSE: 'SearchExpose',
  ACCESSORIZE_IT: 'AccessorizeIt',
  CUSTOMIZE_AND_MONOGRAM_WIDGET: 'CustomizeAndMonogramWidget',
  CONTENT_AREA_TWO: 'ContentAreaTwo',
  TABBED_CONTENT_MODULE_TWO: 'TabbedContentModuleTwo',
  CONTENT_AREA_THREE: 'ContentAreaThree',
  RECENTLY_VIEWED: 'RecentlyViewed',
  COMPARE_TOOLS: 'CompareTools',
  UGC_CONTAINER: 'UGCContainer',
  FAQ_COMPONENT: 'FAQComponent',
  RATINGS_AND_REVIEWS_SECTION: 'RatingsAndReviewsSection',
  BREADCRUMBS: 'Breadcrumbs',
  SOCIAL_LANDER: 'SocialLander',
  GONE_VIRAL: 'GoneViral',
  LOVE_AT_FIRST_SWIPE: 'LoveAtFirstSwipe',
  BECAUSE_YOU_VIEWED_PDP: 'BecauseYouViewedPdp',
} as const

export enum TemplateRenderMode {
  MERGE = 'merge',
  REPLACE = 'replace',
}

export const TemplateComponentsKeys = [...Object.values(TemplateComponentsKeysMapping)] as const

export type ITemplateComponentsKeys = typeof TemplateComponentsKeys[number]

export interface ITemplateComponentConfigItem {
  component: ITemplateComponentsKeys
  children?: ITemplateComponentConfigItem[]
}

export interface ITemplateComponentConfig {
  renderMode: TemplateRenderMode
  slots: Record<`SLOT_${number}`, ITemplateComponentConfigItem>
}

export interface IOverrideTemplateComponentConfig
  extends Record<string, ITemplateComponentConfig> {}
