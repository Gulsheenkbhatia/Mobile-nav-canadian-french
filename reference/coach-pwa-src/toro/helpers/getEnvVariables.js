import isCompleteSlasConfig from 'toro/helpers/isCompleteSlasConfig'
import { isCompleteKlarnaConfig } from './isCompleteConfig'
import { OPTIMIZELY_FEATURES_EXPIRY_TIME } from 'toro/constants/cookies'

const getEnvVariables = () => ({
  nodeEnv: process.env.NODE_ENV,
  brand: process.env.BRAND,
  siteId: process.env.SITE_ID_US,
  brandTheme: process.env.BRAND_THEME ?? '',
  subBrand: process.env.SUB_BRAND,
  ocapiDomain: process.env.OCAPI_BASE_URL,
  environment: process.env.ENVIRONMENT,
  paypalClientId: process.env.PAYPAL_CLIENT_ID,
  paypalEnv: process.env.PAYPAL_ENV,
  showMaterial: process.env.SHOW_MATERIAL,
  isCertonaEnabled: process.env.IS_CERTONA_ENABLED,
  assetsDomain: `https://assets.${process.env.BASE_DOMAIN_PATH}`,
  imageDomain: `https://${process.env.IMAGE_DOMAIN_PATH}`,
  certonaScriptPath: process.env.CERTONA_SCRIPT_PATH,
  isAddToCartDrawerEnabled: process.env.ADD_TO_CART_DRAWER_ENABLED === 'true',
  maxCertonadataRecommendation: process.env.MAX_CERTONADATA_RECOMMENDATION,
  buildId: process.env.CONFIG_BUILD_ID,
  customizerScriptUrl: process.env.CUSTOMIZER_SCRIPT_URL,
  isDiscountOffDisabled: process.env.IS_DISCOUNT_OFF_DISABLED === 'true',
  shoppingGivesIsTest: process.env.SHOPPING_GIVES_IS_TEST_MODE === 'true',
  configMode: process.env.SHOPPING_GIVES_CONFIG_MODE,
  showCertonaBestSelling: process.env.SHOW_CERTONA_BEST_SELLING_PRODUCTS === 'true',
  dollarOffEnabled: process.env.DOLLAR_OFF_ENABLED === 'true',
  isSitePreviewEnabled: process.env.SITE_PREVIEW === 'true',
  backendDomain: process.env.SFCC_BACKEND_DOMAIN_US,
  newSessionMgmt: process.env.NEXT_PUBLIC_NEW_SESSION_MGMT === 'true',
  analytics: {
    googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID_US || process.env.GOOGLE_TAG_MANAGER_ID,
  },
  enableOptimizely: Boolean(process.env.OPTIMIZELY_SCRIPT_URL_US),
  optSDKKey: process.env.OPTIMIZELY_SDK_KEY,
  enableLowPoweredDevice: process.env.ENABLE_LOW_DEVICE === 'true',
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
  showAccountMobileHeader: process.env.SHOW_ACCOUNT_MOBILE_HEADER === 'true',
  liveChatESW: process.env.LIVE_CHAT_ESW,
  paypalDisabledOnMinicart: process.env.PAYPAL_DISABLED_ON_MINICART === 'true',
  limitedProductData: process.env.LIMITED_PRODUCT_DATA === 'true',
  isFullSlasConfig: isCompleteSlasConfig(),
  isEnableCalculateCart: process.env.ENABLE_CALCULATE_CART === 'true',
  isKlarnaConfigExist: isCompleteKlarnaConfig(),
  abtests: {},
  logger: process.env.LOGGER === 'true',
  envControlledExperiments: process.env.ENV_CONTROLLED_EXPERIMENTS,
  envHeaders: process.env.ENV_HEADERS,
  monetateScriptUrl: process.env.MONETATE_SCRIPT_URL,
  isPdpV4ATFFullPricing: process.env.PDPV4_ABOVE_THE_FOLD_FULL_PRICING === 'true',
  enablePricingPromoUpdates: process.env.ENABLE_PROMO_PRICING_UPDATES === 'true',
  adyenMode: process.env.ADYEN_MODE,
  isCacheClearEnabled: getClearCacheStatus(),
  optFeaturesExpiryTime:
    (Number(process.env.OPTIMIZELY_FEATURES_EXPIRY_TIME) || OPTIMIZELY_FEATURES_EXPIRY_TIME) * 1000,
})

export function getClearCacheStatus() {
  return (
    process.env.ENVIRONMENT !== 'production' &&
    !!process.env.AKAMAI_CP_CODE &&
    !!process.env.AKAMAI_ACCESS_TOKEN &&
    !!process.env.AKAMAI_CLIENT_TOKEN &&
    !!process.env.AKAMAI_CLIENT_SECRET &&
    !!process.env.AKAMAI_HOST
  )
}

export default getEnvVariables
