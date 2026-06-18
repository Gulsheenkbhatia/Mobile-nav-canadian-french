export const PAGE_SIZE_FOR_DESKTOP = 'pageSizeForDesktop'
export const PAGE_SIZE_FOR_DEVICE = 'pageSizeForDevice'

// TODO: make SHOPPING_GIVES_GROUP_ID camelCased, and adjust all usages
export const SHOPPING_GIVES_GROUP_ID = 'ShoppingGives'
export const SHOPPING_GIVES_STORE_ID = 'storeIdShoppingGives'
export const SHOPPING_GIVES_IS_ENABLED = 'enableShoppingGives'
export const SHOPPING_GIVES_URL = 'urlforShoppingGives'
export const SHOPPING_GIVES_GUEST_IS_ENABLED = 'enableGuestViewWidget'
export const SHOPPING_GIVES_GUEST_IS_ENABLED_SUB_BRAND = 'enableGuestViewWidgetCoachtopia'
export const SHOPPING_GIVES_GUEST_CUSTOMER_SEGMENT = 'customerSegmentGuest'
export const SHOPPING_GIVES_INSIDER_IS_ENABLED = 'enableInsiderPDPViewWidget'
export const SHOPPING_GIVES_SUB_BRAND_ID = 'coachtopia'
export const SHOPPING_GIVES_INSIDER_IS_ENABLED_SUB_BRAND = 'enableInsiderPDPViewWidgetCoachtopia'

const badgingPreferences = [
  'enableBadges',
  'enableBestSellerByCategory',
  'thresholdStarRating',
  'newArrivalInXDays',
  'badgeDetailsJSONpdp',
  'badgeDetailsJSONplp',
  'badgeDetailsJSONminicart',
  'badgePriorityJSONpdp',
  'badgePriorityJSONplp',
  'badgePriorityJSONminicart',
  'bundlebadgeDetailsJSONplp',
  'bundlebadgeDetailsJSONpdp',
  'bundlebadgeDetailsJSONminicart',
  'bundlebadgePriorityJSONplp',
  'bundlebadgePriorityJSONpdp',
  'bundlebadgePriorityJSONminicart',
  'bundleonImageBadgePriorityJSONpdp',
  'bundleonImageBadgePriorityJSONplp',
  'onImageBadgePriorityJSONpdp',
  'onImageBadgePriorityJSONplp',
  'badgeAreaJson',
  'finalSaleDiscountPercentage',
  'persistSoldOut',
  'thresholdNoOfReviews',
  'maxPromoCalloutsDisplayPLP',
  'onPurposeBadgeImage',
  'hideOnPurposeBadgeOnMobilePlpv3',
] as const

const searchRefinementsPreferences = [
  'responseDelay',
  'sliderStepSize',
  'searchRefinementScrollSize',
  'refinementColorStyle',
  'refinementAttributeStyle',
  'refinementCheckboxStyle',
  'searchRefinementsToHide',
] as const

const searchSuggestionsPreferences = [
  'enableSearchSuggestions',
  'disablePopularSearchSuggestion',
  'enableAltImages',
  'lastSeenpidsCookieMaxAge',
  'enableSearchSuggestionsOnCategoryFooter',
  'enableTryAgainSearchArea',
  'EnableCategoryAltImageSequence',
] as const

const lazyLoadPreferences = [
  'pageSizeForDesktop',
  'pageSizeForDevice',
  'enableLazyLoad',
  'enableCategoryLazyLoad',
  'lazyLoadConfig',
  'lazyLoadThreshold',
  'lazyloadPageSections',
] as const

const navFlyoutPreferences = [
  'navFlyoutDesktopColAStyle',
  'navFlyoutDesktopColBStyle',
  'navFlyoutMobileContentAreaStyle',
  'enableNavCategoryCallout',
  'navCalloutInfoColor',
  'overrideCategoryImage',
  'enableSignInFlyout',
  'enableNewNavMenu',
  'chooseNavTheme',
] as const

