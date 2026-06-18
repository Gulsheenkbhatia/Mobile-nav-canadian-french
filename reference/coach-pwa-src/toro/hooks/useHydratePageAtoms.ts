import { Atom } from 'jotai'
import { useAtomValue, useHydrateAtoms } from 'jotai/utils'
import {
  filtersAtom,
  pageTitleAtom,
  productsAtom,
  refinementsAtom,
  searchResultPageAtom,
  sortingRuleAtom,
  sortOptionsAtom,
  totalPagesAtom,
  totalProductsAtom,
  seoDataAtom,
  defaultSortAtom,
  adjacentPageUrlsAtom,
  initialRouteParamsAtom,
  lazyIndexAtom,
  preloadImageSrcAtom,
  rootCategoryAtom,
  categoryIdAtom,
  targetRefinementAtom,
  customerGroupsAtom,
  disableRVRecommendationsAtom,
  defaultRVRecommendationsClosedAtom,
} from 'store/search-results.atom'
import { badgesAtom } from 'store/badges.atom'
import { globalSlotDataAtom } from 'store/global-content.atom'
import { imagePlaceholderUrlAtom } from 'store/image-placeholder.atom'
import { deriveAdjacentPageUrls, getLazyIndex, getPageTitle } from 'toro/helpers/plp'
import get from 'lodash/get'
import {
  baseCountrySelectorAtom,
  isOneCoachNAEnabledAtom,
  oneCoachNAProductInfoAtom,
  oneSiteActiveBrandAtom,
  oneSiteActiveTabAtom,
  rawMenuDataAtom,
} from 'store/menu-data.atom'
import { useRouter } from 'next/router'
import {
  subBrandSuffixAtom,
  selectedTabsDataAtom,
  isPdpV4ATFFullPricingAtom,
  alterCtaToShowAtom,
  getInitAlterCtaToShow,
  applePayErrorOnPdpAtom,
} from 'store/pdp.atom'
import {
  isSubBrandActiveAtom,
  brandAtom,
  subBrandAtom,
  currentLocaleAtom,
  optimizelyEnabledFeaturesAtom,
  maxCertonadataRecommendationAtom,
  brandThemeAtom,
  isSWOutletAtom,
  isOutletTabAtom,
  getIsOutletTabAtom,
  imageDomainAtom,
} from 'store/global.atom'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import transformPreferences from 'toro/helpers/transformPreferences'
import { normalizeProductVertical } from 'toro/helpers/normalizeProductAttributes'
import { preferencesAtom } from 'store/preferences.atom'
import { envControlledExperimentsAtom, experimentsAtom } from 'store/experiments.atom'
import { getExperiments } from 'toro/helpers/experiments'
import {
  isPlpV3Atom,
  getIsPlpV3,
  isCompletePlpV3DesktopAtom,
  getIsCompletePlpV3Desktop,
  getOnModelPlp2Up,
  isOnModelPlp2UpAtom,
  modelToggleViewAtom,
  ModelToggleView,
  isShopByBrowseAllEnabledAtom,
  onModelAtom,
  enableVisuallySimilarFromCategoryAtom,
} from 'store/plp.atom'
import {
  exposeMobileSearchBarAtom,
  getExposeMobileSearchBar,
  isSearchV2EnabledAtom,
  getIsSearchV2Enabled,
} from 'store/search.atom'
import { thinkPLPAtom } from 'store/think-plp.atom'
import { homepageMatchingExperienceAtom } from 'store/matching-experience'
import { getVisibleMenuData } from 'toro/helpers/menu'
import { deriveSitePreview, sitePreviewAtom } from 'store/site-preview.atom'
import deriveRootCategory from 'toro/helpers/deriveRootCategory'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { getXgenFeaturesConfig } from 'toro/helpers/getXgenFeaturesConfig'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { XgenPreferences } from 'toro/lib/vendorProductsAdapter/shared/types/preferences'
import { intlAtom } from 'store/intl.atom'
import { createIntl, createIntlCache } from 'react-intl'
import { isSWOutletHelper } from 'toro/helpers/isSWOutletHelper'
import { hydrateOneSiteActiveBrand, hydrateOneSiteActiveTab } from 'lib/oneSite/utils'
import { basePathAtom, pathAtom } from 'store/navigation.atom'

