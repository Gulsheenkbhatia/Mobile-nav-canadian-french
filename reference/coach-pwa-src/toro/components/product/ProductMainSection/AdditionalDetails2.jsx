import { memo, useCallback, useContext, useMemo } from 'react'
import get from 'lodash/get'
import has from 'lodash/has'
import ContentAreaOne from 'toro/components/product/ContentArea/ContentAreaOne'
import ContentAreaTwo from '../ContentArea/ContentAreaTwo'
import ContentAreaThree from 'toro/components/product/ContentArea/ContentAreaThree'
import CloserLookArea from 'toro/components/product/CloserLookArea'
import dynamic from 'next/dynamic'
import StickyAnchorLinkNav from 'toro/components/product/StickyAnchorLinkNav/StickyAnchorLinkNav'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ProductDetails from 'toro/components/ProductDetails'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
import { useIntl } from 'react-intl'
import SocialMediaArea from 'toro/components/product/SocialMediaArea'
import useHasMounted from 'toro/hooks/useHasMounted'
import usePreference from 'toro/hooks/usePreference_new'
import PWAContext from 'components/common/PWAContext'
import usePreferenceGroup from 'toro/hooks/usePreferenceGroup'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import EnvironmentImpactCarousel from 'toro/components/passport/EnvironmentImpactCarousel'
import { carouselKeyStateAtom, subBrandSuffixAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import CustomSlot from 'toro/cms/components/CustomSlot'
import PaymentLogos from 'toro/components/PaymentLogos'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import FAQComponent from 'toro/components/FAQComponent'

const CertonaRecommendations = dynamic(() => import('toro/components/Certona/Recommendation'), {
  ssr: false,
})

const EinsteinRecommendationWrapper = dynamic(
  () => import('toro/components/Einstein/RecommendationContainer'),
  {
    ssr: false,
  }
)

const RatingsAndReviews = dynamic(
  () => import('toro/components/product/ProductMainSection/LazyRatingsAndReviews'),
  {
    ssr: false,
  }
)

const UGCContainer = dynamic(() => import('toro/components/UGC/UGCContainer'), {
  ssr: false,
})

const SustainableExperienceSlider = dynamic(
  () => import('toro/components/product/SustainableExperience/SustainableExperienceSlider'),
  { ssr: false }
)

const AdditionalDetails = ({
  closerLookProps,
  sustainabilityProps,
  isBundleProduct,
  isDiscontinued,
  contentAreaOne,
  contentAreaTwo,
  contentAreaThree,
  ugc,
  apploading,
  isHideReview,
  ratingsAndReviews,
  masterId,
  certona,
  productDetailsProps,
  SocialMediaAreaProps,
  envImpactSlides,
  envImpactModalHeadline,
  PaymentLogosProps,
}) => {
  const { appData } = useContext(PWAContext)
  const styles = useMultiStyleConfig('ProductDetailMainSection')
  const { isDesktop, isMobile } = useViewportType()
  const hasMounted = useHasMounted()
  const subBrandSuffix = useAtomValue(subBrandSuffixAtom)
  const isReviewSectionUnderProductImage = useExperiment(EXPERIMENTS.REVIEW_UNDER_PRODUCT_IMAGE)
  const showEnvImpactSlides = Boolean(envImpactSlides?.length)
  const isPDPLoaded = has(productDetailsProps, 'productData.variant')
  const selectedVariantGroupId = get(productDetailsProps, 'productData.selectedVariantGroupId')
  const productId = selectedVariantGroupId || masterId

  const { ymalScheme, recentlyViewedScheme } = certona || {}

  const { formatMessage } = useIntl()

  const siteId = get(appData, 'siteId')

  const {
    sustainabilityIconPrefs: { SustainabilityModuleToggle: isSustainabilityModuleEnabled = false },
    stickyNavigation: { PDPstickyNavigation: pdpStickyNav = false },
    powerReviews: { enableEmplifi = true },
    recommendations: {
      disableRecommendationOnPages,
      hideRecommendationPrice: hideYmalPrice,
      hideRecentlyViewedOnPages,
      hideRecommendations,
    },
    wyngPreferences,
  } = usePreference({
    sustainabilityIconPrefs: ['SustainabilityModuleToggle'],
    stickyNavigation: ['PDPstickyNavigation'],
    powerReviews: ['enableEmplifi'],
    recommendations: '*',
    wyng: ['enableWyng', 'isEnableWyngOnPdpPage'],
  })

  const hideYmalOnPDP = disableRecommendationOnPages?.includes('PDP')
  const hideRecentlyViewedPDP = hideRecentlyViewedOnPages?.includes('PDP')

  const { locale } = appData || {}
  const localeData = normalizeLocalizationContent(locale)
  const currentLocale = localeData?.locale?.replace?.('-', '_')

  const isAnyRecommendationsEnabled = !hideRecommendations && hideYmalOnPDP !== 'true'

  const einsteinRecommenderPref = usePreferenceGroup({ groupId: 'EinsteinRecommendation' })
  const einsteinRecommenderPreferences = einsteinRecommenderPref?.reduce((obj, pref) => {
    return { ...obj, [pref?.id]: getSiteValueFromPref(pref, siteId) }
  }, {})

  const { isEinsteinRecomEnabledPDP, isEinsteinRecomEnabled, recommendorsList } =
    einsteinRecommenderPreferences
  const [yamlRecommender, rvRecommender] = get(recommendorsList, 'PDP', [])
  const isEinsteinYAMLEnabled = !hideYmalOnPDP && !hideRecommendations
  const isEinsteinRVEnabled = !hideRecentlyViewedPDP && !hideRecommendations

  const showRecommendationInNavLink = useMemo(() => {
    const isRecommendationEnabledonPDP =
      hideYmalOnPDP !== 'true' || hideRecentlyViewedPDP !== 'true'
    const isEinsteinRecommendationEnabledOnPDP =
      isRecommendationEnabledonPDP && isEinsteinRecomEnabled && isEinsteinRecomEnabledPDP
    const isCertonaDataExists =
      Boolean(ymalScheme?.items?.length) && ymalScheme?.display?.toLowerCase() !== 'no'
    return (
      isEinsteinRecommendationEnabledOnPDP ||
      (!hideRecommendations && isRecommendationEnabledonPDP && isCertonaDataExists)
    )
  }, [ymalScheme])

  const isWyngEnabledOnPDP = useMemo(() => {
    return Boolean(
      wyngPreferences?.enableWyng && wyngPreferences?.isEnableWyngOnPdpPage && masterId
    )
  }, [wyngPreferences, masterId])

  const navlinks = [
    {
      elementId: 'closerlook-section',
      title: formatMessage({
        id: `pdp.navlink.closerlook${subBrandSuffix}`,
        defaultMessage: 'A CLOSER LOOK',
      }),
      isEnable: closerLookProps.isCloserLookEnable,
    },
    {
      elementId: 'impact',
      title: formatMessage({
        id: `pdp.navlink.impact${subBrandSuffix}`,
        defaultMessage: 'Impact',
      }),
      isEnable: showEnvImpactSlides,
    },
    {
      elementId: 'product-info',
      title: formatMessage({
        id: `pdp.navlink.productInfo${subBrandSuffix}`,
        defaultMessage: 'PRODUCT INFO',
      }),
      isEnable: true,
    },
    {
      elementId: 'sustainability-section',
      title: formatMessage({
        id: `pdp.navlink.sustainability${subBrandSuffix}`,
        defaultMessage: 'SUSTAINABILITY',
      }),
      isEnable: Boolean(
        isSustainabilityModuleEnabled &&
          sustainabilityProps.sustainableHeaderContent &&
          sustainabilityProps.sustainabilityIconsData?.length
      ),
    },
    {
      elementId: 'recommendations-section',
      title: formatMessage({
        id: `pdp.navlink.recommendations${subBrandSuffix}`,
        defaultMessage: 'RECOMMENDATIONS',
      }),
      isEnable: showRecommendationInNavLink,
    },
    {
      elementId: 'social-section',
      title: formatMessage({ id: `pdp.navlink.social${subBrandSuffix}`, defaultMessage: 'SOCIAL' }),
      isEnable: isWyngEnabledOnPDP,
    },
    {
      elementId: 'ratings-review-section',
      title: formatMessage({
        id: `pdp.navlink.reviews${subBrandSuffix}`,
        defaultMessage: 'REVIEWS',
      }),
      isEnable: enableEmplifi && !isBundleProduct && !apploading && !isHideReview,
    },
  ]

  return (
    <>
      {isReviewSectionUnderProductImage &&
        isMobile &&
        !isBundleProduct &&
        !apploading &&
        !isHideReview && <RatingsAndReviews {...ratingsAndReviews} />}
      {!!pdpStickyNav && (
        <StickyAnchorLinkNav
          navlinks={navlinks}
          productId={get(productDetailsProps, 'productData.selectedVariantGroupId', masterId)}
        />
      )}
      {closerLookProps.isCloserLookEnable && <CloserLookArea {...closerLookProps} />}

      {showEnvImpactSlides && (
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
      {isMobile && (
        <Box p="mar" display="inherit" sx={styles.mobileMainContainer}>
          <Flex w="100%" sx={styles.productDetailsWrapper}>
            <ProductDetails {...productDetailsProps} />
          </Flex>
          {!isDiscontinued && hasMounted && (
            <Flex w="100%" flexWrap="wrap">
              <SocialMediaArea {...SocialMediaAreaProps} />
            </Flex>
          )}
          {PaymentLogosProps?.isPaymentLogosEnabledOnPDP && (
            <CustomSlot content={PaymentLogosProps?.paymentData} Component={PaymentLogos} />
          )}
        </Box>
      )}

      {sustainabilityProps.isSustainabilityModuleEnabled && (
        <SustainableExperienceSlider {...sustainabilityProps} />
      )}

      {!isBundleProduct && <ContentAreaOne {...contentAreaOne} />}

      {isAnyRecommendationsEnabled && (
        <CertonaRecommendationsYMAL
          siteId={siteId}
          ymalScheme={ymalScheme}
          apploading={apploading}
          hideYmalPrice={hideYmalPrice}
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
        />
      )}

      {!isBundleProduct && <ContentAreaTwo {...contentAreaTwo} />}

      {!hideRecommendations && hideRecentlyViewedPDP !== 'true' && (
        <RecentlyViewed
          siteId={siteId}
          apploading={apploading}
          hideYmalPrice={hideYmalPrice}
          recentlyViewedScheme={recentlyViewedScheme}
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
        />
      )}

      <UGCContainer {...ugc} />
      <FAQComponent />
      {!isReviewSectionUnderProductImage &&
        !isBundleProduct &&
        !apploading &&
        !isHideReview &&
        enableEmplifi && <RatingsAndReviews {...ratingsAndReviews} />}

      {isDesktop && <hr />}

      {!isBundleProduct && <ContentAreaThree {...contentAreaThree} />}
    </>
  )
}

const RecentlyViewed = ({ siteId, hideYmalPrice, recentlyViewedScheme, apploading }) => {
  const carouselKeyState = useAtomValue(carouselKeyStateAtom)
  const { formatMessage } = useIntl()

  const certonaWrapper = useCallback(
    ({ children }) => (
      <div id="recommendations-section" key={`${carouselKeyState + 'recently-viewed'}`}>
        {children}
      </div>
    ),
    [carouselKeyState]
  )

  return (
    <CertonaRecommendations
      siteId={siteId}
      type="recentlyviewed"
      isloading={apploading}
      hidePrice={hideYmalPrice}
      certonaData={recentlyViewedScheme}
      wrapperComponent={certonaWrapper}
      label={
        recentlyViewedScheme?.explanation ||
        formatMessage({ id: 'pdp.product.recentlyViewed', defaultMessage: 'Recently viewed' })
      }
    />
  )
}

const CertonaRecommendationsYMAL = ({ siteId, ymalScheme, apploading, hideYmalPrice }) => {
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
    <CertonaRecommendations
      type="yaml"
      siteId={siteId}
      isloading={apploading}
      certonaData={ymalScheme}
      hidePrice={hideYmalPrice}
      wrapperComponent={certonaWrapper}
      label={
        ymalScheme?.explanation ||
        formatMessage({ id: 'pdp.product.youMayLike', defaultMessage: 'You may also like' })
      }
    />
  )
}

export default memo(AdditionalDetails)