const powerReviewsPreferences = [
  'isEnableUGCOnPlpPage',
  'isEnableUGCOnPDPPage',
  'isEnableRatingOnPLP',
  'isEnableHelpfulButton',
  'commentHeight',
  'merchantID',
  'defaultSortOrder',
  'modalDefaultSortOrder',
  'sortOrderList',
  'filtersList',
  'pageSizePDP',
  'pdpImageStyle',
  'pageSizePDPMobile',
  'pageSizeAllReviewsModal',
  'pageSizeAllReviewsModalMobile',
  'pageSizeAllReviewsSchema',
  'isEnableUGC',
  'isEnableUGCOnHomePage',
  'isDisableUGCViewGalleryButton',
  'useModelAspageIdUGCOnPdp',
  'enableNewModal',
  'merchantIDForUGC',
  'merchantGroupIDForUGC',
  'isEnableUGCModalDetails',
  'galleryImageStyle', // GRID_LARGE
  'defaultImageStyle', // SCROLL_LARGE
  'ugcNewHostNameMapping',
  'ugcHostNameToReplace',
  'enableUGCHostNameReplace',
  'siteBrandsList',
  'showAttributionBadging',
  'isEnableLoaderOnPDP',
  'isReviewSearchEnabled',
  'merchantResponseHeaderTitle',
  'displayImagesUnderReviewSection',
  'enableAgeRange',
  'displayRecommendToFriendSection',
  'displaySortAndFilterByOptions',
  'enableWordCloudClickableTags',
  'wordCloudProperties',
  'enableEmplifi',
  'emplifiAPIBaseURL',
  'emplifiAuthKey',
  'enableEmplifiDisclaimerVerification',
  'wordCloudPropEmplifi',
  'enableWriteAReviewCta',
  'hideLastNameOnReviews',
  'showReviewImages',
  'emplifiAiTopicsConfig',
  'enableRatingBreakdown',
  'enableSortAndFilterInReviews',
] as const

const siteFeaturesPreferences = [
  'hideQuantityDropdown',
  'allowRepeatsinLineItemAddition',
  'maximumQuantityRestriction',
  'enableMaxQtyRestriction',
  'maxSwatchImagesVisible',
  'stickyAddToCartEnabled',
  'stickyAddToCartPriceEnabled',
  'stickyATCvarDrawerAttr',
  'enableIncentivizedBadge',
  'enableSwatchesOnVG',
  'showAnimation',
  'tileImageAnimationDelay',
  'tileImageAnimationType',
  'enableMobileAddToBagButton',
  'showMaterialToggle',
  'hideStrikeOffPrice',
  'sourceCodeGroupAttributeMapping',
  'isStoreReplace',
  'accountIconRedirectUrl',
  'stickyOrSlidingHeader',
  'DisplayMaterialInfoinProductTile',
  'displayIcononAddToBagButton',
  'isOutletGatePageEnabled',
  'changeNavDrawerContentLinkPosition',
  'enableCoachUSNavDrawerFY26',
  'isOutletCategoryLogo',
  'isOutletAvailable',
  'enableSitckyFilterSortOnPLP',
  'enableGDPRConsent',
  'isNewMegaPDP',
  'subMaterialCalloutConfig',
  'reviewsOnImageCarouselConfigs',
  'enablePDPLandingExperience',
  'enableMonetate',
  'enableCollapsiblePromoBar',
  'timeZoneOffsetInHours',
  'recentlyViewConfiguration',
  'disableLoaderOnPLP',
  'enableCustomTitle',
  'enableOOSExperience',
  'enableAutoSMSPromo',
  'enableAiSummaryReview',
  'showBundleOnPLP',
  'atbCtaBackgroundColor',
  'enableDynamicSubNavOnHP',
  'enableNewEnvImpactModule',
  'autoApplyMsg',
  'enableVisuallySimilar',
  'viewMorePDP',
  'dynamicSubNavigationStyles',
  'enableExpandedMinProductApi',
  'fbMetaPDP',
  'enableQuickATBonSRP',
  'hideReviewsCountOnPDP',
  'productNameSeparators',
  'enablePersonalization',
  'headerTypeOnPages',
  'utmMedium',
  'similarOptionsCTAConfig',
  'enablePdpFaqContent',
  'enableFaqAccordions',
] as const

const approachingDiscountPreference = ['enableApproachingDiscountOnMiniCart'] as const

const cartCheckoutPreferences = [
  'defaultMaxOrderQuantity',
  'miniBagTimmer',
  'sessionTimeOut',
] as const

const storefrontConfig = [
  'showQuickView',
  'pdpAltImageCarouselThreshold',
  'localeBasedCountrySelectorEnabled',
  'countrySelectorPopUpROW',
  'transparentHeader',
  'configurableHeader',
  'displayOosSwatch',
  'sectionExpandCollapsed',
  'headerScrollingUpTo',
  'defaultSize',
  'maxProductStorage',
] as const

