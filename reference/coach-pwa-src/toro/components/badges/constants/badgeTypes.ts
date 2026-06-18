export const ALMOST_GONE = 'almostGone'
export const BACK_ORDER = 'backOrderMessage'
export const BEST_SELLER = 'bestseller'
export const CUSTOM_MARKETING = 'customMarketing'
export const FINAL_SALE = 'finalSale'
export const FINAL_SALE_MESSAGE = 'finalSaleMessage'
export const ONLY_FEW_LEFT = 'onlyFewLeft'
export const NEW_ARRIVAL = 'newArrival'
export const NOTIFY_MESSAGE = 'notifyMeMessage'
export const PRE_ORDER = 'preOrderMessage'
export const PRIVATE_MARKETING = 'privateMarketing'
export const PROMOTION_CALLOUT = 'promotionCallout'
export const SOLD_OUT = 'soldOut'
export const TOP_RATED = 'topRated'
export const VIEWED = 'viewed'
export const ALMOST_GONE_ON_IMAGE = 'almostGoneOnImage'
export const BESTSELLER_ON_IMAGE = 'bestsellerOnImage'
export const CUSTOM_MARKETING_ON_IMAGE = 'customMarketingOnImage'
export const VIEWED_ON_IMAGE = 'viewedOnImage'
export const NEW_ARRIVAL_ON_IMAGE = 'newArrivalOnImage'
export const PRIVATE_MARKETING_ON_IMAGE = 'privateMarketingOnImage'
export const TOP_RATED_ON_IMAGE = 'topRatedOnImage'
export const INSTOCK_CUSTOM = 'instockCustom'
export const INSTOCK_CUSTOM_ON_IMAGE = 'instockCustomOnImage'

export const CUSTOM_MARKETING_BADGE = 'custom marketing badge'

export const badgeTypes = {
  inventoryCallout: 'inventoryCalloutBadgeContent',
  socialProof: 'socialProofBadgeContent',
  isAlmostGone: 'almostGoneBadgeContent',
  isBackOrder: 'backOrderBadgeContent',
  isBestSeller: 'bestsellerBadgeContent',
  isCustomMarketingBadgeplp: 'customMarketingBadgeplp',
  isCustomMarketingBadgepdp: 'customMarketingBadgepdp',
  isCustomMarketingMessageplp: 'customMarketingMessageplp',
  isCustomMarketingMessagepdp: 'customMarketingMessagepdp',
  isPrivateMarketingBadgeplp: 'privateMarketingBadgeplp',
  isPrivateMarketingBadgepdp: 'privateMarketingBadgepdp',
  isPrivateMarketingMessageplp: 'privateMarketingMessageplp',
  isPrivateMarketingMessagepdp: 'privateMarketingMessagepdp',
  isFinalSale: 'finalSaleBadgeContent',
  isFinalSaleMessage: 'finalSaleMessageContent',
  isViewedProduct: 'viewed',
  isNewArrival: 'newArrivalBadgeContent',
  isNotifyMessage: 'notifyMeMessageBadgeContent',
  isOnlyFewLeft: 'onlyFewLeftBadgeContent',
  isPreOrder: 'preOrderBadgeContent',
  isPrivateMarketing: 'privateMarketingBadgeContent',
  isPromotionCallout: 'promotionCalloutMessage',
  isSoldOut: 'soldOutBadgeContent',
  isTopRated: 'topRatedBadgeContent',
  instockCustom: 'inStockCustomBadgeContent',
  isBundleProduct: 'customBundleMessage',
  isSocialProof: 'socialProof',
  isInventoryCallout: 'inventoryCallout',
  isViewedOnImage: 'viewedOnImage',
} as const

export const badgeTypesOnImage = {
  inventoryCallout: 'onImageInventoryCallout',
  socialProof: 'socialProofOnImageBadgeContent',
  isAlmostGone: 'almostGoneOnImageBadgeContent',
  isBackOrder: 'backOrderOnImageBadgeContent',
  isBestSeller: 'bestsellerOnImageBadgeContent',
  isCustomMarketingBadge: 'customMarketingOnImageBadgeContent',
  isViewedProduct: 'viewedOnImageBadgeContent',
  isNewArrival: 'newArrivalOnImageBadgeContent',
  isPreOrder: 'preOrderOnImageBadgeContent',
  isPrivateMarketing: 'privateMarketingOnImageBagdeContent',
  isTopRated: 'topRatedOnImageBadgeContent',
  isCustomBundleBadgepdp: 'onImageCustomBundleBadgepdp',
  isCustomBundleBadgeplp: 'onImageCustomBundleBadgeplp',
  isCustomMarketingBadgepdp: 'onImageCustomMarketingBadgepdp',
  isCustomMarketingBadgeplp: 'onImageCustomMarketingBadgeplp',
  isPrivateMarketingBadgepdp: 'onImagePrivateMarketingBadgepdp',
  isPrivateMarketingBadgeplp: 'onImagePrivateMarketingBadgeplp',
  isSoldOut: 'soldOutOnImageBadgeContent',
  instockCustom: 'inStockCustomOnImageBadgeContent',
} as const

