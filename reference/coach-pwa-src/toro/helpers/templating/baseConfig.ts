import {
  ITemplateComponentConfig,
  TemplateComponentsKeysMapping,
} from 'toro/helpers/templating/types'

export const BASE_CONFIG: ITemplateComponentConfig['slots'] = {
  SLOT_1: { component: TemplateComponentsKeysMapping.MAIN_STAGE },
  SLOT_2: { component: TemplateComponentsKeysMapping.PAY_IN_INSTALLMENTS },
  SLOT_3: { component: TemplateComponentsKeysMapping.FREE_SHIPPING_AND_RETURNS },
  SLOT_4: { component: TemplateComponentsKeysMapping.VARIETY_OF_PAYMENT },
  SLOT_5: { component: TemplateComponentsKeysMapping.FIND_IN_STORE },
  SLOT_6: { component: TemplateComponentsKeysMapping.FAST_SHIPPING },
  SLOT_7: { component: TemplateComponentsKeysMapping.PROMO_IPX3 },
  SLOT_8: { component: TemplateComponentsKeysMapping.PRODUCT_HIGHLIGHTS },
  SLOT_9: { component: TemplateComponentsKeysMapping.FEATURED_CONTENT },
  SLOT_10: {
    component: TemplateComponentsKeysMapping.PRODUCT_ACCORDIONS,
    children: [
      { component: TemplateComponentsKeysMapping.PRODUCT_DETAILS_ACCORDION },
      { component: TemplateComponentsKeysMapping.DYNAMIC_ACCORDION_ONE },
      { component: TemplateComponentsKeysMapping.DYNAMIC_ACCORDION_TWO },
      { component: TemplateComponentsKeysMapping.DYNAMIC_ACCORDION_THREE },
    ],
  },
  SLOT_11: { component: TemplateComponentsKeysMapping.PROMO_ROTATION_BANNER },
  SLOT_12: { component: TemplateComponentsKeysMapping.TABBED_CONTENT_MODULE_ONE },
  SLOT_13: { component: TemplateComponentsKeysMapping.CONTENT_AREA_ONE },
  SLOT_14: { component: TemplateComponentsKeysMapping.YOU_MAY_ALSO_LIKE },
  SLOT_15: { component: TemplateComponentsKeysMapping.LOVE_AT_FIRST_SWIPE },
  SLOT_16: { component: TemplateComponentsKeysMapping.BECAUSE_YOU_VIEWED_PDP },
  SLOT_17: { component: TemplateComponentsKeysMapping.GONE_VIRAL },
  SLOT_18: { component: TemplateComponentsKeysMapping.SEARCH_EXPOSE },
  SLOT_19: { component: TemplateComponentsKeysMapping.ACCESSORIZE_IT },
  SLOT_20: { component: TemplateComponentsKeysMapping.CUSTOMIZE_AND_MONOGRAM_WIDGET },
  SLOT_21: { component: TemplateComponentsKeysMapping.CONTENT_AREA_TWO },
  SLOT_22: { component: TemplateComponentsKeysMapping.TABBED_CONTENT_MODULE_TWO },
  SLOT_23: { component: TemplateComponentsKeysMapping.CONTENT_AREA_THREE },
  SLOT_24: { component: TemplateComponentsKeysMapping.RECENTLY_VIEWED },
  SLOT_25: { component: TemplateComponentsKeysMapping.COMPARE_TOOLS },
  SLOT_26: { component: TemplateComponentsKeysMapping.UGC_CONTAINER },
  SLOT_27: { component: TemplateComponentsKeysMapping.FAQ_COMPONENT },
  SLOT_28: { component: TemplateComponentsKeysMapping.RATINGS_AND_REVIEWS_SECTION },
  SLOT_29: { component: TemplateComponentsKeysMapping.BREADCRUMBS },
}

export default BASE_CONFIG