const SLASPlugin = ['enableSLAS'] as const

const shoppingGivesConfig = [
  SHOPPING_GIVES_STORE_ID,
  SHOPPING_GIVES_IS_ENABLED,
  SHOPPING_GIVES_URL,
  SHOPPING_GIVES_GUEST_IS_ENABLED,
  SHOPPING_GIVES_GUEST_CUSTOMER_SEGMENT,
  SHOPPING_GIVES_INSIDER_IS_ENABLED,
] as const

const giftWrappingConfig = [
  'enableGiftWrappingAndMsg',
  'enableGiftWrapping',
  'enableGiftWrapMsg',
] as const

const socialMediaPreferences = [
  'isFacebookSharingEnabled',
  'isTwitterSharingEnabled',
  'isPinterestSharingEnabled',
  'isEmailSharingEnabled',
  'isLineShareEnabled',
] as const

const klarnaPaymentPreferences = ['enableKlarna'] as const
const brandProductPreferences = [
  'isEnableContentOne',
  'isEnableContentTwo',
  'isEnableContentThree',
  'isEnableContentFour',
  'pdpContentAreaOne',
  'pdpContentAreaTwo',
  'pdpContentAreaThree',
  'pdpContentAreaFour',
] as const

const countrySelectorPreferences = ['countrySelectorURL'] as const
const sceneSevenPreferences = ['enableThumbnailPdpSwatch', 'placeholderAssetName'] as const

const certonaPreferences = [
  'CertonaEnabled',
  'CertonaSlotConfig',
  'CertonaResonanceJavaScript',
] as const

const pdpPreferences = [
  'disableRecommendationOnPDP',
  'disableRecentlyViewedOnPDP',
  'inventoryMessageTypes',
  'enableProductSKU',
  'enablePriceTaxIncluded',
  'showBuyNowButton',
  'buyNowURL',
  'buyNowColor',
  'imageType1to1AspectRatio',
  'enableVisualProductDetail',
  'visualProductDetailConfigs',
  'rotatingBannerSequence',
  'attentiveCreativeId',
  'pdp6AccordionConfigs',
  'enableFlockColorSwatches',
  'socialProofDataWindow',
  'bopisInventoryScarcity',
  'pdpTemplates',
  'enableThumbnailCarouselOnPDP',
  'enableZoomImageModalOnPDP',
  'templateConfigs',
  'newStructuredCopy',
] as const

const paidy = ['paidy_enabled', 'show_paidy_pdp', 'paidy_script_url'] as const

const priceSitePreferences = [
  'isComparablePriceValue',
  'priceRangeToggle',
  'markDownPriceStyle',
  'promotionalPriceToggle',
  'hideListPrice',
  'enableOptInOnNotifyMe',
] as const

const tulipChatPreferences = [
  'tulipIntegrationID',
  'enableTulipChat',
  'countriesConfigJSONTulip',
  'excludeTulipChatOnPages',
  'includeTulipChatTriggerCopyOnPages',
  'tulipChatCacheUnit',
  'tulipCDNFileURL',
  'customCSSForTulip',
  'tulipChatBubbleIcon',
] as const

const loopCommercePreferences = [
  'loopEnabled',
  'loopStoreShortname',
  'loopDWLoopUsername',
  'loopDWLoopPassword',
  'loopJSLocation',
  'loopSupportsPriceGuarantee',
  'storeLocale',
  'loopLargeImageType',
  'loopSwatchImageType',
] as const
const closerLookImagePrefrences = ['closerLookImageSuffix'] as const
const Customizer = [
  'CustomizerEnabled',
  'CustomizerMonogrammingEnabled',
  'CustomizerApiKey',
  'CustomizerHideTags',
  'CustomizerAddonHangtags',
  'customizerTextConfigs',
] as const

const storelocatorSitePreferences = [
  'bopisAllowedCustomerGroups',
  'isToggleOnLimitedStoreFeature',
  'hideSubtitleFindInStore',
] as const

const SEOSitePreferences = [
  'baseURLsForLocales',
  'hreflangSoruceLocales',
  'nonIndexableURLParameters',
  'homePageCustomHreflang',
  'minProductsForIndex',
  'indexableFeaturedQueries',
  'enableSEONavigation',
] as const

