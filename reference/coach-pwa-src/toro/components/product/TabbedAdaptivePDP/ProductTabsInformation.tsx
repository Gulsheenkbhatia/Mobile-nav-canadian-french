import { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Tab from 'toro/components/Tab'
import TabList from 'toro/components/TabList'
import TabPanel from 'toro/components/TabPanel'
import TabPanels from 'toro/components/TabPanels'
import Tabs from 'toro/components/Tabs'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import TabbedPDPProductDetails from 'toro/components/ProductDetails/TabbedPDPProductDetails'
import usePreference from 'toro/hooks/usePreference_new'
import { useIntl } from 'react-intl'
import get from 'lodash/get'
import has from 'lodash/has'
import useStickyElementTopPosition from 'toro/hooks/useStickyElementTopPosition'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useAtom } from 'jotai'
import {
  activeTabIndexAtom,
  setActiveTabIndexAtom,
  setReviewSectionNodeAtom,
  scrollToReview42Atom,
  metaProductsAtom,
} from 'store/pdp.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import { TABBED_REVIEWS_TAB_INDEX } from 'toro/constants/adaptiveExperience'
import useNewActiveTabIndex from 'toro/hooks/useNewActiveTabIndex'
import { AdditionalDetailsIcon, CaretDownIcon } from 'toro/icons'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import { Collapse } from '@chakra-ui/react'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import useProductData from 'toro/hooks/useProductData'
import ProductCompareTool from 'lib/vendorProductsAdapter/features/ProductCompareTool'

