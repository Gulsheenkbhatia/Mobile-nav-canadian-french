export const MOCKED_APP_PREFEERENCES = {
  badging: [
    { id: 'enableBadges', value: true },
    { id: 'enableBestSellerByCategory', value: true },
    { id: 'badgeDetailsJSONpdp', value: [] },
    { id: 'badgeDetailsJSONplp', value: [] },
    { id: 'badgeDetailsJSONminicart', value: [] },
    { id: 'badgePriorityJSONpdp', value: [] },
    { id: 'badgePriorityJSONplp', value: [] },
  ],
  SEOSitePreferences: [
    { id: 'baseURLsForLocales', value: [] },
    { id: 'hreflangSoruceLocales', value: [] },
    { id: 'nonIndexableURLParameters', value: [] },
    { id: 'minProductsForIndex', value: 5 },
  ],
  ToggleSiteFeatures: [
    { id: 'hideQuantityDropdown', value: false },
    { id: 'isStoreReplace', value: true },
    { id: 'DisplayMaterialInfoinProductTile', value: false },
    { id: 'changeNavDrawerContentLinkPosition', value: false },
    { id: 'enableCoachUSNavDrawerFY26', value: false },
    { id: 'isOutletAvailable', value: false },
    { id: 'enableSitckyFilterSortOnPLP', value: false },
    { id: 'enableGDPRConsent', value: false },
    { id: 'isNewMegaPDP', value: false },
  ],
  'Storefront Configs': [
    { id: 'localeBasedCountrySelectorEnabled', value: false },
    { id: 'transparentHeader', value: false },
    { id: 'configurableHeader', value: [] },
  ],
  'SLAS Plugin': [{ id: 'enableSLAS', value: true }],
  powerReviews: [
    { id: 'isEnableUGCModalDetails', value: false },
    { id: 'defaultImageStyle', value: null },
    { id: 'ugcNewHostNameMapping', value: [] },
    { id: 'enableUGCHostNameReplace', value: false },
    { id: 'isEnableLoaderOnPDP', value: true },
    { id: 'isReviewSearchEnabled', value: true },
  ],
  CountrySelector: [{ id: 'countrySelectorURL', value: [] }],
  SocialMediaSharing: [
    { id: 'isFacebookSharingEnabled', value: true },
    { id: 'isTwitterSharingEnabled', value: true },
    { id: 'isPinterestSharingEnabled', value: true },
    { id: 'isEmailSharingEnabled', value: true },
    { id: 'isLineShareEnabled', value: false },
  ],
  sceneSeven: [
    { id: 'enableThumbnailPdpSwatch', value: true },
    {
      id: 'placeholderAssetName',
      value: 'test',
    },
  ],
  Klarna_Payments: [{ id: 'enableKlarna', value: true }],
  brandProdAttributes: [
    { id: 'isEnableContentOne', value: true },
    { id: 'isEnableContentTwo', value: true },
    { id: 'isEnableContentThree', value: true },
    { id: 'isEnableContentFour', value: true },
  ],
  Certona: [
    { id: 'CertonaEnabled', value: true },
    { id: 'CertonaSlotConfig', value: [] },
  ],
  thredUp: [{ id: 'test', value: 'test' }],
  EinsteinRecommendation: [
    { id: 'einsteinAPIUrl', value: 'test' },
    { id: 'isEinsteinRecomEnabled', value: false },
    { id: 'isEinsteinRecomEnabledPDP', value: false },
    { id: 'isEinsteinRecomEnabledPLP', value: false },
    { id: 'isEinsteinRecomEnabledCart', value: false },
    { id: 'isEinsteinRecomEnabledWishlist', value: false },
    { id: 'isEinsteinRecomEnabledAccount', value: false },
    { id: 'isEinsteinRecomEnabledSearch', value: false },
    { id: 'isEinsteinRecomEnabledSearchSuggestion', value: false },
    { id: 'einstineSlideConfig', value: [] },
  ],
}

export const MOCKED_PREFERENCE_VALUES = {
  isStoreReplace: true,
  DisplayMaterialInfoinProductTile: false,
  isEnableUGCModalDetails: false,
}

export const MOCK_PREFERENCE_RESPONSE = [
  { id: 'isStoreReplace', value: true },
  { id: 'DisplayMaterialInfoinProductTile', value: false },
  { id: 'isEnableUGCModalDetails', value: false },
]

export const MOCK_PREFERENCES_GROUPED = {
  ToggleSiteFeatures: {
    isStoreReplace: true,
    DisplayMaterialInfoinProductTile: false,
  },
  powerReviews: {
    isEnableUGCModalDetails: false,
  },
}