const bundleConfigurationPreferences = [
  'showBundleListPrice',
  'hideBundleProductATCButton',
  'bundleListPriceCaption',
] as const

const sustainabilityIconOnImage = [
  'SustainabilityIconOnImage',
  'SustainabilityModuleToggle',
] as const

const wyng = [
  'isEnableWyngOnHomePage',
  'enableWyng',
  'isEnableWyngOnPdpPage',
  'isEnableWyngOnPlpPage',
  'wyngFilterUUID',
  'wyngToken',
  'isEnableViewGalleryCTA',
  'wyngExternalIDType',
] as const

const pixleeUGC = [
  'enablePixleeUGC',
  'pixleeUGCAlbumID',
  'pixleeAPIKey',
  'enablePixleeUGCHome',
  'pixleeUGCPageSize',
  'enableViewGalleryCTA',
  'enablePixleeUGCPlp',
  'enablePixleeUGCPdp',
  'enableUgcVideo',
] as const

const retentionToastMessageOnMobile = [
  'displayRetentionToastOnMobileDrawer',
  'retentionToastMessageText',
] as const

const TrueFit = ['enableTrueFit', 'truefitClientID', 'trueFitApiUrl'] as const
const recaptcha = [
  'enableCaptchaValidation',
  'googleCaptchaSiteKey',
  'enableCaptchaValidationAvsFlyout',
  'enableEnterpriseCaptchaValidation',
  'captchaEnterpriseSiteKey',
  'googleProjectID',
] as const

const TangibleePreferences = [
  'TANGIBLEE_INTEGRATION_SCRIPT',
  'TANGIBLEE_ANALYTICS_TRACKING_ID',
  'TANGIBLEE_API',
  'TANGIBLEE_ANALYTICS_SCRIPT',
  'BRAND_URL',
  'IS_TANGIBLEE_ENABLED',
  'TANGIBLEE_CTA_ON_HERO_IMAGE',
  'enableStrategicTangiblee',
  'strategicTangibleePlacement',
  'enableCompareModeOnCTAOne',
  'enableViewIn2DContext',
  'TANGIBLEE_INTEGRATION_SCRIPT_PDPV7',
  'TANGIBLEE_WFI_CTR_ID',
  'TANGIBLEE_CHARMS_CTR_ID',
] as const

const BambuserPreferences = ['isEnabled', 'scriptSrc', 'liveStreamID'] as const

const CertonaConfigurationPreferences = [
  'Certona_HP_Visibility',
  'HomePageCertonaSlotConfig',
  'CertonaHomePageCTA',
  'hideCertonaDiscountHomePage',
  'certonaPriceDisplay',
  'certonaSubDomain',
  'certonaATBConfigs',
] as const

const salePreferences = ['enableSaleSuppression', 'enablePdpSwatchSuppression'] as const
const SfraUnifiedFeatureCartridgePreferences = [
  'sfraEnableOverlayFindInStore',
  'sfraEnableOverlayInStorePickup',
  'sfraEnableFindInStoreV4',
] as const

const recommendations = [
  'hideRecommendationPrice',
  'disableRecommendationOnPages',
  'hideRecentlyViewedOnPages',
  'hideRecommendations',
  'isCertonaEnableOnATC',
  'isCertonaEnableOnATCDesktop',
  'hideRecommendationPriceOnATC',
  'recViewMoreUrl',
  'priceConfiguration',
  'disabledSchemes',
  'atbDisabledSchemes',
  'promoDisabledSchemes',
  'enablePlpInGridRecommendations',
  'enablePdpGatingForPlpRecs',
] as const

const paypalExpressCheckoutPreferences = ['PP_ShowExpressCheckoutButtonOnCart'] as const

const generalConfiguration = [
  'siteIdentifier',
  'enableNewGlobalHeader',
  'enableExposedSearchHeader',
  'changeSalePriceColor',
] as const

const liveStreamingConfig = ['liveStreamingMenuitem'] as const

const stickyNavigation = ['PDPstickyNavigation'] as const

const outletConfigurationsPreferences = [
  'outletCookieLife',
  'outletGateCookieName',
  'outletPostGateCookieName',
  'outletGateThemeToggle',
  'PhoneQueueEnableOutlet',
  'outletPhoneNumberFieldDisable',
  'addOutletFilter',
  'byPassOutletGatePageURLParams',
  'outletCategoryID',
  'outletGatePhoneRegex',
  'enableMWOutletGatePhone',
] as const