const TabbedPDPRatingAndReview = dynamic(
  () => import('toro/components/product/RatingsAndReviews/TabbedPDPRatingAndReview'),
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

interface ProductTabsInformationProps {
  ratingsAndReviews: any
  certona: any
  productDetailsProps: any
  siteId: string
  shouldDisplayReviews: boolean
  hideYmalPrice: boolean
  renderEinsteinGrid: boolean
  v4GridRecommender: any
  RecommendationsYMAL: any
  isCompareToolEnable: boolean
}

const ProductTabsInformation: React.FC<ProductTabsInformationProps> = ({
  ratingsAndReviews,
  certona,
  productDetailsProps,
  siteId,
  shouldDisplayReviews,
  hideYmalPrice,
  renderEinsteinGrid,
  v4GridRecommender,
  RecommendationsYMAL,
  isCompareToolEnable,
}) => {
  const { formatMessage } = useIntl()
  const adaptiveTabbedStyles = useMultiStyleConfig('TabbedAdaptivePDP') as any
  const tabsRef = useRef<HTMLDivElement>(null)
  const setReviewSectionNode = useUpdateAtom(setReviewSectionNodeAtom)
  const activeTabIndex = useAtomValue(activeTabIndexAtom)
  const setActiveTabIndex = useUpdateAtom(setActiveTabIndexAtom)
  const analytics = useAnalytics()
  const [isViewedMore, setIsViewedMore] = useState(false)
  const isCollapsibleExperimentEnabled = useExperiment(EXPERIMENTS.SHOW_COLLAPSIBLE_PRODUCT_INFO)
  const [shouldScrollToReviews, setShouldScrollToReviews] = useAtom(scrollToReview42Atom)
  const metaProducts = useAtomValue(metaProductsAtom)
  const masterId = useProductData('masterId')
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)

  const isPDPLoaded = has(productDetailsProps, 'productData.variant')
  const selectedVariantGroupId = get(productDetailsProps, 'productData.selectedVariantGroupId')
  const productId = selectedVariantGroupId || masterId

  const {
    toggleSiteFeatures: { enableOOSExperience, viewMorePDP },
  } = usePreference({
    ToggleSiteFeatures: ['enableOOSExperience', 'viewMorePDP'],
  })

  const { hybridSocialScheme, metaLanderScheme } = certona || {}
  const tabbedRecommenderScheme = metaProducts.isMetaTest ? metaLanderScheme : hybridSocialScheme
  const isRenderYmalGridEnabled =
    Boolean(tabbedRecommenderScheme?.items?.length) &&
    tabbedRecommenderScheme?.display?.toLowerCase() !== 'no'

  const shouldBeCollapsible = isCollapsibleExperimentEnabled && viewMorePDP

  const { stickyTopPosition } = useStickyElementTopPosition()

  const stickyTabListStyles = useMemo(() => {
    return {
      ...adaptiveTabbedStyles.tabList,
      top: `${stickyTopPosition}px`,
    }
  }, [stickyTopPosition])

  const newTabIndex = useNewActiveTabIndex({
    orderable: productDetailsProps?.variantData?.orderable,
  })

  useEffect(() => {
    if (enableOOSExperience) {
      setActiveTabIndex(newTabIndex)
    }
  }, [enableOOSExperience, newTabIndex])

  const handleViewMoreButtonOnClick = () => {
    setIsViewedMore(true)
    analytics.send('productInteraction', {
      eventAction: 'view more details click',
      eventLabel: productId,
      eventLocationForced: 'product',
    })
  }

  const tabbedAdaptiveProductDetails = (
    <>
      <ConditionalWrapper
        condition={shouldBeCollapsible}
        Wrapper={Collapse}
        startingHeight="262px"
        in={isViewedMore}
      >
        <TabbedPDPProductDetails {...productDetailsProps} variant="adaptiveTabbedPDP" />
      </ConditionalWrapper>
      {shouldBeCollapsible && !isViewedMore && (
        <Flex justifyContent="center" flexDirection="column">
          <Box sx={adaptiveTabbedStyles.gradient} />
          <Button onClick={handleViewMoreButtonOnClick} sx={adaptiveTabbedStyles.viewMoreButton}>
            {'View More'}
            <CaretDownIcon width="24" height="24" />
          </Button>
        </Flex>
      )}
    </>
  )

  const tabs = [
    {
      elementId: 'product-info',
      title: formatMessage({ id: 'pdp.product.details', defaultMessage: 'Details' }),
      content: tabbedAdaptiveProductDetails,
      qaAttribute: 'product_details_tab',
    },
    {
      elementId: 'ratings-review-section',
      title: formatMessage({ id: 'pdp.product.reviews', defaultMessage: 'Reviews' }),
      isDisabled: !shouldDisplayReviews,
      content: (
        <Box id="ratings-review-section">
          <TabbedPDPRatingAndReview
            {...ratingsAndReviews}
            variant="adaptiveTabbedPDP"
            isActive={activeTabIndex === TABBED_REVIEWS_TAB_INDEX}
          />
        </Box>
      ),
      qaAttribute: 'product_reviews_tab',
    },
    {
      elementId: 'recommendations-section',
      title: formatMessage({ id: 'pdp.product.foryou', defaultMessage: 'For You' }),
      icon: <AdditionalDetailsIcon height="16px" width="16px" />,
      isDisabled: renderEinsteinGrid ? !renderEinsteinGrid : !isRenderYmalGridEnabled,
      content: (
        <>
          {!isPdpV42Enabled && isCompareToolEnable ? (
            <ProductCompareTool type="product5_rr" productDetailsProps={productDetailsProps} />
          ) : (
            isRenderYmalGridEnabled && (
              <div id="recommendations-section" className="certona_wrapper">
                <RecommendationsYMAL
                  certonaData={tabbedRecommenderScheme}
                  hidePrice={hideYmalPrice}
                  type="product3_rr"
                  variant="similarProductRecommendationAdaptivePDP"
                  productId={productId}
                  hideWishlist={metaProducts?.enabled}
                  hideLabel={true}
                  label={formatMessage({ id: 'pdp.product.foryou', defaultMessage: 'For You' })}
                  isRenderRecentlyViewed={false}
                />
              </div>
            )
          )}
          {renderEinsteinGrid && (
            <EinsteinRecommendationWrapper
              pageType="PDP"
              siteId={siteId}
              recommenderData={v4GridRecommender}
              productId={productId}
              triggerPageViewImpression={isPDPLoaded}
              type="grid"
              label={formatMessage({
                id: 'pdp.product.foryou',
                defaultMessage: `${v4GridRecommender?.recommenderName}`,
              })}
              scheme="product1_rr"
              variant="pdpV4EinsteinRecommendationMobileGrid"
            />
          )}
        </>
      ),
      qaAttribute: 'for_you_section',
    },
  ]

  const onChangeTab = useCallback(
    (tabIndex, ratingClicked?) => {
      setActiveTabIndex(tabIndex)
      const elementOffset = tabsRef?.current?.offsetTop

      if (!ratingClicked) {
        analytics.send(
          'productInteraction',
          {
            eventAction: `tabbed nav click:${tabs[tabIndex].title.toLowerCase()}`,
            eventLabel: get(productDetailsProps, 'productData.selectedVariantGroupId') || masterId,
            eventLocation: 'product',
          },
          true
        )
      }

      if (elementOffset > 0) {
        setTimeout(() => {
          // this is the image container size, which is 125vw.
          const imageContainerSize = window.innerWidth * 1.25
          window.scroll({
            top: imageContainerSize + elementOffset - stickyTopPosition,
            behavior: 'smooth',
          })
        })
      }
    },
    [stickyTopPosition, tabs, analytics, setActiveTabIndex, productDetailsProps, masterId]
  )

  const tabsRefUpdate = useCallback(
    (ref) => {
      if (ref) {
        setReviewSectionNode(ref)
        tabsRef.current = ref
      }
    },
    [setReviewSectionNode]
  )

  useEffect(() => {
    if (shouldScrollToReviews) {
      onChangeTab(1, true)
      setShouldScrollToReviews(false)
    }
  }, [shouldScrollToReviews, onChangeTab, setShouldScrollToReviews])

  if (!metaProducts?.enabled && (isPdpV41Enabled || isPdpV42Enabled)) {
    return (
      <Box px="12px" mt="54px">
        <Box sx={adaptiveTabbedStyles.productDetailsTitle}>
          {formatMessage({
            id: 'pdp.product.productDetail.title',
            defaultMessage: 'Product Details',
          })}
        </Box>
        <Box className="tabbed-product-details">{tabbedAdaptiveProductDetails}</Box>
      </Box>
    )
  }

  return (
    <Tabs
      id="product-tabs"
      index={activeTabIndex}
      ref={tabsRefUpdate}
      isFitted
      onChange={onChangeTab}
      sx={adaptiveTabbedStyles.tabs}
    >
      <TabList sx={stickyTabListStyles} data-qa="tabbed_PDP">
        {tabs.map((tab, index) =>
          !tab.isDisabled ? (
            <Tab
              sx={adaptiveTabbedStyles.tab}
              key={tab.elementId}
              data-qa={tab.qaAttribute}
              className={activeTabIndex === index ? 'active' : ''}
            >
              {tab.icon ? (
                <div style={adaptiveTabbedStyles.titleWithIcon}>
                  {tab.icon} {tab.title}
                </div>
              ) : (
                tab.title
              )}
            </Tab>
          ) : null
        )}
      </TabList>
      <TabPanels>
        {tabs.map((tab) =>
          !tab.isDisabled ? (
            <TabPanel sx={adaptiveTabbedStyles.tabPanel} key={tab.elementId}>
              {tab.content}
            </TabPanel>
          ) : null
        )}
      </TabPanels>
    </Tabs>
  )
}

export default ProductTabsInformation