const useHydratePageAtoms = (pageProps: { [key: string]: any } = {}) => {
  const { query, asPath, pathname } = useRouter()
  const pageData = get(pageProps, 'pageData', {})
  const appData = get(pageProps, 'appData', {})
  const { brand = '', subBrand = '', brandTheme = '', isSubBrandActive } = appData
  const deviceType = get(pageProps, 'deviceType')
  const isMobile = deviceType === 'smartphone' || deviceType === 'mobile'

  const preferences = transformPreferences(appData?.preferences)
  const isCoachtopiaProduct = get(pageData, 'custom.c_isCoachtopia', false)
  const productVertical = normalizeProductVertical(get(pageData, 'custom.c_productVertical'))
  const isOneCoachNAEnabled = get(preferences, 'OneSite.enableOneSite', false) as boolean

  const subBrandSuffix = isSubBrandActive ? `_${subBrand}` : ''
  const localeData = getCurrentLocale(get(appData, 'locale'))
  const locale = get(localeData, 'locale', '')?.replace('-', '_')
  const optimizelyEnabledFeatures = get(appData, 'optimizelyEnabledFeatures', '')
  const maxCertonadataRecommendation = get(appData, 'maxCertonadataRecommendation', '')
  const envControlledExperiments = get(appData, 'envControlledExperiments', '')
  const isPdpV4ATFFullPricing = get(appData, 'isPdpV4ATFFullPricing')
  const breadcrumbs = get(pageData, 'breadcrumbs', [])
  const isSWOutlet = isSWOutletHelper({ isOneCoachNAEnabled, pathname, breadcrumbs })
  const experiments = getExperiments(envControlledExperiments, optimizelyEnabledFeatures)
  const isShowBundleSave = get(preferences, 'ToggleSiteFeatures.showBundleOnPLP', false)
  const applePayTechnicalErrorMsg = get(appData, 'applePayTechnicalError', '')
  const isShopByBrowseAllEnabled =
    !experiments.includes(EXPERIMENTS.SHOP_BY_BROWSE_BY_CATEGORIES) &&
    !!get(pageData, 'shopByToggle.enabled')

  const xgenPreferences = get(preferences, 'xgenPreferences', {}) as XgenPreferences
  const experimentsSet = new Set(experiments.trim().split('-').filter(Boolean))
  const xgenFeaturesConfig = getXgenFeaturesConfig(xgenPreferences, experimentsSet)

  const menuData = isOneCoachNAEnabled ? pageProps.menuData?.[0] : pageProps.menuData
  const baseCountrySelector = get(appData, 'header.countrySelector')

  // Mount derived path atom
  useAtomValue(pathAtom)

  return useHydrateAtoms([
    [baseCountrySelectorAtom, baseCountrySelector],
    [isOneCoachNAEnabledAtom, isOneCoachNAEnabled],
    [oneCoachNAProductInfoAtom, { productVertical, isCoachtopia: isCoachtopiaProduct }],
    [
      oneSiteActiveBrandAtom,
      hydrateOneSiteActiveBrand({
        defaultAppBrand: brand,
        isOneSiteEnabledPreference: isOneCoachNAEnabled,
        pageDataOneSiteBrand: pageData?.oneSiteActiveBrand,
      }),
    ],
    [
      oneSiteActiveTabAtom,
      hydrateOneSiteActiveTab({
        defaultAppBrand: brand,
        isOneSiteEnabledPreference: isOneCoachNAEnabled,
        pageDataOneSiteBrand: pageData?.oneSiteActiveBrand,
      }),
    ],
    [rawMenuDataAtom, getVisibleMenuData(menuData, {}, isShowBundleSave)],
    [badgesAtom, pageProps.badgingContentSlots || []],
    [globalSlotDataAtom, pageProps.globalSlotData || {}],
    [imagePlaceholderUrlAtom, appData.fallbackImageUrl || ''],
    [imageDomainAtom, appData.imageDomain || ''],
    [sortOptionsAtom, pageData.sortOptions || []],
    [sortingRuleAtom, pageData.srule || ''],
    [refinementsAtom, pageData.refinements || []],
    [filtersAtom, pageData.filters || []],
    [productsAtom, pageData.products || []],
    [searchResultPageAtom, pageData.page || 1],
    [totalProductsAtom, pageData.total || 0],
    [totalPagesAtom, pageData.totalPages || 1],
    [pageTitleAtom, getPageTitle(pageData as Parameters<typeof getPageTitle>[0]) || ''],
    [lazyIndexAtom, getLazyIndex(pageData.pageSize, !!pageData?.topContentSlot?.content?.content)],
    [preloadImageSrcAtom, pageData.preloadImageSrc || ''],
    [seoDataAtom, pageData.seoContent || {}],
    [defaultSortAtom, pageData.defaultSort || ''],
    [rootCategoryAtom, deriveRootCategory(pageData)],
    [categoryIdAtom, pageData.id || ''],
    [initialRouteParamsAtom, { query, asPath, locale: appData?.localeInPath }],
    [
      adjacentPageUrlsAtom,
      deriveAdjacentPageUrls(pageData || {}, query, asPath, appData?.localeInPath),
    ],
    [subBrandSuffixAtom, subBrandSuffix],
    [isSubBrandActiveAtom, isSubBrandActive],
    [brandAtom, brand],
    [subBrandAtom, subBrand],
    [brandThemeAtom, brandTheme],
    [selectedTabsDataAtom, pageData?.selectedTabsData || []],
    [currentLocaleAtom, locale],
    [
      intlAtom,
      createIntl(
        {
          locale: localeData.lang || 'en',
          messages: pageProps?.localeMessages?.[localeData.locale] || {},
        },
        createIntlCache()
      ),
    ],
    [optimizelyEnabledFeaturesAtom, optimizelyEnabledFeatures],
    [preferencesAtom, preferences],
    [maxCertonadataRecommendationAtom, maxCertonadataRecommendation],
    [envControlledExperimentsAtom, envControlledExperiments],
    [experimentsAtom, experiments],
    [isSWOutletAtom, isSWOutlet],
    [isPlpV3Atom, getIsPlpV3(preferences, pageProps)],
    [isCompletePlpV3DesktopAtom, getIsCompletePlpV3Desktop(preferences, pageProps)],
    [exposeMobileSearchBarAtom, getExposeMobileSearchBar(experiments, preferences, pageProps)],
    [isPdpV4ATFFullPricingAtom, isPdpV4ATFFullPricing],
    [alterCtaToShowAtom, getInitAlterCtaToShow(preferences, locale)],
    [applePayErrorOnPdpAtom, { errorType: null, applePayTechnicalErrorMsg }],
    [sitePreviewAtom, deriveSitePreview(pageProps)],
    [isOnModelPlp2UpAtom, getOnModelPlp2Up(pageData)],
    [onModelAtom, get(pageData, 'onModel', {})],
    [
      modelToggleViewAtom,
      get(pageData, 'onModel.isOnModelTabActive') ? ModelToggleView.Model : ModelToggleView.Product,
    ],
    [isShopByBrowseAllEnabledAtom, isShopByBrowseAllEnabled],
    [xgenFeaturesAtom, xgenFeaturesConfig],
    [targetRefinementAtom, get(pageData, 'targetRefinement')],
    [customerGroupsAtom, get(pageData, 'customerGroups')],
    [disableRVRecommendationsAtom, get(pageData, 'disableRVRecommendations', false)],
    [defaultRVRecommendationsClosedAtom, get(pageData, 'defaultRVRecommendationsClosed')],
    [
      isOutletTabAtom,
      getIsOutletTabAtom(asPath, preferences, !!get(pageData, 'custom.c_isOutlet', false)),
    ],
    [
      thinkPLPAtom,
      {
        isThinkPage: get(pageData, 'isThinkPage', false),
        PLPTabColor: get(pageData, 'PLPTabColor', null),
        enableTransparentHeader: get(pageData, 'enableTransparentHeader', false),
      },
    ],
    [isSearchV2EnabledAtom, getIsSearchV2Enabled(preferences, isMobile)],
    [basePathAtom, asPath.replace(/\?.+/, '')],
    [enableVisuallySimilarFromCategoryAtom, get(pageData, 'enableVisuallySimilar', false)],
    [homepageMatchingExperienceAtom, get(pageData, 'matchingExperienceConfig', null)],
  ] as Iterable<readonly [Atom<any>, any]>)
}

export default useHydratePageAtoms