const storeLocatorURL = ['store_url'] as const

const EinsteinRecommendation = [
  'einsteinAPIUrl',
  'einsteinSiteId',
  'einsteinClientId',
  'isEinsteinRecomEnabled',
  'recommendorsList',
  'isEinsteinRecomEnabledPDP',
  'isEinsteinRecomEnabledPLP',
  'isEinsteinRecomEnabledCart',
  'isEinsteinRecomEnabledWishlist',
  'isEinsteinRecomEnabledAccount',
  'isEinsteinRecomEnabledSearch',
  'isEinsteinRecomEnabledSearchSuggestion',
  'einstineSlideConfig',
] as const

const coachtopia = [
  'coachtopiaHomeURL',
  'coachtopiaGlobalConfig',
  'enableCoachTopia',
  'environmentImpactViewDataSourcesPath',
  'productConnectURL',
  'coachtopiaRootCategory',
  'envImpactModalHeadline',
  'suppressEONCall',
  'internationalModalContentAsset',
  'productCertificatePopUp',
  SHOPPING_GIVES_GUEST_IS_ENABLED_SUB_BRAND,
  SHOPPING_GIVES_INSIDER_IS_ENABLED_SUB_BRAND,
  'newCoachtopiaNav',
  'poshmarkConfigs',
  'enableCoachtopiaSearchFilter',
  'enableCoachtopiaButton',
  'careInstructionsCTALink',
] as const
const thredUp = ['thredUpContent'] as const
const Adyen = ['AdyenAssociatedPaymentsEnabled', 'AdyenKlarnaOSMClient'] as const

const amazonPay = ['enableAmazonPayMinicart', 'amazonPayScript'] as const

const reminderInCart = ['RICMasterFlag', 'RICSettingsJSON'] as const

const adaptiveExperience = [
  'enableEnhancedYMALLander',
  'enableAEDrawerExp',
  'reviewOverlayStyle',
  'goneViral',
  'recommendCategories',
  'becauseYouViewed',
  'inlineSearch',
  'inlineSearchPlaceholders',
  'inlineSearchPills',
  'enableEnhancedATBDrawer',
  'loveAtFirstSwipe',
  'dealRecommendations',
  'windowShop',
  'surveyDetails',
  'plpCatRecommendationsToggle',
  'enableLookBook',
  'matchingExperience',
  'subnavVariants',
  'recommendedCategoriesOnCLPs',
] as const

const insideChat = ['enableInsideChat', 'insideScript'] as const

const plpTemplateConfigurations = [
  'displayVideosInAltImage',
  'sortTypeId',
  'HideDiscountPercentageOnPLP',
  'SiteLevelDisplayPLPSubNAV',
  'plpTemplateVersion',
  'plpTemplateVersionDesktop',
  'onModelPLPConfig',
  'enableFallbackOosFrp',
  'enableVideoInCarousel',
] as const

const gtm = ['gtm_path'] as const

const ImageSequence = [
  'EnableCategoryAltImageSequence',
  'enablePDPAltImageSequence',
  'imageVideoSequence',
] as const

const fullBleed = ['fullBleedColorLightness', 'dynamicAssetConfig'] as const
const Monetate = ['monetateScriptUrl'] as const

const inventoryLookup = ['thresholdInventoryRV'] as const

const liveChatPreferences = [
  'enableLiveChat',
  'countriesConfigJSON',
  'enableLiveChatOnDevices',
  'excludeLiveChatOnPages',
] as const

const compareConfigs = ['featureVisibility'] as const
const applePayConfigs = [
  'enableApplePayOnPDP',
  'appleValidationURL',
  'countrySpecificConfig',
  'Adyen_Mode',
  'Adyen_ClientKey',
  'forterSiteID',
  'applePayAllowedCountryCodesForCheckout',
] as const

const headless = ['enableCCAPIForInventory', 'enableCCAPIForProduct'] as const

const oneCoach = ['oneCoachTabConfig'] as const

const afterPay = ['enableAfterpay', 'apJavaScript', 'afterPayMPID'] as const

