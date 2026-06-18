import { useContext, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import { useIntl } from 'react-intl'
import get from 'lodash/get'
import has from 'lodash/has'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import {
  productDataAtom,
  shouldShowVisuallySimilarPdpAtom,
  setReviewSectionNodeAtom,
  metaProductsAtom,
} from 'store/pdp.atom'
import BreadcrumbPDPV3 from 'toro/components/BreadcrumbPDPV3'
import AdaptivePDPRotatingBanner from 'toro/components/product/AdaptivePDPRotatingBanner'
import CloserLookArea from 'toro/components/product/CloserLookArea'
import ContentAreaOne from 'toro/components/product/ContentArea/ContentAreaOne'
import ContentAreaTwo from 'toro/components/product/ContentArea/ContentAreaTwo'
import ContentAreaThree from 'toro/components/product/ContentArea/ContentAreaThree'
import BenefitsModule from 'toro/components/product/BenefitsModule'
import Lazy from 'toro/components/Lazy'
import EnvironmentImpactCarousel from 'toro/components/passport/EnvironmentImpactCarousel'
import {
  isSubBrandActiveAtom,
  visuallySimilarDataAtom,
  isVisuallySimilarDataInitializedAtom,
} from 'store/global.atom'
import PWAContext from 'components/common/PWAContext'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import Experiment from 'toro/components/Experiment'
import BecauseYouViewedContainer from 'toro/components/Certona/BecauseYouViewedRecommendation/pdp/BecauseYouViewedContainer'
import RecommendedCategoriesContainer from 'toro/components/product/RecommendedCategories'
import EnhancedRecommendationContainer from 'toro/components/EnhancedRecommendation/EnhancedRecommendationContainer'
import FindInStore from 'toro/components/product/FindInStore'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import { IMPRESSION_NAMES } from 'toro/constants/googleAnalytics'
import ProductTabsInformation from 'toro/components/product/TabbedAdaptivePDP/ProductTabsInformation'
import AccessorizeItSkeleton from 'toro/components/product/AccessorizeIt/AccessorizeItSkeleton'
import ProductCompareTool from 'lib/vendorProductsAdapter/features/ProductCompareTool'
import withVendorSwitch from 'toro/hocs/withVendorSwitch'

const AccessorizeIt = dynamic(() => import('toro/components/product/AccessorizeIt'), {
  loading: () => <AccessorizeItSkeleton />,
})

const TabbedPDPRatingAndReview = dynamic(
  () => import('toro/components/product/RatingsAndReviews/TabbedPDPRatingAndReview'),
  {
    ssr: false,
  }
)
const CertonaRecommendations = dynamic(() => import('toro/components/Certona/Recommendation'), {
  ssr: false,
})

const CertonaSkeleton = dynamic(() => import('toro/components/Certona/CertonaSkeleton'), {
  ssr: false,
})
const LLMRecommendations = dynamic(() => import('toro/components/LLMRecommendations'), {
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

const UGCContainer = dynamic(() => import('toro/components/UGC/UGCContainer'), {
  ssr: false,
})

const RecommendationWithMatchingExperience = withVendorSwitch(
  CertonaTabbedRecommendation,
  PDPRecommendationsTabbedContainer
)

const TabbedAdaptivePDPLower = ({
  ratingsAndReviews,
  certona,
  productDetailsProps,
  masterId,
  isHideReview,
  makeBreadcrumb,
  promotionData,
  apploading,
  ugc,
  closerLookProps,
  benefitsModuleData,
  isBundleProduct,
  contentAreaOne,
  contentAreaTwo,
  contentAreaThree,
  envImpactSlides,
  envImpactModalHeadline,
  similarProductConfigs,
  itemId,
}) => {
  const { formatMessage } = useIntl()
  const adaptiveTabbedStyles = useMultiStyleConfig('TabbedAdaptivePDP') as any
  const { isViewSimilarLlmPdpBTestEnabled } = useLLMRecommendations()
  const headerHeightMobile = useHeaderHeight()
  const visuallySimilarData = useAtomValue(visuallySimilarDataAtom)
  const isVisuallySimilarDataInitialized = useAtomValue(isVisuallySimilarDataInitializedAtom)
  const shouldShowVisuallySimilarPdp = useAtomValue(shouldShowVisuallySimilarPdpAtom)
  const setReviewSectionNode = useUpdateAtom(setReviewSectionNodeAtom)
  const reviewSectionRef = useCallback(
    (node) => {
      if (node) {
        setReviewSectionNode(node)
      }
    },
    [setReviewSectionNode]
  )
  const metaProducts = useAtomValue(metaProductsAtom)

  const shouldShowYmalWithViewSimilar =
    !isViewSimilarLlmPdpBTestEnabled ||
    (isViewSimilarLlmPdpBTestEnabled && !shouldShowVisuallySimilarPdp)

  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const {
    recommendations: {
      disableRecommendationOnPages,
      hideRecommendationPrice: hideYmalPrice,
      hideRecommendations,
      hideRecentlyViewedOnPages,
      hideRecommendationPrice,
    },
    einsteinRecommendation: einsteinRecommenderPref,
    powerReviews: { enableEmplifi = false },
    adaptiveExperience: { enableEnhancedYMALLander },
    sfraUnifiedFeatureCartridge: { sfraEnableFindInStoreV4 },
  } = usePreference({
    powerReviews: ['enableEmplifi'],
    recommendations: '*',
    adaptiveExperience: ['enableEnhancedYMALLander'],
    EinsteinRecommendation: [
      'isEinsteinRecomEnabled',
      'isEinsteinRecomEnabledPDP',
      'recommendorsList',
    ],
    'SFRA Unified Feature Cartridge': ['sfraEnableFindInStoreV4'],
  })

  const productData = useAtomValue(productDataAtom)
  const {
    selectedVariant,
    onPickUpInStoreClick,
    isFindInStorePickup,
    selectedQty,
    getGAProduct,
    shouldRenderFindInStore,
  } = useContext(ProductMainSectionBreakpointContext)
  const { appData = {} } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')

  const isPDPLoaded = has(productDetailsProps, 'productData.variant')
  const selectedVariantGroupId = get(productDetailsProps, 'productData.selectedVariantGroupId')
  const productId = selectedVariantGroupId || masterId

  const shouldDisplayReviews = enableEmplifi && !isHideReview
  const { recentlyViewedScheme, ymalScheme } = certona || {}

  const hideRecentlyViewedPDP = hideRecentlyViewedOnPages?.includes('PDP')
  const hideYmalOnPDP = disableRecommendationOnPages?.includes('PDP')
  const isEinsteinYAMLEnabled = !hideYmalOnPDP && !hideRecommendations
  const isEinsteinRVEnabled = !hideRecentlyViewedPDP && !hideRecommendations

  const [yamlRecommender, rvRecommender, v4GridRecommender] =
    einsteinRecommenderPref?.recommendorsList?.PDP || []

  const isCertonaYmalEnabled =
    Boolean(ymalScheme?.items?.length) && ymalScheme?.display?.toLowerCase() !== 'no'

  const renderEinsteinGrid =
    einsteinRecommenderPref?.isEinsteinRecomEnabled &&
    einsteinRecommenderPref?.isEinsteinRecomEnabledPDP &&
    v4GridRecommender

  const showRecentlyViewed = !hideRecommendations && hideRecentlyViewedPDP !== 'true'

  const isCompareToolEnable = useExperiment(
    `${EXPERIMENTS.COMPARISON_TOOL_EXPERIENCE}-${EXPERIMENTS.TAB_COMPARISON_TOOL_EXPERIENCE}`
  )

  const isEnhancedRecommendationExperiment = useExperiment(EXPERIMENTS.ENHANCED_RECOMMENDATION)

  const showEnvImpactSlides = Boolean(envImpactSlides?.length)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const { locale } = appData || {}
  const localeData = normalizeLocalizationContent(locale)
  const currentLocale = localeData?.locale?.replace?.('-', '_')

  return (
    <Box id="TabbedAdaptivePDPLower" sx={adaptiveTabbedStyles.lowerMainContainer}>
      <AdaptivePDPRotatingBanner
        productData={productDetailsProps?.productData}
        variantData={productDetailsProps?.variantData}
      />
      <Experiment forMobile forIDs={`${EXPERIMENTS.PDP_V4_1}-${EXPERIMENTS.PDP_V4_2}`}>
        {shouldRenderFindInStore && (
          <FindInStore
            productData={productData}
            selectedVariant={selectedVariant}
            onPickUpInStoreClick={onPickUpInStoreClick}
            isFindInStorePickup={isFindInStorePickup}
            selectedQty={selectedQty}
            getGAProduct={getGAProduct}
            lazyMinHeight={shouldShowVisuallySimilarPdp && 85}
            sfraEnableFindInStoreV4={sfraEnableFindInStoreV4} //This will be false for all sites except JP
          />
        )}
      </Experiment>
      <ProductTabsInformation
        ratingsAndReviews={ratingsAndReviews}
        certona={certona}
        productDetailsProps={productDetailsProps}
        siteId={siteId}
        shouldDisplayReviews={shouldDisplayReviews}
        hideYmalPrice={hideYmalPrice}
        renderEinsteinGrid={renderEinsteinGrid}
        v4GridRecommender={v4GridRecommender}
        RecommendationsYMAL={CertonaRecommendations}
        isCompareToolEnable={isCompareToolEnable}
      />
      <Lazy fallback={<AccessorizeItSkeleton />}>
        <AccessorizeIt />
      </Lazy>
      {isPdpV42Enabled && isCompareToolEnable && (
        <ProductCompareTool type="product5_rr" productDetailsProps={productDetailsProps} />
      )}
      {showEnvImpactSlides && isSubBrandActive && (
        <Box id="impact" sx={adaptiveTabbedStyles.envImpactCorousel}>
          <EnvironmentImpactCarousel
            impacts={envImpactSlides}
            title={envImpactModalHeadline}
            locale={currentLocale}
            rotateGlobeIcon={appData.coachtopiaRotatingGlobeV4}
            location="product"
            variant="adaptiveTabbedPDP"
          />
        </Box>
      )}
      {shouldShowVisuallySimilarPdp && (
        <div id="view-similar">
          <Box
            id="view-similar-scroll-anchor"
            position="relative"
            bottom={`${headerHeightMobile}px`}
          />
          {!isVisuallySimilarDataInitialized ? (
            <CertonaSkeleton variant="similarProductRecommendationAdaptivePDP" />
          ) : (
            <LLMRecommendations products={visuallySimilarData} />
          )}
        </div>
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
      {shouldShowYmalWithViewSimilar && (
        <>
          {isCertonaYmalEnabled &&
          isEnhancedRecommendationExperiment &&
          enableEnhancedYMALLander ? (
            <EnhancedRecommendationContainer
              recommendationData={ymalScheme}
              label={formatMessage({
                id: 'pdp.enhancedYMAL.title',
                defaultMessage: ymalScheme?.explanation,
              })}
            />
          ) : (
            <Experiment notForIDs={EXPERIMENTS.CERTONA_INLINE_RECOMMENDATION_EXPERIENCE}>
              <div id="recommendations-section-ymal">
                <CertonaRecommendations
                  certonaData={ymalScheme}
                  hidePrice={hideYmalPrice}
                  type="yaml"
                  variant="adaptiveTabbedPDP"
                  productId={
                    get(productDetailsProps, 'productData.selectedVariantGroupId') || masterId
                  }
                  isRenderRecentlyViewed={false}
                  label={
                    ymalScheme?.explanation ||
                    formatMessage({
                      id: 'pdp.product.youMayLike',
                      defaultMessage: 'You may also like',
                    })
                  }
                />
              </div>
            </Experiment>
          )}
        </>
      )}
      <BecauseYouViewedContainer />
      {isEinsteinYAMLEnabled && shouldShowYmalWithViewSimilar && (
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
          variant="pdpV4EinsteinRecommendationMobile"
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
          variant="pdpV4EinsteinRecommendationMobile"
        />
      )}
      {closerLookProps?.isCloserLookEnable && (
        <CloserLookArea {...closerLookProps} variant="adaptiveTabbedPDP" />
      )}
      <BenefitsModule {...benefitsModuleData} variant="adaptiveTabbedPDP" />
      {showRecentlyViewed && (
        <div id="recommendations-section">
          <CertonaRecommendations
            certonaData={recentlyViewedScheme}
            hidePrice={hideYmalPrice}
            label={
              recentlyViewedScheme?.explanation ||
              formatMessage({ id: 'pdp.product.recentlyViewed', defaultMessage: 'Recently viewed' })
            }
            type="recentlyviewed"
            impressionName={IMPRESSION_NAMES[recentlyViewedScheme?.scheme]}
            variant="adaptiveTabbedPDP"
          />
        </div>
      )}
      <Box id="just-for-you">
        <UGCContainer {...ugc} variant="adaptiveTabbedPDP" />
      </Box>
      {!isBundleProduct && (
        <Box sx={adaptiveTabbedStyles.contentAreaContainer}>
          <ContentAreaOne {...contentAreaOne} />
          <ContentAreaTwo {...contentAreaTwo} />
          <ContentAreaThree {...contentAreaThree} />
        </Box>
      )}
      <RecommendedCategoriesContainer
        categoryId={get(productDetailsProps, 'productData.parentCategoryId')}
      />
      {shouldDisplayReviews && (
        <Box
          ref={metaProducts?.enabled ? null : reviewSectionRef}
          sx={adaptiveTabbedStyles.reviewSection}
        >
          <Lazy>
            <TabbedPDPRatingAndReview {...ratingsAndReviews} variant="tabbedPDPReviewList" />
          </Lazy>
        </Box>
      )}
      <Box className="content-divider"></Box>
      <BreadcrumbPDPV3
        dataFromPLP={makeBreadcrumb(promotionData)}
        data={productDetailsProps?.productData?.breadcrumbs}
        apploading={apploading}
        variant={'TabbedPDPBreadcrumb'}
      />
    </Box>
  )
}

export default TabbedAdaptivePDPLower
