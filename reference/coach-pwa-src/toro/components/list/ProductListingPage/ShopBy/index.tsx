import get from 'lodash/get'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import isEmpty from 'lodash/isEmpty'
import { useIntl } from 'react-intl'
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { useState, useEffect, useMemo, useContext, useRef } from 'react'
import PWAContext from 'components/common/PWAContext'
import Box from 'toro/components/Box'
import Lazy from 'toro/components/Lazy'
import BackToTopButton from 'toro/components/BackToTopButton'
import SearchResultsText from 'toro/components/SearchResultsText'
import ZeroProductsPage from 'toro/components/list/ZeroProductsPage'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useVerticalScrollDirection from 'toro/hooks/useVerticalScrollDirection'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import { activeFiltersAtom, pageTitleAtom, seoDataAtom } from 'store/search-results.atom'
import { getPageTitleWithFilters } from 'toro/helpers/metaTags'
import usePageTitle from 'toro/hooks/usePageTitle'
import { PLP_V3_BREADCRUMB_DEFAULT_HEIGHT } from 'toro/constants/productList'
import BreadCrumb from 'toro/components/BreadcrumbPage'
import useMonetateTrack from 'toro/hooks/useMonetateTrack'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import SEOMarkup from 'toro/components/list/SEOMarkup'
import ContentSlot from 'toro/cms/components/ContentSlot'
import MainContainer from 'toro/components/MainContainer'
import Center from 'toro/components/Center'
import {
  isCompletePlpV3DesktopAtom,
  isPlpV3Atom,
  isShopByBrowseAllEnabledAtom,
} from 'store/plp.atom'
import ShopByBrowseAll from 'toro/components/list/ProductListingPage/ShopBy/ShopByBrowseAll'
import ShopByBrowseByCategories from 'toro/components/list/ProductListingPage/ShopBy/ShopByBrowseByCategories'
import ShopByBrowseToggle from 'toro/components/list/ProductListingPage/ShopBy/ShopByBrowseToggle'
import ShopByWayfinding from 'toro/components/list/ProductListingPage/ShopBy/ShopByWayfinding'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import RecommendedCategoriesWrapper from 'toro/components/product/RecommendedCategories'
import DynamicSubNavigation from 'toro/components/DynamicSubNavigation'
import HtmlContent from 'toro/components/HtmlContent'
import UGCContainer from 'toro/components/UGC/UGCContainer'
import ShopByBrowseByCategoriesFilters from 'toro/components/list/ProductListingPage/ShopBy/ShopByBrowseByCategoriesFilters'
import RVRecommendationsCarouselContainer from 'toro/components/RecentlyViewedCarousel/RVRecommendationsCarouselContainer'
import MobileTopArea from 'toro/components/list/MobileTopArea'
import useViewportType from 'toro/hooks/useViewportType'
import HorizontalFiltersBar from 'toro/components/list/HorizontalFiltersBar'
import CustomSlot from 'toro/cms/components/CustomSlot'
import CategoryTopContentSlot from 'toro/components/list/CategoryTopContentSlot'
import NotifyMePopUp from 'toro/components/product/NotifyMeWidget'
import CategoryBottomContentSlot from 'toro/components/list/CategoryBottomContentSlot'

const SearchWidget = dynamic(() => import('toro/components/SearchWidget'), {
  ssr: false,
})

const getPageTitle = ({ pageData, pageTitle = '', title = '', brand = '', formatMessage }) => {
  const seoFacetPageTitle = get(pageData, 'seoFacetMetaTags.metaTitle', '')
  if (seoFacetPageTitle) return seoFacetPageTitle
  const currentPageTitle = get(pageData, 'currentPageTitle', '')
  if (currentPageTitle) return currentPageTitle

  const modifiedBrand = /®$/.test(brand) ? brand.toUpperCase() : `${brand}®`.toUpperCase()

  return pageData.filters?.length > 2 || pageData.filters?.length === 0
    ? pageTitle.replace('<facet-placeholder> ', '')
    : formatMessage(
        { id: 'plp.seo.facetPageTitle', defaultMessage: '{title} | {brand}' },
        { title, brand: modifiedBrand }
      )
}

