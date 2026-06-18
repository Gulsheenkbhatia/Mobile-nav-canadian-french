import { memo, useContext, useMemo, useCallback } from 'react'
import get from 'lodash/get'
import has from 'lodash/has'
import ContentAreaOne from 'toro/components/product/ContentArea/ContentAreaOne'
import ContentAreaTwo from 'toro/components/product/ContentArea/ContentAreaTwo'
import ContentAreaThree from 'toro/components/product/ContentArea/ContentAreaThree'
import CloserLookArea from 'toro/components/product/CloserLookArea'
import dynamic from 'next/dynamic'
import StickyAnchorLinkNav from 'toro/components/product/StickyAnchorLinkNav/StickyAnchorLinkNav'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ProductDetails from 'toro/components/ProductDetails'
import Box from 'toro/components/Box'
import { useIntl } from 'react-intl'
import usePreference from 'toro/hooks/usePreference_new'
import BenefitsModule from 'toro/components/product/BenefitsModule'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { carouselKeyStateAtom, subBrandSuffixAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import PWAContext from 'components/common/PWAContext'
import EnvironmentImpactCarousel from 'toro/components/passport/EnvironmentImpactCarousel'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import Lazy from 'toro/components/Lazy'
import useExperiment from 'toro/hooks/useExperiment'
import BecauseYouViewedContainer from 'toro/components/Certona/BecauseYouViewedRecommendation/pdp/BecauseYouViewedContainer'
import RecommendedCategoriesContainer from 'toro/components/product/RecommendedCategories'
import EnhancedRecommendationContainer from 'toro/components/EnhancedRecommendation/EnhancedRecommendationContainer'
import SurveyContainer from 'toro/components/Survey/SurveyContainer'
import { IMPRESSION_NAMES } from 'toro/constants/googleAnalytics'
import ProductCompareTool from 'lib/vendorProductsAdapter/features/ProductCompareTool'
import withVendorSwitch from 'toro/hocs/withVendorSwitch'

const CertonaRecommendations = dynamic(() => import('toro/components/Certona/Recommendation'), {
  ssr: false,
})

const CertonaTabbedRecommendation = dynamic(
  () => import('toro/components/Certona/TabbedRecommendation'),
  {
    ssr: false,
  }
)
const PDPRecommendationsTabbedContainer = dynamic(
  () => import('toro/components/RecommendationsTabbedContainer/PDPRecommendationsTabbedContainer'),
  {
    ssr: false,
  }
)

const EinsteinRecommendationWrapper = dynamic(
  () => import('toro/components/Einstein/RecommendationContainer'),
  {
    ssr: false,
  }
)

const ShoppingGivesWidget = dynamic(() => import('toro/components/product/ShoppingGivesWidget'), {
  ssr: false,
})

const RatingsAndReviews = dynamic(
  () => import('toro/components/product/ProductMainSection/LazyRatingsAndReviews'),
  {
    ssr: false,
  }
)

const UGCContainer = dynamic(() => import('toro/components/UGC/UGCContainer'), {
  ssr: false,
})

const RecommendationWithMatchingExperience = withVendorSwitch(
  CertonaTabbedRecommendation,
  PDPRecommendationsTabbedContainer
)

const AdditionalDetailsV3 = ({
  closerLookProps,
  isBundleProduct,
  contentAreaOne,
  contentAreaTwo,
  contentAreaThree,
  apploading,
  isHideReview,
  ratingsAndReviews,
  certona,
  productDetailsProps,
  benefitsModuleData,
  envImpactSlides,
  envImpactModalHeadline,
  ugc,
  masterId,
  similarProductConfigs,
  itemId,
  parentCategoryId,
}) => {
  const styles = useMultiStyleConfig('ProductDetailMainSection')
  const isReviewSectionUnderProductImage = useExperiment(EXPERIMENTS.REVIEW_UNDER_PRODUCT_IMAGE)
  const isEnhancedRecommendationExperiment = useExperiment(EXPERIMENTS.ENHANCED_RECOMMENDATION)

  const { isDiscontinued, shoppingWidgetProps, selectedColor } = useContext(
    ProductMainSectionBreakpointContext
  )

  const { ymalScheme, recentlyViewedScheme } = certona || {}

  const subBrandSuffix = useAtomValue(subBrandSuffixAtom)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const showEnvImpactSlides = Boolean(envImpactSlides?.length)

  const { appData = {} } = useContext(PWAContext)

  const { locale } = appData || {}
  const localeData = normalizeLocalizationContent(locale)
  const currentLocale = localeData?.locale?.replace?.('-', '_')

  const { formatMessage } = useIntl()
  const siteId = get(appData, 'siteId')

  const isPDPLoaded = has(productDetailsProps, 'productData.variant')
  const selectedVariantGroupId = get(productDetailsProps, 'productData.selectedVariantGroupId')
  const productId = selectedVariantGroupId || masterId

  const {
    toggleSiteFeatures: { enableNewEnvImpactModule = false },
    einsteinRecommendation: einsteinRecommenderPref,
    stickyNavigation: { PDPstickyNavigation: pdpStickyNav },
    powerReviews: { enableEmplifi = false },
    recommendations: {
      disableRecommendationOnPages,
      hideRecommendationPrice: hideYmalPrice,
      hideRecentlyViewedOnPages,
      hideRecommendations,
      hideRecommendationPrice,
    },
    adaptiveExperience: { enableEnhancedYMALLander, surveyDetails },
  } = usePreference({
    EinsteinRecommendation: [
      'isEinsteinRecomEnabled',
      'isEinsteinRecomEnabledPDP',
      'recommendorsList',
    ],
    stickyNavigation: ['PDPstickyNavigation'],
    powerReviews: ['enableEmplifi'],
    recommendations: '*',
    ToggleSiteFeatures: ['enableNewEnvImpactModule'],
    adaptiveExperience: ['enableEnhancedYMALLander', 'surveyDetails'],
  })

  const hideYmalOnPDP = disableRecommendationOnPages?.includes('PDP')
  const hideRecentlyViewedPDP = hideRecentlyViewedOnPages?.includes('PDP')
  const isEinsteinYAMLEnabled = !hideYmalOnPDP && !hideRecommendations
  const isEinsteinRVEnabled = !hideRecentlyViewedPDP && !hideRecommendations

  const [yamlRecommender, rvRecommender] = einsteinRecommenderPref?.recommendorsList?.PDP || []

  const showRecommendationInNavLink = useMemo(() => {
    const isRecommendationEnabledonPDP =
      hideYmalOnPDP !== 'true' || hideRecentlyViewedPDP !== 'true'
    const isEinsteinRecommendationEnabledOnPDP =
      isRecommendationEnabledonPDP &&
      einsteinRecommenderPref?.isEinsteinRecomEnabled &&
      einsteinRecommenderPref?.isEinsteinRecomEnabledPDP
    const isCertonaDataExists =
      Boolean(ymalScheme?.items?.length) && ymalScheme?.display?.toLowerCase() !== 'no'
    return (
      isEinsteinRecommendationEnabledOnPDP ||
      (!hideRecommendations && isRecommendationEnabledonPDP && isCertonaDataExists)
    )
  }, [ymalScheme])

  const showRatingsAndReviews =
    !isReviewSectionUnderProductImage &&
    !isBundleProduct &&
    !apploading &&
    !isHideReview &&
    enableEmplifi

  const showRecentlyViewed = !hideRecommendations && hideRecentlyViewedPDP !== 'true'
  const isAnyRecommendationsEnabled = !hideRecommendations && hideYmalOnPDP !== 'true'

  const navLinksV3 = [
    {
      elementId: 'impact',
      title: formatMessage({
        id: `pdp.navlink.impact${subBrandSuffix}`,
        defaultMessage: 'Impact',
      }),
      isEnable: enableNewEnvImpactModule ? false : showEnvImpactSlides,
    },
    {
      elementId: 'closerlook-section',
      title: formatMessage({
        id: `pdp.navlink.closerlook${subBrandSuffix}`,
        defaultMessage: 'A CLOSER LOOK',
      }),
      isEnable: closerLookProps.isCloserLookEnable,
    },
    {
      elementId: 'product-info',
      title: formatMessage({
        id: `pdp.navlink.productInfo${subBrandSuffix}`,
        defaultMessage: 'PRODUCT INFO',
      }),
      isEnable: true,
    },
    enableNewEnvImpactModule && {
      elementId: 'impact',
      title: formatMessage({
        id: `pdp.navlink.impact${subBrandSuffix}`,
        defaultMessage: 'Impact',
      }),
      isEnable: enableNewEnvImpactModule ? showEnvImpactSlides : false,
    },
    {
      elementId: 'ratings-review-section',
      title: formatMessage({
        id: `pdp.navlink.reviews${subBrandSuffix}`,
        defaultMessage: 'REVIEWS',
      }),
      isEnable: enableEmplifi && !isBundleProduct && !apploading && !isHideReview,
    },
    {
      elementId: 'recommendations-section',
      title: formatMessage({
        id: `pdp.navlink.recommendations${subBrandSuffix}`,
        defaultMessage: 'RECOMMENDATIONS',
      }),
      isEnable: showRecommendationInNavLink,
    },
  ]

  return (
    <>
      {!isBundleProduct && !selectedColor?.sizes?.length && (
        <Experiment
          forIDs={`${EXPERIMENTS.COMPARISON_TOOL_EXPERIENCE}-${EXPERIMENTS.TAB_COMPARISON_TOOL_EXPERIENCE}`}
        >
          <ProductCompareTool
            type="product5_rr"
            productDetailsProps={productDetailsProps}
            selectedColor={selectedColor}
          />
        </Experiment>
      )}

      {!!pdpStickyNav && isSubBrandActive && (
        <StickyAnchorLinkNav
          navlinks={navLinksV3}
          productId={get(productDetailsProps, 'productData.selectedVariantGroupId', masterId)}
        />
      )}
      <Box id="you-love-it" sx={styles.additionalDetailsContainer}>
        {showEnvImpactSlides && isSubBrandActive && !enableNewEnvImpactModule && (
          <Box id="impact" p="mar">
            <EnvironmentImpactCarousel
              impacts={envImpactSlides}
              title={envImpactModalHeadline}
              locale={currentLocale}
              rotateGlobeIcon={appData.coachtopiaRotatingGlobe}
              location="product"
            />
          </Box>
        )}
        {closerLookProps.isCloserLookEnable && <CloserLookArea {...closerLookProps} />}
        <BenefitsModule {...benefitsModuleData} />
        <Box
          p="mar"
          display="inherit"
          className="product-details"
          sx={styles.productDetailsContainer}
        >
          <Flex w="100%" sx={styles.productDetailsWrapper}>
            <ProductDetails {...productDetailsProps} />
          </Flex>
        </Box>
        {showEnvImpactSlides && isSubBrandActive && enableNewEnvImpactModule && (
          <Box id="impact" p="mar">
            <EnvironmentImpactCarousel
              impacts={envImpactSlides}
              title={envImpactModalHeadline}
              locale={currentLocale}
              rotateGlobeIcon={appData.coachtopiaRotatingGlobe}
              location="product"
            />
          </Box>
        )}
        {similarProductConfigs && (
          <Experiment forIDs={EXPERIMENTS.CERTONA_INLINE_RECOMMENDATION_EXPERIENCE}>
            <RecommendationWithMatchingExperience
              hideRecommendationPrice={hideRecommendationPrice}
              matchExperienceConfig={similarProductConfigs}
              pageType="product"
              variant="tabbedPDPRecommendation"
              itemId={itemId}
              type={similarProductConfigs?.recommender}
            />
          </Experiment>
        )}
        {isAnyRecommendationsEnabled && (
          <>
            {isEnhancedRecommendationExperiment && enableEnhancedYMALLander ? (
              <EnhancedRecommendationContainer
                recommendationData={ymalScheme}
                label={formatMessage({
                  id: 'pdp.enhancedYMAL.title',
                  defaultMessage: ymalScheme?.explanation,
                })}
              />
            ) : (
              <Experiment notForIDs={EXPERIMENTS.CERTONA_INLINE_RECOMMENDATION_EXPERIENCE}>
                <CertonaRecommendationsYMAL
                  masterId={masterId}
                  apploading={apploading}
                  ymalScheme={ymalScheme}
                  hideYmalPrice={hideYmalPrice}
                  productDetailsProps={productDetailsProps}
                />
              </Experiment>
            )}
          </>
        )}
        <BecauseYouViewedContainer />

        {showRecentlyViewed && (
          <RecentlyViewed
            apploading={apploading}
            hideYmalPrice={hideYmalPrice}
            recentlyViewedScheme={recentlyViewedScheme}
          />
        )}

        {isEinsteinYAMLEnabled && (
          <EinsteinRecommendationWrapper
            pageType="PDP"
            siteId={siteId}
            recommenderData={yamlRecommender}
            productId={productId}
            triggerPageViewImpression={isPDPLoaded}
            type="yaml"
            label={formatMessage({
              id: 'pdp.product.youMayLike',
              defaultMessage: `${yamlRecommender?.recommenderName}`,
            })}
            scheme="product1_rr"
            variant="pdpV3EinsteinRecommendationMobile"
          />
        )}
        {isEinsteinRVEnabled && (
          <EinsteinRecommendationWrapper
            pageType="PDP"
            siteId={siteId}
            recommenderData={rvRecommender}
            productId={productId}
            triggerPageViewImpression={!isEinsteinYAMLEnabled && isPDPLoaded}
            type="recentlyviewed"
            label={formatMessage({
              id: 'pdp.product.recentlyViewed',
              defaultMessage: `${rvRecommender?.recommenderName}`,
            })}
            scheme="product2_rr"
            variant="pdpV3EinsteinRecommendationMobile"
          />
        )}
        {!isBundleProduct && !isDiscontinued && (
          <Lazy>
            <ShoppingGivesWidget {...shoppingWidgetProps} />
          </Lazy>
        )}
        {!isBundleProduct && (
          <Box sx={styles.contentAreaContainer}>
            <ContentAreaOne {...contentAreaOne} />
            <ContentAreaTwo {...contentAreaTwo} />
            <ContentAreaThree {...contentAreaThree} />
          </Box>
        )}
      </Box>
      <Box id="just-for-you" sx={styles.additionalDetailsContainer}>
        <RecommendedCategoriesContainer categoryId={parentCategoryId} />
        {showRatingsAndReviews && <RatingsAndReviews {...ratingsAndReviews} />}
        <UGCContainer {...ugc} variant="pdpV3WyngMobile" />
      </Box>
      <SurveyContainer answers={get(surveyDetails, `${currentLocale}.answers`)} />
    </>
  )
}

const RecentlyViewed = ({ recentlyViewedScheme, hideYmalPrice, apploading }) => {
  const carouselKeyState = useAtomValue(carouselKeyStateAtom)
  const { formatMessage } = useIntl()

  return (
    <div id="recommendations-section" key={`${carouselKeyState + 'recently-viewed'}`}>
      <CertonaRecommendations
        type="recentlyviewed"
        isloading={apploading}
        hidePrice={hideYmalPrice}
        certonaData={recentlyViewedScheme}
        label={
          recentlyViewedScheme?.explanation ||
          formatMessage({ id: 'pdp.product.recentlyViewed', defaultMessage: 'Recently viewed' })
        }
        variant="pdpV3RecommendationMobile"
        impressionName={IMPRESSION_NAMES[recentlyViewedScheme?.scheme]}
      />
    </div>
  )
}

const CertonaRecommendationsYMAL = ({
  masterId,
  apploading,
  ymalScheme,
  hideYmalPrice,
  productDetailsProps,
}) => {
  const carouselKeyState = useAtomValue(carouselKeyStateAtom)
  const { formatMessage } = useIntl()

  const certonaWrapper = useCallback(
    ({ children }) => (
      <div id="recommendations-section" className="certona_wrapper" key={carouselKeyState}>
        {children}
      </div>
    ),
    [carouselKeyState]
  )

  return (
    <div id="recommendations-section" className="certona_wrapper" key={carouselKeyState}>
      <CertonaRecommendations
        type="yaml"
        isloading={apploading}
        certonaData={ymalScheme}
        hidePrice={hideYmalPrice}
        wrapperComponent={certonaWrapper}
        label={
          ymalScheme?.explanation ||
          formatMessage({ id: 'pdp.product.youMayLike', defaultMessage: 'You may also like' })
        }
        variant="pdpV3RecommendationMobile"
        productId={get(productDetailsProps, 'productData.selectedVariantGroupId') || masterId}
      />
    </div>
  )
}

export default memo(AdditionalDetailsV3)