export const badgeTypesUnderCTA = {
  preorder: 'preOrderMessageContent',
  backorder: 'backOrderMessageContent',
} as const

export const badgeTypesGTM = {
  topRatedBadgeContent: 'top rated',
  topRatedOnImageBadgeContent: 'top rated',

  inventoryCalloutBadgeContent: 'inventory callout',
  onImageInventoryCallout: 'inventory callout',

  backorder: 'backorder message',
  backOrderBadgeContent: 'backorder message',
  backOrderOnImageBadgeContent: 'backorder callout',
  backOrderMessageContent: 'backorder message',

  preorder: 'preorder message',
  preOrderBadgeContent: 'preorder message',
  preOrderOnImageBadgeContent: 'preorder callout',
  preOrderMessageContent: 'preorder message',

  notifyMeMessageBadgeContent: 'notify me message',

  bestsellerBadgeContent: 'bestseller',
  bestsellerOnImageBadgeContent: 'bestseller',

  customMarketingBadgeplp: CUSTOM_MARKETING_BADGE,
  customMarketingBadgepdp: CUSTOM_MARKETING_BADGE,
  customMarketingOnImageBadgeContent: CUSTOM_MARKETING_BADGE,
  onImageCustomMarketingBadgepdp: CUSTOM_MARKETING_BADGE,
  onImageCustomMarketingBadgeplp: CUSTOM_MARKETING_BADGE,

  customMarketingMessageplp: 'custom marketing message',
  customMarketingMessagepdp: 'custom marketing message',

  finalSaleBadgeContent: 'final sale callout',
  finalSaleMessageContent: 'final sale message',

  newArrivalBadgeContent: 'new arrival',
  newArrivalOnImageBadgeContent: 'new arrival',

  viewedBadgeContent: 'viewed',
  viewedOnImageBadgeContent: 'viewed',

  promotionCalloutMessage: 'promotion callout',

  soldOutBadgeContent: 'sold out callout',
  soldOutOnImageBadgeContent: 'sold out callout',

  inStockCustomBadgeContent: 'custom in stock message',
  inStockCustomOnImageBadgeContent: 'custom in stock message',

  isSoldOut: 'sold out callout',
  instockCustom: 'custom in stock message',
  isCustomMarketingBadgeplp: CUSTOM_MARKETING_BADGE,
  isCustomMarketingBadgepdp: CUSTOM_MARKETING_BADGE,
  isBestSeller: 'bestseller',
  inventoryCallout: 'inventory callout',
  isPreOrder: 'preorder callout',
  isBackOrder: 'backorder callout',
  isTopRated: 'top rated',
  isViewedProduct: 'viewed',
  isNewArrival: 'new arrival',
  isPromotionCallout: 'promotion callout',
  isCustomMarketingMessageplp: 'custom marketing message',
  isCustomMarketingMessagepdp: 'custom marketing message',
  isFinalSale: 'final sale callout',
  isFinalSaleMessage: 'final sale message',
}

export const badgeTypesGTMGlobals = {
  [ALMOST_GONE]: 'inventory callout',
  [BEST_SELLER]: 'bestseller',
  [CUSTOM_MARKETING]: 'custom marketing message',
  [ONLY_FEW_LEFT]: 'inventory callout',
  [VIEWED]: 'viewed',
  [NEW_ARRIVAL]: 'new arrival',
  [PRIVATE_MARKETING]: 'custom marketing message',
  [PROMOTION_CALLOUT]: 'promotion callout',
  [SOLD_OUT]: 'sold out callout',
  [TOP_RATED]: 'top rated',
  [ALMOST_GONE_ON_IMAGE]: 'inventory callout',
  [BESTSELLER_ON_IMAGE]: 'bestseller',
  [CUSTOM_MARKETING_ON_IMAGE]: 'custom marketing message',
  [VIEWED_ON_IMAGE]: 'viewed',
  [NEW_ARRIVAL_ON_IMAGE]: 'new arrival',
  [PRIVATE_MARKETING_ON_IMAGE]: 'custom marketing message',
  [TOP_RATED_ON_IMAGE]: 'top rated',
  [INSTOCK_CUSTOM]: 'custom in stock message',
  [INSTOCK_CUSTOM_ON_IMAGE]: 'custom in stock message',
  [PRE_ORDER]: 'preorder message',
  [BACK_ORDER]: 'backorder message',
  [NOTIFY_MESSAGE]: 'notify me message',
  [FINAL_SALE]: 'final sale callout',
  [FINAL_SALE_MESSAGE]: 'final sale message',
}