function ShopByProductListingPage({ pageData = {}, loading }: { pageData: any; loading: boolean }) {
  const { formatMessage } = useIntl()
  const { appData } = useContext(PWAContext)
  const total = get(pageData, 'total')
  const { hasTopDirectionScroll } = useVerticalScrollDirection()
  const [, setStickyHeight] = useState(0)
  const [subNavHeight] = useState(0)
  const bannerHeight = 0
  const headingTextRef = useRef(null)
  const breadCrumbNode = useRef(null)
  const topBannerNode = useRef(null)
  const filters = get(pageData, 'filters', [])
  const brand = get(appData, 'brand', '')
  const categoryId = get(pageData, 'id', '')
  const shopByToggle = get(pageData, 'shopByToggle', {})
  const [isViewAll, setIsViewAll] = useAtom(isShopByBrowseAllEnabledAtom)
  const exposedFilterConfigs = get(pageData, 'exposedFilterConfigs')
  const { breadcrumbs, name, suggestionPhrase, preloadImageSrc, topContentSlot } = pageData
  const pageTitle = useAtomValue(pageTitleAtom)
  const subNavigationData = get(pageData, 'subNavigationData', [])
  const sections = get(pageData, 'sections', [])
  const recommendedCategoriesOnPLP = get(pageData, 'recommendedCategoriesOnPLP.categories')
  const wayfinding = get(pageData, 'wayfinding')
  const activeFilters = useAtomValue(activeFiltersAtom)
  const isInitialRender = useRef(true)
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const [rvHeight, setRVHeight] = useState(0)
  const { isMobile } = useViewportType()
  const showTopBanner = !!topContentSlot?.content?.content && !loading

  const rvCarouselNodeSetter = (node) => {
    if (node?.getHeight) {
      setRVHeight(node.getHeight() || 0)
    }
  }

  const styles = useMultiStyleConfig('ShopByProductListingPage')

  const { contentUpdated, onClick: onCmsClick } = useCmsAnalytics(topBannerNode)

  const products = useMemo(
    () =>
      sections.reduce((acc, curr) => {
        const { products = [] } = curr
        acc.push(...products)
        return acc
      }, []),
    [sections]
  )
  const alternateH1Tag = get(pageData, 'alternateH1Tag', '') // from SAPI, not SFCC category data
  const bottomContentSlotData = get(pageData, 'bottomContentSlotData', {})
  const { assetMarkup = '', bottomContentSlot = {} } = bottomContentSlotData
  const ugcContentSlotData = get(pageData, 'ugcContentSlotData', '')
  const targetRefinement = get(pageData, 'targetRefinement')
  const wyngId = get(pageData, 'wyngId', '')
  const wyngToken = get(pageData, 'wyngToken', '')
  const wyngFilterUUID = get(pageData, 'wyngFilterUUID', '')
  const pixleeAlbumID = get(pageData, 'pixleeAlbumID')
  const wyngContent =
    wyngId && wyngToken
      ? `<div class="wyng-experience" data-wyng-id="${wyngId}" data-wyng-token="${wyngToken}"></div>`
      : ''

  const title = useMemo(() => {
    const seoFacetH1 = get(pageData, 'seoFacetMetaTags.h1tags')
    if (seoFacetH1) return seoFacetH1
    const pageTitle = alternateH1Tag
      ? getPageTitleWithFilters(alternateH1Tag, pageData?.filters?.length)
      : name && name.toLowerCase()
    return pageTitle?.replace?.('<facet-placeholder> ', '')
  }, [alternateH1Tag, name])

  let titledBreadcrumbs
  let breadcrumbData = breadcrumbs
  if (pageData?.filters?.length > 0) {
    titledBreadcrumbs = breadcrumbs
    titledBreadcrumbs[titledBreadcrumbs.length - 1]['htmlValue'] = title
    breadcrumbData = titledBreadcrumbs
  }

  const pageTitleModified = useMemo(
    () =>
      getPageTitleWithFilters(
        getPageTitle({ pageData, pageTitle, title, brand, formatMessage }),
        pageData?.filters?.length
      ),
    [pageData?.currentPageTitle, pageData?.filters, pageTitle, title, brand]
  )
  const plpPageTitle = usePageTitle(pageTitleModified)

  const {
    toggleSiteFeatures: { enableSitckyFilterSortOnPLP: isStickyFilterEnabled },
    generalConfiguration: { enableNewGlobalHeader },
  } = usePreference({
    generalConfiguration: ['enableNewGlobalHeader'],
    ToggleSiteFeatures: ['enableSitckyFilterSortOnPLP'],
  })

  const { stickyHeaderHeight, isStickyOrSlidingHeader } = useHeaderPositionPref()
  const { isHeaderHeight: headerHeight } = useHeadroomAtom()
  const seoContent = useAtomValue(seoDataAtom)
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  const shouldShowTopBanner = !isMobile && isViewAll && showTopBanner

  // Moved the Monetate hook up here from ShopByProductsResults.
  useMonetateTrack({
    isEnabled: true,
    pageType: pageData.pageType,
    products: products
      .filter((product) => product.masterId)
      .map((product) => ({ productId: product.masterId })),
  })

  useEffect(() => {
    if (isStickyFilterEnabled) {
      const breadCrumbPosition = breadCrumbNode?.current?.getBoundingClientRect()?.bottom
      const headerTextPosition = headingTextRef?.current?.getBoundingClientRect()?.bottom
      const breadcrumbHeight = PLP_V3_BREADCRUMB_DEFAULT_HEIGHT
      const plpHeaderHight = enableNewGlobalHeader ? headerTextPosition - breadCrumbPosition : 0
      let totalHeight = Math.floor(
        breadcrumbHeight - bannerHeight - rvHeight - subNavHeight - plpHeaderHight - headerHeight
      )
      if (isStickyOrSlidingHeader) {
        totalHeight = totalHeight + stickyHeaderHeight
      }
      setStickyHeight(totalHeight)
    }
  }, [
    categoryId,
    headerHeight,
    stickyHeaderHeight,
    hasTopDirectionScroll,
    isStickyFilterEnabled,
    subNavHeight,
    bannerHeight,
    rvHeight,
  ])

  useEffect(() => {
    if (isViewAll) {
      contentUpdated()
    }
  }, [isViewAll])

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [isViewAll])

  const isShopByFilterActive = useMemo(() => {
    return activeFilters.some((filter) => filter.id === targetRefinement.id)
  }, [activeFilters, targetRefinement.id])

  /**
   * Handles the active view state based on active refinements when toggle tabs are hidden.
   * When shop by toggle is disabled, this automatically sets the view to "Browse All"
   * if there is an active filter matching the target refinement category.
   */
  useEffect(() => {
    if (!shopByToggle.enabled) {
      setIsViewAll(isShopByFilterActive)
    }
  }, [shopByToggle.enabled, isShopByFilterActive])

  const ShopByListing = isViewAll ? ShopByBrowseAll : ShopByBrowseByCategories

  const ShopByHeader = () => {
    return (
      <>
        {shouldShowTopBanner && isCompletePlpV3Desktop && (
          <Box ref={topBannerNode} onClick={onCmsClick} sx={styles.topBannerContainer}>
            <CustomSlot
              content={topContentSlot}
              Component={CategoryTopContentSlot}
              ignoreHidden={true}
            />
          </Box>
        )}
        <MainContainer>
          <Flex sx={styles.headerContainer}>
            <Text ref={headingTextRef} sx={styles.headerText} as="h1" data-qa="d_plp_txt_hdng">
              {title}
            </Text>
            <Text sx={styles.totalText}>{total} Products</Text>
          </Flex>
        </MainContainer>
        {shouldShowTopBanner && !isCompletePlpV3Desktop && (
          <Box ref={topBannerNode} onClick={onCmsClick} sx={styles.topBannerContainer}>
            <CustomSlot
              content={topContentSlot}
              Component={CategoryTopContentSlot}
              ignoreHidden={true}
            />
          </Box>
        )}

        <Box sx={styles.contentContainer}>
          <Flex sx={styles.topActionsContainer}>
            {shopByToggle.enabled && (
              <ShopByBrowseToggle
                targetRefinement={targetRefinement}
                displayLabel={shopByToggle.label}
              />
            )}
            {!isMobile && (
              <Box sx={styles.filterContainer}>
                <HorizontalFiltersBar />
              </Box>
            )}
          </Flex>
        </Box>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{plpPageTitle}</title>
        {preloadImageSrc && (
          <link
            key="plp-preload-lcp-image"
            rel="preload"
            as="image"
            fetch-priority="high"
            href={preloadImageSrc}
          />
        )}
      </Head>
      <Box
        sx={styles.rootContainer}
        className={isPlpV3 ? 'product-search-results-plpv3 plp-v3-1' : undefined}
      >
        {isViewAll ? (
          isMobile ? (
            <MobileTopArea
              topContentSlot={topContentSlot}
              showTopBanner={showTopBanner}
              onCmsClick={onCmsClick}
              rvCarouselNodeSetter={rvCarouselNodeSetter}
              topBannerNode={topBannerNode}
            >
              <ShopByHeader />
            </MobileTopArea>
          ) : (
            <ShopByHeader />
          )
        ) : (
          <>
            {isMobile && (
              <Flex flexDirection="column">
                <RVRecommendationsCarouselContainer ref={rvCarouselNodeSetter} currentPage="PLP" />
              </Flex>
            )}
            <ShopByHeader />
            {wayfinding?.enabled && (
              <MainContainer>
                <ShopByWayfinding wayfinding={wayfinding} />
              </MainContainer>
            )}
          </>
        )}
        <Box sx={styles.contentContainer}>
          {isViewAll && subNavigationData && !loading && (
            <DynamicSubNavigation
              categories={subNavigationData}
              variant="shopBy"
              location="plp"
              dataQa="SubNav_on_PLP"
            />
          )}
          {isMobile && (
            <ShopByBrowseByCategoriesFilters
              loading={loading}
              exposedFilterConfigs={exposedFilterConfigs}
            />
          )}
          <Box sx={styles.listingContainer} data-qa="shop_by_listing_container">
            {Boolean(filters?.length) && !products?.length ? (
              <ZeroProductsPage />
            ) : total === 0 && !products?.length && !isEmpty(pageData) ? (
              <Box width="100%">
                <SearchResultsText
                  pageData={pageData}
                  loading={false}
                  suggestionPhrase={suggestionPhrase}
                />
              </Box>
            ) : (
              <ShopByListing sections={sections} pageData={pageData} loading={loading} />
            )}
            <BackToTopButton />
            {Boolean(filters?.length) && !products?.length && (
              <Box width="100%">
                <Lazy style={{ width: '100%' }}>
                  <SearchWidget variant="footer" />
                </Lazy>
              </Box>
            )}
          </Box>
        </Box>
        {isMobile && recommendedCategoriesOnPLP && !isViewAll && (
          <Box sx={styles.recommendedCategoriesWrapper}>
            <RecommendedCategoriesWrapper
              categoryId={categoryId}
              recommendedCategoriesData={recommendedCategoriesOnPLP}
              isComparablePriceEnabledCategory={get(
                pageData,
                'isComparablePriceEnabledCategory',
                false
              )}
            />
          </Box>
        )}
        <Box
          sx={{
            ...styles.mobileBottomBreadcrumbWrapper,
            mt: recommendedCategoriesOnPLP && !isViewAll ? '0' : '28px',
          }}
        >
          <Box sx={styles.mobileBreadcrumbContainer} id="breadcrumb-container">
            <BreadCrumb sx={styles.mobileBreadcrumbText} breadcrumbData={breadcrumbData} />
          </Box>
        </Box>
        <NotifyMePopUp />
        {!isMobile && !isEmpty(seoContent) && (
          <MainContainer w="100%" fullWidth={isCompletePlpV3Desktop}>
            <Center w="100%">
              <ContentSlot content={seoContent} Component={SEOMarkup} variant="plpV3" />
            </Center>
          </MainContainer>
        )}
        {!isMobile && bottomContentSlot?.content?.content && (
          <CategoryBottomContentSlot
            content={bottomContentSlot?.content?.content}
            styles={styles}
            hasVideo={bottomContentSlot?.content?.hasVideo || false}
          />
        )}
        {isMobile && bottomContentSlot?.content?.content && (
          <Lazy>
            <MainContainer sx={styles.bottomContentSlotWrapper} onClick={onCmsClick}>
              <HtmlContent content={bottomContentSlot?.content?.content} w="100%" />
            </MainContainer>
          </Lazy>
        )}
        {assetMarkup && (
          <Lazy>
            <MainContainer w="100%" onClick={onCmsClick} fullWidth={isCompletePlpV3Desktop}>
              <HtmlContent content={assetMarkup} w="100%" />
            </MainContainer>
          </Lazy>
        )}
        {((isMobile && !isEmpty(ugcContentSlotData)) || !isEmpty(wyngContent)) && (
          <UGCContainer
            pageType="plp"
            content={ugcContentSlotData || wyngContent}
            categoryWyngFilterUUID={wyngFilterUUID}
            pixleeAlbumID={pixleeAlbumID}
          />
        )}
        {isMobile && !isEmpty(seoContent) && (
          <MainContainer sx={styles.seoContainer}>
            <Center w="100%">
              <ContentSlot content={seoContent} Component={SEOMarkup} />
            </Center>
          </MainContainer>
        )}
      </Box>
    </>
  )
}

export default ShopByProductListingPage