const xgenPreferences = [
  'enableXgen',
  'xgenAppKey',
  'xgenCustomerId',
  'xgenTrackerId',
  'xgenClientID',
  'xgenDeploymentID',
  'enableXgenReco',
  'enableXgenSearch',
  'XgenTracking',
  'searchV2Features',
  'enableStoreContext',
  'enableCOJDiscountCalcOnPWA',
] as const

const affirm = [
  'AffirmOnline',
  'AffirmProductMessage',
  'AffirmScriptURL',
  'AffirmPublicKey',
  'AffirmPaymentMinTotal',
  'AffirmPaymentMaxTotal',
] as const

const staffStartPreferences = ['enableStaffStart', 'merchantId', 'scriptURL'] as const

const SFCCAnalytics = ['enableSFCCAnalytics', 'sfccAnalyticsScripts'] as const

const oneSite = [
  'enableOneSite',
  'oneSiteConfig',
  'enableFallbackPricing',
  'enableFrpPricingOnPlp',
  'oneSitePDPConfig',
  'evergreenKeywordsRetail',
  'evergreenKeywordsOutlet',
  'abtestKeywordsRetail',
  'abtestKeywordsOutlet',
  'fuzzyMatchingThreshold',
] as const

const aiGiftConcierge = ['aiGiftConciergeData'] as const

const AccessorizeItPreferences = ['addACharmCTAImageSuffix'] as const

const customer360Preferences = ['disableUserEmailOptIn'] as const

export default {
  badging: badgingPreferences,
  SEOSitePreferences,
  searchRefinements: searchRefinementsPreferences,
  SearchSuggestions: searchSuggestionsPreferences,
  lazyLoad: lazyLoadPreferences,
  navFlyoutStylings: navFlyoutPreferences,
  ToggleSiteFeatures: siteFeaturesPreferences,
  CartCheckoutSettings: cartCheckoutPreferences,
  'Storefront Configs': storefrontConfig,
  'SLAS Plugin': SLASPlugin,
  powerReviews: powerReviewsPreferences,
  CountrySelector: countrySelectorPreferences,
  SocialMediaSharing: socialMediaPreferences,
  sceneSeven: sceneSevenPreferences,
  Klarna_Payments: klarnaPaymentPreferences,
  brandProdAttributes: brandProductPreferences,
  Certona: certonaPreferences,
  PDPPreferences: pdpPreferences,
  LoopCommerce: loopCommercePreferences,
  closerLookAttributes: closerLookImagePrefrences,
  priceSitePreferences: priceSitePreferences,
  tulipChatConfigs: tulipChatPreferences,
  Customizer: Customizer,
  'StoreLocator Configs': storelocatorSitePreferences,
  [SHOPPING_GIVES_GROUP_ID]: shoppingGivesConfig,
  bundleConfigurations: bundleConfigurationPreferences,
  giftWrapping: giftWrappingConfig,
  sustainabilityIconPrefs: sustainabilityIconOnImage,
  CertonaConfiguration: CertonaConfigurationPreferences,
  wyng,
  retentionToastMessageOnMobile,
  TrueFit,
  salePreferences,
  recommendations: recommendations,
  Tangiblee: TangibleePreferences,
  recaptcha,
  paypalExpressCheckout: paypalExpressCheckoutPreferences,
  generalConfiguration,
  'SFRA Unified Feature Cartridge': SfraUnifiedFeatureCartridgePreferences,
  liveStreamingConfig,
  stickyNavigation,
  outletGate: outletConfigurationsPreferences,
  Bambuser: BambuserPreferences,
  storeLocatorURL,
  thredUp,
  EinsteinRecommendation,
  coachtopia,
  Adyen,
  AmazonPay_v2: amazonPay,
  ReminderInCart: reminderInCart,
  adaptiveExperience,
  insideChat,
  plpTemplateConfigurations,
  gtm,
  ImageSequence,
  'Full-Bleed': fullBleed,
  Monetate,
  pixleeUGC,
  inventoryLookup,
  paidy,
  sfscChatConfigs: liveChatPreferences,
  CompareConfigs: compareConfigs,
  applePayConfigs,
  headless,
  oneCoach,
  afterPay,
  xgenPreferences,
  affirm,
  staffStartPreferences,
  SFCCAnalytics,
  OneSite: oneSite,
  'Approaching Discount Configs': approachingDiscountPreference,
  aiGiftConcierge,
  AccessorizeIt: AccessorizeItPreferences,
  Customer360: customer360Preferences,
}
